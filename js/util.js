export const embaralhar = lista =>
  lista.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);

export const sorteio = lista => lista[Math.floor(Math.random() * lista.length)];

export const inteiro = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export const esperar = ms => new Promise(r => setTimeout(r, ms));

/** Substitui o conteúdo de um elemento por HTML. */
export function pintar(el, html) { el.innerHTML = html; }

/** Anima erro sem punir: treme e volta. */
export function tremer(el) {
  el.classList.add('erro');
  setTimeout(() => el.classList.remove('erro'), 480);
}
