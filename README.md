# Sprinkle

Vite SSR template with Pnpm Monorepo, support React@18 and TypeScript

## Main Dependency

- `pnpm`
- `fastify@3`
- `vite@2`
- `typescript@4`
- `react@18`: `@emotion/react` + `react-router@6` + `react-helmet-async`
- `svelte@3`

### Lint & Hooks

- `eslint`
- `husky@6`

## Develop your own project

> With node.js 16 & pnpm, default app is `react-app`, if you want to use `svelte-app`, you can edit `server/index.ts` to use it.
If you don't need `svelte-app`, just delete it.

You can replace `@my-monorepo` globally with your monorepo space.

### Quick start

```shell
git clone https://github.com/wzhzzmzzy/vite-ssr-monorepo-template
pnpm i
pnpm run dev
open https://localhost:3001
```

### Build & Run

```shell
pnpm run build:react # use build:svelte if you need
pnpm run serve
```
