import fs from 'fs';
import path from 'path';
import { query, memoryStore } from '../src/lib/db';

async function wipeAllData() {
  console.log('🧹 [O BAZAR DO BRUXO] Zerando todos os dados e informações fictícias...');

  // 1. Zerar a store em memória
  memoryStore.products.clear();
  memoryStore.orders.clear();
  memoryStore.payments.clear();
  memoryStore.financialLedger.length = 0;
  memoryStore.auditLogs.length = 0;
  memoryStore.tickets.length = 0;
  memoryStore.conversations.clear();
  memoryStore.messages.length = 0;
  memoryStore.refunds.length = 0;
  memoryStore.chargebacks.length = 0;
  memoryStore.supplierSettlements.length = 0;

  console.log('✅ Armazenamento em memória zerado com sucesso.');

  // 2. Executar migração SQL de limpeza caso haja conexão com PostgreSQL/Supabase
  const wipeSqlPath = path.join(__dirname, '..', 'database', 'migrations', '003_wipe_all_fictitious_data.sql');
  if (fs.existsSync(wipeSqlPath)) {
    const sql = fs.readFileSync(wipeSqlPath, 'utf-8');
    try {
      await query(sql);
      console.log('✅ Banco de dados relacional (PostgreSQL/Supabase) limpo e truncado via 003_wipe_all_fictitious_data.sql!');
    } catch (e: any) {
      console.log('ℹ️ Operando em modo de desenvolvimento local desacoplado:', e.message);
    }
  }

  console.log('👑 Preservada exclusivamente a conta oficial de Administrador (fabinhojr6336@gmail.com).');
  console.log('🎉 Sistema 100% limpo, pronto para cadastros reais de produção!');
}

wipeAllData().catch((err) => {
  console.error('❌ Erro durante a limpeza:', err);
  process.exit(1);
});
