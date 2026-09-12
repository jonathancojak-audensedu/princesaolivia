// Sem dependência externa: WebAudio para efeitos, SpeechSynthesis para a voz.
// Navegador só libera áudio depois de um toque, por isso o `desbloquear()`.

let ctx = null;

export function desbloquear() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { console.warn('WebAudio indisponível:', e); }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function nota(freq, atraso, duracao, volume = 0.22, tipo = 'triangle') {
  const a = desbloquear();
  if (!a) return;
  const osc = a.createOscillator();
  const ganho = a.createGain();
  osc.type = tipo;
  osc.frequency.value = freq;
  const t = a.currentTime + atraso;
  ganho.gain.setValueAtTime(0, t);
  ganho.gain.linearRampToValueAtTime(volume, t + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  osc.connect(ganho);
  ganho.connect(a.destination);
  osc.start(t);
  osc.stop(t + duracao + 0.05);
}

export const som = {
  acerto:  () => [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.35)),
  erro:    () => { nota(300, 0, 0.16, 0.16); nota(240, 0.12, 0.22, 0.16); },
  festa:   () => [523, 659, 784, 1047, 1319, 1047, 1319].forEach((f, i) => nota(f, i * 0.11, 0.45, 0.2)),
  virar:   () => nota(880, 0, 0.12, 0.14),
  toque:   () => nota(660, 0, 0.09, 0.12),
  premio:  () => [392, 523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.13, 0.6, 0.22)),
  travado: () => nota(180, 0, 0.25, 0.14, 'sine')
};

/* ---------- voz ---------- */

let voz = null;
let ultima = '';

function escolherVoz() {
  if (!('speechSynthesis' in window)) return;
  const vozes = speechSynthesis.getVoices();
  voz = vozes.find(v => /pt[-_]BR/i.test(v.lang))
     || vozes.find(v => /^pt/i.test(v.lang))
     || null;
}

if ('speechSynthesis' in window) {
  escolherVoz();
  speechSynthesis.onvoiceschanged = escolherVoz;
}

export function falar(texto) {
  ultima = texto;
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.88;
  fala.pitch = 1.25;
  if (voz) fala.voice = voz;
  speechSynthesis.speak(fala);
}

export function repetirFala() { if (ultima) falar(ultima); }

export function calar() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
