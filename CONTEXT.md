# Maquineta

Simulador de maquineta de cartão para brincadeira infantil. App PWA focado em crianças pequenas (3+ anos), com interação física via câmera do celular.

## Language

**Maquineta**:
O aplicativo completo. Simula uma terminal de pagamento eletrônico.
_Avoid_: Terminal, POS, app de pagamento

**Cartão**:
Objeto que a criança usa para pagar. Pode ser um cartão de papel, um cartão NFC real, ou qualquer objeto que cubra a câmera.
_Avoid_: Card, NFC tag

**Valor**:
Quantia em reais digitada pela criança antes de pagar.
_Avoid_: Preço, total, montante

**Crédito**:
Modalidade de pagamento. Sempre aprovada com mais frequência.
_Avoid_: Credit

**Débito**:
Modalidade de pagamento. Pode ser recusada se saldo insuficiente (simulado).
_Avoid_: Debit

**Aproximar o cartão**:
Gesto de trazer o cartão até o celular. Detectado pela câmera (cobrir a lente) ou via NFC.
_Avoid_: Passar, inserir, chip

**Detecção por escurecimento**:
Método v0.5. A câmera frontal detecta quando algo cobre a lente (mão, cartão) e dispara a aproximação.
_Avoid_: Camera detection

**Detecção por QR Code**:
Método v1.0. A câmera reconhece um padrão visual no cartão de brinquedo para disparar a aproximação.
_Avoid_: Marker detection

**Detecção por NFC**:
Método v2.0. Usa a Web NFC API para detectar um cartão NFC real.
_Avoid_: Contactless, aproximação real

**Aprovado**:
Resultado positivo do pagamento. Exibe tela comemorativa com animação.
_Avoid_: Sucesso, confirmado

**Recusado**:
Resultado negativo do pagamento. Exibe tela com mensagem de recusa.
_Avoid_: Falhou, negado, erro

**Confete**:
Animação comemorativa na tela de aprovado. Pode ser desativado nas configurações.
_Avoid_: Festa, glitter

**Emojis subindo**:
Animação alternativa de aprovação. Emojis flutuam para cima na tela.
_Avoid_: Emoji rain

**Aplausos**:
Feedback sonoro de aprovação. Palmas ao fundo.
_Avoid_: Clapping
