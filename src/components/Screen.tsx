import type { Step, Idioma } from '../types'
import { t } from '../i18n'

interface ScreenProps {
  step: Step
  onEscolher: (modo: 'credito' | 'debito') => void
  confeteAtivo: boolean
  idioma: Idioma
  luz?: number
}

function formatBRL(cents: string): string {
  if (!cents) return 'R$ 0,00'
  const n = cents.padStart(3, '0')
  const reais = n.slice(0, -2) || '0'
  const centavos = n.slice(-2)
  const comPonto = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$ ${comPonto},${centavos}`
}

export function Screen({ step, onEscolher, confeteAtivo, idioma, luz }: ScreenProps) {
  switch (step.type) {
    case 'idle':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="text-3xl font-bold tracking-widest">{t('maquineta', idioma)}</div>
          <div className="text-xs opacity-50">{t('brincadeira', idioma)}</div>
          <div className="mt-4 text-sm opacity-70 animate-pulse">
            {idioma === 'en' ? 'Press any key to start' : 'Digite o valor para começar'}
          </div>
        </div>
      )

    case 'valor':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="text-lg font-bold">{t('valor', idioma)}</div>
          <div className="text-4xl font-mono tracking-wider bg-black/30 px-4 py-2 rounded-lg min-h-[3rem] flex items-center">
            {formatBRL(step.amount)}
          </div>
        </div>
      )

    case 'credDeb':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="text-lg font-bold">{t('formaPagamento', idioma)}</div>
          <button
            onPointerDown={() => onEscolher('credito')}
            className="w-40 py-3 rounded-xl bg-green-600/80 text-white text-base font-bold active:bg-green-500 transition-colors select-none"
          >
            {t('credito', idioma)}
          </button>
          <button
            onPointerDown={() => onEscolher('debito')}
            className="w-40 py-3 rounded-xl bg-blue-600/80 text-white text-base font-bold active:bg-blue-500 transition-colors select-none"
          >
            {t('debito', idioma)}
          </button>
        </div>
      )

    case 'aguardando':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="w-10 h-10 rounded-full border-3 border-white/30 border-t-white animate-spin" />
          <div className="text-base font-bold mt-1">{t('aproximeCartao', idioma)}</div>
          <div className="text-[10px] opacity-50">{t('cubraCamera', idioma)}</div>
          {luz !== undefined && (
            <div className="text-[10px] mt-1 font-mono opacity-70">
              {idioma === 'en' ? 'Light: ' : 'Luz: '}{Math.round(luz)}
            </div>
          )}
        </div>
      )

    case 'processando':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="text-2xl animate-bounce">⏳</div>
          <div className="text-base font-bold">{t('processando', idioma)}</div>
          <div className="flex gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      )

    case 'aprovado':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-1">
          {confeteAtivo && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    animation: `confeteFall ${1 + Math.random() * 2}s linear ${Math.random()}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
          <div className="text-4xl mb-1">✅</div>
          <div className="text-xl font-bold text-green-400">{t('aprovado', idioma)}</div>
          <div className="text-[10px] opacity-70">{t('obrigado', idioma)}</div>
        </div>
      )

    case 'recusado':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-1">
          <div className="text-4xl mb-1">❌</div>
          <div className="text-xl font-bold text-red-400">{t('recusado', idioma)}</div>
          <div className="text-[10px] opacity-70">{t('tenteNovamente', idioma)}</div>
        </div>
      )
  }
}
