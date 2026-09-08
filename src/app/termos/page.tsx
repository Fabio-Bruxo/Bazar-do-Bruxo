import React from 'react';

export const metadata = {
  title: 'Termos de Uso | O Bazar do Bruxo',
  description: 'Termos e condições gerais de uso e navegação na loja virtual O Bazar do Bruxo.',
};

export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs text-bazar-parchment/80 leading-relaxed font-sans">
      <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
        TERMOS DE USO
      </h1>
      <p className="font-editorial text-sm italic text-bazar-gold">Última atualização: Setembro de 2026</p>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e realizar compras no site O Bazar do Bruxo (obazardobruxo.com.br), você concorda com as condições e diretrizes aqui descritas.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">2. Natureza dos Produtos e Isenção Médica</h2>
        <p>
          Os minerais, cristais, incensos, velas e instrumentos comercializados são objetos de contemplação simbólica, decoração e bem-estar. Nenhuma descrição contida no site ou no Grimório deve ser interpretada como promessa de cura, diagnóstico ou tratamento médico. A prática de autocuidado místico não substitui consultas e tratamentos médicos convencionais.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">3. Autenticidade dos Minerais</h2>
        <p>
          Garantimos a autenticidade mineral de nossas pedras brutas e lapidadas. Por se tratarem de elementos formados pela natureza ao longo de milhões de anos, variações em veios, ranhuras, peso e coloração são marcas esperadas de sua pureza e originalidade.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">4. Preços e Disponibilidade</h2>
        <p>
          Os preços exibidos estão sujeitos a alteração sem aviso prévio. Reservamo-nos o direito de corrigir eventuais erros de digitação e cancelar pedidos cujos valores tenham sido afetados por falhas técnicas manifestas, realizando o reembolso integral imediato.
        </p>
      </section>
    </div>
  );
}
