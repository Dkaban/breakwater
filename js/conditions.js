// Conditions snapshot and modelled wave gauge.
function compass(x){if(x==null||!Number.isFinite(x))return '—';return ['N','NE','E','SE','S','SW','W','NW'][Math.round(x/45)%8]}
function renderConditions(i,wi){
 const h=marine.hourly,w=weather.hourly;
 const wave=h.wave_height?.[i],swell=h.swell_wave_height?.[i],period=h.swell_wave_period?.[i],direction=h.swell_wave_direction?.[i];
 const wind=w.wind_speed_10m?.[wi],windDir=w.wind_direction_10m?.[wi],gusts=w.wind_gusts_10m?.[wi];
 $('conditions-time').textContent=h.time[i].replace('T',' ')+' · '+(marine.timezone_abbreviation||marine.timezone||'local');
 $('c-wave').textContent=measure(wave);
 $('c-swell').textContent=measure(swell);
 $('c-period').textContent=period==null?'—':period.toFixed(0)+' sec';
 $('c-direction').textContent=compass(direction);
 $('c-wind').textContent=wind==null?'—':Math.round(wind)+' km/h';
 $('c-wind-dir').textContent=compass(windDir);
 $('c-gusts').textContent=gusts==null?'—':Math.round(gusts)+' km/h';
 $('c-tide').textContent='Not available';
 const hasData=wave!=null&&period!=null&&wind!=null;
 let verdict='Forecast available',desc='These are offshore model estimates. Local bathymetry and tide conditions may change the actual surf.';
 if(!hasData){verdict='Limited data';desc='Not enough wave, swell and wind forecast data to estimate surf quality at this location.'}
 else if(wind>=35){verdict='Windy conditions';desc='Strong winds may make the surf choppy and difficult. Local shoreline orientation matters.'}
 else if(wave<.45){verdict='Small surf';desc='The offshore model shows relatively small waves. Check local observations for rideable breaks.'}
 else if(wave>=3.5){verdict='Powerful swell';desc='Large offshore waves are forecast. Breaking surf can be much bigger and dangerous, especially near reefs and canyons.'}
 else if(period>=10&&wind<=15){verdict='Promising swell';desc='A longer-period swell with relatively light wind. Actual surf quality depends on the break, wind direction and tide.'}
 else if(wind<=22){verdict='Potentially surfable';desc='There may be rideable waves, but this forecast cannot confirm local breaking conditions.'}
 else{verdict='Mixed conditions';desc='Moderate wind could affect wave shape. Check local wind exposure and break-specific forecasts.'}
 if(spot.name==='Nazaré')desc+=' Nazaré canyon amplification is not captured by this offshore wave-height value.';
 $('surf-verdict').textContent=verdict;$('surf-description').textContent=desc;
 const max=10,clamped=Math.max(0,Math.min(max,Number.isFinite(wave)?wave:0)),top=200-180*clamped/max;
 const y=top.toFixed(1),waterH=(200-top).toFixed(1);
 const lines=[0,2,4,6,8,10].map(v=>{const yy=200-18*v;return `<line x1="25" y1="${yy}" x2="33" y2="${yy}" stroke="#89b4c1"/><text x="20" y="${yy+4}" text-anchor="end" font-size="10" fill="#99b9c3">${imperial?(v*3.28084).toFixed(0):v}</text>`}).join('');
 $('gauge').innerHTML=`<defs><clipPath id="gauge-clip"><rect x="36" y="12" width="78" height="194" rx="10"/></clipPath></defs><rect x="36" y="12" width="78" height="194" rx="10" fill="#0a2732" stroke="#386171" stroke-width="2"/>${lines}<g clip-path="url(#gauge-clip)"><rect x="37" y="${y}" width="76" height="${waterH}" fill="#2c8caa"/><path d="M37 ${y} Q46 ${top-5} 55 ${y} T73 ${y} T91 ${y} T113 ${y}" fill="none" stroke="#80ddea" stroke-width="3"/></g><text x="75" y="226" text-anchor="middle" fill="#b0c5cc" font-size="11">${imperial?'feet':'metres'}</text>`;
 $('gauge').setAttribute('aria-label','Modelled wave height '+measure(wave)+' on a gauge scaled 0 to '+(imperial?'33 feet':'10 metres'));
}
