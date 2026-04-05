const fs = require('fs');

try {
  const oldStr = fs.readFileSync('index.html', 'utf8');
  
  const configStart = oldStr.indexOf('// ═══ CONFIG ═══');
  const cursorStart = oldStr.indexOf('// ═══ CURSOR ═══');
  if(configStart === -1 || cursorStart === -1) {
     throw new Error('Could not find config boundaries in old index.html');
  }
  
  const oldConfig = oldStr.substring(configStart, cursorStart);

  const b1 = fs.readFileSync('b1.js', 'utf8');
  const b2 = fs.readFileSync('b2.js', 'utf8');
  const b3 = fs.readFileSync('b3.js', 'utf8');
  const b4 = fs.readFileSync('b4.js', 'utf8');
  const b5 = fs.readFileSync('b5.js', 'utf8');

  // b1 + b2 + b3 is the HTML top + CSS
  // b4 is HTML body + script open
  // oldConfig is the array data
  // b5 is the JS logic + script close + body close
  
  const finalDest = b1 + b2 + b3 + b4 + '\n' + oldConfig + '\n' + b5;
  fs.writeFileSync('index.html', finalDest);
  console.log('Successfully compiled index.html with cinematic layers and custom logic.');
} catch(e) {
  console.error('Compiler error:', e);
}
