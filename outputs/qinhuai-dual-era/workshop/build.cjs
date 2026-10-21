const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
esbuild.buildSync({entryPoints:[path.join(__dirname,'main.js')],bundle:true,minify:true,format:'iife',outfile:path.join(__dirname,'workshop.bundle.js'),target:['chrome100','edge100','safari16'],legalComments:'eof'});
fs.copyFileSync(path.join(__dirname,'page.html'),path.join(__dirname,'..','lotus-workshop.html'));
console.log('Built lotus-workshop.html (independent entry; existing map unchanged)');
