import React from 'react';

export const metadata = {
  title: 'Política de Envio e Prazos | O Bazar do Bruxo',
  description: 'Informações sobre frete, prazos de entrega, frete grátis e embalagens protegidas.',
};

export default function PoliticaEnvioPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs text-bazar-parchment/80 leading-relaxed font-sans">
      <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
        POLÍTICA DE ENVIO & PRAZOS
      </h1>
      <p className="font-editorial text-sm italic text-bazar-gold">Embalagens protegidas e carinho no preparo</p>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">1. Prazos de Preparo e Despacho</h2>
        <p>
          Após a aprovação do pagamento, nossos artesãos separam, purificam e embalam seus itens com proteção especial em caixas reforçadas de papelão reciclado e almofadas de papel biodegradável. O prazo de postagem é de <strong>1 a 2 dias úteis</strong>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">2. Modalidades de Entrega</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>PAC Econômico:</strong> Prazo médio de 5 a 8 dias úteis para a maior parte do Brasil.</li>
          <li><strong>Sedex Expresso:</strong> Prazo médio de 1 a 3 dias úteis para capitais e regiões metropolitanas.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">3. Regra de Frete Grátis</h2>
        <p>
          Pedidos com valor subtotal a partir de <strong>R$ 199,00</strong> possuem frete grátis automático via modalidade PAC para todas as regiões do Brasil.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">4. Rastreamento</h2>
        <p>
          Assim que a encomenda for coletada pelos Correios, o código de rastreamento será enviado automaticamente para o seu e-mail e disponibilizado para consulta através de nosso canal de WhatsApp.
        </p>
      </section>
    </div>
  );
}
