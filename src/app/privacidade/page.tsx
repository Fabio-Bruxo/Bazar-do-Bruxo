import React from 'react';

export const metadata = {
  title: 'Política de Privacidade e LGPD | O Bazar do Bruxo',
  description: 'Conheça como protegemos seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).',
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs text-bazar-parchment/80 leading-relaxed font-sans">
      <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
        POLÍTICA DE PRIVACIDADE & LGPD
      </h1>
      <p className="font-editorial text-sm italic text-bazar-gold">Última atualização: Setembro de 2026</p>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">1. Compromisso com sua Privacidade</h2>
        <p>
          O Bazar do Bruxo valoriza a transparência e a segurança de todos os clientes, visitantes e membros do Círculo do Bazar. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos seus dados de acordo com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">2. Dados Coletados</h2>
        <p>
          Coletamos dados fornecidos diretamente por você para o processamento de encomendas e comunicação:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dados cadastrais: Nome completo, CPF, e-mail, telefone/WhatsApp e endereço completo de entrega.</li>
          <li>Dados de navegação e preferências: Resultados anônimos do Quiz de Cristais e histórico de produtos visitados.</li>
          <li>Dados de pagamento: Processados de forma criptografada por gateways bancários homologados pelo Banco Central. O Bazar não armazena códigos de segurança (CVV) nem senhas bancárias.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">3. Uso dos Dados</h2>
        <p>
          Seus dados são estritamente utilizados para: faturamento fiscal, despacho de mercadorias com Correios/transportadoras, notificações sobre o status da entrega e comunicações autorizadas sobre novos achados e conteúdos do Grimório. Nunca comercializamos seus dados com terceiros.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">4. Seus Direitos</h2>
        <p>
          Você pode, a qualquer momento, solicitar a confirmação, correção, anonimização ou exclusão definitiva de seus dados cadastrais enviando um e-mail para contato@obazardobruxo.com.br.
        </p>
      </section>
    </div>
  );
}
