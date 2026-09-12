import { MUNDOS, FASES } from './config.js';

const CHAVE = 'reino-encantado';

const PADRAO = {
  versao: 1,
  fasesConcluidas: [],   // ['1-1', '1-2', ...]
  unicornios: [],        // ids desbloqueados
  douradas: 0,
  prateadas: 0
};

let dados = carregar();

function carregar() {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return { ...PADRAO };
    const salvo = JSON.parse(cru);
    return { ...PADRAO, ...salvo };
  } catch (e) {
    // localStorage bloqueado (file:// no Safari, aba privada). Joga sem salvar.
    console.warn('Progresso não pôde ser carregado:', e);
    return { ...PADRAO };
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch (e) {
    console.warn('Progresso não pôde ser salvo:', e);
  }
}

export const chaveFase = (mundo, fase) => `${mundo}-${fase}`;

export const estado = {
  get dados() { return dados; },

  concluida(mundo, fase) {
    return dados.fasesConcluidas.includes(chaveFase(mundo, fase));
  },

  /** Fase 1 de cada mundo está aberta se o mundo anterior foi 100% concluído. */
  liberada(mundo, fase) {
    if (fase === 1) return mundo === 1 || this.mundoCompleto(mundo - 1);
    return this.concluida(mundo, fase - 1);
  },

  mundoLiberado(mundo) {
    return mundo === 1 || this.mundoCompleto(mundo - 1);
  },

  mundoCompleto(mundo) {
    return FASES.every((_, i) => this.concluida(mundo, i + 1));
  },

  /** Índice global da fase (0..14), usado para saber qual unicórnio ela ganha. */
  indiceGlobal(mundo, fase) {
    return (mundo - 1) * FASES.length + (fase - 1);
  },

  concluir(mundo, fase, dourada) {
    const chave = chaveFase(mundo, fase);
    if (!dados.fasesConcluidas.includes(chave)) dados.fasesConcluidas.push(chave);
    if (dourada) dados.douradas++; else dados.prateadas++;
    salvar();
  },

  ganharUnicornio(id) {
    if (!dados.unicornios.includes(id)) {
      dados.unicornios.push(id);
      salvar();
      return true;
    }
    return false;
  },

  tem(id) { return dados.unicornios.includes(id); },

  total() { return MUNDOS.length * FASES.length; },

  zerar() {
    dados = { ...PADRAO, fasesConcluidas: [], unicornios: [] };
    salvar();
  }
};
