const APP_VERSION='1.1.4';
const $=id=>document.getElementById(id);
$('appVersion').textContent='v'+APP_VERSION;
let selectedTemplateId=localStorage.getItem('ss_selected_template')||'classic-yellow-3';
const templates=window.PHOTO_TEMPLATES;
const selected=()=>templates.find(t=>t.id===selectedTemplateId)||templates[0];
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo({top:0,behavior:'smooth'})}
function makeCard(t){
 const el=document.createElement('button');el.type='button';el.className='template-card'+(t.id===selectedTemplateId?' selected':'');el.setAttribute('aria-pressed',String(t.id===selectedTemplateId));
 const thumb=document.createElement('div');thumb.className='thumb';const c=document.createElement('canvas');c.width=300;c.height=500;drawTemplate(c,t,true);thumb.appendChild(c);
 const title=document.createElement('strong');title.textContent=t.name;const meta=document.createElement('small');meta.textContent=t.count+' foto · '+(t.ratio==='strip'?'Photostrip':'Kolase');const tag=document.createElement('span');tag.className='tag';tag.textContent=t.label;
 el.append(thumb,title,meta,document.createElement('br'),tag);el.addEventListener('click',()=>{selectedTemplateId=t.id;localStorage.setItem('ss_selected_template',t.id);renderTemplates()});return el;
}
function renderTemplates(){const grid=$('templateGrid');grid.replaceChildren(...templates.map(makeCard));$('previewBtn').disabled=!selectedTemplateId}
function drawTemplate(canvas,t,thumb=false){
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);c.fillStyle=t.bg;c.fillRect(0,0,w,h);
 c.strokeStyle=t.accent;c.lineWidth=Math.max(3,w*.012);c.strokeRect(w*.025,h*.015,w*.95,h*.97);
 c.textAlign='center';c.fillStyle=t.accent;c.font=`900 ${Math.round(w*.085)}px system-ui`;c.fillText('SEBLAK STORY',w/2,h*.095);
 c.font=`bold ${Math.round(w*.027)}px system-ui`;c.fillText('SETIAP MANGKOK PUNYA CERITA',w/2,h*.13);
 for(const s of t.slots){const x=s.x*w,y=s.y*h,sw=s.w*w,sh=s.h*h;c.fillStyle=t.style==='mono'?'#bcbcbc':'#ffffff';c.fillRect(x,y,sw,sh);c.strokeStyle=t.accent;c.lineWidth=Math.max(2,w*.006);c.strokeRect(x,y,sw,sh);c.fillStyle='#777';c.textAlign='center';c.font=`bold ${Math.round(w*.035)}px system-ui`;c.fillText('FOTO '+(t.slots.indexOf(s)+1),x+sw/2,y+sh/2+Math.round(w*.012))}
 c.fillStyle=t.accent;c.textAlign='center';c.font=`bold ${Math.round(w*.032)}px system-ui`;c.fillText('MOMEN SERU BERSAMA KAMI',w/2,h*.94);
 if(t.style==='sweet'){c.font=`${Math.round(w*.05)}px system-ui`;c.fillText('♥  ♥  ♥',w/2,h*.175)}
 if(t.style==='retro'){c.font=`bold ${Math.round(w*.028)}px system-ui`;c.fillText('GOOD TIMES · FILM CLUB',w/2,h*.17)}
 if(t.style==='special'){c.font=`${Math.round(w*.045)}px system-ui`;c.fillText('🌶',w*.88,h*.10)}
}
function openPreview(){const t=selected();$('previewTitle').textContent=t.name;$('detailName').textContent=t.name;$('detailDescription').textContent=t.description;$('detailSpecs').innerHTML=`<li><b>Jumlah foto:</b> ${t.count}</li><li><b>Format:</b> Photostrip vertikal</li><li><b>Warna dasar:</b> ${t.bg}</li><li><b>Ukuran master:</b> 1200 px lebar</li>`;drawTemplate($('templatePreview'),t);showScreen('preview')}
$('startBtn').onclick=()=>{renderTemplates();showScreen('templates')};
$('homeBtn').onclick=()=>showScreen('home');
$('previewBtn').onclick=openPreview;
$('backTemplates').onclick=()=>showScreen('templates');
$('continueBtn').onclick=()=>{$('chosenName').textContent=selected().name;showScreen('cameraNext')};
$('returnHome').onclick=()=>showScreen('home');
renderTemplates();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {
        updateViaCache: 'none'
      });
      await registration.update();
    } catch (error) {
      console.warn('Service worker:', error);
    }
  });
}
