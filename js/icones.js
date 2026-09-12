// Ícones em SVG inline. Substituem os emoji, que eram fonte do sistema:
// desenhavam diferente em cada aparelho, piscavam ao trocar do glifo
// monocromático para o colorido, e os mais novos nem existiam em Android antigo.
//
// Todos desenham num viewBox 100x100, então escalam por font-size/width do pai.

const svg = (conteudo, titulo) =>
  `<svg viewBox="0 0 100 100" class="icone" role="img" aria-label="${titulo}">${conteudo}</svg>`;

export const ICONES = {
  coroa: svg(`
    <path d="M18 68 12 30l22 14 16-24 16 24 22-14-6 38z" fill="#FFC94A"/>
    <path d="M18 68h64v10H18z" fill="#E09E12"/>
    <circle cx="50" cy="52" r="5" fill="#FF6F9C"/>
    <circle cx="30" cy="56" r="4" fill="#7FC4FF"/>
    <circle cx="70" cy="56" r="4" fill="#7FC4FF"/>`, 'coroa'),

  estrela: svg(`
    <path d="M50 8 62 38l32 3-24 22 7 31-27-17-27 17 7-31-24-22 32-3z" fill="#FFC94A"/>
    <path d="M50 20 58 42l23 2-17 16 5 22-19-12z" fill="#FFE08A"/>`, 'estrela'),

  coracao: svg(`
    <path d="M50 84C24 66 10 52 10 36c0-12 9-20 20-20 8 0 15 4 20 11 5-7 12-11 20-11
             11 0 20 8 20 20 0 16-14 30-40 48z" fill="#FF6F9C"/>
    <ellipse cx="34" cy="34" rx="7" ry="9" fill="#fff" opacity=".45" transform="rotate(-25 34 34)"/>`, 'coração'),

  arcoiris: svg(`
    <path d="M10 78a40 40 0 0 1 80 0H78a28 28 0 0 0-56 0z" fill="#FF6F9C"/>
    <path d="M22 78a28 28 0 0 1 56 0H66a16 16 0 0 0-32 0z" fill="#FFC94A"/>
    <path d="M34 78a16 16 0 0 1 32 0H54a4 4 0 0 0-8 0z" fill="#7FC4FF"/>`, 'arco-íris'),

  castelo: svg(`
    <path d="M16 46h68v42H16z" fill="#C6A0F5"/>
    <path d="M16 46V26l10 8 10-8v20zM64 46V26l10 8 10-8v20z" fill="#8A5BD1"/>
    <path d="M40 46V22l10-10 10 10v24z" fill="#8A5BD1"/>
    <path d="M42 88V66a8 8 0 0 1 16 0v22z" fill="#FFC94A"/>
    <circle cx="50" cy="38" r="5" fill="#FFF3E2"/>
    <rect x="24" y="56" width="10" height="12" rx="5" fill="#FFF3E2"/>
    <rect x="66" y="56" width="10" height="12" rx="5" fill="#FFF3E2"/>`, 'castelo'),

  bolo: svg(`
    <path d="M26 52h48l-6 34a6 6 0 0 1-6 5H38a6 6 0 0 1-6-5z" fill="#FFF3E2"/>
    <path d="M24 40c0-8 8-12 14-8 3-6 21-6 24 0 6-4 14 0 14 8z" fill="#FF8FB1"/>
    <path d="M24 40h52v12H24z" fill="#FF8FB1"/>
    <rect x="47" y="14" width="6" height="14" rx="3" fill="#7FC4FF"/>
    <circle cx="50" cy="10" r="5" fill="#FFC94A"/>`, 'bolo'),

  borboleta: svg(`
    <ellipse cx="30" cy="36" rx="20" ry="17" fill="#C6A0F5"/>
    <ellipse cx="70" cy="36" rx="20" ry="17" fill="#C6A0F5"/>
    <ellipse cx="33" cy="66" rx="16" ry="14" fill="#8A5BD1"/>
    <ellipse cx="67" cy="66" rx="16" ry="14" fill="#8A5BD1"/>
    <rect x="46" y="28" width="8" height="52" rx="4" fill="#3A2B55"/>
    <path d="M50 28 38 14M50 28l12-14" stroke="#3A2B55" stroke-width="4" stroke-linecap="round"/>
    <circle cx="30" cy="36" r="5" fill="#FFF3E2"/>
    <circle cx="70" cy="36" r="5" fill="#FFF3E2"/>`, 'borboleta'),

  flor: svg(`
    <g fill="#FF8FB1">
      <ellipse cx="50" cy="26" rx="13" ry="17"/>
      <ellipse cx="50" cy="62" rx="13" ry="17"/>
      <ellipse cx="32" cy="44" rx="17" ry="13"/>
      <ellipse cx="68" cy="44" rx="17" ry="13"/>
    </g>
    <circle cx="50" cy="44" r="12" fill="#FFC94A"/>
    <path d="M50 74v18" stroke="#2E9E6D" stroke-width="6" stroke-linecap="round"/>
    <path d="M50 84c8-2 12-8 12-8s-8-2-12 8z" fill="#2E9E6D"/>`, 'flor'),

  lua: svg(`
    <path d="M62 12a38 38 0 1 0 26 62A34 34 0 0 1 62 12z" fill="#FFE08A"/>
    <circle cx="34" cy="44" r="6" fill="#EFC95E"/>
    <circle cx="30" cy="66" r="4" fill="#EFC95E"/>`, 'lua'),

  peixe: svg(`
    <ellipse cx="46" cy="50" rx="32" ry="22" fill="#7FC4FF"/>
    <path d="M78 50 96 32v36z" fill="#2F72C9"/>
    <circle cx="30" cy="44" r="6" fill="#fff"/>
    <circle cx="29" cy="44" r="3" fill="#3A2B55"/>
    <path d="M52 34c6 6 6 26 0 32" stroke="#2F72C9" stroke-width="5" fill="none" stroke-linecap="round"/>`, 'peixe'),

  arvore: svg(`
    <rect x="44" y="60" width="12" height="30" rx="4" fill="#8A5A2B"/>
    <circle cx="50" cy="38" r="24" fill="#2E9E6D"/>
    <circle cx="32" cy="52" r="16" fill="#3FAE79"/>
    <circle cx="68" cy="52" r="16" fill="#3FAE79"/>`, 'árvore'),

  nuvem: svg(`
    <path d="M28 74a18 18 0 0 1 0-36 24 24 0 0 1 46-6 16 16 0 0 1-4 42z" fill="#EAF2FF"/>
    <path d="M28 74a18 18 0 0 1-6-34 18 18 0 0 0 10 34z" fill="#C8DCF7"/>`, 'nuvem'),

  cadeado: svg(`
    <rect x="24" y="46" width="52" height="40" rx="10" fill="#FFC94A"/>
    <path d="M36 46V34a14 14 0 0 1 28 0v12" stroke="#E09E12" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="62" r="6" fill="#E09E12"/>
    <rect x="47" y="64" width="6" height="12" rx="3" fill="#E09E12"/>`, 'cadeado'),

  som: svg(`
    <path d="M44 30 26 44H12v18h14l18 14z" fill="#FFF3E2"/>
    <path d="M60 36a22 22 0 0 1 0 32M70 26a34 34 0 0 1 0 52" stroke="#FFF3E2"
          stroke-width="7" fill="none" stroke-linecap="round"/>`, 'som'),

  seta: svg(`
    <path d="M60 22 32 50l28 28" stroke="#FFF3E2" stroke-width="11"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 'voltar'),

  tocar: svg(`
    <path d="M34 22 78 50 34 78z" fill="#FFF3E2"/>`, 'jogar')
};

/** As 8 figuras usadas nos pares da memória. */
export const FIGURAS_MEMORIA =
  ['coroa', 'estrela', 'coracao', 'arcoiris', 'castelo', 'bolo', 'borboleta', 'flor'];

export const icone = nome => ICONES[nome] || '';
