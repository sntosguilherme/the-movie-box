# Catálogo de Filmes — ED II

Aplicação local com Next.js (App Router), TypeScript e Tailwind CSS.

## Executar

Com Node.js 20.9 ou superior e npm instalados:

```powershell
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000.

## Build e verificações

```powershell
npm run lint
npm run typecheck
npm run build
npm start
```

Execute o typecheck após a primeira execução de dev ou build, que gera os tipos do Next.js.

## Estrutura

- `frontend/`: aplicação Next.js e suas configurações.
- `frontend/app/`: rotas `/` e `/filmes/[id]`, layout e CSS global.
- `frontend/components/`: componentes reutilizáveis da interface.
- `backend/lib/`: carregamento de dados, consultas, AVL e skip list.
- `pre-processing/`: preparação do dataset em Python.

Execute os comandos npm dentro de `frontend/`. As rotas são a base inicial. O carregamento do JSON, a interface completa e as estruturas serão implementados nas respectivas issues.

Referências: [Next.js](https://nextjs.org/docs/app/getting-started/installation) e [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
