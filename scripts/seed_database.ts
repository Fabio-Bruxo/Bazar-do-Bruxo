import fs from 'fs';
import path from 'path';
import { query } from '../src/lib/db';

async function seedDatabase() {
  console.log('🔮 [O BAZAR DO BRUXO] Iniciando povoamento do banco de dados...');
  const seedPath = path.join(__dirname, '..', 'database', 'seed', '001_seed_data.sql');

  if (!fs.existsSync(seedPath)) {
    console.error(`❌ Arquivo de seed não encontrado em: ${seedPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(seedPath, 'utf-8');
  console.log('📜 Executando script SQL 001_seed_data.sql...');

  try {
    await query(sql);
    console.log('✅ Banco de dados populado com sucesso com os 20 produtos canônicos e configurações!');
  } catch (error: any) {
    console.error('❌ Erro ao executar seed:', error.message);
    process.exit(1);
  }
}

seedDatabase().catch((err) => {
  console.error('❌ Falha crítica no seed:', err);
  process.exit(1);
});
