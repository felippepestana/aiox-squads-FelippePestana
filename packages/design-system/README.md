# @aiox/design-system

Design system reutilizável do ecossistema AIOX: tokens, primitivos (shadcn-style sobre Radix) e componentes de experiência de agente (pipeline ao vivo, dropzone, blocos de resultado).

## Consumo (apps Next.js)

1. Dependência (workspace/local):

```jsonc
// package.json do app
"dependencies": { "@aiox/design-system": "file:../packages/design-system" }
```

2. Transpilar o pacote (source-first):

```js
// next.config.js
module.exports = { transpilePackages: ["@aiox/design-system"] };
```

3. Tailwind preset + content:

```ts
// tailwind.config.ts
import aioxPreset from "@aiox/design-system/preset";
export default {
  presets: [aioxPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../packages/design-system/src/**/*.{ts,tsx}",
  ],
};
```

4. Tokens (CSS variables) no layout raiz:

```ts
import "@aiox/design-system/styles/tokens.css";
```

## Uso

```tsx
import { Button, Card, PipelineStepper, FileDropzone } from "@aiox/design-system";
```

## Conteúdo

- Tokens: `preset` (Tailwind) + `styles/tokens.css` (variáveis HSL, claro/escuro).
- Primitivos: Button, Card, Badge, Input, Label, Progress, Tabs, Select, DropdownMenu, Tooltip, Avatar, Separator, Skeleton, Dialog, Toast/Toaster + `useToast`.
- Agente: AppShell, PageHeader, StatCard, StatusBadge, EmptyState, FileDropzone, PipelineStepper, ThemeToggle, PartiesSection, TimelineSection, ClaimsSection, RiskList, DeadlineCard.
