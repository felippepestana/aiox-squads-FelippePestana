#!/usr/bin/env node
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function createIcon(size) {
  const BG = [22, 163, 74]; // #16a34a (verde Legendários)
  const CROSS = [255, 255, 255];
  const cx = size / 2, cy = size / 2;
  const r = size * 0.46;
  const cw = Math.round(size * 0.14);
  const cl = Math.round(size * 0.52);

  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    row[0] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy;
      const inCircle = Math.sqrt(dx*dx + dy*dy) <= r;
      const inCross = inCircle && (
        (Math.abs(dx) <= cw/2 && Math.abs(dy) <= cl/2) ||
        (Math.abs(dy) <= cw/2 && Math.abs(dx) <= cl/2)
      );
      const color = !inCircle ? [255,255,255] : inCross ? CROSS : BG;
      const px = 1 + x * 3;
      row[px] = color[0]; row[px+1] = color[1]; row[px+2] = color[2];
    }
    rows.push(row);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2;

  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(Buffer.concat(rows), { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const pub = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pub, 'icon-192.png'), createIcon(192));
fs.writeFileSync(path.join(pub, 'icon-512.png'), createIcon(512));
console.log('✓ icon-192.png e icon-512.png gerados');
