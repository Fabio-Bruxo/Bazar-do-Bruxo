export type BotIntent =
  | 'SAUDACAO'
  | 'MENU'
  | 'BUSCA_PRODUTO'
  | 'RECOMENDACAO_ORCAMENTO'
  | 'RASTREAMENTO_PEDIDO'
  | 'FORMAS_PAGAMENTO'
  | 'PRAZOS_FRETE'
  | 'POLITICA_TROCAS'
  | 'FALAR_HUMANO'
  | 'PROBLEMA_FINANCEIRO'
  | 'PRODUTO_DANIFICADO'
  | 'RECUPERACAO_CARRINHO'
  | 'DESCONHECIDO';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


export function detectIntent(text: string): { intent: BotIntent; extractedValue?: string | number } {
  const norm = normalizeText(text);

  // 1. Números diretos do Menu
  if (norm === '1' || norm === 'conhecer produtos' || norm === 'produtos') {
    return { intent: 'BUSCA_PRODUTO' };
  }
  if (norm === '2' || norm === 'rastrear' || norm === 'rastreamento') {
    return { intent: 'RASTREAMENTO_PEDIDO' };
  }
  if (norm === '3' || norm === 'humano' || norm === 'atendente') {
    return { intent: 'FALAR_HUMANO' };
  }
  if (norm === '4' || norm === 'pagamento' || norm === 'formas de pagamento') {
    return { intent: 'FORMAS_PAGAMENTO' };
  }
  if (norm === '5' || norm === 'frete' || norm === 'prazos') {
    return { intent: 'PRAZOS_FRETE' };
  }
  if (norm === '6' || norm === 'troca' || norm === 'trocas' || norm === 'devolucao') {
    return { intent: 'POLITICA_TROCAS' };
  }
  if (norm === '7' || norm === 'faq' || norm === 'duvidas' || norm === 'duvidas frequentes') {
    return { intent: 'MENU' };
  }

  // 2. Transmissão imediata para humano e emergências
  if (
    norm.includes('falar com atendente') ||
    norm.includes('pessoa real') ||
    norm.includes('humano') ||
    norm.includes('suporte humano') ||
    norm.includes('quero falar com alguem')
  ) {
    return { intent: 'FALAR_HUMANO' };
  }

  // 3. Problemas financeiros (urgentes)
  if (
    norm.includes('cobranca indevida') ||
    norm.includes('duplicada') ||
    norm.includes('estorno') ||
    norm.includes('paguei e nao confirmou') ||
    norm.includes('nao caiu o pix') ||
    norm.includes('dinheiro de volta')
  ) {
    return { intent: 'PROBLEMA_FINANCEIRO' };
  }

  // 4. Produto danificado ou errado
  if (
    norm.includes('quebrado') ||
    norm.includes('danificado') ||
    norm.includes('rachado') ||
    norm.includes('veio errado') ||
    norm.includes('faltou produto') ||
    norm.includes('veio quebrado')
  ) {
    return { intent: 'PRODUTO_DANIFICADO' };
  }

  // 5. Rastreamento por código de pedido (Regex: OBZ-XXXX)
  const orderCodeMatch = text.match(/OBZ-[0-9A-Z]{4,8}/i);
  if (orderCodeMatch) {
    return { intent: 'RASTREAMENTO_PEDIDO', extractedValue: orderCodeMatch[0].toUpperCase() };
  }
  if (norm.includes('rastrear') || norm.includes('onde esta meu pedido') || norm.includes('status do pedido')) {
    return { intent: 'RASTREAMENTO_PEDIDO' };
  }

  // 6. Recomendação por orçamento (Regex: "até X reais", "R$ X", "menos de X")
  const budgetMatch = norm.match(/(?:ate|menos de|gastar|presente de|por|valor de)\s*(?:r\$)?\s*(\d+)/i);
  if (budgetMatch) {
    return { intent: 'RECOMENDACAO_ORCAMENTO', extractedValue: parseInt(budgetMatch[1], 10) };
  }

  // 7. Busca de produtos por palavras-chave
  const productKeywords = [
    'ametista', 'quartzo', 'turmalina', 'selenita', 'cristal', 'pedra',
    'incenso', 'salvia', 'breuzinho', 'aroma', 'defumacao',
    'caldeirao', 'grimorio', 'altar', 'vela', 'kit', 'ervas'
  ];
  for (const kw of productKeywords) {
    if (norm.includes(kw)) {
      return { intent: 'BUSCA_PRODUTO', extractedValue: kw };
    }
  }

  // 8. Informações de pagamento
  if (norm.includes('pix') || norm.includes('cartao') || norm.includes('parcelar') || norm.includes('forma de pagamento') || norm.includes('boleto')) {
    return { intent: 'FORMAS_PAGAMENTO' };
  }

  // 9. Informações de frete e prazos
  if (norm.includes('frete') || norm.includes('prazo') || norm.includes('entrega') || norm.includes('envio') || norm.includes('frete gratis')) {
    return { intent: 'PRAZOS_FRETE' };
  }

  // 10. Trocas e Devoluções
  if (norm.includes('troca') || norm.includes('devolver') || norm.includes('arrependi') || norm.includes('garantia')) {
    return { intent: 'POLITICA_TROCAS' };
  }

  // 11. Recuperação de carrinho
  if (norm.includes('carrinho') || norm.includes('esqueci') || norm.includes('cupom') || norm.includes('desconto')) {
    return { intent: 'RECUPERACAO_CARRINHO' };
  }

  // 12. Saudações
  if (
    norm === 'oi' || norm === 'ola' || norm === 'ola guardiao' ||
    norm.startsWith('ola') || norm.startsWith('oi ') ||
    norm.includes('bom dia') || norm.includes('boa tarde') || norm.includes('boa noite') ||
    norm === 'menu' || norm === 'inicio' || norm === 'ajuda'
  ) {
    return { intent: 'SAUDACAO' };
  }

  return { intent: 'DESCONHECIDO' };
}
