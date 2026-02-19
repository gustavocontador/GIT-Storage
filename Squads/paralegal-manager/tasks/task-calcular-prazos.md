# Task: Calcular Prazos

**Owner:** Sistema (automated)
**Type:** Calculation
**Duration:** Instantâneo

## Objetivo
Calcular prazo estimado conclusão processo.

## Inputs
- Tipo processo (MAPA, Holding, etc.)
- Fase atual (step X de N)
- Histórico processos similares (ML)

## Algorithm
1. Lookup prazo base por tipo (data/workflows)
2. Ajustar por fase atual (% conclusão)
3. Aplicar ML predição (se disponível)
4. Adicionar buffer 10% (margem segurança)

## Output
- Prazo estimado (dias)
- Data conclusão estimada
- Confiança predição (%)
