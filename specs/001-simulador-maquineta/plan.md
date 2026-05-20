# Implementation Plan: Simulador de Maquineta Infantil

**Branch**: `001-simulador-maquineta` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-simulador-maquineta/spec.md`

## Summary

PWA fullscreen que simula uma maquineta de cartão para crianças de 3 anos. Fluxo: IDLE → digitar valor → crédito/débito → aguardar cartão (câmera coberta) → processando → aprovado/recusado. Carcaça e botões com cores customizáveis, sons sintéticos, animações comemorativas. Funciona 100% offline.

## Technical Context

**Language/Version**: TypeScript 5.7+

**Primary Dependencies**: React 19, Vite 6, vite-plugin-pwa, Tailwind CSS v4

**Storage**: localStorage (apenas configurações)

**Testing**: Vitest + @testing-library/react

**Target Platform**: Navegadores mobile com suporte a PWA (Android Chrome, iOS Safari)

**Project Type**: PWA (aplicação web mobile fullscreen)

**Performance Goals**: Detecção de aproximação < 2s, animações a 60fps, bundle < 500KB (gzip)

**Constraints**: Offline-first, < 5MB total, modo retrato obrigatório, alvos de toque ≥ 48px

**Scale/Scope**: 1 usuário local (criança operando + adulto configurando)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

N/A — constitution não foi configurada para este projeto. Nenhum gate definido.

## Project Structure

### Documentation (this feature)

```text
specs/001-simulador-maquineta/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
src/
├── main.tsx
├── App.tsx
├── index.css
├── types.ts
├── stateMachine.ts
├── i18n/
│   ├── index.ts
│   ├── pt-BR.json
│   └── en.json
├── hooks/
│   ├── useCamera.ts
│   └── useSound.ts
├── components/
│   ├── CardMachine.tsx
│   ├── Screen.tsx
│   ├── Keypad.tsx
│   ├── ConfigScreen.tsx
│   ├── ColorPicker.tsx
│   └── animations/
│       ├── Confete.tsx
│       └── EmojisSubindo.tsx
└── lib/
    ├── config.ts
    └── detectors/
        ├── types.ts
        └── cameraDarkness.ts

public/
└── icons/
```

**Structure Decision**: Single-project PWA (Option 1). Sem backend — tudo roda no navegador.

## Complexity Tracking

N/A — nenhuma violação de constitution identificada.
