// Tudo que você vai querer ajustar depois de ver a criança jogando está aqui.

/** true = ampulheta tira coração e pode dar "fim de jogo".
 *  false = ampulheta só decide se a estrela é dourada ou prateada. (recomendado aos 4 anos) */
export const MODO_PERDER = false;

/** Corações disponíveis quando MODO_PERDER = true. */
export const VIDAS = 3;

export const CORES = [
  { nome: 'rosa',     pelo: '#FF8FB1', crina: '#E0457E' },
  { nome: 'azul',     pelo: '#7FC4FF', crina: '#2F72C9' },
  { nome: 'amarelo',  pelo: '#FFD766', crina: '#DE9A11' },
  { nome: 'verde',    pelo: '#8FE3B4', crina: '#2E9E6D' },
  { nome: 'roxo',     pelo: '#C6A0F5', crina: '#7B45C6' },
  { nome: 'laranja',  pelo: '#FFB27A', crina: '#E06A21' },
  { nome: 'vermelho', pelo: '#FF8A80', crina: '#C62828' },
  { nome: 'branco',   pelo: '#F4EEF9', crina: '#B0A2C4' }
];

/** Recompensa de cada fase: um unicórnio novo para o estábulo.
 *  A ordem importa — é a ordem em que ela vai colecionar.
 *  `acessorio` é o nome de um ícone de js/icones.js. */
export const UNICORNIOS = [
  { id: 'luna',     nome: 'Luna',     cor: 'rosa',     acessorio: 'lua' },
  { id: 'ceu',      nome: 'Céu',      cor: 'azul',     acessorio: 'nuvem' },
  { id: 'mel',      nome: 'Mel',      cor: 'amarelo',  acessorio: 'flor' },
  { id: 'trevo',    nome: 'Trevo',    cor: 'verde',    acessorio: 'arvore' },
  { id: 'amora',    nome: 'Amora',    cor: 'roxo',     acessorio: 'borboleta' },
  { id: 'pipoca',   nome: 'Pipoca',   cor: 'laranja',  acessorio: 'bolo' },
  { id: 'cereja',   nome: 'Cereja',   cor: 'vermelho', acessorio: 'coracao' },
  { id: 'neve',     nome: 'Neve',     cor: 'branco',   acessorio: 'estrela' },
  { id: 'bala',     nome: 'Bala',     cor: 'rosa',     acessorio: 'arcoiris' },
  { id: 'onda',     nome: 'Onda',     cor: 'azul',     acessorio: 'peixe' },
  { id: 'sol',      nome: 'Sol',      cor: 'amarelo',  acessorio: 'coroa' },
  { id: 'folha',    nome: 'Folha',    cor: 'verde',    acessorio: 'flor' },
  { id: 'estrela',  nome: 'Estrela',  cor: 'roxo',     acessorio: 'estrela' },
  { id: 'mexerica', nome: 'Mexerica', cor: 'laranja',  acessorio: 'flor' },
  { id: 'rubi',     nome: 'Rubi',     cor: 'vermelho', acessorio: 'coroa' }
];

/** 3 mundos x 5 fases. `nivel` é o que cada minijogo lê para se ajustar. */
export const MUNDOS = [
  {
    id: 1,
    nome: 'Castelo',
    icone: 'castelo',
    ceu: ['#5B3E8C', '#2E2350'],
    nivel: { opcoes: 3, maxNumero: 3, pares: 2, coresParecidas: false, segundos: 14 }
  },
  {
    id: 2,
    nome: 'Floresta',
    icone: 'arvore',
    ceu: ['#2F6B52', '#15342A'],
    nivel: { opcoes: 4, maxNumero: 5, pares: 3, coresParecidas: false, segundos: 12 }
  },
  {
    id: 3,
    nome: 'Nuvens',
    icone: 'nuvem',
    ceu: ['#3E63A8', '#1B2A52'],
    nivel: { opcoes: 5, maxNumero: 10, pares: 4, coresParecidas: true, segundos: 10 }
  }
];

/** Roteiro das 5 fases. Igual em todo mundo — a criança aprende a sequência.
 *  Cada string é uma rodada. Fase de memória tem menos rodadas porque cada
 *  tabuleiro já demora. */
export const FASES = [
  { nome: 'Cores',    rodadas: ['cores', 'cores', 'cores', 'cores', 'cores'] },
  { nome: 'Contar',   rodadas: ['contar', 'contar', 'contar', 'contar', 'contar'] },
  { nome: 'Mistura',  rodadas: ['cores', 'contar', 'cores', 'contar', 'cores'] },
  { nome: 'Memória',  rodadas: ['memoria', 'memoria', 'memoria'] },
  { nome: 'Desafio',  rodadas: ['cores', 'contar', 'memoria', 'cores', 'contar'] }
];

export const TOTAL_FASES = MUNDOS.length * FASES.length;

export const ELOGIOS = ['Isso!', 'Muito bem!', 'Boa!', 'Você conseguiu!', 'Perfeito!'];
