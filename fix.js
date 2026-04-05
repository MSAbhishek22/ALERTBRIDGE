const fs = require('fs');

function extract(file) {
  let content = fs.readFileSync(file, 'utf8');
  let firstTick = content.indexOf('`');
  let lastTick = content.lastIndexOf('`');
  return content.substring(firstTick + 1, lastTick);
}

try {
  const htmlTop = extract('b1.js');
  const htmlCSS = extract('b2.js');
  const htmlPT3 = extract('b3.js');
  const htmlPT4 = extract('b4.js');
  const htmlPT5 = extract('b5.js');

  const oldIndex = fs.readFileSync('index.html', 'utf8');
  const configStart = oldIndex.indexOf('// ═══ CONFIG ═══');
  if (configStart === -1) throw new Error("lost config");
  const configEnd = oldIndex.indexOf('// ═══ CURSOR ═══');
  const configData = oldIndex.substring(configStart, configEnd);

  const finalHTML = htmlTop + htmlCSS + htmlPT3 + htmlPT4 + '\n' + configData + '\n' + htmlPT5;
  fs.writeFileSync('index_fixed.html', finalHTML);
  console.log('Fixed file generated at index_fixed.html');
} catch(e) {
  console.error(e);
}
