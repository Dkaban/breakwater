// Load the competition schedule and render event filters.
(async function initCalendar(){
 let competitionEvents;
 try {
   const response=await fetch('data/competitions.json');
   if(!response.ok)throw Error('Competition data HTTP '+response.status);
   competitionEvents=await response.json();
   if(!Array.isArray(competitionEvents))throw Error('Competition data has an invalid format');
 } catch(err) {
   document.getElementById('comp-list').textContent='Competition schedule is temporarily unavailable. Refresh to retry.';
   console.error('Breakwater competition calendar:',err);
   return;
 }
 const list=document.getElementById("comp-list"), filterWrap=document.getElementById("comp-filters");
 const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const full=date=>new Date(date+"T12:00:00Z").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"});
 const windowLabel=e=>{
  const a=new Date(e.start+"T12:00:00Z"),b=new Date(e.end+"T12:00:00Z");
  const start=a.toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"});
  return a.getUTCFullYear()===b.getUTCFullYear()? start+" – "+full(e.end) : full(e.start)+" – "+full(e.end);
 };
 const day=date=>Date.parse(date+"T00:00:00Z");
 const today=new Date();
 const todayUtc=Date.UTC(today.getFullYear(),today.getMonth(),today.getDate());
 const active=competitionEvents.filter(e=>day(e.end)>=todayUtc).sort((a,b)=>day(a.start)-day(b.start));
 let category="all";
 function render(){
  const filtered=active.filter(e=>category==="all"||e.category===category);
  if(!filtered.length){list.innerHTML='<p class="comp-empty">No upcoming competitions listed for this category. Check back for future calendar updates.</p>';return}
  list.innerHTML=filtered.map(e=>{
   const isOpen=day(e.start)<=todayUtc, days=Math.round((day(e.start)-todayUtc)/86400000);
   const badge=isOpen?"Window open":days===1?"Tomorrow":days===0?"Opens today":"Upcoming";
   const countdown=isOpen?("Through "+full(e.end)):("Starts in "+days+" day"+(days===1?"":"s"));
   const note=e.conditional?"The contest runs on one day only if conditions are approved. Actual date is not yet confirmed.":"Heat days depend on surf conditions during the listed window.";
   return '<article class="comp-card"><div class="comp-card-top"><span class="comp-type">'+escapeHTML(e.tier)+'</span><span class="comp-badge'+(isOpen?' open':'')+'">'+badge+'</span></div><h3 class="comp-title">'+escapeHTML(e.title)+'</h3><div class="comp-place">⌁ '+escapeHTML(e.place)+'</div><div class="comp-dates"><span class="comp-date">'+windowLabel(e)+'</span><span class="comp-countdown">'+countdown+'</span></div><div class="comp-note">'+note+'</div><a class="comp-link" href="'+escapeHTML(e.url)+'" target="_blank" rel="noopener noreferrer">Event details ↗</a></article>'
  }).join("");
 }
 filterWrap.querySelectorAll("button[data-category]").forEach(button=>button.addEventListener("click",()=>{
  category=button.dataset.category;
  filterWrap.querySelectorAll("button[data-category]").forEach(b=>{const yes=b===button;b.classList.toggle("selected",yes);b.setAttribute("aria-pressed",String(yes))});
  render();
 }));
 render();
})();
