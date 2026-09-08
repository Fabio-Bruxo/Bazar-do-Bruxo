import React from 'react';

export const metadata = {
  title: 'Trocas e Devoluções | O Bazar do Bruxo',
  description: 'Conheça nossa política humanizada de trocas e devoluções em até 7 dias corridos.',
};

export default function TrocasDevolucoesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs text-bazar-parchment/80 leading-relaxed font-sans">
      <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
        POLÍTICA DE TROCAS & DEVOLUÇÕES
      </h1>
      <p className="font-editorial text-sm italic text-bazar-gold">Humanização e respeito ao seu momento</p>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">1. Direito de Arrependimento (7 Dias)</h2>
        <p>
          Em conformidade com o Artigo 49 do Código de Defesa do Consumidor, você possui até <strong>7 (sete) dias corridos</strong> após o recebimento da sua encomenda para solicitar a devolução ou troca do produto, por qualquer motivo, sem custos de postagem.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">2. Condições do Produto</h2>
        <p>
          O item devolvido deve estar acompanhado da embalagem original, sem sinais de queda ou quebra por mau uso e com todos os acessórios ou cristais complementares do kit intactos.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">3. Como Solicitar</h2>
        <p>
          Basta entrar em contato pelo nosso <a href="https://wa.me/5513998039867" target="_blank" rel="noreferrer" className="text-bazar-gold underline hover:text-bazar-gold-light">WhatsApp oficial (13 99803-9867)</a> ou enviar um e-mail para contato@obazardobruxo.com.br informando o número do seu pedido e o motivo da troca. Nossa equipe emitirá a autorização de postagem reversa gratuita dos Correios em até 24 horas úteis.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase">4. Reembolso</h2>
        <p>
          Para compras pagas via PIX, a restituição ocorre em até 2 dias úteis após a conferência do pacote em nosso ateliê. Para pagamentos via cartão de crédito, o estorno é emitido junto à operadora do cartão em até 1 fatura subsequente.
        </p>
      </section>
    </div>
  );
}
