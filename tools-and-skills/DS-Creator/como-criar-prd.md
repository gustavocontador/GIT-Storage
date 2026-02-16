# PRD - [Nome do Projeto]

## 1. RESUMO EXECUTIVO
[2-3 parágrafos resumindo o projeto inteiro]

## 2. ARQUITETURA DO SISTEMA

### 2.1 Telas/Páginas
Liste TODAS as telas que o sistema terá:

| # | Tela | Descrição | Prioridade |
|---|------|-----------|------------|
| 1 | Login | Autenticação do usuário | Alta |
| 2 | Dashboard | Visão geral principal | Alta |
| 3 | ... | ... | ... |

### 2.2 Estrutura de Navegação
```
├── Login
├── Dashboard (Home)
│   ├── Resumo do dia
│   ├── Próximos eventos
│   └── Notificações recentes
├── Calendário
│   ├── Visão mensal
│   └── Visão semanal
├── [Outras seções...]
└── Configurações
```

## 3. DETALHAMENTO DAS TELAS

### TELA 1: [Nome]
**Objetivo:** [O que o usuário faz aqui]

**Elementos da interface:**
- [ ] Header com logo e menu
- [ ] Card de resumo
- [ ] Lista de itens
- [ ] Botão de ação principal
- [ ] ...

**Funcionalidades:**
- Ao clicar em X, acontece Y
- Filtro por Z
- ...

**Dados necessários:**
- Nome do usuário
- Lista de [items]
- ...

---

### TELA 2: [Nome]
[Repetir estrutura acima]

---

## 4. DESIGN SYSTEM

### 4.1 Paleta de Cores
- **Primária:** #[código] - [uso]
- **Secundária:** #[código] - [uso]
- **Sucesso:** #[código]
- **Erro:** #[código]
- **Fundo:** #[código]
- **Texto:** #[código]

### 4.2 Tipografia
- **Títulos:** [Fonte] - [Tamanhos]
- **Corpo:** [Fonte] - [Tamanhos]
- **Código:** [Fonte]

### 4.3 Espaçamentos
- Base: 4px
- Pequeno: 8px
- Médio: 16px
- Grande: 24px
- Extra: 32px

### 4.4 Componentes Principais
Liste os componentes reutilizáveis:
1. **Botão primário:** [descrição]
2. **Card padrão:** [descrição]
3. **Input de texto:** [descrição]
4. ...

## 5. ESTRUTURA DO BANCO DE DADOS

### Tabelas Principais
```
USUÁRIOS
- id
- nome
- email
- tipo (pai/professor/admin)
- criado_em

FILHOS
- id
- nome
- turma
- pai_id
- escola_id

[Outras tabelas...]
```

## 6. INTEGRAÇÕES
- [ ] Autenticação (Google/Email)
- [ ] Notificações (Push/Email)
- [ ] [Outras]

## 7. REQUISITOS NÃO-FUNCIONAIS
- Tempo de carregamento < 3s
- Responsivo (mobile-first)
- Acessibilidade WCAG 2.1 AA
- [Outros]