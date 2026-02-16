O PRP (Prompt Requirement Development) são os prompts específicos para criar cada tela. Isso é o que você vai usar no Sketch!

Da live: "Eu criei vários prompts para que a IA saiba o que precisa ter em cada tela. Eu tenho prompts de quase 900 linhas para criar uma única tela. Quanto mais detalhado, melhor o resultado."

Estrutura de um PRP

            
💬 TEMPLATE DE PRP (PROMPT PARA TELA)
Copiar

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

### Footer (se houver)
[Descreva]

## COMPONENTES ESPECÍFICOS

### Card de [Nome]
- Tamanho: [dimensões ou proporção]
- Contém:
  - Imagem/ícone no topo
  - Título em negrito
  - Descrição em 2 linhas
  - Botão de ação
- Hover: [efeito ao passar mouse]

### [Outro componente]
[Descreva]

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
```
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