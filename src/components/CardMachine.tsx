import { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import { stateReducer } from '../stateMachine'
import { Screen } from './Screen'
import { Confete } from './animations/Confete'
import { EmojisSubindo } from './animations/EmojisSubindo'
import { useCamera } from '../hooks/useCamera'
import { createSoundEngine } from '../hooks/useSound'
import type { Config } from '../types'

interface CardMachineProps {
  config: Config
  onOpenConfig: () => void
}

export function CardMachine({ config, onOpenConfig }: CardMachineProps) {
  const [step, dispatch] = useReducer(stateReducer, { type: 'idle' })
  const camera = useCamera()
  const sound = useRef(createSoundEngine())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [instrucaoCamera, setInstrucaoCamera] = useState(false)

  sound.current.setMuted(!config.som)

  const aprovar = useCallback(() => {
    const aprovado = Math.random() * 100 < config.chanceAprovacao
    dispatch({ type: 'FINALIZAR', resultado: aprovado ? 'aprovado' : 'recusado' })
    if (aprovado) {
      sound.current.somAprovado()
    } else {
      sound.current.somRecusado()
    }
  }, [config.chanceAprovacao])

  useEffect(() => {
    if (step.type === 'aguardando') {
      camera.start(() => {
        sound.current.bipAproximacao()
        dispatch({ type: 'CARTAO_APROXIMADO' })
        camera.stop()
        sound.current.somProcessando()
        setTimeout(aprovar, 1500)
      })
      waitingTimerRef.current = setTimeout(() => setInstrucaoCamera(true), 10000)
    } else {
      if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current)
      setInstrucaoCamera(false)
    }
    if (step.type !== 'aguardando' && step.type !== 'processando') {
      camera.stop()
    }
  }, [step.type, camera, aprovar])

  useEffect(() => {
    if (step.type === 'aprovado' || step.type === 'recusado') {
      if (step.type === 'aprovado') {
        if (config.animacaoResultado === 'aplausos') sound.current.aplausos()
      }
      timerRef.current = setTimeout(() => dispatch({ type: 'RESET' }), 5000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [step.type, config.animacaoResultado])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        camera.stop()
      } else if (step.type === 'aguardando') {
        camera.start(() => {
          sound.current.bipAproximacao()
          dispatch({ type: 'CARTAO_APROXIMADO' })
          camera.stop()
          sound.current.somProcessando()
          setTimeout(aprovar, 1500)
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [step.type, camera, aprovar])

  const handleDigit = useCallback((d: string) => {
    if (step.type === 'idle') dispatch({ type: 'INICIAR' })
    dispatch({ type: 'DIGITAR', digit: d })
  }, [step.type])
  const handleClear = useCallback(() => {
    if (step.type === 'idle') return
    dispatch({ type: 'LIMPAR' })
  }, [step.type])
  const handleConfirmOrIniciar = useCallback(() => {
    if (step.type === 'idle') { dispatch({ type: 'INICIAR' }); return }
    if (step.type === 'valor') dispatch({ type: 'CONFIRMAR_VALOR' })
  }, [step.type])
  const handleEscolher = useCallback((modo: 'credito' | 'debito') => dispatch({ type: 'ESCOLHER', modo }), [])

  const handleFallback = useCallback(() => {
    sound.current.bipAproximacao()
    dispatch({ type: 'CARTAO_APROXIMADO' })
    sound.current.somProcessando()
    setTimeout(aprovar, 1500)
  }, [aprovar])

  const confirmDisabled = step.type === 'valor' && (step.amount === '' || Number(step.amount) === 0)

  return (
    <div
      className="relative flex flex-col h-full w-full rounded-[2.5rem] p-4 shadow-2xl overflow-hidden border-2 border-white/10"
      style={{ backgroundColor: config.corCarcaca }}
    >
      {/* Top bar: contactless + gear */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-xs opacity-50">
          <div className="w-8 h-4 rounded border border-white/30 flex items-center justify-center">
            <div className="w-3 h-2 rounded bg-white/20" />
          </div>
          <span>{config.idioma === 'en' ? 'TAP' : 'APROXIME'}</span>
        </div>
        <button
          onTouchStart={(e) => { e.preventDefault(); onOpenConfig() }}
          onMouseDown={onOpenConfig}
          className="text-white/40 text-lg active:text-white/80 transition-colors"
        >
          ⚙️
        </button>
      </div>

      {/* Screen / Display */}
      <div
        className="relative w-full flex-1 rounded-2xl p-3 overflow-hidden border border-white/10"
        style={{ backgroundColor: config.corDisplay }}
      >
        {step.type === 'aprovado' && config.animacaoResultado === 'confete' && config.confete && <Confete />}
        {step.type === 'aprovado' && config.animacaoResultado === 'emojis' && <EmojisSubindo />}
        {instrucaoCamera && step.type === 'aguardando' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-2xl">
            <div className="text-center px-4">
              <div className="text-3xl mb-2">🃏</div>
              <div className="text-sm font-bold">
                {config.idioma === 'en'
                  ? 'Cover the camera with your card!'
                  : 'Cubra a câmera com seu cartão!'}
              </div>
            </div>
          </div>
        )}
        <Screen
          step={step}
          onEscolher={handleEscolher}
          confeteAtivo={config.confete && config.animacaoResultado === 'confete'}
          idioma={config.idioma}
        />
      </div>

      {/* Fallback button inside machine (below display, above keypad) */}
      {step.type === 'aguardando' && (
        <button
          onTouchStart={(e) => { e.preventDefault(); handleFallback() }}
          onMouseDown={handleFallback}
          className="mt-2 py-2 rounded-xl bg-white/15 text-white text-xs font-bold active:bg-white/30 transition-colors select-none w-full"
        >
          👆 {config.idioma === 'en' ? 'TAP CARD' : 'PASSAR CARTÃO'}
        </button>
      )}

      {/* Keypad - ALWAYS visible */}
      <div className="w-full mt-3">
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
          {['1','2','3','4','5','6','7','8','9'].map((k) => (
            <button
              key={k}
              onMouseDown={() => handleDigit(k)}
              onTouchStart={(e) => { e.preventDefault(); handleDigit(k) }}
              className="h-13 rounded-xl text-white text-xl font-bold active:brightness-150 transition-all select-none shadow-md"
              style={{ backgroundColor: config.corBotoes }}
            >
              {k}
            </button>
          ))}
          {/* Row 4: Clear - 0 - Confirm */}
          <button
            onMouseDown={handleClear}
            onTouchStart={(e) => { e.preventDefault(); handleClear() }}
            className="h-13 rounded-xl bg-orange-700/70 text-white text-xs font-bold active:brightness-150 transition-all select-none shadow-md"
          >
            {config.idioma === 'en' ? 'CLR' : 'LIMPAR'}
          </button>
          <button
            onMouseDown={() => handleDigit('0')}
            onTouchStart={(e) => { e.preventDefault(); handleDigit('0') }}
            className="h-13 rounded-xl text-white text-xl font-bold active:brightness-150 transition-all select-none shadow-md"
            style={{ backgroundColor: config.corBotoes }}
          >
            0
          </button>
          <button
            onMouseDown={handleConfirmOrIniciar}
            onTouchStart={(e) => { e.preventDefault(); handleConfirmOrIniciar() }}
            disabled={confirmDisabled}
            className="h-13 rounded-xl bg-green-700/70 text-white text-xs font-bold active:brightness-150 disabled:opacity-30 disabled:brightness-100 transition-all select-none shadow-md"
          >
            {config.idioma === 'en' ? 'OK' : 'CONF'}
          </button>
        </div>
      </div>
    </div>
  )
}
