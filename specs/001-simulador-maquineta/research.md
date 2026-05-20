# Research: Simulador de Maquineta Infantil

## Decision Log

### Stack
- **Decision**: React + TypeScript + Vite + Tailwind CSS
- **Rationale**: React é amplamente suportado em mobile browsers, Vite oferece build rápido e HMR, Tailwind CSS facilita design responsivo e customização de cores. vite-plugin-pwa simplifica service worker e manifest.
- **Alternatives considered**: Vanilla JS (menos produtivo para estado complexo), Svelte (menor ecossistema de PWA), Next.js (desnecessário — sem SSR/backend)

### Detecção por Câmera
- **Decision**: getUserMedia + canvas para amostragem de luminosidade
- **Rationale**: API nativa do navegador, sem dependências externas. Amostragem a cada 500ms com threshold de brilho médio < 20% para disparar detecção.
- **Alternatives considered**: TensorFlow.js (overkill), MediaPipe (pesado para PWA)

### Sons
- **Decision**: Web Audio API com geração sintética (OscillatorNode + Geração de ruído)
- **Rationale**: Zero dependências, zero downloads, funciona offline. Implementação leve com < 200 linhas.
- **Alternatives considered**: Arquivos de áudio pré-gravados (aumentam bundle), Howler.js (dependência externa)

### Animações
- **Decision**: CSS animations + React state para confete e emojis subindo
- **Rationale**: GPU-accelerated, sem lib extra. Performance adequada para 60fps em dispositivos mobile.
- **Alternatives considered**: framer-motion (pesado), canvas API (mais complexo)

### Persistência
- **Decision**: localStorage para configurações
- **Rationale**: Síncrono, disponível em todos os navegadores, sem dependências. Volume de dados mínimo (< 1KB).
- **Alternatives considered**: IndexedDB (overkill para poucos dados), cookie (não adequado)

### Fallback sem Câmera
- **Decision**: Botão manual "Passar cartão" quando câmera indisponível
- **Rationale**: Garante que a brincadeira funciona mesmo sem permissão de câmera ou em dispositivos sem câmera frontal.
- **Alternatives considered**: Bloquear o fluxo (frustrante para a criança)
