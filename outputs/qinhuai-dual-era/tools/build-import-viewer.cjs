const path = require('node:path');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
const result = esbuild.buildSync({
  absWorkingDir: root, entryPoints: ['qinhuai-modern-import.js'],
  outfile: 'qinhuai-modern-import.bundle.js', bundle: true, format: 'esm',
  platform: 'browser', target: 'es2022', minify: true, metafile: true,
});
console.log('Import viewer bundled:', Object.keys(result.metafile.inputs).length, 'source modules -> one browser request');
