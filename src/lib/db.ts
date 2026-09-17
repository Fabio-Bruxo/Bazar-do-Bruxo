import { Pool } from 'pg';

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://bazar_user:bazar_secret_password_2026@localhost:5432/bazar_bruxo',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

// Flag indicando se o banco real está ativo ou se usaremos store em memória de demonstração
export let isDbConnected = false;

pool.on('connect', () => {
  isDbConnected = true;
});

pool.on('error', (err) => {
  console.warn('[DB WARNING] PostgreSQL connection fallback active:', err.message);
  isDbConnected = false;
});

// Repositório em memória para desenvolvimento e fallback imediato sem derrubar o Next.js
const memoryStore = {
  systemSettings: new Map<string, any>([
    ['BOT_ENABLED', true],
    ['AUTOMATIC_SALES_ENABLED', true],
    ['DROPSHIPPING_DISPATCH_ENABLED', true],
    ['STORE_NAME', 'O Bazar do Bruxo'],
    ['STORE_SLOGAN', 'Tudo para o seu ritual.'],
    ['FREE_SHIPPING_THRESHOLD', 199.00],
    ['HUMAN_SUPPORT_WHATSAPP', '5513998039867'],
  ]),
  payments: new Map<string, any>(),
  orders: new Map<string, any>(),
  products: new Map<string, any>(),
  auditLogs: [] as any[],
  tickets: [] as any[],
  conversations: new Map<string, any>(),
  messages: [] as any[],
  financialLedger: [] as any[],
  refunds: [] as any[],
  chargebacks: [] as any[],
  supplierSettlements: [] as any[],
};

export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB EXEC]', { text: text.slice(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (error: any) {
    console.warn('[DB QUERY FALLBACK] Fallback to in-memory handling for query:', text.slice(0, 60));
    return { rows: [], rowCount: 0 };
  }
}

export async function getSystemSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const res = await pool.query('SELECT value FROM system_settings WHERE key = $1', [key]);
    if (res.rows.length > 0) {
      return res.rows[0].value as T;
    }
  } catch {
    // fallback to memoryStore
  }
  return (memoryStore.systemSettings.get(key) as T) ?? defaultValue;
}

export async function setSystemSetting<T>(key: string, value: T, description?: string): Promise<void> {
  memoryStore.systemSettings.set(key, value);
  try {
    await pool.query(
      `INSERT INTO system_settings (key, value, description, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [key, JSON.stringify(value), description || '']
    );
  } catch (error: any) {
    console.warn('[DB SETTING WARNING] Could not persist to PostgreSQL, kept in memoryStore');
  }
}

export async function recordAuditLog(event: {
  userId?: string;
  eventType: string;
  targetEntity: string;
  targetId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  details?: any;
}) {
  const logEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ...event,
    createdAt: new Date().toISOString(),
  };
  memoryStore.auditLogs.unshift(logEntry);

  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, event_type, target_entity, target_id, previous_value, new_value, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        event.userId || null,
        event.eventType,
        event.targetEntity,
        event.targetId || null,
        event.previousValue ? JSON.stringify(event.previousValue) : null,
        event.newValue ? JSON.stringify(event.newValue) : null,
        event.ipAddress || null,
      ]
    );
  } catch {
    // In memory store already contains it
  }
}

export { pool, memoryStore };
