# Contracts: Simulador de Maquineta Infantil

## State Machine Contract

```typescript
// Estado
type Step =
  | { type: 'idle' }
  | { type: 'valor'; amount: string }
  | { type: 'credDeb' }
  | { type: 'aguardando' }
  | { type: 'processando' }
  | { type: 'aprovado' }
  | { type: 'recusado' }

// Ações
type Action =
  | { type: 'INICIAR' }
  | { type: 'DIGITAR'; digit: string }
  | { type: 'LIMPAR' }
  | { type: 'CONFIRMAR_VALOR' }
  | { type: 'ESCOLHER'; modo: 'credito' | 'debito' }
  | { type: 'CARTAO_APROXIMADO' }
  | { type: 'FINALIZAR'; resultado: 'aprovado' | 'recusado' }
  | { type: 'RESET' }

// Redutor: (state, action) => state
type Reducer = (step: Step, action: Action) => Step
```

## Card Detector Contract

```typescript
interface CardDetector {
  start(onDetect: () => void): Promise<void>
  stop(): void
  isAvailable(): Promise<boolean>
}
```

## Config Contract

```typescript
interface Config {
  modoDeteccao: 'qualquer'
  chanceAprovacao: number    // 0–100
  som: boolean
  confete: boolean
  animacaoResultado: 'confete' | 'emojis' | 'aplausos'
  corCarcaca: string         // hex
  corBotoes: string          // hex
  corDisplay: string         // hex
  idioma: 'pt-BR' | 'en'
}
```

## Sound Contract

```typescript
interface SoundEngine {
  bipAproximacao(): void
  somProcessando(): void
  somAprovado(): void
  somRecusado(): void
  aplausos(): void
  setMuted(muted: boolean): void
}
```
