# PRD: Maquineta — Simulador de Cartão Infantil

## Problem Statement

Uma criança de 3 anos quer brincar de "passar cartão" como os adultos fazem. Não existe um app simples, lúdico e seguro que simule uma maquineta de cartão com interação física real (cobrir a câmera como se estivesse aproximando um cartão). Os pais precisam de algo que rode no próprio celular, sem comprar hardware extra, e que a criança consiga operar sozinha.

## Solution

Um PWA fullscreen que simula uma maquineta de cartão. A criança digita um valor, escolhe crédito ou débito, e "aproxima" um cartão de brinquedo cobrindo a câmera frontal do celular. O app processa, e mostra aprovado (com festa) ou recusado. Carcaça e botões têm cores configuráveis.

## User Stories

1. Como uma criança, quero ver uma maquineta bonita na tela, para me sentir fazendo de conta que estou pagando.
2. Como uma criança, quero digitar um valor no teclado numérico da maquineta, para escolher quanto vou pagar.
3. Como uma criança, quero escolher entre crédito e débito, para imitar o que vejo os adultos fazerem.
4. Como uma criança, quero "aproximar" meu cartão de brinquedo cobrindo a câmera do celular, para ativar o pagamento.
5. Como uma criança, quero ver uma animação divertida quando o pagamento é aprovado, para comemorar.
6. Como uma criança, quero ouvir sons de maquineta de verdade, para a brincadeira ser mais realista.
7. Como uma criança, quero que às vezes o pagamento seja recusado, para ter surpresa na brincadeira.
8. Como um pai/mãe, quero configurar a chance de aprovação, para controlar o nível de frustração.
9. Como um pai/mãe, quero ativar/desativar o modo de detecção (qualquer objeto, QR Code, NFC), para escolher o nível de realismo.
10. Como um pai/mãe, quero ativar/desativar sons e confete, para usar em diferentes contextos.
11. Como um pai/mãe, quero personalizar as cores da carcaça e botões, para deixar o app mais atrativo.
12. Como um pai/mãe, quero que o app funcione em tela cheia no celular, para parecer um app de verdade.
13. Como um pai/mãe, quero que o app funcione offline, para usar sem internet.
14. Como um pai/mãe, quero que o app suporte português e inglês, para a criança poder brincar no idioma que preferir.
15. Como uma criança, quero que após um tempo na tela de resultado o app volte sozinho para o início, para poder brincar de novo.

## Implementation Decisions

### Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- vite-plugin-pwa para service worker e manifest

### Machine de Estados

```
IDLE → VALOR → CRED/DEB → AGUARDAR → PROCESSANDO → APROVADO | RECUSADO → (timer) → IDLE
```

Módulo de lógica pura (sem React), testável isoladamente:

```ts
type State =
  | { step: 'idle' }
  | { step: 'valor'; amount: string }
  | { step: 'credDeb' }
  | { step: 'aguardando' }
  | { step: 'processando' }
  | { step: 'aprovado' }
  | { step: 'recusado' }

type Action =
  | { type: 'INICIAR' }
  | { type: 'DIGITAR'; digit: string }
  | { type: 'LIMPAR' }
  | { type: 'CONFIRMAR_VALOR' }
  | { type: 'ESCOLHER'; modo: 'credito' | 'debito' }
  | { type: 'CARTAO_APROXIMADO' }
  | { type: 'FINALIZAR'; resultado: 'aprovado' | 'recusado' }
  | { type: 'RESET' }
```

### Detector de Cartão

Interface única com implementações plugáveis:

```ts
interface CardDetector {
  start: () => void
  stop: () => void
  onDetection: (callback: () => void) => void
}
```

**v0.5** — CameraDarkness: usa `getUserMedia` da câmera frontal, amostra frames com canvas, calcula luminosidade média. Abaixo de threshold, dispara detecção.

**v1.0** — QRCode: usa `jsQR` ou similar para reconhecer padrão no cartão de brinquedo.

**v2.0** — NFC: usa `NDEFReader` (Web NFC API).

### Sons

Web Audio API — geração sintética. Nenhum arquivo de áudio baixado.

- `bipAproximacao()` — tom curto agudo
- `somProcessando()` — sequência rítmica
- `somAprovado()` — fanfarra curta
- `somRecusado()` — buzz descendente
- `aplausos()` — ruído branco modulado

### Animações

Componentes independentes, selecionáveis nas configurações:

- `Confete` — partículas coloridas caindo
- `EmojisSubindo` — emojis flutuando para cima
- `Aplausos` — som + texto "PALMAS"

### CardMachine

Componente React que renderiza a silhueta da maquineta:
- Display (topo) — mostra estado atual
- Teclado numérico (base) — botões 0-9, confirmar, limpar
- Indicador de aproximação — animação pulsante no topo
- Botões laterais (poder, cancelar)

Cores da carcaça, borda do display e botões são props injected por contexto de configuração.

### Configurações

Persistência em `localStorage`:

```ts
interface Config {
  modoDetecao: 'qualquer' | 'qrcode' | 'nfc'
  chanceAprovacao: number  // 0–100
  som: boolean
  confete: boolean
  animacaoResultado: 'confete' | 'emojis' | 'aplausos'
  corCarcaca: string
  corBotoes: string
  corDisplay: string
}
```

### i18n

Estrutura plana de chaves, JSON por locale:

```
src/i18n/
  pt-BR.json
  en.json
```

Provider React que expõe `t('chave')` nos componentes.

### PWA

- Manifest com `display: fullscreen`, `orientation: portrait`
- Service worker com precache via vite-plugin-pwa
- Ícones em múltiplos tamanhos (192, 512)

## Módulos

| Módulo | Descrição | Testável isoladamente? |
|---|---|---|
| `stateMachine` | Redutor puro state → action → state | Sim |
| `cardDetection/cameraDarkness` | Câmera → detecção por escurecimento | Parcial (precisa de câmera real) |
| `cardDetection/types` | Interface `CardDetector` + tipos | Sim |
| `sound` | Web Audio API, geração sintética | Sim (mock AudioContext) |
| `animations/Confete` | Componente de confete | Sim (visual) |
| `animations/EmojisSubindo` | Componente de emojis | Sim (visual) |
| `config` | Leitura/escrita localStorage + tipo Config | Sim |
| `i18n` | Provider + JSON | Sim |
| `CardMachine` | Componente principal | Parcial (testes de render) |
| `Keypad` | Teclado numérico | Sim |

## Testing Decisions

- A lógica de estado (`stateMachine`) deve ser testada unitariamente: cada transição com cada action, cobrindo edge cases.
- O módulo `config` deve ser testado com mock de localStorage.
- O módulo `sound` deve ser testado verificando chamadas ao AudioContext mockado.
- `Keypad` deve ser testado com render e simulação de clique.
- `CardMachine` testado com integração leve (render + clique + asserção de tela).
- Não testar `cameraDarkness` em testes unitários (depende de hardware real).

## Out of Scope

- v1.0: autenticação, login, múltiplos perfis de criança
- v1.0: upload de imagem para envelopar a carcaça (v2.0)
- v1.0: QR Code (v1.0) e NFC (v2.0) como detecção
- v1.0: modo pintura dentro do app
- v1.0: valores reais, conexão com bancos ou qualquer coisa financeira
- v1.0: multiplayer, rede, backend

## Further Notes

- PWA deve funcionar 100% offline.
- O design visual deve priorizar dedos de criança de 3 anos (alvos de toque ≥ 48px).
- O app não coleta nenhum dado do usuário.
