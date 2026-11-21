import { copyFile, cp } from 'node:fs/promises';

await copyFile(
  new URL('../sources/styles.css', import.meta.url),
  new URL('../build/styles.css', import.meta.url),
);

await cp(
  new URL('../sources/themes/', import.meta.url),
  new URL('../build/themes/', import.meta.url),
  {
    recursive: true,
  },
);
