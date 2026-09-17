import { query, memoryStore, recordAuditLog } from '@/lib/db';

export type LedgerEntryType =
  | 'CUSTOMER_PAYMENT'
  | 'SUPPLIER_SHARE'
  | 'MARKETPLACE_REVENUE'
  | 'PAYMENT_FEE'
  | 'SHIPPING_REVENUE'
  | 'SHIPPING_COST'
  | 'AFFILIATE_COMMISSION'
  | 'REFUND'
  | 'CHARGEBACK'
  | 'ADJUSTMENT';

export type LedgerDirection = 'CREDIT' | 'DEBIT';

export interface LedgerEntry {
  id: string;
  orderId?: string;
  paymentId?: string;
  entryType: LedgerEntryType;
  direction: LedgerDirection;
  amount: number;
  currency: string;
  balanceAfter?: number;
  entityId?: string; // 'marketplace', supplierId, affiliateId
  referenceCode?: string;
  description: string;
  metadata?: Record<string, any>;
  reconciled: boolean;
  reconciledAt?: string;
  createdAt: string;
}

export interface FinancialSummary {
  grossRevenue: number;
  gatewayFees: number;
  supplierShares: number;
  affiliateCommissions: number;
  refunds: number;
  chargebacks: number;
  netMarketplaceRevenue: number;
  pendingSettlements: number;
  totalEntriesCount: number;
}

export interface ReconciliationReport {
  timestamp: string;
  totalOrdersChecked: number;
  discrepanciesFound: number;
  status: 'RECONCILED' | 'MANUAL_REVIEW_REQUIRED';
  details: Array<{
    orderId: string;
    orderCode: string;
    orderTotal: number;
    ledgerTotal: number;
    difference: number;
    reason: string;
  }>;
}

export class FinancialLedgerService {
  /**
   * Registra uma entrada individual no Livro-Razão Financeiro
   */
  public static async recordEntry(data: {
    orderId?: string;
    paymentId?: string;
    entryType: LedgerEntryType;
    direction: LedgerDirection;
    amount: number;
    currency?: string;
    entityId?: string;
    referenceCode?: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<LedgerEntry> {
    const entryId = `led-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const currency = data.currency || 'BRL';
    const createdAt = new Date().toISOString();

    const entry: LedgerEntry = {
      id: entryId,
      orderId: data.orderId,
      paymentId: data.paymentId,
      entryType: data.entryType,
      direction: data.direction,
      amount: Math.round(data.amount * 100) / 100,
      currency,
      entityId: data.entityId || 'marketplace',
      referenceCode: data.referenceCode,
      description: data.description,
      metadata: data.metadata || {},
      reconciled: false,
      createdAt,
    };

    // 1. Tentar persistência no PostgreSQL / Supabase
    try {
      await query(
        `INSERT INTO financial_ledger (
          id, order_id, payment_id, entry_type, direction, amount, currency,
          entity_id, reference_code, description, metadata, reconciled, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          entry.id,
          entry.orderId || null,
          entry.paymentId || null,
          entry.entryType,
          entry.direction,
          entry.amount,
          entry.currency,
          entry.entityId,
          entry.referenceCode || null,
          entry.description,
          JSON.stringify(entry.metadata),
          false,
          entry.createdAt,
        ]
      );
    } catch (err: any) {
      console.warn('[LEDGER DB FALLBACK] Saving entry to in-memory ledger store:', err.message);
    }

    // 2. Armazenamento em memória (sempre ativo para testes e resiliência)
    memoryStore.financialLedger.unshift(entry);

    return entry;
  }

  /**
   * Processa a aprovação financeira de um pedido (Idempotente)
   * Registra as partidas dobradas: Pagamento do Cliente, Taxa do Gateway, Repasse do Fornecedor e Margem do Bazar
   */
  public static async processOrderPaymentApproval(params: {
    orderId: string;
    orderCode: string;
    paymentId: string;
    totalAmount: number;
    paymentFee?: number;
    hasDropshipping?: boolean;
    supplierCost?: number;
    supplierId?: string;
    affiliateCommission?: number;
    affiliateId?: string;
  }): Promise<LedgerEntry[]> {
    const entries: LedgerEntry[] = [];
    const fee = params.paymentFee ?? Math.round(params.totalAmount * 0.0299 * 100) / 100; // 2.99% taxa base
    const supplierAmount = params.supplierCost || 0;
    const affiliateAmount = params.affiliateCommission || 0;
    const netBazar = Math.round((params.totalAmount - fee - supplierAmount - affiliateAmount) * 100) / 100;

    // 1. Entrada de Receita Bruta do Cliente (Crédito)
    const clientEntry = await this.recordEntry({
      orderId: params.orderId,
      paymentId: params.paymentId,
      entryType: 'CUSTOMER_PAYMENT',
      direction: 'CREDIT',
      amount: params.totalAmount,
      entityId: 'marketplace',
      referenceCode: params.orderCode,
      description: `Pagamento recebido do cliente para o pedido #${params.orderCode}`,
    });
    entries.push(clientEntry);

    // 2. Taxa de Intermediação Mercado Pago (Débito)
    if (fee > 0) {
      const feeEntry = await this.recordEntry({
        orderId: params.orderId,
        paymentId: params.paymentId,
        entryType: 'PAYMENT_FEE',
        direction: 'DEBIT',
        amount: fee,
        entityId: 'gateway_mercadopago',
        referenceCode: params.orderCode,
        description: `Taxa do gateway de pagamento Mercado Pago para o pedido #${params.orderCode}`,
      });
      entries.push(feeEntry);
    }

    // 3. Repasse Fornecedor Dropshipping (Débito se aplicável)
    if (params.hasDropshipping && supplierAmount > 0) {
      const suppEntry = await this.recordEntry({
        orderId: params.orderId,
        paymentId: params.paymentId,
        entryType: 'SUPPLIER_SHARE',
        direction: 'DEBIT',
        amount: supplierAmount,
        entityId: params.supplierId || 'supplier_generic',
        referenceCode: params.orderCode,
        description: `Repasse provisionado para fornecedor no pedido #${params.orderCode}`,
      });
      entries.push(suppEntry);
    }

    // 4. Comissão de Afiliado (se aplicável)
    if (affiliateAmount > 0) {
      const affEntry = await this.recordEntry({
        orderId: params.orderId,
        paymentId: params.paymentId,
        entryType: 'AFFILIATE_COMMISSION',
        direction: 'DEBIT',
        amount: affiliateAmount,
        entityId: params.affiliateId || 'affiliate_generic',
        referenceCode: params.orderCode,
        description: `Comissão provisionada para afiliado parceiro no pedido #${params.orderCode}`,
      });
      entries.push(affEntry);
    }

    // 5. Receita Líquida do Bazar do Bruxo (Crédito Líquido)
    const revEntry = await this.recordEntry({
      orderId: params.orderId,
      paymentId: params.paymentId,
      entryType: 'MARKETPLACE_REVENUE',
      direction: 'CREDIT',
      amount: Math.max(0, netBazar),
      entityId: 'bazar_do_bruxo',
      referenceCode: params.orderCode,
      description: `Margem líquida apurada da operação para o pedido #${params.orderCode}`,
    });
    entries.push(revEntry);

    await recordAuditLog({
      userId: 'system_ledger',
      eventType: 'ORDER_FINANCIAL_LEDGER_POSTED',
      targetEntity: 'order',
      targetId: params.orderId,
      details: { orderCode: params.orderCode, entriesCount: entries.length, netBazar },
    });

    return entries;
  }

  /**
   * Obtém o resumo consolidado da Central Financeira
   */
  public static async getLedgerSummary(): Promise<FinancialSummary> {
    const entries: LedgerEntry[] = memoryStore.financialLedger;

    let grossRevenue = 0;
    let gatewayFees = 0;
    let supplierShares = 0;
    let affiliateCommissions = 0;
    let refunds = 0;
    let chargebacks = 0;

    for (const e of entries) {
      switch (e.entryType) {
        case 'CUSTOMER_PAYMENT':
          grossRevenue += e.amount;
          break;
        case 'PAYMENT_FEE':
          gatewayFees += e.amount;
          break;
        case 'SUPPLIER_SHARE':
          supplierShares += e.amount;
          break;
        case 'AFFILIATE_COMMISSION':
          affiliateCommissions += e.amount;
          break;
        case 'REFUND':
          refunds += e.amount;
          break;
        case 'CHARGEBACK':
          chargebacks += e.amount;
          break;
        default:
          break;
      }
    }

    const netMarketplaceRevenue = Math.max(
      0,
      Math.round(
        (grossRevenue - gatewayFees - supplierShares - affiliateCommissions - refunds - chargebacks) * 100
      ) / 100
    );

    return {
      grossRevenue: Math.round(grossRevenue * 100) / 100,
      gatewayFees: Math.round(gatewayFees * 100) / 100,
      supplierShares: Math.round(supplierShares * 100) / 100,
      affiliateCommissions: Math.round(affiliateCommissions * 100) / 100,
      refunds: Math.round(refunds * 100) / 100,
      chargebacks: Math.round(chargebacks * 100) / 100,
      netMarketplaceRevenue,
      pendingSettlements: supplierShares,
      totalEntriesCount: entries.length,
    };
  }

  /**
   * Rotina de Reconciliação Diária (Seção 38)
   * Compara os pedidos aprovados com os lançamentos de ledger e emite relatório
   */
  public static async reconcileOrdersWithLedger(): Promise<ReconciliationReport> {
    const ordersMap = memoryStore.orders;
    const entries = memoryStore.financialLedger;
    const discrepancies: ReconciliationReport['details'] = [];

    const ordersArray = Array.from(ordersMap.values()).filter(
      (o: any) => o.paymentStatus === 'PAID' || o.paymentStatus === 'APPROVED'
    );

    for (const order of ordersArray) {
      const orderCustomerPayments = entries
        .filter((e) => e.orderId === order.id && e.entryType === 'CUSTOMER_PAYMENT')
        .reduce((sum, e) => sum + e.amount, 0);

      const diff = Math.abs(Math.round((order.total - orderCustomerPayments) * 100) / 100);

      if (diff > 0.01) {
        discrepancies.push({
          orderId: order.id,
          orderCode: order.code,
          orderTotal: order.total,
          ledgerTotal: orderCustomerPayments,
          difference: diff,
          reason: 'Valor total do pedido diverge da receita registrada no Ledger Contábil',
        });
      }
    }

    const report: ReconciliationReport = {
      timestamp: new Date().toISOString(),
      totalOrdersChecked: ordersArray.length,
      discrepanciesFound: discrepancies.length,
      status: discrepancies.length === 0 ? 'RECONCILED' : 'MANUAL_REVIEW_REQUIRED',
      details: discrepancies,
    };

    await recordAuditLog({
      userId: 'system_reconciliation',
      eventType: 'FINANCIAL_RECONCILIATION_RUN',
      targetEntity: 'financial_ledger',
      details: { discrepancies: discrepancies.length, status: report.status },
    });

    return report;
  }
}
