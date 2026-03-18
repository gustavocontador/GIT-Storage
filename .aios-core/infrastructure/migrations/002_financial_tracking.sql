-- 002_financial_tracking.sql
-- Donna Financial Tracking: cobranças, pagamentos, notas fiscais
-- Executar via: bun bridge.js migrate

-- Registros financeiros detectados em conversas
CREATE TABLE IF NOT EXISTS financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_type TEXT NOT NULL CHECK (record_type IN ('cobranca', 'pagamento', 'nota_fiscal', 'proposta', 'contrato')),
  entity_name TEXT NOT NULL,
  contact_name TEXT,
  amount NUMERIC(12, 2),
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado', 'negociando')),
  due_date DATE,
  paid_date DATE,
  description TEXT,
  source TEXT,
  notion_page_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_type ON financial_records(record_type);
CREATE INDEX IF NOT EXISTS idx_financial_status ON financial_records(status);
CREATE INDEX IF NOT EXISTS idx_financial_entity ON financial_records(entity_name);
CREATE INDEX IF NOT EXISTS idx_financial_due_date ON financial_records(due_date);

-- Resumo mensal (view materializada via cron)
CREATE TABLE IF NOT EXISTS financial_monthly_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year_month TEXT NOT NULL,
  total_receivable NUMERIC(12, 2) DEFAULT 0,
  total_received NUMERIC(12, 2) DEFAULT 0,
  total_overdue NUMERIC(12, 2) DEFAULT 0,
  record_count INTEGER DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_financial_month ON financial_monthly_summary(year_month);
