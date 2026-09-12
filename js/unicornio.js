import { CORES } from './config.js';

export const corPorNome = nome => CORES.find(c => c.nome === nome) || CORES[0];

/**
 * @param {object}  cor       objeto de CORES
 * @param {string}  acessorio emoji opcional ao lado da orelha
 * @param {boolean} silhueta  desenha só a sombra (unicórnio ainda não conquistado)
 */
export function unicornio(cor, acessorio = '', silhueta = false) {
  const pelo  = silhueta ? '#4A3F63' : cor.pelo;
  const crina = silhueta ? '#3B3252' : cor.crina;
  const olho  = silhueta ? '#3B3252' : '#3A2B55';
  const chifre = silhueta ? '#4A3F63' : '#FFC94A';
  const listra = silhueta ? '#3B3252' : '#E09E12';

  return `<svg viewBox="0 0 140 150" role="img" aria-label="unicórnio ${cor.nome}">
  <path d="M34 46c-12-6-20 4-16 14 3 8 12 10 12 10z" fill="${crina}"/>
  <path d="M106 46c12-6 20 4 16 14-3 8-12 10-12 10z" fill="${crina}"/>
  <path d="M70 12 84 46H56z" fill="${chifre}"/>
  <path d="M63 32h14M60 40h20" stroke="${listra}" stroke-width="4" stroke-linecap="round"/>
  <path d="M38 40c-6-12 2-20 12-16 6 3 9 10 9 10z" fill="${pelo}"/>
  <path d="M102 40c6-12-2-20-12-16-6 3-9 10-9 10z" fill="${pelo}"/>
  <ellipse cx="70" cy="80" rx="33" ry="40" fill="${pelo}"/>
  <path d="M46 48c10-8 24-10 34-6" stroke="${crina}" stroke-width="9" stroke-linecap="round" fill="none"/>
  <circle cx="57" cy="76" r="6.5" fill="${olho}"/>
  <circle cx="83" cy="76" r="6.5" fill="${olho}"/>
  ${silhueta ? '' : '<circle cx="59.2" cy="73.6" r="2.2" fill="#fff"/><circle cx="85.2" cy="73.6" r="2.2" fill="#fff"/>'}
  <path d="M60 99q10 11 20 0" stroke="${crina}" stroke-width="4" stroke-linecap="round" fill="none"/>
  ${silhueta ? '' : '<ellipse cx="45" cy="92" rx="7" ry="5" fill="#FF6F9C" opacity=".45"/><ellipse cx="95" cy="92" rx="7" ry="5" fill="#FF6F9C" opacity=".45"/>'}
  ${acessorio && !silhueta ? `<text x="108" y="36" font-size="30" text-anchor="middle">${acessorio}</text>` : ''}
</svg>`;
}
