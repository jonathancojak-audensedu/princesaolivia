import { CORES } from '../config.js';
import { unicornio } from '../unicornio.js';
import { embaralhar, sorteio } from '../util.js';

/** Grupos de tons parecidos, usados só no mundo 3 para dificultar de verdade. */
const PARECIDAS = [
  ['rosa', 'vermelho', 'laranja'],
  ['azul', 'roxo', 'verde'],
  ['amarelo', 'laranja', 'branco']
];

export function rodada(palco, nivel, api) {
  let opcoes;

  if (nivel.coresParecidas) {
    const grupo = sorteio(PARECIDAS);
    const base = CORES.filter(c => grupo.includes(c.nome));
    const resto = CORES.filter(c => !grupo.includes(c.nome));
    opcoes = embaralhar([...base, ...embaralhar(resto)]).slice(0, nivel.opcoes);
    // garante que pelo menos dois tons parecidos apareçam juntos
    if (!opcoes.some(c => grupo.includes(c.nome))) opcoes[0] = sorteio(base);
  } else {
    opcoes = embaralhar(CORES).slice(0, nivel.opcoes);
  }

  const alvo = sorteio(opcoes);

  palco.innerHTML = `<div class="linha">${
    opcoes.map(c => `<button class="alvo" data-cor="${c.nome}">${unicornio(c)}</button>`).join('')
  }</div>`;

  api.pergunta(`Toque no unicórnio ${alvo.nome}`);

  palco.querySelectorAll('.alvo').forEach(botao => {
    botao.addEventListener('click', () => {
      if (botao.dataset.cor === alvo.nome) {
        palco.querySelectorAll('.alvo').forEach(o => { if (o !== botao) o.classList.add('some'); });
        api.certo(botao);
        api.depois(1300, api.concluir);
      } else {
        api.errado(botao);
      }
    });
  });
}
