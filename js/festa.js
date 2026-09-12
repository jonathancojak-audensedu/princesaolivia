// Recompensa variável: a festa nunca é exatamente igual duas vezes.
// Feito em DOM puro de propósito — a PWA precisa funcionar offline sem CDN.

const TIPOS = [
  { itens: ['🦄', '✨', '💖'],       qtd: 26, tam: [24, 46] },
  { itens: ['🌈', '⭐', '🧁', '🎀'], qtd: 34, tam: [20, 38] },
  { itens: ['👑', '💎'],             qtd: 16, tam: [34, 64] },
  { itens: ['🌸', '🦋', '💜'],       qtd: 40, tam: [18, 34] }
];

let caixa = null;

export function festa(forca = 1) {
  if (!caixa) caixa = document.getElementById('festa');
  if (!caixa) return;

  const tipo = TIPOS[Math.floor(Math.random() * TIPOS.length)];
  const total = Math.round(tipo.qtd * forca);

  for (let i = 0; i < total; i++) {
    const p = document.createElement('div');
    p.className = 'confete';
    p.textContent = tipo.itens[Math.floor(Math.random() * tipo.itens.length)];
    const tam = tipo.tam[0] + Math.random() * (tipo.tam[1] - tipo.tam[0]);
    p.style.fontSize = tam + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (1.8 + Math.random() * 1.8) + 's';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    caixa.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
}

/** Brilho rápido em cima de um elemento que ela acabou de acertar. */
export function faisca(alvo) {
  if (!caixa) caixa = document.getElementById('festa');
  if (!caixa || !alvo) return;
  const r = alvo.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'faisca';
    s.textContent = '✨';
    s.style.left = (r.left + r.width / 2) + 'px';
    s.style.top = (r.top + r.height / 2) + 'px';
    s.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    s.style.setProperty('--dy', (Math.random() * -140 - 30) + 'px');
    caixa.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
