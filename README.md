# Reino Encantado

Jogo de cores, números e memória para criança de 3 a 5 anos. HTML, CSS e JS puro.
Sem framework, sem build, sem dependência em produção.

## Princípios

1. **A criança não lê.** Toda instrução é falada. Texto na tela é para o adulto.
2. **Não existe derrota.** Errar treme a peça e faz um som bobo. Só isso.
   A ampulheta decide se a estrela é dourada ou prateada — nunca tira a fase.
3. **A recompensa é colecionar.** Cada fase entrega um unicórnio novo para o estábulo.
   É isso que faz ela querer jogar de novo, não o placar.
4. **Offline sempre.** Nenhuma CDN no caminho crítico. O que carrega de fora
   (a fonte Fredoka) tem fallback local e não quebra nada se falhar.
5. **Zero dependência em produção.** `jsdom` existe só para rodar o teste.

## Estrutura

```
index.html              cinco telas: mundos, fases, jogo, prêmio, estábulo
css/estilo.css          todo o visual
js/config.js            👈 comece por aqui: mundos, fases, cores, balanceamento
js/estado.js            progresso e coleção em localStorage
js/main.js              telas, progressão, ampulheta, prêmios
js/audio.js             efeitos (WebAudio) e voz (SpeechSynthesis pt-BR)
js/festa.js             confete com recompensa variável
js/unicornio.js         o desenho SVG, parametrizado por cor e acessório
js/util.js              embaralhar, sortear, tremer
js/jogos/cores.js       minijogo: ache o unicórnio da cor X
js/jogos/contar.js      minijogo: quantas estrelas
js/jogos/memoria.js     minijogo: ache os pares
sw.js                   cache offline — SUBA A VERSION AO EDITAR
tests/smoke.mjs         joga as 15 fases sozinho em jsdom
```

## Progressão

3 mundos × 5 fases = 15 fases = 15 unicórnios.

| | Castelo | Floresta | Nuvens |
|---|---|---|---|
| Opções na tela | 3 | 4 | 5 |
| Contar até | 3 | 5 | 10 |
| Pares de memória | 2 | 3 | 4 |
| Cores parecidas | não | não | sim |
| Ampulheta | 14s | 12s | 10s |

Mundo só destrava quando o anterior fecha 5/5. Fase só destrava quando a anterior fecha.

## Ajustes rápidos

Tudo em `js/config.js`:

- `MODO_PERDER = true` liga corações e fim de jogo por tempo. Está `false` de propósito;
  ligue só se quiser testar com ela e comparar.
- `MUNDOS[n].nivel.segundos` afrouxa ou aperta a ampulheta.
- `FASES[n].rodadas` muda o roteiro da fase (quantas rodadas e de quais minijogos).
- `UNICORNIOS` muda nome, cor e acessório da coleção.

## Rodar local

Precisa de servidor HTTP — o projeto usa ES modules, que não funcionam via `file://`.

```bash
npm run dev      # abre em http://localhost:8080
npm test         # joga as 15 fases sozinho e valida progressão e persistência
```

## Deploy no Cloudflare Pages

1. Suba o repo no GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Configuração de build:
   - Framework preset: **None**
   - Build command: *(vazio)*
   - Build output directory: `/`
4. Deploy. No celular, abra a URL e use "Adicionar à tela de início".

O arquivo `_headers` já impede que `sw.js` e `index.html` fiquem presos no cache do CDN.

## Convenção ao editar

Toda vez que mexer em qualquer arquivo listado em `sw.js`, **suba a `VERSION`**.
Sem isso o celular continua abrindo a versão antiga do cache.

Depois de editar, rode `npm test` antes de commitar.

## Limitações conhecidas

- A voz depende de haver uma voz pt-BR instalada no sistema. Android e iOS têm.
  Sem ela, o texto continua aparecendo na tela.
- Áudio e voz só ligam depois do primeiro toque (regra dos navegadores).
- `localStorage` é bloqueado em aba privada; o jogo roda, mas não salva.
