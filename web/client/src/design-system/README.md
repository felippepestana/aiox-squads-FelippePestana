# Apex-Talent Design System

Sistema de design leve do front-end web, **estendendo os tokens CSS que já existiam** em `styles.css` para um conjunto documentado, com tema claro e escuro, **sem dependências pesadas**.

## Tokens (`tokens.css`)

Definidos como CSS variables, aplicáveis por `data-theme="light|dark"` em um container:

- **Superfícies:** `--ds-bg`, `--ds-panel`, `--ds-panel-2`, `--ds-border`
- **Texto:** `--ds-text`, `--ds-muted`
- **Semânticos:** `--ds-accent`, `--ds-info`, `--ds-warn`, `--ds-danger`, `--ds-success`
- **Escala:** `--ds-space-*`, `--ds-radius*`, tipografia (`--ds-font`, `--ds-font-serif`, `--ds-fs-*`)
- **Impressão:** tokens sob `@media print` para as minutas

## Componentes (`index.tsx`)

`Button`, `Card`, `Field`, `Input`, `Textarea`, `Badge`, `Stepper`, e estilos de `Table` (`.ds-table`). Todos consomem os tokens — trocar o tema reestiliza tudo.

```tsx
import { Button, Card, Field, Input, Stepper, Badge } from "./design-system";

<div className="ds-root" data-theme="light">
  <Card title="Vaga">
    <Field label="Cargo"><Input value={v} onChange={...} /></Field>
    <Button variant="primary">Continuar</Button>
  </Card>
</div>
```

## Princípios

- **Acessibilidade:** foco visível (`outline` no accent), contraste adequado nos dois temas.
- **Densidade:** espaçamento por escala (`--ds-space-*`), nada de valores mágicos.
- **Estados:** `:hover`, `:disabled`, e estados do `Stepper` (ativo/concluído).
- **Tema:** claro e escuro via `data-theme`; as minutas usam tema claro/impressão.
