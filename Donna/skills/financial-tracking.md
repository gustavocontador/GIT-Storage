# Financial Tracking — Skill Donna

> Donna rastreia cobranças, pagamentos, notas fiscais e propostas mencionados em conversas. Registra no Supabase e sincroniza com Notion Deals.

---

## Tabelas Supabase

### `financial_records`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| record_type | enum | cobranca, pagamento, nota_fiscal, proposta, contrato |
| entity_name | text | Nome da empresa/cliente |
| contact_name | text | Pessoa de contato |
| amount | numeric | Valor (R$) |
| status | enum | pendente, pago, vencido, cancelado, negociando |
| due_date | date | Data de vencimento |
| paid_date | date | Data de pagamento (se pago) |
| description | text | Descrição do registro |
| source | text | Origem (whatsapp, email, manual) |
| notion_page_id | text | Link para página Notion Deals |

### `financial_monthly_summary`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| year_month | text | "2026-03" |
| total_receivable | numeric | Total a receber |
| total_received | numeric | Total recebido |
| total_overdue | numeric | Total vencido |

## Detecção Automática

### Frases-gatilho financeiras:
```
"pagou" / "pagamento" / "pago"     → record_type: pagamento
"nota fiscal" / "NF" / "NFS-e"     → record_type: nota_fiscal
"cobrar" / "cobrança" / "fatura"   → record_type: cobranca
"proposta" / "orçamento"           → record_type: proposta
"contrato" / "assinatura"          → record_type: contrato
"R$" / "reais" / "mil"            → extrai amount
"vence" / "prazo" / "até dia"     → extrai due_date
```

### Exemplo de extração:
**Áudio do Gustavo:** "O João da empresa X pagou os 5 mil do contrato de consultoria"
**Donna extrai:**
```json
{
  "record_type": "pagamento",
  "entity_name": "Empresa X",
  "contact_name": "João",
  "amount": 5000.00,
  "status": "pago",
  "paid_date": "2026-03-17",
  "description": "Contrato de consultoria",
  "source": "whatsapp"
}
```

## Registrar no Supabase

```bash
curl -X POST "$SUPABASE_URL/rest/v1/financial_records" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "record_type": "pagamento",
    "entity_name": "Empresa X",
    "contact_name": "João",
    "amount": 5000.00,
    "status": "pago",
    "paid_date": "2026-03-17",
    "description": "Contrato de consultoria",
    "source": "whatsapp"
  }'
```

## Consultas Úteis

### Cobranças vencidas
```bash
curl "$SUPABASE_URL/rest/v1/financial_records?status=eq.pendente&due_date=lt.$(date +%Y-%m-%d)&order=due_date.asc" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

### Resumo do mês
```bash
curl "$SUPABASE_URL/rest/v1/financial_monthly_summary?year_month=eq.2026-03" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## Integração com Notion Deals

| Campo Supabase | Campo Notion Deals |
|----------------|-------------------|
| entity_name | Deal |
| contact_name | Contato |
| amount | Valor |
| status | Status |
| due_date | Prazo |
| description | Próxima ação |

## Deals Conhecidos (de plano-cobranca-deals.md)

| Deal | Valor | Status | Prazo Cobrança |
|------|-------|--------|---------------|
| Ana Simon (Gamma) | - | Proposta enviada 12/02 | Semana 1 |
| Cervejarias RK | R$ 30k | Pausado 13/02 | Semana 1 |
| Holding Giscard | R$ 20k | Pausado 17/02 | Semana 1 |
| Academia Lendária | R$ 10k | Warm | Semana 2 |
| Lemos Galvão | R$ 10k | Warm | Semana 2 |
| WMC | R$ 8k | Warm | Semana 2 |
| TI/Sandro | R$ 5k | Warm | Semana 2 |
| CERPA | R$ 18k | Cold (1 ano!) | Semana 3 |

## Formato de Relatório Financeiro

```
**Financeiro — {mês/ano}**

💰 A receber: R$ {total}
✅ Recebido: R$ {total}
🔴 Vencido: R$ {total}

**Próximas cobranças:**
1. {empresa} — R$ {valor} — vence em {dias}d
2. {empresa} — R$ {valor} — vence em {dias}d

**Pagamentos recentes:**
- {empresa} — R$ {valor} — {data}
```

---

*Donna Financial Tracking Skill v0.1.0*
