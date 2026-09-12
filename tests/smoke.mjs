import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');

const dom = new JSDOM(html, {
  url: 'https://exemplo.test/',
  runScripts: 'dangerously',
  resources: undefined,
  pretendToBeVisual: true
});
const { window } = dom;

// Stubs do que o jsdom não tem
window.AudioContext = class {
  constructor(){ this.state='running'; this.currentTime=0; this.destination={}; }
  createOscillator(){ return { type:'', frequency:{value:0}, connect(){}, start(){}, stop(){} }; }
  createGain(){ return { gain:{ setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){} }, connect(){} }; }
  resume(){}
};
window.speechSynthesis = { getVoices:()=>[], cancel(){}, speak(){}, onvoiceschanged:null };
window.SpeechSynthesisUtterance = class { constructor(t){ this.text=t; } };
window.confirm = () => true;
let ram = {};
Object.defineProperty(window, 'localStorage', { value: {
  getItem:k=>ram[k]??null, setItem:(k,v)=>{ram[k]=String(v)}, removeItem:k=>{delete ram[k]}
}});

// Carrega os módulos ES manualmente (jsdom não resolve type=module com file paths locais)
const mods = new Map();
async function carregar(caminho) {
  if (mods.has(caminho)) return mods.get(caminho);
  let src = fs.readFileSync(path.join(raiz, caminho), 'utf8');
  const dir = caminho.split('/').slice(0, -1).join('/');
  const b64 = Buffer.from(await inline(src, dir)).toString('base64');
  const m = await import('data:text/javascript;base64,' + b64);
  mods.set(caminho, m);
  return m;
}
async function inline(src, dir) {
  const re = /from\s+'(\.[^']+)'/g;
  let out = src, m;
  while ((m = re.exec(src))) {
    const rel = m[1].replace(/^\.\//, '');
    const alvo = normalizar(dir ? dir + '/' + rel : rel);
    const dep = fs.readFileSync(path.join(raiz, alvo), 'utf8');
    const depDir = alvo.split('/').slice(0, -1).join('/');
    const b64 = Buffer.from(await inline(dep, depDir)).toString('base64');
    out = out.replace(`'${m[1]}'`, `'data:text/javascript;base64,${b64}'`);
  }
  return out;
}
const normalizar = p => {
  const pilha = [];
  for (const parte of p.split('/')) {
    if (parte === '..') pilha.pop();
    else if (parte !== '.' && parte !== '') pilha.push(parte);
  }
  return pilha.join('/');
};

// Injeta globais que os módulos esperam
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 16);
global.cancelAnimationFrame = id => clearTimeout(id);
global.confirm = window.confirm;
global.speechSynthesis = window.speechSynthesis;
global.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
global.AudioContext = window.AudioContext;
Object.defineProperty(global,'navigator',{value:window.navigator,configurable:true});
global.location = window.location;

await carregar('js/main.js');

const $ = s => window.document.querySelector(s);
const espera = ms => new Promise(r => setTimeout(r, ms));
const clique = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

let erros = 0;
const checar = (cond, msg) => { if (!cond) { console.log('  ✗ ' + msg); erros++; } };

console.log('1. Tela de mundos');
checar(!$('#tela-mundos').hidden, 'tela de mundos deveria estar visível');
checar($('#lista-mundos').children.length === 3, 'deveriam existir 3 mundos');
checar($('#lista-mundos').children[1].classList.contains('travado'), 'mundo 2 deveria começar travado');

console.log('2. Mundo travado não abre');
clique($('#lista-mundos').children[1]);
checar(!$('#tela-mundos').hidden, 'mundo travado não deveria navegar');

console.log('3. Entrar no mundo 1');
clique($('#lista-mundos').children[0]);
checar(!$('#tela-fases').hidden, 'deveria abrir a tela de fases');
checar($('#lista-fases').children.length === 5, 'deveriam existir 5 fases');
checar($('#lista-fases').children[1].classList.contains('travado'), 'fase 2 deveria começar travada');

/** Joga uma fase inteira acertando tudo. */
async function jogarFase(mundo, fase) {
  clique($('#lista-fases').children[fase - 1]);
  if ($('#tela-jogo').hidden) return console.log(`  ✗ fase ${mundo}-${fase} não abriu`) || erros++;

  let voltas = 0;
  while (!$('#tela-jogo').hidden && voltas < 120) {
    voltas++;
    const palco = $('#palco');
    const pergunta = $('#pergunta-texto').textContent;

    if (palco.querySelector('.alvo')) {
      const cor = pergunta.split(' ').pop();
      const alvo = palco.querySelector(`.alvo[data-cor="${cor}"]`);
      checar(alvo, `alvo da cor ${cor} não encontrado`);
      if (!alvo) break;
      clique(alvo);
    } else if (palco.querySelector('.num')) {
      const n = palco.querySelectorAll('#contagem i').length;
      const botao = palco.querySelector(`.num[data-n="${n}"]`);
      checar(botao, `opção ${n} não estava entre as respostas`);
      if (!botao) break;
      clique(botao);
    } else if (palco.querySelector('.carta')) {
      const cartas = [...palco.querySelectorAll('.carta:not(.feita)')];
      const alvo = cartas[0];
      const par = cartas.find(c => c !== alvo && c.dataset.f === alvo.dataset.f);
      clique(alvo); clique(par);
      await espera(500);
    }
    await espera(1500);
  }
  checar(!$('#tela-premio').hidden, `fase ${mundo}-${fase} deveria terminar na tela de prêmio`);
  clique($('#premio-continuar'));
}

console.log('4. Jogando as 5 fases do mundo 1');
for (let f = 1; f <= 5; f++) await jogarFase(1, f);

console.log('5. Mundo 2 deve destravar');
clique($('#voltar-fases'));
checar(!$('#lista-mundos').children[1].classList.contains('travado'), 'mundo 2 deveria ter destravado');
checar($('#contador-colecao').textContent.startsWith('5'), 'deveriam existir 5 unicórnios, veio: ' + $('#contador-colecao').textContent);

console.log('6. Mundos 2 e 3');
clique($('#lista-mundos').children[1]);
for (let f = 1; f <= 5; f++) await jogarFase(2, f);
clique($('#voltar-fases'));
clique($('#lista-mundos').children[2]);
for (let f = 1; f <= 5; f++) await jogarFase(3, f);
clique($('#voltar-fases'));

console.log('7. Coleção completa');
checar($('#contador-colecao').textContent === '15 / 15', 'coleção deveria estar em 15/15, veio: ' + $('#contador-colecao').textContent);

console.log('8. Estábulo');
clique($('#btn-estabulo'));
checar(!$('#tela-estabulo').hidden, 'estábulo deveria abrir');
checar($('#grade-estabulo').querySelectorAll('.vaga').length === 15, 'estábulo deveria ter 15 vagas');
checar($('#grade-estabulo').querySelectorAll('.vaga.vazia').length === 0, 'nenhuma vaga deveria estar vazia');

console.log('9. Persistência');
checar(JSON.parse(ram['reino-encantado']).fasesConcluidas.length === 15, 'localStorage deveria ter 15 fases');

console.log('10. Zerar');
clique($('#btn-zerar'));
checar($('#contador-colecao').textContent === '0 / 15', 'depois de zerar deveria voltar a 0/15');

console.log(erros === 0 ? '\n✅ TODOS OS TESTES PASSARAM' : `\n❌ ${erros} FALHA(S)`);
process.exit(erros ? 1 : 0);
