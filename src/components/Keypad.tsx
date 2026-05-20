import type { Idioma } from '../types'
import { t } from '../i18n'

interface KeypadProps {
  onDigit: (d: string) => void
  onClear: () => void
  onConfirm: () => void
  confirmDisabled?: boolean
  idioma: Idioma
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', ''],
]

export function Keypad({ onDigit, onClear, onConfirm, confirmDisabled, idioma }: KeypadProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto">
      <div className="grid grid-cols-3 gap-2 w-full">
        {KEYS.flat().map((k, i) =>
          k ? (
            <button
              key={i}
              onMouseDown={() => onDigit(k)}
              onTouchStart={(e) => { e.preventDefault(); onDigit(k) }}
              className="h-14 rounded-xl bg-white/10 text-white text-xl font-bold active:bg-white/25 transition-colors select-none"
            >
              {k}
            </button>
          ) : (
            <div key={i} />
          )
        )}
      </div>
      <div className="flex gap-2 w-full">
        <button
          onMouseDown={onClear}
          onTouchStart={(e) => { e.preventDefault(); onClear() }}
          className="flex-1 h-12 rounded-xl bg-orange-600/60 text-white text-sm font-bold active:bg-orange-500/80 transition-colors select-none"
        >
          {t('limpar', idioma)}
        </button>
        <button
          onMouseDown={onConfirm}
          onTouchStart={(e) => { e.preventDefault(); onConfirm() }}
          disabled={confirmDisabled}
          className="flex-1 h-12 rounded-xl bg-green-600/60 text-white text-sm font-bold active:bg-green-500/80 disabled:opacity-40 transition-colors select-none"
        >
          {t('confirmar', idioma)}
        </button>
      </div>
    </div>
  )
}
