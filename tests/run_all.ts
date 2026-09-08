import { testPaymentIdempotency } from './test_payment_idempotency';
import { testDropshippingSafety } from './test_dropshipping_safety';
import { testBotGuardiao } from './test_bot_guardiao';

async function runTestSuite() {
  console.log('=====================================================');
  console.log('🔮 O BAZAR DO BRUXO - SUÍTE DE TESTES AUTOMATIZADA MVP V1');
  console.log('=====================================================');

  const start = Date.now();

  const resPayment = await testPaymentIdempotency();
  const resDropship = await testDropshippingSafety();
  const resBot = await testBotGuardiao();

  const totalDuration = Date.now() - start;

  console.log('\n=====================================================');
  console.log('📊 RESUMO DA VALIDAÇÃO AUTOMATIZADA:');
  console.log(`• Idempotência de Pagamento:      ${resPayment ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`• Travas de Dropshipping:         ${resDropship ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`• Bot Guardião (Sem IA Paga):     ${resBot ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`⏱️ Tempo total de execução:       ${totalDuration}ms`);
  console.log('=====================================================');

  if (resPayment && resDropship && resBot) {
    console.log('🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!');
    process.exit(0);
  } else {
    console.error('⚠️ ALGUNS TESTES FALHARAM.');
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
