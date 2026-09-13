import { CORES } from './config.js';
import { pecaPorId } from './roupas.js';

// A princesa em camadas, todas no mesmo viewBox 0 0 200 340.
//
// Cada slot tem uma âncora fixa. A peça é desenhada em volta de (0,0) e aqui
// ganha um translate para a âncora do slot. Mexeu no corpo? Ajuste a âncora,
// nunca as peças: é isso que mantém qualquer combinação encaixando.

const PELE = '#F5C9A6';
const CABELO = '#7A4A2E';
const OLHO = '#3A2B55';

export const ANCORAS = {
  cabeca: [100, 44],    // topo da cabeça
  rosto:  [100, 88],    // linha dos olhos
  tronco: [100, 130],   // base do pescoço
  pernas: [100, 200],   // cintura
  pes:    [100, 312],   // chão, entre os dois pés
  mao:    [150, 208]    // mão direita de quem olha (a esquerda fica 100 à esquerda)
};

const corPorNome = nome => CORES.find(c => c.nome === nome) || CORES[0];

/** Peça vestida num slot, já posicionada na âncora. Vazio se o slot está livre. */
function camada(look, cores, slot) {
  const peca = look[slot] && pecaPorId(look[slot]);
  if (!peca || peca.slot !== slot) return '';
  const [x, y] = ANCORAS[slot];
  const cor = corPorNome(cores[peca.id] || peca.cor);
  return `<g transform="translate(${x} ${y})" data-peca="${peca.id}">${peca.desenho(cor)}</g>`;
}

/**
 * @param {object} look  `{ slot: idDaPeca }`, com slots de roupas.js.
 *                       Ids desconhecidos são ignorados, então um look antigo nunca quebra o desenho.
 * @param {object} cores `{ idDaPeca: nomeDaCor }`. Peça sem cor escolhida usa a cor padrão.
 */
export function princesa(look = {}, cores = {}) {
  const tronco = look.tronco && pecaPorId(look.tronco);
  const base = !(tronco && tronco.semBase);

  return `<svg viewBox="0 0 200 340" role="img" aria-label="princesa">
  <path d="M54 84Q50 28 100 28T146 84l8 90q-54 16-108 0z" fill="${CABELO}"/>
  <path d="M84 236h13v76H84zM103 236h13v76h-13z" fill="${PELE}"/>
  <ellipse cx="89" cy="314" rx="11" ry="6" fill="${PELE}"/>
  <ellipse cx="111" cy="314" rx="11" ry="6" fill="${PELE}"/>
  ${camada(look, cores, 'pes')}
  <path d="M77 142L51 206M123 142L149 206" stroke="${PELE}" stroke-width="13" stroke-linecap="round"/>
  <circle cx="50" cy="208" r="9" fill="${PELE}"/>
  <circle cx="150" cy="208" r="9" fill="${PELE}"/>
  <path d="M78 134Q100 126 122 134L119 238Q100 246 81 238z" fill="${PELE}"/>
  <rect x="92" y="112" width="16" height="24" fill="${PELE}"/>
  ${base ? '<path d="M80 134Q100 128 120 134L140 262Q100 274 60 262z" fill="#FFF3E2"/>' : ''}
  ${camada(look, cores, 'tronco')}
  ${camada(look, cores, 'pernas')}
  <circle cx="100" cy="80" r="40" fill="${PELE}"/>
  <path d="M58 84Q56 36 100 36T142 84Q130 56 100 58T58 84z" fill="${CABELO}"/>
  <circle cx="86" cy="88" r="5" fill="${OLHO}"/>
  <circle cx="114" cy="88" r="5" fill="${OLHO}"/>
  <circle cx="87.8" cy="86.2" r="1.6" fill="#fff"/>
  <circle cx="115.8" cy="86.2" r="1.6" fill="#fff"/>
  <ellipse cx="76" cy="100" rx="7" ry="4.5" fill="#FF6F9C" opacity=".4"/>
  <ellipse cx="124" cy="100" rx="7" ry="4.5" fill="#FF6F9C" opacity=".4"/>
  <path d="M91 102q9 8 18 0" stroke="#C0506F" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  ${camada(look, cores, 'rosto')}
  ${camada(look, cores, 'cabeca')}
  ${camada(look, cores, 'mao')}
</svg>`;
}

/** A peça sozinha, para botão e tela de prêmio. Sem cor, usa a cor padrão da peça. */
export function miniatura(peca, cor = peca.cor) {
  return `<svg viewBox="${peca.vista}" role="img" aria-label="${peca.nome}">${peca.desenho(corPorNome(cor))}</svg>`;
}
