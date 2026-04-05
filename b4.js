const fs = require('fs');

const pt4 = \`</style>
</head>
<body>
<div id="cursor-dot"></div><div id="cursor-ring"></div>
<canvas id="rainCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.20;"></canvas>
<div id="glowGrd" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 15% 20%, rgba(255,140,0,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 75%, rgba(230,57,70,0.03) 0%, transparent 50%);"></div>
<div id="lightningOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;background:#e8f4ff;animation:lightningFlash 11s infinite;"></div>
<div id="noiseTxl" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:3;pointer-events:none;opacity:0.03;background-image:url('data:image/svg+xml;charset=utf8,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E');background-size:180px;animation:noiseShift 0.4s steps(1) infinite;"></div>

<header class="header">
  <div style="display:flex;align-items:center;gap:12px;">
    <div class="logo-orb">⚡</div>
    <div style="display:flex;flex-direction:column;">
      <span style="font-family:'Bebas Neue';font-size:22px;letter-spacing:3px;color:var(--text);line-height:1;">ALERTBRIDGE</span>
      <span style="font-family:'Barlow Condensed';font-size:9px;letter-spacing:4px;color:var(--muted);line-height:1;">DISASTER SURVIVAL SYSTEM</span>
    </div>
  </div>
  <div class="live-pill"><span class="live-dot"></span>LIVE ALERTS</div>
</header>
<div class="ticker">
  <div class="ticker-live">⚠ LIVE</div>
  <div class="ticker-mq"><div id="tkmq"></div></div>
</div>

<section class="hero">
  <div class="pulse-rings"><div class="pr"></div><div class="pr"></div><div class="pr"></div></div>
  <div class="eyebrow"><span class="eb-line"></span>INDIA DISASTER ALERT NETWORK<span class="eb-line"></span></div>
  <h1><div class="h-w">SURVIVE</div><div class="h-a">ANY</div><div class="h-d">STORM</div></h1>
  <p class="hero-sub">Paste any government alert. We translate it into your language — clear, actionable — in 10 seconds.</p>
</section>

<div class="w-cont">
  <div class="threat">
    <div class="th-lbl">CURRENT NATIONAL THREAT LEVEL</div>
    <div class="tr-bar"><div class="tr-nd" id="tmNeedle"></div></div>
    <div class="tr-lb"><span style="color:var(--safe)">SAFE</span><span style="color:var(--info)">WATCH</span><span style="color:var(--warn)">WARN</span><span style="color:var(--danger)">CRITICAL</span></div>
    <div id="tmVal" style="font-family:'Bebas Neue';font-size:26px;letter-spacing:4px;text-align:center;text-shadow:0 0 20px rgba(255,140,0,0.5);color:var(--text);margin-top:10px;">HIGH SEVERITY</div>
  </div>

  <div class="gl-in" id="input-sec">
    <span class="gl-lbl">PASTE GOVERNMENT ALERT</span>
    <div class="t-pills"><button class="t-pill" onclick="loadDemo('cyclone')">🌀 CYCLONE DEMO</button><button class="t-pill" onclick="loadDemo('flood')">🌊 FLOOD DEMO</button><button class="t-pill" onclick="loadDemo('rain')">⛈️ RAIN DEMO</button></div>
    <textarea class="ta" id="alert-input" placeholder="Paste IMD/CWC bulletin here..." oninput="toggleBtn()"></textarea>
  </div>
  
  <span class="gl-lbl" style="z-index:10;position:relative;">TARGET COMMUNITY PROFILE</span>
  <div class="c-grid" id="comm-grid"></div>

  <button class="t-cta" id="trans-btn" onclick="translateAlert()" disabled>TRANSLATE ALERT</button>
  
  <div class="ai-p" id="pipeline">
     <div class="ai-r" id="ag1"><div class="ai-orb" id="agn1">1</div><div class="ai-tx"><span class="ai-nm">EXTRACTION AGENT</span><span class="ai-st" id="agd1">Waiting...</span></div></div>
     <div class="ai-r" id="ag2"><div class="ai-orb" id="agn2">2</div><div class="ai-tx"><span class="ai-nm">ADAPTATION AGENT</span><span class="ai-st" id="agd2">Waiting...</span></div></div>
     <div class="ai-r" id="ag3"><div class="ai-orb" id="agn3">3</div><div class="ai-tx"><span class="ai-nm">FORMATTING AGENT</span><span class="ai-st" id="agd3">Waiting...</span></div></div>
     <div class="ai-msg" id="ai-msg">INITIALIZING...</div>
  </div>

  <div class="res-sec" id="results" style="margin-bottom:60px;">
    <div class="sev-crd">
      <div class="sev-3d" id="sev-orb"><div class="rg1"></div><div class="rg2"></div><span id="sev-txt" style="z-index:2;position:relative;font-family:'Bebas Neue';font-size:24px;letter-spacing:1px;color:#fff;"></span></div>
      <div style="flex:1"><div class="sev-txt" id="sev-level"></div><div class="sev-ari" id="sev-areas"></div></div>
      <div class="cd-timer"><div class="cd-lbl">IMPACT IN</div><div class="cd-val" id="imp-timer">--:--:--</div></div>
    </div>
    
    <div class="ba-grd">
      <div class="bac"><div class="bx-l" style="color:var(--danger)">❌ ORIGINAL</div><div class="bx-bb" id="before-txt"></div></div>
      <div class="aac"><div class="bx-l" style="color:var(--safe)">✅ ALERTBRIDGE</div><div class="bx-ab" id="after-txt"></div></div>
    </div>
    
    <div class="gl-in" style="margin-bottom:0;"><span class="gl-lbl">ADAPTED MESSAGE OUTPUT</span><button class="sunao" onclick="speakResult()"><div class="sw"><b></b><b></b><b></b><b></b><b></b></div>🔊 SUNAO / READ ALOUD</button></div>
    
    <div class="act-grd" id="act-strip-r"></div>
    
    <div class="fm-tb"><button class="fm-t act" onclick="showTab('whatsapp')">WHATSAPP</button><button class="fm-t" onclick="showTab('sms')">SMS</button><button class="fm-t" onclick="showTab('voice')">VOICE</button></div>
    <div class="fm-c" id="fmt-content"></div>
  </div>

  <div class="off-strip" id="survive"><div class="live-dot" style="background:var(--amber);"></div>SURVIVAL GUIDE WORKS OFFLINE · NO INTERNET NEEDED</div>
  <h2 class="sec-hd">SURVIVAL RESOURCES</h2>
  <div class="sv-tbs" id="sv-tabs"></div>
  <div class="sv-grid" id="surv-content"></div>

  <h2 class="sec-hd" style="margin-top:40px;" id="sos">EMERGENCY CONTACTS</h2>
  <div class="eg-grd">
    <a href="tel:1078" class="egc" style="background:rgba(255,140,0,0.14);border:1px solid rgba(255,140,0,0.3);"><div class="eg-bg">🆘</div><div class="eg-z"><span class="eg-num" style="color:var(--amber)">1078</span><span class="eg-nm">NDRF RESCUE</span></div></a>
    <a href="tel:108" class="egc" style="background:rgba(6,214,160,0.14);border:1px solid rgba(6,214,160,0.3);"><div class="eg-bg">🚑</div><div class="eg-z"><span class="eg-num" style="color:var(--safe)">108</span><span class="eg-nm">AMBULANCE</span></div></a>
    <a href="tel:101" class="egc" style="background:rgba(230,57,70,0.14);border:1px solid rgba(230,57,70,0.3);"><div class="eg-bg">🚒</div><div class="eg-z"><span class="eg-num" style="color:var(--danger)">101</span><span class="eg-nm">FIRE BRIGADE</span></div></a>
    <a href="tel:100" class="egc" style="background:rgba(53,118,255,0.14);border:1px solid rgba(53,118,255,0.3);"><div class="eg-bg">👮</div><div class="eg-z"><span class="eg-num" style="color:var(--info)">100</span><span class="eg-nm">POLICE</span></div></a>
    <a href="tel:112" class="egc" style="background:rgba(255,209,102,0.14);border:1px solid rgba(255,209,102,0.3);"><div class="eg-bg">📞</div><div class="eg-z"><span class="eg-num" style="color:var(--warn)">112</span><span class="eg-nm">UNIFIED EMERGENCY</span></div></a>
    <a href="tel:1554" class="egc" style="background:rgba(76,201,240,0.14);border:1px solid rgba(76,201,240,0.3);"><div class="eg-bg">⚓</div><div class="eg-z"><span class="eg-num" style="color:var(--info)">1554</span><span class="eg-nm">COAST GUARD</span></div></a>
  </div>
</div>

<div class="bot-nav">
  <button class="b-it" onclick="document.getElementById('input-sec').scrollIntoView({behavior:'smooth'})"><span class="b-em">📡</span><span class="b-lb">ALERTS</span></button>
  <button class="b-it" onclick="document.getElementById('survive').scrollIntoView({behavior:'smooth'})"><span class="b-em">🛡️</span><span class="b-lb">SURVIVE</span></button>
  <button class="b-it" onclick="document.getElementById('sos').scrollIntoView({behavior:'smooth'})"><span class="b-em">🆘</span><span class="b-lb">O.C.C</span></button>
  <button class="b-it" onclick="changeTextSize(1)"><span class="b-em">A+</span><span class="b-lb">SCALE</span></button>
</div>

<script>
\`
fs.writeFileSync('b4.js', pt4);
