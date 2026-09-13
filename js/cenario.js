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
  @keyframes flutua-lua { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes desliza { from{transform:translateX(-140px)} to{transform:translateX(940px)} }
  @keyframes balanca { 0%,100%{transform:rotate(-1.2deg)} 50%{transform:rotate(1.2deg)} }
  @keyframes vagalume{ 0%,100%{opacity:0;transform:translate(0,0)}
                       30%{opacity:.8} 60%{opacity:.3;transform:translate(26px,-32px)} }
  .estrela  { animation: cintila 4s ease-in-out infinite }
  .nuvem    { animation: desliza linear infinite }
  .copa     { animation: balanca 7s ease-in-out infinite; transform-origin: 50% 100% }
  .lume     { animation: vagalume 6s ease-in-out infinite }
  .lua      { animation: flutua-lua 14s ease-in-out infinite }
  @media (prefers-reduced-motion: reduce) { .cena * { animation: none !important } }
</style>`;

// Último mundo desenhado. Começa undefined para que o primeiro null (menu) também desenhe.
let ultimo;

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

/* ---------- ocasiões ---------- */

// Palco das ocasiões, num viewBox retrato 300x360 com o chão a partir de y=262.
// Os fundos passam muito da borda do viewBox de propósito: com `meet`, tela mais
// larga ou mais alta mostra céu e chão em vez de faixa vazia.
// Sem classes nem animação: não pode herdar nada do ESTILO do fundo.

const cerca = () => [-130, -70, -10, 50, 110, 170, 230, 290, 350, 410]
  .map(x => `<rect x="${x}" y="204" width="8" height="58"/>`).join('');

const OCASIOES = {
  1: () => `
    <rect x="-500" y="-500" width="1300" height="770" fill="#7FC4FF"/>
    <circle cx="250" cy="64" r="26" fill="#FFD766"/>
    <rect x="-500" y="196" width="1300" height="80" fill="#2F72C9"/>
    <path d="M-500 208H800" stroke="#EAF2FF" stroke-width="3" stroke-dasharray="18 22" opacity=".6"/>
    <path d="M-500 268Q150 250 800 268V900H-500z" fill="#FFE0A8"/>
    <path d="M20 330V178" stroke="#8A5A2B" stroke-width="5"/>
    <path d="M-26 184q46-54 92 0z" fill="#FF8FB1"/>
    <path d="M6 184q14-54 28 0z" fill="#FFF3E2"/>`,

  2: () => `
    <rect x="-500" y="-500" width="1300" height="800" fill="#FFC98F"/>
    <circle cx="246" cy="70" r="30" fill="#FFE08A"/>
    <path d="M-500 230Q40 180 150 214T800 200V900H-500z" fill="#E6A965"/>
    <rect x="-500" y="262" width="1300" height="700" fill="#D9A066"/>
    <g fill="#8A5A2B">
      <rect x="-500" y="214" width="1300" height="7"/>
      <rect x="-500" y="236" width="1300" height="7"/>
      ${cerca()}
    </g>`,

  3: () => `
    <rect x="-500" y="-500" width="1300" height="770" fill="#3B2B6E"/>
    <rect x="-500" y="262" width="1300" height="700" fill="#5B3E8C"/>
    <path d="M-500 264H800" stroke="#8A5BD1" stroke-width="5"/>
    <path d="M-500 -500H14Q0 120 34 262H-500z" fill="#C62828"/>
    <path d="M800 -500H286Q300 120 266 262H800z" fill="#C62828"/>
    <path d="M150 -500V36" stroke="#FFC94A" stroke-width="3"/>
    <path d="M112 40Q150 72 188 40z" fill="#FFC94A"/>
    <g fill="#FFE08A">
      <circle cx="112" cy="40" r="6"/><circle cx="150" cy="58" r="6"/><circle cx="188" cy="40" r="6"/>
    </g>
    <g fill="#fff" opacity=".35">
      <circle cx="60" cy="120" r="2.5"/><circle cx="240" cy="96" r="2"/>
      <circle cx="220" cy="170" r="2.5"/><circle cx="80" cy="200" r="2"/>
    </g>`
};

/** Encaixa um <svg> pronto dentro do palco, na posição e tamanho dados. */
const posicionar = (svg, x, y, largura, altura) =>
  svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${largura}" height="${altura}" `);

/**
 * Palco completo de uma ocasião, com a princesa e o unicórnio já de pé no chão.
 * @param {number} idMundo        1 Praia, 2 Vaquejada, 3 Baile
 * @param {string} princesaSvg    saída de princesa(), viewBox 200x340
 * @param {string} unicornioSvg   saída de unicornio(), viewBox 140x150
 */
export function palcoOcasiao(idMundo, princesaSvg, unicornioSvg) {
  const fundo = OCASIOES[idMundo] || OCASIOES[1];
  return `<svg viewBox="0 0 300 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    ${fundo()}
    ${posicionar(princesaSvg, 40, 84, 156, 265)}
    ${posicionar(unicornioSvg, 172, 226, 112, 120)}
  </svg>`;
}

/**
 * Troca o cenário de fundo. Chame junto com `pintarCeu()` ao mudar de mundo.
 * @param {number|null} idMundo 1, 2 ou 3. `null` volta ao céu neutro do menu.
 * Mesmo mundo de antes não redesenha: evita recriar o SVG e o fundo saltar a cada tela.
 */
export function cenario(idMundo) {
  const alvo = document.getElementById('ceu');
  if (!alvo || idMundo === ultimo) return;
  ultimo = idMundo;
  const desenhar = CENAS[idMundo] || CENAS[1];
  alvo.innerHTML = `<svg class="cena" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice"
    width="100%" height="100%" aria-hidden="true">${ESTILO}${desenhar()}</svg>`;
}
