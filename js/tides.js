// Uses Open-Meteo's offshore sea_level_height_msl hourly model data.
// Elevation is relative to global mean sea level, NOT a coastal chart datum.
function resetTides(message='Loading tide forecast…'){
  $('c-tide').textContent='—';
  $('tide-level').textContent='—';
  $('tide-state').textContent=message;
  for(const type of ['high','low']){$('tide-'+type).textContent='—';$('tide-'+type+'-height').textContent='';}
  $('tide-graph').innerHTML='';
  $('tide-note').textContent=message;
}
function isTideNumber(n){return typeof n==='number'&&Number.isFinite(n);}
function tideClock(t){
  if(typeof t!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(t))return '—';
  const hour=+t.slice(11,13);
  return t.slice(5,10)+' · '+(hour%12||12)+t.slice(13,16)+' '+(hour>=12?'PM':'AM');
}
function findTideTurns(levels,start){
  const turns=[];
  for(let i=Math.max(1,start);i<levels.length-1;i++){
    const a=levels[i-1],b=levels[i],c=levels[i+1];
    if(![a,b,c].every(isTideNumber))continue;
    const high=b>=a&&b>=c&&(b>a||b>c);
    const low=b<=a&&b<=c&&(b<a||b<c);
    if(!high&&!low)continue;
    const type=high?'high':'low';
    const previous=turns[turns.length-1];
    if(previous&&previous.type===type&&i-previous.i<=2){
      if(high&&b>previous.height||low&&b<previous.height)turns[turns.length-1]={type,i,height:b};
    }else turns.push({type,i,height:b});
  }
  return turns;
}
function renderTides(start){
  const h=marine?.hourly,levels=h?.sea_level_height_msl,times=h?.time;
  if(!Array.isArray(levels)||!Array.isArray(times)||!levels.some(isTideNumber)){
    resetTides('Tide model unavailable here');
    return;
  }
  const i=Math.max(0,Math.min(start,levels.length-1));
  const value=levels[i],next=levels[i+1],prev=levels[i-1];
  const delta=isTideNumber(next)&&isTideNumber(value)?next-value:isTideNumber(prev)&&isTideNumber(value)?value-prev:null;
  const state=delta===null?'Trend unavailable':delta>0.015?'Rising':delta<-0.015?'Falling':'Near a turn';
  $('tide-level').textContent=isTideNumber(value)?measure(value):'—';
  $('tide-state').textContent=state+' · Relative to mean sea level';
  $('c-tide').textContent=state==='Trend unavailable'?'—':state;
  const turns=findTideTurns(levels,i);
  for(const type of ['high','low']){
    const e=turns.find(t=>t.type===type);
    $('tide-'+type).textContent=e?tideClock(times[e.i]):'Not in forecast';
    $('tide-'+type+'-height').textContent=e?measure(e.height)+' relative to MSL':'';
  }
  drawTideGraph(levels,times,i);
}
function drawTideGraph(levels,times,start){
  const vals=levels.slice(start,start+25),valid=vals.filter(isTideNumber);
  if(valid.length<3){
    $('tide-graph').innerHTML='';
    $('tide-note').textContent='Not enough modelled sea-level data to chart.';
    return;
  }
  const min=Math.min(...valid),max=Math.max(...valid),pad=Math.max(.08,(max-min)*.12);
  const low=min-pad,high=max+pad,W=700,H=220,L=65,R=14,T=18,B=38;
  const x=j=>L+j*(W-L-R)/24;
  const y=v=>T+(high-v)*(H-T-B)/(high-low);
  let svg='';
  for(let k=0;k<=3;k++){
    const v=low+k*(high-low)/3,yy=y(v);
    svg+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="#31515a" stroke-dasharray="4 5"/><text x="1" y="'+(yy+4)+'" fill="#a6c3c8" font-size="12">'+measure(v)+'</text>';
  }
  let segments=[],segment=[];
  vals.forEach((v,j)=>{if(isTideNumber(v))segment.push([j,v]);else{if(segment.length)segments.push(segment);segment=[];}});
  if(segment.length)segments.push(segment);
  for(const points of segments){
    const d=points.map(([j,v],index)=>(index?'L':'M')+x(j).toFixed(1)+' '+y(v).toFixed(1)).join(' ');
    svg+='<path d="'+d+'" fill="none" stroke="#80e8d7" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>';
  }
  if(isTideNumber(vals[0]))svg+='<circle cx="'+x(0)+'" cy="'+y(vals[0])+'" r="5" fill="#d0fff5" stroke="#143742" stroke-width="2"/>';
  for(const j of [0,6,12,18,24]){
    const t=times[start+j];if(t)svg+='<text x="'+x(j)+'" y="'+(H-10)+'" fill="#9fb8bd" text-anchor="middle" font-size="12">'+t.slice(11,16)+'</text>';
  }
  $('tide-graph').innerHTML=svg;
  $('tide-graph').setAttribute('aria-label','24-hour offshore sea-level model chart from '+measure(min)+' to '+measure(max));
  $('tide-note').textContent='Next 24 hours · local time at selected location';
}
