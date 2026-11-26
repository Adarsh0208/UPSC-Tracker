
const $=s=>document.querySelector(s),Q=(a,f)=>a.map(f).join('');
const SY={
"Prelims · GS Paper I":{"History of India & National Movement":"Ancient India: Indus Valley, Vedic age, Mahajanapadas, Mauryas, Guptas, Sangam;Medieval India: Delhi Sultanate, Mughals, Vijayanagara, Bhakti & Sufi, Marathas;Modern India: European advent, 1857 revolt, socio-religious reforms, Moderates & Extremists, Gandhian phase, Partition;Art & Culture",
"Indian & World Geography":"Physical geography: geomorphology, climatology, oceanography;Indian geography: physiography, drainage, climate, soils, vegetation;Economic geography: agriculture, minerals, industries, transport;Human geography & world regions",
"Indian Polity & Governance":"Constitution: Preamble, features, Fundamental Rights, DPSP, Duties;Union & State: Parliament, Executive, Judiciary, Federalism;Panchayati Raj & local government;Constitutional & non-constitutional bodies;Rights issues & public policy",
"Economic & Social Development":"Growth, development & planning;Banking, monetary policy & inflation;Fiscal policy, Budget & taxation;External sector & agriculture;Poverty, inclusion, demographics & social sector",
"Environment & Ecology":"Ecology & ecosystems;Biodiversity & conservation;Climate change & conventions;Pollution & environmental laws",
"General Science":"Physics;Chemistry;Biology & health;Science & technology developments",
"Current Affairs":"National events;International events;Schemes, reports & indices"},
"Prelims · GS Paper II (CSAT)":{"CSAT":"Comprehension;Interpersonal skills incl. communication;Logical reasoning;Analytical ability;Decision-making & problem-solving;General mental ability;Basic numeracy (Class X level);Data interpretation"},
"Mains · Essay":{"Essay":"Philosophical & social themes;Polity, economy & environment themes;Science, technology & international themes;Essay structure & practice"},
"Mains · GS Paper I":{"Indian Heritage & Culture":"Art forms, literature & architecture (ancient to modern)","Modern Indian History":"Mid-18th century to present: events, personalities, issues;Freedom struggle stages & contributors;Post-independence consolidation & reorganisation","World History":"Industrial revolution, world wars, colonisation, decolonisation;Political philosophies: communism, capitalism, socialism","Indian Society":"Salient features, diversity;Women & women's organisations;Population & associated issues, poverty & development;Urbanisation;Globalisation effects;Social empowerment, communalism, regionalism, secularism","Geography":"Physical geography of world;Distribution of key natural resources;Industries location factors;Geophysical phenomena, cyclones, volcanoes;Climate change effects, flora & fauna"},
"Mains · GS Paper II":{"Constitution & Polity":"Indian Constitution: evolution, features, amendments, basic structure;Federal structure, devolution, Centre-State relations;Separation of powers, dispute redressal;Comparison with other constitutions;Parliament & State Legislatures;Executive & Judiciary;Ministries & departments, pressure groups;Representation of People's Act;Constitutional posts & bodies;Statutory & quasi-judicial bodies","Governance":"Government policies & interventions;Development processes, NGOs, SHGs;Welfare schemes for vulnerable sections;Health, education, human resources;Poverty & hunger;E-governance, citizens' charters, transparency, accountability","International Relations":"India & neighbours;Bilateral, regional, global groupings;Effect of policies of developed countries on India;Indian diaspora;International institutions & forums"},
"Mains · GS Paper III":{"Economy":"Indian economy: planning, resource mobilisation, growth, employment;Inclusive growth;Government budgeting;Infrastructure","Agriculture":"Cropping patterns, irrigation, storage, marketing;Subsidies, MSP, PDS, food security;Land reforms;Food processing","Science & Technology":"Developments & applications;Indigenisation of technology;IT, space, computers, robotics, nano-tech, biotech;IPR","Environment & Disaster Management":"Conservation, pollution, degradation, EIA;Disaster & disaster management","Internal Security":"Extremism & development link;Border areas & organised crime;Cyber security, money laundering;Security forces & mandate"},
"Mains · GS Paper IV":{"Ethics, Integrity & Aptitude":"Ethics & human interface: essence, determinants, consequences;Dimensions of ethics, ethics in private & public relationships;Human values: lessons from leaders, role of family, society, education;Attitude: content, structure, function, influence, persuasion;Aptitude & foundational values for civil service;Emotional intelligence in administration;Moral thinkers: Indian & world;Public/civil service values & ethics in public administration;Probity in governance, corruption, RTI, citizen's charters;Case studies"},
"Mains · Optional Paper I":{"Optional subject (add your topics)":""},
"Mains · Optional Paper II":{"Optional subject (add your topics)":""},
"Mains · Indian Language (qualifying)":{"Language paper":"Comprehension;Precis writing;Usage & vocabulary;Short essay;Translation (to & from English);Grammar"},
"Mains · English (qualifying)":{"English paper":"Comprehension;Precis writing;Usage & vocabulary;Short essay;Grammar"}};
const ST=['Not Started','In Progress','Completed'],MAP={'Currently Studying':'In Progress','Revision Required':'Completed','Fully Revised':'Completed'},IV=[1,3,7,15,30],DONE=s=>s=='Completed';
const ymd=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},today=()=>ymd(Date.now()),add=(s,n)=>{const d=new Date(s+'T00:00');d.setDate(d.getDate()+n);return ymd(d)},diff=(a,b)=>Math.round((new Date(a+'T00:00')-new Date(b+'T00:00'))/864e5);
let S,view='dash',db,ALL=[];
const DEF=()=>({sessions:[],topics:{},revs:[],mocks:[],custom:[],hist:{},timer:null,tsel:{},lastPlan:null,dark:0,set:{daily:8,min:2,weekly:40,exam:'2027-05-24',mains:'',cd:'prelims',w:[30,20,20,15,15],iv:[1,3,7,15,30],pw:25,pb:5,lb:15,cyc:4,autob:1,accent:'teal',fs:'md',share:{weekly:0,consistency:0,syllabus:0,revision:0}}});
function buildAll(){ALL=[];for(const p in SY)for(const u in SY[p]){(SY[p][u]?SY[p][u].split(';'):[]).forEach((n,i)=>ALL.push({id:p+'|'+u+'|'+i,p,u,n}));S.custom.filter(c=>c.p==p&&c.u==u).forEach(c=>ALL.push(c))}S.custom.filter(c=>!SY[c.p]||!(c.u in SY[c.p])).forEach(c=>ALL.push(c))}
const T=id=>S.topics[id]||(S.topics[id]={st:ST[0],notes:'',ref:'',hrs:0,target:'',done:'',rev:0,pri:'Medium',est:0,hard:false,bl:''});
const hrs=ms=>ms/36e5,fh=h=>h.toFixed(1)+'h';
const dayH=d=>S.sessions.filter(x=>x.date==d).reduce((a,x)=>a+hrs(x.study),0);
const rangeH=n=>{let t=0;for(let i=0;i<n;i++)t+=dayH(add(today(),-i));return t};
const monthH=()=>S.sessions.filter(x=>x.date.slice(0,7)==today().slice(0,7)).reduce((a,x)=>a+hrs(x.study),0);
function weekH(){const d=new Date().getDay();return rangeH((d+6)%7+1)}
function streaks(){const m=S.set.min,ds=[...new Set(S.sessions.map(x=>x.date))].filter(d=>dayH(d)>=m).sort();let best=0,run=0,prev=null;ds.forEach(d=>{run=prev&&diff(d,prev)==1?run+1:1;best=Math.max(best,run);prev=d});let c=0,d=dayH(today())>=m?today():add(today(),-1);while(dayH(d)>=m){c++;d=add(d,-1)}return{cur:c,best,active:new Set(S.sessions.map(x=>x.date)).size,ds}}
function pct(f){const l=ALL.filter(f);return l.length?100*l.filter(t=>DONE(T(t.id).st)).length/l.length:0}
function revStats(){const t=today(),r=S.revs;return{done:r.filter(x=>x.done).length,due:r.filter(x=>!x.done&&x.due==t),over:r.filter(x=>!x.done&&x.due<t),up:r.filter(x=>!x.done&&x.due>t)}}
function mockPct(k){const m=S.mocks.filter(x=>x.k==k);return m.length?100*m.reduce((a,x)=>a+x.s/x.max,0)/m.length:0}
function ready(){const w=S.set.w,rs=revStats(),den=rs.done+rs.over.length+rs.due.length,t=today();let met=0;for(let i=0;i<30;i++)if(dayH(add(t,-i))>=S.set.min)met++;
const c=[pct(()=>1),den?100*rs.done/den:0,mockPct('P'),mockPct('M'),100*met/30],sum=w.reduce((a,b)=>a+b,0)||1;return{c,score:c.reduce((a,x,i)=>a+x*w[i],0)/sum}}
const NM=['Syllabus completion','Revision progress','Prelims mocks','Mains answer-writing','Study consistency'];
function bar(v){return'<div class="p"><i style="width:'+Math.min(100,v)+'%"></i></div>'}
function card(l,v){return'<div class="k"><small>'+l+'</small><div>'+v+'</div></div>'}
function nav(){const v=[['dash','Home'],['timer','Timer'],['syll','Syllabus'],['rev','Revise'],['back','Backlog'],['mock','Mocks'],['set','Settings']];$('#n').innerHTML='<b>UPSC 2027</b>'+Q(v,x=>'<a class="'+(view==x[0]?'on':'')+'" onclick="go(\''+x[0]+'\')">'+x[1]+'</a>')}
function go(v){view=v;R()}
function R(){theme();nav();$('#m').innerHTML=pbar()+V[view]();if(view=='timer')paint();if(!S.timer)document.title='UPSC 2027 Tracker'}
const QT=["Discipline is choosing what you want most over what you want now.","Small daily improvements are the key to staggering long-term results.","Consistency beats intensity.","The expert was once a beginner who refused to quit."];
const V={
dash(){const s=streaks(),r=ready(),rs=revStats(),t=today(),tg=S.set.daily,dn=dayH(t),ex=diff(S.set.exam,t),all=ALL.length,dd=ALL.filter(x=>DONE(T(x.id).st)).length,ip=ALL.filter(x=>T(x.id).st==ST[1]).length;if(S.hist[t]!==+r.score.toFixed(1)){S.hist[t]=+r.score.toFixed(1);save()}
let days=[];for(let i=13;i>=0;i--)days.push(dayH(add(t,-i)));const mx=Math.max(1,...days);let hm='';for(let i=104;i>=0;i--){const h=dayH(add(t,-i)),a=h==0?0:Math.min(1,.25+h/tg*.75);hm+='<i title="'+add(t,-i)+': '+fh(h)+'" style="'+(a?'background:var(--a);opacity:'+a:'')+'"></i>'}
return'<h2>Dashboard</h2><p style="color:var(--m)">'+QT[new Date().getDate()%QT.length]+'</p><div class="g">'+card(S.set.cd=='mains'&&S.set.mains?'Mains in':'Prelims in',(()=>{const v=diff(S.set.cd=='mains'&&S.set.mains?S.set.mains:S.set.exam,t);return v<0?'Date passed':v+' days'})())+card('Today',fh(dn)+' / '+tg+'h')+card('This week',fh(weekH())+' / '+S.set.weekly+'h')+card('This month',fh(monthH()))+card('Total hours',fh(hrs(S.sessions.reduce((a,x)=>a+x.study,0))))+card('Streak (now / best)',s.cur+' / '+s.best)+card('Active days',s.active)+card('Readiness',r.score.toFixed(0)+'/100')+'</div>'+
(dn>=tg?'<p style="color:var(--ok)">Daily target reached.</p>':'<p>'+fh(tg-dn)+' left to reach today\'s target.</p>')+bar(100*dn/tg)+
'<h3>Syllabus</h3><div class="g">'+card('Overall',(all?100*dd/all:0).toFixed(1)+'%')+card('Prelims',pct(x=>x.p[0]=='P').toFixed(1)+'%')+card('Mains',pct(x=>x.p[0]=='M').toFixed(1)+'%')+card('Completed / in progress',dd+' / '+ip)+'</div>'+
'<h3>Last 14 days (hours)</h3><div class="bars">'+Q(days,h=>'<i title="'+fh(h)+'" style="height:'+100*h/mx+'%"></i>')+'</div><h3>Activity (15 weeks)</h3><div class="hm">'+hm+'</div>'+
'<h3>Revisions</h3><p>Due today: '+rs.due.length+' · Overdue: '+rs.over.length+' · Upcoming: '+rs.up.length+'</p>'+Q(rs.over.concat(rs.due).concat(rs.up).slice(0,5),x=>'<div>'+x.due+' — '+esc(x.name)+' (R'+x.n+')</div>')},
timer(){const q=tsFix(),t=S.timer,
ring='<div class="ringw"><svg viewBox="0 0 220 220" class="ring" role="img" aria-label="Timer progress"><circle cx="110" cy="110" r="96" class="rt"/><circle id="rg" cx="110" cy="110" r="96" class="rp" transform="rotate(-90 110 110)"/></svg><div class="rc"><div id="tv" class="tm">'+(t?'':idleT(q))+'</div><div id="tl" class="tlb"></div></div></div>',
fv=(l,x)=>'<label class="fv"><span>'+l+'</span>'+x+'</label>',
ni=(k,l,mn,mx)=>fv(l,'<input type="number" min="'+mn+'" max="'+mx+'" step="1" value="'+(k=='cd'?(q.cd||60):pv(k))+'" onchange="tset(\''+k+'\',this.value)">'),
op=(a,v)=>a.map(([x,y])=>'<option value="'+esc(x)+'"'+(x==v?' selected':'')+'>'+esc(y)+'</option>').join(''),
sl=(l,k,a,v,dis)=>fv(l,'<select'+(dis?' disabled':'')+' onchange="tpick(\''+k+'\',this.value)">'+op(a,v)+'</select>');
let card;
if(!t){const papers=Object.keys(SY).filter(p=>!q.cat||p.startsWith(q.cat)),units=q.paper?UL(q.paper):[],tops=q.unit?ALL.filter(x=>x.p==q.paper&&x.u==q.unit):[];
card='<div class="tc">'+ring+'<div class="seg">'+Q(Object.keys(MODES),m=>'<button class="'+(q.mode==m?'on':'')+'" onclick="tmode(\''+m+'\')">'+MODES[m]+'</button>')+'</div>'+
(q.mode=='cd'?ni('cd','Duration (minutes)',1,600):q.mode=='pomo'?'<div class="row"><button class="s" onclick="tpre(25,5)">25 / 5</button><button class="s" onclick="tpre(50,10)">50 / 10</button></div><div class="g2">'+ni('w','Focus (min)',1,180)+ni('sb','Short break (min)',1,60)+ni('lb','Long break (min)',1,90)+ni('cyc','Sessions before long break',1,10)+'</div>':'')+
sl('Exam category','cat',[['','Any'],['Prelims','Prelims'],['Mains','Mains']],q.cat)+sl('Paper','paper',[['','No specific paper']].concat(papers.map(p=>[p,p])),q.paper)+sl('Subject','unit',[['','No specific subject']].concat(units.map(u=>[u,u])),q.unit,!q.paper)+sl('Topic','tid',[['','Whole subject / general']].concat(tops.map(x=>[x.id,x.n])),q.tid,!q.unit)+
fv('Session description (optional)','<textarea id="td" rows="2" maxlength="300" onchange="S.tsel.desc=this.value;save()">'+esc(q.desc||'')+'</textarea>')+'<button style="width:100%;margin-top:10px" onclick="ts()">Start</button></div>'}
else{const a=ALL.find(x=>x.id==t.id),ttl=a?a.n:(t.unit||'General study'),sub=[a?a.p:t.paper,a?a.u:t.unit].filter(Boolean).join(' › ')||'No subject selected';
card='<div class="tc">'+ring+'<div class="tt">'+esc(ttl)+'</div><div class="ts">'+esc(sub)+' · '+MODES[t.mode]+'</div>'+(t.desc?'<div class="ts"><i>'+esc(t.desc)+'</i></div>':'')+'<div id="ti" class="ts"></div><div class="row" style="justify-content:center;margin-top:12px">'+(t.wait?'<button onclick="tr()">Start '+(t.ph=='break'?'break':'focus')+'</button>':t.run?'<button onclick="tp()">Pause</button>':'<button onclick="tr()">Resume</button>')+'<button class="d" onclick="tx()">Finish &amp; save</button><button class="s" onclick="tz()">Discard</button></div></div>'}
const td=today(),tl=S.sessions.filter(x=>x.date==td).sort((a,b)=>b.id-a.id),tt=tl.reduce((a,x)=>a+x.study,0),
ra=S.sessions.filter(x=>TR=='all'||x.date>=add(td,-(+TR-1))),m={};ra.forEach(x=>{const u=x.unit||(ALL.find(a=>a.id==x.tid)||{}).u||'General study';m[u]=(m[u]||0)+x.study});
const rows=Object.entries(m).sort((a,b)=>b[1]-a[1]),sum=rows.reduce((a,r)=>a+r[1],0),mx=rows.length?rows[0][1]:1;
let opt='',lp='';ALL.forEach(x=>{if(x.p!=lp){opt+=(lp?'</optgroup>':'')+'<optgroup label="'+esc(x.p)+'">';lp=x.p}opt+='<option value="'+esc(x.id)+'">'+esc(x.u)+' › '+esc(x.n)+'</option>'});opt+='</optgroup>';
const hist=S.sessions.slice().sort((a,b)=>b.id-a.id).slice(0,100);
return'<h2>Study timer</h2>'+card+
'<h3>Today: '+fd(tt)+' of '+S.set.daily+'h target</h3>'+(tl.length?Q(tl,sesCard):'<p style="color:var(--m)">No sessions recorded today yet.</p>')+
'<h3>Time by subject</h3><div class="seg" style="margin-bottom:8px">'+Q([['1','Today'],['7','7 days'],['30','30 days'],['all','All']],r=>'<button class="'+(TR==r[0]?'on':'')+'" onclick="setTR(\''+r[0]+'\')">'+r[1]+'</button>')+'</div>'+
(rows.length?Q(rows,r=>'<div class="ar"><span>'+esc(r[0])+'</span><div class="p"><i style="width:'+(100*r[1]/mx)+'%"></i></div><small>'+fd(r[1])+' · '+(100*r[1]/sum).toFixed(0)+'%</small></div>'):'<p style="color:var(--m)">No study time recorded in this period.</p>')+
'<details><summary>Add a past session</summary><div class="row"><input id="md" type="date" value="'+td+'" max="'+td+'"><input id="mh" type="number" min="0" max="24" placeholder="Hours" style="width:90px"><input id="mi" type="number" min="0" max="59" placeholder="Minutes" style="width:90px"></div><div class="row"><select id="mt"><option value="">No specific topic</option>'+opt+'</select></div><div class="row"><input id="mdesc" placeholder="Description (optional)" style="flex:1"><button onclick="addman()">Add session</button></div></details>'+
'<details><summary>All sessions ('+S.sessions.length+')</summary><table><tr><th>Date<th>Topic<th>Study<th>Type<th>Note<th></tr>'+Q(hist,x=>'<tr><td>'+x.date+'<td>'+esc(stitle(x))+'<td>'+fd(x.study)+'<td>'+smode(x)+'<td>'+esc(x.desc)+'<td><button class="s" onclick="eds('+x.id+')">Edit</button> <button class="d" onclick="dls('+x.id+')">Delete</button></tr>')+'</table></details>'},
syll(){if(STID&&!ALL.some(x=>x.id==STID))STID=null;if(STID)return tdetail(STID);
const all=ALL.length,dn=ALL.filter(x=>DONE(T(x.id).st)).length,ip=ALL.filter(x=>T(x.id).st==ST[1]).length,pc=all?100*dn/all:0,C=251.3,
gc=Q(GR,(g,i)=>{const s=gstat(g[1]);return'<button class="s gcard'+(SF.g===String(i)?' on':'')+'" onclick="sg('+i+')"><b>'+g[0]+'</b><div class="p"><i style="width:'+s.p+'%"></i></div><small>'+(s.t?s.d+' / '+s.t+' topics · '+s.p.toFixed(0)+'%':'No topics yet')+'</small></button>'}),
opts=(a,v)=>a.map(([x,y])=>'<option value="'+esc(x)+'"'+(String(x)==String(v)?' selected':'')+'>'+esc(y)+'</option>').join('');
return'<h2>Syllabus tracker</h2><div class="sg sov"><div class="ovr"><svg viewBox="0 0 100 100" width="96" height="96" role="img" aria-label="Overall syllabus completion"><circle cx="50" cy="50" r="40" class="rt" style="stroke-width:9"/><circle cx="50" cy="50" r="40" class="rp" style="stroke-width:9;stroke-dasharray:'+C+';stroke-dashoffset:'+C*(1-pc/100)+'" transform="rotate(-90 50 50)"/></svg><div class="pcn">'+pc.toFixed(0)+'%</div></div><div><b>Overall syllabus completion</b><br><small style="color:var(--m)">'+dn+' completed · '+ip+' in progress · '+(all-dn-ip)+' not started<br>'+all+' topics in total</small></div></div>'+
'<div class="gg">'+gc+'</div>'+
'<div class="row" style="margin-top:12px"><input placeholder="Search topics, notes, references" value="'+esc(SF.q)+'" oninput="SF.q=this.value;tree()" style="flex:2 1 200px"><select onchange="SF.st=this.value;tree()">'+opts([['','All statuses']].concat(ST.map(s=>[s,s])),SF.st)+'</select><select onchange="SF.g=this.value;R()">'+opts([['','All papers']].concat(GR.map((g,i)=>[String(i),g[0]])),SF.g)+'</select><select onchange="SF.pr=this.value;tree()">'+opts([['','All priorities']].concat(PRI.map(s=>[s,s])),SF.pr)+'</select></div>'+
'<div class="row"><button class="s" onclick="ex(1)">Expand all</button><button class="s" onclick="ex(0)">Collapse all</button></div>'+
'<details class="addc"><summary>+ Add a custom topic</summary><p class="mu" style="margin:6px 0">Custom topics are kept separate from the official syllabus and are marked "Custom". Use this for your optional subject or your own notes topics.</p><div class="g2"><label class="fv"><span>Paper</span><select id="ap" onchange="apc()">'+opts(Object.keys(SY).map(p=>[p,p]),'Mains · Optional Paper I')+'</select></label><label class="fv"><span>Subject / section</span><input id="au" list="ul" maxlength="80" placeholder="Type a new one or pick"></label><label class="fv"><span>Topic name</span><input id="an" maxlength="120"></label><label class="fv"><span>Priority</span><select id="apr">'+opts(PRI.map(s=>[s,s]),'Medium')+'</select></label><label class="fv"><span>Estimated hours</span><input id="ae" type="number" min="0" max="500" step="0.5"></label></div><datalist id="ul">'+UL('Mains · Optional Paper I').map(u=>'<option value="'+esc(u)+'">').join('')+'</datalist><button onclick="addCustom()">Add topic</button></details>'+
'<div id="tree">'+treeH()+'</div>'},
rev(){if(!RV.ym)RV.ym=today().slice(0,7);const t=today(),rs=revStats(),den=rs.done+rs.over.length+rs.due.length,rate=den?(100*rs.done/den).toFixed(0)+'%':'—',
 pend=S.revs.filter(r=>!r.done&&rmatch(r)),srt=(a,k)=>a.sort((x,y)=>x[k]<y[k]?-1:x[k]>y[k]?1:0),
 L={over:srt(pend.filter(r=>r.due<t),'due'),today:pend.filter(r=>r.due==t),up:srt(pend.filter(r=>r.due>t),'due'),done:srt(S.revs.filter(r=>r.done&&rmatch(r)),'done').reverse().slice(0,100)},
 hd=Object.keys(S.topics).filter(id=>S.topics[id].hard&&ALL.some(x=>x.id==id)&&rmatch({id})),
 tabs=[['over','Overdue',L.over.length],['today','Due today',L.today.length],['up','Upcoming',L.up.length],['done','Completed',L.done.length],['hard','Difficult',hd.length]],
 empty={over:'Nothing overdue. Well done.',today:'No revisions due today.',up:'No upcoming revisions yet. Revisions are scheduled when you complete a topic.',done:'No completed revisions yet.',hard:'No topics marked as difficult. Use "Mark as difficult" on a revision card.'},
 opt=(a,v)=>a.map(([x,y])=>'<option value="'+esc(x)+'"'+(x==v?' selected':'')+'>'+esc(y)+'</option>').join(''),
 dayItems=RV.day?S.revs.filter(r=>rmatch(r)&&((!r.done&&r.due==RV.day)||r.done==RV.day)):[];
return'<h2>Revision</h2><div class="g">'+card('Revisions completed',rs.done)+card('Due today',rs.due.length)+card('Overdue',rs.over.length)+card('Completion rate',rate)+'</div>'+
'<p class="mu" style="margin:8px 0">Schedule: '+ivs().join(' · ')+' days. <a href="javascript:void(0)" onclick="go(\'set\')">Change in Settings</a>. Completion rate = completed ÷ (completed + due today + overdue).</p>'+
'<div class="row"><select aria-label="Filter by paper" onchange="rvF(\'paper\',this.value)">'+opt([['','All papers']].concat(Object.keys(SY).map(p=>[p,p])),RV.paper)+'</select><select aria-label="Filter by subject" onchange="rvF(\'unit\',this.value)"'+(RV.paper?'':' disabled')+'>'+opt([['','All subjects']].concat(RV.paper?UL(RV.paper).map(u=>[u,u]):[]),RV.unit)+'</select></div>'+calH()+
(RV.day?'<div class="sg"><div class="row" style="justify-content:space-between"><b>'+RV.day+'</b><button class="s" onclick="rvDay(\''+RV.day+'\')">Close</button></div>'+(dayItems.length?Q(dayItems,rcard):'<p class="mu">No revisions scheduled or completed on this day.</p>')+'</div>':'')+
'<div class="seg tabs5" role="tablist">'+Q(tabs,x=>'<button role="tab" class="'+(RV.tab==x[0]?'on':'')+'" onclick="rvTab(\''+x[0]+'\')">'+x[1]+' <small>'+x[2]+'</small></button>')+'</div>'+
(RV.tab=='hard'?(hd.length?Q(hd,hcard):'<p class="mu">'+empty.hard+'</p>'):(L[RV.tab].length?Q(L[RV.tab],rcard):'<p class="mu">'+empty[RV.tab]+'</p>'))},
back(){if(BP&&BP.pk!=PK)BP=null;const t=today(),s=bstats(),all=pendTasks(),P=all.filter(x=>bpass(x)).sort((a,b)=>{const A=T(a.id),B=T(b.id);return A.target<B.target?-1:A.target>B.target?1:PW[A.pri]-PW[B.pri]}),
 subs=[...new Set(all.map(x=>x.p+'|'+x.u))].map(k=>{const[p,u]=k.split('|');return[k,u+' ('+((GR.find(g=>g[1].includes(p))||[p])[0])+')']}),
 opt=(a,v)=>a.map(([x,y])=>'<option value="'+esc(x)+'"'+(x==v?' selected':'')+'>'+esc(y)+'</option>').join(''),
 cl=s.cleared+s.over?100*s.cleared/(s.cleared+s.over):null;
return'<h2>Backlog</h2><p class="mu">Topics with a target date that are not completed. Nothing here is ever completed or deleted automatically.</p><div class="g">'+card('Pending topics',s.pend)+card('Overdue topics',s.over)+card('Overdue over 7 days',s.over7)+card('High priority',s.high)+card('Cleared topics',s.cleared)+'</div>'+
'<div class="sg"><b>Backlog clearance: '+(cl===null?'—':cl.toFixed(0)+'%')+'</b><div class="p"><i style="width:'+(cl||0)+'%"></i></div><small class="mu">'+s.cleared+' cleared · '+s.over+' still overdue. Cleared = a topic that was overdue and is now completed.</small></div>'+
'<div class="row"><select aria-label="Priority" onchange="BF.pri=this.value;R()">'+opt([['','All priorities']].concat(PRI.map(p=>[p,p])),BF.pri)+'</select><select aria-label="Subject" onchange="BF.sub=this.value;R()">'+opt([['','All subjects']].concat(subs),BF.sub)+'</select><select aria-label="Due date" onchange="BF.due=this.value;R()">'+opt([['all','All pending'],['over','Overdue'],['over7','Overdue over 7 days'],['today','Due today'],['week','Due in the next 7 days'],['later','Due later']],BF.due)+'</select></div>'+
(BP?bpH():'<div class="row"><button onclick="bpOpen()">Distribute overdue topics across upcoming days</button>'+(S.lastPlan?'<button class="s" onclick="bUndo()">Undo last reschedule ('+S.lastPlan.items.length+')</button>':'')+'</div>')+
wlH()+'<h3>Tasks ('+P.length+')</h3>'+(P.length?Q(P,bcard):'<p class="mu">No pending topics match these filters. Give topics a target date in the Syllabus tab to track them here.</p>')},
mock(){const r=S.mocks;return'<h2>Mock tests &amp; answer writing</h2><div class="row"><select id="mk"><option value="P">Prelims</option><option value="M">Mains</option></select><input id="mn" placeholder="Test / GS paper"><input id="ms" type="number" placeholder="Marks" style="width:90px"><input id="mx" type="number" placeholder="Max" style="width:90px"><input id="mw" placeholder="Areas to improve" style="flex:1"><button onclick="addm()">Save</button></div><div class="g">'+card('Prelims avg',mockPct('P').toFixed(0)+'%')+card('Mains avg',mockPct('M').toFixed(0)+'%')+'</div><div class="bars">'+Q(r,x=>'<i title="'+esc(x.n)+' '+(100*x.s/x.max).toFixed(0)+'%" style="height:'+100*x.s/x.max+'%"></i>')+'</div><table><tr><th>Date<th>Type<th>Name<th>Score<th>Improve<th></tr>'+Q(r.map((x,i)=>[x,i]).reverse(),([x,i])=>'<tr><td>'+x.d+'<td>'+(x.k=='P'?'Prelims':'Mains')+'<td>'+esc(x.n)+'<td>'+x.s+'/'+x.max+'<td>'+esc(x.w)+'<td><button class="d" onclick="if(confirm(\'Delete?\')){S.mocks.splice('+i+',1);save();R()}">×</button></tr>')+'</table>'},
set(){const s=S.set,r=ready();WD=s.w.slice();
const g=(i,t,d,b)=>'<div class="sg"><h3>'+i+' '+t+'</h3><small>'+d+'</small>'+b+'</div>',
f=(l,x)=>'<label class="fld"><span>'+l+'</span>'+x+'</label>',
n=(k,mn,mx,st)=>'<input type="number" min="'+mn+'" max="'+mx+'" step="'+st+'" value="'+s[k]+'" onchange="setv(\''+k+'\',this.value)">',
sw=(c,l)=>'<button class="'+(c?'':'s')+'" onclick="'+l[1]+'">'+l[0]+'</button>',tot=WD.reduce((a,b)=>a+b,0);
return'<h2>Settings</h2>'+
g('👤','Profiles','Each profile keeps its own sessions, syllabus, revisions, backlog, mocks and settings.',f('Active profile','<b>'+esc(activeName())+'</b>')+'<div class="row"><button onclick="addProfile()">Add profile</button><button class="s" onclick="renameProfile()">Rename</button><button class="d" onclick="deleteProfile()">Delete</button></div>')+
g('🎯','Study plan','Targets used by the dashboard, streak and consistency.',f('Daily target (hours)',n('daily',.5,24,.5))+f('Minimum hours for a streak day',n('min',0,24,.5))+f('Weekly target (hours)',n('weekly',1,168,1)))+
g('📅','Examination','Exam dates and which exam the dashboard counts down to.',f('Prelims date','<input type="date" value="'+s.exam+'" onchange="setd(\'exam\',this.value)">')+f('Mains date (optional)','<input type="date" value="'+s.mains+'" onchange="setd(\'mains\',this.value)">')+f('Countdown shows','<select onchange="setcd(this.value)"><option value="prelims"'+(s.cd=='prelims'?' selected':'')+'>Prelims</option><option value="mains"'+(s.cd=='mains'?' selected':'')+'>Mains</option></select>'))+
g('⏱','Timer','Defaults for Pomodoro mode. You can adjust them for a single session on the Timer screen.',f('Work (minutes)',n('pw',1,180,1))+f('Short break (minutes)',n('pb',1,60,1))+f('Long break (minutes)',n('lb',1,90,1))+f('Sessions before a long break',n('cyc',1,10,1))+f('Start breaks automatically','<input type="checkbox" style="width:auto"'+(s.autob?' checked':'')+' onchange="setauto(this.checked)">'))+
g('🔁','Revision schedule','Days until each revision, counted from the previous revision (or from completing the topic). Changes apply to revisions scheduled from now on.',Q([0,1,2,3,4],i=>f('Revision '+(i+1)+' (days)','<input type="number" min="1" max="365" step="1" value="'+s.iv[i]+'" onchange="setIv('+i+',this.value)">'))+(s.iv.some((v,i)=>i&&v<s.iv[i-1])?'<p class="mu">Note: some intervals are shorter than the one before. That works, but spaced repetition normally uses growing gaps.</p>':'')+'<div class="row"><button class="s" onclick="resetIv()">Reset to 1, 3, 7, 15, 30</button></div>')+
g('📈','Readiness score','An internal progress indicator, not a prediction. Weights must total exactly 100%.',Q(NM,(x,i)=>f(x+' (now '+r.c[i].toFixed(0)+'%)','<input type="number" min="0" max="100" step="1" value="'+s.w[i]+'" oninput="wIn('+i+',this.value)">'))+'<div class="row">Total: <b id="wt"'+(tot==100?'':' style="color:var(--w)"')+'>'+tot+'%</b><button id="wsave" onclick="saveW()"'+(tot==100?'':' disabled')+'>Save weights</button><button class="s" onclick="resetW()">Reset</button></div><p>Score now: <b>'+r.score.toFixed(0)+'/100</b></p>'+rec(r))+
g('🎨','Appearance','Theme, accent colour and text size for this profile.','<div class="row">'+sw(!S.dark,['Light','setdark(0)'])+sw(S.dark,['Dark','setdark(1)'])+'</div><div class="row">'+Q(Object.keys(PAL),k=>'<button title="'+PAL[k].n+'" aria-label="'+PAL[k].n+'" onclick="setf(\'accent\',\''+k+'\')" style="background:'+(S.dark?PAL[k].d:PAL[k].l)+';width:34px;height:34px;border-radius:50%;padding:0;'+(s.accent==k?'outline:3px solid var(--t)':'')+'"></button>')+'</div><div class="row">'+Q(['sm','md','lg'],k=>sw(s.fs==k,[{sm:'Small',md:'Medium',lg:'Large'}[k],'setf(\'fs\',\''+k+'\')']))+'</div>')+
g('🤝','Sharing','Choose what you would be willing to share. Used by the shared progress feature in a later update. Nothing is shared now.',Q([['weekly','Weekly study hours'],['consistency','Study consistency'],['syllabus','Syllabus completion'],['revision','Revision completion']],x=>f(x[1],'<input type="checkbox" style="width:auto"'+(s.share[x[0]]?' checked':'')+' onchange="setsh(\''+x[0]+'\',this.checked)">')))+
g('💾','Data management','Backups and exports include only the active profile.','<p style="color:var(--m)">Storage: '+(PERSIST?'protected from automatic clearing':'standard: the browser may clear it if the device runs low on space, so back up regularly')+'</p><div class="row"><button onclick="bk()">Backup (JSON)</button><label class="s" style="padding:6px 10px;border:1px solid var(--b);border-radius:6px;cursor:pointer">Restore<input type="file" accept=".json" hidden onchange="rs(this.files[0])"></label><button class="s" onclick="csv()">Export sessions (CSV)</button><button class="s" onclick="undoRestore()">Undo last restore / erase</button><button class="s" onclick="print()">Print / save PDF</button><button class="d" onclick="if(confirm(\'Erase ALL data in this profile?\')){wipe()}">Erase all</button></div>')}};
function rec(r){const o=[],c=r.c;if(c[0]<50)o.push('Syllabus completion is low: raise daily study time on the least-covered paper.');if(c[1]<60)o.push('Clear overdue revisions before starting new topics.');if(c[2]<60)o.push('Prelims accuracy is low: add daily MCQ practice and analyse mistakes.');if(c[3]<50)o.push('Log more answer-writing practice.');if(c[4]<60)o.push('Consistency is low: set a realistic daily target you can hit.');const w=[...new Set(ALL.map(x=>x.p))].map(p=>[p,pct(x=>x.p==p)]).sort((a,b)=>a[1]-b[1]).slice(0,3);o.push('Weakest sections: '+w.map(x=>x[0]+' ('+x[1].toFixed(0)+'%)').join(', '));return'<ul>'+Q(o,x=>'<li>'+x+'</li>')+'</ul>'}
function addm(){const s=+$('#ms').value,mx=+$('#mx').value;if(!(mx>0)||isNaN(s)||s<0||s>mx)return alert('Enter valid marks and maximum');S.mocks.push({d:today(),k:$('#mk').value,n:$('#mn').value||'Test',s,max:mx,w:$('#mw').value});save();R()}
function addman(){const d=$('#md').value,h=+$('#mh').value||0,mi=+$('#mi').value||0,tot=h+mi/60;if(!d||d>today())return alert('Choose today or an earlier date.');if(h<0||mi<0||tot<=0||tot>24)return alert('Enter a duration between 1 minute and 24 hours.');const id=$('#mt').value,t=ALL.find(x=>x.id==id);S.sessions.push({id:Date.now(),date:d,study:tot*36e5,brk:0,tid:t?id:'',name:t?t.n:'',unit:t?t.u:'',paper:t?t.p:'',mode:'manual',desc:$('#mdesc').value,manual:1});if(t){const q=T(id);q.hrs+=tot;if(q.st==ST[0])q.st=ST[1]}save();R()}
function eds(id){const x=S.sessions.find(s=>s.id==id),h=prompt('Study hours',hrs(x.study).toFixed(2));if(h===null||isNaN(+h))return;const o=x.study;x.study=+h*36e5;x.desc=prompt('Description',x.desc)??x.desc;if(x.tid)T(x.tid).hrs=Math.max(0,T(x.tid).hrs+hrs(x.study-o));save();R()}
function dl(n,t,ty){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:ty}));a.download=n;a.click()}

/* ---------- Storage layer (schema v2: one record per profile) ---------- */
let META,PK,PERSIST=false,bc=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
function toast(m){const d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:90px;background:var(--a);color:#fff;padding:10px 14px;border-radius:8px;z-index:99;max-width:90%';document.body.appendChild(d);setTimeout(()=>d.remove(),6000)}
function open(){return new Promise((r,j)=>{const q=indexedDB.open('upsc27',1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('kv'))q.result.createObjectStore('kv')};q.onsuccess=()=>{db=q.result;r()};q.onerror=()=>j(q.error)})}
const idbGet=k=>new Promise(r=>{const g=db.transaction('kv').objectStore('kv').get(k);g.onsuccess=()=>r(g.result);g.onerror=()=>r(undefined)});
const idbPut=(k,v)=>new Promise(r=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>r(true);t.onerror=t.onabort=()=>r(false)});
function normalize(d){let drop=0;const dre=/^\d{4}-\d\d-\d\d$/,D=DEF().set;d=d&&typeof d=='object'&&!Array.isArray(d)?d:{};const o=Object.assign(DEF(),d);o._v=2;
const num=(v,def,mn,mx)=>(v!==''&&v!==null&&v!==undefined&&Number.isFinite(+v))?Math.min(mx,Math.max(mn,+v)):def;
const s=o.set=Object.assign({},D,d.set&&typeof d.set=='object'?d.set:{});s.daily=num(s.daily,D.daily,.5,24);s.min=num(s.min,D.min,0,24);s.pw=num(s.pw,D.pw,1,180);s.pb=num(s.pb,D.pb,1,60);
if(!dre.test(s.exam))s.exam=D.exam;if(s.mains&&!dre.test(s.mains))s.mains='';s.weekly=num(s.weekly,D.weekly,1,168);s.lb=num(s.lb,D.lb,1,90);s.cyc=Math.round(num(s.cyc,D.cyc,1,10));s.autob=s.autob?1:0;s.accent=PAL[s.accent]?s.accent:'teal';s.fs=FS[s.fs]?s.fs:'md';s.cd=(s.cd=='mains'&&s.mains)?'mains':'prelims';s.share=Object.assign({weekly:0,consistency:0,syllabus:0,revision:0},d.set&&d.set.share&&typeof d.set.share=='object'?d.set.share:{});for(const k in s.share)s.share[k]=s.share[k]?1:0;s.min=Math.min(s.min,s.daily);s.iv=(Array.isArray(s.iv)&&s.iv.length==5&&s.iv.every(x=>Number.isInteger(+x)&&+x>=1&&+x<=365))?s.iv.map(Number):D.iv.slice();s.weekly=Math.max(s.weekly,s.daily);s.w=(Array.isArray(s.w)&&s.w.length==5&&s.w.every(x=>Number.isFinite(+x)&&+x>=0))?s.w.map(Number):D.w.slice();
const arr=(a,f)=>Array.isArray(a)?a.filter(x=>{const ok=x&&typeof x=='object'&&f(x);if(!ok)drop++;return ok}):(a===undefined?[]:(drop++,[]));
o.sessions=arr(d.sessions,x=>dre.test(x.date)&&Number.isFinite(+x.study)&&+x.study>=0).map((x,i)=>({...x,id:x.id??Date.now()+i,study:+x.study,brk:+x.brk||0,name:String(x.name||''),desc:String(x.desc||'')}));
o.revs=arr(d.revs,x=>x.id&&dre.test(x.due)).map(x=>({...x,rid:x.rid??Date.now()+Math.random(),n:Math.min(5,Math.max(1,Math.round(+x.n)||1)),name:String(x.name||''),done:x.done?(dre.test(x.done)?x.done:x.due):'',post:Math.max(0,+x.post||0),cd:dre.test(x.cd)?x.cd:''}));
const seen={};o.revs.forEach(r=>{if(!r.done){const c=seen[r.id];if(!c||r.n<c.n||(r.n==c.n&&r.due<c.due))seen[r.id]=r}});o.revs=o.revs.filter(r=>{if(r.done||seen[r.id]===r)return true;drop++;return false});
o.mocks=arr(d.mocks,x=>Number.isFinite(+x.s)&&+x.max>0&&+x.s>=0&&+x.s<=+x.max).map(x=>({...x,s:+x.s,max:+x.max,k:x.k=='M'?'M':'P',n:String(x.n||'Test'),w:String(x.w||''),d:dre.test(x.d)?x.d:today()}));
o.custom=arr(d.custom,x=>x.id&&SY[x.p]&&x.u&&x.n).map(x=>({id:String(x.id),p:x.p,u:String(x.u),n:String(x.n)}));
o.topics=d.topics&&typeof d.topics=='object'&&!Array.isArray(d.topics)?d.topics:{};
for(const id in o.topics){const t=o.topics[id];if(!t||typeof t!='object'){delete o.topics[id];drop++;continue}
 if(t.st=='Revision Required')t._needrev=1;t.st=MAP[t.st]||(ST.includes(t.st)?t.st:ST[0]);t.hrs=Math.max(0,+t.hrs||0);t.rev=Math.max(0,Math.min(5,+t.rev||0));t.pri=PRI.includes(t.pri)?t.pri:'Medium';t.est=Math.max(0,Math.min(500,+t.est||0));t.hard=!!t.hard;t.bl=dre.test(t.bl)?t.bl:'';
 ['notes','ref','target','done'].forEach(k=>t[k]=t[k]==null?'':String(t[k]));if(t.target&&!dre.test(t.target))t.target='';if(t.done&&!dre.test(t.done))t.done=''}
o.hist=d.hist&&typeof d.hist=='object'&&!Array.isArray(d.hist)?d.hist:{};
o.timer=normTimer(d.timer);o.tsel=d.tsel&&typeof d.tsel=='object'&&!Array.isArray(d.tsel)?d.tsel:{};o.lastPlan=d.lastPlan&&Array.isArray(d.lastPlan.items)?{at:String(d.lastPlan.at||''),items:d.lastPlan.items.filter(i=>Array.isArray(i)&&typeof i[0]=='string'&&(i[1]===''||dre.test(i[1])))}:null;o.dark=d.dark?1:0;
return{state:o,dropped:drop}}
function fixRevs(){let ch=0;for(const id in S.topics){const t=S.topics[id];if(!t._needrev)continue;delete t._needrev;const a=ALL.find(x=>x.id==id);if(a&&!S.revs.some(r=>r.id==id&&!r.done)){S.revs.push({id,rid:Date.now()+Math.random(),name:a.n,n:Math.min(5,t.rev+1),due:today()});ch=1}}return ch}
function conflict(cur){S=normalize(cur).state;S._rev=cur._rev||0;buildAll();fixRevs();R();toast('Your data was changed in another window. This screen was refreshed and your last change was not saved. Please repeat it.')}
function save(){const s0=S,k=PK,t=db.transaction('kv','readwrite'),st=t.objectStore('kv'),g=st.get(k);g.onsuccess=()=>{const cur=g.result;if(cur&&(cur._rev||0)!==(s0._rev||0)){t.abort();if(S===s0)conflict(cur);return}s0._rev=(s0._rev||0)+1;st.put(clone(s0),k)};t.oncomplete=()=>{try{bc&&bc.postMessage({k,rev:s0._rev})}catch(e){}}}
const activeName=()=>(META.profiles.find(p=>p.id==META.active)||{}).name||'Me';
async function boot(){await open();try{if(navigator.storage&&navigator.storage.persist)PERSIST=await navigator.storage.persist()}catch(e){}
META=await idbGet('meta');
if(!META){const old=await idbGet('s');if(old)await idbPut('s_backup_v1',old);const st=normalize(old||{}).state;st._rev=1;await idbPut('p:p1',st);META={v:2,active:'p1',profiles:[{id:'p1',name:'Me'}]};await idbPut('meta',META)}
PK='p:'+META.active;const raw=await idbGet(PK)||{};const n=normalize(raw);S=n.state;S._rev=raw._rev||1;buildAll();const fx=fixRevs();
if(fx||n.dropped||raw._v!==2)save();
try{bc=new BroadcastChannel('upsc27');bc.onmessage=async e=>{if(!e.data||e.data.k!==PK||e.data.rev===S._rev)return;const cur=await idbGet(PK);if(!cur)return;S=normalize(cur).state;S._rev=cur._rev||0;buildAll();const a=document.activeElement;if(!(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)))R()}}catch(e){}
R();tickAll();setInterval(tickAll,500);setInterval(()=>{if(view=='dash')R()},6e4);if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})}
async function wipe(){await idbPut(PK+'_prev',clone(S));const r=S._rev;S=normalize({}).state;S._rev=r;buildAll();save();R();toast('All data erased. Use "Undo last restore / erase" in Settings to bring it back.')}
async function undoRestore(){const prev=await idbGet(PK+'_prev');if(!prev)return alert('Nothing to undo.');if(!confirm('Bring back the data from before the last restore or erase? Current data will be replaced.'))return;await idbPut(PK+'_prev',clone(S));const r=S._rev;S=normalize(prev).state;S._rev=r;buildAll();fixRevs();save();R()}
function bk(){dl('upsc-backup-'+activeName().replace(/[^\w-]+/g,'_')+'-'+today()+'.json',JSON.stringify({_format:'upsc-backup',_v:2,profile:activeName(),exported:new Date().toISOString(),state:S}),'application/json')}
function rs(f){if(!f)return;const r=new FileReader();r.onload=async()=>{let d;try{d=JSON.parse(r.result)}catch(e){return alert('That file is not valid JSON.')}
const st=d&&d._format=='upsc-backup'?d.state:d;if(!st||typeof st!='object'||(!Array.isArray(st.sessions)&&!st.topics&&!st.set))return alert('This does not look like an UPSC tracker backup.');
const n=normalize(st);if(!confirm('Replace current data with this backup?\n'+n.state.sessions.length+' sessions, '+Object.keys(n.state.topics).length+' topic records.'+(n.dropped?'\n'+n.dropped+' invalid entries will be skipped.':'')+'\nYour current data is kept so you can undo.'))return;
await idbPut(PK+'_prev',clone(S));const rev=S._rev;S=n.state;S._rev=rev;buildAll();fixRevs();save();R()};r.readAsText(f)}
function csv(){const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';dl('sessions.csv','date,topic,study_hours,break_min,description\n'+S.sessions.map(x=>[x.date,q(x.name),hrs(x.study).toFixed(2),Math.round(x.brk/6e4),q(x.desc)].join(',')).join('\n'),'text/csv')}

/* ---------- Phase 1: profiles, validated settings, appearance ---------- */
const PAL={teal:{n:'Teal',l:'#1f6f8b',d:'#5bb4d1'},indigo:{n:'Indigo',l:'#4f46e5',d:'#8b8cf8'},emerald:{n:'Emerald',l:'#15803d',d:'#4ade80'},amber:{n:'Amber',l:'#b45309',d:'#fbbf24'},rose:{n:'Rose',l:'#be123c',d:'#fb7185'}},FS={sm:'14px',md:'15px',lg:'17px'};
let WD=[];
function theme(){const p=PAL[S.set.accent]||PAL.teal;document.body.classList.toggle('dk',!!S.dark);document.body.style.setProperty('--a',S.dark?p.d:p.l);document.body.style.fontSize=FS[S.set.fs]||'15px'}
function pbar(){return'<div class="pf"><span>Profile</span><select aria-label="Profile" onchange="switchProfile(this.value)">'+Q(META.profiles,p=>'<option value="'+esc(p.id)+'"'+(p.id==META.active?' selected':'')+'>'+esc(p.name)+'</option>')+'</select></div>'}
const idbDel=k=>new Promise(r=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').delete(k);t.oncomplete=()=>r(true);t.onerror=t.onabort=()=>r(false)});
async function metaUpdate(fn){const m=(await idbGet('meta'))||META;fn(m);await idbPut('meta',m);META=m}
function okName(n,self){n=String(n==null?'':n).trim();if(!n||n.length>30){toast('Profile name must be 1 to 30 characters.');return null}if(META.profiles.some(p=>p.id!=self&&p.name.toLowerCase()==n.toLowerCase())){toast('A profile with that name already exists.');return null}return n}
async function createProfile(name){name=okName(name);if(!name)return null;const id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),st=normalize({}).state;st._rev=1;await idbPut('p:'+id,st);await metaUpdate(m=>{m.profiles.push({id,name})});return id}
async function switchProfile(id){if(id==META.active)return;if(S.timer&&!confirm('A timer is running in this profile. It keeps its time and will be here when you switch back. Switch anyway?')){R();return}
 const raw=await idbGet('p:'+id);if(!raw){toast('That profile could not be found.');R();return}
 await metaUpdate(m=>{m.active=id});PK='p:'+id;const n=normalize(raw);S=n.state;S._rev=raw._rev||1;buildAll();fixRevs();if(n.dropped)save();R()}
async function addProfile(){const n=prompt('Name for the new profile (up to 30 characters)');if(n===null)return;const id=await createProfile(n);if(id)await switchProfile(id)}
async function renameProfile(){const n=prompt('New name for this profile',activeName());if(n===null)return;const v=okName(n,META.active);if(!v)return;await metaUpdate(m=>{m.profiles.find(p=>p.id==META.active).name=v});R()}
async function deleteProfile(){if(META.profiles.length<2)return alert('You need at least one profile, so the only profile cannot be deleted.');const id=META.active,nm=activeName(),t=prompt('This permanently deletes all data in the profile "'+nm+'" on this device. Back it up first if unsure.\nType the profile name to confirm.');if(t===null)return;if(t!==nm)return toast('The name did not match. Nothing was deleted.');
 const other=META.profiles.find(p=>p.id!=id),raw=await idbGet('p:'+other.id);await metaUpdate(m=>{m.profiles=m.profiles.filter(p=>p.id!=id);m.active=other.id});await idbDel('p:'+id);await idbDel('p:'+id+'_prev');PK='p:'+other.id;const n=normalize(raw);S=n.state;S._rev=raw._rev||1;buildAll();fixRevs();R();toast('Profile deleted.')}
function setv(k,raw){const L={daily:[.5,24,'Daily target'],min:[0,24,'Minimum streak hours'],weekly:[1,168,'Weekly target'],pw:[1,180,'Work duration'],pb:[1,60,'Short break'],lb:[1,90,'Long break'],cyc:[1,10,'Sessions before a long break']}[k],v=raw===''?NaN:+raw,s=S.set;
 if(!L||!Number.isFinite(v)||v<L[0]||v>L[1]||(k=='cyc'&&!Number.isInteger(v))){toast((L?L[2]:'Value')+' must be '+(k=='cyc'?'a whole number ':'')+'between '+(L?L[0]+' and '+L[1]:'the allowed range')+'.');return R()}
 const o=s[k];s[k]=v;if(s.min>s.daily){s[k]=o;toast('Minimum streak hours cannot be more than the daily target.');return R()}if(s.weekly<s.daily){s[k]=o;toast('The weekly target cannot be less than the daily target.');return R()}save();R()}
function setd(k,val){const S_=S.set;if(k=='mains'&&val===''){S_.mains='';if(S_.cd=='mains')S_.cd='prelims';save();return R()}
 if(!/^\d{4}-\d\d-\d\d$/.test(val)||ymd(new Date(val+'T00:00'))!==val){toast('Enter a valid date.');return R()}
 if(k=='mains'&&val<=S_.exam){toast('The Mains date must be after the Prelims date.');return R()}if(k=='exam'&&S_.mains&&S_.mains<=val){toast('The Prelims date must be before the Mains date.');return R()}S_[k]=val;save();R()}
function setcd(v){if(v=='mains'&&!S.set.mains){toast('Set a Mains date first.');return R()}S.set.cd=v=='mains'?'mains':'prelims';save();R()}
function setf(k,v){if(k=='accent'&&!PAL[v])return;if(k=='fs'&&!FS[v])return;S.set[k]=v;save();R()}
function setdark(v){S.dark=v?1:0;save();R()}
function setauto(c){S.set.autob=c?1:0;save()}
function setsh(k,c){if(k in S.set.share){S.set.share[k]=c?1:0;save()}}
function wIn(i,v){WD[i]=Math.max(0,Math.min(100,Math.round(+v||0)));const t=WD.reduce((a,b)=>a+b,0),e=$('#wt');if(e){e.textContent=t+'%';e.style.color=t==100?'':'var(--w)'}const b=$('#wsave');if(b)b.disabled=t!=100}
function saveW(){const t=WD.reduce((a,b)=>a+b,0);if(t!=100)return toast('Weights must total exactly 100% (now '+t+'%).');S.set.w=WD.slice();save();R();toast('Readiness weights saved.')}
function resetW(){S.set.w=DEF().set.w.slice();save();R()}

/* ---------- Phase 2: timestamp-based timer ---------- */
const MODES={sw:'Stopwatch',cd:'Countdown',pomo:'Pomodoro'};let TR='7';
const z2=n=>String(n).padStart(2,'0'),hms=s=>z2(s/3600|0)+':'+z2(s/60%60|0)+':'+z2(s%60),msq=s=>z2(s/60|0)+':'+z2(s%60),fmt=s=>s>=3600?hms(s):msq(s);
const fd=ms=>{if(ms<6e4)return Math.round(ms/1e3)+'s';const m=Math.round(ms/6e4);return m>=60?Math.floor(m/60)+'h '+z2(m%60)+'m':m+'m'};
const pv=k=>S.tsel[k]??({w:S.set.pw,sb:S.set.pb,lb:S.set.lb,cyc:S.set.cyc})[k];
const idleT=q=>q.mode=='sw'?'00:00:00':fmt((q.mode=='cd'?(q.cd||60):pv('w'))*60);
const stitle=x=>x.name||x.unit||(ALL.find(a=>a.id==x.tid)||{}).u||'General study',smode=x=>x.manual?'Manual':(MODES[x.mode]||'Stopwatch');
const sesCard=x=>'<div class="sc"><div><b>'+esc(stitle(x))+'</b><br><small>'+esc([x.paper,x.unit].filter(Boolean).join(' › ')||'General')+' · '+smode(x)+'</small>'+(x.desc?'<br><small><i>'+esc(x.desc)+'</i></small>':'')+'</div><div class="sd"><b>'+fd(x.study)+'</b><br><button class="s" onclick="eds('+x.id+')">Edit</button> <button class="d" onclick="dls('+x.id+')">Delete</button></div></div>';
function normTimer(t){if(!t||typeof t!='object')return null;const F=x=>x!==null&&x!==''&&Number.isFinite(+x);
 if(t.sid&&MODES[t.mode]){if(!(F(t.t0)&&F(t.pacc)&&F(t.plen)&&F(t.study)&&F(t.brk)&&F(t.n)&&t.cfg&&F(t.cfg.w)&&F(t.cfg.sb)&&F(t.cfg.lb)&&F(t.cfg.cyc)&&Array.isArray(t.ivs)))return null;t.ivs=t.ivs.filter(v=>Array.isArray(v)&&F(v[0])&&F(v[1])&&(v[2]=='w'||v[2]=='b'));return t}
 if(F(t.acc)&&F(t.t0)){const now=Date.now(),e=(+t.acc)+(t.run?now-t.t0:0);let s=e,b=0;if(+t.w){const W=t.w*6e4,C=W+(+t.b||5)*6e4,f=Math.floor(e/C),r=e%C;s=f*W+Math.min(r,W);b=e-s}
  const d=/^\d{4}-\d\d-\d\d$/.test(t.date)?t.date:ymd(now),a=new Date(d+'T12:00').getTime();
  return{sid:+t.t0,mode:'sw',id:String(t.id||''),unit:'',paper:'',desc:String(t.desc||''),date:d,ph:'work',plen:0,run:t.run?1:0,t0:now,pacc:0,study:s,brk:b,n:0,wait:0,cfg:{w:25,sb:5,lb:15,cyc:4,auto:1},ivs:[[a,a+s,'w'],[a+s,a+s+b,'b']]}}
 return null}
function tsFix(){const q=S.tsel&&typeof S.tsel=='object'?S.tsel:(S.tsel={});if(!MODES[q.mode])q.mode='sw';if(q.cat!='Prelims'&&q.cat!='Mains')q.cat='';if(q.paper&&(!SY[q.paper]||(q.cat&&!q.paper.startsWith(q.cat))))q.paper='';if(!q.paper)q.unit='';if(q.unit&&!UL(q.paper).includes(q.unit))q.unit='';if(!q.unit)q.tid='';if(q.tid&&!ALL.some(x=>x.id==q.tid&&x.p==q.paper&&x.u==q.unit))q.tid='';return q}
function tmode(m){const q=tsFix(),d=$('#td');if(d)q.desc=d.value;if(MODES[m])q.mode=m;save();R()}
function tpick(l,v){const q=tsFix(),d=$('#td');if(d)q.desc=d.value;const o=['cat','paper','unit','tid'],i=o.indexOf(l);if(i<0)return;q[l]=v;if(l=='paper'&&v)q.cat=v.split(' · ')[0];o.slice(i+1).forEach(k=>{if(!(l=='paper'&&k=='cat'))q[k]=''});save();R()}
function tset(k,v){const L={cd:[1,600],w:[1,180],sb:[1,60],lb:[1,90],cyc:[1,10]}[k],n=v===''?NaN:+v;if(!L||!Number.isInteger(n)||n<L[0]||n>L[1]){toast('Enter a whole number between '+(L?L[0]+' and '+L[1]:'the allowed range')+'.');return R()}S.tsel[k]=n;save();R()}
function tpre(w,sb){S.tsel.w=w;S.tsel.sb=sb;save();R()}
function setTR(v){TR=v;R()}
function adv(t,now){let ch=0,g=0;while(t.run&&t.plen>0&&g++<1000){const pe=t.pacc+now-t.t0;if(pe<t.plen)break;const b=t.t0+t.plen-t.pacc,k=t.ph=='work'?'w':'b';t.ivs.push([t.t0,b,k]);ch=1;
  if(t.ph=='work'){t.study+=t.plen;t.n++}else t.brk+=t.plen;
  if(t.mode=='cd'){t.run=0;t.done=1;t.pacc=t.plen;break}
  const nx=t.ph=='work'?'break':'work';t.ph=nx;if(nx=='break'){t.bt=t.n%t.cfg.cyc==0?'l':'s';t.plen=(t.bt=='l'?t.cfg.lb:t.cfg.sb)*6e4}else t.plen=t.cfg.w*6e4;t.pacc=0;t.t0=b;if(!t.cfg.auto){t.run=0;t.wait=1;break}}
 return ch}
function tview(t,now){const pe=t.pacc+(t.run?now-t.t0:0),pl=t.plen;return{pe,study:t.study+(t.ph=='work'?pe:0),brk:t.brk+(t.ph=='break'?pe:0),prog:pl>0?Math.min(1,pe/pl):(pe%36e5)/36e5,main:pl>0?Math.max(0,pl-pe):pe}}
function paint(){const t=S.timer;if(!t||!$('#tv'))return;const v=tview(t,Date.now()),s=Math.floor(v.main/1e3);$('#tv').textContent=(t.mode=='sw')?hms(s):fmt(s);$('#rg').style.strokeDashoffset=603.2*(1-v.prog);
 $('.ringw').classList.toggle('brk',t.ph=='break');$('#tl').textContent=(t.wait?'Waiting · ':!t.run?'Paused · ':'')+(t.ph=='break'?(t.bt=='l'?'Long break':'Short break'):t.mode=='pomo'?'Focus '+(t.n%t.cfg.cyc+1)+' of '+t.cfg.cyc:t.mode=='cd'?'Countdown':'Studying');
 const i=$('#ti');if(i)i.textContent='Study '+fd(v.study)+' · Break '+fd(v.brk);document.title=(t.run?$('#tv').textContent+' · ':'')+'UPSC 2027 Tracker'}
function beep(){try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.15;o.start();o.stop(a.currentTime+.35);navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
function tickAll(){const t=S&&S.timer;if(!t)return;if(adv(t,Date.now())){beep();save();if(t.mode=='cd'){tx(true);return}toast(t.wait?(t.ph=='break'?'Focus block complete. Start your break when ready.':'Break over. Start your next focus block when ready.'):(t.ph=='break'?'Break time.':'Back to focus.'));if(view=='timer')R();return}if(view=='timer')paint()}
function ts(){if(S.timer)return;const q=tsFix(),d=$('#td');if(d)q.desc=d.value;const now=Date.now(),m=q.mode,w=pv('w'),cd=+q.cd||60;
 S.timer={sid:now,mode:m,id:q.tid||'',unit:q.unit||'',paper:q.paper||'',desc:String(q.desc||''),date:today(),ph:'work',plen:m=='sw'?0:(m=='cd'?cd:w)*6e4,run:1,t0:now,pacc:0,study:0,brk:0,n:0,wait:0,cfg:{w,sb:pv('sb'),lb:pv('lb'),cyc:pv('cyc'),auto:S.set.autob?1:0},ivs:[]};save();R()}
function tp(){const t=S.timer,now=Date.now();if(!t)return;adv(t,now);if(t.run){t.ivs.push([t.t0,now,t.ph=='work'?'w':'b']);t.pacc+=now-t.t0;t.run=0}save();R()}
function tr(){const t=S.timer;if(!t||t.run)return;t.run=1;t.wait=0;t.t0=Date.now();save();R()}
function tz(){if(S.timer&&confirm('Discard this running session without saving it?')){S.timer=null;save();R()}}
function splitDays(ivs){const m={};for(const[a,e,k]of ivs){let s=a;while(s<e){const d=new Date(s),nx=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime(),g=Math.min(e,nx),key=ymd(s),o=m[key]||(m[key]={w:0,b:0});o[k]+=g-s;s=g}}return m}
function tx(auto){const t=S.timer;if(!t)return;const now=Date.now();adv(t,now);const iv=t.ivs.slice();if(t.run)iv.push([t.t0,now,t.ph=='work'?'w':'b']);
 const m=splitDays(iv),days=Object.keys(m).sort(),tot=days.reduce((a,d)=>a+m[d].w,0);S.timer=null;
 if(S.sessions.some(x=>x.sid==t.sid)){save();R();return}
 if(tot<1e4){save();R();return toast('Sessions shorter than 10 seconds are not saved.')}
 const a=ALL.find(x=>x.id==t.id);days.forEach((d,i)=>{if(m[d].w<1)return;S.sessions.push({id:t.sid+i,sid:t.sid,date:d,study:m[d].w,brk:m[d].b,tid:a?a.id:'',name:a?a.n:'',unit:a?a.u:t.unit||'',paper:a?a.p:t.paper||'',mode:t.mode,desc:t.desc||''})});
 if(a){const q=T(a.id);q.hrs+=tot/36e5;if(q.st==ST[0])q.st=ST[1]}
 save();R();toast((auto?'Countdown complete. ':'')+'Session saved: '+fd(tot)+'.')}
function dls(id){const x=S.sessions.find(s=>s.id==id);if(!x||!confirm('Delete this session?'))return;S.sessions=S.sessions.filter(s=>s.id!=id);if(x.tid)T(x.tid).hrs=Math.max(0,T(x.tid).hrs-hrs(x.study));save();R()}
window.addEventListener('beforeunload',e=>{if(S&&S.timer&&S.timer.run){e.preventDefault();e.returnValue=''}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tickAll()});

/* ---------- Phase 3: syllabus management ---------- */
let SF={q:'',st:'',g:'',pr:''},STID=null,SC=0,LD=null;const OPEN=new Set(),PRI=['High','Medium','Low'],SPN={'Not Started':'st0','In Progress':'st1','Completed':'st2'};
const GR=[['Prelims GS',['Prelims · GS Paper I']],['CSAT',['Prelims · GS Paper II (CSAT)']],['Mains GS I',['Mains · GS Paper I']],['Mains GS II',['Mains · GS Paper II']],['Mains GS III',['Mains · GS Paper III']],['Mains GS IV',['Mains · GS Paper IV']],['Essay',['Mains · Essay']],['Optional Paper I',['Mains · Optional Paper I']],['Optional Paper II',['Mains · Optional Paper II']],['Qualifying languages',['Mains · Indian Language (qualifying)','Mains · English (qualifying)']]];
const isC=id=>S.custom.some(c=>c.id==id);
function UL(p){return[...new Set([...Object.keys(SY[p]||{}),...S.custom.filter(c=>c.p==p).map(c=>c.u)])]}
function gstat(ps){const l=ALL.filter(x=>ps.includes(x.p)),d=l.filter(x=>DONE(T(x.id).st)).length;return{t:l.length,d,ip:l.filter(x=>T(x.id).st==ST[1]).length,p:l.length?100*d/l.length:0}}
const filtOn=()=>!!(SF.q||SF.st||SF.pr);
function tpass(x){const d=T(x.id);if(SF.st&&d.st!=SF.st)return false;if(SF.pr&&d.pri!=SF.pr)return false;if(SF.g!==''&&!GR[+SF.g][1].includes(x.p))return false;if(SF.q&&!(x.n+' '+x.u+' '+x.p+' '+d.notes+' '+d.ref).toLowerCase().includes(SF.q.toLowerCase()))return false;return true}
function chips(x){const d=T(x.id),od=d.target&&d.target<today()&&!DONE(d.st);return'<span class="chip '+SPN[d.st]+'" role="button" tabindex="0" title="Tap to change status" onclick="cyc(\''+x.id+'\')" onkeydown="if(event.key==\'Enter\')this.click()">'+d.st+'</span><span class="chip pr'+d.pri[0]+'">'+d.pri+'</span>'+(d.target?'<span class="chip'+(od?' od':'')+'">'+(od?'Overdue · ':'Target · ')+d.target+'</span>':'')+((d.hrs>0||d.est>0)?'<span class="chip">'+d.hrs.toFixed(1)+(d.est?' / '+d.est:'')+' h</span>':'')+(isC(x.id)?'<span class="chip cu">Custom</span>':'')}
function trow(x){return'<div class="tr'+(LD==x.id?' flash':'')+'"><input type="checkbox" class="ck" aria-label="Mark as completed" '+(DONE(T(x.id).st)?'checked':'')+' onchange="cmp(\''+x.id+'\',this.checked)"><div class="tn"><a href="javascript:void(0)" onclick="openT(\''+x.id+'\')">'+esc(x.n)+'</a><div class="chips">'+chips(x)+'</div></div></div>'}
function treeH(){const fo=filtOn();let o='';for(const p of Object.keys(SY)){if(SF.g!==''&&!GR[+SF.g][1].includes(p))continue;let pu='',pt=0,pd=0;
 for(const u of UL(p)){const all=ALL.filter(x=>x.p==p&&x.u==u),L=all.filter(tpass),d=all.filter(x=>DONE(T(x.id).st)).length;pt+=all.length;pd+=d;if(fo&&!L.length)continue;const k=p+'|'+u;
  pu+='<details data-k="'+esc(k)+'"'+(fo||OPEN.has(k)?' open':'')+' ontoggle="tg(this)"><summary>'+esc(u)+' <small class="mu">'+d+'/'+all.length+'</small></summary>'+(L.length?Q(L,trow):'<p class="mu">No topics yet. Add your own with "Add a custom topic" above.</p>')+'</details>'}
 if(fo&&!pu)continue;if(!pu)continue;
 o+='<details data-k="'+esc(p)+'"'+(fo||OPEN.has(p)?' open':'')+' ontoggle="tg(this)"><summary>'+esc(p)+' <small class="mu">'+pd+'/'+pt+' · '+(pt?(100*pd/pt).toFixed(0):0)+'%</small><div class="p"><i style="width:'+(pt?100*pd/pt:0)+'%"></i></div></summary>'+pu+'</details>'}
 return o||'<p class="mu">No topics match these filters.</p>'}
function tree(){const e=$('#tree');if(e)e.innerHTML=treeH()}
function tg(el){if(filtOn())return;el.open?OPEN.add(el.dataset.k):OPEN.delete(el.dataset.k)}
function ex(on){OPEN.clear();if(on)for(const p in SY){OPEN.add(p);UL(p).forEach(u=>OPEN.add(p+'|'+u))}tree()}
function sg(i){SF.g=SF.g===String(i)?'':String(i);if(SF.g!=='')GR[+SF.g][1].forEach(p=>OPEN.add(p));R()}
function stat(id,s){if(!ST.includes(s))return;const d=T(id),a=ALL.find(x=>x.id==id);if(DONE(s))mkBL(d);d.st=s;
 if(DONE(s)){if(!d.done)d.done=today();LD=id;if(!S.revs.some(r=>r.id==id&&!r.done))S.revs.push({id,rid:Date.now()+Math.random(),name:a?a.n:id,n:Math.min(5,d.rev+1),due:add(today(),ivs()[Math.min(d.rev,4)]),cd:d.done})}else d.done='';
 save();R();setTimeout(()=>{if(LD==id)LD=null},1500)}
function cmp(id,c){stat(id,c?'Completed':(T(id).hrs>0?'In Progress':'Not Started'))}
function cyc(id){stat(id,ST[(ST.indexOf(T(id).st)+1)%ST.length])}
function openT(id){SC=window.scrollY;STID=id;R();window.scrollTo(0,0)}
function backT(){STID=null;R();window.scrollTo(0,SC)}
function setT(id,k,v){const d=T(id);let val=v;const bad=m=>{toast(m);R()};
 if(k=='pri'){if(!PRI.includes(v))return bad('Invalid priority.')}
 else if(k=='est'||k=='hrs'){const mx=k=='est'?500:2000;val=v===''?0:+v;if(!Number.isFinite(val)||val<0||val>mx)return bad('Hours must be between 0 and '+mx+'.')}
 else if(k=='target'){if(v!==''&&(!/^\d{4}-\d\d-\d\d$/.test(v)||ymd(new Date(v+'T00:00'))!==v))return bad('Enter a valid date.')}
 else if(k=='notes'){if(String(v).length>5000)return bad('Notes can be up to 5000 characters.')}
 else if(k=='ref'){if(String(v).length>500)return bad('References can be up to 500 characters.')}
 else return;if(k=='target')mkBL(d);d[k]=val;save();R()}
function useSess(id){T(id).hrs=S.sessions.filter(s=>s.tid==id).reduce((a,s)=>a+s.study,0)/36e5;save();R()}
function apc(){const p=$('#ap').value,l=$('#ul');if(l)l.innerHTML=UL(p).map(u=>'<option value="'+esc(u)+'">').join('')}
function chk(p,u,n,self,est){if(!SY[p])return'Choose a paper.';if(!u||u.length>80)return'Subject must be 1 to 80 characters.';if(!n||n.length>120)return'Topic name must be 1 to 120 characters.';if(!Number.isFinite(est)||est<0||est>500)return'Estimated hours must be between 0 and 500.';
 if(ALL.some(x=>x.id!=self&&x.p==p&&x.u.toLowerCase()==u.toLowerCase()&&x.n.toLowerCase()==n.toLowerCase()))return'That topic already exists in this subject.';return''}
function addCustom(){const p=$('#ap').value,u=$('#au').value.trim(),n=$('#an').value.trim(),pr=$('#apr').value,e=$('#ae').value===''?0:+$('#ae').value,m=chk(p,u,n,'',e);if(m)return toast(m);if(!PRI.includes(pr))return toast('Choose a priority.');
 const uu=UL(p).find(x=>x.toLowerCase()==u.toLowerCase())||u,id='c|'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);S.custom.push({id,p,u:uu,n});const d=T(id);d.pri=pr;d.est=e;buildAll();OPEN.add(p);OPEN.add(p+'|'+uu);LD=id;save();R();toast('Custom topic added.');setTimeout(()=>{if(LD==id)LD=null},1500)}
function editC(id){const c=S.custom.find(x=>x.id==id);if(!c)return;const n=$('#cn').value.trim(),p=$('#cp').value,u=$('#cu').value.trim(),m=chk(p,u,n,id,0);if(m)return toast(m);
 const uu=UL(p).find(x=>x.toLowerCase()==u.toLowerCase())||u;c.n=n;c.p=p;c.u=uu;buildAll();OPEN.add(p);OPEN.add(p+'|'+uu);save();R();toast('Topic updated.')}
function delC(id){const c=S.custom.find(x=>x.id==id);if(!c)return;if(!confirm('Delete the custom topic "'+c.n+'"?\nIts notes, recorded hours and revision schedule will be removed. Your study sessions are kept.'))return;
 S.custom=S.custom.filter(x=>x.id!=id);delete S.topics[id];S.revs=S.revs.filter(r=>r.id!=id);S.sessions.forEach(s=>{if(s.tid==id)s.tid=''});if(S.tsel&&S.tsel.tid==id)S.tsel.tid='';STID=null;buildAll();save();R();toast('Custom topic deleted.')}
function tdetail(id){const x=ALL.find(a=>a.id==id),d=T(id),c=isC(id),ss=S.sessions.filter(s=>s.tid==id).sort((a,b)=>b.id-a.id),sm=ss.reduce((a,s)=>a+s.study,0)/36e5,rv=S.revs.filter(r=>r.id==id).sort((a,b)=>a.n-b.n||(a.done?-1:1)),
 f=(l,h)=>'<label class="fv"><span>'+l+'</span>'+h+'</label>',op=(a,v)=>a.map(s=>'<option'+(s==v?' selected':'')+'>'+s+'</option>').join('');
 return'<p><button class="s" onclick="backT()">← Back to syllabus</button></p><h2>'+esc(x.n)+'</h2><p class="mu">'+esc(x.p+' › '+x.u)+(c?' · Custom topic':'')+'</p>'+
 '<div class="sg"><div class="g2">'+f('Status','<select onchange="stat(\''+id+'\',this.value)">'+op(ST,d.st)+'</select>')+f('Priority','<select onchange="setT(\''+id+'\',\'pri\',this.value)">'+op(PRI,d.pri)+'</select>')+
 f('Target completion date','<input type="date" value="'+d.target+'" onchange="setT(\''+id+'\',\'target\',this.value)">')+f('Estimated hours','<input type="number" min="0" max="500" step="0.5" value="'+d.est+'" onchange="setT(\''+id+'\',\'est\',this.value)">')+
 f('Actual hours','<input type="number" min="0" max="2000" step="0.1" value="'+d.hrs.toFixed(2)+'" onchange="setT(\''+id+'\',\'hrs\',this.value)">')+f('Revisions completed','<input value="'+d.rev+' of 5" disabled>')+'</div>'+
 '<p class="mu">'+(d.done?'Completed on '+d.done+'. ':'')+(Math.abs(sm-d.hrs)>0.01?'Sessions linked to this topic total '+sm.toFixed(2)+' h. <button class="s" onclick="useSess(\''+id+'\')">Use session total</button>':'')+'</p>'+
 f('Personal notes','<textarea rows="6" maxlength="5000" onchange="setT(\''+id+'\',\'notes\',this.value)">'+esc(d.notes)+'</textarea>')+f('References (NCERT, books, notes)','<input maxlength="500" value="'+esc(d.ref)+'" onchange="setT(\''+id+'\',\'ref\',this.value)">')+'</div>'+
 (c?'<div class="sg"><h3>Edit custom topic</h3><div class="g2">'+f('Topic name','<input id="cn" maxlength="120" value="'+esc(x.n)+'">')+f('Paper','<select id="cp">'+Object.keys(SY).map(p=>'<option'+(p==x.p?' selected':'')+' value="'+esc(p)+'">'+esc(p)+'</option>').join('')+'</select>')+f('Subject / section','<input id="cu" maxlength="80" value="'+esc(x.u)+'">')+'</div><div class="row"><button onclick="editC(\''+id+'\')">Save changes</button><button class="d" onclick="delC(\''+id+'\')">Delete topic</button></div></div>':'')+
 '<h3>Linked study sessions ('+ss.length+' · '+sm.toFixed(1)+' h)</h3>'+(ss.length?Q(ss,s=>'<div class="sc"><div><b>'+s.date+'</b><br><small>'+smode(s)+(s.desc?' · '+esc(s.desc):'')+'</small></div><div class="sd"><b>'+fd(s.study)+'</b></div></div>'):'<p class="mu">No sessions recorded for this topic yet. Pick it on the Timer screen to link sessions.</p>')+
 '<h3>Revisions</h3>'+(rv.length?Q(rv,r=>'<div class="sc"><div><b>Revision '+r.n+'</b><br><small>'+(r.done?'Done on '+r.done:'Due '+r.due)+'</small></div></div>'):'<p class="mu">Revisions are scheduled automatically when you mark this topic completed.</p>')}

/* ---------- Phase 4: revision manager ---------- */
let RV={tab:'today',day:'',ym:'',paper:'',unit:''};
const ivs=()=>S.set.iv||IV,MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const rinfo=r=>{const a=ALL.find(x=>x.id==r.id);return{a,p:a?a.p:'',u:a?a.u:''}};
function rmatch(r){const i=rinfo(r);return(!RV.paper||i.p==RV.paper)&&(!RV.unit||i.u==RV.unit)}
const rtext=n=>n==0?'Due today':n==1?'Due tomorrow':n>1?'In '+n+' days':(n==-1?'1 day overdue':(-n)+' days overdue');
const rfind=rid=>S.revs.find(x=>String(x.rid)==String(rid));
function rcard(r){const i=rinfo(r),d=T(r.id),t=today(),dd=diff(r.due,t),od=!r.done&&dd<0;
 return'<div class="rv'+(od?' rvod':'')+'"><div class="rvh"><b>'+esc(i.a?i.a.n:r.name)+'</b><span class="chip">Revision '+r.n+' of 5</span>'+(d.hard?'<span class="chip hardc">★ Difficult</span>':'')+'</div><small class="mu">'+esc(i.p?i.p+' › '+i.u:'')+'</small>'+
 '<div class="rvm"><span>Topic completed: '+(d.done||r.cd||'—')+'</span><span>'+(r.done?'Revised on: '+r.done:'Scheduled: '+r.due)+'</span>'+(r.done?'':'<span class="dd'+(od?' odt':'')+'">'+rtext(dd)+'</span>')+'</div>'+
 (r.done?'':'<div class="rva"><button onclick="rdn(\''+r.rid+'\')">Mark as revised</button><select aria-label="Postpone" onchange="post(\''+r.rid+'\',this.value)"><option value="">Postpone…</option><option value="1">+1 day</option><option value="3">+3 days</option><option value="7">+7 days</option></select><label class="rl">Reschedule <input type="date" min="'+t+'" value="'+r.due+'" onchange="resch(\''+r.rid+'\',this.value)"></label><button class="s" onclick="hard(\''+r.id+'\')">'+(d.hard?'Unmark difficult':'★ Mark as difficult')+'</button></div>')+'</div>'}
function hcard(id){const i=rinfo({id}),d=T(id),nx=S.revs.find(r=>r.id==id&&!r.done);return'<div class="rv"><div class="rvh"><b>'+esc(i.a.n)+'</b><span class="chip hardc">★ Difficult</span></div><small class="mu">'+esc(i.p+' › '+i.u)+'</small><div class="rvm"><span>Revisions done: '+d.rev+' of 5</span><span>'+(nx?'Next: '+nx.due+' ('+rtext(diff(nx.due,today()))+')':'No revision scheduled')+'</span></div><div class="rva"><button class="s" onclick="hard(\''+id+'\')">Unmark difficult</button></div></div>'}
function calH(){const[Y,M]=RV.ym.split('-').map(Number),dim=new Date(Y,M,0).getDate(),lead=(new Date(Y,M-1,1).getDay()+6)%7,t=today(),mp={};
 S.revs.filter(rmatch).forEach(r=>{const k=r.done||r.due,o=mp[k]||(mp[k]={p:0,d:0});r.done?o.d++:o.p++});let c='';for(let i=0;i<lead;i++)c+='<span></span>';
 for(let d=1;d<=dim;d++){const k=Y+'-'+z2(M)+'-'+z2(d),m=mp[k]||{p:0,d:0};c+='<button class="s cell'+(m.p?' pend':'')+(m.p&&k<t?' ovd':'')+(!m.p&&m.d?' dn':'')+(k==t?' tdy':'')+(k==RV.day?' sel':'')+'" aria-label="'+d+' '+MN[M-1]+' '+Y+(m.p?', '+m.p+' due':'')+(m.d?', '+m.d+' revised':'')+'" onclick="rvDay(\''+k+'\')">'+d+(m.p?'<i>'+m.p+'</i>':'')+'</button>'}
 return'<div class="cal"><div class="calh"><button class="s" onclick="rvM(-1)" aria-label="Previous month">‹</button><b>'+MN[M-1]+' '+Y+'</b><button class="s" onclick="rvM(1)" aria-label="Next month">›</button></div><div class="calg">'+'MTWTFSS'.split('').map(x=>'<small>'+x+'</small>').join('')+c+'</div></div>'}
function rvM(n){const[Y,M]=RV.ym.split('-').map(Number),d=new Date(Y,M-1+n,1);RV.ym=d.getFullYear()+'-'+z2(d.getMonth()+1);R()}
function rvDay(k){RV.day=RV.day==k?'':k;R()}
function rvTab(t){RV.tab=t;R()}
function rvF(k,v){RV[k]=v;if(k=='paper')RV.unit='';R()}
function rdn(rid){const r=rfind(rid);if(!r||r.done)return;const d=T(r.id),t=today();r.done=t;d.rev=Math.max(d.rev,r.n);
 if(r.n<5&&!S.revs.some(x=>x.id==r.id&&!x.done))S.revs.push({id:r.id,rid:Date.now()+Math.random(),name:r.name,n:r.n+1,due:add(t,ivs()[r.n]),cd:d.done||r.cd||''});save();R()}
function post(rid,v){const r=rfind(rid),n=+v;if(!r||r.done||v==='')return;if(!Number.isInteger(n)||n<1||n>365){toast('Choose 1 to 365 days.');return R()}const base=r.due>today()?r.due:today();r.due=add(base,n);r.post=(r.post||0)+1;save();R();toast('Postponed to '+r.due+'.')}
function resch(rid,v){const r=rfind(rid);if(!r||r.done)return;if(!/^\d{4}-\d\d-\d\d$/.test(v)||ymd(new Date(v+'T00:00'))!==v){toast('Enter a valid date.');return R()}if(v<today()){toast('Pick today or a later date.');return R()}r.due=v;save();R();toast('Rescheduled to '+v+'.')}
function hard(id){const d=T(id);d.hard=!d.hard;save();R()}
function setIv(i,v){const n=+v;if(v===''||!Number.isInteger(n)||n<1||n>365){toast('Each interval must be a whole number of days from 1 to 365.');return R()}const a=S.set.iv.slice();a[i]=n;S.set.iv=a;save();R()}
function resetIv(){S.set.iv=IV.slice();save();R()}

/* ---------- Phase 5: backlog planner ---------- */
let BF={pri:'',sub:'',due:'over'},BE=new Set(),BP=null;const PW={High:0,Medium:1,Low:2};
function mkBL(d){if(d.target&&d.target<today()&&!DONE(d.st)&&!d.bl)d.bl=add(d.target,1)}
const pendTasks=()=>ALL.filter(x=>{const d=T(x.id);return d.target&&!DONE(d.st)});
const rem=(d,as)=>Math.max(.5,(d.est>0?d.est:as)-d.hrs);
function bstats(){const t=today(),P=pendTasks(),od=P.filter(x=>T(x.id).target<t);return{pend:P.length,over:od.length,over7:od.filter(x=>diff(t,T(x.id).target)>7).length,high:P.filter(x=>T(x.id).pri=='High').length,cleared:ALL.filter(x=>{const d=T(x.id);return d.bl&&DONE(d.st)}).length}}
function bpass(x,ign){const d=T(x.id),n=diff(today(),d.target);if(BF.pri&&d.pri!=BF.pri)return false;if(BF.sub&&x.p+'|'+x.u!=BF.sub)return false;
 if(!ign){const f=BF.due;if(f=='over'&&!(n>0))return false;if(f=='over7'&&!(n>7))return false;if(f=='today'&&n!=0)return false;if(f=='week'&&!(n<0&&n>=-7))return false;if(f=='later'&&!(n<-7))return false}return true}
const btext=n=>n>0?n+(n==1?' day':' days')+' overdue':n==0?'Due today':'In '+(-n)+(n==-1?' day':' days');
function bcard(x){const d=T(x.id),n=diff(today(),d.target),id=x.id,o=n>0;
 return'<div class="rv'+(o?' rvod':'')+'"><div class="rvh"><b>'+esc(x.n)+'</b><span class="chip pr'+d.pri[0]+'">'+d.pri+'</span><span class="chip '+SPN[d.st]+'">'+d.st+'</span></div><small class="mu">'+esc(x.p+' › '+x.u)+'</small>'+
 '<div class="rvm"><span>Target: '+d.target+'</span><span class="dd'+(o?' odt':'')+'">'+btext(n)+'</span><span>Estimate: '+(d.est?d.est+' h':'not set')+(d.hrs>0?' · done '+d.hrs.toFixed(1)+' h':'')+'</span></div>'+
 '<div class="rva"><button'+(d.st==ST[1]?' disabled':'')+' onclick="stat(\''+id+'\',\'In Progress\')">'+(d.st==ST[1]?'In progress':'Mark in progress')+'</button><button onclick="stat(\''+id+'\',\'Completed\')">Mark completed</button><label class="rl">Reschedule <input type="date" min="'+today()+'" value="'+d.target+'" onchange="resB(\''+id+'\',this.value)"></label><button class="s" onclick="bEdit(\''+id+'\')">'+(BE.has(id)?'Close editor':'Edit task')+'</button></div>'+
 (BE.has(id)?'<div class="g2" style="margin-top:8px"><label class="fv"><span>Priority</span><select onchange="setT(\''+id+'\',\'pri\',this.value)">'+PRI.map(p=>'<option'+(p==d.pri?' selected':'')+'>'+p+'</option>').join('')+'</select></label><label class="fv"><span>Target date (clear to remove from the backlog)</span><input type="date" value="'+d.target+'" onchange="setT(\''+id+'\',\'target\',this.value)"></label><label class="fv"><span>Estimated hours</span><input type="number" min="0" max="500" step="0.5" value="'+d.est+'" onchange="setT(\''+id+'\',\'est\',this.value)"></label></div>':'')+'</div>'}
function bEdit(id){BE.has(id)?BE.delete(id):BE.add(id);R()}
function resB(id,v){if(!/^\d{4}-\d\d-\d\d$/.test(v)||ymd(new Date(v+'T00:00'))!==v){toast('Enter a valid date.');return R()}if(v<today()){toast('Pick today or a later date.');return R()}const d=T(id);mkBL(d);d.target=v;save();R();toast('Rescheduled to '+v+'.')}
function bpOpen(){BP={pk:PK,h:14,hrs:S.set.daily,as:1.5,inc:0,items:[],skipped:[],days:[],built:false};R()}
function bpCancel(){BP=null;R()}
function bpSet(k,v){const L={h:[1,90,1],hrs:[.5,24,0],as:[.5,24,0]}[k],n=v===''?NaN:+v;if(k=='inc'){BP.inc=v?1:0}else{if(!L||!Number.isFinite(n)||n<L[0]||n>L[1]||(L[2]&&!Number.isInteger(n))){toast('Enter a '+(L&&L[2]?'whole number ':'number ')+'between '+L[0]+' and '+L[1]+'.');return R()}BP[k]=n}BP.items=[];BP.skipped=[];BP.built=false;R()}
function bpBuild(){const q=BP,t=today(),st=q.inc?t:add(t,1),days=[...Array(q.h)].map((_,i)=>add(st,i)),todo=ALL.filter(x=>{const d=T(x.id);return d.target&&d.target<t&&!DONE(d.st)&&bpass(x,true)}),ids=new Set(todo.map(x=>x.id)),load={};days.forEach(k=>load[k]=0);
 pendTasks().forEach(x=>{if(ids.has(x.id))return;const d=T(x.id);if(d.target in load)load[d.target]+=rem(d,q.as)});
 todo.sort((a,b)=>{const A=T(a.id),B=T(b.id);return PW[A.pri]-PW[B.pri]||(A.target<B.target?-1:A.target>B.target?1:0)||rem(A,q.as)-rem(B,q.as)});const items=[],skipped=[];
 todo.forEach(x=>{const d=T(x.id),r=rem(d,q.as);let k=days.find(k=>load[k]+r<=q.hrs+1e-9),over=0;if(!k&&r>q.hrs){k=days.find(k=>load[k]==0);over=1}if(k){load[k]+=r;items.push({id:x.id,from:d.target,to:k,over})}else skipped.push(x.id)});
 q.items=items;q.skipped=skipped;q.days=days;q.built=true;R()}
function bpMove(id,v){const i=BP&&BP.items.find(x=>x.id==id);if(!i)return;if(!/^\d{4}-\d\d-\d\d$/.test(v)||ymd(new Date(v+'T00:00'))!==v){toast('Enter a valid date.');return R()}if(v<today()){toast('Pick today or a later date.');return R()}i.to=v;R()}
function bpDrop(id){if(!BP)return;BP.items=BP.items.filter(x=>x.id!=id);R()}
function bpOver(){const q=BP,m={};q.items.forEach(i=>m[i.to]=(m[i.to]||0)+rem(T(i.id),q.as));pendTasks().forEach(x=>{if(q.items.some(i=>i.id==x.id))return;const d=T(x.id);m[d.target]=(m[d.target]||0)+rem(d,q.as)});return Object.keys(m).filter(k=>k>=today()&&m[k]>q.hrs+1e-9)}
function bpApply(){const q=BP;if(!q)return;const ok=q.items.filter(i=>ALL.some(a=>a.id==i.id)&&!DONE(T(i.id).st)),ch=ok.filter(i=>T(i.id).target!=i.to);if(!ch.length)return toast('Nothing to change.');const ov=bpOver();
 if(!confirm('Change the target date of '+ch.length+' topic'+(ch.length>1?'s':'')+'?\nTheir current dates will be replaced.'+(ov.length?'\n'+ov.length+' day'+(ov.length>1?'s':'')+' will be over your daily hours.':'')+'\nYou can undo this afterwards.'))return;
 S.lastPlan={at:today(),items:ch.map(i=>[i.id,T(i.id).target])};ch.forEach(i=>{const d=T(i.id);mkBL(d);d.target=i.to});BP=null;save();R();toast(ch.length+' topic'+(ch.length>1?'s':'')+' rescheduled.')}
function bUndo(){const lp=S.lastPlan;if(!lp)return;if(!confirm('Restore the previous target dates for '+lp.items.length+' topic'+(lp.items.length>1?'s':'')+'?'))return;lp.items.forEach(([id,o])=>{if(S.topics[id])S.topics[id].target=o});S.lastPlan=null;save();R();toast('Previous dates restored.')}
function bpH(){const q=BP,nm=id=>esc((ALL.find(a=>a.id==id)||{n:id}).n),f=(l,h)=>'<label class="fv"><span>'+l+'</span>'+h+'</label>';
 return'<div class="sg"><h3>Distribute overdue topics</h3><small>Spreads overdue topics (matching the priority and subject filters above) over the coming days, high priority first. Topics already scheduled on a day count towards that day. Nothing changes until you apply the plan.</small><div class="g2">'+
 f('Planning horizon (days)','<input type="number" min="1" max="90" step="1" value="'+q.h+'" onchange="bpSet(\'h\',this.value)">')+f('Hours per day for study','<input type="number" min="0.5" max="24" step="0.5" value="'+q.hrs+'" onchange="bpSet(\'hrs\',this.value)">')+
 f('Hours to assume when a topic has no estimate','<input type="number" min="0.5" max="24" step="0.5" value="'+q.as+'" onchange="bpSet(\'as\',this.value)">')+f('Start from','<select onchange="bpSet(\'inc\',this.value==\'1\')"><option value="0"'+(q.inc?'':' selected')+'>Tomorrow</option><option value="1"'+(q.inc?' selected':'')+'>Today</option></select>')+'</div><div class="row"><button class="'+(q.built&&q.items.length?'s':'')+'" onclick="bpBuild()">'+(q.built?'Rebuild plan':'Build plan')+'</button>'+(q.built&&q.items.length?'<button onclick="bpApply()">Apply schedule</button>':'')+'<button class="s" onclick="bpCancel()">Close planner</button></div>'+
 (q.built?'<p><b>'+q.items.length+' topic'+(q.items.length==1?'':'s')+' placed</b>'+(q.skipped.length?', '+q.skipped.length+' could not fit and keep their current dates. Try a longer horizon or more hours per day.':'.')+'</p>'+
  (q.skipped.length?'<p class="mu">Not placed: '+q.skipped.map(nm).join('; ')+'</p>':'')+
  Q(q.items,i=>{const d=T(i.id),x=ALL.find(a=>a.id==i.id);return'<div class="rv"><div class="rvh"><b>'+esc(x.n)+'</b><span class="chip pr'+d.pri[0]+'">'+d.pri+'</span><span class="chip">'+rem(d,q.as).toFixed(1)+' h</span></div><small class="mu">'+esc(x.p+' › '+x.u)+' · was '+i.from+(i.over?' · longer than one day, placed on an empty day':'')+'</small><div class="rva"><label class="rl">New date <input type="date" min="'+today()+'" value="'+i.to+'" onchange="bpMove(\''+i.id+'\',this.value)"></label><button class="s" onclick="bpDrop(\''+i.id+'\')">Leave out</button></div></div>'})+
  '':'')+'</div>'}
function wlH(){const q=BP&&BP.built?BP:null,cap=q?q.hrs:S.set.daily,as=q?q.as:1.5,t=today(),pi=q?new Set(q.items.map(i=>i.id)):new Set(),m={};
 let days=q?q.days.slice():[...Array(14)].map((_,i)=>add(t,i));if(q)q.items.forEach(i=>{if(!days.includes(i.to))days.push(i.to)});days=[...new Set(days)].sort();
 days.forEach(k=>m[k]={e:0,p:0,n:[]});
 pendTasks().forEach(x=>{if(pi.has(x.id))return;const d=T(x.id);if(m[d.target]){m[d.target].e+=rem(d,as);m[d.target].n.push([x.n,0])}});
 if(q)q.items.forEach(i=>{const d=T(i.id);m[i.to].p+=rem(d,as);m[i.to].n.push([ALL.find(a=>a.id==i.id).n,1])});
 const dn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 return'<details class="addc" open><summary>Daily workload'+(q?' with the proposed plan':' (next 14 days)')+'</summary><p class="mu" style="margin:4px 0">Scheduled topics against '+cap+' h per day'+(q?'. Darker bars are proposed.':'. Topics without an estimate count as '+as+' h.')+'</p>'+
 Q(days,k=>{const o=m[k],tot=o.e+o.p,ov=tot>cap+1e-9,w=100/Math.max(cap,tot);return'<details class="wl'+(ov?' wov':'')+'"><summary><span>'+dn[new Date(k+'T00:00').getDay()]+' '+k.slice(5)+'</span><span class="wb"><i class="we" style="width:'+o.e*w+'%"></i><i class="wp" style="width:'+o.p*w+'%"></i></span><span>'+tot.toFixed(1)+' / '+cap+' h'+(ov?' · over':'')+'</span></summary>'+(o.n.length?o.n.map(n=>'<div class="mu">'+(n[1]?'<b>':'')+esc(n[0])+(n[1]?'</b>':'')+'</div>').join(''):'<div class="mu">Nothing scheduled.</div>')+'</details>'})+'</details>'}
boot();
