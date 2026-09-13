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
/** Importa de novo, ignorando o cache: simula abrir o app com o localStorage atual. */
let frescos = 0;
async function carregarFresco(caminho) {
  const src = fs.readFileSync(path.join(raiz, caminho), 'utf8');
  const dir = caminho.split('/').slice(0, -1).join('/');
  const codigo = await inline(src, dir) + `\n// fresco ${++frescos}`;
  return import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
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
const { ROUPAS } = await carregar('js/roupas.js');

const $ = s => window.document.querySelector(s);
const espera = ms => new Promise(r => setTimeout(r, ms));
const clique = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

let erros = 0;
const checar = (cond, msg) => { if (!cond) { console.log('  ✗ ' + msg); erros++; } };

console.log('1. Tela de mundos');
checar(!$('#tela-mundos').hidden, 'tela de mundos deveria estar visível');
checar($('#lista-mundos').children.length === 3, 'deveriam existir 3 mundos');
checar($('#lista-mundos').children[1].classList.contains('travado'), 'mundo 2 deveria começar travado');
checar($('#lista-ocasioes').hidden, 'nenhuma ocasião deveria aparecer antes de fechar um mundo');

console.log('2. Guarda-roupa abre desde o primeiro acesso');
clique($('#btn-vestir'));
checar(!$('#tela-guarda-roupa').hidden, 'guarda-roupa deveria abrir mesmo sem nenhuma peça');
checar($('#provador-princesa svg'), 'princesa deveria ser desenhada sem peça nenhuma');
checar(window.document.querySelectorAll('#pecas .peca').length === 15, 'guarda-roupa deveria listar 15 peças, veio: ' + window.document.querySelectorAll('#pecas .peca').length);
checar(window.document.querySelectorAll('#pecas .peca.travada').length === 15, 'sem jogar, as 15 peças deveriam estar travadas');
clique($('#voltar-guarda-roupa'));
checar(!$('#tela-mundos').hidden, 'voltar do guarda-roupa deveria levar ao menu');

console.log('3. Mundo travado não abre');
clique($('#lista-mundos').children[1]);
checar(!$('#tela-mundos').hidden, 'mundo travado não deveria navegar');

console.log('4. Entrar no mundo 1');
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
  const peca = ROUPAS[(mundo - 1) * 5 + (fase - 1)];
  checar($('#premio-desenho svg') && $('#premio-desenho svg').getAttribute('aria-label') === peca.nome,
    `fase ${mundo}-${fase} deveria entregar ${peca.nome}`);
  clique($('#premio-continuar'));
}

/** Depois da 5ª fase: a ocasião abre sozinha, com princesa e unicórnio no palco. */
function conferirOcasiao(mundo, nome) {
  checar(!$('#tela-ocasiao').hidden, `fechar o mundo ${mundo} deveria abrir a ocasião`);
  checar($('#nome-ocasiao').textContent === nome, `ocasião do mundo ${mundo} deveria ser ${nome}, veio: ${$('#nome-ocasiao').textContent}`);
  checar($('#ocasiao-cena svg svg[aria-label="princesa"]'), `princesa deveria estar no palco da ${nome}`);
  checar($('#ocasiao-cena svg svg[aria-label^="unicórnio"]'), `unicórnio deveria estar no palco da ${nome}`);
  clique($('#voltar-ocasiao'));
}

console.log('5. Jogando as 5 fases do mundo 1');
for (let f = 1; f <= 5; f++) await jogarFase(1, f);
conferirOcasiao(1, 'Praia');

console.log('6. Mundo 2 destrava e a Praia fica no menu');
checar(!$('#tela-mundos').hidden, 'voltar da ocasião deveria levar ao menu');
checar(!$('#lista-mundos').children[1].classList.contains('travado'), 'mundo 2 deveria ter destravado');
checar($('#contador-colecao').textContent.startsWith('5'), 'deveriam existir 5 peças, veio: ' + $('#contador-colecao').textContent);
checar(!$('#lista-ocasioes').hidden && $('#lista-ocasioes').children.length === 1, 'a Praia deveria estar revisitável no menu');

console.log('7. Mundos 2 e 3');
clique($('#lista-mundos').children[1]);
for (let f = 1; f <= 5; f++) await jogarFase(2, f);
conferirOcasiao(2, 'Vaquejada');
clique($('#lista-mundos').children[2]);
for (let f = 1; f <= 5; f++) await jogarFase(3, f);
conferirOcasiao(3, 'Baile');

console.log('8. Coleção completa: 15 fases, 15 peças');
checar($('#contador-colecao').textContent === '15 / 15', 'coleção deveria estar em 15/15, veio: ' + $('#contador-colecao').textContent);
const salvo = () => JSON.parse(ram['reino-encantado']);
checar(new Set(salvo().pecas).size === 15, 'deveriam existir 15 peças diferentes salvas');
checar(ROUPAS.every(p => salvo().pecas.includes(p.id)), 'cada peça do catálogo deveria ter sido entregue');
checar($('#lista-ocasioes').children.length === 3, 'as 3 ocasiões deveriam estar no menu');

console.log('9. Vestir, pintar e tirar');
clique($('#btn-vestir'));
checar(window.document.querySelectorAll('#pecas .peca.travada').length === 0, 'nenhuma peça deveria estar travada');
const peca = id => $(`#pecas .peca[data-peca="${id}"]`);
const cor = nome => $(`#paleta .cor[data-cor="${nome}"]`);
clique(peca('maio'));
checar($('#provador-princesa [data-peca="maio"]'), 'maiô deveria aparecer na princesa');
checar(salvo().look.corpo && salvo().look.corpo.id === 'maio' && salvo().look.corpo.cor === 'azul', 'maiô deveria ser salvo com a cor padrão');
clique(cor('rosa'));
checar(salvo().look.corpo.cor === 'rosa', 'paleta deveria pintar a peça vestida');
clique(peca('vestido-longo'));
checar(salvo().look.corpo.id === 'vestido-longo', 'peça do mesmo slot deveria substituir a anterior');
clique(peca('maio'));
clique(cor('rosa'));
clique(peca('chapeu-couro'));
clique(cor('verde'));
checar($('#provador-princesa [data-peca="maio"]') && $('#provador-princesa [data-peca="chapeu-couro"]'), 'peças de slots diferentes deveriam coexistir');
clique(peca('coroa'));
checar(salvo().look.cabeca.id === 'coroa', 'coroa deveria substituir o chapéu');
clique(peca('coroa'));
checar(!salvo().look.cabeca, 'tocar de novo deveria tirar a peça');
checar(!$('#provador-princesa [data-peca="coroa"]'), 'coroa tirada não deveria aparecer');
clique(peca('chapeu-couro'));
clique(cor('verde'));

console.log('10. Persistência do look');
const esperado = { corpo: { id: 'maio', cor: 'rosa' }, cabeca: { id: 'chapeu-couro', cor: 'verde' } };
const { estado: reaberto } = await carregarFresco('js/estado.js');
checar(JSON.stringify(reaberto.dados.look) === JSON.stringify(esperado),
  'look deveria sobreviver a reabrir o app, veio: ' + JSON.stringify(reaberto.dados.look));
checar(reaberto.dados.fasesConcluidas.length === 15, 'localStorage deveria ter 15 fases');
checar(reaberto.dados.versao === 2, 'estado salvo deveria estar na versão 2');
clique($('#voltar-guarda-roupa'));
clique($('#lista-ocasioes').children[2]);
checar($('#ocasiao-cena [data-peca="maio"]') && $('#ocasiao-cena [data-peca="chapeu-couro"]'), 'ocasião revisitada deveria mostrar o look escolhido');
clique($('#voltar-ocasiao'));

console.log('11. Zerar');
clique($('#btn-zerar'));
checar($('#contador-colecao').textContent === '0 / 15', 'depois de zerar deveria voltar a 0/15');
checar(Object.keys(salvo().look).length === 0 && salvo().pecas.length === 0, 'zerar deveria limpar peças e look');
checar($('#lista-ocasioes').hidden, 'zerar deveria esconder as ocasiões');

console.log('12. Migração de estado v1 para v2');
ram = { 'reino-encantado': JSON.stringify({
  versao: 1, fasesConcluidas: ['1-1', '1-2', '1-3'], unicornios: ['luna', 'ceu', 'mel'], douradas: 2, prateadas: 1
}) };
const { estado: migrado } = await carregarFresco('js/estado.js');
const d = migrado.dados;
checar(d.versao === 2, 'estado v1 deveria virar v2');
checar(JSON.stringify(d.unicornios) === '["luna","ceu","mel"]', 'unicórnios da v1 deveriam ser mantidos, veio: ' + JSON.stringify(d.unicornios));
checar(JSON.stringify(d.fasesConcluidas) === '["1-1","1-2","1-3"]', 'fases da v1 deveriam ser mantidas');
checar(d.douradas === 2 && d.prateadas === 1, 'estrelas da v1 deveriam ser mantidas');
checar(JSON.stringify(d.pecas) === '["maio","chapeu-palha","oculos"]', 'fases já feitas deveriam entregar suas peças, veio: ' + JSON.stringify(d.pecas));
checar(JSON.stringify(d.look) === '{}', 'look deveria começar vazio');
migrado.vestir('rosto', 'oculos', 'roxo');
checar(salvo().versao === 2 && salvo().unicornios.length === 3 && salvo().look.rosto.id === 'oculos',
  'primeira gravação depois da migração deveria salvar v2 sem perder os unicórnios');

console.log(erros === 0 ? '\n✅ TODOS OS TESTES PASSARAM' : `\n❌ ${erros} FALHA(S)`);
process.exit(erros ? 1 : 0);
