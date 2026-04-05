import { useState, useCallback, useEffect, useRef } from 'react';
import { DEMO_ALERTS, COMMUNITIES } from './data/demoAlerts';
import { SURVIVAL_CATEGORIES, SURVIVAL_GUIDES } from './data/survivalData';
import { EMERGENCY_CONTACTS, EMERGENCY_RESOURCES } from './data/emergencyData';
import AnimatedFirstAid from './components/AnimatedFirstAid';

const API = 'http://localhost:5000';
const MARQUEE_TEXT = '⚠ CYCLONE WARNING: Red Alert — Odisha coast ▸ 🌊 FLOOD ALERT: Ganga above danger level — Bihar ▸ 🌀 IMD BULLETIN: Severe storm approaching Tamil Nadu ▸ 📡 NDMA ADVISORY: Evacuate low-lying areas immediately ▸ 🆘 NDRF deployed — Dial 1078 ▸ ';

const STATE_LANG_MAP = {
  'Odisha': { lang:'or', name:'Odia', community:'odisha_coastal', greeting:'ନମସ୍କାର' },
  'Bihar': { lang:'hi', name:'Bhojpuri Hindi', community:'bihar_flood', greeting:'नमस्ते' },
  'Tamil Nadu': { lang:'ta', name:'Tamil', community:'tamil_coast', greeting:'வணக்கம்' },
  'Kerala': { lang:'ml', name:'Malayalam', community:'kerala_hills', greeting:'നമസ്കാരം' },
  'West Bengal': { lang:'bn', name:'Bengali', community:'bengal_delta', greeting:'নমস্কার' },
  'Andhra Pradesh': { lang:'te', name:'Telugu', community:'andhra_coastal', greeting:'నమస్కారం' },
  'Maharashtra': { lang:'mr', name:'Marathi', community:'maharashtra_coastal', greeting:'नमस्कार' },
  'Gujarat': { lang:'gu', name:'Gujarati', community:'gujarat_coastal', greeting:'નમસ્તે' },
  'Assam': { lang:'as', name:'Assamese', community:'assam_flood', greeting:'নমস্কাৰ' },
  'Uttarakhand': { lang:'hi', name:'Hindi', community:'himalayan_flood', greeting:'नमस्ते' },
};
const SECTION_AUDIO = {
  hero: "AlertBridge — Aapki suraksha ka app. Sarkar ki chetavani ko aapki bhasha mein badalta hai.",
  translate: "Yahan koi bhi sarkar ki alert paste karo. Apna state chuno. Translate karo.",
  survive: "Survival guide. First aid, safe paani, shelter, protection, rescue signal — sab offline kaam karta hai.",
  sos: "Emergency numbers. NDRF 1078. Ambulance 108. Police 100. Unified emergency 112.",
};
const ACTION_ICONS = [
  { emoji:'🏃', labelEn:'RUN', labelHi:'NIKLO', type:'urgent' },
  { emoji:'👨‍👩‍👧', labelEn:'FAMILY', labelHi:'PARIVAR', type:'urgent' },
  { emoji:'💊', labelEn:'MEDICINE', labelHi:'DAWAI', type:'urgent' },
  { emoji:'📄', labelEn:'DOCUMENTS', labelHi:'KAAGAZ', type:'urgent' },
  { emoji:'🏠', labelEn:'SHELTER', labelHi:'SAFE JAGAH', type:'safe' },
  { emoji:'⏰', labelEn:'NOW', labelHi:'ABHI', type:'urgent' },
];

/* ═══ SVG Logo ═══ */
function LogoSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="#FF7A00" strokeWidth="1.5"/>
      <polygon points="16,8 24,13 24,22 16,27 8,22 8,13" fill="rgba(255,122,0,0.1)" stroke="#FF7A00" strokeWidth="1"/>
      <path d="M16 18 L16 14" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round"/>
      <path d="M13 17 Q13 14 16 14 Q19 14 19 17" fill="none" stroke="#FF7A00" strokeWidth="1.5"/>
      <path d="M11 19 Q11 12 16 12 Q21 12 21 19" fill="none" stroke="rgba(255,122,0,0.5)" strokeWidth="1"/>
    </svg>
  );
}

/* ═══ Rain Canvas — ENHANCED ═══ */
function RainCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      speed: 8 + Math.random() * 7, length: 15 + Math.random() * 10,
      opacity: 0.35 + Math.random() * 0.2,
    }));
    let id;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      drops.forEach(d => {
        ctx.beginPath(); ctx.strokeStyle = `rgba(150,200,255,${d.opacity})`;
        ctx.lineWidth = 1; ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1, d.y + d.length); ctx.stroke();
        d.y += d.speed;
        if (d.y > c.height - 10) {
          ctx.beginPath(); ctx.strokeStyle = 'rgba(150,200,255,0.3)'; ctx.lineWidth = 0.8;
          ctx.moveTo(d.x - 4, c.height - 5); ctx.lineTo(d.x + 4, c.height - 5); ctx.stroke();
          d.y = -d.length; d.x = Math.random() * c.width;
        }
      });
      id = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="rain-canvas" />;
}

/* ═══ Counter hook ═══ */
function useCounter(target, dur = 2000) {
  const [val, setVal] = useState(0);
  const [go, setGo] = useState(false);
  const elRef = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !go) {
        setGo(true);
        const t0 = performance.now();
        function tick(now) { const p = Math.min((now - t0) / dur, 1); setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(tick); }
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [target, dur, go]);
  return [val, elRef];
}

/* ═══ Danger Meter ═══ */
function DangerMeter({ severity }) {
  const s = severity?.toLowerCase() || '';
  const fills = s === 'critical' ? 5 : s === 'high' ? 4 : s === 'medium' ? 3 : s === 'low' ? 1 : 0;
  const emoji = s === 'critical' ? '🆘' : s === 'high' ? '😰' : s === 'medium' ? '😟' : '😌';
  return (
    <div className="danger-meter">
      {[1,2,3,4,5].map(n => <div key={n} className={`dm-circle ${n <= fills ? (n <= 2 ? 'fill-safe' : n === 3 ? 'fill-warn' : 'fill-danger') : ''}`} />)}
      <span className="dm-emoji">{emoji}</span>
      <span className="dm-label">DANGER: {(s || 'UNKNOWN').toUpperCase()}</span>
    </div>
  );
}

/* ═══════════ MAIN APP ═══════════ */
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [community, setCommunity] = useState('odisha_coastal');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([0, 0, 0]);
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [survCat, setSurvCat] = useState('first_aid');
  const [countdown, setCountdown] = useState(6 * 3600);
  const lightRef = useRef(null);
  // System 2
  const [locProfile, setLocProfile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLocBar, setShowLocBar] = useState(false);
  // System 3
  const [voiceListening, setVoiceListening] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [speakingCard, setSpeakingCard] = useState(null);
  const recRef = useRef(null);
  // System 4
  const [textSize, setTextSize] = useState('normal');
  const [hiContrast, setHiContrast] = useState(false);

  const [langCount, langRef] = useCounter(22);
  const [popCount, popRef] = useCounter(400);
  const [speedCount, speedRef] = useCounter(10);

  const speakFeedback = useCallback((text, lang) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || (locProfile?.lang ? locProfile.lang + '-IN' : 'hi-IN'); u.rate = 0.82; u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  }, [locProfile]);

  useEffect(() => {
    function flash() { const el = lightRef.current; if (!el) return; el.style.background = 'rgba(200,220,255,0.06)'; el.style.opacity = '1'; setTimeout(() => { el.style.background = 'rgba(200,220,255,0.03)'; setTimeout(() => { el.style.opacity = '0'; }, 40); }, 80); setTimeout(flash, 8000 + Math.random() * 7000); }
    const t = setTimeout(flash, 3000); return () => clearTimeout(t);
  }, []);
  useEffect(() => { const iv = setInterval(() => setCountdown(p => (p <= 0 ? 6 * 3600 : p - 1)), 1000); return () => clearInterval(iv); }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); }), { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`; obs.observe(el); });
    return () => obs.disconnect();
  }, [result, survCat]);

  // Location detection
  useEffect(() => {
    if (!navigator.geolocation) { setShowLocBar(true); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => { try { const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`); const data = await res.json(); const state = data.address?.state || ''; const match = Object.entries(STATE_LANG_MAP).find(([k]) => state.toLowerCase().includes(k.toLowerCase())); const prof = match ? { ...match[1], state: match[0] } : { lang:'hi', name:'Hindi', community:'bihar_flood', greeting:'नमस्ते', state: state||'India' }; setLocProfile(prof); setCommunity(prof.community); setShowToast(true); setTimeout(() => setShowToast(false), 5000); } catch {} },
      () => setShowLocBar(true), { timeout: 8000, maximumAge: 300000 }
    );
  }, []);
  // Voice setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
    const rec = new SR(); rec.continuous = false; rec.interimResults = false; rec.lang = locProfile?.lang ? locProfile.lang + '-IN' : 'hi-IN';
    rec.onresult = (e) => { handleVoiceCmd(e.results[0][0].transcript.toLowerCase()); setVoiceListening(false); };
    rec.onend = () => setVoiceListening(false); rec.onerror = () => setVoiceListening(false); recRef.current = rec;
  }, [locProfile]);
  // Text/contrast
  useEffect(() => { const cl = document.documentElement.classList; cl.remove('text-large','text-xlarge','high-contrast'); if (textSize==='large') cl.add('text-large'); if (textSize==='xlarge') cl.add('text-xlarge'); if (hiContrast) cl.add('high-contrast'); }, [textSize, hiContrast]);

  const scrollTo = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  const translate = useCallback(async () => {
    if (!alertText.trim()) return; setLoading(true); setResult(null); setError(null); setAgents([1,0,0]);
    const t2 = setTimeout(() => setAgents([2,1,0]), 2500); const t3 = setTimeout(() => setAgents([2,2,1]), 5000);
    try { const res = await fetch(`${API}/process`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ alert_text: alertText, community }) }); if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error||`Server ${res.status}`); } const data = await res.json(); setAgents([2,2,2]); setTimeout(() => { setResult(data); setActiveTab('whatsapp'); speakFeedback('Translation ready.'); }, 500);
    } catch (e) { setAgents([0,0,0]); setError(e.message.includes('fetch') ? 'AI Backend Offline — Start Flask server. Survival guides & SOS work offline.' : e.message); }
    finally { clearTimeout(t2); clearTimeout(t3); setLoading(false); }
  }, [alertText, community, speakFeedback]);

  const speakText = useCallback((text) => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(text); u.lang = locProfile?.lang ? locProfile.lang+'-IN' : 'hi-IN'; u.rate = 0.85;
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false); setSpeaking(true); window.speechSynthesis.speak(u);
  }, [speaking, locProfile]);

  const handleVoiceCmd = useCallback((cmd) => {
    if (cmd.includes('translate')||cmd.includes('anuwad')) scrollTo('translate');
    else if (cmd.includes('survival')||cmd.includes('bachao')) scrollTo('survive');
    else if (cmd.includes('sos')||cmd.includes('madad')) scrollTo('sos');
    else if (cmd.includes('home')||cmd.includes('ghar')) window.scrollTo({top:0,behavior:'smooth'});
    else if (cmd.includes('cpr')||cmd.includes('dil')) { setSurvCat('first_aid'); scrollTo('survive'); }
    else if (cmd.includes('water')||cmd.includes('paani')) { setSurvCat('water'); scrollTo('survive'); }
    else if (cmd.includes('cyclone')||cmd.includes('toofan')) { setAlertText(DEMO_ALERTS.cyclone.text); speakFeedback('Cyclone demo loaded.'); }
    else if (cmd.includes('flood')||cmd.includes('baarish')) { setAlertText(DEMO_ALERTS.flood.text); speakFeedback('Flood demo loaded.'); }
    else if (cmd.includes('emergency')||cmd.includes('khatra')) setEmergencyMode(true);
    else if (cmd.includes('108')) window.open('tel:108');
    else if (cmd.includes('1078')) window.open('tel:1078');
    else if (cmd.includes('read')||cmd.includes('padho')||cmd.includes('suno')) { const secs=['hero','translate','survive','sos']; const vis=secs.find(id=>{const el=document.getElementById(id);if(!el)return false;const r=el.getBoundingClientRect();return r.top<window.innerHeight/2&&r.bottom>0;}); if(vis&&SECTION_AUDIO[vis]) speakFeedback(SECTION_AUDIO[vis]); }
  }, [speakFeedback]);

  const startVoice = () => { if (!recRef.current) return; if (voiceListening) { recRef.current.stop(); return; } setVoiceListening(true); recRef.current.start(); };
  const speakCard = (card, idx) => {
    if (speakingCard===idx) { window.speechSynthesis.cancel(); setSpeakingCard(null); return; }
    setSpeakingCard(idx); const u = new SpeechSynthesisUtterance(card.steps.join('. Then, '));
    u.lang = locProfile?.lang ? locProfile.lang+'-IN' : 'hi-IN'; u.rate=0.82;
    u.onend=()=>setSpeakingCard(null); u.onerror=()=>setSpeakingCard(null); window.speechSynthesis.speak(u);
  };

  const sev = result?.extracted?.severity?.toLowerCase() || '';
  const fmtTime = (s) => `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const AGENT_DEFS = [
    { name:'EXTRACTION AGENT', desc:'Reading and decoding alert...' },
    { name:'ADAPTATION AGENT', desc:'Rewriting for your community...' },
    { name:'FORMAT AGENT', desc:'Generating WhatsApp, SMS, Voice...' },
  ];

  return (
    <>
      <RainCanvas />
      <div className="fog-layer" />
      <div className="lightning-overlay" ref={lightRef} />

      {/* ═── MARQUEE ═── */}
      <div className="marquee-bar">
        <div className="marquee-live-badge"><span className="live-dot" />LIVE ALERTS</div>
        <div className="marquee-track"><span className="marquee-text">{MARQUEE_TEXT}</span><span className="marquee-text">{MARQUEE_TEXT}</span></div>
      </div>

      {/* ═── NAVBAR ═── */}
      <nav className="navbar"><div className="nav-inner">
        <div className="nav-logo" onClick={() => scrollTo('hero')}>
          <LogoSVG />
          <span className="nav-logo-text"><span className="amber">ALERT</span><span className="white">BRIDGE</span></span>
        </div>
        <div className="nav-links">
          {locProfile && <span className="location-badge">📍 {locProfile.state} • {locProfile.name}</span>}
          <button className="nav-link" onClick={() => scrollTo('translate')}>TRANSLATE</button>
          <button className="nav-link" onClick={() => scrollTo('survive')}>SURVIVE</button>
          <button className="nav-link" onClick={() => scrollTo('sos')}>SOS</button>
        </div>
        <button className={`nav-burger ${mobileOpen?'open':''}`} onClick={() => setMobileOpen(!mobileOpen)}><span/><span/><span/></button>
      </div></nav>
      {showLocBar && <div className="location-bar"><span>📍 Allow location for automatic language detection</span><button className="dismiss" onClick={() => setShowLocBar(false)}>✕</button></div>}
      <div className={`mobile-menu ${mobileOpen?'open':''}`}>
        <button className="nav-link" onClick={() => scrollTo('translate')}>TRANSLATE</button>
        <button className="nav-link" onClick={() => scrollTo('survive')}>SURVIVE</button>
        <button className="nav-link" onClick={() => scrollTo('sos')}>SOS</button>
      </div>

      {/* ═── HERO ═── */}
      <section id="hero" className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">INDIA'S DISASTER COMMUNICATION CRISIS</div>
            <h1 className="hero-h1">ALERTS EXIST.<br/><span className="gradient-word">UNDERSTANDING DOESN'T.</span></h1>
            <p className="hero-subtext"><strong>400 million</strong> Indians live in flood and cyclone zones. Government alerts reach their phones — in English they cannot read. AlertBridge translates warnings into <strong>their language</strong>, their words, their action.</p>
            <div className="hero-stats">
              <div className="stat-item" ref={langRef}><div className="stat-number">{langCount}</div><div className="stat-label">LANGUAGES</div></div>
              <div className="stat-item" ref={popRef}><div className="stat-number">{popCount}M+</div><div className="stat-label">PEOPLE PROTECTED</div></div>
              <div className="stat-item" ref={speedRef}><div className="stat-number">{speedCount}s</div><div className="stat-label">TO ACT</div></div>
            </div>
            <button className="hero-cta" onClick={() => scrollTo('translate')}>TRANSLATE AN ALERT NOW →</button>
            <div className="scroll-hint">SCROLL TO SURVIVE ↓</div>
          </div>
          <div className="threat-panel">
            <div className="threat-panel-header"><span className="threat-panel-title">ACTIVE THREATS</span><span className="threat-status-dot"/></div>
            <div className="threat-item"><div className="threat-icon-box cyclone">🌀</div><div className="threat-info"><div className="threat-name">CYCLONE DANA</div><div className="threat-location">Bay of Bengal → Odisha coast</div><div className="threat-severity red">RED ALERT</div></div></div>
            <div className="threat-item"><div className="threat-icon-box flood">🌊</div><div className="threat-info"><div className="threat-name">GANGA FLOOD</div><div className="threat-location">Above danger mark — Patna, Bihar</div><div className="threat-severity red">RED ALERT</div></div></div>
            <div className="threat-item"><div className="threat-icon-box rain">🌧️</div><div className="threat-info"><div className="threat-name">HEAVY RAINFALL</div><div className="threat-location">Tamil Nadu — coastal districts</div><div className="threat-severity orange">ORANGE ALERT</div></div></div>
            <div className="threat-panel-footer">SOURCE: IMD • NDMA • CWC</div>
          </div>
        </div>
      </section>

      {/* ═── THE PROBLEM ═── */}
      <section id="problem" className="problem-section">
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div className="section-label reveal">THE CRISIS</div>
          <h2 className="section-title reveal">THE GAP THAT KILLS</h2>
          <div className="gap-panels">
            <div className="panel-danger reveal">
              <div className="panel-label danger">WHAT RAMU KAKA RECEIVES</div>
              <div className="alert-terminal">Severe Cyclonic Storm Warning. Deep depression over Bay of Bengal intensified. Storm surge of 2-3m expected. Red Alert for Puri, Jagatsinghpur, Kendrapara, Bhadrak. Wind 100-110 kmph gusting 120. NDMA advises immediate evacuation within 5km of coastline.</div>
              <div className="reaction-row"><span className="reaction-emoji">😕</span><span className="reaction-text">Cannot understand. Waits. Asks neighbour.</span></div>
              <div className="time-cost">⏰ 4 HOURS LOST</div>
            </div>
            <div className="panel-divider"><div className="panel-divider-line"/><div className="panel-arrow-circle">→</div><div className="panel-divider-line"/></div>
            <div className="panel-safe reveal">
              <div className="panel-label safe">WHAT ALERTBRIDGE SENDS</div>
              <div className="adapted-message">⚠️ Ramu bhai — aaj raat <span className="highlight">toofan aayega</span>.{'\n'}<span className="highlight">ABHI NIKLO.</span>{'\n'}Bacchon ko lo, dawaiyaan lo, kaagaz lo.{'\n'}Panchayat building mein jao — woh safe hai.{'\n'}Kal subah tak wapas mat aana.</div>
              <div className="action-icons-row">
                {[{i:'🏃',l:'RUN'},{i:'👨‍👩‍👧',l:'FAMILY'},{i:'💊',l:'MEDS'},{i:'📄',l:'DOCS'},{i:'🏠',l:'SHELTER'}].map((a,j)=>(
                  <div key={j} className="action-icon-pill"><span className="icon">{a.i}</span><span className="label">{a.l}</span></div>
                ))}
              </div>
              <div className="time-saved">⚡ 30 SECONDS TO ACT</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═── TRANSLATOR ═── */}
      <section id="translate" className="translator-section">
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="section-label reveal">REAL-TIME TRANSLATION</div>
          <h2 className="section-title reveal">TRANSLATE ANY ALERT</h2>
          <div className="translator-layout">
            <div className="input-panel">
              <div className="demo-pills reveal">{Object.entries(DEMO_ALERTS).map(([k,d])=>(<button key={k} className="demo-pill" onClick={()=>{setAlertText(d.text);speakFeedback(`${d.label.replace(/[^\w\s]/g,'')} loaded.`);}}>{d.label}</button>))}</div>
              <textarea className="alert-textarea reveal" value={alertText} onChange={e=>setAlertText(e.target.value)} placeholder="Paste any government disaster alert here — IMD cyclone bulletin, CWC flood report, NDMA warning..." />
              <div className="reveal"><div className="community-label">SENDING TO:</div>
                <select className="community-select" value={community} onChange={e=>{setCommunity(e.target.value);speakFeedback('Community changed.');}}>
                  {COMMUNITIES.map(c=><option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <button className={`translate-btn reveal ${loading?'loading':''}`} onClick={translate} disabled={loading||!alertText.trim()}>
                {loading?<><div className="t-spinner"/>AI PIPELINE RUNNING...</>:'TRANSLATE ALERT →'}
              </button>
              {error && <div className="error-card"><div className="error-title">⚠️ {error.includes('Offline')?'AI Backend Offline':'Error'}</div><div className="error-msg">{error}</div></div>}
            </div>
            <div className="output-panel">
              {!result && !loading && !agents.some(a=>a>0) && (
                <div className="output-empty"><div className="output-empty-icon">📡</div><div className="output-empty-text">PASTE AN ALERT AND TRANSLATE<br/>TO SEE RESULTS HERE</div></div>
              )}
              {(loading||agents.some(a=>a>0))&&!result && (
                <div className="agent-pipeline"><div className="agent-pipeline-title">AI PIPELINE</div>
                  {AGENT_DEFS.map((a,i)=>{const st=agents[i]===0?'':agents[i]===1?'running':'done';return(
                    <div key={i} className={`agent-row ${st}`}><div className="agent-number">{agents[i]===2?'✓':i+1}</div><div className="agent-info"><div className="agent-name">{a.name}</div><div className="agent-desc">{agents[i]===0?'Waiting...':agents[i]===1?a.desc:'Complete ✓'}</div></div></div>
                  );})}
                </div>
              )}
              {result && (
                <div className="results-area">
                  <div className="severity-row">
                    <div className={`severity-orb ${sev}`}>{sev?sev.toUpperCase():'—'}</div>
                    <div className="severity-info">
                      <h3>{(result.extracted?.hazard_type||'Alert').replace(/_/g,' ').toUpperCase()} DETECTED</h3>
                      <p>{result.extracted?.summary||'Alert processed.'}</p>
                      <DangerMeter severity={sev}/>
                    </div>
                    <div><div className={`countdown ${countdown<3600?'flash':''}`}>{fmtTime(countdown)}</div><div style={{font:'500 9px var(--font-body)',letterSpacing:2,color:'var(--text-muted)',textAlign:'right',marginTop:2}}>IMPACT COUNTDOWN</div></div>
                  </div>
                  <div className="action-strip">{ACTION_ICONS.map((a,i)=>(<div key={i} className="action-icon"><div className={`action-circle ${a.type}`}>{a.emoji}</div><div className="action-label">{a.labelEn}<br/>{a.labelHi}</div></div>))}</div>
                  <div className="comparison-grid">
                    <div className="comparison-before"><div className="comparison-tag before">❌ BEFORE — OFFICIAL</div><div className="before-text">{result.original}</div></div>
                    <div className="comparison-after"><div className="comparison-tag after">✅ AFTER — ALERTBRIDGE</div><div className="after-text">{result.adapted}</div></div>
                  </div>
                  {result.formatted&&(<>
                    <div className="format-tabs">{[{k:'whatsapp',l:'💬 WHATSAPP'},{k:'sms',l:'📱 SMS'},{k:'voice',l:'🔊 VOICE'}].map(t=>(<button key={t.k} className={`format-tab ${activeTab===t.k?'active':''}`} onClick={()=>setActiveTab(t.k)}>{t.l}</button>))}</div>
                    <div className="format-content">{result.formatted[activeTab]||result.adapted}</div>
                    <div className="format-footer">{activeTab==='sms'?<span className={`char-ct ${(result.formatted.sms||'').length>160?'over':''}`}>{(result.formatted.sms||'').length}/160</span>:<span/>}
                      <button className={`speak-btn ${speaking?'speaking':''}`} onClick={()=>speakText(result.formatted[activeTab]||result.adapted)}>{speaking?'⏹️ STOP':'🔊 SUNAO / HEAR THIS'}</button>
                    </div>
                  </>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═── SURVIVAL GUIDE ═── */}
      <section id="survive" className="survive-section">
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div className="section-label reveal">OFFLINE SURVIVAL KNOWLEDGE</div>
          <h2 className="section-title reveal">SURVIVE BEFORE HELP ARRIVES</h2>
          <div className="survive-tabs reveal">
            {SURVIVAL_CATEGORIES.map(cat=>(<button key={cat.id} className={`survive-tab ${survCat===cat.id?'active':''}`} onClick={()=>{setSurvCat(cat.id);speakFeedback(cat.label);}}>
              <span className="tab-icon">{cat.emoji}</span><span className="tab-label">{cat.label}</span></button>))}
          </div>
          {survCat==='first_aid'?<AnimatedFirstAid/>:(
            <div className="survival-grid">{(SURVIVAL_GUIDES[survCat]||[]).map((card,i)=>(
              <div key={`${survCat}-${i}`} className="surv-card reveal">
                <div className="surv-card-icon">{card.icon}</div>
                <div className="surv-card-title">{card.title}</div>
                {card.desc&&<div className="surv-card-desc">{card.desc}</div>}
                <ol className="surv-steps">{card.steps.map((step,j)=>(<li key={j}><span className="step-num">{j+1}</span><span>{step}</span></li>))}</ol>
                <div style={{display:'flex',gap:8,alignItems:'center',marginTop:'auto'}}>
                  <button className={`sunao-btn ${speakingCard===`${survCat}-${i}`?'speaking-card':''}`} onClick={()=>speakCard(card,`${survCat}-${i}`)}>{speakingCard===`${survCat}-${i}`?'⏸ RUK JAO':'🔊 SUNAO'}</button>
                  <span className="offline-badge">🟢 OFFLINE</span>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      </section>

      {/* ═── SOS ═══ */}
      <section id="sos" className="sos-section">
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div className="section-label reveal" style={{'--amber-pure':'var(--danger-pure)'}}>EMERGENCY</div>
          <h2 className="sos-title reveal">EMERGENCY CONTACTS</h2>
          <p className="sos-sub reveal">One tap to call. Works on any phone.</p>
          <div className="sos-grid">{EMERGENCY_CONTACTS.map((c,i)=>(
            <div key={i} className="sos-card reveal"><div className="sos-card-icon">{c.icon}</div><div className="sos-card-number">{c.number}</div><div className="sos-card-name">{c.name}</div><a href={`tel:${c.tel}`} className="call-btn">📞 TAP TO CALL</a></div>
          ))}</div>
          <h3 className="resource-title-head reveal">SURVIVAL RESOURCES</h3>
          <div className="resource-grid">{EMERGENCY_RESOURCES.map((r,i)=>(
            <div key={i} className="resource-card reveal"><span className="resource-icon">{r.icon}</span><div><div className="resource-title-text">{r.title}</div><div className="resource-desc">{r.desc}</div></div></div>
          ))}</div>
        </div>
      </section>

      {/* ═── FOOTER ═── */}
      <footer className="footer"><div className="footer-inner">
        <div><span className="footer-brand">ALERTBRIDGE</span><br/>Closing India's disaster communication gap</div>
        <div>Built for The Climate Change-Makers Challenge 2026</div>
        <div>Powered by Groq + LLaMA 3.3 + India Community Data</div>
      </div><div className="footer-disclaimer">AlertBridge does not replace official emergency services. Always follow local authority instructions. In emergency, call 112.</div></footer>

      {/* ═── LOCATION TOAST ═── */}
      <div className={`location-toast ${showToast?'show':''}`}><div className="toast-icon">📍</div><div><div className="toast-title">LOCATION DETECTED</div><div className="toast-body">Switching to {locProfile?.name||'Hindi'}</div><div className="toast-greeting">{locProfile?.greeting||'नमस्ते'} 🙏</div></div><button className="toast-close" onClick={()=>setShowToast(false)}>✕</button></div>

      {/* ═── FLOATING CONTROLS ═── */}
      <div className="fab-cluster">
        <div className="fab-with-tooltip"><button className="fab-secondary" onClick={()=>setHiContrast(p=>!p)}>🌗<span className="fab-tooltip">Contrast</span></button></div>
        <div className="fab-with-tooltip"><button className="fab-secondary" onClick={()=>setTextSize(p=>p==='normal'?'large':p==='large'?'xlarge':'normal')}>Aa<span className="fab-tooltip">Text: {textSize}</span></button></div>
        <div className="fab-with-tooltip"><button className={`fab-voice ${voiceListening?'listening':''}`} onClick={startVoice}>🎤<span className="fab-tooltip">Voice</span></button></div>
      </div>

      {/* ═── EMERGENCY OVERLAY ═── */}
      {emergencyMode&&(<div className="emergency-overlay"><div className="emg-overlay-icon">🚨</div><div className="emg-overlay-title">EMERGENCY MODE</div>
        {EMERGENCY_CONTACTS.slice(0,4).map((c,i)=>(<a key={i} href={`tel:${c.tel}`} className="emg-call-btn">{c.icon} {c.number} — {c.name}</a>))}
        <button className="emg-close-btn" onClick={()=>setEmergencyMode(false)}>✕ CLOSE</button>
      </div>)}
    </>
  );
}
