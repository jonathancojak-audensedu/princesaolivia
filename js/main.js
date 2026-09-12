import { MUNDOS, FASES, UNICORNIOS, ELOGIOS, MODO_PERDER, VIDAS } from './config.js';
import { estado } from './estado.js';
import { som, falar, repetirFala, calar, desbloquear } from './audio.js';
import { festa, faisca } from './festa.js';
import { cenario } from './cenario.js';
import { unicornio, corPorNome } from './unicornio.js';
import { icone } from './icones.js';
import { sorteio, tremer } from './util.js';
import { rodada as rodadaCores } from './jogos/cores.js';
import { rodada as rodadaContar } from './jogos/contar.js';
import { rodada as rodadaMemoria } from './jogos/memoria.js';

const JOGOS = { cores: rodadaCores, contar: rodadaContar, memoria: rodadaMemoria };
/** Memória precisa de mais tempo que um toque simples. */
const FATOR_TEMPO = { cores: 1, contar: 1, memoria: 3 };

const $ = s => document.querySelector(s);
const telas = {
  mundos:   $('#tela-mundos'),
  fases:    $('#tela-fases'),
  jogo:     $('#tela-jogo'),
  premio:   $('#tela-premio'),
  estabulo: $('#tela-estabulo')
};

function mostrar(nome) {
  Object.entries(telas).forEach(([k, el]) => el.hidden = (k !== nome));
}

function pintarCeu(mundo) {
  const [a, b] = mundo ? mundo.ceu : ['#5B3E8C', '#2E2350'];
  document.body.style.setProperty('--ceu-a', a);
  document.body.style.setProperty('--ceu-b', b);
  cenario(mundo ? mundo.id : null);
}

/* ---------------- tela: mundos ---------------- */
function telaMundos() {
  calar();
  pintarCeu(null);
  const lista = $('#lista-mundos');
  lista.innerHTML = MUNDOS.map(m => {
    const aberto = estado.mundoLiberado(m.id);
    const feitas = FASES.filter((_, i) => estado.concluida(m.id, i + 1)).length;
    return `<button class="cartao-mundo ${aberto ? '' : 'travado'}" data-mundo="${m.id}" ${aberto ? '' : 'aria-disabled="true"'}>
      <em>${icone(aberto ? m.icone : 'cadeado')}</em>
      <span>${m.nome}</span>
      <small>${aberto ? `${feitas} de ${FASES.length}` : 'Termine o mundo anterior'}</small>
    </button>`;
  }).join('');

  lista.querySelectorAll('.cartao-mundo').forEach(b => {
    b.addEventListener('click', () => {
      desbloquear();
      if (b.classList.contains('travado')) { som.travado(); tremer(b); return; }
      som.toque();
      telaFases(Number(b.dataset.mundo));
    });
  });

  $('#contador-colecao').textContent = `${estado.dados.unicornios.length} / ${UNICORNIOS.length}`;
  mostrar('mundos');
}

/* ---------------- tela: fases ---------------- */
function telaFases(idMundo) {
  const mundo = MUNDOS.find(m => m.id === idMundo);
  pintarCeu(mundo);
  $('#nome-mundo').innerHTML = `<em class="na-linha">${icone(mundo.icone)}</em>${mundo.nome}`;

  $('#lista-fases').innerHTML = FASES.map((f, i) => {
    const n = i + 1;
    const feita = estado.concluida(idMundo, n);
    const aberta = estado.liberada(idMundo, n);
    const selo = icone(feita ? 'estrela' : aberta ? 'tocar' : 'cadeado');
    return `<button class="cartao-fase ${aberta ? '' : 'travado'} ${feita ? 'feita' : ''}" data-fase="${n}">
      <b>${n}</b><span>${f.nome}</span><em>${selo}</em>
    </button>`;
  }).join('');

  $('#lista-fases').querySelectorAll('.cartao-fase').forEach(b => {
    b.addEventListener('click', () => {
      if (b.classList.contains('travado')) { som.travado(); tremer(b); return; }
      som.toque();
      iniciarFase(idMundo, Number(b.dataset.fase));
    });
  });

  mostrar('fases');
}

/* ---------------- partida ---------------- */
const partida = {
  mundo: null, fase: null, roteiro: [], indice: 0,
  dourada: true, vidas: VIDAS, timers: [], raf: null, fimTempo: 0, pausado: false
};

function limparTimers() {
  partida.timers.forEach(clearTimeout);
  partida.timers = [];
  if (partida.raf) cancelAnimationFrame(partida.raf);
  partida.raf = null;
}

const api = {
  pergunta(texto) {
    $('#pergunta-texto').textContent = texto;
    falar(texto);
  },
  certo(el, falaAntes) {
    som.acerto();
    if (el) { el.classList.add('acerto'); faisca(el); }
    pararTempo();
    api.depois(260, () => falar(falaAntes ? `${falaAntes}. ${sorteio(ELOGIOS)}` : sorteio(ELOGIOS)));
  },
  errado(el) {
    som.erro();
    if (el) tremer(el);
  },
  depois(ms, fn) {
    const id = setTimeout(() => {
      partida.timers = partida.timers.filter(t => t !== id);
      fn();
    }, ms);
    partida.timers.push(id);
    return id;
  },
  concluir() { proximaRodada(); }
};

function iniciarFase(idMundo, numFase) {
  const mundo = MUNDOS.find(m => m.id === idMundo);
  limparTimers();
  Object.assign(partida, {
    mundo, fase: numFase,
    roteiro: FASES[numFase - 1].rodadas,
    indice: 0, dourada: true, vidas: VIDAS
  });
  pintarCeu(mundo);
  $('#titulo-fase').innerHTML = `<em class="na-linha">${icone(mundo.icone)}</em>Fase ${numFase} · ${FASES[numFase - 1].nome}`;
  $('#coracoes').hidden = !MODO_PERDER;
  mostrar('jogo');
  desenharRodadas();
  desenharCoracoes();
  rodar();
}

function desenharRodadas() {
  $('#pontos-rodada').innerHTML = partida.roteiro
    .map((_, i) => `<span class="${i < partida.indice ? 'on' : ''}">${icone('estrela')}</span>`).join('');
}

function desenharCoracoes() {
  if (!MODO_PERDER) return;
  $('#coracoes').innerHTML = Array.from({ length: VIDAS },
    (_, i) => `<span class="${i < partida.vidas ? '' : 'perdido'}">${icone('coracao')}</span>`).join('');
}

function rodar() {
  const tipo = partida.roteiro[partida.indice];
  const palco = $('#palco');
  palco.innerHTML = '';
  palco.classList.remove('saindo');
  JOGOS[tipo](palco, partida.mundo.nivel, api);
  iniciarTempo(partida.mundo.nivel.segundos * (FATOR_TEMPO[tipo] || 1));
}

function proximaRodada() {
  partida.indice++;
  desenharRodadas();
  if (partida.indice >= partida.roteiro.length) return fimDeFase();
  rodar();
}

/* ---------------- ampulheta ---------------- */
function iniciarTempo(segundos) {
  const barra = $('#areia');
  barra.classList.remove('acabou');
  barra.style.width = '100%';
  partida.fimTempo = performance.now() + segundos * 1000;

  const passo = agora => {
    const restante = partida.fimTempo - agora;
    const pct = Math.max(0, restante / (segundos * 1000)) * 100;
    barra.style.width = pct + '%';
    if (restante <= 0) return acabouTempo();
    partida.raf = requestAnimationFrame(passo);
  };
  partida.raf = requestAnimationFrame(passo);
}

function pararTempo() {
  if (partida.raf) cancelAnimationFrame(partida.raf);
  partida.raf = null;
}

function acabouTempo() {
  pararTempo();
  partida.dourada = false;
  $('#areia').classList.add('acabou');

  if (!MODO_PERDER) return;   // sem punição: ela só perde a estrela dourada

  partida.vidas--;
  desenharCoracoes();
  som.erro();
  if (partida.vidas <= 0) {
    falar('Quase! Vamos tentar de novo?');
    api.depois(1600, () => telaFases(partida.mundo.id));
  } else {
    iniciarTempo(partida.mundo.nivel.segundos * 2);
  }
}

/* ---------------- fim de fase ---------------- */
function fimDeFase() {
  limparTimers();
  const jaTinha = estado.concluida(partida.mundo.id, partida.fase);
  estado.concluir(partida.mundo.id, partida.fase, partida.dourada);

  const indice = estado.indiceGlobal(partida.mundo.id, partida.fase);
  const premio = UNICORNIOS[indice % UNICORNIOS.length];
  const novo = estado.ganharUnicornio(premio.id);

  festa(partida.dourada ? 1.6 : 1);
  som.premio();

  if (novo) {
    $('#premio-titulo').textContent = 'Um amigo novo!';
    $('#premio-desenho').innerHTML = unicornio(corPorNome(premio.cor), premio.acessorio);
    $('#premio-nome').textContent = premio.nome;
    falar(`Você ganhou ${premio.nome}!`);
  } else {
    $('#premio-titulo').textContent = jaTinha ? 'Muito bem de novo!' : 'Fase completa!';
    $('#premio-desenho').innerHTML = unicornio(corPorNome(premio.cor), premio.acessorio);
    $('#premio-nome').innerHTML = `<em class="na-linha">${icone('estrela')}</em>${partida.dourada ? 'Estrela dourada' : 'Fase completa'}`;
  }

  $('#premio-selo').innerHTML = `<em class="na-linha">${icone('estrela')}</em>${partida.dourada ? 'dourada' : 'prateada'}`;
  mostrar('premio');
}

/* ---------------- estábulo ---------------- */
function telaEstabulo() {
  pintarCeu(null);
  $('#grade-estabulo').innerHTML = UNICORNIOS.map(u => {
    const tem = estado.tem(u.id);
    return `<figure class="vaga ${tem ? '' : 'vazia'}">
      ${unicornio(corPorNome(u.cor), u.acessorio, !tem)}
      <figcaption>${tem ? u.nome : '???'}</figcaption>
    </figure>`;
  }).join('');
  mostrar('estabulo');
}

/* ---------------- ligações ---------------- */
document.querySelectorAll('[data-icone]').forEach(el => el.innerHTML = icone(el.dataset.icone));
$('#btn-estabulo em').innerHTML = unicornio(corPorNome('rosa'));

$('#btn-estabulo').addEventListener('click', () => { desbloquear(); som.toque(); telaEstabulo(); });
$('#voltar-fases').addEventListener('click', () => { som.toque(); telaMundos(); });
$('#voltar-estabulo').addEventListener('click', () => { som.toque(); telaMundos(); });
$('#sair-jogo').addEventListener('click', () => { limparTimers(); calar(); som.toque(); telaFases(partida.mundo.id); });
$('#repetir').addEventListener('click', repetirFala);
$('#premio-continuar').addEventListener('click', () => { som.toque(); telaFases(partida.mundo.id); });

$('#btn-zerar').addEventListener('click', () => {
  if (confirm('Apagar todo o progresso e a coleção?')) { estado.zerar(); telaMundos(); }
});

document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('visibilitychange', () => { if (document.hidden) calar(); });

telaMundos();

/* ---------------- service worker ---------------- */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW:', e));
}
