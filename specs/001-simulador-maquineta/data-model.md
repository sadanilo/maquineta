# Data Model: Simulador de Maquineta Infantil

## Entities

### Maquineta
A representação visual do terminal. Suas propriedades são decorativas e definidas pela Configuração.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| corCarcaca | string (hex) | Cor do corpo da maquineta |
| corBotoes | string (hex) | Cor do teclado numérico |
| corDisplay | string (hex) | Cor de fundo do display |

### Configuração
Preferências persistidas localmente. É o único dado que permanece entre sessões.

| Campo | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| modoDeteccao | `'qualquer'` | `'qualquer'` | Método de detecção da aproximação |
| chanceAprovacao | number (0–100) | `70` | Probabilidade de aprovação em % |
| som | boolean | `true` | Ativar/desativar todos os sons |
| confete | boolean | `true` | Ativar/desativar animação de confete |
| animacaoResultado | `'confete' \| 'emojis' \| 'aplausos'` | `'confete'` | Tipo de animação na aprovação |
| corCarcaca | string (hex) | `'#1a1a2e'` | Cor da carcaça |
| corBotoes | string (hex) | `'#16213e'` | Cor dos botões |
| corDisplay | string (hex) | `'#0f3460'` | Cor do display |
| idioma | `'pt-BR' \| 'en'` | `'pt-BR'` | Idioma do app |

### Transação
Criada a cada tentativa de pagamento e descartada ao sair ou ao iniciar nova transação (não há histórico persistido).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| valor | number | Valor digitado em centavos |
| modalidade | `'credito' \| 'debito'` | Escolha da criança |
| resultado | `'aprovado' \| 'recusado'` | Resultado do processamento |
| timestamp | number | Momento da transação (Date.now()) |

## State Machine

```
                  ┌─────────┐
                  │  IDLE   │
                  └────┬────┘
                       │ Iniciar
                       ▼
                  ┌─────────┐
                  │  VALOR  │ ←── Digitar número / Limpar
                  └────┬────┘
                       │ Confirmar
                       ▼
                  ┌──────────┐
                  │ CRED/DEB │
                  └────┬─────┘
                       │ Escolher
                       ▼
                  ┌──────────────┐
                  │ AGUARDANDO   │ ←── Câmera ativa
                  └──────┬───────┘
                         │ Cartão aproximado
                         ▼
                  ┌──────────────┐
                  │ PROCESSANDO  │
                  └──────┬───────┘
                         │
                    ┌────┴────┐
                    ▼         ▼
              ┌─────────┐ ┌──────────┐
              │APROVADO │ │ RECUSADO │
              └────┬────┘ └─────┬────┘
                   │ 5s ou toque│
                   └─────┬──────┘
                         ▼
                    ┌─────────┐
                    │  IDLE   │
                    └─────────┘
```

## Validações

- **Valor**: >= 1 centavo, <= 6 dígitos (R$ 9.999,99). Confirmar desabilitado se vazio ou zero.
- **Cobertura da câmera**: > 1 segundo para disparar. < 1s ignorado (falso positivo). > 10s exibe instrução na tela.
- **Transição**: Não permitir avançar sem etapa anterior completa.
