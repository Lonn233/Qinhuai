const path = require('node:path');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
const importBundle = {
  absWorkingDir: root,
  entryPoints: ['qinhuai-modern-import.js'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
};
const result = esbuild.buildSync({ ...importBundle, outfile: 'qinhuai-modern-import.bundle.js', metafile: true });
// Keep both browser entrypoints synchronized for existing saved links.
esbuild.buildSync({ ...importBundle, outfile: 'qinhuai-modern-import.save-slots.bundle.js' });
console.log('Import viewer bundled:', Object.keys(result.metafile.inputs).length, 'source modules -> one browser request');

esbuild.buildSync({absWorkingDir:root,entryPoints:['story/navigation-worker.js'],outfile:'story/navigation-worker.bundle.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
