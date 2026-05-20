import { useState } from 'react'
import { CardMachine } from './components/CardMachine'
import { loadConfig, saveConfig } from './lib/config'
import { t } from './i18n'
import type { Config } from './types'

export function App() {
  const [config, setConfig] = useState<Config>(loadConfig)
  const [showConfig, setShowConfig] = useState(false)

  const handleConfigChange = (partial: Partial<Config>) => {
    const next = { ...config, ...partial }
    setConfig(next)
    saveConfig(next)
  }

  if (showConfig) {
    return <ConfigPanel config={config} onChange={handleConfigChange} onClose={() => setShowConfig(false)} />
  }

  return (
    <div className="h-dvh w-dvw flex flex-col bg-gray-950">
      <div className="flex-1 w-full">
        <CardMachine config={config} onOpenConfig={() => setShowConfig(true)} />
      </div>
    </div>
  )
}

interface ConfigPanelProps {
  config: Config
  onChange: (p: Partial<Config>) => void
  onClose: () => void
}

const CORES_DISPONIVEIS = [
  { label: 'Azul Escuro', value: '#1a1a2e' },
  { label: 'Vermelho', value: '#2e1a1a' },
  { label: 'Verde', value: '#1a2e1a' },
  { label: 'Roxo', value: '#2a1a2e' },
  { label: 'Laranja', value: '#2e2a1a' },
  { label: 'Cinza', value: '#2a2a2a' },
  { label: 'Rosa', value: '#2e1a2a' },
  { label: 'Ciano', value: '#1a2e2e' },
]

function ConfigPanel({ config, onChange, onClose }: ConfigPanelProps) {
  const tr = (key: string) => t(key, config.idioma)

  return (
    <div className="h-dvh w-dvw bg-gray-950">
      <div
        className="p-5 space-y-4 h-full overflow-y-auto"
        style={{ backgroundColor: config.corCarcaca }}
      >
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-lg">{tr('configuracoes')}</div>
          <button onMouseDown={onClose} className="text-white/50 text-xl active:text-white/80 transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-white text-sm">
          <div>
            <div className="mb-1">{tr('chanceAprovacao')}: {config.chanceAprovacao}%</div>
            <input
              type="range" min="0" max="100"
              value={config.chanceAprovacao}
              onChange={(e) => onChange({ chanceAprovacao: Number(e.target.value) })}
              className="w-full accent-green-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={config.som} onChange={(e) => onChange({ som: e.target.checked })} className="accent-green-500" />
            {tr('som')}
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={config.confete} onChange={(e) => onChange({ confete: e.target.checked })} className="accent-green-500" />
            {tr('confete')}
          </label>

          <div>
            <div className="mb-1">{tr('animacaoAprovacao')}</div>
            <select
              value={config.animacaoResultado}
              onChange={(e) => onChange({ animacaoResultado: e.target.value as Config['animacaoResultado'] })}
              className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
            >
              <option value="confete">Confete</option>
              <option value="emojis">Emojis</option>
              <option value="aplausos">Aplausos</option>
            </select>
          </div>

          <div>
            <div className="mb-1">{tr('idioma')}</div>
            <select
              value={config.idioma}
              onChange={(e) => onChange({ idioma: e.target.value as Config['idioma'] })}
              className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20"
            >
              <option value="pt-BR">Português</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <div className="mb-1">{tr('corCarcaca')}</div>
            <div className="grid grid-cols-4 gap-2">
              {CORES_DISPONIVEIS.map((c) => (
                <button
                  key={c.value}
                  onMouseDown={() => onChange({ corCarcaca: c.value })}
                  className={`h-10 rounded-lg border-2 transition-all ${config.corCarcaca === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1">{tr('corBotoes')}</div>
            <div className="grid grid-cols-4 gap-2">
              {CORES_DISPONIVEIS.map((c) => (
                <button
                  key={c.value}
                  onMouseDown={() => onChange({ corBotoes: c.value })}
                  className={`h-10 rounded-lg border-2 transition-all ${config.corBotoes === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1">{tr('corDisplay')}</div>
            <div className="grid grid-cols-4 gap-2">
              {CORES_DISPONIVEIS.map((c) => (
                <button
                  key={c.value}
                  onMouseDown={() => onChange({ corDisplay: c.value })}
                  className={`h-10 rounded-lg border-2 transition-all ${config.corDisplay === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
