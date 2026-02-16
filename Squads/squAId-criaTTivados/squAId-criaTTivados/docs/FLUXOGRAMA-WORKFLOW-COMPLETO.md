# Fluxograma Completo — squAId criaTTivados

> Workflow completo do BranDesire: do Atendimento à Entrega Final

---

## Visão Macro (Backbone)

```mermaid
flowchart LR
    ATD["ATENDIMENTO"]
    SI["SEARCH &<br/>INSIGHTS"]
    DEE["DEENEA<br/>Posicionamento"]
    G1{{"CBO GATE 1<br/>Estratégia"}}
    UNK["UNNIKO<br/>Diferenciação"]
    G2{{"CBO GATE 2<br/>Identidade"}}
    STY["storYOUR<br/>telling<br/>Narrativa"]
    G3{{"CBO GATE 3<br/>Criativo"}}
    OPS["OPERATIONS"]
    G4{{"CBO GATE 4<br/>Entrega"}}
    CLI["CLIENTE"]

    ATD --> SI
    ATD --> DEE
    SI --> DEE
    DEE --> G1
    G1 -->|Aprovado| UNK
    G1 -.->|Rejeitado| DEE
    UNK --> G2
    G2 -->|Aprovado| STY
    G2 -.->|Rejeitado| UNK
    STY --> G3
    G3 -->|Aprovado| OPS
    G3 -.->|Rejeitado| STY
    OPS --> G4
    G4 -->|Aprovado| CLI
    G4 -.->|Rejeitado| OPS

    ATD -.->|"entrada direta"| STY
    UNK -.->|"entrada direta"| STY

    style G1 fill:#ff6b6b,color:#fff,stroke:#c0392b
    style G2 fill:#ff6b6b,color:#fff,stroke:#c0392b
    style G3 fill:#ff6b6b,color:#fff,stroke:#c0392b
    style G4 fill:#ff6b6b,color:#fff,stroke:#c0392b
    style ATD fill:#34495e,color:#fff
    style CLI fill:#27ae60,color:#fff
```

---

## Fluxo Detalhado: ATENDIMENTO + SEARCH & INSIGHTS

```mermaid
flowchart TD
    ATD["ATENDIMENTO"]

    subgraph ONBOARDING["ONBOARDING (BranDesire)"]
        BRF["Briefing<br/>16 campos"]
        DOC["Docs do<br/>cliente"]
        TST["Testes<br/>iniciais"]
        LAP["Método unniko<br/>Lapidação:<br/>Feynman + 5 Whys"]
        BRF --> LAP
    end

    subgraph DIAG["DIAGNÓSTICO BRANDESIRE"]
        direction LR
        P1["Pilar 1<br/>POSICIONAMENTO<br/>70 pts"]
        P2["Pilar 2<br/>DIFERENCIAÇÃO<br/>50-60 pts"]
        P3["Pilar 3<br/>NARRATIVA<br/>20 pts"]
        SCR["Score Total<br/>Classificação:<br/>Frágil → Forte"]
        P1 --> SCR
        P2 --> SCR
        P3 --> SCR
    end

    subgraph SI["SEARCH & INSIGHTS"]
        ROT["Roteiro de<br/>pesquisa"]
        PES["Pesquisa de<br/>mercado"]
        ANA["Análise<br/>competitiva"]
        REL["Relatório de<br/>Insights"]
        ROT --> PES --> ANA --> REL
    end

    ATD --> ONBOARDING
    ATD --> SI
    ONBOARDING --> DIAG
    SI --> REL
    REL -->|"mín. 5 insights<br/>ligados aos 3 domínios"| CP1

    CP1(["Checkpoint 1<br/>Pesquisa (80%)"])

    DIAG --> HANDOFF["Handoff Package"]
    CP1 --> HANDOFF
    HANDOFF --> DEE["DEENEA"]

    style LAP fill:#f39c12,color:#fff
    style CP1 fill:#3498db,color:#fff
    style SCR fill:#e74c3c,color:#fff
```

---

## Fluxo Detalhado: DEENEA (Posicionamento)

```mermaid
flowchart TD
    DEE["DEENEA<br/>POSICIONAMENTO"]

    subgraph BP["BRAND POSITION"]
        PROP["Propósito"]
        POS["Positioning<br/>Statement"]
    end

    subgraph BC["BRAND CULTURE"]
        PER["Personas<br/>(JTBD)"]
        PUB["Público-<br/>Alvo"]
        VAL["Valores"]
        IKI["Ikigai"]
    end

    subgraph BPERS["BRAND PERSONALITY"]
        ARQ["Arquétipos<br/>(Jung/Pearson)"]
        PERS["Personalidade<br/>(Aaker)"]
        POV["Ponto de<br/>Vista"]
        ORI["Origin<br/>Story"]
    end

    DEE --> BP
    DEE --> BC
    DEE --> BPERS

    BP --> SINT["Síntese Estratégica"]
    BC --> SINT
    BPERS --> SINT

    SINT --> CP2(["Checkpoint 2<br/>Posicionamento (85%)"])
    CP2 --> BSD["Brand Strategy<br/>Document"]
    BSD --> G1{{"CBO GATE 1<br/>ESTRATÉGIA<br/>100% obrigatório"}}
    G1 -->|Aprovado| UNK["UNNIKO"]
    G1 -.->|"Rejeitado:<br/>volta com feedback"| DEE

    style G1 fill:#e74c3c,color:#fff,stroke:#c0392b
    style CP2 fill:#3498db,color:#fff
```

---

## Fluxo Detalhado: UNNIKO (Diferenciação)

```mermaid
flowchart TD
    UNK["UNNIKO<br/>DIFERENCIAÇÃO"]

    subgraph FASE1["FASE 1: DIAGNÓSTICO"]
        AUD["Brand Auditor<br/>27 ordens"]
        COMP["Análise<br/>Competitiva<br/>3 domínios"]
    end

    subgraph FASE2["FASE 2: ESTRATÉGIA"]
        TAX["Taxonomia de Diferenciais<br/>3 Domínios → 9 Classes → 27 Ordens"]
        DIF["Mapa de<br/>Diferenciais"]
        VURS["Teste VURS<br/>Verdadeiro · Único<br/>Relevante · Sustentável"]
        PROM["Promessa<br/>de Marca"]
        TAX --> DIF --> VURS --> PROM
    end

    subgraph FASE3["FASE 3: IDENTIDADE VERBAL"]
        NAM["Naming"]
        TOM["Tom de Voz"]
        VOC["Vocabulário"]
    end

    subgraph FASE4["FASE 4: IDENTIDADE VISUAL + SENSORIAL"]
        MIV["MIV<br/>(Manual de<br/>Identidade Visual)"]
        DS["Design<br/>System"]
        SENS["Sensograma<br/>(5 sentidos)"]
        TOUCH["Touchpoints<br/>e Rituais"]
    end

    UNK --> FASE1
    FASE1 --> FASE2
    FASE2 --> FASE3
    FASE3 --> FASE4

    FASE4 --> CP3(["Checkpoint 3<br/>Diferenciação (90%)"])

    subgraph ENTREGAS_U["ENTREGAS UNNIKO"]
        IDM["ID Marca"]
        DIFS["Diferenciais"]
        BB["Brand Book"]
    end

    CP3 --> ENTREGAS_U
    ENTREGAS_U --> G2{{"CBO GATE 2<br/>IDENTIDADE<br/>100% obrigatório"}}

    G2 -->|Aprovado| STY["storYOURtelling"]
    G2 -.->|"Rejeitado:<br/>volta com feedback"| UNK

    style G2 fill:#e74c3c,color:#fff,stroke:#c0392b
    style CP3 fill:#3498db,color:#fff
    style VURS fill:#f39c12,color:#fff
```

---

## Fluxo Detalhado: storYOURtelling (Narrativa + Criação)

```mermaid
flowchart TD
    subgraph ENTRADAS["MÚLTIPLAS ENTRADAS"]
        E1["via DEENEA"]
        E2["via UNNIKO"]
        E3["via Atendimento<br/>(direto)"]
    end

    STY["storYOURtelling<br/>NARRATIVA"]
    BC["Briefing de<br/>Criação"]

    ENTRADAS --> STY
    STY --> BC

    subgraph CRIACAO["CRIAÇÃO"]

        subgraph EIXOS["EIXOS DE MARCA"]
            direction LR
            MI["Marca<br/>Institucional"]
            MM["Marca<br/>Mercadológica"]
            ME["Marca<br/>Empregadora"]
            MP["Marca<br/>Pessoal"]
            MS["Marca<br/>Sintética"]
        end

        CONN["Conectores de Marca<br/>(fusão de eixos)"]

        subgraph IDEACAO["IDEAÇÃO"]
            BI["BIG IDEA<br/>Conceito-chave,<br/>ideia-mãe"]
            VTAX["Validação<br/>Taxonômica<br/>(3 domínios)"]
            CCI["CORE CREATIVE IDEA<br/>Consolidação e<br/>derivação"]
            BI --> VTAX --> CCI
        end

        subgraph CAMINHOS["5 CAMINHOS CRIATIVOS"]
            direction LR
            C1["Branding"]
            C2["Design"]
            C3["Advertising"]
            C4["Presentation"]
            C5["Cinema"]
        end

        subgraph ARTEFATOS["ARTEFATOS CRIATIVOS"]
            direction LR
            VIS["Visual<br/>(Art Director)"]
            COP["Copy<br/>(Copywriter)"]
        end

        KV["KEY VISUAL"]

    end

    BC --> EIXOS
    EIXOS --> CONN
    CONN --> IDEACAO
    IDEACAO --> CAMINHOS
    CAMINHOS --> ARTEFATOS
    ARTEFATOS --> KV

    KV --> CP4(["Checkpoint 4<br/>Big Idea (85%)"])
    CP4 --> G3{{"CBO GATE 3<br/>CRIATIVO<br/>100% obrigatório"}}

    G3 -->|Aprovado| OPS["OPERATIONS"]
    G3 -.->|"Rejeitado:<br/>volta com feedback"| STY

    style G3 fill:#e74c3c,color:#fff,stroke:#c0392b
    style CP4 fill:#3498db,color:#fff
    style BI fill:#9b59b6,color:#fff
    style CCI fill:#8e44ad,color:#fff
    style KV fill:#f39c12,color:#fff
    style VTAX fill:#e67e22,color:#fff
```

---

## Fluxo Detalhado: OPERATIONS (Content Ops + Growth Ops)

```mermaid
flowchart TD
    OPS["OPERATIONS"]

    subgraph CONTENT["CONTENT OPS"]
        PLAT["Platform<br/>Strategy"]
        CAL["Calendário<br/>Editorial"]
        PROD["Produção<br/>Copy + Visual"]

        subgraph CANAIS["CANAIS"]
            direction LR
            CH1["Social<br/>Media"]
            CH2["Website<br/>Blog"]
            CH3["Email<br/>Marketing"]
            CH4["Mídia<br/>Paga"]
            CH5["Material<br/>Impresso"]
            CH6["Audio-<br/>visual"]
            CH7["Apresen-<br/>tações"]
        end

        PLAT --> CAL --> PROD --> CANAIS
    end

    subgraph GROWTH["GROWTH OPS"]
        FUN["Funnel Design<br/>(AARRR)"]
        CAMP["Setup de<br/>Campanhas"]
        OTI["Otimização<br/>A/B Testing"]
        PERF["Performance<br/>Reports"]
        FUN --> CAMP --> OTI --> PERF
    end

    OPS --> CONTENT
    OPS --> GROWTH

    CONTENT --> G4{{"CBO GATE 4<br/>ENTREGA FINAL<br/>100% obrigatório"}}
    GROWTH --> G4

    G4 -->|Aprovado| CLI["ENTREGA<br/>AO CLIENTE"]
    G4 -.->|"Rejeitado:<br/>volta com feedback"| OPS

    style G4 fill:#e74c3c,color:#fff,stroke:#c0392b
    style CLI fill:#27ae60,color:#fff,stroke:#1e8449
```

---

## Fluxo Completo em Texto (Referência Linear)

```
═══════════════════════════════════════════════════════════════
                    WORKFLOW COMPLETO
              squAId criaTTivados v2.1
═══════════════════════════════════════════════════════════════

🏢 ATENDIMENTO
│
├── ONBOARDING (BranDesire)
│   ├── Briefing (16 campos)
│   │   └── ♦ Método unniko (lapidação: Feynman + 5 Whys)
│   ├── Docs do cliente
│   └── Testes iniciais
│
├── DIAGNÓSTICO BRANDESIRE
│   ├── Pilar 1: Posicionamento (70 pts)
│   ├── Pilar 2: Diferenciação (50-60 pts)
│   ├── Pilar 3: Narrativa (20 pts)
│   └── Score → Classificação: Frágil → Em Construção → Em Desenvolvimento → Consistente → Forte
│
└── 🔍 SEARCH & INSIGHTS
    ├── Roteiro de pesquisa
    ├── Pesquisa de mercado
    ├── Análise competitiva
    └── Relatório de Insights (mín. 5 insights × 3 domínios)
        └── ✓ Checkpoint 1: Pesquisa (80%)

    📦 Handoff Package
    │
    ▼

💎 DEENEA [POSICIONAMENTO]
│
├── Brand Position
│   ├── Propósito
│   └── Positioning Statement
│
├── Brand Culture
│   ├── Personas (JTBD)
│   ├── Público-Alvo
│   ├── Valores
│   └── Ikigai
│
├── Brand Personality
│   ├── Arquétipos (Jung/Pearson)
│   ├── Personalidade (Aaker 5 dimensões)
│   ├── Ponto de Vista
│   └── Origin Story
│
└── Síntese → 📄 Brand Strategy Document
    └── ✓ Checkpoint 2: Posicionamento (85%)

    ══════════════════════════════════════
    🚦 CBO GATE 1: ESTRATÉGIA (100%)
    Rejeitado? → Volta para DEENEA
    ══════════════════════════════════════
    │
    ▼

🦄 UNNIKO [DIFERENCIAÇÃO]
│
├── Fase 1: Diagnóstico
│   ├── Brand Audit (27 ordens)
│   └── Análise Competitiva (3 domínios)
│
├── Fase 2: Estratégia de Diferenciação
│   ├── Taxonomia: 3 Domínios → 9 Classes → 27 Ordens
│   │   ├── Domínio I:  Substantiva (FAZ)
│   │   ├── Domínio II: Simbólica (SIGNIFICA)
│   │   └── Domínio III: Distintividade (RECONHECE)
│   ├── Mapa de Diferenciais
│   ├── Teste VURS (Verdadeiro, Único, Relevante, Sustentável)
│   └── Promessa de Marca
│
├── Fase 3: Identidade Verbal
│   ├── Naming
│   ├── Tom de Voz
│   └── Vocabulário da marca
│
├── Fase 4: Identidade Visual + Sensorial
│   ├── MIV (Manual de Identidade Visual)
│   ├── Design System (cromática, tipografia, estilo)
│   ├── Sensograma (5 sentidos — Lindstrom)
│   └── Touchpoints e Rituais
│
└── Entregas: ID Marca + Diferenciais + Brand Book
    └── ✓ Checkpoint 3: Diferenciação (90%)

    ══════════════════════════════════════
    🚦 CBO GATE 2: IDENTIDADE (100%)
    Rejeitado? → Volta para UNNIKO
    ══════════════════════════════════════
    │
    ▼

🎬 storYOURtelling [NARRATIVA]
│
├── ⚡ Múltiplas entradas (DEENEA, UNNIKO, Atendimento)
│
├── 📋 Briefing de Criação (obrigatório, qualquer origem)
│
├── EIXOS DE MARCA — para qual marca a comunicação serve?
│   ├── Marca Institucional (posicionamento, diferenciais)
│   ├── Marca Mercadológica (produto, preço, CTA, oferta)
│   ├── Marca Empregadora (cultura, talentos)
│   ├── Marca Pessoal (narrativa individual)
│   ├── Marca Sintética (fusão/combinação)
│   └── 🔗 Conectores de Marca (quando 2+ eixos na mesma campanha)
│
├── 💡 BIG IDEA
│   ├── Conceito-chave, ideia-mãe
│   └── Validação Taxonômica (reforça ≥1 domínio, não contradiz nenhum)
│
├── 📐 CORE CREATIVE IDEA
│   └── Consolidação, explicação e derivação da Big Idea
│
├── 5 CAMINHOS CRIATIVOS (um ou mais por campanha)
│   ├── 🏷️  Branding — linguagem de marca, posicionamento
│   ├── 🎨 Design — linguagem visual (80/20), gráfico ou produto
│   ├── 📢 Advertising — criatividade premiável (Cannes, London Awards)
│   ├── 📊 Presentation — pitches, palestras, boards, workshops
│   └── 🎬 Cinema — filmes, séries, documentários
│
├── ARTEFATOS CRIATIVOS
│   ├── Visual (Art Director)
│   └── Copy (Copywriter)
│
└── ⭐ KEY VISUAL
    └── ✓ Checkpoint 4: Big Idea (85%)

    ══════════════════════════════════════
    🚦 CBO GATE 3: CRIATIVO (100%)
    Rejeitado? → Volta para storYOURtelling
    ══════════════════════════════════════
    │
    ▼

⚙️ OPERATIONS (em paralelo)
│
├── 📝 CONTENT OPS
│   ├── Platform Strategy (5As: Aware → Appeal → Ask → Act → Advocate)
│   ├── Calendário Editorial
│   ├── Produção (copy + visual por plataforma)
│   └── CANAIS
│       ├── Social Media
│       ├── Website / Blog
│       ├── Email Marketing
│       ├── Mídia Paga
│       ├── Material Impresso
│       ├── Audiovisual
│       └── Apresentações
│
└── 📈 GROWTH OPS
    ├── Funnel Design (AARRR: Acquisition → Activation → Retention → Referral → Revenue)
    ├── Setup de Campanhas
    ├── Otimização (A/B Testing)
    └── Performance Reports + Feedback Loop

    ══════════════════════════════════════
    🚦 CBO GATE 4: ENTREGA FINAL (100%)
    Rejeitado? → Volta para Operations
    ══════════════════════════════════════
    │
    ▼

✅ ENTREGA AO CLIENTE

═══════════════════════════════════════════════════════════════
```

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| 🚦 | CBO Gate — validação executiva bloqueante (100% obrigatório) |
| ✓ | Checkpoint técnico — validação dentro da squad (score mínimo variável) |
| 📦 | Handoff Package — pacote de transição entre squads |
| ♦ | Método unniko — lapidação de respostas (Feynman + 5 Whys) |
| ⚡ | Múltiplas entradas — demanda pode vir de diferentes origens |
| 🔗 | Conectores de Marca — integração entre eixos de marca |
| 💡 | Big Idea — conceito-chave, ideia-mãe |
| 📐 | Core Creative Idea — consolidação e derivação da Big Idea |
| ⭐ | Key Visual — peça-chave visual, transição para Content |
| ─── → | Fluxo principal (aprovado) |
| ─ ─ → | Fluxo de rejeição (volta com feedback) |

---

## Diferenças vs. Fluxograma Anterior

| Item | Antes | Agora |
|------|-------|-------|
| CBO Gates | Ausentes | 4 gates bloqueantes com fluxo de rejeição |
| Checkpoints | Ausentes | 4 checkpoints técnicos com score mínimo |
| MIV e Naming | Na DEENEA | Movidos para UNNIKO (correto) |
| Big Idea duplicada | 2 blocos sem contexto | 1 bloco claro dentro da CRIAÇÃO |
| Growth Ops | Ausente | Presente, paralelo a Content Ops |
| Canais | 3 (com duplicata) | 7 canais distintos |
| Diagnóstico BranDesire | Pouco claro | Explícito com 3 pilares e scoring |
| Método unniko | Ausente | Presente no Onboarding/Briefing |
| Taxonomia 3D/9C/27O | Ausente | Presente dentro do UNNIKO |
| Teste VURS | Ausente | Presente dentro do UNNIKO |
| Eixos de Marca | Presentes | Presentes + Conectores de Marca |
| Core Creative Idea | Presente | Presente com distinção clara da Big Idea |
| Key Visual | Ausente | Presente como transição para Content |

---

*squAId criaTTivados v2.1 — Workflow Completo*
*Edu Garretano × Claude | Synkra AIOS*
