# 📖 Runbook de Operação Diária — O Bazar do Bruxo

## 1. Visão Geral
Este runbook estabelece os procedimentos padrões de operação, rotinas matinais, botões de pânico (kill-switches) e protocolos de resolução para os operadores e administradores d'**O Bazar do Bruxo**.

## 2. Rotina Matinal do Operador (Checklist Diário)
Todo início de expediente (até as 09h00), o operador deve executar os 4 passos essenciais:
1. **Acessar o Painel de Saúde (`/admin/dashboard` e `/api/health`):**
   - Verificar se todos os 6 semáforos estão `VERDE`:
     - Sistema Geral (`/api/health`)
     - Banco de Dados (`/api/database-health`)
     - Pagamentos (`/api/payment-health`)
     - WhatsApp (`/api/whatsapp-health`)
     - Fornecedores (`/api/supplier-health`)
     - Automações (`/api/automation-health`)
2. **Triagem de Chamados Humanos (`/admin/tickets`):**
   - Atender chamados com prioridade `URGENT` e `HIGH`.
   - Responder clientes retidos em modo humano e, após a resolução, desativar o silenciamento do bot.
3. **Auditoria de Pedidos em Atenção (`/admin/orders?status=MANUAL_REVIEW`):**
   - Pedidos com inconsistência de CEP, pagamento divergente ou endereço incompleto.
4. **Verificação de Conciliação Contábil (`/admin/financeiro`):**
   - Clicar em "Executar Reconciliação" e verificar se a discrepância é `R$ 0,00`.

## 3. Botões de Emergência (Kill-Switches)
Em caso de incidentes graves, o operador pode acionar interruptores mestres no painel `/admin/settings` ou via variáveis de ambiente:

### 3.1. `BOT_ENABLED = false`
- **Efeito:** Silencia imediatamente o Guardião do Bazar em 100% das conversas de WhatsApp.
- **Quando usar:** Respostas anômalas, bugs no motor determinístico ou manutenção programada da Evolution API.

### 3.2. `DROPSHIPPING_DISPATCH_ENABLED = false`
- **Efeito:** Suspende o envio automático de ordens de despacho para fornecedores. Os pedidos continuam sendo faturados, mas o encaminhamento fica retido em `HELD_FOR_REVIEW`.
- **Quando usar:** Fornecedor relata falta crítica de matéria-prima, suspeita de fraude em lote ou férias operacionais do parceiro.

### 3.3. `AUTOMATIC_SALES_ENABLED = false`
- **Efeito:** Coloca o checkout em "Modo Vitrine / Manutenção Sagrada", impedindo novas cobranças no gateway.
- **Quando usar:** Manutenções críticas de banco de dados ou auditorias contábeis extraordinárias.

## 4. Procedimento de Handoff e Atendimento Humano
Quando o cliente entra em modo `HUMAN`:
1. O bot para de responder imediatamente (`is_silenced = true`).
2. O operador abre o WhatsApp Corporativo oficial `(13) 99803-9867` ou interface de chat.
3. Se apresenta com o tom acolhedor e resolutivo do Bazar:
   > *"Saudações! Aqui é o Fabinho, guardião humano do Bazar do Bruxo. Recebi sua mensagem e vou cuidar pessoalmente do seu caso..."*
4. Após sanar a dúvida ou resolver a questão, alterar o status do ticket para `RESOLVED` no painel.

## 5. Rotina de Backup e Recuperação
- **Banco de Dados Supabase:** Backups automáticos diários (Point-in-Time Recovery - PITR).
- **Export Manual de Emergência:** Acessar o terminal e executar:
  ```bash
  supabase db dump -f backup_$(date +%Y%m%d).sql
  ```
- **Arquivos e Imagens:** Os buckets `product-images` e `supplier-proofs` contam com versionamento de objetos habilitado no Supabase Storage.
