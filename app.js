const HABITS=[['reading','📚','Read — max 15 min'],['training','🏋️','Train / move'],['building','💻','Build something useful'],['finance','💰','Track money'],['reflection','🧠','Reflect'],['sleep','😴','Protect sleep']];
const KEY='personalGrowthData';
const data=JSON.parse(localStorage.getItem(KEY)||'{"days":{},"journals":{}}');
const start=new Date('2026-09-26T00:00:00');
const checkpoint=new Date('2027-03-26T00:00:00');
const end=new Date('2031-09-26T00:00:00');
const now=new Date();
const todayKey=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
const day=Math.max(1,Math.floor((now-start)/86400000)+1);
const $=id=>document.getElementById(id);
$('today').textContent=now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
$('dayCount').textContent=day;$('journeyLabel').textContent=`Day ${day}`;
const sixPct=Math.max(0,Math.min(100,((now-start)/(checkpoint-start))*100));
const fivePct=Math.max(0,Math.min(100,((now-start)/(end-start))*100));
$('sixMonthBar').style.width=sixPct+'%';$('fiveYearBar').style.width=fivePct+'%';

const habitsEl=$('habits');
function render(){
 const checks=data.days[todayKey]||{};habitsEl.innerHTML='';
 HABITS.forEach(([id,icon,label])=>{const el=document.createElement('div');el.className='habit '+(checks[id]?'done':'');el.innerHTML=`<span>${icon} &nbsp;${label}</span><span class="check"></span>`;el.onclick=()=>{data.days[todayKey]??={};data.days[todayKey][id]=!data.days[todayKey][id];save();};habitsEl.appendChild(el)});
 const done=HABITS.filter(x=>checks[x[0]]).length;const pct=Math.round(done/HABITS.length*100);$('progressText').textContent=pct+'%';$('progressBar').style.width=pct+'%';
 const checkins=Object.keys(data.days).filter(k=>Object.values(data.days[k]||{}).some(Boolean)).length;$('checkinCount').textContent=checkins;$('journalCount').textContent=Object.keys(data.journals).length;$('consistency').textContent=Math.min(100,Math.round(checkins/Math.max(1,day)*100))+'%';
 renderHistory();
}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function loadJournal(){const j=data.journals[todayKey]||{};['did','learned','wrong','tomorrow'].forEach(id=>$(id).value=j[id]||'')}
function renderHistory(){const entries=Object.keys(data.journals).sort().reverse();$('logCount').textContent=`${entries.length} ${entries.length===1?'entry':'entries'}`;const box=$('history');box.innerHTML='';if(!entries.length){box.innerHTML='<div class="empty">Your first entry will appear here.</div>';return}entries.slice(0,7).forEach(k=>{const j=data.journals[k];const item=document.createElement('article');item.className='history-item';item.innerHTML=`<div><b>${new Date(k+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</b><span>${j.did||'No activity note.'}</span></div><button data-date="${k}">Open</button>`;item.querySelector('button').onclick=()=>{loadEntry(k)};box.appendChild(item)})}
function loadEntry(k){const j=data.journals[k]||{};['did','learned','wrong','tomorrow'].forEach(id=>$(id).value=j[id]||'');$('saveStatus').textContent=`Viewing ${k}`;window.scrollTo({top:$('did').getBoundingClientRect().top+window.scrollY-100,behavior:'smooth'})}
$('saveJournal').onclick=()=>{data.journals[todayKey]={did:$('did').value.trim(),learned:$('learned').value.trim(),wrong:$('wrong').value.trim(),tomorrow:$('tomorrow').value.trim()};save();$('saveStatus').textContent='Saved locally · '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});setTimeout(()=>$('saveStatus').textContent='',2500)};
$('clearJournal').onclick=()=>{['did','learned','wrong','tomorrow'].forEach(id=>$(id).value='');$('saveStatus').textContent='Form cleared'};
loadJournal();render();
