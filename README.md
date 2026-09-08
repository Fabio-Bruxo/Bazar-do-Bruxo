# 🌙 O BAZAR DO BRUXO — MVP V1

> **"Tudo para o seu ritual."**
> E-commerce New Age, Místico e Humanizado integrado ao bot operacional determinístico **O Guardião do Bazar** (100% sem IA generativa paga).

---

## 🔮 1. Visão Geral do Projeto

O Bazar do Bruxo é uma máquina comercial completa desenhada para unir o encantamento do universo místico ancestral com a robustez e eficiência da engenharia de software moderna.

### 🌟 Destaques Principais:
1. **Frontend Completo Next.js 14 App Router:**
   - 9 blocos estratégicos na Home: Hero, Categorias, Destaques, Altar do Mês, Ofertas Místicas, Quiz de Arquétipos, Avaliações Humanizadas, Grimório de Saberes e Rodapé Encantado.
   - Navegação por categorias (`/cristais`, `/incensos-aromas`, `/ervas-natureza`, `/rituais`, `/bruxaria`, `/energia`, `/casa-mistica`, `/presentes`, `/kits`).
   - Página de produto com copy de conformidade legal e encantamento (O que é, Por que te chamou, Simbolismo, Como usar, Cuidados técnicos).
   - Quiz interativo (`/quiz`) com 6 arquétipos, pontuação em tempo real, captação de leads e cupom sagrado.
   - Blog Grimório (`/grimorio`) com conteúdo SEO, links cruzados e FAQ integrado.
   - Funil de Alta Conversão com Order Bump no checkout, PIX instantâneo e Upsell pós-compra (`/checkout/sucesso/[orderId]`).
   - Santuário do Cliente com Login 1-clique demonstrativo (Helena Ravena), Histórico e Rastreamento de Pedidos.

2. **O Guardião do Bazar (WhatsApp Bot sem IA Paga):**
   - 100% determinístico (`AI_ENABLED=false`). Opera através de máquina de estados finitos (FSM), regex, palavras-chave e menus (1 a 7).
   - Busca em tempo real no catálogo, recomendações por orçamento, rastreamento de pedidos e dúvidas frequentes.
   - **Regra de Ouro do Atendimento Humano:** ao transferir para operador humano (`FALAR_HUMANO`, `PROBLEMA_FINANCEIRO`, `PRODUTO_DANIFICADO`), o robô entra em **silêncio absoluto** até que um operador humano reative o fluxo.
   - Simulador interativo disponível diretamente na rota `/guardiao`.

3. **Segurança Financeira & Idempotência:**
   - Webhook Mercado Pago com validação de assinatura HMAC SHA256 e chave de idempotência (`MERCADOPAGO_<id>`). Previne cliques duplicados e execuções repetidas.
   - Frontend desacoplado de mutações de status financeiro: pedidos só transitam para `PAID` via webhook validado.

4. **Travas Estritas de Dropshipping:**
   - Nenhum pedido é encaminhado ao fornecedor sem aprovação prévia do pagamento.
   - Validação de integridade de endereço de entrega (logradouro, número, bairro, cidade, UF, CEP).
   - Validação contínua de margem de lucro mínima (se o custo subir e a margem cair abaixo do mínimo permitido, transita imediatamente para `MANUAL_REVIEW`).

5. **Painel Administrativo & Gestão de Exceções:**
   - Central **"PRECISA DA SUA ATENÇÃO"** (`/admin/excecoes`) para resolução ágil de travas operacionais.
   - Fila de Suporte Humano (`/admin/tickets`) com histórico e botão de reativação do bot.
   - **3 Botões de Emergência Globais:** *Pausar Bot*, *Pausar Vendas Automáticas*, *Pausar Envio a Fornecedores*.

---

## 🚀 2. Como Executar o Projeto

### Pré-requisitos:
- Node.js 18+ (recomendado 20+)
- Docker & Docker Compose (opcional para rodar com Postgres, Redis e n8n)

### Instalação Rápida:
```bash
# 1. Clonar repositório e entrar no diretório
cd "O Bazar do Bruxo"

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local

# 4. Executar suíte de testes automatizada
npm test

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🐳 3. Orquestração Docker (Produção & Auto-hospedagem)

Para iniciar todos os serviços (PostgreSQL 16, Redis 7, n8n e Aplicação Next.js):

```bash
docker compose -f docker/docker-compose.yml up -d
```

### Serviços Inicializados:
- **Aplicação Next.js:** [http://localhost:3000](http://localhost:3000)
- **PostgreSQL 16:** `localhost:5432` (banco: `bazar_bruxo`)
- **Redis 7:** `localhost:6379`
- **n8n Workflow Automation:** [http://localhost:5678](http://localhost:5678)

Para aplicar as migrações e dados de semente:
```bash
docker exec -i bazar_postgres psql -U bazar_user -d bazar_bruxo < database/migrations/001_initial_schema.sql
docker exec -i bazar_postgres psql -U bazar_user -d bazar_bruxo < database/seed/001_seed_data.sql
```

---

## 🧪 4. Suíte de Testes Automatizada

O projeto conta com validação automatizada de ponta a ponta sem necessidade de dependências externas:

```bash
npm test
```

A suíte testa:
- ✅ **Idempotência de Pagamento:** Garante deduplicação de webhooks do gateway.
- ✅ **Travas de Dropshipping:** Bloqueia pedidos não pagos, endereços incompletos e margens negativas.
- ✅ **Bot Guardião do Bazar:** Valida saudações, catálogo, orçamento, handoff humano, silêncio do bot e reativação.

---

## 📚 5. Documentação Adicional

- [Manual Administrativo](docs/MANUAL_ADMIN.md)
- [Manual de Instalação e Infraestrutura](docs/MANUAL_INSTALACAO.md)
- [Manual de Recuperação e Continuidade](docs/MANUAL_RECUPERACAO.md)
