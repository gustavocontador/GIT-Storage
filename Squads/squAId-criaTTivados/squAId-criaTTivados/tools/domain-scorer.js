/**
 * domain-scorer.js
 * Squad: squAId-criaTTivados
 *
 * Calcula scores por Domínio da Taxonomia de Diferenciais.
 *   I: Substantiva (produto, preço, distribuição, experiência)
 *   II: Simbólica (narrativa, valores, personalidade, comunidade)
 *   III: Distintividade (visual, verbal, sensorial, reconhecimento)
 *
 * Uso: const { DomainScorer } = require('./domain-scorer');
 */

const CRITERIOS = {
  dominio_I: {
    nome: 'Diferenciação Substantiva',
    peso: 0.35,
    dimensoes: [
      { id: 'produto', nome: 'Produto/Serviço', peso: 0.3 },
      { id: 'preco', nome: 'Preço/Valor', peso: 0.2 },
      { id: 'distribuicao', nome: 'Distribuição/Acesso', peso: 0.2 },
      { id: 'experiencia', nome: 'Experiência do Cliente', peso: 0.3 }
    ]
  },
  dominio_II: {
    nome: 'Diferenciação Simbólica',
    peso: 0.35,
    dimensoes: [
      { id: 'narrativa', nome: 'Narrativa/Propósito', peso: 0.25 },
      { id: 'valores', nome: 'Valores/Cultura', peso: 0.25 },
      { id: 'personalidade', nome: 'Personalidade/Arquétipo', peso: 0.25 },
      { id: 'comunidade', nome: 'Comunidade/Pertencimento', peso: 0.25 }
    ]
  },
  dominio_III: {
    nome: 'Distintividade',
    peso: 0.30,
    dimensoes: [
      { id: 'visual', nome: 'Identidade Visual', peso: 0.3 },
      { id: 'verbal', nome: 'Identidade Verbal', peso: 0.25 },
      { id: 'sensorial', nome: 'Assets Sensoriais', peso: 0.2 },
      { id: 'reconhecimento', nome: 'Reconhecimento/Recall', peso: 0.25 }
    ]
  }
};

class DomainScorer {
  constructor() {
    this.criterios = CRITERIOS;
  }

  /**
   * Calcula scores para todos os domínios
   * @param {Object} dados - { dominio_I: { produto: 4, ... }, ... } (scores 1-5)
   */
  calculate(dados) {
    const resultado = { dominios: {}, score_geral: 0, classificacao: '', recomendacoes: [] };
    let scoreGeralPonderado = 0;

    for (const [dominioId, dominio] of Object.entries(this.criterios)) {
      const dadosDominio = dados[dominioId] || {};
      let scorePonderado = 0;
      const dimensoes = {};

      for (const dim of dominio.dimensoes) {
        const score = Math.min(5, Math.max(1, dadosDominio[dim.id] || 0));
        dimensoes[dim.id] = { nome: dim.nome, score, peso: dim.peso };
        scorePonderado += score * dim.peso;
      }

      const scoreRound = Math.round(scorePonderado * 100) / 100;
      resultado.dominios[dominioId] = {
        nome: dominio.nome, score: scoreRound,
        dimensoes, forca: this._classificar(scoreRound)
      };
      scoreGeralPonderado += scoreRound * dominio.peso;
    }

    resultado.score_geral = Math.round(scoreGeralPonderado * 100) / 100;
    resultado.classificacao = this._classificar(resultado.score_geral);
    resultado.recomendacoes = this._recomendacoes(resultado.dominios);
    return resultado;
  }

  _classificar(score) {
    if (score >= 4.5) return 'Excelente';
    if (score >= 3.5) return 'Forte';
    if (score >= 2.5) return 'Moderado';
    if (score >= 1.5) return 'Fraco';
    return 'Crítico';
  }

  _recomendacoes(dominios) {
    const recs = [];
    for (const [, dom] of Object.entries(dominios)) {
      if (dom.score < 3.0) {
        recs.push({ prioridade: 'alta', mensagem: `${dom.nome} abaixo do aceitável (${dom.score}/5)` });
      }
      for (const [, dim] of Object.entries(dom.dimensoes)) {
        if (dim.score > 0 && dim.score < 2.5) {
          recs.push({ prioridade: 'media', mensagem: `${dim.nome} é ponto fraco (${dim.score}/5) em ${dom.nome}` });
        }
      }
    }
    return recs;
  }
}

// CLI
if (require.main === module) {
  const exemplo = {
    dominio_I: { produto: 4, preco: 3, distribuicao: 3, experiencia: 4 },
    dominio_II: { narrativa: 5, valores: 4, personalidade: 4, comunidade: 3 },
    dominio_III: { visual: 4, verbal: 3, sensorial: 2, reconhecimento: 3 }
  };

  const scorer = new DomainScorer();
  const res = scorer.calculate(exemplo);

  console.log(`Score Geral: ${res.score_geral}/5 (${res.classificacao})\n`);
  for (const [, dom] of Object.entries(res.dominios)) {
    console.log(`${dom.nome}: ${dom.score}/5 (${dom.forca})`);
    for (const [, dim] of Object.entries(dom.dimensoes)) {
      console.log(`  ${dim.nome}: ${dim.score}/5`);
    }
  }
  if (res.recomendacoes.length > 0) {
    console.log('\nRecomendações:');
    res.recomendacoes.forEach(r => console.log(`  [${r.prioridade}] ${r.mensagem}`));
  }
}

module.exports = { DomainScorer, CRITERIOS };
