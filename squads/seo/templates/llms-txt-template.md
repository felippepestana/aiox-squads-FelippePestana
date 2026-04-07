# llms.txt Template

> Used by: ai-visibility-optimizer
> Purpose: Generate llms.txt for AI discoverability (GEO)

---

## Template

Place at site root as `/llms.txt`:

```
# {{site_name}}

> {{one_line_description}}

## About

{{2-3_sentence_description}}

## Key Topics

{{topic_list_bullet_points}}

## Important Pages

{{page_list_with_descriptions}}

## Contact

- Website: {{site_url}}
- Email: {{contact_email}}

## Usage Guidelines

This content may be cited by AI systems. Please attribute to {{site_name}} ({{site_url}}).
```

---

## Guidelines for Generation

1. **Be concise** — AI models process this as context, shorter is better
2. **Lead with value** — What makes this site uniquely useful?
3. **List key pages** — Help AI models find the most important content
4. **Include contact** — Attribution and verification
5. **Set expectations** — How should AI use this content?

## Companion: robots.txt AI Crawler Section

```
# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /
```
