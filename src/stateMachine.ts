import type { Step, Action } from './types'

export function stateReducer(step: Step, action: Action): Step {
  switch (step.type) {
    case 'idle':
      if (action.type === 'INICIAR') return { type: 'valor', amount: '' }
      break
    case 'valor':
      if (action.type === 'DIGITAR') {
        if (step.amount.length >= 6) return step
        return { ...step, amount: step.amount + action.digit }
      }
      if (action.type === 'LIMPAR') {
        return { ...step, amount: step.amount.slice(0, -1) }
      }
      if (action.type === 'CONFIRMAR_VALOR') {
        if (step.amount === '' || Number(step.amount) === 0) return step
        return { type: 'credDeb' }
      }
      break
    case 'credDeb':
      if (action.type === 'ESCOLHER') return { type: 'aguardando' }
      break
    case 'aguardando':
      if (action.type === 'CARTAO_APROXIMADO') return { type: 'processando' }
      break
    case 'processando':
      if (action.type === 'FINALIZAR') {
        return action.resultado === 'aprovado'
          ? { type: 'aprovado' }
          : { type: 'recusado' }
      }
      break
    case 'aprovado':
    case 'recusado':
      if (action.type === 'RESET') return { type: 'idle' }
      break
  }
  return step
}
