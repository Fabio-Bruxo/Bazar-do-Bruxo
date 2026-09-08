# 🛠️ MANUAL DE INSTALAÇÃO & INFRAESTRUTURA

## O BAZAR DO BRUXO — STACK SELF-HOSTED (MVP V1)

---

### 1. Arquitetura de Infraestrutura

A stack recomendada para o MVP V1 opera em contêineres Docker, reduzindo custos a zero e garantindo independência total de serviços de IA paga:

```
[ Cliente / WhatsApp ]
          │
          ▼
   [ Evolution API ]
          │
          ▼
[ Next.js 14 Webhooks ] <────> [ Mercado Pago Webhook ]
          │
     ┌────┴───────────────┐
     ▼                    ▼
[ PostgreSQL 16 ]     [ Redis 7 ]
     ▲
     │
[ n8n Workflows ] (Recuperação de Carrinho & Pós-Venda)
```

---

### 2. Configuração das Variáveis de Ambiente

Crie o arquivo `.env` na raiz da aplicação com base em `.env.example`:

```env
# Banco de Dados PostgreSQL
DATABASE_URL=postgresql://bazar_user:bazar_secret_password_2026@localhost:5432/bazar_bruxo

# Mercado Pago
MERCADOPAGO_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000
MERCADOPAGO_ACCESS_TOKEN=TEST-00000000-0000-0000-0000-000000000000
MERCADOPAGO_WEBHOOK_SECRET=bazar_secret_hmac_2026

# WhatsApp & Guardião do Bazar
WHATSAPP_PROVIDER=EVOLUTION_API
EVOLUTION_API_ENDPOINT=http://localhost:8080
EVOLUTION_API_KEY=bazar_evolution_key_2026
EVOLUTION_API_INSTANCE=bazar-guardiao
WHATSAPP_WEBHOOK_VERIFY_TOKEN=bazar_bruxo_token_2026

# IA Generativa Desativada
AI_ENABLED=false
```

---

### 3. Subindo o Ambiente com Docker Compose

Na raiz do projeto:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Verifique se todos os contêineres estão saudáveis:
```bash
docker compose -f docker/docker-compose.yml ps
```

---

### 4. Executando as Migrações e Seed do Banco

Com o contêiner do Postgres ativo:

```bash
# Aplica o esquema de 30+ tabelas canônicas
docker exec -i bazar_postgres psql -U bazar_user -d bazar_bruxo < database/migrations/001_initial_schema.sql

# Aplica o catálogo de 20 produtos, categorias, fornecedores e usuário admin
docker exec -i bazar_postgres psql -U bazar_user -d bazar_bruxo < database/seed/001_seed_data.sql
```

---

### 5. Configuração do Webhook do Mercado Pago

1. Acesse o portal de desenvolvedores do Mercado Pago.
2. Em **Webhooks**, cadastre a URL da sua aplicação em produção:
   `https://obazardobruxo.com.br/api/webhooks/mercadopago`
3. Habilite os eventos: `payment`.
4. Copie o segredo gerado e insira em `MERCADOPAGO_WEBHOOK_SECRET`.

---

### 6. Configuração do n8n (Workflows Automatizados)

1. Acesse `http://localhost:5678`.
2. Importe os arquivos JSON contidos na pasta `automation/n8n/`:
   - `recuperacao_carrinho.json`
   - `pos_venda.json`
   - `alertas_operacionais.json`
3. Configure as credenciais do nó PostgreSQL e ative os fluxos.
