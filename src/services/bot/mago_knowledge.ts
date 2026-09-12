/**
 * Sabedoria Arcana do Guardião do Bazar
 * Fundamentada nos tratados de Magia, Encantamentos e Feitiçaria (Antiguidade Mesopotâmica,
 * Egípcia, Greco-Romana, Tradições Druídicas, Astromagia Afonsina e Sabedoria de Ifá e Jurema).
 */

export interface MysticTopic {
  id: string;
  keywords: string[];
  title: string;
  response: string;
  suggestedItems?: { name: string; slug: string; price: number }[];
}

export const MYSTIC_TOPICS: MysticTopic[] = [
  // 1. CONSAGRAÇÃO E ATIVAÇÃO DE CRISTAIS / AMULETOS
  {
    id: 'consagracao',
    keywords: ['consagrar', 'consagracao', 'ativar cristal', 'como ativo', 'como consagrar', 'ativar amuleto', 'energizar pedra', 'consagracao de pedra'],
    title: 'A Arte da Consagração e o Poder do Verbo (Heka)',
    response: `🕯️ *A Sagrada Arte da Consagração pelo Verbo e Intenção:*

Na tradição egípcia ancestral, a magia chama-se *Heka*: a força cósmica primordial em que criar é *falar com a força da vida (Ka)*. Consagrar um instrumento ou cristal significa despertá-lo de sua inércia material para que ele se torne um *Ṣalmu* — uma presença viva de poder e proteção.

*Como consagrar seu amuleto no Bazar:*
1. **Purificação Prévia:** Lave a pedra em água corrente (se a densidade mineral permitir) ou passe-a pela fumaça purificadora de um incenso de sálvia branca, alecrim ou mirra.
2. **Conexão com os Quatro Elementos:** Posicione o item diante de uma chama (Fogo), sal ou terra (Terra), fumaça sagrada (Ar) e uma taça de água pura (Água).
3. **O Sopro e a Palavra:** Segure a peça entre as palmas das mãos, respire profundamente e sopre suavemente sobre ela três vezes (o sopro divino, *pneuma*).
4. **O Verbo Ativador:** Pronuncie em voz firme o seu intento:
_“Pelo sopro da vida e pela luz da criação, eu consagro este amuleto para que seja fonte de clareza, proteção e equilíbrio em minha jornada. Que assim seja e assim se faça!”_

Guarde-o em seu altar ou leve-o consigo como seu talismã pessoal.`,
    suggestedItems: [
      { name: 'Drusa de Ametista Natural', slug: 'ametista-drusa-natural', price: 89.9 },
      { name: 'Incenso Sagrado Sálvia Branca & Lavanda', slug: 'incenso-salvia-branca', price: 32.9 },
      { name: 'Kit Altar Sagrado Completo', slug: 'kit-altar-sagrado', price: 168.0 },
    ],
  },

  // 2. LIMPEZA ENERGÉTICA E DA CASA
  {
    id: 'limpeza_casa',
    keywords: ['limpar casa', 'limpeza energetica', 'energia ruim', 'pesada', 'descarrego', 'defumar casa', 'defumacao', 'mau olhado', 'inveja', 'pesado'],
    title: 'A Purificação do Lar e os Rituais Apotropaicos',
    response: `🌿 *A Sabedoria dos Defumadores e a Proteção do Lar:*

Desde as câmaras da Mesopotâmia até as cidades sagradas da Jurema Encantada, os sábios sempre souberam: o lar é o nosso templo de descanso. Quando as energias do ambiente se tornam densas, é preciso fazer a fumaça sagrada circular no *thymiaterion* (incensário ritual).

*Ritual Prático do Guardião para Purificar seu Espaço:*
1. **Abertura e Desbloqueio:** Abra janelas e portas para que o ar estagnado possa escoar.
2. **A Fumaça de Banimento:** Acenda um defumador ou bastão de ervas (Arruda, Guiné, Sálvia ou Alecrim). Caminhe pelos cômodos **do fundo da casa em direção à porta de entrada**, movimentando a fumaça em espirais circulares.
3. **O Selamento da Soleira:** Na porta principal, trace mentalmente ou com a fumaça o *Selo de Salomão* (a união dos dois triângulos de harmonia cósmica), afirmando:
_“Neste recinto só entra a luz, a paz e a justiça; o que for desarmônico volta à sua terra de origem.”_
4. **Proteção Mineral:** Posicione uma **Turmalina Negra** ou **Obsidiana** próxima à entrada principal para atuar como sentinela apotropaica permanente.`,
    suggestedItems: [
      { name: 'Turmalina Negra em Rocha Bruta', slug: 'turmalina-negra-bruta', price: 42.0 },
      { name: 'Incenso Artesanal Purificação & Banimento', slug: 'incenso-salvia-branca', price: 32.9 },
      { name: 'Caldeirão de Ferro Fundido 500ml', slug: 'caldeirao-ferro-fundido', price: 129.9 },
    ],
  },

  // 3. AMETISTA E TRANQUILIDADE MENTAL
  {
    id: 'ametista',
    keywords: ['ametista', 'ansiedade', 'estresse', 'dormir bem', 'insonia', 'pesadelo', 'calma', 'paz mental', 'tranquilidade'],
    title: 'O Mistério da Ametista: Da Grécia Clássica ao Equilíbrio Mental',
    response: `🔮 *Ametista: O Cristal da Transmutação e da Mente Serena:*

Nos antigos tratados gregos da *Antologia Palatina*, a ametista diáfana era considerada a pedra mais sublime dos encantamentos, célebre por conter os excessos da paixão e transmutar o turbilhão da mente em serenidade límpida.

*Propriedades Cósmicas da Ametista:*
• **Chakra Frontal e Coronário:** Expande a intuição espiritual e acalma o fluxo frenético de pensamentos.
• **Sono Reparador:** Deixada sobre a cabeceira ou sob o travesseiro, dissipa pesadelos e traz sonhos tranquilos.
• **Transmutação da Chama Violeta:** Converte frequências de estresse e fadiga mental em serenidade ativa.

*Dica do Guardião:* Ao meditar ou acalmar a respiração, segure sua Ametista sobre a testa ou entre as mãos, respirando em compasso de 4 tempos. Deixe que sua cor profunda lave o cansaço do dia.`,
    suggestedItems: [
      { name: 'Drusa de Ametista Natural', slug: 'ametista-drusa-natural', price: 89.9 },
      { name: 'Kit Altar Sagrado Completo', slug: 'kit-altar-sagrado', price: 168.0 },
    ],
  },

  // 4. QUARTZO ROSA, AMOR E AUTOESTIMA (Afrodite & Íynx)
  {
    id: 'amor_harmonia',
    keywords: ['amor', 'quartzo rosa', 'atrair amor', 'amor proprio', 'autoestima', 'relacionamento', 'harmonizar casal', 'afrodite', 'seducao'],
    title: 'O Quartzo Rosa e a Magia Amorosa de Afrodite',
    response: `🌹 *O Encanto do Amor-Próprio e a Radiação de Afrodite:*

No estudo clássico da *Íynx* e dos rituais pré-nupciais de Afrodite e Eros, a verdadeira magia do amor nunca foi amarrar ou subjugar outrem pela força (o que a tradição condena como violência), mas sim irradiar **Peitó** — a persuasão harmônica, a ternura e o encanto magnético de quem está em paz consigo mesmo.

*O Segredo do Quartzo Rosa:*
• **Chakra Cardíaco:** Cura feridas emocionais, dissolvendo mágoas do passado e desbloqueando a capacidade de amar e ser amado com dignidade.
• **Magnetismo Suave:** Harmoniza desentendimentos no lar e atrai relações verdadeiras de reciprocidade.
• **Plantas e Aromas Aliados:** Na tradição de Afrodite, o Quartzo Rosa une-se com perfeição ao aroma de **Rosas** e às folhas de **Mirto**.

*Conselho do Mago Guardião:* Coloque seu Quartzo Rosa no quarto ou carregue-o junto ao peito. Todas as manhãs, olhe-se com afeto e lembre-se: todo amor nobre nasce primeiro do altar do seu próprio coração.`,
    suggestedItems: [
      { name: 'Quartzo Rosa em Rocha Bruta', slug: 'quartzo-rosa-bruto', price: 49.9 },
      { name: 'Kit Rituais de Afrodite', slug: 'kits', price: 119.0 },
    ],
  },

  // 5. PROTEÇÃO APOTROPAICA E TURMALINA (Pazuzu, Hórus, Defixio)
  {
    id: 'protecao_amuleto',
    keywords: ['protecao', 'turmalina', 'obsidiana', 'amuleto de protecao', 'olho de horus', 'olho grego', 'pazuzu', 'escudo', 'contra inveja', 'bloquear'],
    title: 'A Tradição Apotropaica: Escudos Minerais e Símbolos de Poder',
    response: `🛡️ *A Ciência dos Amuletos de Proteção (Apotropaicos):*

A palavra *apotropaico* vem do grego *apotrópaios* — aquilo que tem a virtude sagrada de desviar o mal e rebater influências funestas. Na Mesopotâmia antiga, placas com o demônio do vento *Pazuzu* eram fixadas nas casas não para cultuar o terror, mas porque sua força tempestuosa continha o poder de espantar o caos e as sombras.

*Os Três Grandes Guardiões Minerais:*
1. **Turmalina Negra:** A rainha da proteção na Terra. Não absorve energia densa; ela a dissipa e ancora a energia no solo como um para-raios místico.
2. **Obsidiana Negra:** O vidro vulcânico revelador. Corta amarras psíquicas e reflete a verdade oculta.
3. **Olho de Hórus (Utchait):** O amuleto egípcio restaurado pela deusa Hátor, símbolo supremo de vigilância, integridade e cura espiritual.

*Recomendação do Guardião:* Mantenha uma Turmalina Negra à esquerda da sua mesa de trabalho ou na entrada de casa, e use um Olho de Hórus ou Selo de Salomão junto ao peito para blindagem pessoal.`,
    suggestedItems: [
      { name: 'Turmalina Negra em Rocha Bruta', slug: 'turmalina-negra-bruta', price: 42.0 },
      { name: 'Colar Amuleto Olho de Hórus', slug: 'cristais', price: 65.0 },
    ],
  },

  // 6. COMO MONTAR UM ALTAR (Os Quatro Elementos)
  {
    id: 'altar',
    keywords: ['como montar altar', 'altar magico', 'altar sagrado', 'o que colocar no altar', 'quatro elementos', 'espaco sagrado'],
    title: 'Como Estruturar seu Altar Sagrado em Harmonia Cósmica',
    response: `🏛️ *O Altar como Microcosmo Vivo:*

Os magos renascentistas, como Cornelius Agrippa e Giordano Bruno, ensinavam que o altar é a representação do Universo em escala humana. Montá-lo não exige luxo, mas equilíbrio das forças elementais da Criação:

• 🌍 **Norte (Terra):** Representado por seus Cristais (Quartzo, Ametista, Jaspe) ou uma tigelinha com sal marinho. Concede sustentação, saúde e firmeza.
• 💨 **Leste (Ar):** Representado pelos Incensos e penas sagradas. Concede clarividência, sabedoria e expansão mental.
• 🔥 **Sul (Fogo):** Representado pelas Velas ou pelo Caldeirão ritual. Traz transmutação, coragem, vontade e paixão ativa.
• 🌊 **Oeste (Água):** Representado pelo Cálice ou Taça com água fresca de fonte. Rege a intuição profunda, o amor e a purificação dos sentimentos.
• 🔮 **Centro (Éter / Espírito):** Seu símbolo de fé (uma imagem sagrada, um amuleto, um pentagrama ou a própria chama que queima no centro).

*Dica do Guardião:* Consagre seu espaço acendendo uma vela branca e um incenso, consagrando aquele cantinho como o seu santuário de quietude diária.`,
    suggestedItems: [
      { name: 'Kit Altar Sagrado Completo', slug: 'kit-altar-sagrado', price: 168.0 },
      { name: 'Caldeirão de Ferro Fundido 500ml', slug: 'caldeirao-ferro-fundido', price: 129.9 },
      { name: 'Taça de Altar em Bronze', slug: 'rituais', price: 79.0 },
    ],
  },

  // 7. PROSPERIDADE E ABUNDÂNCIA (Astromagia de Mercúrio & Sol)
  {
    id: 'prosperidade',
    keywords: ['prosperidade', 'dinheiro', 'atrair dinheiro', 'abundancia', 'abrir caminhos', 'sorte', 'sucesso', 'negocios', 'pirita'],
    title: 'A Ciência da Abundância: Astromagia Solar e Alinhamento de Forças',
    response: `💰 *A Sagrada Alquimia da Prosperidade:*

No *Libro de Astromagia* de Afonso X, o Sábio, os talismãs de prosperidade uniam a energia de dois grandes astros benéficos: o **Sol** (senhor da irradiação, do ouro e da vitória) e **Mercúrio** (o articulador do comércio, da inteligência prática e dos caminhos abertos).

*Ferramentas de Prosperidade de O Bazar do Bruxo:*
• **Pirita (O Ouro dos Tolos que atrai Ouro Real):** Estimula o brilho pessoal, a liderança e a atração material pelo princípio da simpatia mimética mineral.
• **Citrino Natural:** Irradia calor solar contínuo, não acumula energias densas e expande os negócios e a criatividade.
• **Canela e Louro:** As folhas do louro solar e o calor aromático da canela aceleram o fluxo monetário e fecham vazamentos energéticos de gastos imprevistos.

*Prática do Mago:* Em uma quinta-feira (dia de Júpiter) ou domingo (dia do Sol), queime folhas secas de louro e canela com uma pedra de Pirita sobre sua carteira ou caixa comercial. Entoe mentalmente a gratidão pelo sustento e pela abundância.`,
    suggestedItems: [
      { name: 'Rocha Bruta de Pirita da Prosperidade', slug: 'cristais', price: 54.0 },
      { name: 'Incenso Natural Canela & Louro Dourado', slug: 'incensos-aromas', price: 34.9 },
    ],
  },

  // 8. FASES DA LUA E CALENDÁRIO DRUÍDICO
  {
    id: 'fases_lua',
    keywords: ['fase da lua', 'lua cheia', 'lua nova', 'lua crescente', 'lua minguante', 'quando fazer ritual', 'ciclos lunares', 'coligny'],
    title: 'A Roda das Luas e os Ciclos da Natureza',
    response: `🌕 *A Dança dos Ciclos Lunares e a Sabedoria Céltica:*

Como nos revela o *Calendário de Coligny* e os ensinamentos dos druidas antigos registrados por Plínio, a contagem do tempo sagrado era guiada pelas noites e pela luz da Lua. O período luminoso (*Atenoux*) marcava a hora mais auspiciosa para a colheita do visgo sagrado e para rituais de crescimento:

• 🌑 **Lua Nova:** O ventre escuro da criação. Momento de silêncio, recolhimento e lançamento de novas sementes e intenções secretas.
• 🌓 **Lua Crescente:** A quinzena de ouro. Tempo de atrair, nutrir projetos, consagrar amuletos de saúde, amor e prosperidade. Tudo o que deve crescer é iniciado aqui.
• 🌕 **Lua Cheia:** O ápice cósmico. Intuição máxima, energização de pedras à luz do luar, rituais de consagração e celebração da plenitude.
• 🌘 **Lua Minguante:** O corte necessário. Ideal para banimentos, limpeza profunda de ambientes, desintoxicação áurica e quebra de hábitos negativos.

*Dica do Guardião:* Para energizar seus cristais à luz lunar, lave-os antes e deixe-os sob o sereno na primeira noite de Lua Cheia, recolhendo-os antes do meio-dia.`,
    suggestedItems: [
      { name: 'Selenita Branca em Barra de Luz', slug: 'cristais', price: 38.0 },
      { name: 'Drusa de Ametista Natural', slug: 'ametista-drusa-natural', price: 89.9 },
    ],
  },

  // 9. SABEDORIA DE IFÁ, DESTINO E ORÁCULOS (Orunmilá, Èbó e Íló)
  {
    id: 'oraculos_destino',
    keywords: ['futuro', 'destino', 'prever', 'oraculo', 'adivinhacao', 'ifa', 'orunmila', 'sorte', 'conselho de mago'],
    title: 'O Mistério dos Oráculos e a Construção dos Futuros Possíveis',
    response: `🕊️ *O Diálogo Sagrado com os Oráculos: A Sabedoria de Orunmilá:*

No tratado sobre a tradição oral de Ifá, o sábio *Orunmilá* (divindade da sabedoria e inteligência) ensina uma lição profunda: **o papel do oráculo não é a adivinhação fútil do futuro, mas sim a *divinação* — o diálogo consciente com o cosmos para enxergar futuros possíveis e tomar as melhores decisões no presente.**

Lembre-se da lição do homem que buscava vingança em *Ogbe Yono*: obstinado pela raiva, esperou anos diante dos obstáculos até esquecer por que vivia. A verdadeira sabedoria mágica une dois pilares:
• **Èbó (Ação e Oferenda Externa):** Harmonizar os elementos da natureza ao seu redor.
• **Íló (Transformação Interna e Ética):** O cultivo do *Ìwàpèlè* — o bom caráter, a calma e o discernimento para reconhecer limites e virtudes.

Sem mudança de conduta interna, nenhuma magia exterior altera o destino. Se você busca uma direção, acalme o coração e sintonize com sua voz interior. O Guardião está aqui para auxiliá-lo a encontrar as ferramentas certas para iluminar seus passos.`,
    suggestedItems: [
      { name: 'Kit Altar Sagrado Completo', slug: 'kit-altar-sagrado', price: 168.0 },
      { name: 'Drusa de Ametista Natural', slug: 'ametista-drusa-natural', price: 89.9 },
    ],
  },

  // 10. CALDEIRÃO MÍSTICO E TRANSMUTAÇÃO (Gundestrup e Circe)
  {
    id: 'caldeirao',
    keywords: ['caldeirao', 'caldeiroes', 'para que serve caldeirao', 'usar caldeirao', 'ferro fundido', 'queimar no caldeirao'],
    title: 'O Caldeirão de Ferro: O Útero da Transmutação',
    response: `🍲 *O Caldeirão Místico: Da Grécia Homérica ao Caldeirão de Gundestrup:*

O caldeirão de ferro fundido é o mais sagrado dos receptáculos mágicos. Na arqueologia celta (como no lendário *Caldeirão de Gundestrup*) e nos mitos da maga Circe, o caldeirão representa o **útero da Grande Mãe Terra** — o espaço seguro onde a matéria crua entra em contato com o fogo e é transmutada em elixir, medicina ou cura.

*Para que serve o Caldeirão:*
1. **Queima Segura de Ervas e Resinas:** Utilize carvão vegetal ou álcool em gel para queimar mirra, benjoim, louro ou sálvia sem risco para seu altar.
2. **Queima de Pedidos e Decretos:** Escreva intenções ou medos em um pergaminho e queime-o dentro do caldeirão (o fogo leva os pedidos ao cosmos e desfaz os nós do passado).
3. **Preparo de Banhos e Poções de Ervas:** Pela solidez e peso do ferro, ele ancora a energia de proteção e estabilidade em tudo o que nele é gerado.

*Cuidado essencial:* Como peça forjada em ferro rústico, unte-o periodicamente com umas gotas de óleo vegetal após secá-lo para preservar seu acabamento místico.`,
    suggestedItems: [
      { name: 'Caldeirão de Ferro Fundido 500ml', slug: 'caldeirao-ferro-fundido', price: 129.9 },
      { name: 'Incenso Sagrado Sálvia Branca & Lavanda', slug: 'incenso-salvia-branca', price: 32.9 },
    ],
  },

  // 11. SELO DE SALOMÃO E SÍMBOLOS SAGRADOS
  {
    id: 'simbolos_salomao',
    keywords: ['selo de salomao', 'sino salamao', 'estrela de davi', 'pentagrama', 'geometria sagrada', 'talisma'],
    title: 'O Sino Salamão e a Geometria Sagrada dos Sete Portões',
    response: `🔯 *O Selo de Salomão (Sino Salamão) e os Mistérios da Geometria Sagrada:*

Na tradição dos catimbós e juremeiros do Nordeste brasileiro, herdada da astromagia e cabala medieval de Afonso X e das *Clavículas de Salomão*, o **Sino Salamão** é a chave mestra para abrir os sete portões reais e proteger o caminhante de qualquer demanda.

*O Significado Oculto do Selo:*
• **Dois Triângulos Entrelaçados:** O triângulo com vértice para cima representa o Fogo, o Céu e a força ativa que sobe; o triângulo com vértice para baixo representa a Água, a Terra e a graça que desce.
• **O Encontro do Microcosmo com o Macrocosmo:** É o símbolo supremo do equilíbrio perfeito entre espírito e matéria — a harmonia das forças opostas que formam o Cosmos.
• **Uso Protetivo:** Utilizado em pontos riscados, medalhas e anéis para selar recintos e repelir qualquer espírito de desordem.

Quando você usa ou contempla essa geometria, você ancora em seu campo o princípio universal: *“O que está em cima é como o que está embaixo, para realizar os milagres do Uno.”*`,
    suggestedItems: [
      { name: 'Kit Altar Sagrado Completo', slug: 'kit-altar-sagrado', price: 168.0 },
      { name: 'Turmalina Negra em Rocha Bruta', slug: 'turmalina-negra-bruta', price: 42.0 },
    ],
  },
];

/**
 * Busca inteligente de sabedoria mística com base na mensagem do usuário
 */
export function searchMysticKnowledge(userMessage: string): { topic: MysticTopic; score: number } | null {
  const norm = userMessage
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const userWords = norm.split(' ').filter((w) => w.length >= 3);

  let bestMatch: MysticTopic | null = null;
  let highestScore = 0;

  for (const topic of MYSTIC_TOPICS) {
    let score = 0;

    for (const kw of topic.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

      // 1. Correspondência exata da expressão
      if (norm.includes(normKw)) {
        score += normKw.length * 3;
      } else {
        // 2. Correspondência de todas as palavras da chave (ex: "limpar" e "casa" na mesma frase)
        const kwWords = normKw.split(' ').filter((w) => w.length >= 3);
        if (kwWords.length > 1) {
          const allFound = kwWords.every((w) => norm.includes(w));
          if (allFound) {
            score += normKw.length * 2;
          }
        }
      }
    }

    // 3. Bônus por palavras individuais relevantes
    for (const word of userWords) {
      if (topic.keywords.some((k) => k.includes(word))) {
        score += 2;
      }
    }

    if (score > highestScore && score >= 6) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch ? { topic: bestMatch, score: highestScore } : null;
}
