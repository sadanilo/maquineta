export type Step =
  | { type: 'idle' }
  | { type: 'valor'; amount: string }
  | { type: 'credDeb' }
  | { type: 'aguardando' }
  | { type: 'processando' }
  | { type: 'aprovado' }
  | { type: 'recusado' }

export type Action =
  | { type: 'INICIAR' }
  | { type: 'DIGITAR'; digit: string }
  | { type: 'LIMPAR' }
  | { type: 'CONFIRMAR_VALOR' }
  | { type: 'ESCOLHER'; modo: CredDeb }
  | { type: 'CARTAO_APROXIMADO' }
  | { type: 'FINALIZAR'; resultado: 'aprovado' | 'recusado' }
  | { type: 'RESET' }

export type CredDeb = 'credito' | 'debito'

export type Animacao = 'confete' | 'emojis' | 'aplausos'

export type Idioma = 'pt-BR' | 'en'

export interface Config {
  modoDeteccao: 'qualquer'
  chanceAprovacao: number
  som: boolean
  confete: boolean
  animacaoResultado: Animacao
  corCarcaca: string
  corBotoes: string
  corDisplay: string
  idioma: Idioma
}

export interface CardDetector {
  start(onDetect: () => void): Promise<void>
  stop(): void
  isAvailable(): Promise<boolean>
  getBrightness(): number
}

export interface SoundEngine {
  bipAproximacao(): void
  somProcessando(): void
  somAprovado(): void
  somRecusado(): void
  aplausos(): void
  setMuted(muted: boolean): void
}
