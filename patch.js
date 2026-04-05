const fs = require('fs');
let txt = fs.readFileSync('frontend/index.html', 'utf8');

// The original line:
// const ext=JSON.parse((await groq('Extract info: {"hazard_type":"","severity":"low|medium|high|critical","alert_level":"","affected_areas":[],"evacuate_immediately":false}',txt,.1)).replace(/\\`\\`\\`json|\\`\\`\\`/g,'').trim());

// We will replace it with a more robust substring matching
let patched = txt.replace(/const ext=JSON\.parse\(\(await groq\([^)]+\)\)\.replace[^;]+;/g, 
  "let _raw = await groq('Extract info: {\"hazard_type\":\"\",\"severity\":\"low|medium|high|critical\",\"alert_level\":\"\",\"affected_areas\":[],\"evacuate_immediately\":false}',txt,.1); let ext=JSON.parse(_raw.substring(_raw.indexOf('{'), _raw.lastIndexOf('}')+1));");

// Same for the array survival guide logic:
// const tr=JSON.parse(res.replace(/\\`\\`\\`json|\\`\\`\\`/g,'').trim());
patched = patched.replace(/const tr=JSON\.parse\(res\.replace[^;]+;/g,
  "const tr=JSON.parse(res.substring(res.indexOf('['), res.lastIndexOf(']')+1));");

fs.writeFileSync('frontend/index.html', patched);
fs.writeFileSync('index.html', patched);
fs.writeFileSync('frontend/index_single.html', patched);
console.log('JSON parsers patched for stability.');
