# 🛡️ MANUAL DE RECUPERAÇÃO & CONTINUIDADE OPERACIONAL

## O BAZAR DO BRUXO — PLANO DE CONTINGÊNCIA (MVP V1)

---

### 1. Falha de Webhook ou Instabilidade de Gateway de Pagamento

#### Cenário:
O cliente realizou o pagamento via PIX ou Cartão, o valor foi debitado, porém o webhook do Mercado Pago não atingiu a aplicação ou retornou erro temporário de rede.

#### Procedimento de Resolução:
1. Acesse o portal Mercado Pago ou a tela de transações bancárias.
2. Localize o `ID de Pagamento` no Mercado Pago.
3. No painel do Bazar, acesse `/admin/excecoes`.
4. Caso o pedido esteja pendente, utilize o endpoint de reprocessamento manual ou abra o pedido em `/admin/pedidos` e clique em **Aprovar Pagamento Manualmente**.
5. O sistema registrará um evento `MANUAL_PAYMENT_APPROVAL` na tabela `audit_logs` com o ID do administrador responsável.

---

### 2. Pedidos Travados em `MANUAL_REVIEW`

O sistema foi arquitetado segundo o princípio de **segurança máxima em caso de dúvida**:
- Se houver divergência no custo de aquisição do fornecedor.
- Se o endereço informado pelo cliente for incompleto.
- Se o fornecedor estiver marcado como inativo.

#### Procedimento de Resolução:
1. Acesse `/admin/excecoes`.
2. Verifique o motivo da trava descrito no card do pedido.
3. **Se for endereço incompleto:** entre em contato com o cliente via WhatsApp pelo link do card, colete o CEP e número corretos, atualize o cadastro e clique em **Liberar Pedido**.
4. **Se for aumento de custo de fornecedor:**
   - Se a nova margem ainda for aceitável: clique em **Liberar Pedido**.
   - Se o prejuízo for inviável: clique em **Cancelar / Estornar**. O cliente será reembolsado e notificado pelo Guardião ou WhatsApp.

---

### 3. Recuperação de Carrinhos Abandonados

O fluxo de recuperação é executado a cada 30 minutos pelo n8n (`automation/n8n/recuperacao_carrinho.json`):
- Filtra carrinhos ativos com mais de 30 minutos sem atividade.
- Limita o envio a no máximo **2 tentativas de recuperação** para não gerar incômodo ao cliente.
- Envia mensagem humanizada e mística contendo o cupom `PRIMEIRORITUAL` (10% de desconto adicional).
- Se o cliente responder à mensagem, o Guardião do Bazar assume a conversa e auxilia no esclarecimento de dúvidas.

---

### 4. Rotina de Backup e Restauração do Banco de Dados

#### Backup Diário:
```bash
docker exec bazar_postgres pg_dump -U bazar_user bazar_bruxo > backup_bazar_$(date +%Y%m%d).sql
```

#### Restauração a partir do Backup:
```bash
docker exec -i bazar_postgres psql -U bazar_user -d bazar_bruxo < backup_bazar_20260908.sql
```
