export function bindCopyButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => {
      void copyExample(button);
    });
  });
}

async function copyExample(button: HTMLButtonElement): Promise<void> {
  const code = document.getElementById(button.dataset.copy ?? '');
  if (!code) throw new Error('Missing code example.');
  try {
    await navigator.clipboard.writeText(code.textContent);
    button.replaceChildren('Copied');
  } catch {
    selectCode(code);
    button.replaceChildren('Selected · press Ctrl/Cmd+C');
  }
}

function selectCode(code: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(code);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
