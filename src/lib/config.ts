import type { Config } from '../types'

const STORAGE_KEY = 'maquineta-config'

const DEFAULTS: Config = {
  modoDeteccao: 'qualquer',
  chanceAprovacao: 70,
  som: true,
  confete: true,
  animacaoResultado: 'confete',
  corCarcaca: '#1a1a2e',
  corBotoes: '#16213e',
  corDisplay: '#0f3460',
  idioma: 'pt-BR',
}

export function loadConfig(): Config {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw) as Partial<Config>
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveConfig(config: Config): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
