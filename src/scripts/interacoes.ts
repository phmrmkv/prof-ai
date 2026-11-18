// Interações da página (docs/transicoes.md). Tudo aqui é melhoria: sem este arquivo
// o conteúdo continua inteiro e os botões de diálogo levam à seção de perguntas.

const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Curva do sistema, cubic-bezier(0.22, 1, 0.36, 1), por Newton-Raphson.
function curvaSuave(t: number): number {
  const x1 = 0.22, y1 = 1, x2 = 0.36, y2 = 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const dsx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const d = dsx(u);
    if (Math.abs(d) < 1e-6) break;
    u -= (sx(u) - t) / d;
  }
  u = Math.min(1, Math.max(0, u));
  return ((ay * u + by) * u + cy) * u;
}

let rolagemAtual = 0;
function rolarAte(y: number, aoTerminar?: () => void) {
  cancelAnimationFrame(rolagemAtual);
  const inicio = window.scrollY;
  const distancia = y - inicio;
  if (Math.abs(distancia) < 2) {
    window.scrollTo(0, y);
    aoTerminar?.();
    return;
  }
  const duracao = reduzido() ? 300 : Math.min(900, Math.max(450, Math.abs(distancia) * 0.25));
  const t0 = performance.now();
  const passo = (agora: number) => {
    const p = Math.min(1, (agora - t0) / duracao);
    window.scrollTo(0, inicio + distancia * curvaSuave(p));
    if (p < 1) rolagemAtual = requestAnimationFrame(passo);
    else aoTerminar?.();
  };
  rolagemAtual = requestAnimationFrame(passo);
}

for (const ev of ['wheel', 'touchstart', 'keydown'] as const) {
  window.addEventListener(ev, () => cancelAnimationFrame(rolagemAtual), { passive: true });
}

// ---------- Diálogos nativos ----------
const origem = new WeakMap<HTMLDialogElement, HTMLElement>();

function fecharComAnimacao(dialogo: HTMLDialogElement) {
  if (!dialogo.open || dialogo.classList.contains('fechando')) return;
  const terminar = () => {
    dialogo.classList.remove('fechando');
    dialogo.close();
  };
  const duracao = 150;
  dialogo.classList.add('fechando');
  window.setTimeout(terminar, duracao);
}

document.querySelectorAll<HTMLAnchorElement>('a[data-dialogo]').forEach((gatilho) => {
  const dialogo = document.getElementById(gatilho.dataset.dialogo ?? '');
  if (!(dialogo instanceof HTMLDialogElement)) return;
  gatilho.setAttribute('role', 'button');
  gatilho.setAttribute('aria-haspopup', 'dialog');
  const abrir = (e: Event) => {
    e.preventDefault();
    origem.set(dialogo, gatilho);
    dialogo.showModal();
  };
  gatilho.addEventListener('click', abrir);
  gatilho.addEventListener('keydown', (e) => {
    if (e.key === ' ') abrir(e);
  });
});

document.querySelectorAll<HTMLDialogElement>('dialog.aviso').forEach((dialogo) => {
  dialogo.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => fecharComAnimacao(dialogo)));
  // Esc: fecha com a animação de saída.
  dialogo.addEventListener('cancel', (e) => {
    e.preventDefault();
    fecharComAnimacao(dialogo);
  });
  // Só fecha se o clique começa e termina no fundo (o preenchimento fica num div interno).
  let comecouNoFundo = false;
  dialogo.addEventListener('pointerdown', (e) => (comecouNoFundo = e.target === dialogo));
  dialogo.addEventListener('click', (e) => {
    if (comecouNoFundo && e.target === dialogo) fecharComAnimacao(dialogo);
    comecouNoFundo = false;
  });
  // Foco de volta a quem abriu.
  dialogo.addEventListener('close', () => {
    origem.get(dialogo)?.focus({ preventScroll: true });
    const status = dialogo.querySelector<HTMLElement>('[data-status]');
    if (status) status.textContent = '';
  });
});

// Lista de espera: amostra, nada é enviado.
document.querySelectorAll<HTMLFormElement>('form[data-lista]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector<HTMLElement>('[data-status]');
    if (status) status.textContent = 'Nada foi enviado: é uma demonstração, e o Prof.ai ainda não abre para uso.';
    form.reset();
  });
});

// ---------- Demonstração: troca de exemplo ----------
document.querySelectorAll<HTMLElement>('[data-demo]').forEach((demo) => {
  const botoes = demo.querySelectorAll<HTMLButtonElement>('[data-opcao]');
  const paineis = demo.querySelectorAll<HTMLElement>('[data-painel]');
  botoes.forEach((b) =>
    b.addEventListener('click', () => {
      botoes.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      paineis.forEach((p) => (p.hidden = p.dataset.painel !== b.dataset.opcao));
    }),
  );
});

// A orquestração da demonstração só começa quando ela aparece na tela.
const demos = document.querySelectorAll<HTMLElement>('[data-demo]');
if ('IntersectionObserver' in window) {
  const vista = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('vista');
          vista.unobserve(en.target);
        }
      }),
    { threshold: 0.15 },
  );
  demos.forEach((d) => vista.observe(d));
} else {
  demos.forEach((d) => d.classList.add('vista'));
}

// ---------- Menu do celular ----------
const menu = document.querySelector<HTMLButtonElement>('[data-menu]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (menu && nav) {
  const definir = (aberto: boolean) => {
    menu.setAttribute('aria-expanded', String(aberto));
    nav.dataset.aberto = String(aberto);
  };
  menu.addEventListener('click', () => definir(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) definir(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      definir(false);
      menu.focus();
    }
  });
}

// ---------- Âncoras: rolagem suave com a curva do sistema ----------
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link || link.pathname !== location.pathname) return;
  const id = decodeURIComponent(link.hash.slice(1));
  const alvo = id ? document.getElementById(id) : null;
  if (!alvo) return;
  e.preventDefault();
  history.pushState(null, '', `#${id}`);
  const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
  const y = id === 'inicio' ? 0 : alvo.getBoundingClientRect().top + window.scrollY - margem;
  rolarAte(Math.max(0, y), () => {
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });
});

// ---------- Cabeçalho: borda ao rolar ----------
const cabecalho = document.querySelector<HTMLElement>('[data-cabecalho]');
if (cabecalho) {
  const marcar = () => (cabecalho.dataset.rolado = String(window.scrollY > 8));
  marcar();
  window.addEventListener('scroll', marcar, { passive: true });
}

// ---------- Reveal ao rolar (uma vez, só com JS) ----------
const itens = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-shown');
          obs.unobserve(en.target);
        }
      }),
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  itens.forEach((i) => obs.observe(i));
} else {
  itens.forEach((i) => i.classList.add('is-shown'));
}
