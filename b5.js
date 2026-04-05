const fs = require('fs');

const pt5 = `
// Context State
let currentLang='hi-IN', zoomLevel=1, countdownSec=6*3600;
let _formatted=null, _adapted=null, _activeTab='whatsapp';

// Cursor
const dt=document.getElementById('cursor-dot'), rg=document.getElementById('cursor-ring');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX; my=e.clientY; dt.style.left=mx+'px'; dt.style.top=my+'px';});
(function aR(){rx+=(mx-rx)*.15; ry+=(my-ry)*.15; rg.style.left=rx+'px'; rg.style.top=ry+'px'; requestAnimationFrame(aR);})();
document.addEventListener('mousedown',()=>document.body.classList.add('clicking'));
document.addEventListener('mouseup',()=>document.body.classList.remove('clicking'));

// Rain Canvas
const rc=document.getElementById('rainCanvas'), ctx=rc.getContext('2d');
function rs(){rc.width=window.innerWidth; rc.height=window.innerHeight;} rs(); window.addEventListener('resize',rs);
const dr = Array.from({length:80}, ()=>({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, l:10+Math.random()*15, s:5+Math.random()*7, o:0.08+Math.random()*0.17}));
function rL(){
  ctx.clearRect(0,0,rc.width,rc.height);
  dr.forEach(d=>{
    ctx.beginPath(); ctx.strokeStyle='rgba(180,210,255,'+d.o+')'; ctx.lineWidth=0.6;
    ctx.moveTo(d.x, d.y); ctx.lineTo(d.x-10, d.y+d.l); ctx.stroke();
    d.y+=d.s; d.x-=0.8;
    if(d.y > innerHeight || d.x < 0) { d.y=-d.l; d.x=Math.random()*innerWidth; }
  });
  requestAnimationFrame(rL);
} rL();

// Timer
setInterval(()=>{
  countdownSec = countdownSec<=0 ? 6*3600 : countdownSec-1;
  const h=Math.floor(countdownSec/3600).toString().padStart(2,'0'), m=Math.floor((countdownSec%3600)/60).toString().padStart(2,'0'), s=(countdownSec%60).toString().padStart(2,'0');
  document.getElementById('imp-timer').innerHTML=h+':'+m+':'+s;
},1000);

// Init Community Grid
const cg=document.getElementById('comm-grid');
Object.entries(COMMUNITIES).forEach(([k,v])=>{
  const d=document.createElement('div'); d.className='c-crd'; d.id='cg-'+k;
  d.innerHTML='<div class="c-ico">'+(v.type.includes('coastal')?'🌊':v.type.includes('flood')?'🏞️':'🏙️')+'</div><div><div class="c-nm">'+v.name+'</div><div class="c-ln">'+v.lang+'</div></div>';
  d.onclick=()=>{ document.querySelectorAll('.c-crd').forEach(x=>x.classList.remove('sel')); d.classList.add('sel'); changeGlobalLang(k); };
  cg.appendChild(d);
});
document.getElementById('cg-bihar_flood').classList.add('sel');

// Ticker
const tks = ['🌀 CYCLONE WARNING — Odisha coast', '🌊 FLOOD ALERT — Bihar Ganga above danger', '⛰ LANDSLIDE RISK — Wayanad Kerala', '🌡 HEATWAVE ADVISORY — UP Rajasthan'];
document.getElementById('tkmq').innerHTML = tks.map(t=>'<span class="tk-item">'+t+'</span>').join('') + tks.map(t=>'<span class="tk-item">'+t+'</span>').join('');

// Language Sync
function changeGlobalLang(val) {
   currentLang=COMMUNITIES[val].langCode;
   if(document.getElementById('alert-input').value.trim() && !document.getElementById('trans-btn').disabled) translateAlert();
   const at=document.querySelector('.sv-tb.acc');
   if(at) showSurvTab(at.dataset.c, at);
}
function changeTextSize(dir){
   zoomLevel += dir*0.1;
   if(zoomLevel<0.7)zoomLevel=0.7; if(zoomLevel>1.8)zoomLevel=1.8;
   document.documentElement.style.zoom = zoomLevel.toFixed(2);
}

// Translate
function toggleBtn(){
  const v = document.getElementById('alert-input').value.trim();
  document.getElementById('trans-btn').disabled = !v;
}
function loadDemo(k){ document.getElementById('alert-input').value=DEMOS[k].text; toggleBtn(); }

function stAG(n, st, t) {
  const o=document.getElementById('agn'+n), d=document.getElementById('agd'+n);
  document.getElementById('ag'+n).className='ai-r';
  o.className='ai-orb';
  if(st==='run'){ o.classList.add('run'); d.textContent=t; }
  else if(st==='don'){ o.classList.add('don'); o.textContent='✓'; d.textContent='Complete.'; }
  else { o.textContent=n; d.textContent='Waiting...'; }
}

async function groq(sys,usr,temp=.3,max=500){
  const r=await fetch(GROQ_URL,{method:'POST',headers:{'Authorization':'Bearer '+GROQ_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:max,temperature:temp,messages:[{role:'system',content:sys},{role:'user',content:usr}]})});
  const d=await r.json(); return d.choices[0].message.content.trim();
}

async function translateAlert(){
  const txt=document.getElementById('alert-input').value.trim();
  const sc=document.querySelector('.c-crd.sel');
  const comm = sc ? sc.id.replace('cg-','') : 'bihar_flood';
  if(!txt)return;
  const b=document.getElementById('trans-btn'); b.disabled=true; b.textContent='AI PIPELINE RUNNING...';
  document.getElementById('results').style.display='none';
  document.getElementById('pipeline').style.display='block';
  document.getElementById('ai-msg').textContent='Connecting to Llama3 70B...';
  
  [1,2,3].forEach(n=>stAG(n,'',''));
  try{
    stAG(1,'run','Parsing disaster parameters...');
    document.getElementById('ai-msg').textContent='Teaching AI to speak native...';
    const ext=JSON.parse((await groq('Extract info: {"hazard_type":"","severity":"low|medium|high|critical","alert_level":"","affected_areas":[],"evacuate_immediately":false}',txt,.1)).replace(/\\\`\\\`\\\`json\|\\\`\\\`\\\`/g,'').trim());
    stAG(1,'don'); stAG(2,'run','Applying localized dialect...');
    document.getElementById('ai-msg').textContent='Finding nearest shelters...';
    
    const c=COMMUNITIES[comm];
    const adapted=await groq('Rewrite for '+c.name+' ('+c.lang+'). Shelter: "'+c.shelter+'". Rules: Urgent. Maximum 60 words. Speak natively.',JSON.stringify(ext),.4,200);
    stAG(2,'don'); stAG(3,'run','Splicing outputs...');
    document.getElementById('ai-msg').textContent='Making it human...';
    
    let fmt; try{ const fRaw=await groq('Create 3 unique formats from adapted exact JSON: {"whatsapp":"","sms":"","voice":""}',adapted,.1,500); const st=fRaw.indexOf('{'), en=fRaw.lastIndexOf('}')+1; fmt=JSON.parse(fRaw.substring(st,en)); }catch(e){fmt={whatsapp:adapted,sms:adapted,voice:adapted};}
    stAG(3,'don'); document.getElementById('ai-msg').textContent='DONE.';
    
    setTimeout(()=>{
      document.getElementById('pipeline').style.display='none';
      showRes(ext, adapted, fmt, txt);
      document.getElementById('results').scrollIntoView({behavior:'smooth'});
    }, 600);
  }catch(e){
    console.error(e);
    document.getElementById('ai-msg').textContent='SYSTEM ERROR: '+e.message;
  }finally{
    b.disabled=false; b.textContent='TRANSLATE ALERT';
  }
}

function showRes(ext, adapted, fmt, orig){
  const r=document.getElementById('results'); r.style.display='flex';
  _formatted=fmt; _adapted=adapted;
  const sev=ext.severity||'medium';
  
  const so=document.getElementById('sev-orb'); so.className='sev-3d '+sev;
  document.getElementById('sev-txt').textContent=ext.alert_level?ext.alert_level.substring(0,3).toUpperCase():sev.substring(0,3).toUpperCase();
  document.getElementById('sev-level').textContent=(ext.hazard_type||'ALERT').toUpperCase()+' — '+sev.toUpperCase();
  document.getElementById('sev-areas').textContent=(ext.affected_areas||[]).join(' • ').toUpperCase();
  
  document.getElementById('tmVal').textContent=sev.toUpperCase();
  document.getElementById('tmVal').style.textShadow='0 0 20px var(--'+(sev==='critical'||sev==='high'?'danger':'safe')+')';
  document.getElementById('tmNeedle').style.left = sev==='critical'?'95%':sev==='high'?'72%':sev==='medium'?'45%':'15%';
  
  document.getElementById('before-txt').textContent=orig;
  document.getElementById('after-txt').textContent=adapted;
  
  const acts=ext.evacuate_immediately?[['🏃','RUN NOW'],['👨‍👩‍👧','FAMILY'],['💊','MEDS'],['📄','DOCS'],['🏠','SHELTER']]:[['⛺','SHELTER'],['💧','WATER'],['📻','RADIO'],['📱','BATTERY']];
  document.getElementById('act-strip-r').innerHTML=acts.map(a=>'<div class="act-ic"><span class="ac-em">'+a[0]+'</span><span class="bx-l">'+a[1]+'</span></div>').join('');
  showTab('whatsapp');
}

function showTab(t){
  _activeTab=t; document.getElementById('fmt-content').textContent=(_formatted||{})[t]||_adapted||'';
  document.querySelectorAll('.fm-t').forEach(b=>b.classList.toggle('act',b.textContent.toLowerCase()===t));
}

function speakResult(){
  if(!window.speechSynthesis||!_adapted)return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(_adapted);
  u.lang=currentLang; u.rate=0.82; window.speechSynthesis.speak(u);
}

// Survival
const tbs=document.getElementById('sv-tabs');
Object.keys(SURV_DATA).forEach((k,i)=>{
  const b=document.createElement('div'); b.className='sv-tb'+(i===0?' acc':''); b.textContent=k.replace('_',' '); b.dataset.c=k;
  b.onclick=()=>showSurvTab(k,b); tbs.appendChild(b);
});

async function showSurvTab(c,b){
  document.querySelectorAll('.sv-tb').forEach(x=>x.classList.remove('acc')); b.classList.add('acc');
  const gc=document.getElementById('surv-content');
  if(currentLang.startsWith('en')){ renSurv(c,SURV_DATA[c]||[]); return; }
  if(window._sCache && window._sCache[currentLang] && window._sCache[currentLang][c]){ renSurv(c,window._sCache[currentLang][c]); return; }
  
  gc.innerHTML='<div style="padding:40px;color:var(--amber);text-align:center;font-family:\\'Bebas Neue\\';font-size:24px;">TRANSLATING GUIDE VIA AI...</div>';
  try{
    const ed=SURV_DATA[c]||[];
    const pmt='Translate this JSON to ISO \\''+currentLang+'\\'. Exact JSON array only: '+JSON.stringify(ed.map(d=>({title:d.title,steps:d.steps})));
    const res=await groq(pmt,"JSON array only",0.1,800);
    const tr=JSON.parse(res.replace(/\\\`\\\`\\\`json\|\\\`\\\`\\\`/g,'').trim());
    const fd=ed.map((d,i)=>({ ...d, title:tr[i].title, steps:tr[i].steps }));
    if(!window._sCache)window._sCache={}; if(!window._sCache[currentLang])window._sCache[currentLang]={};
    window._sCache[currentLang][c]=fd; renSurv(c,fd);
  }catch(e){ renSurv(c,SURV_DATA[c]||[]); }
}
function renSurv(c, d){
  document.getElementById('surv-content').innerHTML = d.map((x,i)=>{
    const stp = x.steps.map((s,j)=>'<div class="sv-st"><div class="sv-sn">'+(j+1)+'</div><div class="sv-tx">'+s+'</div></div>').join('');
    return '<div class="sv-crd"><div class="sv-h" onclick="this.parentElement.classList.toggle(\\'op\\')"><div class="sv-ic">'+(x.icon||'⚕️')+'</div><div class="sv-ti">'+x.title+'</div></div><div class="sv-b">'+(x.svg?('<div style="width:100%;height:140px;overflow:hidden;border-radius:4px;margin-bottom:12px;background:var(--base);">'+x.svg+'</div>'):'')+'<div>'+stp+'</div><button class="sunao" onclick="speakGuide(this)"><div class="sw"><b></b><b></b><b></b><b></b><b></b></div>🔊 HEAR GUIDE</button></div></div>';
  }).join('');
}
renSurv('first_aid', SURV_DATA['first_aid']);

function speakGuide(btn){
  if(!window.speechSynthesis)return; window.speechSynthesis.cancel();
  const stps = Array.from(btn.parentElement.querySelectorAll('.sv-tx')).map(x=>x.textContent);
  if(!stps.length)return;
  const u=new SpeechSynthesisUtterance(stps.join('. '));
  u.lang=currentLang; u.rate=0.85; window.speechSynthesis.speak(u);
}
</script>
</body>
</html>
`;
fs.writeFileSync('b5.js', pt5);
