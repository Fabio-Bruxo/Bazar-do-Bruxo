#!/usr/bin/env bash
# =========================================================
# O BAZAR DO BRUXO — SCRIPT DE INSTALAÇÃO (LINUX / MACOS)
# =========================================================
set -e

echo "🔮 [O BAZAR DO BRUXO] Iniciando instalação e configuração do ambiente..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não foi encontrado. Por favor instale Node.js 18 ou superior."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js detectado: $NODE_VERSION"

# 2. Configurar arquivo de ambiente caso não exista
if [ ! -f ".env.local" ]; then
    echo "📄 Criando .env.local a partir de .env.example..."
    cp .env.example .env.local
    echo "⚠️ Por favor, revise as chaves no .env.local se desejar conectar ao Supabase ou Mercado Pago em produção."
else
    echo "✅ Arquivo .env.local já existente."
fi

# 3. Instalar dependências npm
echo "📦 Instalando dependências npm..."
npm install

# 4. Executar suíte de testes de integridade
echo "🧪 Executando suíte de testes do sistema..."
npm test

# 5. Build de verificação de tipos e produção
echo "🏗️ Compilando o projeto Next.js..."
npm run build

echo ""
echo "========================================================="
echo "🎉 [O BAZAR DO BRUXO] Instalação concluída com sucesso!"
echo "========================================================="
echo "👉 Para iniciar o servidor de desenvolvimento:"
echo "   npm run dev"
echo "👉 Para iniciar a stack Docker (PostgreSQL + Redis + n8n):"
echo "   docker compose up -d"
echo "👉 Painel Administrativo:"
echo "   http://localhost:3000/admin"
echo "   Usuário: fabinhojr6336@gmail.com"
echo "   Senha:   osolealua15"
echo "👉 WhatsApp de Atendimento Corporativo: (13) 99803-9867"
echo "========================================================="
