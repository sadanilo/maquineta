# Feature Specification: Simulador de Maquineta Infantil

**Feature Branch**: `001-simulador-maquineta`

**Created**: 2026-05-20

**Status**: Draft

**Input**: App infantil que simula maquineta de cartão com detecção por câmera para criança de 3 anos

## User Scenarios & Testing

### User Story 1 - Compra Aprovada do Início ao Fim (Priority: P1)

A criança liga o app, digita um valor, escolhe crédito ou débito, aproxima o cartão de brinquedo da câmera, e vê o pagamento ser aprovado com animação e som.

**Why this priority**: É o fluxo principal da brincadeira — sem ele o app não entrega valor nenhum. Tudo o mais é incremento.

**Independent Test**: Pode ser testado completamente simulando a cobertura da câmera em cada etapa. Entrega a experiência completa de "brincar de passar cartão".

**Acceptance Scenarios**:

1. **Given** o app está na tela inicial da maquineta, **When** a criança toca em "Iniciar", **Then** o teclado numérico aparece para digitar o valor.
2. **Given** a criança digitou um valor qualquer, **When** ela toca em "Confirmar", **Then** o app mostra as opções Crédito e Débito.
3. **Given** a criança escolheu Crédito ou Débito, **When** a tela de "Aproxime o cartão" aparece, **Then** o app ativa a câmera e aguarda detecção.
4. **Given** a câmera está aguardando, **When** algo cobre a lente da câmera por mais de 1 segundo, **Then** o app detecta a aproximação e inicia o processamento.
5. **Given** o app está processando, **When** o resultado é aprovação, **Then** o app exibe uma tela comemorativa com animação (confete, emojis ou aplausos) e som de aprovado.
6. **Given** a tela de aprovado está visível, **When** passam 5 segundos ou a criança toca na tela, **Then** o app volta para a tela inicial.

---

### User Story 2 - Compra Recusada (Priority: P1)

A criança passa pelo mesmo fluxo mas o pagamento é recusado, ensinando que nem sempre o cartão passa.

**Why this priority**: O contraponto ao fluxo feliz. Define o comportamento completo do ciclo de pagamento. Sem ele a brincadeira perde realismo.

**Independent Test**: Configurando a chance de aprovação para 0%, todas as tentativas resultam em recusa. Pode ser testado sem configurações usando um dispositivo de teste.

**Acceptance Scenarios**:

1. **Given** a chance de aprovação está configurada para menos de 100%, **When** o processamento termina com recusa, **Then** o app exibe uma tela de "Recusado" com som e mensagem negativa.
2. **Given** a tela de recusado está visível, **When** passam 5 segundos ou a criança toca na tela, **Then** o app volta para a tela inicial.

---

### User Story 3 - Configurações do App (Priority: P2)

O responsável acessa uma tela de configurações para ajustar a experiência: modo de detecção, chance de aprovação, som, cores e tipo de animação.

**Why this priority**: Permite que pais ajustem a brincadeira para a idade e preferências da criança. Importante mas não essencial para o fluxo principal.

**Independent Test**: Cada configuração pode ser alterada e o efeito verificado isoladamente — por exemplo, desligar o som e confirmar que nenhum áudio toca, ou mudar a cor da carcaça e ver o novo esquema de cores.

**Acceptance Scenarios**:

1. **Given** qualquer tela do app, **When** o responsável toca no ícone de engrenagem, **Then** a tela de configurações é aberta.
2. **Given** a tela de configurações, **When** o responsável altera o modo de detecção para "Qualquer objeto", **Then** a câmera detecta qualquer cobertura da lente.
3. **Given** a tela de configurações, **When** o responsável ajusta a chance de aprovação para 50%, **Then** metade das compras é aprovada e metade recusada (em média).
4. **Given** a tela de configurações, **When** o responsável desliga o som, **Then** nenhum som é reproduzido durante a brincadeira.
5. **Given** a tela de configurações, **When** o responsável desliga o confete, **Then** a tela de aprovado não mostra animação de confete.
6. **Given** a tela de configurações, **When** o responsável escolhe "Emojis subindo" como animação, **Then** a tela de aprovado mostra emojis flutuando.
7. **Given** a tela de configurações, **When** o responsável muda a cor da carcaça, **Then** o visual da maquineta reflete a nova cor imediatamente.

---

### User Story 4 - Personalização de Cores (Priority: P2)

O responsável customiza as cores da carcaça, botões e display da maquineta para tornar o app mais atrativo para a criança.

**Why this priority**: Crianças pequenas respondem muito a cores. Personalizar aumenta o engajamento. Não bloqueia o fluxo principal.

**Independent Test**: Mudar as cores e verificar visualmente que cada parte da maquineta (carcaça, botões, display) exibe a cor selecionada.

**Acceptance Scenarios**:

1. **Given** a tela de configurações, **When** o responsável seleciona uma cor para a carcaça, **Then** o corpo da maquineta exibe aquela cor.
2. **Given** a tela de configurações, **When** o responsável seleciona uma cor para os botões, **Then** o teclado numérico exibe aquela cor.
3. **Given** a tela de configurações, **When** o responsável seleciona uma cor para o display, **Then** a área da tela exibe aquela cor de fundo.

---

### User Story 5 - Suporte a Dois Idiomas (Priority: P3)

O app pode ser usado em português ou inglês, permitindo que a criança brinque no idioma preferido da família.

**Why this priority**: Útil para famílias bilíngues ou que preferem inglês, mas o app já entrega valor completo só em português.

**Independent Test**: Mudar o idioma e verificar que todos os textos do app refletem o novo idioma.

**Acceptance Scenarios**:

1. **Given** a tela de configurações, **When** o responsável seleciona "English" como idioma, **Then** todos os textos do app aparecem em inglês.
2. **Given** o idioma está em inglês, **When** o responsável troca para "Português", **Then** todos os textos voltam para português.

---

### Edge Cases

- O que acontece se a câmera não for acessível (permissão negada, dispositivo sem câmera)? O app deve exibir uma mensagem e oferecer um botão "Passar cartão" manual como fallback.
- O que acontece se a câmera ficar coberta por muito tempo durante a espera? O app deve ignorar coberturas muito curtas (menos de 1s) para evitar falsos positivos. Se ficar coberto por mais de 10s, exibir instrução na tela.
- O que acontece se a criança digitar um valor muito grande (mais de 6 dígitos)? Limitar a 6 dígitos (R$ 999.999,99).
- O que acontece se a criança não digitar nada e tentar confirmar? O botão confirmar deve ficar desabilitado enquanto o valor estiver vazio ou zero.
- O que acontece se o app perder o foco (receber uma ligação, por exemplo)? O app deve pausar a câmera e retomar de onde parou ao voltar.
- O que acontece se o dispositivo estiver no modo retrato vs paisagem? O app deve travar em modo retrato.

## Requirements

### Functional Requirements

- **FR-001**: O app DEVE exibir uma tela inicial simulando uma maquineta de cartão, com display e teclado numérico.
- **FR-002**: O app DEVE permitir que a criança digite um valor numérico usando o teclado na tela.
- **FR-003**: O app DEVE permitir corrigir o valor digitado (botão de limpar/apagar).
- **FR-004**: O app DEVE exibir as opções "Crédito" e "Débito" após a confirmação do valor.
- **FR-005**: O app DEVE ativar a câmera frontal e detectar quando a lente é coberta por mais de 1 segundo, disparando a "aproximação do cartão".
- **FR-006**: O app DEVE exibir uma tela de "Processando" com feedback visual e sonoro enquanto o resultado é definido.
- **FR-007**: O app DEVE determinar o resultado (aprovado ou recusado) com base em uma probabilidade configurável.
- **FR-008**: O app DEVE exibir uma tela de "Aprovado" com animação comemorativa (confete, emojis ou aplausos) e som.
- **FR-009**: O app DEVE exibir uma tela de "Recusado" com som e mensagem negativa.
- **FR-010**: O app DEVE voltar automaticamente para a tela inicial após 5 segundos na tela de resultado, ou ao tocar na tela.
- **FR-011**: O app DEVE incluir uma tela de configurações acessível por um ícone de engrenagem.
- **FR-012**: O app DEVE permitir configurar o modo de detecção da aproximação (qualquer objeto na câmera).
- **FR-013**: O app DEVE permitir configurar a chance de aprovação de 0% a 100%.
- **FR-014**: O app DEVE permitir ativar/desativar sons.
- **FR-015**: O app DEVE permitir ativar/desativar animações de confete.
- **FR-016**: O app DEVE permitir selecionar o tipo de animação de aprovação (confete, emojis subindo, ou aplausos).
- **FR-017**: O app DEVE permitir personalizar as cores da carcaça, botões e display da maquineta.
- **FR-018**: O app DEVE persistir todas as configurações entre sessões.
- **FR-019**: O app DEVE suportar português e inglês, alternando todos os textos conforme o idioma selecionado.
- **FR-020**: O app DEVE funcionar em tela cheia no celular, sem elementos de navegador visíveis.
- **FR-021**: O app DEVE funcionar offline, sem necessidade de conexão com a internet.
- **FR-022**: O app DEVE travar em orientação retrato.
- **FR-023**: O app DEVE fornecer fallback manual (botão "Passar cartão") se a câmera não estiver disponível.
- **FR-024**: O app NÃO DEVE coletar, armazenar ou transmitir nenhum dado pessoal ou de uso.
- **FR-025**: O app DEVE ter elementos de toque com tamanho mínimo adequado para crianças de 3 anos (alvos de toque de no mínimo 48px).

### Key Entities

- **Maquineta**: A representação visual do terminal de pagamento. Possui cor de carcaça, cor de botões e cor de display que podem ser personalizadas.
- **Configuração**: Preferências persistidas localmente no aparelho. Inclui modo de detecção, chance de aprovação, som ativado, confete ativado, tipo de animação, cores e idioma.
- **Cartão**: O objeto físico (mão, cartão de papel, etc.) que a criança usa para cobrir a câmera e simular a aproximação.
- **Transação**: Uma tentativa de pagamento. Contém valor, modalidade (crédito/débito), resultado (aprovado/recusado) e timestamp.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Uma criança de 3 anos consegue completar o fluxo completo de compra (iniciar → digitar valor → escolher crédito/débito → aproximar cartão → ver resultado) sem ajuda de um adulto.
- **SC-002**: A detecção da câmera cobre a aproximação em menos de 2 segundos após cobrir a lente.
- **SC-003**: 100% dos resultados (aprovado/recusado) são exibidos com feedback visual e sonoro.
- **SC-004**: Todas as configurações persistem entre sessões e refletem imediatamente no comportamento do app.
- **SC-005**: O app ocupa menos de 5MB de armazenamento no dispositivo.
- **SC-006**: O app não requer conexão com internet para funcionamento completo.

## Assumptions

- O usuário tem um celular Android ou iOS com câmera frontal e acesso ao navegador compatível com PWA.
- O usuário pode adicionar o app à tela inicial do celular para uso em tela cheia.
- A criança brinca supervisionada por um adulto que fará a configuração inicial.
- O app será usado exclusivamente em modo retrato.
- Sons são gerados sinteticamente (sem necessidade de baixar arquivos de áudio).
- As configurações são armazenadas localmente e não fazem backup ou sincronização.
- Detecção por QR Code e NFC estão fora de escopo para esta versão inicial (v0.5 usa apenas câmera coberta).
- Modo pintura e upload de imagem para personalização estão fora de escopo para esta versão.
