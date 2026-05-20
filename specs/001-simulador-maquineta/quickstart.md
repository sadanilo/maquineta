# Quickstart: Simulador de Maquineta Infantil

## Pré-requisitos

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm run dev
```

Abra o URL exibido no terminal (ex: `http://localhost:5173`) no navegador do celular, ou use o modo "Inspecionar" do navegador desktop com visão mobile.

## Build para produção

```bash
npm run build
```

Os arquivos estáticos estarão em `dist/`. Para testar o PWA localmente:

```bash
npx serve dist
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verificar código |
| `npm run test` | Rodar testes |

## PWA

Após build, sirva `dist/` com um servidor HTTPS (ou localhost) para testar:
- Instalação na tela inicial
- Funcionamento offline
- Modo fullscreen
