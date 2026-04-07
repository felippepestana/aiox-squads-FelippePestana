# JSON-LD Schema Templates

> Used by: schema-architect
> Purpose: Ready-to-use JSON-LD templates for common page types

---

## Organization (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "{{site_url}}#organization",
  "name": "{{org_name}}",
  "url": "{{site_url}}",
  "logo": {
    "@type": "ImageObject",
    "url": "{{logo_url}}",
    "width": 600,
    "height": 60
  },
  "sameAs": [
    "{{social_twitter}}",
    "{{social_linkedin}}",
    "{{social_github}}"
  ]
}
```

## WebSite (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "{{site_url}}#website",
  "name": "{{site_name}}",
  "url": "{{site_url}}",
  "publisher": {"@id": "{{site_url}}#organization"},
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{site_url}}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## Article / Blog Post

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{title}}",
  "description": "{{description}}",
  "image": "{{featured_image}}",
  "author": {
    "@type": "Person",
    "name": "{{author_name}}",
    "url": "{{author_url}}"
  },
  "publisher": {"@id": "{{site_url}}#organization"},
  "datePublished": "{{date_published}}",
  "dateModified": "{{date_modified}}",
  "mainEntityOfPage": "{{page_url}}"
}
```

## BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{site_url}}"},
    {"@type": "ListItem", "position": 2, "name": "{{section}}", "item": "{{section_url}}"},
    {"@type": "ListItem", "position": 3, "name": "{{page_title}}"}
  ]
}
```

## FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{question_1}}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{answer_1}}"
      }
    }
  ]
}
```

## Product (E-commerce)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{product_name}}",
  "image": "{{product_image}}",
  "description": "{{product_description}}",
  "brand": {"@type": "Brand", "name": "{{brand_name}}"},
  "offers": {
    "@type": "Offer",
    "price": "{{price}}",
    "priceCurrency": "{{currency|BRL}}",
    "availability": "https://schema.org/InStock",
    "url": "{{product_url}}"
  }
}
```

## LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{{business_name}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{street}}",
    "addressLocality": "{{city}}",
    "addressRegion": "{{state}}",
    "postalCode": "{{zip}}",
    "addressCountry": "{{country|BR}}"
  },
  "telephone": "{{phone}}",
  "openingHours": "{{hours}}"
}
```
