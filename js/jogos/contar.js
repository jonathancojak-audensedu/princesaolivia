import { embaralhar, inteiro } from '../util.js';

export function rodada(palco, nivel, api) {
  const max = nivel.maxNumero;
  const certo = inteiro(1, max);

  const opcoes = new Set([certo]);
  while (opcoes.size < Math.min(3, max)) opcoes.add(inteiro(1, max));
  const lista = embaralhar([...opcoes]);

  const estrelas = Array.from({ length: certo }, (_, i) =>
    `<i style="animation-delay:${(i * 0.18).toFixed(2)}s">⭐</i>`).join('');

  // Acima de 5, mostra só o algarismo: bolinha demais vira poluição visual.
  const bolinhas = n => n <= 5 ? `<u>${'<s></s>'.repeat(n)}</u>` : '';

  palco.innerHTML = `
    <div id="contagem">${estrelas}</div>
    <div class="linha">${lista.map(n =>
      `<button class="num" data-n="${n}"><b>${n}</b>${bolinhas(n)}</button>`).join('')}</div>`;

  api.pergunta('Quantas estrelas?');

  palco.querySelectorAll('.num').forEach(botao => {
    botao.addEventListener('click', () => {
      if (Number(botao.dataset.n) === certo) {
        api.certo(botao, String(certo));
        api.depois(1300, api.concluir);
      } else {
        api.errado(botao);
      }
    });
  });
}
