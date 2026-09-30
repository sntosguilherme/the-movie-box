# Catálogo de Filmes — ED II

Primeira nota da disciplina de Estruturas de Dados II, minstrada pelo professor Lincoln.

Aplicação local com Next.js, TypeScript e Tailwind CSS.

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
- `backend/src/`: carregamento do catálogo, consultas e implementações das estruturas de dados.

Execute os comandos acima dentro de `frontend/`.

Para entender a Splay Tree adaptada, a AVL e a lista encadeada de IDs, consulte o
[README do backend](backend/README.md). Ele descreve o funcionamento e todos os
métodos implementados nas estruturas.
