/**
 * checkpoint-runner.js
 * Squad: squAId-criaTTivados
 *
 * Executa validação automatizada de checkpoints e CBO gates.
 * Carrega checklist e valida dados contra critérios.
 *
 * Uso: node checkpoint-runner.js <checklist-name> [data-file.yaml]
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

class CheckpointRunner {
  constructor(checklistDir) {
    this.checklistDir = checklistDir || path.join(__dirname, '..', 'checklists');
  }

  /**
   * Executa um checkpoint/gate
   * @param {string} checklistName - Nome da checklist (sem extensão)
   * @param {Object} dados - Dados a validar
   */
  run(checklistName, dados) {
    const checklist = this._loadChecklist(checklistName);
    if (!checklist) {
      return { aprovado: false, erro: `Checklist não encontrada: ${checklistName}`, itens: [] };
    }

    const resultados = [];
    let totalObrigatorios = 0;
    let aprovadosObrigatorios = 0;

    for (const [, categoria] of Object.entries(checklist.itens || {})) {
      for (const item of categoria.items || []) {
        const valor = this._buscarValor(dados, item.id);
        const aprovado = valor !== null && valor !== undefined && valor !== false && valor !== '';

        resultados.push({
          categoria: categoria.nome, id: item.id,
          descricao: item.descricao, obrigatorio: item.obrigatorio || false,
          aprovado, valor_encontrado: valor !== null
        });

        if (item.obrigatorio) {
          totalObrigatorios++;
          if (aprovado) aprovadosObrigatorios++;
        }
      }
    }

    const score = totalObrigatorios > 0
      ? Math.round((aprovadosObrigatorios / totalObrigatorios) * 100) : 0;
    const scoreMinimo = checklist.aprovacao?.score_minimo || 80;

    return {
      checklist: checklistName,
      tipo: checklist.metadata?.tipo || 'checkpoint',
      entregavel: checklist.entregavel || '',
      aprovado: score >= scoreMinimo,
      score, score_minimo: scoreMinimo,
      obrigatorios: totalObrigatorios,
      aprovados: aprovadosObrigatorios,
      itens: resultados,
      acao_rejeicao: score < scoreMinimo
        ? (checklist.aprovacao?.acao_rejeicao || 'Revisar itens reprovados')
        : null
    };
  }

  _loadChecklist(nome) {
    const filePath = path.join(this.checklistDir, `${nome}.yaml`);
    if (!fs.existsSync(filePath)) return null;
    try {
      return yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (erro) {
      console.error(`Erro ao carregar checklist: ${erro.message}`);
      return null;
    }
  }

  _buscarValor(dados, id) {
    if (!dados) return null;
    if (dados[id] !== undefined) return dados[id];
    if (dados[`item_${id}`] !== undefined) return dados[`item_${id}`];
    return null;
  }

  listCheckpoints() {
    if (!fs.existsSync(this.checklistDir)) return [];
    return fs.readdirSync(this.checklistDir)
      .filter(f => f.endsWith('.yaml'))
      .map(f => f.replace('.yaml', ''));
  }

  formatResult(resultado) {
    const emoji = resultado.aprovado ? 'APROVADO' : 'REJEITADO';
    const linhas = [
      `${resultado.aprovado ? '✓' : '✗'} ${resultado.checklist} — ${emoji}`,
      `  Score: ${resultado.score}% (mínimo: ${resultado.score_minimo}%)`,
      `  Itens: ${resultado.aprovados}/${resultado.obrigatorios} obrigatórios`
    ];

    const porCategoria = {};
    for (const item of resultado.itens) {
      if (!porCategoria[item.categoria]) porCategoria[item.categoria] = [];
      porCategoria[item.categoria].push(item);
    }

    for (const [cat, itens] of Object.entries(porCategoria)) {
      linhas.push(`  ${cat}:`);
      for (const item of itens) {
        linhas.push(`    ${item.aprovado ? '✓' : '✗'} ${item.descricao}${item.obrigatorio ? ' *' : ''}`);
      }
    }

    if (!resultado.aprovado && resultado.acao_rejeicao) {
      linhas.push(`\n  Ação: ${resultado.acao_rejeicao}`);
    }

    return linhas.join('\n');
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const runner = new CheckpointRunner();
    const checkpoints = runner.listCheckpoints();
    console.log('Checkpoints disponíveis:');
    checkpoints.forEach(c => console.log(`  - ${c}`));
    console.log('\nUso: node checkpoint-runner.js <nome> [dados.yaml]');
    process.exit(0);
  }

  let dados = {};
  if (args[1]) {
    try {
      dados = yaml.load(fs.readFileSync(args[1], 'utf8'));
    } catch (erro) {
      console.error(`Erro: ${erro.message}`);
      process.exit(1);
    }
  }

  const runner = new CheckpointRunner();
  const resultado = runner.run(args[0], dados);
  console.log(runner.formatResult(resultado));
  process.exit(resultado.aprovado ? 0 : 1);
}

module.exports = { CheckpointRunner };
