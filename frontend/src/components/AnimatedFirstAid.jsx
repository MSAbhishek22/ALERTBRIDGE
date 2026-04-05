import { useState, useEffect } from 'react';

function useStepCycle(count, ms = 1500) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI(p => (p + 1) % count), ms);
    return () => clearInterval(iv);
  }, [count, ms]);
  return i;
}

/* ═══ CPR Animation ═══ */
function CPRSvg() {
  return (
    <svg viewBox="0 0 300 200" className="anim-svg">
      <rect width="300" height="200" rx="12" fill="#111" />
      <line x1="30" y1="168" x2="270" y2="168" stroke="#282830" strokeWidth="2" />
      <rect className="cpr-chest" x="90" y="138" width="120" height="28" rx="14" fill="#4a4a5a" />
      <circle cx="220" cy="146" r="14" fill="#5a5a6a" />
      <line x1="228" y1="143" x2="232" y2="143" stroke="#333" strokeWidth="2" />
      <rect x="60" y="146" width="34" height="10" rx="5" fill="#4a4a5a" />
      <rect x="56" y="158" width="38" height="10" rx="5" fill="#4a4a5a" />
      <g className="cpr-hands">
        <rect x="130" y="112" width="36" height="22" rx="8" fill="#D4956A" />
        <rect x="135" y="104" width="26" height="14" rx="6" fill="#C4855A" />
      </g>
      <g className="cpr-heart">
        <circle cx="150" cy="152" r="9" fill="#FF3333" />
        <text x="150" y="156" textAnchor="middle" fontSize="11" fill="#fff">♥</text>
      </g>
      <line className="cpr-arrow" x1="148" y1="92" x2="148" y2="106" stroke="#FF6B00" strokeWidth="2" />
      <polygon points="143,106 148,114 153,106" fill="#FF6B00" />
      <rect x="242" y="8" width="48" height="24" rx="8" fill="#FF6B00" />
      <text x="266" y="25" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="Oswald,sans-serif">×30</text>
    </svg>
  );
}

/* ═══ Bleeding Animation ═══ */
function BleedingSvg() {
  return (
    <svg viewBox="0 0 300 200" className="anim-svg">
      <rect width="300" height="200" rx="12" fill="#111" />
      <rect x="40" y="85" width="200" height="40" rx="20" fill="#D4956A" />
      <circle className="blood-wound" cx="150" cy="105" r="14" fill="#FF3333" />
      <g className="press-cloth">
        <rect x="132" y="68" width="36" height="22" rx="4" fill="#f0f0f0" />
      </g>
      <g className="press-hand">
        <rect x="126" y="46" width="48" height="22" rx="8" fill="#C4855A" />
      </g>
      <rect x="232" y="8" width="58" height="24" rx="8" fill="#FF6B00" />
      <text x="261" y="25" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="Oswald,sans-serif">10 MIN</text>
      <text x="150" y="170" textAnchor="middle" fontSize="12" fill="#666" fontFamily="Barlow Condensed,sans-serif">PRESS HARD — DON'T REMOVE</text>
    </svg>
  );
}

/* ═══ Burns Animation ═══ */
function BurnsSvg() {
  return (
    <svg viewBox="0 0 300 200" className="anim-svg">
      <rect width="300" height="200" rx="12" fill="#111" />
      <rect x="80" y="95" width="130" height="45" rx="18" fill="#D4956A" />
      <rect x="55" y="103" width="30" height="12" rx="6" fill="#D4956A" />
      <rect x="50" y="118" width="34" height="11" rx="5" fill="#D4956A" />
      <rect x="56" y="132" width="26" height="10" rx="5" fill="#D4956A" />
      <ellipse className="burn-patch" cx="155" cy="118" rx="22" ry="14" />
      <g className="water-drop wd1"><ellipse cx="140" cy="65" rx="4" ry="7" fill="#4488FF" /></g>
      <g className="water-drop wd2"><ellipse cx="155" cy="60" rx="4" ry="7" fill="#4488FF" /></g>
      <g className="water-drop wd3"><ellipse cx="170" cy="68" rx="4" ry="7" fill="#4488FF" /></g>
      <rect x="232" y="8" width="58" height="24" rx="8" fill="#FF6B00" className="badge-blink" />
      <text x="261" y="25" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="Oswald,sans-serif">20 MIN</text>
      <text x="42" y="186" fontSize="13" fill="#FF3333">❌🧈</text>
      <text x="100" y="186" fontSize="13" fill="#FF3333">❌🧊</text>
      <text x="158" y="186" fontSize="13" fill="#00FF88">✅💧</text>
    </svg>
  );
}

/* ═══ Broken Bone Animation ═══ */
function BoneSvg() {
  return (
    <svg viewBox="0 0 300 200" className="anim-svg">
      <rect width="300" height="200" rx="12" fill="#111" />
      <rect x="115" y="25" width="28" height="150" rx="12" fill="#D4956A" />
      <rect x="98" y="35" width="8" height="130" rx="2" fill="#8B6914" />
      <rect x="152" y="35" width="8" height="130" rx="2" fill="#8B6914" />
      <rect className="bandage b1" x="92" y="60" width="74" height="8" rx="3" fill="#f0f0f0" />
      <rect className="bandage b2" x="92" y="95" width="74" height="8" rx="3" fill="#f0f0f0" />
      <rect className="bandage b3" x="92" y="130" width="74" height="8" rx="3" fill="#f0f0f0" />
      <text x="210" y="68" fontSize="22" fill="#FF3333">❌</text>
      <text x="210" y="90" fontSize="10" fill="#666" fontFamily="Barlow Condensed,sans-serif">DON'T</text>
      <text x="210" y="104" fontSize="10" fill="#666" fontFamily="Barlow Condensed,sans-serif">STRAIGHTEN</text>
      <text x="210" y="145" fontSize="22" fill="#00FF88">✅</text>
      <text x="210" y="168" fontSize="10" fill="#888" fontFamily="Barlow Condensed,sans-serif">SPLINT &amp; WRAP</text>
    </svg>
  );
}

const CARDS = [
  { Svg: CPRSvg, title: 'CPR — Heart Stopped', steps: [
    'Lay on back on flat ground', 'Tilt head back, lift chin — open airway',
    'Pinch nose, give 2 slow breaths', 'Push chest hard × 30 (center)',
    'Repeat: 2 breaths + 30 pushes',
  ]},
  { Svg: BleedingSvg, title: 'Stop Heavy Bleeding', steps: [
    'Press hard with clean cloth', 'Do NOT remove — add more on top',
    'Elevate limb above heart', 'Keep pressing 10 minutes minimum',
    'If arm/leg: tie cloth above wound',
  ]},
  { Svg: BurnsSvg, title: 'Treat Burns', steps: [
    'Cool with running water — 20 min', 'No butter, toothpaste, or ice',
    'Cover loosely with clean cloth', 'Do NOT pop blisters',
    'Medical help if larger than palm',
  ]},
  { Svg: BoneSvg, title: 'Broken Bone', steps: [
    'Do NOT straighten the bone', 'Splint with sticks on both sides',
    'Tie gently — not too tight', 'Check fingers/toes every 10 min',
    'Keep still, keep warm',
  ]},
];

function AnimCard({ Svg, title, steps }) {
  const [key, setKey] = useState(0);
  const active = useStepCycle(steps.length);
  return (
    <div className="surv-card anim-card">
      <div key={key}><Svg /></div>
      <div className="surv-card-title">{title}</div>
      <ol className="surv-steps">
        {steps.map((s, j) => (
          <li key={j} className={j === active ? 'step-active' : ''}>
            <span className="step-num">{j + 1}</span><span>{s}</span>
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="replay-btn" onClick={() => setKey(k => k + 1)}>▶ REPLAY</button>
        <div className="offline-badge">🟢 WORKS OFFLINE</div>
      </div>
    </div>
  );
}

export default function AnimatedFirstAid({ onSpeak }) {
  return (
    <div className="survival-grid">
      {CARDS.map((c, i) => <AnimCard key={i} {...c} />)}
    </div>
  );
}
