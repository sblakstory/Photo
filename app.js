'use strict';
const APP_VERSION='1.2.0';
const $=id=>document.getElementById(id);
const state={stream:null,devices:[],facing:'user',selectedDevice:'',photos:[],timer:null,busy:false};

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
  window.scrollTo(0,0);
}
function getTemplates(){return Array.isArray(window.PHOTO_TEMPLATES)?window.PHOTO_TEMPLATES:[];}
function selectedTemplate(){
  const id=localStorage.getItem('ss_selected_template')||'classic-yellow-3';
  return getTemplates().find(t=>t.id===id)||getTemplates()[0]||null;
}
function drawTemplate(canvas,t,photos=[]){
  if(!canvas||!t)return;
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  c.fillStyle=t.bg||'#fff';c.fillRect(0,0,w,h);
  c.strokeStyle=t.accent||'#171717';c.lineWidth=14;c.strokeRect(25,20,w-50,h-40);
  c.textAlign='center';c.fillStyle=t.accent||'#171717';
  c.font=`900 ${Math.round(w*.085)}px system-ui`;c.fillText('SEBLAK STORY',w/2,h*.095);
  c.font=`bold ${Math.round(w*.027)}px system-ui`;c.fillText('SETIAP MANGKOK PUNYA CERITA',w/2,h*.13);
  (t.slots||[]).forEach((s,i)=>{
    const x=s.x*w,y=s.y*h,sw=s.w*w,sh=s.h*h;
    c.fillStyle='#fff';c.fillRect(x,y,sw,sh);
    if(photos[i]){
      const img=photos[i],scale=Math.max(sw/img.width,sh/img.height);
      const dw=img.width*scale,dh=img.height*scale;
      c.save();c.beginPath();c.rect(x,y,sw,sh);c.clip();
      c.drawImage(img,x+(sw-dw)/2,y+(sh-dh)/2,dw,dh);c.restore();
    }else{
      c.fillStyle='#777';c.font=`bold ${Math.round(w*.035)}px system-ui`;c.fillText(`FOTO ${i+1}`,x+sw/2,y+sh/2);
    }
    c.strokeStyle=t.accent||'#171717';c.lineWidth=7;c.strokeRect(x,y,sw,sh);
  });
  c.fillStyle=t.accent||'#171717';c.font=`bold ${Math.round(w*.032)}px system-ui`;
  c.fillText('MOMEN SERU BERSAMA KAMI',w/2,h*.94);
  if(t.style==='sweet'){c.font=`${Math.round(w*.05)}px system-ui`;c.fillText('♥  ♥  ♥',w/2,h*.175);}
  if(t.style==='retro'){c.font=`bold ${Math.round(w*.028)}px system-ui`;c.fillText('GOOD TIMES · FILM CLUB',w/2,h*.17);}
}
function renderTemplates(){
  const grid=$('templateGrid');if(!grid)return;
  grid.replaceChildren();
  getTemplates().forEach(t=>{
    const card=document.createElement('button');card.type='button';card.className='template-card';
    card.classList.toggle('selected',t.id===(localStorage.getItem('ss_selected_template')||'classic-yellow-3'));
    const thumb=document.createElement('div');thumb.className='thumb';
    const cv=document.createElement('canvas');cv.width=300;cv.height=500;drawTemplate(cv,t);thumb.append(cv);
    const title=document.createElement('strong');title.textContent=t.name;
    const meta=document.createElement('small');meta.textContent=`${t.count} foto · Photostrip`;
    const tag=document.createElement('span');tag.className='tag';tag.textContent=t.label||'';
    card.append(thumb,title,meta,tag);
    card.addEventListener('click',()=>{localStorage.setItem('ss_selected_template',t.id);renderTemplates();});
    grid.append(card);
  });
  $('previewBtn').disabled=!selectedTemplate();
}
function previewTemplate(){
  const t=selectedTemplate();if(!t)return;
  $('previewTitle').textContent=t.name;$('detailName').textContent=t.name;
  $('detailDescription').textContent=t.description||'';
  $('detailSpecs').replaceChildren();
  [`Jumlah foto: ${t.count}`,'Format: Photostrip vertikal',`Warna dasar: ${t.bg}`,'Resolusi hasil: 1200 × 2700 px'].forEach(v=>{
    const li=document.createElement('li');li.textContent=v;$('detailSpecs').append(li);
  });
  drawTemplate($('templatePreview'),t);showScreen('preview');
}
function setStatus(message){$('cameraStatus').textContent=message;}
function stopCamera(){
  if(state.stream){state.stream.getTracks().forEach(track=>track.stop());state.stream=null;}
  $('cameraVideo').srcObject=null;
}
async function listCameras(){
  if(!navigator.mediaDevices?.enumerateDevices)return;
  try{
    state.devices=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput');
    const select=$('cameraSelect'),old=state.selectedDevice;
    select.replaceChildren();
    state.devices.forEach((d,i)=>{
      const o=document.createElement('option');o.value=d.deviceId;o.textContent=d.label||`Kamera ${i+1}`;select.append(o);
    });
    if(old&&state.devices.some(d=>d.deviceId===old))select.value=old;
    else if(state.devices.length)select.selectedIndex=0;
  }catch(e){console.warn('Daftar kamera tidak tersedia',e);}
}
async function startCamera(deviceId=''){
  if(!navigator.mediaDevices?.getUserMedia){
    setStatus('Browser tidak mendukung kamera atau situs belum memakai HTTPS. Buka melalui Chrome/GitHub Pages HTTPS.');
    return false;
  }
  stopCamera();
  setStatus('Meminta izin kamera…');
  const video=$('cameraVideo');
  const constraints={audio:false,video:deviceId?{deviceId:{exact:deviceId},width:{ideal:1920},height:{ideal:1080}}:{facingMode:{ideal:state.facing},width:{ideal:1920},height:{ideal:1080}}};
  try{
    const stream=await navigator.mediaDevices.getUserMedia(constraints);
    state.stream=stream;video.srcObject=stream;
    await new Promise((resolve,reject)=>{
      if(video.readyState>=1)return resolve();
      video.onloadedmetadata=()=>resolve();
      video.onerror=()=>reject(new Error('Video kamera gagal dimuat'));
      setTimeout(()=>reject(new Error('Kamera tidak merespons. Coba lagi.')),10000);
    });
    await video.play();
    const track=stream.getVideoTracks()[0];
    state.selectedDevice=track.getSettings().deviceId||deviceId||'';
    $('cameraPlaceholder').hidden=true;
    $('captureBtn').disabled=false;$('switchCamera').disabled=false;
    setStatus(`Kamera aktif${track.label?': '+track.label:''}. Siap mengambil foto.`);
    await listCameras();
    return true;
  }catch(err){
    console.error('[Photobooth camera]',err);
    let msg='Kamera gagal dibuka.';
    if(err.name==='NotAllowedError'||err.name==='PermissionDeniedError')msg='Izin kamera ditolak. Izinkan kamera untuk situs ini melalui pengaturan Chrome, lalu coba lagi.';
    else if(err.name==='NotFoundError'||err.name==='DevicesNotFoundError')msg='Kamera tidak ditemukan pada perangkat.';
    else if(err.name==='NotReadableError'||err.name==='TrackStartError')msg='Kamera sedang dipakai aplikasi lain. Tutup aplikasi kamera lain lalu coba lagi.';
    else if(err.name==='OverconstrainedError')msg='Mode kamera tidak tersedia. Coba pilih kamera lain.';
    else if(err.name==='SecurityError')msg='Akses kamera diblokir. Pastikan alamat situs menggunakan HTTPS.';
    else if(err.message)msg=err.message;
    setStatus(msg);$('cameraPlaceholder').hidden=false;$('captureBtn').disabled=true;
    return false;
  }
}
function updateProgress(){
  const t=selectedTemplate(),total=t?.count||3,done=state.photos.length;
  $('captureProgress').textContent=`${done} / ${total} FOTO`;
  $('progressFill').style.width=`${done/total*100}%`;
  $('captureBtn').textContent=done>=total?'LIHAT HASIL FOTO':'AMBIL FOTO '+(done+1);
  $('captureBtn').disabled=!state.stream||state.busy;
  $('retakeBtn').disabled=done===0||state.busy;
}
function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function countdown(){
  const el=$('countdown');el.hidden=false;
  for(let n=3;n>=1;n--){el.textContent=n;await delay(1000);}
  el.textContent='📸';await delay(250);
  el.hidden=true;
}
function captureFrame(){
  const video=$('cameraVideo');
  if(!video.videoWidth||!video.videoHeight)throw new Error('Tunggu sampai gambar kamera tampil.');
  const canvas=document.createElement('canvas');
  canvas.width=video.videoWidth;canvas.height=video.videoHeight;
  const ctx=canvas.getContext('2d');
  // Simpan seperti tampilan preview yang dicerminkan untuk kamera depan.
  if(state.facing==='user'){ctx.translate(canvas.width,0);ctx.scale(-1,1);}
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>{
    if(!blob)return reject(new Error('Gagal menyimpan hasil jepretan.'));
    const url=URL.createObjectURL(blob),img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
    img.onerror=()=>reject(new Error('Gambar hasil jepretan gagal dibaca.'));
    img.src=url;
  },'image/jpeg',0.94));
}
async function takePhoto(){
  const t=selectedTemplate();if(!t)return;
  if(state.photos.length>=t.count){showResult();return;}
  if(!state.stream){setStatus('Aktifkan kamera terlebih dahulu.');return;}
  if(state.busy)return;
  state.busy=true;$('captureBtn').disabled=true;$('retakeBtn').disabled=true;
  try{
    setStatus(`Bersiap untuk foto ${state.photos.length+1} dari ${t.count}…`);
    await countdown();
    const image=await captureFrame();state.photos.push(image);
    setStatus(`Foto ${state.photos.length} tersimpan.`);
    updateProgress();
    if(state.photos.length>=t.count)showResult();
  }catch(e){setStatus(e.message||'Gagal mengambil foto.');}
  finally{state.busy=false;updateProgress();}
}
function showResult(){
  const t=selectedTemplate();if(!t||state.photos.length!==t.count)return;
  drawTemplate($('resultCanvas'),t,state.photos);
  showScreen('result');
  stopCamera();
}
function resetPhotos(){
  state.photos=[];updateProgress();$('saveStatus').textContent='';
}
function downloadResult(){
  const canvas=$('resultCanvas');
  canvas.toBlob(blob=>{
    if(!blob){$('saveStatus').textContent='Gagal membuat file PNG.';return;}
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`Seblak-Story-Photobooth-${Date.now()}.png`;
    document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    $('saveStatus').textContent='File PNG dibuat. Periksa folder Download perangkat.';
  },'image/png');
}
function init(){
  $('appVersion').textContent='v'+APP_VERSION;
  renderTemplates();
  $('startBtn').addEventListener('click',()=>{renderTemplates();showScreen('templates');});
  $('homeBtn').addEventListener('click',()=>showScreen('home'));
  $('previewBtn').addEventListener('click',previewTemplate);
  $('backTemplates').addEventListener('click',()=>showScreen('templates'));
  $('continueBtn').addEventListener('click',async()=>{
    const t=selectedTemplate();if(!t)return;
    resetPhotos();showScreen('cameraNext');
    setStatus('Tekan AKTIFKAN KAMERA untuk memberi izin dan menyalakan kamera.');
    $('cameraPlaceholder').hidden=false;
  });
  $('enableCamera').addEventListener('click',()=>startCamera($('cameraSelect').value));
  $('cameraSelect').addEventListener('change',e=>{state.selectedDevice=e.target.value;});
  $('switchCamera').addEventListener('click',async()=>{
    state.facing=state.facing==='user'?'environment':'user';
    await startCamera('');
  });
  $('captureBtn').addEventListener('click',takePhoto);
  $('retakeBtn').addEventListener('click',()=>{resetPhotos();setStatus('Foto direset. Ambil ulang dari foto pertama.');});
  $('cameraBack').addEventListener('click',()=>{stopCamera();showScreen('preview');});
  $('downloadBtn').addEventListener('click',downloadResult);
  $('resultRetake').addEventListener('click',async()=>{resetPhotos();showScreen('cameraNext');await startCamera('');});
  $('finishBtn').addEventListener('click',()=>{resetPhotos();showScreen('home');});
  window.addEventListener('pagehide',stopCamera);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCamera();});
  updateProgress();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
if('serviceWorker'in navigator){
  window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});await reg.update();}catch(e){console.warn('Service worker:',e);}});
}
