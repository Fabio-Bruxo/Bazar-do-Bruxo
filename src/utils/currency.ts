export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculatePixDiscount(price: number, discountPercent: number = 5): {
  pixPrice: number;
  discountAmount: number;
} {
  const discountAmount = price * (discountPercent / 100);
  const pixPrice = price - discountAmount;
  return { pixPrice, discountAmount };
}

export function calculateInstallments(price: number, maxInstallments: number = 6): {
  count: number;
  value: number;
  text: string;
} {
  const value = price / maxInstallments;
  return {
    count: maxInstallments,
    value,
    text: `${maxInstallments}x de ${formatCurrency(value)} sem juros`,
  };
}
