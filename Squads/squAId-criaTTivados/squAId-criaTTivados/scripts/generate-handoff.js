/**
 * generate-handoff.js
 * Squad: squAId-criaTTivados / Atendimento
 *
 * Gera pacote de handoff entre sub-squads.
 * Consolida briefing, análise de cliente e pré-mapeamento taxonômico.
 *
 * Uso: node generate-handoff.js <briefing.yaml> <analysis.yaml> [--target squad]
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * Gera pacote de handoff
 */
function generateHandoff(opcoes) {
  const { briefingPath, analysisPath, target } = opcoes;

  let briefing, analysis;

  try {
    briefing = yaml.load(fs.readFileSync(briefingPath, 'utf8'));
  } catch (erro) {
    throw new Error(`Erro ao carregar briefing: ${erro.message}`);
  }

  try {
    analysis = yaml.load(fs.readFileSync(analysisPath, 'utf8'));
  } catch (erro) {
    throw new Error(`Erro ao carregar análise: ${erro.message}`);
  }

  const handoff = {
    metadata: {
      tipo: 'handoff-package',
      versao: '1.0',
      origem: 'atendimento',
      destino: target || 'all',
      gerado_em: new Date().toISOString(),
      squad: 'squAId-criaTTivados'
    },
    briefing: {
      resumo: briefing.resumo || 'Briefing BranDesire completo',
      campos_completos: 16,
      dados: briefing
    },
    analise_cliente: {
      resumo: analysis.resumo || 'Análise de cliente completa',
      dados: analysis
    },
    pre_mapeamento_taxonomico: {
      dominio_I: {
        nome: 'Diferenciação Substantiva',
        hipoteses: analysis?.dominios?.substantiva || 'A ser preenchido',
        score_estimado: analysis?.scores?.dominio_I || null
      },
      dominio_II: {
        nome: 'Diferenciação Simbólica',
        hipoteses: analysis?.dominios?.simbolica || 'A ser preenchido',
        score_estimado: analysis?.scores?.dominio_II || null
      },
      dominio_III: {
        nome: 'Distintividade',
        hipoteses: analysis?.dominios?.distintividade || 'A ser preenchido',
        score_estimado: analysis?.scores?.dominio_III || null
      }
    },
    proximos_passos: getProximosPassos(target)
  };

  return handoff;
}

function getProximosPassos(target) {
  const passos = {
    'search-insights': [
      'Executar mine-market-data',
      'Realizar analyze-competition',
      'Produzir synthesize-insights'
    ],
    'deenea': [
      'Executar map-audience',
      'Iniciar build-brand-essence',
      'Validar com validate-positioning'
    ],
    'all': [
      'Search & Insights: Iniciar pesquisa',
      'DEENEA: Aguardar pesquisa para iniciar estratégia'
    ]
  };
  return passos[target] || passos['all'];
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Uso: node generate-handoff.js <briefing.yaml> <analysis.yaml> [--target squad]');
    process.exit(1);
  }

  let target = 'all';
  const targetIdx = args.indexOf('--target');
  if (targetIdx !== -1 && args[targetIdx + 1]) {
    target = args[targetIdx + 1];
  }

  try {
    const handoff = generateHandoff({
      briefingPath: args[0], analysisPath: args[1], target
    });
    const outputPath = path.join(
      path.dirname(args[0]),
      `handoff-${target}-${new Date().toISOString().slice(0, 10)}.yaml`
    );
    fs.writeFileSync(outputPath, yaml.dump(handoff, { lineWidth: 120 }));
    console.log(`Handoff gerado: ${outputPath}`);
  } catch (erro) {
    console.error(`Erro: ${erro.message}`);
    process.exit(1);
  }
}

module.exports = { generateHandoff };
