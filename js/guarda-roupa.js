import { CORES, UNICORNIOS } from './config.js';
import { estado } from './estado.js';
import { som, falar } from './audio.js';
import { ROUPAS, SLOTS, pecaPorId } from './roupas.js';
import { princesa, miniatura } from './princesa.js';
import { unicornio, corPorNome } from './unicornio.js';
import { icone } from './icones.js';
import { tremer } from './util.js';

// A tela de vestir. Regra da feature: vestir NÃO tem resposta certa.
// Nada aqui avalia, pontua ou compara o look com a ocasião. Qualquer peça
// vai com qualquer peça, em qualquer cor.

const $ = s => document.querySelector(s);

/** Peça que a paleta pinta: a última vestida. */
let ativa = null;

const vestida = id => Object.values(estado.dados.look).includes(id);
const primeiraVestida = () => {
  const slot = SLOTS.find(s => estado.dados.look[s]);
  return slot ? estado.dados.look[slot] : null;
};

/** Abre falando. Use `desenharGuardaRoupa` para voltar sem repetir a fala. */
export function abrirGuardaRoupa() {
  ativa = primeiraVestida();
  desenharGuardaRoupa();
  falar(estado.dados.pecas.length
    ? 'Vamos vestir a princesa?'
    : 'Jogue uma fase para ganhar a primeira roupa!');
}

function botaoPeca(peca) {
  if (!estado.temPeca(peca.id)) {
    return `<button class="peca travada" data-peca="${peca.id}" aria-label="Roupa ainda não ganha">${icone('cadeado')}</button>`;
  }
  const noCorpo = vestida(peca.id);
  const classes = ['peca', noCorpo ? 'vestida' : '', noCorpo && peca.id === ativa ? 'ativa' : ''].join(' ');
  return `<button class="${classes}" data-peca="${peca.id}" aria-pressed="${noCorpo}">${
    miniatura(peca, estado.corDe(peca.id))}</button>`;
}

export function desenharGuardaRoupa() {
  const { look, cores, companhia } = estado.dados;
  if (ativa && !vestida(ativa)) ativa = primeiraVestida();

  $('#provador-princesa').innerHTML = princesa(look, cores);

  const amigo = UNICORNIOS.find(u => u.id === companhia);
  $('#btn-estabulo').innerHTML = amigo
    ? unicornio(corPorNome(amigo.cor), amigo.acessorio)
    : unicornio(corPorNome('rosa'), '', true);

  $('#pecas').innerHTML = SLOTS.map(slot => `<div class="fileira">${
    ROUPAS.filter(p => p.slot === slot).map(botaoPeca).join('')
  }</div>`).join('');

  const corAtiva = ativa ? estado.corDe(ativa) : null;
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

  if (vestida(peca.id)) {
    estado.tirar(peca.slot);
    som.toque();
  } else {
    estado.vestir(peca.id);
    ativa = peca.id;
    som.virar();
    falar(peca.nome);
  }
  desenharGuardaRoupa();
});

$('#paleta').addEventListener('click', e => {
  const botao = e.target.closest('.cor');
  if (!botao) return;
  if (!ativa) { som.travado(); tremer($('#paleta')); return; }
  estado.pintar(ativa, botao.dataset.cor);
  som.toque();
  falar(botao.dataset.cor);
  desenharGuardaRoupa();
});
