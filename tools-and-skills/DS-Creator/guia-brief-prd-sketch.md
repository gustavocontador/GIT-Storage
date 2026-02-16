# 📋 Guia: Brief, PRD e Prompts para Sketch

> Templates completos e prompts prontos para criar seu Design System do zero.

---

## 📑 Índice

1. [A Sequência Obrigatória](#1-a-sequência-obrigatória)
2. [Design Atômico Explicado](#2-design-atômico-explicado)
3. [Como Criar seu Brief](#3-como-criar-seu-brief)
4. [Como Criar seu PRD](#4-como-criar-seu-prd)
5. [PRP de Design (Prompts para Telas)](#5-prp-de-design)
6. [Passo a Passo no Sketch do Google](#6-passo-a-passo-no-sketch)
7. [Prompts Prontos para Copiar](#7-prompts-prontos)

---

## 1. A Sequência Obrigatória

### O Processo Correto

```
📋 Brief → 📝 PRD → 💬 PRP Design → 🎨 Sketch → ⚡ Código
```

| Etapa | O que é | Objetivo |
|-------|---------|----------|
| Brief | Documento de visão | Entender a dor |
| PRD | Requisitos do produto | Detalhar solução |
| PRP Design | Prompts das telas | Guiar a IA |
| Sketch | Protótipos visuais | Visualizar resultado |
| Código | Implementação | Transformar em app |

### Por que essa ordem?

**Analogia da Casa:** Você não projeta só a planta 2D. Faz projeção 3D, imagina os cômodos, as paredes. Sem isso, vira puxadinho.

**Analogia do Chassi:** Se você faz o chassi do carro sem saber o design final, não sabe onde botar as peças, a distância entre eixos, o peso.

> ⚠️ **Importante:** O que vai inspirar mais é o front-end (o visual). Por isso começamos pelo planejamento, mas a inspiração vem de ver o resultado visual.

---

## 2. Design Atômico Explicado

### Os 5 Níveis de Brad Frost

| Nível | Descrição | Exemplos |
|-------|-----------|----------|
| ⚛️ **Átomos** | Elementos indivisíveis | Cores (#FF5733), fontes (Inter 16px), ícones, espaçamentos (8px, 16px) |
| 🧬 **Moléculas** | Combinações simples | Input com label, botão com ícone, avatar com nome |
| 🦠 **Organismos** | Seções completas | Header completo, card de produto, formulário de login |
| 📄 **Templates** | Estrutura da página | Layout do dashboard (sem conteúdo real) |
| 📱 **Páginas** | Tela final | Dashboard com dados reais do usuário |

### Por que funciona com IA?

A IA tem janela de contexto limitada e "esquece". Quando você quebra em componentes pequenos:

- Ela altera 50 linhas em vez de 2000
- Não quebra outras partes do sistema
- Economiza MUITO token
- Mantém consistência visual

---

## 3. Como Criar seu Brief

O Brief é o documento que define **O QUE** você vai criar e **POR QUÊ**. É a base de tudo.

### Template de Brief

```markdown
# BRIEF DO PROJETO: [Nome do Projeto]

## 1. VISÃO GERAL
- **Nome do projeto:** 
- **Uma frase que resume:** 
- **Data de início:** 

## 2. O PROBLEMA
- **Qual dor estamos resolvendo?**
  [Descreva o problema principal que os usuários enfrentam]

- **Como as pessoas resolvem isso hoje?**
  [Soluções atuais e por que são insuficientes]

- **Por que isso é importante resolver?**
  [Impacto do problema]

## 3. A SOLUÇÃO
- **O que vamos criar?**
  [Descrição em 2-3 frases]

- **Como isso resolve o problema?**
  [Conexão direta problema → solução]

## 4. PÚBLICO-ALVO
- **Quem vai usar?**
  [Perfil demográfico e comportamental]

- **Nível técnico:**
  [ ] Iniciante [ ] Intermediário [ ] Avançado

- **Dispositivos principais:**
  [ ] Desktop [ ] Mobile [ ] Tablet

## 5. FUNCIONALIDADES PRINCIPAIS
Liste as 5-10 funcionalidades essenciais:
1. 
2. 
3. 
4. 
5. 

## 6. REFERÊNCIAS VISUAIS
- **Estilo desejado:** [Minimalista / Colorido / Corporativo / Moderno / etc.]
- **Cores principais:** 
- **Referências (links):**
  - 
  - 

## 7. RESTRIÇÕES
- **Prazo:** 
- **Orçamento:** 
- **Limitações técnicas:** 

## 8. MÉTRICAS DE SUCESSO
Como vamos saber se deu certo?
- 
- 
```

---

### Exemplo de Brief Preenchido

```markdown
# BRIEF DO PROJETO: EduPainel

## 1. VISÃO GERAL
- **Nome do projeto:** EduPainel - Acompanhamento Escolar
- **Uma frase que resume:** Painel para pais acompanharem a vida escolar dos filhos em tempo real
- **Data de início:** Janeiro 2025

## 2. O PROBLEMA
- **Qual dor estamos resolvendo?**
  Pais não conseguem acompanhar adequadamente o dia a dia escolar dos filhos. 
  As informações chegam fragmentadas por WhatsApp ou aplicativos limitados.

- **Como as pessoas resolvem isso hoje?**
  Grupos de WhatsApp (desorganizado), agenda física (atrasada), 
  apps da escola (limitados e feios).

- **Por que isso é importante resolver?**
  Pais querem estar presentes na educação mesmo trabalhando. 
  Perdem momentos importantes por falta de informação organizada.

## 3. A SOLUÇÃO
- **O que vamos criar?**
  Um painel web/mobile onde pais visualizam calendário escolar, 
  deveres de casa, feedbacks de professores, boletins e fotos 
  das atividades dos filhos.

- **Como isso resolve o problema?**
  Centraliza todas as informações em um lugar bonito e organizado.
  Notificações inteligentes. Interface multilíngue.

## 4. PÚBLICO-ALVO
- **Quem vai usar?**
  Pais de crianças em idade escolar (3-12 anos), classe média/alta,
  que trabalham e querem estar presentes na educação.

- **Nível técnico:** [X] Iniciante (tem que ser MUITO fácil)

- **Dispositivos principais:** [X] Mobile [X] Desktop

## 5. FUNCIONALIDADES PRINCIPAIS
1. Dashboard com visão geral do dia
2. Calendário escolar completo
3. Lista de deveres de casa com entrega
4. Chat com professores
5. Boletim e relatórios de desempenho
6. Galeria de fotos das atividades
7. Avisos e notificações da escola
8. Suporte a múltiplos filhos
9. Multilíngue (PT, EN, ES)

## 6. REFERÊNCIAS VISUAIS
- **Estilo desejado:** Moderno, acolhedor, colorido mas não infantil
- **Cores principais:** Azul claro, verde suave, branco
- **Referências:** ClassDojo, Remind, Google Classroom

## 7. RESTRIÇÕES
- **Prazo:** MVP em 30 dias
- **Limitações:** Precisa funcionar offline (PWA)

## 8. MÉTRICAS DE SUCESSO
- 80% dos pais acessando semanalmente
- NPS acima de 8
- Redução de 50% nas mensagens de WhatsApp
```

---

## 4. Como Criar seu PRD

O PRD (Product Requirements Document) detalha **COMO** a solução vai funcionar. É mais técnico que o Brief.

### Template de PRD

```markdown
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

## 3. DETALHAMENTO DAS TELAS

### TELA 1: [Nome]
**Objetivo:** [O que o usuário faz aqui]

**Elementos da interface:**
- [ ] Header com logo e menu
- [ ] Card de resumo
- [ ] Lista de itens
- [ ] Botão de ação principal

**Funcionalidades:**
- Ao clicar em X, acontece Y
- Filtro por Z

**Dados necessários:**
- Nome do usuário
- Lista de [items]

---

## 4. DESIGN SYSTEM

### 4.1 Paleta de Cores
- **Primária:** #[código] - [uso]
- **Secundária:** #[código] - [uso]
- **Sucesso:** #10b981
- **Erro:** #ef4444
- **Alerta:** #f59e0b
- **Fundo:** #[código]
- **Texto:** #[código]

### 4.2 Tipografia
- **Títulos:** [Fonte] - [Tamanhos]
- **Corpo:** [Fonte] - [Tamanhos]

### 4.3 Espaçamentos
- Base: 4px
- Pequeno: 8px
- Médio: 16px
- Grande: 24px
- Extra: 32px

### 4.4 Componentes Principais
1. **Botão primário:** [descrição]
2. **Card padrão:** [descrição]
3. **Input de texto:** [descrição]

## 5. ESTRUTURA DO BANCO DE DADOS

### Tabelas Principais

USUÁRIOS
- id
- nome
- email
- tipo (pai/professor/admin)
- criado_em

[Outras tabelas...]

## 6. INTEGRAÇÕES
- [ ] Autenticação (Google/Email)
- [ ] Notificações (Push/Email)
- [ ] [Outras]

## 7. REQUISITOS NÃO-FUNCIONAIS
- Tempo de carregamento < 3s
- Responsivo (mobile-first)
- Acessibilidade WCAG 2.1 AA
```

---

## 5. PRP de Design

O PRP (Prompt Requirement Development) são os prompts específicos para criar cada tela. Isso é o que você vai usar no Sketch!

> **Dica:** "Eu criei vários prompts para que a IA saiba o que precisa ter em cada tela. Eu tenho prompts de quase 900 linhas para criar uma única tela. Quanto mais detalhado, melhor o resultado."

### Template de PRP (Prompt para Tela)

```markdown
# PRP - TELA: [Nome da Tela]

## CONTEXTO
Este é um [tipo de aplicação] para [público-alvo].
O estilo visual é [descreva: moderno, minimalista, colorido, etc.].
Cores principais: [liste as cores].

## OBJETIVO DA TELA
[O que o usuário vem fazer aqui]

## LAYOUT GERAL

### Header (topo)
- Logo à esquerda
- Menu de navegação: [item1], [item2], [item3]
- À direita: [avatar do usuário / botão de ação]

### Sidebar (se houver)
- Largura: [fixa/colapsável]
- Itens: [liste os itens do menu]
- Ícones: [descreva estilo dos ícones]

### Área Principal
[Descreva a estrutura principal]

#### Seção 1: [Nome]
- Título: "[texto]"
- Conteúdo: [descreva cards, listas, etc.]
- Ações disponíveis: [botões, links]

#### Seção 2: [Nome]
[Repetir estrutura]

## COMPONENTES ESPECÍFICOS

### Card de [Nome]
- Tamanho: [dimensões ou proporção]
- Contém:
  - Imagem/ícone no topo
  - Título em negrito
  - Descrição em 2 linhas
  - Botão de ação
- Hover: [efeito ao passar mouse]

## DADOS DE EXEMPLO
Use estes dados para preencher a tela:

**Usuário:**
- Nome: Maria Silva
- Avatar: [iniciais ou foto genérica]

**Lista de [items]:**
1. [Item 1 com detalhes]
2. [Item 2 com detalhes]
3. [Item 3 com detalhes]

## RESPONSIVIDADE
- Desktop: [como fica]
- Tablet: [ajustes]
- Mobile: [ajustes - menu vira hamburguer, etc.]

## ESTADOS ESPECIAIS
- **Loading:** [como mostra carregamento]
- **Vazio:** [mensagem quando não há dados]
- **Erro:** [como mostra erros]

## WIREFRAME ASCII (opcional)

┌─────────────────────────────────────────┐
│ LOGO        Menu1  Menu2  Menu3  [Avatar]│
├─────────┬───────────────────────────────┤
│         │                               │
│ Sidebar │     Conteúdo Principal        │
│         │                               │
│ • Item1 │   ┌─────┐ ┌─────┐ ┌─────┐    │
│ • Item2 │   │Card1│ │Card2│ │Card3│    │
│ • Item3 │   └─────┘ └─────┘ └─────┘    │
│         │                               │
└─────────┴───────────────────────────────┘
```

---

## 6. Passo a Passo no Sketch

O Google Sketch (sketch.new) é gratuito e permite criar protótipos visuais que exportam direto para código.

### Etapa 1: Acesse o Sketch
Vá para **sketch.new** no navegador. Faça login com sua conta Google.

### Etapa 2: Comece com o PRP
Cole seu PRP (prompt da tela) no chat. O Sketch vai gerar a primeira versão da tela.

### Etapa 3: Ajuste o Tema
Clique em **Editar Tema**. Ajuste:
- **Cores:** Escolha sua paleta
- **Formato:** Mais redondo ou mais quadrado
- **Estilo:** Claro ou escuro

### Etapa 4: Refine a Tela
Selecione áreas específicas e peça ajustes:
- "Mude esse card para ter ícone à esquerda"
- "Adicione um botão de filtro aqui"
- "O espaçamento está muito grande"

### Etapa 5: Gere Variações
Peça para gerar variações de cor, layout ou estilo. Compare e escolha a melhor.

### Etapa 6: Crie TODAS as Telas
Repita para cada tela do seu sistema. **Importante:** Faça todas as telas antes de exportar!

### Etapa 7: Exporte para IA Studio
Selecione as telas → Clique em **Mais (⋯)** → **Exportar para IA Studio**.

---

## 7. Prompts Prontos

### Prompt 1: Definir Design System (USE PRIMEIRO!)

```
Antes de criar as telas, vamos definir o Design System do projeto [NOME DO PROJETO].

SOBRE O PROJETO:
[Cole aqui o resumo do seu Brief - 2-3 parágrafos]

PÚBLICO-ALVO:
[Descreva quem vai usar]

ESTILO DESEJADO:
- Tom: [Profissional / Casual / Divertido / Sério]
- Estética: [Minimalista / Colorido / Elegante / Moderno / Retrô]
- Referências visuais: [Liste apps/sites que você gosta]

DEFINA:

1. PALETA DE CORES
- Cor primária (ações principais, links)
- Cor secundária (destaques)
- Cor de sucesso (verde)
- Cor de erro (vermelho)
- Cor de alerta (amarelo)
- Cor de fundo principal
- Cor de fundo secundário (cards)
- Cor de texto principal
- Cor de texto secundário

2. TIPOGRAFIA
- Fonte para títulos
- Fonte para corpo
- Tamanhos: H1, H2, H3, corpo, small

3. ESPAÇAMENTOS
- Base unit (4px ou 8px)
- Padding de cards
- Gap entre elementos
- Margens de seção

4. COMPONENTES BASE
- Border radius (sharp, medium, rounded, pill)
- Estilo de sombras
- Estilo de bordas
- Estilo de botões (filled, outlined, ghost)

5. ÍCONES
- Estilo: [Outlined / Filled / Duotone]
- Biblioteca sugerida: [Lucide / Heroicons / Phosphor]

Gere um preview visual do Design System com exemplos de cada elemento.
```

---

### Prompt 2: Dashboard Principal

```
Crie uma tela de Dashboard para um aplicativo de [DESCREVA SEU APP].

ESTILO VISUAL:
- Design moderno e limpo
- Cores principais: [COR 1], [COR 2], [COR 3]
- Cantos arredondados (border-radius: 12px)
- Sombras suaves nos cards
- Fonte sans-serif moderna

LAYOUT:
- Sidebar à esquerda (240px) com:
  • Logo no topo
  • Menu de navegação com ícones
  • Itens: Dashboard, [Item 2], [Item 3], [Item 4], Configurações
  • Item ativo destacado com cor primária
  • Avatar do usuário no rodapé da sidebar

- Header no topo com:
  • Título da página atual
  • Campo de busca
  • Ícone de notificações com badge
  • Avatar do usuário com dropdown

- Área principal com:
  • Saudação: "Olá, [Nome]! 👋"
  • 4 cards de métricas em linha (grid 4 colunas)
    - Cada card com: ícone, valor grande, label, indicador de tendência
  • Seção de [DESCREVA] abaixo
  • Gráfico ou lista à direita

COMPONENTES:
- Cards com hover elevando sombra
- Botões primários com a cor principal
- Badges coloridos para status
- Tabela com linhas alternadas

RESPONSIVO:
- Em telas menores, sidebar vira menu hamburguer
- Cards de métricas viram 2x2 em tablet, 1 coluna em mobile

DADOS DE EXEMPLO:
- Usuário: Maria Silva
- Métricas: 1.234, 567, 89%, R$ 12.345
```

---

### Prompt 3: Tela de Listagem

```
Crie uma tela de listagem de [ITENS] para [SEU APP].

CONTEXTO:
Esta tela mostra todos os [itens] do usuário em formato de [cards/tabela/lista].

LAYOUT:
- Manter sidebar e header do padrão do sistema

- Área principal:
  • Título: "[Nome da Seção]"
  • Linha de ações:
    - Filtros dropdown (Status, Data, Categoria)
    - Campo de busca
    - Botão "Novo [Item]" (cor primária, ícone +)
  
  • Grid de cards (3 colunas desktop, 2 tablet, 1 mobile):
    - Cada card contém:
      • Imagem/ícone no topo (proporção 16:9)
      • Título em negrito
      • Descrição em 2 linhas (truncar com ...)
      • Tags/badges de categoria
      • Linha inferior: data + botão de ações (⋯)

  • Paginação no rodapé:
    - "Mostrando 1-12 de 48"
    - Botões de página

ESTADOS:
- Hover no card: eleva sombra, mostra overlay com ações rápidas
- Loading: skeleton dos cards
- Vazio: ilustração + "Nenhum [item] encontrado" + botão criar

DADOS DE EXEMPLO:
Crie 6 cards com dados fictícios variados.
```

---

### Prompt 4: Tela de Formulário

```
Crie uma tela de formulário para [CRIAR/EDITAR] [ITEM] no [SEU APP].

LAYOUT:
- Header com:
  • Botão voltar (←)
  • Título: "[Criar/Editar] [Item]"
  • Botões: "Cancelar" (secundário), "Salvar" (primário)

- Formulário centralizado (max-width: 600px):
  
  SEÇÃO 1: Informações Básicas
  - Input: Nome (obrigatório) *
  - Textarea: Descrição (opcional)
  - Select: Categoria
  
  SEÇÃO 2: [Outra Seção]
  - Input: [Campo]
  - Date picker: Data
  - Upload: Imagem/arquivo
  
  SEÇÃO 3: Configurações
  - Toggle: [Opção 1]
  - Toggle: [Opção 2]
  - Radio group: [Opções]

COMPONENTES:
- Labels acima dos inputs
- Placeholder em cinza claro
- Bordas suaves, foco com cor primária
- Mensagens de erro em vermelho abaixo do campo
- Asterisco vermelho para campos obrigatórios

VALIDAÇÃO VISUAL:
- Campo válido: borda verde, ícone ✓
- Campo inválido: borda vermelha, mensagem de erro
- Botão salvar desabilitado até form válido

RESPONSIVO:
- Em mobile, botões do header vão para o rodapé fixo
```

---

### Prompt 5: Tela de Perfil/Detalhes

```
Crie uma tela de detalhes/perfil de [ITEM/USUÁRIO] para [SEU APP].

LAYOUT:
- Header com imagem de capa (altura 200px, gradiente overlay)
  • Botão voltar no topo esquerdo
  • Botões de ação no topo direito (editar, compartilhar, ⋯)

- Card de perfil sobrepondo a capa (-50px):
  • Avatar grande (120px) ou imagem principal
  • Nome/título principal
  • Subtítulo/descrição curta
  • Badges/tags
  • Botões de ação principais

- Tabs de navegação:
  • [Tab 1] | [Tab 2] | [Tab 3]
  • Linha indicadora na tab ativa

- Conteúdo da tab ativa:
  
  TAB 1 - Visão Geral:
  - Grid de informações (2 colunas)
  - Cada item: label + valor
  
  TAB 2 - [Outra seção]:
  - Lista ou cards relacionados
  
  TAB 3 - [Outra seção]:
  - Timeline ou histórico

DADOS DE EXEMPLO:
Preencha com dados realistas para [contexto].
```

---

## 🚀 Resumo Final

### A ordem que você DEVE seguir:

1. **Brief** → Defina problema, público, objetivos
2. **PRD** → Liste todas as telas e funcionalidades
3. **Design System** → Defina cores, fontes, componentes (use o Prompt 1!)
4. **PRPs** → Crie prompt detalhado para CADA tela
5. **Sketch** → Gere todas as telas visuais
6. **IA Studio** → Exporte e transforme em código
7. **Componentização** → Organize em componentes reutilizáveis
8. **Funcionalidades** → SÓ AGORA adicione o backend

---

> **Lembre-se:** "Construa sistemas, não páginas" (Brad Frost). Cada componente que você criar será reutilizado. Cada cor, cada espaçamento, cada botão deve vir do seu Design System. É assim que a IA para de quebrar tudo!
