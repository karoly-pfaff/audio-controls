import { bindSearch } from './searchDocumentation.ts';
import { bindCopyButtons } from './copyExamples.ts';
import { observeSections } from './observeSections.ts';

export function initializeDocumentation(): void {
  bindSearch();
  bindCopyButtons();
  observeSections();
  document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
  document.querySelector('#navigation-toggle')?.addEventListener('click', toggleNavigation);
  document.querySelectorAll('.sidebar a').forEach((anchor) => {
    anchor.addEventListener('click', closeNavigation);
  });
}

function toggleTheme(): void {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('#theme-toggle')?.setAttribute('aria-pressed', String(dark));
  document.querySelectorAll<HTMLElement>('.demo').forEach((preview) => {
    preview.setAttribute('data-acr-theme', dark ? 'dark' : 'light');
  });
}

function toggleNavigation(): void {
  const button = document.querySelector('#navigation-toggle');
  const expanded = button?.getAttribute('aria-expanded') !== 'true';
  button?.setAttribute('aria-expanded', String(expanded));
  document.body.classList.toggle('navigation-open', expanded);
}

function closeNavigation(): void {
  document.body.classList.remove('navigation-open');
  document.querySelector('#navigation-toggle')?.setAttribute('aria-expanded', 'false');
}
