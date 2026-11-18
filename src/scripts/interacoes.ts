// Interações da página (docs/transicoes.md). Tudo aqui é melhoria: sem este arquivo,
// as âncoras continuam funcionando e os botões levam à seção "Sobre este estudo".

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

// Botões Estudar e Dar aulas: com JS abrem o Dialog; sem JS, o link leva à seção explicativa.
document.querySelectorAll<HTMLAnchorElement>('a[data-dialogo]').forEach((gatilho) => {
  const dialogo = document.getElementById(gatilho.dataset.dialogo ?? '');
  if (!(dialogo instanceof HTMLDialogElement)) return;
  gatilho.addEventListener('click', (e) => {
    e.preventDefault();
    dialogo.showModal();
  });
});

// Fechar: botões do próprio Dialog e clique no fundo (fora do conteúdo).
document.querySelectorAll<HTMLDialogElement>('dialog.aviso').forEach((dialogo) => {
  dialogo.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => dialogo.close()));
  // Só fecha se o clique começa e termina no fundo (arrastar uma seleção até lá não fecha).
  let comecouNoFundo = false;
  dialogo.addEventListener('pointerdown', (e) => (comecouNoFundo = e.target === dialogo));
  dialogo.addEventListener('click', (e) => {
    if (comecouNoFundo && e.target === dialogo) dialogo.close();
    comecouNoFundo = false;
  });
});

// Âncoras internas: rolagem suave com a curva do sistema, foco no destino e hash na URL.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
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

// Cabeçalho: fundo e borda aparecem quando a página sai do topo.
const cabecalho = document.querySelector<HTMLElement>('[data-cabecalho]');
if (cabecalho) {
  const marcar = () => (cabecalho.dataset.rolado = String(window.scrollY > 8));
  marcar();
  window.addEventListener('scroll', marcar, { passive: true });
}
