# 🔑 Fluxo OAuth do Mercado Pago para Fornecedores — O Bazar do Bruxo

## 1. Visão Geral
Para habilitar o split nativo de pagamentos e permitir que artesãos e fornecedores recebam repasses diretamente em suas contas Mercado Pago, a plataforma disponibiliza o fluxo de autorização OAuth 2.0 em conformidade com as diretrizes do Mercado Pago Marketplace.

## 2. Arquitetura do Fluxo OAuth
```text
1. FORNECEDOR CLICA EM "CONECTAR MERCADO PAGO" NO PAINEL
   │
   ▼
2. GET /api/suppliers/oauth?supplierId=xyz
   │  Gera state criptográfico seguro
   │  Retorna authUrl do Mercado Pago:
   │  https://auth.mercadopago.com/authorization?client_id=...&response_type=code&state=...
   │
   ▼
3. FORNECEDOR AUTORIZA A APLICAÇÃO NO MERCADO PAGO
   │
   ▼
4. REDIRECIONAMENTO DE RETORNO COM AUTHORIZATION_CODE
   │  GET /api/suppliers/oauth?code=TG-xxxxx&state=...
   │
   ▼
5. TROCA DO CODE POR TOKENS (/oauth/token)
   │  Payload: grant_type=authorization_code, client_secret, code, redirect_uri
   │  Resposta: access_token, refresh_token, public_key, user_id, expires_in
   │
   ▼
6. PERSISTÊNCIA CIFRADA NO BANCO SUPABASE
   │  Tabela: suppliers
   │  Campos: mp_access_token (cifrado AES), mp_user_id, mp_public_key, mp_token_expires_at
   │
   ▼
7. STATUS: FORNECEDOR ATIVO E CONECTADO COM SUCESSO
```

## 3. Segurança e Criptografia de Chaves
- **Armazenamento Seguro:** As credenciais de acesso de terceiros (`access_token` e `refresh_token`) nunca são salvas em texto puro. Elas são criptografadas em repouso utilizando a chave mestre do sistema (`ENCRYPTION_KEY`).
- **Validação de State (CSRF):** O parâmetro `state` contém um nonce assinado com HMAC e expiração de 10 minutos para impedir ataques de Cross-Site Request Forgery.
- **Isolamento de Escopo:** O escopo solicitado é restrito a pagamentos e ordens comerciais (`read`, `write`, `offline_access`).

## 4. Renovação Automática de Tokens (Refresh Token)
Tokens do Mercado Pago expiram a cada 180 dias. O n8n Workflow 16 executa periodicamente a rotina de renovação:
```http
POST https://api.mercadopago.com/oauth/token
Content-Type: application/x-www-form-urlencoded

client_secret={{MP_CLIENT_SECRET}}&grant_type=refresh_token&refresh_token={{SUPPLIER_REFRESH_TOKEN}}
```
Os novos tokens são persistidos imediatamente na tabela `suppliers`, assegurando que a operação de split nunca seja interrompida por expiração de credenciais.

## 5. Desconexão de Conta
O fornecedor ou o administrador pode revogar a conexão a qualquer instante no painel administrativo:
- Os tokens armazenados são apagados da base de dados.
- O fornecedor é revertido para o modelo contábil de liquidação programada via transferência bancária manual/PIX direto.
