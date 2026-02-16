/**
 * validate-briefing.js
 * Squad: squAId-criaTTivados / Atendimento
 *
 * Valida completude dos 16 campos BranDesire em um briefing.
 * Verifica preenchimento e profundidade (método unniko).
 *
 * Uso: node validate-briefing.js <caminho-do-briefing.yaml>
 */

const fs = require('fs');
const yaml = require('js-yaml');

// Os 16 campos do BranDesire organizados por bloco
const BRANDESIRE_CAMPOS = {
  bloco_1_identificacao: {
    nome: 'Identificação',
    campos: [
      { id: 1, nome: 'nome_marca', descricao: 'Nome da marca + história do nome' },
      { id: 2, nome: 'segmento', descricao: 'Segmento de atuação + mercado' }
    ]
  },
  bloco_2_contexto: {
    nome: 'Contexto',
    campos: [
      { id: 3, nome: 'contexto_atual', descricao: 'Situação atual da marca' },
      { id: 4, nome: 'objetivo', descricao: 'Objetivo + métricas + timeline' }
    ]
  },
  bloco_3_publico: {
    nome: 'Público',
    campos: [
      { id: 5, nome: 'publico_alvo', descricao: 'Público-alvo com JTBD' },
      { id: 6, nome: 'diferenciais_percebidos', descricao: 'Diferenciais percebidos' }
    ]
  },
  bloco_4_competicao: {
    nome: 'Competição',
    campos: [
      { id: 7, nome: 'concorrentes', descricao: 'Concorrentes + forças/fraquezas' }
    ]
  },
  bloco_5_essencia: {
    nome: 'Essência',
    campos: [
      { id: 8, nome: 'valores', descricao: 'Valores + evidências' },
      { id: 9, nome: 'personalidade', descricao: 'Personalidade desejada' },
      { id: 10, nome: 'tom_voz', descricao: 'Tom de voz atual' }
    ]
  },
  bloco_6_recursos: {
    nome: 'Recursos',
    campos: [
      { id: 11, nome: 'assets', descricao: 'Assets existentes' },
      { id: 12, nome: 'restricoes', descricao: 'Restrições e limitações' }
    ]
  },
  bloco_7_execucao: {
    nome: 'Execução',
    campos: [
      { id: 13, nome: 'timeline', descricao: 'Timeline com milestones' },
      { id: 14, nome: 'budget', descricao: 'Budget + flexibilidade' }
    ]
  },
  bloco_8_visao: {
    nome: 'Visão',
    campos: [
      { id: 15, nome: 'metricas_sucesso', descricao: 'KPIs com baseline e target' },
      { id: 16, nome: 'visao_futuro', descricao: 'Visão de 5 anos' }
    ]
  }
};

/**
 * Valida um briefing BranDesire
 * @param {string} filePath - Caminho para o briefing
 * @returns {Object} Resultado da validação
 */
function validateBriefing(filePath) {
  const resultado = {
    valido: false,
    campos_ok: [],
    campos_faltantes: [],
    campos_superficiais: [],
    score: 0,
    recomendacoes: []
  };

  if (!fs.existsSync(filePath)) {
    resultado.recomendacoes.push(`Arquivo não encontrado: ${filePath}`);
    return resultado;
  }

  let briefing;
  try {
    const conteudo = fs.readFileSync(filePath, 'utf8');
    briefing = yaml.load(conteudo);
  } catch (erro) {
    resultado.recomendacoes.push(`Erro ao ler arquivo: ${erro.message}`);
    return resultado;
  }

  let totalCampos = 0;
  let camposPreenchidos = 0;

  for (const [, bloco] of Object.entries(BRANDESIRE_CAMPOS)) {
    for (const campo of bloco.campos) {
      totalCampos++;
      const valor = briefing?.[campo.nome] || briefing?.campos?.[campo.nome];

      if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
        resultado.campos_faltantes.push({
          id: campo.id, nome: campo.nome,
          bloco: bloco.nome, descricao: campo.descricao
        });
      } else if (typeof valor === 'string' && valor.length < 50) {
        resultado.campos_superficiais.push({
          id: campo.id, nome: campo.nome, bloco: bloco.nome,
          tamanho: valor.length, sugestao: 'Aplicar método unniko'
        });
        camposPreenchidos++;
      } else {
        resultado.campos_ok.push({ id: campo.id, nome: campo.nome, bloco: bloco.nome });
        camposPreenchidos++;
      }
    }
  }

  resultado.score = Math.round((camposPreenchidos / totalCampos) * 100);
  resultado.valido = resultado.campos_faltantes.length === 0;

  if (resultado.campos_faltantes.length > 0) {
    resultado.recomendacoes.push(
      `${resultado.campos_faltantes.length} campo(s) faltante(s).`
    );
  }
  if (resultado.campos_superficiais.length > 0) {
    resultado.recomendacoes.push(
      `${resultado.campos_superficiais.length} campo(s) superficial(is). Aplique unniko.`
    );
  }

  return resultado;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Uso: node validate-briefing.js <briefing.yaml>');
    process.exit(1);
  }

  const resultado = validateBriefing(args[0]);
  console.log(`Score: ${resultado.score}% | Status: ${resultado.valido ? 'COMPLETO' : 'INCOMPLETO'}`);
  console.log(`OK: ${resultado.campos_ok.length}/16 | Faltantes: ${resultado.campos_faltantes.length} | Superficiais: ${resultado.campos_superficiais.length}`);

  if (resultado.recomendacoes.length > 0) {
    resultado.recomendacoes.forEach(r => console.log(`  - ${r}`));
  }

  process.exit(resultado.valido ? 0 : 1);
}

module.exports = { validateBriefing, BRANDESIRE_CAMPOS };
