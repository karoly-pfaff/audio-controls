export function bindSearch(): void {
  const input = document.querySelector<HTMLInputElement>('#docs-search');
  input?.addEventListener('input', () => {
    filterLinks(input.value);
  });
  input?.addEventListener('keydown', (event) => {
    navigateSearch(event, input);
  });
}

function filterLinks(query: string): void {
  const normalized = query.trim().toLowerCase();
  const anchors = document.querySelectorAll<HTMLAnchorElement>('.sidebar a');
  let matches = 0;
  for (const anchor of anchors) {
    const visible = anchor.textContent.toLowerCase().includes(normalized);
    anchor.hidden = !visible;
    if (visible) matches++;
  }
  updateSearchStatus(matches, normalized.length > 0);
}

function updateSearchStatus(matches: number, hasQuery: boolean): void {
  const status = document.querySelector('#search-status');
  if (status) status.textContent = hasQuery ? String(matches) + ' matching topics' : '';
}

function navigateSearch(event: KeyboardEvent, input: HTMLInputElement): void {
  if (event.key === 'Escape') {
    input.setRangeText('', 0, input.value.length);
    filterLinks('');
  }
  if (event.key !== 'Enter') return;
  document.querySelector<HTMLAnchorElement>('.sidebar a:not([hidden])')?.click();
}
