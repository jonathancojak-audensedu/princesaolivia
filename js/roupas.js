// Catálogo do guarda-roupa. Cada fase entrega uma peça, na ordem desta lista:
// índices 0 a 4 no mundo 1, 5 a 9 no mundo 2, 10 a 14 no mundo 3.
//
// `desenho(cor)` desenha em coordenadas LOCAIS: (0,0) é a âncora do slot,
// definida em princesa.js. Nenhuma peça conhece o corpo, só a própria âncora,
// e é isso que deixa qualquer peça encaixar em qualquer combinação.
// `cor` é um objeto de CORES: `pelo` é o tom principal, `crina` o detalhe.
// `vista` é o viewBox da miniatura, nas mesmas coordenadas locais.
// `semBase` tira o vestidinho creme de baixo (peças que já cobrem o tronco).

export const SLOTS = ['cabeca', 'rosto', 'corpo', 'pes', 'mao'];

export const ROUPAS = [
  /* ---------- mundo 1: Praia ---------- */
  {
    id: 'maio', nome: 'Maiô', artigo: 'um', slot: 'corpo', mundo: 1, cor: 'azul', semBase: true,
    vista: '-30 -2 60 122',
    desenho: c => `
      <path d="M-20 6Q0 16 20 6L21 104Q0 116 -21 104z" fill="${c.pelo}"/>
      <path d="M-21 56H21" stroke="${c.crina}" stroke-width="9"/>`
  },
  {
    id: 'chapeu-palha', nome: 'Chapéu de palha', artigo: 'um', slot: 'cabeca', mundo: 1, cor: 'amarelo',
    vista: '-66 -34 132 56',
    desenho: c => `
      <ellipse cx="0" cy="6" rx="62" ry="13" fill="${c.pelo}"/>
      <path d="M-32 6Q-32 -30 0 -30T32 6z" fill="${c.pelo}"/>
      <path d="M-31 -4H31" stroke="${c.crina}" stroke-width="8"/>`
  },
  {
    id: 'oculos', nome: 'Óculos', artigo: 'uns', slot: 'rosto', mundo: 1, cor: 'roxo',
    vista: '-44 -16 88 32',
    desenho: c => `
      <path d="M-40 -5L-25 0M40 -5L25 0" stroke="${c.crina}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="-14" cy="0" r="12" fill="${c.pelo}" fill-opacity=".75" stroke="${c.crina}" stroke-width="4"/>
      <circle cx="14" cy="0" r="12" fill="${c.pelo}" fill-opacity=".75" stroke="${c.crina}" stroke-width="4"/>`
  },
  {
    id: 'boia', nome: 'Boia', artigo: 'uma', slot: 'mao', mundo: 1, cor: 'laranja',
    vista: '-30 -10 68 66',
    desenho: c => `
      <circle cx="4" cy="22" r="24" fill="none" stroke="${c.pelo}" stroke-width="13"/>
      <circle cx="4" cy="22" r="24" fill="none" stroke="${c.crina}" stroke-width="13" stroke-dasharray="18.85 18.85"/>`
  },
  {
    id: 'sandalia', nome: 'Sandália', artigo: 'uma', slot: 'pes', mundo: 1, cor: 'rosa',
    vista: '-28 -10 56 22',
    desenho: c => `
      <ellipse cx="-11" cy="6" rx="13" ry="4.5" fill="${c.crina}"/>
      <ellipse cx="11" cy="6" rx="13" ry="4.5" fill="${c.crina}"/>
      <path d="M-19 3Q-11 -6 -3 3M3 3Q11 -6 19 3" stroke="${c.pelo}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
  },

  /* ---------- mundo 2: Vaquejada ---------- */
  {
    id: 'bota', nome: 'Bota', artigo: 'uma', slot: 'pes', mundo: 2, cor: 'laranja',
    vista: '-30 -46 60 56',
    desenho: c => `
      <path d="M-16 -40H-3V0H-16zM3 -40H16V0H3z" fill="${c.pelo}"/>
      <ellipse cx="-12" cy="2" rx="13" ry="7" fill="${c.pelo}"/>
      <ellipse cx="12" cy="2" rx="13" ry="7" fill="${c.pelo}"/>
      <path d="M-17 -37H-2M2 -37H17" stroke="${c.crina}" stroke-width="6"/>`
  },
  {
    id: 'chapeu-couro', nome: 'Chapéu de couro', artigo: 'um', slot: 'cabeca', mundo: 2, cor: 'amarelo',
    vista: '-70 -40 140 58',
    desenho: c => `
      <path d="M-26 4L-22 -30Q-11 -38 0 -30Q11 -38 22 -30L26 4z" fill="${c.pelo}"/>
      <path d="M-24 -6H24" stroke="${c.crina}" stroke-width="7"/>
      <path d="M-66 -6Q-58 14 0 12Q58 14 66 -6Q44 6 0 4Q-44 6 -66 -6z" fill="${c.crina}"/>`
  },
  {
    id: 'colete', nome: 'Colete', artigo: 'um', slot: 'corpo', mundo: 2, cor: 'verde',
    vista: '-36 2 72 78',
    desenho: c => `
      <path d="M-22 8L-5 12L-9 74L-31 72zM22 8L5 12L9 74L31 72z" fill="${c.pelo}"/>
      <path d="M-31 72L-9 74M9 74L31 72" stroke="${c.crina}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="-12" cy="34" r="3" fill="${c.crina}"/>
      <circle cx="-13" cy="52" r="3" fill="${c.crina}"/>`
  },
  {
    id: 'saia-rodada', nome: 'Saia rodada', artigo: 'uma', slot: 'corpo', mundo: 2, cor: 'vermelho',
    vista: '-62 56 124 104',
    desenho: c => `
      <path d="M-26 68H26L58 140Q0 158 -58 140z" fill="${c.pelo}"/>
      <path d="M-58 140Q0 158 58 140" stroke="${c.crina}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <rect x="-27" y="62" width="54" height="10" rx="4" fill="${c.crina}"/>`
  },
  {
    id: 'laco', nome: 'Laço', artigo: 'um', slot: 'cabeca', mundo: 2, cor: 'rosa',
    vista: '4 -16 52 40',
    desenho: c => `
      <path d="M30 4L8 -12V20zM30 4L52 -12V20z" fill="${c.pelo}"/>
      <circle cx="30" cy="4" r="7" fill="${c.crina}"/>`
  },

  /* ---------- mundo 3: Baile ---------- */
  {
    id: 'vestido-longo', nome: 'Vestido longo', artigo: 'um', slot: 'corpo', mundo: 3, cor: 'roxo', semBase: true,
    vista: '-66 -2 132 190',
    desenho: c => `
      <path d="M-20 4Q0 14 20 4L18 70H-18z" fill="${c.pelo}"/>
      <path d="M-18 70H18L62 170Q0 188 -62 170z" fill="${c.pelo}"/>
      <rect x="-20" y="64" width="40" height="9" rx="4" fill="${c.crina}"/>
      <path d="M-62 170Q0 188 62 170" stroke="${c.crina}" stroke-width="6" fill="none" stroke-linecap="round"/>`
  },
  {
    id: 'coroa', nome: 'Coroa', artigo: 'uma', slot: 'cabeca', mundo: 3, cor: 'amarelo',
    vista: '-36 -36 72 46',
    desenho: c => `
      <path d="M-28 4L-32 -26L-15 -12L0 -32L15 -12L32 -26L28 4z" fill="${c.pelo}"/>
      <rect x="-29" y="-2" width="58" height="8" rx="3" fill="${c.crina}"/>
      <circle cx="0" cy="-14" r="4" fill="#FFF3E2"/>`
  },
  {
    // Único desenho que alcança as duas mãos: a esquerda fica a -100 da âncora.
    id: 'luvas', nome: 'Luvas', artigo: 'umas', slot: 'mao', mundo: 3, cor: 'branco',
    vista: '-114 -30 128 44',
    desenho: c => `
      <path d="M0 0L-8 -20M-100 0L-92 -20" stroke="${c.pelo}" stroke-width="15" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="10" fill="${c.pelo}"/>
      <circle cx="-100" cy="0" r="10" fill="${c.pelo}"/>
      <path d="M-15 -17L-2 -23M-85 -17L-98 -23" stroke="${c.crina}" stroke-width="4" stroke-linecap="round"/>`
  },
  {
    id: 'sapatinho', nome: 'Sapatinho', artigo: 'um', slot: 'pes', mundo: 3, cor: 'rosa',
    vista: '-26 -8 52 20',
    desenho: c => `
      <ellipse cx="-11" cy="3" rx="12" ry="7" fill="${c.pelo}"/>
      <ellipse cx="11" cy="3" rx="12" ry="7" fill="${c.pelo}"/>
      <circle cx="-11" cy="-1" r="3.5" fill="${c.crina}"/>
      <circle cx="11" cy="-1" r="3.5" fill="${c.crina}"/>`
  },
  {
    id: 'leque', nome: 'Leque', artigo: 'um', slot: 'mao', mundo: 3, cor: 'azul',
    vista: '-30 -60 68 64',
    desenho: c => `
      <path d="M0 -4L-24 -44Q6 -62 34 -38z" fill="${c.pelo}"/>
      <path d="M0 -4L-8 -43M0 -4L5 -44M0 -4L17 -41" stroke="${c.crina}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="0" cy="-4" r="4" fill="${c.crina}"/>`
  }
];

export const pecaPorId = id => ROUPAS.find(p => p.id === id) || null;
