// Cenário de fundo, um por mundo. Fica atrás de tudo e não recebe toque.
//
// Regras que este arquivo segue de propósito:
// - Nada se move no terço central da tela, que é onde ela precisa olhar.
// - Silhuetas em opacidade baixa. O fundo não pode competir com o conteúdo.
// - Ciclos longos (20s a 120s). Movimento rápido rouba atenção de criança pequena.
// - Só transform e opacity, que rodam na GPU e não travam celular fraco.
// - `prefers-reduced-motion` congela tudo.

const ESTILO = `<style>
  .cena * { transform-box: fill-box; }
  @keyframes cintila { 0%,100%{opacity:.12} 50%{opacity:.55} }
  @keyframes flutua  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes desliza { from{transform:translateX(-140px)} to{transform:translateX(940px)} }
  @keyframes balanca { 0%,100%{transform:rotate(-1.2deg)} 50%{transform:rotate(1.2deg)} }
  @keyframes vagalume{ 0%,100%{opacity:0;transform:translate(0,0)}
                       30%{opacity:.8} 60%{opacity:.3;transform:translate(26px,-32px)} }
  .estrela  { animation: cintila 4s ease-in-out infinite }
  .nuvem    { animation: desliza linear infinite }
  .copa     { animation: balanca 7s ease-in-out infinite; transform-origin: 50% 100% }
  .lume     { animation: vagalume 6s ease-in-out infinite }
  .lua      { animation: flutua 14s ease-in-out infinite }
  @media (prefers-reduced-motion: reduce) { .cena * { animation: none !important } }
</style>`;

const aleatorio = (min, max) => min + Math.random() * (max - min);

/** Campo de estrelas compartilhado pelos cenários noturnos. */
function estrelas(qtd, alturaMax) {
  let saida = '';
  for (let i = 0; i < qtd; i++) {
    const r = aleatorio(0.8, 2.4).toFixed(1);
    saida += `<circle class="estrela" cx="${aleatorio(0, 800).toFixed(0)}" cy="${aleatorio(10, alturaMax).toFixed(0)}"
      r="${r}" fill="#fff" style="animation-delay:${aleatorio(0, 4).toFixed(1)}s"/>`;
  }
  return saida;
}

const CENAS = {
  1: () => `
    ${estrelas(40, 300)}
    <g class="lua" opacity=".5">
      <circle cx="680" cy="90" r="34" fill="#FFE08A"/>
      <circle cx="666" cy="80" r="28" fill="#2E2350" opacity=".85"/>
    </g>
    <g opacity=".22" fill="#150F2E">
      <path d="M0 600V470q120-40 210-10t190-30 200 20 200-30v180z"/>
      <path d="M300 480V380l26 18 26-18v100zM448 480V340l26 18 26-18v140zM596 480V380l26 18 26-18v100z"/>
      <path d="M300 470h348v130H300z"/>
    </g>`,

  2: () => `
    ${estrelas(26, 240)}
    <g opacity=".5" fill="#1E5740">
      <path d="M0 600V500q100-28 180 0t180-14 180 18 260-20v116z"/>
      <g class="copa"><ellipse cx="110" cy="450" rx="96" ry="76"/></g>
      <g class="copa" style="animation-delay:-2.4s"><ellipse cx="690" cy="430" rx="112" ry="86"/></g>
      <g class="copa" style="animation-delay:-4.8s"><ellipse cx="400" cy="500" rx="78" ry="60"/></g>
      <rect x="96" y="490" width="26" height="110"/>
      <rect x="676" y="480" width="30" height="120"/>
    </g>
    <g fill="#FFE08A">
      <circle class="lume" cx="210" cy="430" r="3.4"/>
      <circle class="lume" cx="330" cy="380" r="2.8" style="animation-delay:-1.7s"/>
      <circle class="lume" cx="560" cy="410" r="3.2" style="animation-delay:-3.1s"/>
      <circle class="lume" cx="640" cy="350" r="2.6" style="animation-delay:-4.5s"/>
      <circle class="lume" cx="120" cy="370" r="3" style="animation-delay:-5.4s"/>
    </g>`,

  3: () => `
    ${estrelas(22, 180)}
    <g opacity=".17" fill="#DCE9FF">
      <g class="nuvem" style="animation-duration:96s">
        <ellipse cx="0" cy="150" rx="78" ry="34"/><ellipse cx="54" cy="160" rx="60" ry="28"/>
      </g>
      <g class="nuvem" style="animation-duration:136s;animation-delay:-40s">
        <ellipse cx="0" cy="330" rx="104" ry="42"/><ellipse cx="70" cy="344" rx="76" ry="34"/>
      </g>
      <g class="nuvem" style="animation-duration:118s;animation-delay:-88s">
        <ellipse cx="0" cy="500" rx="90" ry="38"/><ellipse cx="62" cy="512" rx="68" ry="30"/>
      </g>
    </g>
    <g opacity=".3" fill="#C8DCF7">
      <ellipse cx="120" cy="580" rx="190" ry="52"/>
      <ellipse cx="620" cy="596" rx="230" ry="60"/>
    </g>`
};

/**
 * Troca o cenário de fundo. Chame junto com `pintarCeu()` ao mudar de mundo.
 * @param {number|null} idMundo 1, 2 ou 3. `null` volta ao céu neutro do menu.
 */
export function cenario(idMundo) {
  const alvo = document.getElementById('ceu');
  if (!alvo) return;
  const desenhar = CENAS[idMundo] || CENAS[1];
  alvo.innerHTML = `<svg class="cena" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice"
    width="100%" height="100%" aria-hidden="true">${ESTILO}${desenhar()}</svg>`;
}
