import { FIGURAS } from '../config.js';
import { embaralhar } from '../util.js';
import { som } from '../audio.js';

export function rodada(palco, nivel, api) {
  const pares = nivel.pares;
  const figuras = embaralhar(FIGURAS).slice(0, pares);
  const cartas = embaralhar([...figuras, ...figuras]);
  const colunas = pares <= 2 ? 2 : pares === 3 ? 3 : 4;

  palco.innerHTML = `<div id="memoria" style="grid-template-columns:repeat(${colunas},1fr)">${
    cartas.map(f => `<button class="carta" data-f="${f}">${f}</button>`).join('')
  }</div>`;

  api.pergunta('Ache os pares iguais');

  let abertas = [];
  let travado = false;
  let feitos = 0;

  palco.querySelectorAll('.carta').forEach(carta => {
    carta.addEventListener('click', () => {
      if (travado || carta.classList.contains('aberta') || carta.classList.contains('feita')) return;

      carta.classList.add('aberta');
      som.virar();
      abertas.push(carta);
      if (abertas.length < 2) return;

      travado = true;
      const [a, b] = abertas;

      if (a.dataset.f === b.dataset.f) {
        api.depois(380, () => {
          [a, b].forEach(c => { c.classList.remove('aberta'); c.classList.add('feita'); });
          abertas = [];
          travado = false;
          feitos++;
          if (feitos === pares) {
            api.certo(b);
            api.depois(1200, api.concluir);
          } else {
            som.acerto();
          }
        });
      } else {
        api.depois(950, () => {
          [a, b].forEach(c => c.classList.remove('aberta'));
          abertas = [];
          travado = false;
        });
      }
    });
  });
}
