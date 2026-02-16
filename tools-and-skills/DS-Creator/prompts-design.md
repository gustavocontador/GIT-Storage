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

🎨 PROMPT PARA LISTAGEM
Copiar

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
        
Prompt 3: Tela de Formulário

            
🎨 PROMPT PARA FORMULÁRIO
Copiar

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
- Inputs com ícones à esquerda quando apropriado

VALIDAÇÃO VISUAL:
- Campo válido: borda verde, ícone ✓
- Campo inválido: borda vermelha, mensagem de erro
- Botão salvar desabilitado até form válido

RESPONSIVO:
- Em mobile, botões do header vão para o rodapé fixo
        
Prompt 4: Tela de Perfil/Detalhes

            
🎨 PROMPT PARA PERFIL/DETALHES
Copiar

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

- Sidebar direita (opcional, desktop):
  • Card com informações rápidas
  • Links relacionados
  • Ações secundárias

DADOS DE EXEMPLO:
Preencha com dados realistas para [contexto].
        
Prompt 5: Definir Design System no Início

            
🎨 PROMPT INICIAL - DEFINIR DESIGN SYSTEM
Copiar

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