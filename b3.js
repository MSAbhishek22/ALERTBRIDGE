const fs = require('fs');
const pt3 = `
/* Input & Translator */
.gl-in { background:var(--glass); border:1px solid var(--border-faint); border-radius:10px; padding:16px; position:relative; overflow:hidden; transition:border-color 0.3s; margin-bottom:16px; width:100%; z-index:10; }
.gl-in:hover { border-color:rgba(255,140,0,0.28); }
.gl-in::before { content:''; position:absolute; top:0; left:0; width:100%; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); }
.gl-lbl { font-family:'Barlow Condensed'; font-size:9px; letter-spacing:4px; color:var(--amber); text-transform:uppercase; margin-bottom:8px; display:block; }
.ta { width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,140,0,0.12); border-radius:6px; padding:12px; color:var(--text); font-family:'Barlow'; font-size:11px; line-height:1.7; outline:none; transition:all 0.3s; min-height:120px; resize:vertical; }
.ta:focus { border-color:rgba(255,140,0,0.4); box-shadow:0 0 0 3px rgba(255,140,0,0.06); }
.t-pills { display:flex; gap:8px; margin-bottom:12px; }
.t-pill { font-family:'Barlow Condensed'; font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:6px 13px; border-radius:4px; border:1px solid rgba(255,140,0,0.22); background:transparent; color:rgba(255,140,0,0.7); transition:all 0.2s; cursor:pointer; }
.t-pill:hover,.t-pill.act { background:rgba(255,140,0,0.12); border-color:var(--amber); color:var(--amber); }

/* Community Selectors */
.c-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:20px; z-index:10; position:relative; }
.c-crd { background:var(--glass); border:1px solid var(--border-faint); border-radius:8px; padding:11px 13px; cursor:pointer; transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1); display:flex; align-items:center; gap:12px; }
.c-crd:hover { transform:translateY(-2px) scale(1.02); border-color:rgba(255,140,0,0.32); background:rgba(255,140,0,0.05); }
.c-crd.sel { border-color:var(--amber); background:rgba(255,140,0,0.09); box-shadow:0 0 16px rgba(255,140,0,0.12); transform:translateY(-2px) scale(1.02); }
.c-ico { font-size:22px; transition:transform 0.3s; line-height:1; }
.c-crd:hover .c-ico,.c-crd.sel .c-ico { transform:scale(1.22) rotate(-4deg); }
.c-nm { font-family:'Barlow Condensed'; font-size:12px; font-weight:600; color:var(--text); line-height:1; margin-bottom:4px; }
.c-ln { font-family:'Barlow Condensed'; font-size:10px; letter-spacing:1px; color:var(--muted); line-height:1; }

/* Translate CTA */
.t-cta { width:100%; padding:18px; background:var(--amber); color:#000; border:none; border-radius:8px; font-family:'Bebas Neue'; font-size:26px; letter-spacing:5px; text-transform:uppercase; cursor:pointer; position:relative; overflow:hidden; animation:ctaGlow 3s ease-in-out infinite; z-index:10; }
.t-cta::before { content:''; position:absolute; top:0; left:-100%; width:55%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent); animation:shimmer 2.2s infinite; }
.t-cta:hover { transform:translateY(-3px) scale(1.01); box-shadow:0 8px 32px rgba(255,140,0,0.55); transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.t-cta:active { transform:translateY(1px) scale(0.99); }
.t-cta:disabled { background:#1a1a1a; color:#333; animation:none; cursor:not-allowed; box-shadow:none; }
.t-cta:disabled::before { display:none; }

/* AI Pipeline */
.ai-p { background:rgba(0,0,0,0.55); border:1px solid var(--border); border-radius:10px; padding:16px; margin-top:20px; display:none; animation:fadeUp 0.4s ease; z-index:10; position:relative; }
.ai-r { display:flex; align-items:center; gap:16px; margin-bottom:12px; }
.ai-orb { width:36px; height:36px; border-radius:50%; border:1px solid rgba(255,140,0,0.2); background:rgba(255,140,0,0.04); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:14px; position:relative; }
.ai-orb.run { border-color:var(--amber); background:rgba(255,140,0,0.15); box-shadow:0 0 16px rgba(255,140,0,0.35); color:var(--amber); }
.ai-orb.run::after { content:''; position:absolute; inset:-4px; border-radius:50%; border:2px solid transparent; border-top-color:var(--amber); animation:rotate 1s linear infinite; }
.ai-orb.don { border-color:var(--safe); background:rgba(6,214,160,0.1); box-shadow:0 0 12px rgba(6,214,160,0.25); color:var(--safe); }
.ai-tx { display:flex; flex-direction:column; flex:1; }
.ai-nm { font-family:'Barlow Condensed'; font-size:13px; font-weight:600; color:var(--text); letter-spacing:1px; }
.ai-st { font-family:'Barlow'; font-size:11px; color:var(--muted); margin-top:2px; }
.ai-msg { font-family:'Bebas Neue'; font-size:18px; letter-spacing:2px; color:var(--amber); text-align:center; margin-top:16px; }

/* Results */
.res-sec { display:none; flex-direction:column; gap:16px; margin-top:20px; z-index:10; position:relative; animation:fadeUp 0.5s ease; }
.sev-crd { display:flex; gap:14px; background:var(--glass); border:1px solid var(--border); border-radius:10px; padding:16px; align-items:center; }
.sev-3d { width:64px; height:64px; border-radius:50%; position:relative; display:flex; align-items:center; justify-content:center; }
.sev-3d.critical { background:radial-gradient(circle at 32% 28%,#ff8080,#e63946 55%,#6b0010); animation:orbC 1.4s ease-in-out infinite; }
.sev-3d.high { background:radial-gradient(circle at 32% 28%,#ffcc80,#ff8c00 55%,#7a3800); animation:orbH 1.4s ease-in-out infinite; }
.sev-3d.medium { background:radial-gradient(circle at 32% 28%,#80ffcc,#06d6a0 55%,#00614a); animation:orbM 1.4s ease-in-out infinite; }
@keyframes orbC { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1);box-shadow:0 0 0 15px transparent,0 0 40px rgba(230,57,70,0.6)} }
@keyframes orbH { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1);box-shadow:0 0 0 15px transparent,0 0 40px rgba(255,140,0,0.6)} }
@keyframes orbM { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1);box-shadow:0 0 0 15px transparent,0 0 40px rgba(6,214,160,0.6)} }
.rg1,.rg2 { position:absolute; border-radius:50%; }
.rg1 { inset:-6px; border:1px solid rgba(255,255,255,0.3); animation:ringOut 1.4s ease-out infinite; }
.rg2 { inset:-15px; border:1px solid rgba(255,255,255,0.15); animation:ringOut 1.4s 0.35s ease-out infinite; }

.sev-txt { font-family:'Bebas Neue'; font-size:38px; letter-spacing:3px; line-height:1; }
.sev-ari { font-family:'Barlow Condensed'; font-size:11px; color:var(--muted); margin-top:3px; }
.cd-timer { flex:1; text-align:right; }
.cd-lbl { font-family:'Barlow Condensed'; font-size:9px; letter-spacing:3px; color:var(--muted); }
.cd-val { font-family:monospace; font-size:32px; letter-spacing:2px; color:var(--warn); text-shadow:0 0 16px rgba(255,209,102,0.5); }

/* BA Cards */
.ba-grd { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.bac { padding:16px; border-radius:10px; position:relative; overflow:hidden; background:rgba(230,57,70,0.06); border:1px solid rgba(230,57,70,0.25); }
.aac { padding:16px; border-radius:10px; position:relative; overflow:hidden; background:rgba(6,214,160,0.05); border:1px solid rgba(6,214,160,0.25); }
.bac::before { content:''; position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg,transparent,var(--danger),transparent); }
.aac::before { content:''; position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg,transparent,var(--safe),transparent); }
.bx-l { font-family:'Barlow Condensed'; font-size:9px; letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; }
.bx-bb { font-family:monospace; font-size:10px; color:rgba(255,255,255,0.4); }
.bx-ab { font-family:'Barlow'; font-size:13px; color:var(--text); line-height:1.6; }

/* Sunao Button */
.sunao { width:100%; padding:11px; background:rgba(6,214,160,0.08); border:1px solid rgba(6,214,160,0.28); border-radius:6px; color:var(--safe); font-family:'Barlow Condensed'; font-size:12px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:12px; transition:all 0.2s; }
.sunao:hover { background:rgba(6,214,160,0.16); box-shadow:0 0 16px rgba(6,214,160,0.22); }
.sw { display:flex; gap:2px; height:12px; align-items:center; }
.sw b { width:3px; background:var(--safe); border-radius:2px; animation:soundWave 0.5s infinite; }
.sw b:nth-child(1){height:6px;animation-delay:0s}
.sw b:nth-child(2){height:10px;animation-delay:0.1s}
.sw b:nth-child(3){height:12px;animation-delay:0.18s}
.sw b:nth-child(4){height:8px;animation-delay:0.12s}
.sw b:nth-child(5){height:5px;animation-delay:0.06s}

/* Actions Grid */
.act-grd { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:16px; }
.act-ic { display:flex; flex-direction:column; align-items:center; gap:6px; background:var(--glass); border:1px solid var(--border-faint); border-radius:8px; padding:12px 8px; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.act-ic:hover { transform:translateY(-3px) scale(1.04); border-color:rgba(255,140,0,0.3); background:rgba(255,140,0,0.06); }
.ac-em { font-size:28px; transition:transform 0.3s; }
.act-ic:hover .ac-em { transform:scale(1.22) rotate(-6deg); }

/* Fmt Tabs */
.fm-tb { display:flex; border:1px solid var(--border); border-radius:6px; overflow:hidden; margin-top:16px;}
.fm-t { flex:1; padding:9px; background:transparent; border:none; border-right:1px solid var(--border); color:var(--muted); font-family:'Barlow Condensed'; font-size:10px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; }
.fm-t:last-child { border-right:none; }
.fm-t.act { background:rgba(255,140,0,0.12); color:var(--amber); }
.fm-c { background:rgba(0,0,0,0.4); border:1px solid var(--border); border-radius:6px; padding:14px; font-family:'Barlow'; font-size:12px; line-height:1.8; color:var(--text); white-space:pre-wrap; margin-top:8px; }

/* Bottom Nav */
.bot-nav { position:sticky; bottom:0; z-index:500; background:rgba(6,10,16,0.96); backdrop-filter:blur(24px); border-top:1px solid rgba(255,140,0,0.18); display:flex; }
.b-it { flex:1; display:flex; flex-direction:column; align-items:center; padding:10px 4px; gap:3px; cursor:pointer; border:none; background:transparent; color:var(--muted); transition:all 0.2s; border-top:2px solid transparent; }
.b-it.act { color:var(--amber); border-top-color:var(--amber); background:rgba(255,140,0,0.06); }
.b-em { font-size:20px; } .b-lb { font-family:'Barlow Condensed'; font-size:9px; letter-spacing:1px; text-transform:uppercase; }

/* Emg Grid */
.eg-grd { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:16px; margin-bottom:40px; position:relative; z-index:10; }
.egc { border-radius:8px; padding:14px; position:relative; overflow:hidden; cursor:pointer; text-decoration:none; display:flex; flex-direction:column; transition:transform 0.2s; }
.egc:hover { transform:translateY(-3px); }
.eg-bg { position:absolute; right:-8px; top:-8px; font-size:52px; opacity:0.12; z-index:0; }
.eg-z { position:relative; z-index:1; display:flex; flex-direction:column; align-items:flex-start; }
.eg-num { font-family:'Bebas Neue'; font-size:34px; letter-spacing:2px; line-height:1; }
.eg-nm { font-family:'Barlow Condensed'; font-size:11px; letter-spacing:2px; color:rgba(255,255,255,0.7); text-transform:uppercase; }

/* Surv Guide */
.sv-grid { display:flex; flex-direction:column; gap:8px; margin-top:12px; z-index:10; position:relative;}
.sv-crd { background:var(--glass); border:1px solid var(--border-faint); border-left:3px solid transparent; border-radius:6px; transition:all 0.2s; overflow:hidden; }
.sv-crd.op { border-left-color:var(--amber); background:var(--glass2); }
.sv-h { padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer; }
.sv-ic { font-size:24px; } .sv-ti { font-family:'Bebas Neue'; font-size:20px; letter-spacing:1px; color:var(--text); }
.sv-b { padding:0 14px 14px; display:none; } .sv-crd.op .sv-b { display:block; }
.sv-st { display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; animation:fadeUp 0.3s cubic-bezier(0,0,0,1) both; }
.sv-sn { width:20px; height:20px; border-radius:50%; background:var(--amber); color:#000; display:flex; align-items:center; justify-content:center; font-family:'Barlow Condensed'; font-size:10px; font-weight:700; flex-shrink:0; }
.sv-tx { font-family:'Barlow'; font-size:12px; line-height:1.6; color:var(--text); padding-top:2px; }
.sv-tbs { display:flex; gap:0; border-bottom:1px solid var(--border-faint); overflow-x:auto; margin-bottom:12px; z-index:10; position:relative; }
.sv-tb { font-family:'Barlow Condensed'; font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:9px 14px; cursor:pointer; color:var(--muted); border-bottom:2px solid transparent; white-space:nowrap; }
.sv-tb.acc { color:var(--amber); border-bottom-color:var(--amber); }

/* Globals */
.off-strip { background:rgba(255,140,0,0.07); border:1px solid rgba(255,140,0,0.2); border-radius:6px; padding:9px 14px; display:flex; align-items:center; gap:8px; margin-bottom:16px; position:relative; z-index:10; }
.sec-hd { font-family:'Bebas Neue'; font-size:32px; letter-spacing:2px; color:var(--text); margin:32px 0 16px; z-index:10; position:relative; }
.w-cont { max-width:800px; margin:0 auto; padding:0 16px; }

@media(max-width:480px){
  .c-grid { grid-template-columns:1fr; }
  .hero h1 { font-size:60px !important; }
}
`;
fs.writeFileSync('b3.js', pt3);
