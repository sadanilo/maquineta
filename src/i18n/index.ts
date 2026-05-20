import ptBr from './pt-BR.json'
import en from './en.json'
import type { Idioma } from '../types'

const locales: Record<Idioma, Record<string, string>> = { 'pt-BR': ptBr, en }

export function t(key: string, idioma: Idioma): string {
  return locales[idioma]?.[key] ?? key
}
