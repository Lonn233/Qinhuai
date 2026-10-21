const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const root = __dirname;
const source = path.join(root, 'main.js');
const threeRoot = path.join(root, 'node_modules', 'three');
(async () => {
  const result = await esbuild.build({
    entryPoints: [source], bundle: true, minify: false, format: 'iife', target: ['chrome100', 'edge100', 'safari15'], write: false,
    plugins: [{
      name: 'three-local',
      setup(build) {
        build.onResolve({ filter: /^three$/ }, () => ({ path: path.join(threeRoot, 'build/three.module.js'), namespace: 'three-local' }));
        build.onResolve({ filter: /^three\/addons\// }, args => ({ path: path.join(threeRoot, 'examples/jsm', args.path.slice('three/addons/'.length)), namespace: 'three-local' }));
        build.onLoad({ filter: /.*/, namespace: 'three-local' }, args => ({ contents: fs.readFileSync(args.path, 'utf8'), loader: 'js', resolveDir: path.dirname(args.path) }));
      }
    }]
  });
  const html = fs.readFileSync(path.join(root, 'template.html'), 'utf8').replace('__SCRIPT__', () => result.outputFiles[0].text.replaceAll('</script', '<\\/script'));
  fs.writeFileSync(path.join(root, 'index.html'), html);
  console.log(`Built ${html.length} bytes`);
})().catch(error => { console.error(error); process.exitCode = 1; });

