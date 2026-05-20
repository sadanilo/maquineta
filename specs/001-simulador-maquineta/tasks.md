# Tasks: Simulador de Maquineta Infantil

**Input**: Design documents from `/specs/001-simulador-maquineta/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **PWA**: `src/` at repository root per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite + React + TypeScript project with package.json
- [x] T002 [P] Configure Tailwind CSS in postcss.config.js + vite.config.ts
- [x] T003 [P] Configure vite-plugin-pwa (manifest, service worker, icons) in vite.config.ts
- [x] T004 [P] Create directory structure: src/components/, src/hooks/, src/lib/, src/i18n/, public/icons/
- [x] T005 Configure TypeScript strict mode in tsconfig.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, state machine, config, and detection that ALL user stories depend on

- [x] T006 Create shared types in src/types.ts (Step, Action, Config, CardDetector, SoundEngine)
- [x] T007 [P] Implement state machine reducer in src/stateMachine.ts (pure function: step + action → step)
- [x] T008 [P] Create config lib in src/lib/config.ts (defaults, load/save localStorage)
- [x] T009 [P] Create camera darkness detector in src/lib/detectors/cameraDarkness.ts
- [x] T010 [P] Create detector types in src/lib/detectors/types.ts (CardDetector interface)
- [x] T011 [P] Create sound engine using Web Audio API in src/hooks/useSound.ts
- [x] T012 [P] Create useCamera hook in src/hooks/useCamera.ts (wraps detector + permission)

**Checkpoint**: Foundation ready — all prerequisites for user stories are in place

---

## Phase 3: Core Transaction Flow - Aprovado & Recusado (Priority: P1) 🎯 MVP

**Goal**: Fluxo completo de compra: IDLE → valor → crédito/débito → aguardar cartão → processando → aprovado/recusado com som e animação

**Independent Test**: Completar uma transação do início ao fim usando o botão "Passar cartão" (fallback manual). Verificar que aprovado e recusado funcionam alternando a chance de aprovação.

### Implementation

- [x] T013 [P] [US1] Create Screen component in src/components/Screen.tsx
- [x] T014 [P] [US1] Create Keypad component in src/components/Keypad.tsx
- [x] T015 [P] [US1] Create Confete animation in src/components/animations/Confete.tsx
- [x] T016 [P] [US1] Create EmojisSubindo animation in src/components/animations/EmojisSubindo.tsx
- [x] T017 [US1] Create CardMachine component in src/components/CardMachine.tsx (integra todos)
- [x] T018 [US1] Implement fallback manual (botão "Passar cartão" quando câmera indisponível)
- [x] T019 [US1] Create App.tsx com React state + CardMachine como entry point
- [x] T020 [US1] Create main.tsx + index.css com animações CSS + PWA service worker

**Checkpoint**: MVP funcional — transações aprovadas e recusadas funcionam com som e animação

---

## Phase 4: Configurações do App (Priority: P2)

**Goal**: Tela de configurações onde o responsável ajusta chance de aprovação, som, confete, tipo de animação

**Independent Test**: Abrir configurações, alterar cada opção, verificar que o comportamento do app muda conforme o esperado.

### Implementation

- [x] T021 [US3] Create ConfigPanel in App.tsx (slider chance, toggles som/confete, select animação)
- [x] T022 [US3] Add engrenagem button to open ConfigPanel
- [x] T023 [US3] Wire config changes to config lib (load at startup, save on change)
- [x] T024 [P] [US3] Create color palette picker (8 cores pré-definidas)
- [x] T025 [US3] Apply cores via inline styles no CardMachine (carcaça, display)

**Checkpoint**: App totalmente configurável — chance, som, animações e cores ajustáveis

---

## Phase 5: Suporte a Dois Idiomas (Priority: P3)

**Goal**: App disponível em português e inglês, alternável nas configurações

**Independent Test**: Mudar idioma de pt-BR para en e verificar que todos os textos do app mudam, depois voltar.

### Implementation

- [x] T026 [P] [US5] Create pt-BR locale in src/i18n/pt-BR.json
- [x] T027 [P] [US5] Create en locale in src/i18n/en.json
- [x] T028 [US5] Create i18n helper in src/i18n/index.ts (t() function)
- [x] T029 [US5] Add language selector to ConfigPanel
- [x] T030 [US5] Migrate all hardcoded strings in Screen, Keypad, CardMachine, App to use t()

**Checkpoint**: App bilíngue funcional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: PWA polish, edge cases, refinamentos finais

- [ ] T031 [P] Add PWA icons in public/icons/ (192x192, 512x512) — placeholder SVG criado
- [x] T032 Configure viewport meta tag e orientação retrato no index.html
- [x] T033 Implement auto-reset timer (5s) nas telas de resultado
- [x] T034 Camera permission denied → fallback "👆 PASSAR CARTÃO"
- [x] T035 Handle app focus loss → visibilitychange listener (pause/resume camera)
- [x] T036 Limit amount to 6 digits (já no stateMachine)
- [x] T037 Disable confirm when amount empty/zero
- [x] T038 Camera timeout 10s → instrução overlay "Cubra a câmera"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1+2 (Phase 3)**: Depends on Foundational
- **Config (Phase 4)**: Depends on Foundational, no dependency on US1+2
- **i18n (Phase 5)**: Depends on Foundational, can run in parallel with US3 and US4
- **Polish (Phase 6)**: Depends on all phases

### User Story Dependencies

- **US1 + US2 (P1)**: Core flow — independent, no dependencies on other stories
- **US3 + US4 (P2)**: Can start after Foundational — independent from core flow
- **US5 (P3)**: Can start after Foundational — independent from core flow and config

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- **Phases 3, 4, and 5 can be worked on in parallel** after Foundational completes
- Tasks within a phase marked [P] can run in parallel

---

## Parallel Example: Phase 3 (Core Flow)

```bash
# Launch all independent UI components together:
Task: "Create Screen in src/components/Screen.tsx"
Task: "Create Keypad in src/components/Keypad.tsx"
Task: "Create Confete animation in src/components/animations/Confete.tsx"
Task: "Create EmojisSubindo in src/components/animations/EmojisSubindo.tsx"
```

---

## Implementation Strategy

### MVP First (Phases 1-3)

1. Phase 1: Setup (initialize Vite + React + TS + Tailwind + PWA)
2. Phase 2: Foundational (types, state machine, config, detector, sound)
3. Phase 3: Core flow (CardMachine, Screen, Keypad, animations)
4. **STOP and VALIDATE**: Full transaction flow works end-to-end
5. MVP deliverable: Criança brinca de passar cartão com aprovado/recusado

### Incremental Delivery

1. Setup + Foundational → Base pronta
2. Add Core Flow (Phase 3) → MVP! (transações funcionando)
3. Add Config + Cores (Phase 4) → Personalizável
4. Add i18n (Phase 5) → Bilíngue
5. Polish (Phase 6) → Refinamentos e edge cases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each phase is independently testable
- No test tasks included (TDD não solicitado na spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
