const fs = require('fs');
const htmlCSS = `
/* Keyframes */
@keyframes lightningFlash { 0%,89%,91%,93%,100% { opacity:0; } 90% { opacity:0.05; } 92% { opacity:0.02; } }
@keyframes noiseShift { 0% { background-position: 0 0; } 25% { background-position: 10px 10px; } 50% { background-position: -10px 5px; } 75% { background-position: 5px -10px; } 100% { background-position: 0 0; } }
@keyframes scan { from { transform:translateX(-100%); } to { transform:translateX(200%); } }
@keyframes orbPulse { 0%,100% { box-shadow: 0 0 20px rgba(255,140,0,0.5), 0 0 50px rgba(255,140,0,0.2), inset 0 1px 3px rgba(255,255,255,0.2); } 50% { box-shadow: 0 0 10px rgba(255,140,0,0.3), 0 0 20px rgba(255,140,0,0.1), inset 0 1px 3px rgba(255,255,255,0.1); } }
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
@keyframes pillGlow { 0%,100%{box-shadow:none} 50%{box-shadow: 0 0 14px rgba(230,57,70,0.4)} }
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes ringExpand { 0% { opacity:0.9; transform:translate(-50%,-50%) scale(0.7); } 100% { opacity:0; transform:translate(-50%,-50%) scale(1.5); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes topGlow { 0%,100%{opacity:0.3} 50%{opacity:1} }
@keyframes ctaGlow { 0%,100%{box-shadow:0 4px 22px rgba(255,140,0,0.3)} 50%{box-shadow:0 4px 32px rgba(255,140,0,0.65),0 0 50px rgba(255,140,0,0.2)} }
@keyframes shimmer { to { left:150%; } }
@keyframes rotate { to { transform:rotate(360deg); } }
@keyframes soundWave { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
@keyframes ringOut { 0%{opacity:0.8;transform:scale(0.75)} 100%{opacity:0;transform:scale(1.45)} }

/* Header & Ticker */
.header { position:sticky; top:0; z-index:500; height:56px; background:rgba(6,10,16,0.94); backdrop-filter:blur(24px); border-bottom:1px solid rgba(255,140,0,0.2); display:flex; justify-content:space-between; align-items:center; padding:0 20px; }
.logo-orb { width:38px; height:38px; background:conic-gradient(from 0deg, #ff8c00, #e63946, #ffb347, #ff8c00); border-radius:50%; box-shadow:0 0 20px rgba(255,140,0,0.5), 0 0 50px rgba(255,140,0,0.2), inset 0 1px 3px rgba(255,255,255,0.2); animation:orbPulse 2.5s ease-in-out infinite; display:flex; align-items:center; justify-content:center; font-size:18px; }
.live-pill { border-radius:99px; background:rgba(230,57,70,0.1); border:1px solid rgba(230,57,70,0.4); padding:5px 14px; display:flex; align-items:center; gap:6px; font-family:'Barlow Condensed'; font-size:11px; letter-spacing:2px; color:var(--danger); animation:pillGlow 2s infinite; }
.live-dot { width:6px; height:6px; border-radius:50%; background:var(--danger); animation:blink 1s infinite; }
.ticker { height:36px; background:linear-gradient(90deg, rgba(180,0,20,0.9), rgba(230,57,70,0.85)); border-bottom:1px solid rgba(230,57,70,0.5); display:flex; align-items:center; overflow:hidden; }
.ticker-live { background:var(--danger); font-family:'Bebas Neue'; font-size:16px; letter-spacing:3px; color:#fff; padding:0 16px; height:100%; display:flex; align-items:center; flex-shrink:0; position:relative; z-index:2; }
.ticker-mq { flex:1; display:flex; font-family:'Barlow Condensed'; font-size:12px; letter-spacing:1px; white-space:nowrap; animation:ticker 30s linear infinite; }
.tk-item { margin-right:40px; color:#fff; position:relative; }
.tk-item::after { content:'·'; position:absolute; right:-24px; color:rgba(255,255,255,0.3); }

/* Hero */
.hero { padding:44px 20px 32px; text-align:center; position:relative; overflow:hidden; min-height:400px; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:10; }
.pulse-rings { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:0; pointer-events:none; }
.pr { position:absolute; border:1px solid rgba(255,140,0,0.18); border-radius:50%; animation:ringExpand 4s ease-out infinite; }
.pr:nth-child(1) { width:220px; height:220px; }
.pr:nth-child(2) { width:400px; height:400px; border-color:rgba(255,140,0,0.08); animation-delay:1.3s; }
.pr:nth-child(3) { width:600px; height:600px; border-color:rgba(255,140,0,0.04); animation-delay:2.6s; }
.eyebrow { font-family:'Barlow Condensed'; font-size:10px; letter-spacing:5px; color:var(--amber); text-transform:uppercase; z-index:1; display:flex; align-items:center; gap:12px; animation:fadeUp 0.5s ease both; margin-bottom:20px; }
.eb-line { width:35px; height:1px; background:var(--amber); opacity:0.4; }
.hero h1 { z-index:1; font-family:'Bebas Neue'; font-size:clamp(60px, 11vw, 88px); letter-spacing:6px; line-height:0.88; animation:fadeUp 0.5s 0.1s ease both; }
.h-w { color:var(--text); } .h-a { color:var(--amber); text-shadow:0 0 40px rgba(255,140,0,0.7), 0 0 80px rgba(255,140,0,0.3); } .h-d { color:var(--danger); text-shadow:0 0 40px rgba(230,57,70,0.7); }
.hero-sub { z-index:1; font-family:'Barlow Condensed'; font-size:14px; letter-spacing:1px; color:var(--muted); max-width:360px; margin:20px auto 0; animation:fadeUp 0.5s 0.2s ease both; }

/* Threat Meter */
.threat { margin:0 16px 20px; background:var(--glass); border:1px solid var(--border); border-radius:10px; padding:16px 20px; position:relative; overflow:hidden; z-index:10; }
.threat::after { content:''; position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg,transparent,var(--amber),transparent); animation:topGlow 2s ease-in-out infinite; }
.threat::before { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(90deg, transparent, rgba(255,140,0,0.04), transparent); animation:scan 3.5s linear infinite; pointer-events:none; }
.th-lbl { font-family:'Barlow Condensed'; font-size:9px; letter-spacing:4px; color:var(--muted); text-align:center; margin-bottom:10px; }
.tr-bar { height:6px; border-radius:99px; background:linear-gradient(90deg, #06d6a0 0%, #ffd166 33%, #ff8c00 66%, #e63946 100%); box-shadow:0 0 10px rgba(255,140,0,0.2); position:relative; margin-bottom:6px; }
.tr-nd { position:absolute; top:-6px; width:3px; height:18px; background:#fff; box-shadow:0 0 10px #fff, 0 0 22px rgba(255,255,255,0.5); transition:left 1.2s cubic-bezier(0.34,1.56,0.64,1); left:72%; }
.tr-lb { display:flex; justify-content:space-between; font-family:'Barlow Condensed'; font-size:9px; letter-spacing:2px; color:var(--muted); text-transform:uppercase; }
`;
fs.writeFileSync('b2.js', htmlCSS);
