import { MUNDOS, FASES } from './config.js';
import { ROUPAS } from './roupas.js';

const CHAVE = 'reino-encantado';
const VERSAO = 2;

/** Sempre um objeto novo: espalhar um PADRAO fixo compartilharia os arrays entre cargas. */
const novo = () => ({
  versao: VERSAO,
  fasesConcluidas: [],   // ['1-1', '1-2', ...]
  unicornios: [],        // coleção da versão 1, preservada na migração
  pecas: [],             // ids de roupas.js já ganhos
  look: {},              // { slot: { id, cor } }
  douradas: 0,
  prateadas: 0
});

const indice = (mundo, fase) => (mundo - 1) * FASES.length + (fase - 1);

/** v1 para v2: nada se perde. Unicórnios ficam, e cada fase já fechada entrega a sua peça. */
function migrar(salvo) {
  const dados = { ...novo(), ...salvo };
  if ((salvo.versao || 1) < 2) {
    dados.pecas = dados.fasesConcluidas
      .map(chave => ROUPAS[indice(...chave.split('-').map(Number))])
      .filter(Boolean)
      .map(p => p.id);
    dados.look = {};
    dados.versao = VERSAO;
  }
  return dados;
}

let dados = carregar();

function carregar() {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return novo();
    return migrar(JSON.parse(cru));
  } catch (e) {
    // localStorage bloqueado (file:// no Safari, aba privada). Joga sem salvar.
    console.warn('Progresso não pôde ser carregado:', e);
    return novo();
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

  /** Índice global da fase (0..14), usado para saber qual peça ela ganha. */
  indiceGlobal(mundo, fase) {
    return indice(mundo, fase);
  },

  concluir(mundo, fase, dourada) {
    const chave = chaveFase(mundo, fase);
    if (!dados.fasesConcluidas.includes(chave)) dados.fasesConcluidas.push(chave);
    if (dourada) dados.douradas++; else dados.prateadas++;
    salvar();
  },

  /* ---------- guarda-roupa ---------- */

  ganharPeca(id) {
    if (!dados.pecas.includes(id)) {
      dados.pecas.push(id);
      salvar();
      return true;
    }
    return false;
  },

  temPeca(id) { return dados.pecas.includes(id); },

  vestir(slot, id, cor) {
    dados.look[slot] = { id, cor };
    salvar();
  },

  tirar(slot) {
    delete dados.look[slot];
    salvar();
  },

  pintar(slot, cor) {
    if (!dados.look[slot]) return;
    dados.look[slot].cor = cor;
    salvar();
  },

  total() { return MUNDOS.length * FASES.length; },

  zerar() {
    dados = novo();
    salvar();
  }
};
