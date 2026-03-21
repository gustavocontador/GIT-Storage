# ADHD-Friendly AI Design Guide

> Restrições de design para IA que genuinamente serve cérebros ADHD.
> v1.0 | Março 2026

---

## Os 10 Mandamentos

| # | Restrição | Razão |
|---|----------|-------|
| 1 | **Uma ação por vez** | Working memory não segura mais |
| 2 | **Sempre mostrar onde está** | Previne "o que eu estava fazendo?" |
| 3 | **Máximo 3 itens em tudo** | Listas, opções, passos — nunca mais que 3 visíveis |
| 4 | **Default em tudo** | Toda pergunta tem resposta recomendada |
| 5 | **Tornar tempo visível** | Contagens regressivas, tempo decorrido, estimativas |
| 6 | **Celebrar cada vitória** | Externalizar a recompensa que o cérebro não gera |
| 7 | **Nunca envergonhar** | Linguagem neutra sempre, recomeço diário |
| 8 | **Estacionar, não bloquear** | Capturar tangentes sem descarrilar trabalho atual |
| 9 | **Mostrar um, esconder o resto** | Disclosure progressiva para tudo |
| 10 | **Perdoar ausência** | Sem streaks, sem culpa, re-entrada calorosa |

---

## Design Constraints por Desafio ADHD

### DC-INIT: Iniciação de Tarefas
```
DC-INIT-01: Toda tarefa deve incluir uma primeira ação física concreta.
DC-INIT-02: A "próxima ação" deve ser realizável em menos de 5 minutos.
DC-INIT-03: Nunca apresentar mais de 1 ação para começar.
```

### DC-SWITCH: Troca de Tarefas / Hiperfoco
```
DC-SWITCH-01: Sempre manter indicador visível da "tarefa atual".
DC-SWITCH-02: Mecanismo de 1 comando para "estacionar este pensamento".
DC-SWITCH-03: Auto-salvar bookmark de retorno ao trocar de tarefa.
DC-SWITCH-04: Alertas de hiperfoco: perceptíveis mas não punitivos.
```

### DC-WM: Working Memory (Máximo 3 Passos)
```
DC-WM-01: Máximo 3 itens/passos visíveis por vez.
DC-WM-02: Cada passo auto-contido (não referencia passo anterior sem restatar).
DC-WM-03: Após interrupção, restatar passo atual e contexto.
DC-WM-04: Disclosure progressiva — revelar passos conforme completam.
DC-WM-05: Sumário persistente "onde estou?" (tarefa + passo X de Y).
```

### DC-TIME: Cegueira Temporal
```
DC-TIME-01: Toda tarefa inclui estimativa realista (x1.5 buffer ADHD).
DC-TIME-02: Mostrar tempo decorrido durante sessões ativas.
DC-TIME-03: Prazos como contagem regressiva ("em 2h") não horário ("às 15h").
DC-TIME-04: Avisos de transição: "10 min até próximo compromisso."
DC-TIME-05: Nunca confiar na estimativa de tempo do usuário.
```

### DC-PRIO: Cegueira de Prioridade
```
DC-PRIO-01: Sempre apresentar tarefas em ordem de prioridade.
DC-PRIO-02: Distinguir visualmente a prioridade #1 de tudo mais.
DC-PRIO-03: Limitar tarefas visíveis a 3 máximo.
DC-PRIO-04: Se começar tarefa baixa prioridade, sinalizar gentilmente.
DC-PRIO-05: Nunca pedir para priorizar mais de 3 itens. Fazer por ele.
```

### DC-DECIDE: Fadiga Decisional
```
DC-DECIDE-01: Toda pergunta inclui resposta default recomendada.
DC-DECIDE-02: Máximo 3 opções. 2 preferível. Aberta proibida.
DC-DECIDE-03: Comprometimento progressivo: pequenas decisões primeiro.
DC-DECIDE-04: Consciência de horário: complexas de manhã, simples à tarde.
DC-DECIDE-05: Modo "piloto automático" onde IA decide e usuário confirma.
```

---

## Padrões de Comunicação

### Estrutura de Mensagem (sempre nesta ordem)
```
[TL;DR / Ação Principal — 1 linha, negrito]

[Contexto — 1-2 frases max, só se necessário]

[Item de Ação — específico, concreto, numerado se múltiplo (max 3)]

[Opções ou Próximo Passo]
```

### Prioridade Visual
```
[!!!] URGENTE  — Ação na próxima hora
[!!]  ALTA     — Prioridade do dia
[!]   NORMAL   — Esta semana
[-]   BAIXA    — Quando tiver tempo
[i]   INFO     — Sem ação necessária
```

### Regra "3-5-7" para Notificações
- Máximo **3** notificações proativas por dia
- Máximo **5** segundos de leitura por notificação
- Toda notificação oferece exatamente **2** opções + dispensar
- **7** segundos sem resposta → estado silencioso

---

## Lógica de Troca de Tarefas

```
SE troca é para MAIOR prioridade:
    ACOMODAR — salvar contexto, deixar trocar

SE troca é para MENOR prioridade E tarefa atual >75% completa:
    REDIRECT GENTIL — "Quase terminando X (3 passos). Finaliza primeiro?"

SE troca é para MENOR prioridade E tarefa atual no início:
    RECONHECER + OFERECER — "Estacionando [nova ideia]. Continua X ou troca?"

SE padrão detectado (3a troca em 30 min):
    NOTAR PADRÃO — "Já trocou 3x. Escolhe UMA por 15 min?"

NUNCA: Bloquear a troca. Dar sermão. Usar a palavra "distraído."
```

---

## Anti-Padrões (NUNCA fazer)

| Anti-Padrão | Alternativa |
|------------|-------------|
| Info dump | TL;DR primeiro, detalhes sob demanda |
| Perguntas abertas | "Sugiro [X]. Topa?" |
| Contexto longo antes da ação | Ação primeiro, contexto depois |
| Mostrar todas as tarefas | Mostrar apenas 1-3 próximas |
| Tracking de streaks | Contagens de conclusão, não streaks |
| "Você deveria..." | "Próximo passo: [X]" |
| Categorização obrigatória | Capturar primeiro, categorizar depois |
| Referências de horário | "Em 45 minutos" não "às 14h" |
| Assumir continuidade | Restatar contexto toda vez |

---

## "Muro do Horrível" (Wall of Awful)

Conceito de Brendan Mahan: barreira emocional que ADHD cria ao se aproximar de tarefas associadas a fracasso ou vergonha passada.

**IA NUNCA adiciona tijolos:**
- Nenhum lembrete de fracassos passados
- Nenhuma comparação com outros
- Nenhum julgamento implícito
- Nenhuma culpa acumulada ("47 tarefas atrasadas")

**IA REDUZ o muro:**
- Fresh start em toda interação
- Reconhecer dificuldade sem dramatizar
- Quebrar tarefa pequena o suficiente
- Companionship (body doubling)

---

## Celebração (Tiers)

| Conquista | Resposta |
|----------|---------|
| Começou uma tarefa | "Vamos nessa." |
| Completou um passo | "Passo 1 feito. Faltam 2." |
| Completou uma tarefa | "Feito! Tirado da lista." |
| Completou tarefa difícil | "Essa era pesada e você mandou." |
| Completou tudo do dia | "Você demoliu hoje. 4 de 4." |
| Voltou após ausência | "Bem-vindo de volta. Sem catch-up. Aqui é onde você está." |

---

*Fontes: Barkley (executive function model), Brown (six clusters), Hallowell-Ratey, Goblin Tools, Tiimo, Focusmate, Llama Life, Structured, Finch, Sunsama, comunidade r/ADHD, HowToADHD.*
