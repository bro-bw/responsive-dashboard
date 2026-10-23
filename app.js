'use strict';
const metrics = [
 {label:'营业收入',value:1286500,kind:'money',change:12.8,icon:'M3 7h18v13H3z M3 7l4-4h10l4 4 M8 12h8 M12 10v7'},
 {label:'订单总量',value:8462,kind:'number',change:8.2,icon:'M6 3h12v18H6z M9 8h6 M9 12h6 M9 16h3'},
 {label:'活跃用户',value:24680,kind:'number',change:16.4,icon:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M18 8a3 3 0 0 1 0 6 M22 21v-2a4 4 0 0 0-3-3.87'},
 {label:'订单转化率',value:4.86,kind:'percent',change:1.6,icon:'M4 17l6-6 4 4 6-10 M14 5h6v6'},
 {label:'平均客单价',value:152,kind:'money',change:4.3,icon:'M3 5h2l3 12h11l2-9H6 M9 21h.01 M18 21h.01'},
 {label:'退款率',value:1.24,kind:'percent',change:-0.3,icon:'M4 10a8 8 0 1 1 1 9 M4 4v6h6'}
];
const periods={week:{factor:.24,label:'近 7 天',series:[16,21,18,29,26,34]},month:{factor:1,label:'近 30 天',series:[15,22,18,32,29,43]},quarter:{factor:2.86,label:'近 90 天',series:[65,78,70,96,105,132]}};
const number=new Intl.NumberFormat('zh-CN');
function render(period){
 const current=periods[period];
 document.querySelector('#metrics').innerHTML=metrics.map((item,index)=>{
 const raw=item.kind==='percent'||index===4?item.value:item.value*current.factor;
 const value=item.kind==='money'?'¥'+number.format(Math.round(raw)):item.kind==='percent'?raw.toFixed(2)+'%':number.format(Math.round(raw));
 return `<section class="metric" aria-labelledby="metric-${index}"><div class="metric-head"><h2 id="metric-${index}">${item.label}</h2><span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${item.icon}"/></svg></span></div><p class="value">${value}</p><p class="comparison"><span class="delta">${item.change>0?'↗':'↘'} ${Math.abs(item.change).toFixed(1)}${item.kind==='percent'?' 个百分点':'%'}</span>较上一周期</p></section>`;
 }).join('');
 const values=current.series,max=Math.ceil(Math.max(...values)/10)*10;
 const points=values.map((v,i)=>`${40+i*96},${150-v/max*130}`).join(' ');
 document.querySelector('#chart').innerHTML=`<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="chart-title chart-description"><title id="chart-title">${current.label}收入走势</title><desc id="chart-description">六个区间的收入依次为 ${values.join('、')} 万元。</desc>${[0,.5,1].map(t=>`<line x1="40" y1="${150-t*130}" x2="520" y2="${150-t*130}" stroke="var(--line)"/><text x="30" y="${154-t*130}" text-anchor="end" fill="var(--muted)" font-size="10">${Math.round(max*t)}</text>`).join('')}<polygon points="40,150 ${points} 520,150" fill="currentColor" opacity=".08"/><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>${values.map((v,i)=>`<circle cx="${40+i*96}" cy="${150-v/max*130}" r="4" fill="var(--surface)" stroke="currentColor" stroke-width="2"/><text x="${40+i*96}" y="178" text-anchor="middle" fill="var(--muted)" font-size="10">区间 ${i+1}</text>`).join('')}</svg>`;
 document.querySelector('#updated').textContent=`${current.label} · 演示数据已更新`;
 document.querySelectorAll('[data-period]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.period===period)));
}
document.querySelector('#channels').innerHTML=[['自然搜索',42],['直接访问',28],['社交媒体',18],['其他渠道',12]].map(([label,share],i)=>`<div class="channel-row"><div class="channel-label"><span>${label}</span><span>${share}%</span></div><div class="track"><div class="fill" style="width:${share}%;opacity:${1-i*.18}"></div></div></div>`).join('');
document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>render(button.dataset.period)));
const themeButton=document.querySelector('#theme-toggle');
function setTheme(theme){document.documentElement.dataset.theme=theme;themeButton.textContent=theme==='dark'?'切换浅色':'切换深色';themeButton.setAttribute('aria-pressed',String(theme==='dark'));}
try{setTheme(localStorage.getItem('pulse-theme')==='dark'?'dark':'light');}catch{setTheme('light');}
themeButton.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('pulse-theme',theme);}catch{/* 本地存储不可用时仍可切换当前页面主题。 */}});
render('month');

