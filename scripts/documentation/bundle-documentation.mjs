import { build } from 'vite';

export async function bundleDocumentation(entry) {
  const result = await build({
    configFile: false,
    define: { 'process.env.NODE_ENV': '"production"' },
    build: {
      lib: { entry, name: 'AudioControlsDocumentation', formats: ['iife'] },
      write: false,
      cssCodeSplit: false,
      minify: true,
      sourcemap: false,
    },
  });
  const outputs = Array.isArray(result) ? result.flatMap((output) => output.output) : result.output;
  const scripts = outputs.filter((output) => output.type === 'chunk');
  if (scripts.length !== 1)
    throw new Error('Offline documentation requires one JavaScript bundle.');
  return {
    script: scripts[0].code,
    style: outputs
      .filter((output) => output.type === 'asset')
      .map(assetText)
      .join('\n'),
  };
}

function assetText(asset) {
  if (!asset.fileName.endsWith('.css')) throw new Error('Unexpected external documentation asset.');
  return typeof asset.source === 'string' ? asset.source : new TextDecoder().decode(asset.source);
}
