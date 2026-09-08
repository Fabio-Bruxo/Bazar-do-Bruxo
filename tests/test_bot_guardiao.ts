import { GuardiaoEngine } from '../src/services/bot/guardiao_engine';
import { memoryStore } from '../src/lib/db';

export async function testBotGuardiao(): Promise<boolean> {
  console.log('\n--- [TEST] 3. GUARDIÃO DO BAZAR (BOT DETERMINÍSTICO SEM IA PAGA) ---');

  const testPhone = '5511988887777';

  // 1. Saudação inicial
  const r1 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: 'Olá, bom dia!',
  });
  console.log('1. Teste Saudação -> Intenção detectada:', r1.intent);
  if (r1.intent !== 'SAUDACAO' || !r1.reply?.includes('O Guardião do Bazar')) {
    console.error('❌ Falha na resposta de saudação.');
    return false;
  }

  // 2. Opção 1 do Menu (Catálogo)
  const r2 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: '1',
  });
  console.log('2. Teste Menu 1 -> Intenção detectada:', r2.intent);
  if (r2.intent !== 'BUSCA_PRODUTO' || !r2.reply?.includes('Destaques do Catálogo')) {
    console.error('❌ Falha na resposta da opção 1 do menu.');
    return false;
  }

  // 3. Busca específica de produto (Ametista)
  const r3 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: 'Vocês têm drusa de ametista?',
  });
  console.log('3. Teste Busca Palavra-Chave -> Intenção detectada:', r3.intent);
  if (r3.intent !== 'BUSCA_PRODUTO' || !r3.reply?.includes('Ametista')) {
    console.error('❌ Falha na busca por produto.');
    return false;
  }

  // 4. Recomendação por orçamento
  const r4 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: 'Quero um presente até 50 reais',
  });
  console.log('4. Teste Orçamento -> Intenção detectada:', r4.intent);
  if (r4.intent !== 'RECOMENDACAO_ORCAMENTO' || !r4.reply?.includes('50.00')) {
    console.error('❌ Falha na recomendação por orçamento.');
    return false;
  }

  // 5. Transferência para Suporte Humano
  const r5 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: 'Quero falar com um atendente humano',
  });
  console.log('5. Teste Handoff Humano -> Modo:', r5.mode, '| Silenciado:', r5.silenced, '| Ticket:', r5.ticketCreated);
  if (r5.mode !== 'HUMAN' || !r5.silenced || !r5.ticketCreated) {
    console.error('❌ Falha no transbordo para atendimento humano.');
    return false;
  }

  // 6. REGRA DE OURO: Mensagem subsequente com bot silenciado NÃO deve produzir resposta automática
  const r6 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: 'Olá, tem alguém aí?',
  });
  console.log('6. Teste Silêncio do Bot -> Reply retornado:', r6.reply);
  if (r6.reply !== null || !r6.silenced) {
    console.error('❌ Falha na regra de silêncio: o bot respondeu após transbordo para humano!');
    return false;
  }

  // 7. Reativação do Bot pelo Atendente Humano
  const resumed = await GuardiaoEngine.resumeBotConversation(testPhone);
  console.log('7. Reativação pelo Atendente:', resumed);
  if (!resumed) {
    console.error('❌ Falha ao reativar bot.');
    return false;
  }

  // 8. Confirma que o bot volta a responder após reativação
  const r8 = await GuardiaoEngine.processMessage({
    phone: testPhone,
    message: 'Menu',
  });
  console.log('8. Teste Pós-Reativação -> Reply retornado:', !!r8.reply);
  if (!r8.reply || r8.silenced) {
    console.error('❌ Bot não respondeu após ser reativado pelo operador.');
    return false;
  }

  console.log('✅ TESTE DO GUARDIÃO DO BAZAR (SEM IA PAGA): APROVADO COM SUCESSO!');
  return true;
}
