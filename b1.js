const fs = require('fs');

const htmlTop = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AlertBridge — Mission Control</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Barlow:wght@300;400;500&display=swap');
:root {
  --storm:#060a10; --storm2:#0a1020; --storm3:#0f1a2e;
  --amber:#ff8c00; --amber-dim:rgba(255,140,0,0.15); --amber-glow:rgba(255,140,0,0.35);
  --danger:#e63946; --danger-dim:rgba(230,57,70,0.15);
  --safe:#06d6a0; --warn:#ffd166; --info:#4cc9f0;
  --text:#dde8f0; --muted:#4a6070;
  --glass:rgba(255,255,255,0.03); --glass2:rgba(255,255,255,0.07);
  --border:rgba(255,140,0,0.18); --border-faint:rgba(255,255,255,0.06);
}
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { background:var(--storm); color:var(--text); font-family:'Barlow',sans-serif; overflow-x:hidden; cursor:none; }
#cursor-dot{position:fixed;z-index:99999;width:6px;height:6px;background:var(--amber);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);transition:transform .05s}
#cursor-ring{position:fixed;z-index:99998;width:32px;height:32px;border:1.5px solid rgba(255,140,0,0.5);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);transition:transform .12s cubic-bezier(0.4,0,0.2,1),width .2s,height .2s,border-color .2s,background .2s}
body.hovering #cursor-ring{width:48px;height:48px;border-color:var(--amber);background:var(--amber-dim)}
body.clicking #cursor-dot{transform:translate(-50%,-50%) scale(2.5);background:var(--danger)}
body.clicking #cursor-ring{width:20px;height:20px;border-color:var(--danger)}
`;

fs.writeFileSync('b1.html', htmlTop);
