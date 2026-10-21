// Parses AND renders every ```mermaid block of the documentation in headless Chromium.
// Why render and not only parse: a Gantt task name containing ":" parses fine but fails at render time.
//
// Setup (outside the repo, nothing is installed globally):
//   mkdir -p "$TMPDIR/mm" && cd "$TMPDIR/mm" && npm init -y && npm install mermaid@11.4.1 playwright-core@1.49.1
// Usage:
//   MERMAID_DIR="$TMPDIR/mm" CHROMIUM=/opt/pw-browsers/chromium node scripts/validate-mermaid.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const mermaidDir = process.env.MERMAID_DIR;
if (!mermaidDir) {
  console.error('Set MERMAID_DIR to the folder where mermaid and playwright-core were installed.');
  process.exit(2);
}
const require = createRequire(path.join(mermaidDir, 'package.json'));
const { chromium } = require('playwright-core');
const mermaidJs = fs.readFileSync(path.join(mermaidDir, 'node_modules/mermaid/dist/mermaid.min.js'), 'utf8');

const docsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md')).sort();

const blocks = [];
for (const f of files) {
  let inBlock = false;
  let buf = [];
  let start = 0;
  let n = 0;
  fs.readFileSync(path.join(docsDir, f), 'utf8').split('\n').forEach((line, i) => {
    if (!inBlock && line.startsWith('```mermaid')) {
      inBlock = true;
      buf = [];
      start = i + 1;
    } else if (inBlock && line.startsWith('```')) {
      inBlock = false;
      n += 1;
      blocks.push({ file: f, idx: n, line: start, src: buf.join('\n') });
    } else if (inBlock) {
      buf.push(line);
    }
  });
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');
await page.addScriptTag({ content: mermaidJs });
await page.evaluate(() => mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' }));

let failed = 0;
for (const b of blocks) {
  const error = await page.evaluate(async (src) => {
    try {
      await mermaid.parse(src);
      const out = await mermaid.render('g' + Math.random().toString(36).slice(2), src);
      return out.svg && !/Syntax error/i.test(out.svg) ? null : 'render produced an error diagram';
    } catch (e) {
      return String(e.message || e).split('\n').slice(0, 4).join(' | ');
    }
  }, b.src);
  if (error) {
    failed += 1;
    console.log(`FAIL ${b.file} block #${b.idx} (line ${b.line}): ${error}`);
  }
}
console.log(`checked ${blocks.length} blocks, ${failed} failed`);
await browser.close();
process.exit(failed ? 1 : 0);
