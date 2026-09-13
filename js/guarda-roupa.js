import { CORES } from './config.js';
import { estado } from './estado.js';
import { som, falar } from './audio.js';
import { ROUPAS, SLOTS, pecaPorId } from './roupas.js';
import { princesa, miniatura } from './princesa.js';
import { icone } from './icones.js';
import { tremer } from './util.js';

// A tela de vestir. Regra da feature: vestir NÃO tem resposta certa.
// Nada aqui avalia, pontua ou compara o look com a ocasião. Qualquer peça
// vai com qualquer peça, em qualquer cor.

const $ = s => document.querySelector(s);

/** Slot que a paleta pinta: o da última peça vestida. */
let ativa = null;

const primeiroVestido = () => SLOTS.find(s => estado.dados.look[s]) || null;

export function abrirGuardaRoupa() {
  ativa = primeiroVestido();
  desenhar();
  falar(estado.dados.pecas.length
    ? 'Vamos vestir a princesa?'
    : 'Jogue uma fase para ganhar a primeira roupa!');
}

function botaoPeca(peca, look) {
  if (!estado.temPeca(peca.id)) {
    return `<button class="peca travada" data-peca="${peca.id}" aria-label="Roupa ainda não ganha">${icone('cadeado')}</button>`;
  }
  const item = look[peca.slot];
  const vestida = Boolean(item && item.id === peca.id);
  const classes = ['peca', vestida ? 'vestida' : '', vestida && peca.slot === ativa ? 'ativa' : ''].join(' ');
  return `<button class="${classes}" data-peca="${peca.id}" aria-pressed="${vestida}">${
    miniatura(peca, vestida ? item.cor : peca.cor)}</button>`;
}

function desenhar() {
  const { look } = estado.dados;
  $('#provador-princesa').innerHTML = princesa(look);

  $('#pecas').innerHTML = SLOTS.map(slot => `<div class="fileira">${
    ROUPAS.filter(p => p.slot === slot).map(p => botaoPeca(p, look)).join('')
  }</div>`).join('');

  const corAtiva = ativa && look[ativa] ? look[ativa].cor : null;
  const paleta = $('#paleta');
  paleta.classList.toggle('inativa', !corAtiva);
  paleta.innerHTML = CORES.map(c =>
    `<button class="cor ${c.nome === corAtiva ? 'escolhida' : ''}" data-cor="${c.nome}"
      style="background:${c.pelo}" aria-label="${c.nome}"></button>`).join('');
}

/* Tocar veste, tocar de novo tira. */
$('#pecas').addEventListener('click', e => {
  const botao = e.target.closest('.peca');
  if (!botao) return;
  const peca = pecaPorId(botao.dataset.peca);
  if (!peca || !estado.temPeca(peca.id)) { som.travado(); tremer(botao); return; }

  const item = estado.dados.look[peca.slot];
  if (item && item.id === peca.id) {
    estado.tirar(peca.slot);
    if (ativa === peca.slot) ativa = primeiroVestido();
    som.toque();
  } else {
    estado.vestir(peca.slot, peca.id, peca.cor);
    ativa = peca.slot;
    som.virar();
    falar(peca.nome);
  }
  desenhar();
});

$('#paleta').addEventListener('click', e => {
  const botao = e.target.closest('.cor');
  if (!botao) return;
  if (!ativa || !estado.dados.look[ativa]) { som.travado(); tremer($('#paleta')); return; }
  estado.pintar(ativa, botao.dataset.cor);
  som.toque();
  falar(botao.dataset.cor);
  desenhar();
});
