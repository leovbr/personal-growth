const HABITS=[['reading','📚','Read — max 15 min'],['training','🏋️','Train / move'],['building','💻','Build something useful'],['finance','💰','Track money'],['reflection','🧠','Reflect'],['sleep','😴','Protect sleep']];
const KEY='personalGrowthData';
const data=JSON.parse(localStorage.getItem(KEY)||'{"days":{},"journals":{}}');
const todayKey=new Date().toISOString().slice(0,10);
const today=new Date();
const start=new Date('2026-09-26T00:00:00');
const day=Math.max(1,Math.floor((today-start)/86400000)+1);

document.getElementById('today').textContent=today.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
document.getElementById('dayCount').textContent=day;

const habitsEl=document.getElementById('habits');
function render(){
 const checks=data.days[todayKey]||{};
 habitsEl.innerHTML='';
 HABITS.forEach(([id,icon,label])=>{const el=document.createElement('div');el.className='habit '+(checks[id]?'done':'');el.innerHTML=`<span>${icon} &nbsp;${label}</span><span class="check"></span>`;el.onclick=()=>{data.days[todayKey]??={};data.days[todayKey][id]=!data.days[todayKey][id];save();render()};habitsEl.appendChild(el)});
 const done=HABITS.filter(x=>checks[x[0]]).length;const pct=Math.round(done/HABITS.length*100);document.getElementById('progressText').textContent=pct+'%';document.getElementById('progressBar').style.width=pct+'%';
 const checkins=Object.keys(data.days).filter(k=>Object.values(data.days[k]||{}).some(Boolean)).length;document.getElementById('checkinCount').textContent=checkins;document.getElementById('journalCount').textContent=Object.keys(data.journals).length;document.getElementById('consistency').textContent=Math.min(100,Math.round(checkins/Math.max(1,day)*100))+'%';
}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
const journal=data.journals[todayKey]||{};['did','learned','wrong','tomorrow'].forEach(id=>document.getElementById(id).value=journal[id]||'');
document.getElementById('saveJournal').onclick=()=>{data.journals[todayKey]={did:document.getElementById('did').value,learned:document.getElementById('learned').value,wrong:document.getElementById('wrong').value,tomorrow:document.getElementById('tomorrow').value};save();document.getElementById('saveStatus').textContent='Saved locally · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});setTimeout(()=>document.getElementById('saveStatus').textContent='',2500)};
render();
