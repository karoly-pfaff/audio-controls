export function observeSections(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    },
    { rootMargin: '-15% 0px -70% 0px' },
  );
  document.querySelectorAll('main section[id]').forEach((section) => {
    observer.observe(section);
  });
}

function setActiveSection(id: string): void {
  document.querySelectorAll('.sidebar a').forEach((anchor) => {
    if (anchor.getAttribute('href') === '#' + id) anchor.setAttribute('aria-current', 'location');
    else anchor.removeAttribute('aria-current');
  });
}
