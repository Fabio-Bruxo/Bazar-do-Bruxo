# 📖 MANUAL OPERACIONAL DO ADMINISTRADOR

## O BAZAR DO BRUXO — PAINEL DE CONTROLE E GESTÃO

---

### 1. Acesso ao Painel

- **URL de Acesso:** `/admin`
- **Credenciais de Teste / Demo:**
  - E-mail: `admin@obazardobruxo.com.br`
  - Senha: `admin123`

---

### 2. Visão Geral das Telas Administrativas

1. **Dashboard Principal (`/admin`):**
   - Resumo de métricas comerciais: Faturamento Bruto, Pedidos Concluídos, Ticket Médio e Taxa de Aceite de Upsell/Order Bump.
   - Alerta visual imediato caso existam produtos pendentes de revisão regulatória ou fiscal.
   - Acesso rápido para todas as seções do sistema.

2. **Gestão de Pedidos (`/admin/pedidos`):**
   - Lista completa de pedidos com filtros por status (`WAITING_PAYMENT`, `PAID`, `SHIPPED`, `MANUAL_REVIEW`, `CANCELLED`).
   - Detalhes de itens, método de pagamento, cupom aplicado e dados do cliente.

3. **Catálogo & Custos (`/admin/produtos`):**
   - Controle de preços de venda, preços promocionais e custo de aquisição.
   - Sinalização de status comercial (`ativo`, `revisao`, `restrito`, `inativo`).
   - Margem bruta em percentual e valor real.

4. **Dropshipping & Fornecedores (`/admin/dropshipping`):**
   - Monitoramento de integrações de fornecedores externos.
   - Status de envio dos pedidos terceirizados.
   - Indicadores de prazo médio de postagem e custo de frete base.

5. **Central de Exceções — "PRECISA DA SUA ATENÇÃO" (`/admin/excecoes`):**
   - Painel prioritário onde caem todos os pedidos com status `MANUAL_REVIEW`.
   - Motivos comuns de travamento automático de segurança:
     - Endereço incompleto ou com divergência de CEP.
     - Aumento repentino de custo do fornecedor (violação da margem mínima permitida).
     - Divergência de valores de pagamento recebidos pelo gateway.
   - Ações disponíveis: *Liberar Pedido Manualmente* ou *Cancelar / Estornar*.

6. **Fila de Atendimento Humano (`/admin/tickets`):**
   - Recebe as conversas transbordadas pelo bot do WhatsApp (Guardião do Bazar).
   - Exibe a última mensagem do cliente e o motivo do transbordo.
   - Botão para abrir o WhatsApp Web diretamente com o cliente.
   - Botão **"Resolver e Reativar Bot"**: finaliza o chamado humano e devolve a conversa para o Guardião continuar atendendo automaticamente.

---

### 3. Botões de Emergência Operacional

Localizados no topo de `/admin/excecoes`, os botões de emergência permitem controle total imediato sem necessidade de intervenção técnica em código:

- 🔴 **PAUSAR BOT (BOT_ENABLED):** Desliga o Guardião do Bazar no WhatsApp. Nenhuma resposta automática é emitida.
- 🔴 **PAUSAR VENDAS AUTOMÁTICAS (AUTOMATIC_SALES_ENABLED):** Trava a finalização de compras no checkout da loja virtual caso haja instabilidade em gateways ou problemas graves de estoque.
- 🔴 **PAUSAR ENVIO A FORNECEDORES (DROPSHIPPING_DISPATCH_ENABLED):** Mantém as vendas ocorrendo normalmente, mas envia todos os pedidos com dropshipping para a fila de `MANUAL_REVIEW`, impedindo despachos automáticos a terceiros.

Todas as alterações nesses botões geram registros invioláveis na tabela `audit_logs`.
