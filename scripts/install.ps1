# =========================================================
# O BAZAR DO BRUXO — SCRIPT DE INSTALAÇÃO (WINDOWS POWERSHELL)
# =========================================================
$ErrorActionPreference = "Stop"

Write-Host "🔮 [O BAZAR DO BRUXO] Iniciando instalacao e configuracao do ambiente..." -ForegroundColor Cyan

# 1. Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js nao foi encontrado. Por favor instale Node.js 18 ou superior." -ForegroundColor Red
    exit 1
}

$nodeVer = node -v
Write-Host "✅ Node.js detectado: $nodeVer" -ForegroundColor Green

# 2. Configurar .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "📄 Criando .env.local a partir de .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "⚠️ Revise as chaves no .env.local se desejar conectar ao Supabase ou Mercado Pago em producao." -ForegroundColor Yellow
} else {
    Write-Host "✅ Arquivo .env.local ja existente." -ForegroundColor Green
}

# 3. Instalar dependencias
Write-Host "📦 Instalando dependencias npm..." -ForegroundColor Cyan
npm install

# 4. Executar testes
Write-Host "🧪 Executando suite de testes de integridade..." -ForegroundColor Cyan
npm test

# 5. Compilar o projeto
Write-Host "🏗️ Compilando o projeto Next.js..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Magenta
Write-Host "🎉 [O BAZAR DO BRUXO] Instalacao concluida com sucesso!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Magenta
Write-Host "👉 Para iniciar o servidor de desenvolvimento:" -ForegroundColor Yellow
Write-Host "   npm run dev"
Write-Host "👉 Para iniciar a stack Docker (PostgreSQL + Redis + n8n):" -ForegroundColor Yellow
Write-Host "   docker compose up -d"
Write-Host "👉 Painel Administrativo:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/admin"
Write-Host "   Usuario: fabinhojr6336@gmail.com"
Write-Host "   Senha:   osolealua15"
Write-Host "👉 WhatsApp de Atendimento Corporativo: (13) 99803-9867" -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Magenta
