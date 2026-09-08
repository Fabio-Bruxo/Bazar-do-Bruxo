import React from 'react';
import Link from 'next/link';
import { Sparkles, Moon, Compass, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Sobre Nós | O Bazar do Bruxo',
  description: 'Conheça a história e o conceito de O Bazar do Bruxo: um antigo bazar mágico, reinventado para a vida moderna.',
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase">
          Nossa Origem & Propósito
        </span>
        <h1 className="font-mystic text-3xl sm:text-5xl font-extrabold text-bazar-parchment uppercase">
          O BAZAR DO BRUXO
        </h1>
        <p className="font-editorial italic text-lg sm:text-xl text-bazar-gold">
          Tudo para o seu ritual.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base text-bazar-parchment/85 leading-relaxed font-editorial">
        <p className="text-lg text-bazar-parchment font-semibold">
          &ldquo;Algumas coisas simplesmente encontram você.&rdquo;
        </p>
        <p>
          O Bazar do Bruxo nasceu de uma inquietação com a pressa e a frieza do mundo digital. Em meio a notificações constantes, algoritmos acelerados e telas brilhantes, percebemos que o ser humano moderno ansiava por pausas que tivessem peso, textura, aroma e intenção real.
        </p>
        <p>
          Inspirados nos antigos bazares de especiarias e minerais de tempos esquecidos — onde cada prateleira guardava uma história e cada objeto parecia ter sido deixado ali para uma pessoa específica —, recriamos esse espaço para os dias de hoje.
        </p>

        <h2 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-gold pt-4">
          Não é Apenas um Objeto. É um Ponto de Ancoragem.
        </h2>
        <p>
          Não acreditamos em fórmulas mágicas milagrosas que resolvem a vida sem esforço humano. Para nós, um cristal de Ametista, um incenso botânico enrolado à mão ou a chama silenciosa de uma vela de cera de soja são âncoras sensoriais. Eles lembram você de respirar fundo antes de uma reunião difícil, de acolher seus próprios erros com gentileza e de consagrar um momento de quietude antes do sono.
        </p>

        <h2 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-gold pt-4">
          Curadoria Ética & Respeito à Terra
        </h2>
        <p>
          Todos os nossos minerais provêm de garimpos nacionais éticos, sem tratamentos tóxicos que mascarem sua identidade natural. Nossos incensos são feitos de pós de madeira nobre e plantas puras, sem carvão derivado de pólvora ou solventes artificiais.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-bazar-charcoal-light border border-bazar-gold/40 text-center space-y-4 shadow-mystic">
        <h3 className="font-mystic text-lg font-bold text-bazar-parchment uppercase">
          Pronto para encontrar o seu ritual?
        </h3>
        <p className="text-xs sm:text-sm text-bazar-parchment/70 max-w-md mx-auto">
          Faça nosso Quiz Intuitivo ou explore nosso catálogo de minerais e kits prontos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl bg-bazar-gold text-bazar-charcoal text-xs font-bold tracking-widest uppercase hover:bg-bazar-gold-light transition-colors"
          >
            DESCOBRIR MEU CRISTAL
          </Link>
          <Link
            href="/cristais"
            className="px-6 py-3 rounded-xl bg-bazar-charcoal border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment text-xs font-bold tracking-widest uppercase transition-colors"
          >
            ENTRAR NO BAZAR
          </Link>
        </div>
      </div>
    </div>
  );
}
