import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const root=process.cwd(),tmp=path.join(root,'tmp/bloc3/visual-v10');
await fs.mkdir(tmp,{recursive:true});
const modules=process.env.RUNTIME_NODE_MODULES??path.join(root,'tmp/bloc3/build/node_modules');
process.env.RUNTIME_NODE_MODULES=modules;
const require=createRequire(path.join(modules,'resolver.cjs'));
const {Presentation,PresentationFile,FileBlob}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const skill=process.env.BLOC3_PRESENTATION_SKILL??'C:/Users/JOLYDorian/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.11809/skills/presentations';
const python=process.env.BLOC3_PYTHON??'C:/Users/JOLYDorian/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const {finalizePresentation,resolvePresentationFont,applyPresentationChartFont}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const font=resolvePresentationFont({fontFamily:'Arial',availableFonts:['Arial']});
const doc=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/diaporama-30min.json'),'utf8'));
const pilotage=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/pilotage.json'),'utf8'));
const linear=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/linear-2026-09-14.json'),'utf8'));
const indicators=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/indicateurs.json'),'utf8'));
const consolidation=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/consolidation.json'),'utf8'));
const P=Presentation.create({slideSize:{width:1280,height:720}});
const ink='#18312D',green='#28725F',sage='#91AE91',lime='#C5DC83',orange='#C77952',muted='#5D7068',paper='#F5F3EA',gray='#DADFD4';
const tableOwners=[],chartOwners=[],chartContracts=[];
const fmt=m=>`${String(Math.floor(m)).padStart(2,'0')}:${String(Math.round((m%1)*60)).padStart(2,'0')}`;
function text(s,value,x,y,w,h,size=28,bold=false,color=ink){
  const b=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  b.text=value;b.text.style={typeface:font,fontSize:size,bold,color,autoFit:'none'};return b;
}
async function image(s,file,x,y,w,h,fit='contain',crop){
  s.images.add({blob:new Uint8Array(await fs.readFile(path.join(root,file))),contentType:file.endsWith('.png')?'image/png':'image/jpeg',position:{left:x,top:y,width:w,height:h},fit,alt:path.basename(file),...(crop?{crop}:{} )});
}
function heading(s,title){text(s,title,64,42,1152,110,46,true);}
function footer(s,item,light=false){text(s,`${item.nature}    ${item.minutes?`${fmt(item.startMinute)} à ${fmt(item.endMinute)}`:'Questions du jury'}    ${item.number}`,64,672,1152,25,16,false,light?'#EAF1E6':muted);}
function takeaway(s,value,y=592){text(s,value,72,y,1136,63,28,true,green);}
function groups(s,items,y=210,highlight=1){const width=1136/items.length;items.forEach(([big,label,detail],i)=>{const x=72+i*width;text(s,big,x,y,width-36,110,76,true,i===highlight?green:ink);text(s,label,x,y+134,width-36,95,30,true,green);if(detail)text(s,detail,x,y+252,width-36,104,25);});}
function table(s,rows,widths,number,top=185,height=422,fontSize=24){
  const t=s.tables.add({rows:rows.length,columns:rows[0].length,left:64,top,width:1152,height,values:rows,columnWidths:widths});
  t.borders.assign({style:'solid',fill:paper,width:2});
  for(let r=0;r<rows.length;r++){t.rows[r].height=height/rows.length;for(let c=0;c<rows[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?green:r%2?'#E9EEE4':paper;cell.text.style={typeface:font,fontSize,bold:r===0,color:r===0?'#FFFFFF':ink};}}
  tableOwners.push(number);return t;
}
function chart(s,number,categories,series,options={}){
  const config={position:{left:68,top:180,width:800,height:420},categories,series,barOptions:{direction:'bar',grouping:'clustered',gapWidth:80},hasLegend:false,titlePlacement:'none',chartFill:paper,plotAreaFill:paper,chartLine:{fill:'none',width:0},plotAreaLine:{fill:'none',width:0},xAxis:{visible:true,min:0,textStyle:{typeface:font,fontSize:22,fill:muted},majorGridlines:null,line:{fill:'none',width:0}},yAxis:{visible:true,min:0,textStyle:{typeface:font,fontSize:24,fill:ink},majorGridlines:{fill:'#DBDFD5',width:1},line:{fill:'none',width:0}},dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:font,fontSize:26,bold:true,fill:ink}},legend:{position:'bottom',overlay:false,textStyle:{typeface:font,fontSize:22,fill:ink}},...options};
  const ch=s.charts.add(options.type??'bar',config);applyPresentationChartFont(ch,{fontFamily:font,availableFonts:[font]});chartOwners.push(number);chartContracts.push({slide:number,categories,series:series.map(v=>({name:v.name,values:v.values}))});return ch;
}
function aside(s,value,label,detail){text(s,value,912,235,300,100,66,true,green);text(s,label,912,346,300,85,28,true);if(detail)text(s,detail,912,463,300,143,25,false,muted);}
const mainTitles={2:'Une sortie, deux points de vue',3:'Des preuves réelles, un cas explicite',4:'Le travail avance jusqu’à la recette',5:'Le chemin vers la démonstration',6:'Qui fait quoi ?',7:'5 heures de plus à anticiper',8:'232 € de marge sous le plafond',9:'Le chef de projet approche sa limite',10:'Des risques qui déclenchent une action',11:'Le choix du build standalone',12:'Une demande qui dépasse le lot',13:'Un désaccord à traiter ensemble',14:'La décision doit rester accessible',15:'La cible : l’autonomie',16:'6 heures pour réduire les écarts',17:'Trois rendez-vous pour décider',18:'La satisfaction reste à mesurer',19:'Place à la démonstration',20:'Trouver un partenaire',21:'Retrouver les participants',22:'Un périmètre démontré'};
let elapsed=0;
for(const item of doc.slides){
  const s=P.slides.add();s.background.fill=paper;
  item.startMinute=elapsed;elapsed+=item.minutes;item.endMinute=elapsed;
  const alignedTitles={2:'Le besoin d’Altitude Grimpe',3:'Un projet, quatre blocs',4:'Le backlog Linear au 14 septembre',5:'Un lot sur quinze jours ouvrés',7:'Les causes des 5 heures supplémentaires',8:'Le budget du lot de démonstration',22:'La transmission à la maintenance',25:'Des contrôles datés et contextualisés'};
  item.title=[3,4,5,6,13,14,15,16,17,18,22,23,25].includes(item.number)?item.title:alignedTitles[item.number]??mainTitles[item.number]??item.title;
  if(item.number===13)item.source+=' Illustration fictive générée avec ImageGen, visuels/equipe-illustration.png. Aucune personne réelle représentée.';
  if(item.number===19)item.source+=' Photo de marque existante escalade-falaise-gros-plan.jpeg, illustration de la pratique.';
  if(item.number===5)item.source+=' Graphique des intervalles de phases à J10, entre les jours relatifs indiqués. Les jalons complets restent dans A01.';
  item.spokenWords=[item.script,item.transition].filter(Boolean).join(' ').trim().split(/\s+/).length;
  if(item.number===8)item.action='Comparer les barres du budget initial, de la prévision et du plafond. Expliquer les 232 euros de marge.';
  if(item.number===11)item.action='Comparer oralement les trois options. Mettre en avant le standalone et le commit qui atteste le choix.';
  item.notes=`REPÈRE : ${fmt(item.startMinute)} à ${fmt(item.endMinute)}. Durée prévue : ${fmt(item.minutes)}.\n\nTEXTE ORAL\n${item.script}\n\n${item.action?'GESTE OU MANIPULATION\n'+item.action+'\n\n':''}${item.transition?'TRANSITION\n'+item.transition+'\n\n':''}SOURCE ET NATURE\n${item.nature}. ${item.source}`;
  s.speakerNotes.textFrame.setText(item.notes);
  if(item.number===1){
    s.background.fill=ink;await image(s,'spity/public/images/brand/escalade-falaise-coucher-soleil.jpeg',700,0,580,720,'cover');
    text(s,'SPITY',64,95,620,120,96,true,'#FFFFFF');
    text(s,'Piloter le projet',64,277,600,90,52,true,'#FFFFFF');
    text(s,'Dorian Joly\nRNCP39583, Bloc 3',64,498,560,92,29,false,lime);
    text(s,'30 minutes, démonstration incluse',64,642,580,45,24,false,'#EAF1E6');continue;
  }
  if(item.number===19){
    await image(s,'spity/public/images/brand/escalade-falaise-gros-plan.jpeg',0,0,1280,720,'cover');
    text(s,item.title,64,40,1152,100,54,true,ink);text(s,'6 min',64,442,440,145,102,true,'#FFFFFF');
    text(s,'Grimpeur, puis club',64,594,700,50,33,true,'#FFFFFF');footer(s,item,true);continue;
  }
  if(item.number===20||item.number===21){
    const matching=item.number===20;
    text(s,matching?'Trouver un\npartenaire':'Retrouver les\nparticipants',48,76,275,205,42,true);
    text(s,matching?'01  Profil\n\n02  Filtres\n\n03  Demande':'01  Événement\n\n02  Inscription\n\n03  Participants',48,352,275,272,26,true,green);
    await image(s,`docs/rncp/bloc-03/preuves/captures/${matching?'matching':'evenements'}-2026-09-15.png`,326,20,936,640,'contain');
    footer(s,item);continue;
  }
  heading(s,item.title);footer(s,item);
  switch(item.number){
    case 2:
      await image(s,'docs/rncp/bloc-03/preuves/captures/lieux-2026-09-15.png',402,168,808,469,'contain');
      text(s,'Grimpeur',72,223,315,60,38,true,green);text(s,'Trouver\nun partenaire',72,307,310,115,35);
      text(s,'Club',72,477,315,60,38,true,green);text(s,'Organiser\nune sortie',72,557,310,85,30);break;
    case 3:{
      const sequence=consolidation.globalPlanning.sequence,capacity=consolidation.globalPlanning.capacityPersonDaysPerWeek;
      let total=0;const starts=sequence.map(x=>{const start=total/capacity;total+=x.personDays;return start;});
      const cats=sequence.map(x=>`${x.title} (${x.personDays} j-h)`),durations=sequence.map(x=>x.personDays/capacity);
      chart(s,3,cats.reverse(),[{name:'Début',values:starts.reverse(),fill:'none',line:{fill:'none',width:0}},{name:'Durée de capacité',values:durations.reverse(),fill:green}],{position:{left:64,top:173,width:1136,height:409},barOptions:{direction:'bar',grouping:'stacked',gapWidth:70},dataLabels:{showValue:false},xAxis:{visible:true,textStyle:{typeface:font,fontSize:25,fill:ink},majorGridlines:null},yAxis:{visible:true,min:0,max:16,majorUnit:4,numberFormatCode:'0" sem."',textStyle:{typeface:font,fontSize:23,fill:ink},majorGridlines:{fill:'#DBDFD5',width:1}}});
      takeaway(s,'79 j-h à 5 j-h/semaine : 15,8 semaines de capacité.',598);
      text(s,'Ordre pédagogique du MVP cible. Le lot B3 est un zoom distinct.',72,641,1136,29,21,false,muted);break;
    }
    case 4:{
      const values=['Backlog','Todo','In Progress','Done'].map(status=>linear.issues.filter(x=>x.status===status).length);
      chart(s,4,['Backlog','À faire','En cours','Terminé'],[{name:'Tickets',values,fill:green,points:[{idx:0,fill:gray},{idx:1,fill:sage},{idx:2,fill:orange},{idx:3,fill:green}]}],{position:{left:64,top:190,width:697,height:367}});
      text(s,'Kanban',808,195,404,70,43,true,green);
      text(s,'2 tâches en réalisation.\nCritères avant clôture.\nJalons pour décider.',808,292,404,178,28);
      text(s,'12 / 24 terminés\n1 annulé exclu, sans pondération.',808,483,404,94,24);
      takeaway(s,'SPI-27 médias, SPI-15 API, SPI-18 formulaire.',594);
      text(s,'Ressources partagées : critères et CR dans A07, code dans Git.',72,638,1136,32,23,false,muted);break;
    }
    case 5:{
      const cats=['Restitution','Recette','Réalisation','Conception','Mesure','Étude'];
      const starts=[14,10,3,2,1,1],ends=[15,14,12,4,3,2];
      chart(s,5,cats,[{name:'Début',values:starts,fill:'none',line:{fill:'none',width:0},dataLabelOverrides:starts.map((_,idx)=>({idx,showValue:false}))},{name:'Intervalle',values:ends.map((end,i)=>end-starts[i]),fill:green,line:{fill:'none',width:0}}],{position:{left:70,top:175,width:1100,height:415},barOptions:{direction:'bar',grouping:'stacked',gapWidth:80},dataLabels:{showValue:false},xAxis:{visible:true,textStyle:{typeface:font,fontSize:24,fill:ink},majorGridlines:null},yAxis:{visible:true,min:1,max:15,majorUnit:2,numberFormatCode:'"J"0',textStyle:{typeface:font,fontSize:22,fill:ink},majorGridlines:{fill:'#DBDFD5',width:1}}});
      takeaway(s,'Recette à J14. Démonstration à J15.',603);break;
    }
    case 6:
      groups(s,[['30 h','Chef de projet','Organiser et arbitrer.'],['72 h','Développeur','Réaliser et corriger.'],['30 h','Camille, QA','Critères et recette.\nT02 et T07.']],204);
      takeaway(s,'Cas fictif : Camille est malentendante, les échanges sont adaptés.',604);break;
    case 7:
      chart(s,7,['Corrections','Recette','Événements','Accès','Planning'],[{name:'Écart en heures',values:['T10','T07','T06','T04','T03'].map(id=>{const t=pilotage.tasks.find(t=>t.id===id);return t.spentHours+t.remainingHours-t.plannedHours;}),valuesFormatCode:'+0" h";-0" h";0" h"',fill:orange,points:[{idx:0,fill:green}],dataLabelOverrides:[0,1,2,3,4].map(idx=>({idx,showValue:true,position:idx===0?'center':'outEnd',...(idx===0?{text:'Corrections −2 h'}:{}),textStyle:{typeface:font,fontSize:idx===0?22:26,bold:true,fill:idx===0?'#FFFFFF':ink}}))}],{position:{left:68,top:180,width:800,height:400},xAxis:{visible:true,tickLabelPosition:'low',textStyle:{typeface:font,fontSize:24,fill:ink},majorGridlines:null},yAxis:{visible:true,min:-3,max:3,majorUnit:1,numberFormatCode:'0" h"',textStyle:{typeface:font,fontSize:22,fill:ink},majorGridlines:{fill:'#DBDFD5',width:1}}});
      aside(s,'+5 h','Écart de charge','Événements : J11 à J12\nRecette : J13 à J14');takeaway(s,'T06 : +1 jour. T07 : +1 jour. La charge et le délai se distinguent.',607);break;
    case 8:
      chart(s,8,['Initial','Prévision','Plafond'],[{name:'Euros',values:[indicators.plannedCost,indicators.forecastCost,indicators.ceiling],valuesFormatCode:'0" €"',fill:green,points:[{idx:0,fill:sage},{idx:1,fill:orange},{idx:2,fill:green}]}]);
      aside(s,'232 €','Marge du lot','195 € au-dessus\nde sa référence.');
      text(s,'Budget global B1 : 38 126 € HT. Exercice B3 distinct.',72,610,1136,48,27,true,green);break;
    case 9:
      chart(s,9,['QA','DEV','CP'],[{name:'Charge',values:[24,64,29],valuesFormatCode:'0" h"',fill:green,dataLabelOverrides:[0,1,2].map(idx=>({idx,showValue:true,position:'center',textStyle:{typeface:font,fontSize:24,fill:'#FFFFFF'}}))},{name:'Marge',values:[6,8,1],valuesFormatCode:'0" h"',fill:gray,dataLabelOverrides:[0,1,2].map(idx=>({idx,showValue:idx!==2,position:'center',textStyle:{typeface:font,fontSize:24,fill:ink}}))}],{position:{left:70,top:185,width:805,height:420},barOptions:{direction:'bar',grouping:'stacked',gapWidth:95},hasLegend:true,dataLabels:{showValue:true,position:'center',textStyle:{typeface:font,fontSize:24,fill:ink}}});
      aside(s,'1 h','Marge du CP','Alerte au-delà de 90 %.\nCP atteint 96,7 %.');takeaway(s,'Limiter les demandes. Protéger les créneaux d’arbitrage.',616);break;
    case 10:{
      const rows=[['','','R01'],['','','R02  R03\nR04  R05'],['','','']];
      const t=s.tables.add({rows:3,columns:3,left:140,top:215,width:555,height:330,values:rows,columnWidths:[185,185,185]});
      t.borders.assign({style:'solid',fill:paper,width:5});
      for(let r=0;r<3;r++){t.rows[r].height=110;for(let c=0;c<3;c++){const score=(3-r)*(c+1),cell=t.getCell(r,c);cell.fill=score>=6?'#E6B08D':score>=3?'#D6DDAD':'#E0E8D7';cell.text.style={typeface:font,fontSize:26,bold:true,color:ink};}}
      tableOwners.push(10);
      text(s,'Probabilité',70,160,250,45,24,true);[3,2,1].forEach((n,i)=>text(s,String(n),92,250+i*110,50,50,28,true));
      text(s,'Impact',144,578,120,43,24,true);[1,2,3].forEach((n,i)=>text(s,String(n),218+i*185,555,70,50,25));
      text(s,'R01  Démonstration\nR02  Charge du CP\nR03  Périmètre\nR04  Inscriptions\nR05  Dépôt',766,208,450,277,29,true);
      text(s,'Responsable, déclencheur\net réponse pour chaque risque.',766,532,450,108,26,false,green);break;
    }
    case 11:
      groups(s,[['01','Retries','Plus de temps.\nCause possiblement masquée.'],['02','Préchauffage','Compilations réduites.\nRoutes à préparer.'],['03','Standalone','Un test proche\ndu livrable.']],200,2);
      takeaway(s,'Choix visible dans Git : 689e59d, 20 juillet 2026.',610);break;
    case 12:
      chart(s,12,['Lot engagé','Avec demande','Plafond'],[{name:'Euros',values:[4465,5005,4697],valuesFormatCode:'0" €"',fill:green,points:[{idx:0,fill:green},{idx:1,fill:orange},{idx:2,fill:sage}]}]);
      aside(s,'Report','Décision du cas','Ajout au lot : +540 €\nDEV : 76 h / 72 h');break;
    case 13:
      await image(s,'docs/rncp/bloc-03/visuels/equipe-illustration.png',360,220,540,335,'contain');
      text(s,'Participatif',72,198,285,50,32,true,green);text(s,'Comparer les options.',72,254,292,74,26);
      text(s,'Persuasif',72,404,285,50,32,true,green);text(s,'Expliquer le report.',72,460,292,74,26);
      text(s,'Directif',941,198,277,50,32,true,green);text(s,'Fixer les critères\nde livraison.',941,254,277,92,26);
      text(s,'Délégatif',941,404,277,50,32,true,green);text(s,'Confier un résultat\net un contrôle.',941,460,277,92,26);
      takeaway(s,'15 minutes préparées. Une décision datée, puis un suivi.',608);break;
    case 14:
      text(s,'Camille, QA malentendante. Équipe fictive Paris / Montréal.',72,155,1136,55,27,false,muted);
      table(s,item.content.rows,item.content.widths,14,220,264);
      text(s,'Paris / Montréal : avis écrits avant décision, glossaire FR/EN.',72,514,1136,46,26,true,green);
      text(s,'Créneau commun avec fuseaux. Reformulation de l’action attendue.',72,558,1136,42,24);
      takeaway(s,'J3 : comprendre. J10 : retrouver. J14 : réaliser sans aide.',615);break;
    case 15:
      table(s,[['Rôle','Compétence','Actuel','Cible'],['CP','Planning et suivi des écarts','1','2'],['CP','Animation et arbitrage','2','2'],['DEV','Développement typé et validation','2','2'],['DEV','Transactions et concurrence','1','2'],['Camille, QA','Recette navigateur reproductible','1','2'],['Camille, QA','Clavier et formulaires','1','2']],[182,650,160,160],15,180,414,24);
      text(s,'0 : non abordé. 1 : accompagné. 2 : autonome. 3 : cas complexes.',72,620,1136,45,23,true,green);break;
    case 16:{
      text(s,'6 h incluses dans les tâches. 60 € de ressources du cas.',72,151,1136,51,27,false,muted);
      table(s,[['Rôle et moment','Atelier prévu','Critère de réussite'],['CP, J3','Tableau de bord : 1 h','Expliquer un écart recalculé.'],['DEV, J9-J12','Concurrence : 2 h','Une place, une inscription acceptée.'],['Camille, J10-J14','Recette : 2 h. Clavier : 1 h.','Rejouer un cas sans aide.']],[249,454,449],16,221,292,24);
      text(s,'Camille : consignes écrites et démonstration sous-titrée.',72,543,1136,50,27,true,green);
      text(s,'À J12, compétence critique indisponible : demande RH à arbitrer.',72,610,1136,48,25);break;
    }
    case 17:
      table(s,[['CR02 à J10','Extrait du compte rendu fictif'],['Écart','Événements J11 à J12. Prévision : 4 465 €.'],['Décision client','Reporter les topos, maintenir les critères de recette.'],['Actions','DEV : T06 à J12. QA : recette à J14. CP : restitution J15.'],['Suite','Claire Martin, Altitude Grimpe. Validation du parcours à J15.']],[250,902],17,194,370,24);
      text(s,'Ressource partagée : A07, compte rendu CR02 et critères.',72,586,1136,46,27,true,green);
      text(s,'J3 : périmètre. J10 : écarts. J15 : validation.',72,633,1136,35,23);break;
    case 18:
      text(s,'Protocole proposé. Résultats réels non mesurés.',72,151,1136,51,27,false,muted);
      table(s,[['Indicateur','Calcul ou méthode','Seuil visé'],['Critères critiques','Acceptés / évalués','100 %'],['Parcours sans aide','Réussis sans aide / tentés','Au moins 80 %'],['Utilité perçue','Moyenne des notes, avec effectif','Au moins 4/5'],['Blocages critiques','Nombre de tâches empêchées','0 ouvert']],[314,564,274],18,217,341,24);
      text(s,'J15 : 2 grimpeurs et 1 club prévus. Date et effectif à relever.',72,589,1136,48,25,true,green);
      text(s,'Sous le seuil : qualifier, affecter une correction, vérifier à nouveau.',72,637,1136,33,22);break;
    case 20:
      await image(s,'docs/rncp/bloc-03/preuves/captures/matching-2026-09-15.png',64,156,1152,479,'contain',undefined);
      break;
    case 21:
      await image(s,'docs/rncp/bloc-03/preuves/captures/evenements-2026-09-15.png',64,156,1152,479,'contain',undefined);
      break;
    case 22:
      table(s,[['Critère à valider','Constat attendu pendant la démonstration'],['Partenaire','Filtres cohérents et état de demande compréhensible.'],['Inscription','Confirmation et capacité respectée.'],['Organisation club','Participant visible et commandes autorisées.'],['Utilisation','Commandes nommées, parcours au clavier.']],[326,826],22,190,353,25);
      takeaway(s,'Décision : accepté, accepté avec réserve ou refusé.',573);
      text(s,'Réserve : action, responsable, échéance. Transmission au Bloc 4.',72,626,1136,40,24);break;
    case 23:
      table(s,[['Activité','CP','DEV','QA','Client'],['Périmètre et critères','R','C','C','A'],['Planification et affectation','A/R','C','C','I'],['Réalisation','A','R','C','I'],['Recette des parcours','A','C','R','C'],['Corrections','A','R','C','I'],['Arbitrage délai, coût, périmètre','R','C','C','A'],['Acceptation de la démonstration','R','C','C','A']],[632,130,130,130,130],23,180,422,24);
      text(s,'R : réalise. A : décide. C : consulté. I : informé. QA : Camille.',72,626,1136,40,23,true,green);break;
    case 24:table(s,item.content.rows,item.content.widths,item.number,185,430);break;
    case 25:
      table(s,[['Demande conditionnelle','Fiche préparée par CP, non envoyée'],['Déclencheur à J12','Compétence critique encore indisponible après formation.'],['Mission et délai','Renfort QA de 4 h à J12-J13, recette transmissible à Camille.'],['Sélection et accueil','Exercice accessible. Disponibilité à confirmer. Accueil CP : 0,5 h.'],['Chiffrage de la variante','180 € de renfort + 22,50 € CP = 202,50 € supplémentaires.'],['Arbitrage avant engagement','Prévision : 4 667,50 €. Marge : 29,50 €. CP : 29,5/30 h.']],[350,802],25,182,426,24);
      text(s,'Variante indépendante, non activée dans le classeur de base.',72,629,1136,40,24,true,green);break;
    default:throw new Error(`Slide inconnue ${item.number}`);
  }
}
assert.equal(elapsed,30);assert.equal(doc.slides.length,25);
await fs.writeFile(path.join(root,'docs/rncp/bloc-03/donnees/support-oral.json'),JSON.stringify(doc.slides,null,2)+'\n');
await fs.writeFile(path.join(tmp,'chart-data.json'),JSON.stringify(chartContracts,null,2)+'\n');
const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(P)).save(candidate);
const finalPath=path.join(root,'output/presentations/spity-bloc-3-30-minutes-visuel-v10.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit',...tableOwners.flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:tableOwners,requiredNativeChartOwnerSlides:chartOwners,materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const checked=await PresentationFile.importPptx(await FileBlob.load(finalPath));
for(let i=0;i<checked.slides.items.length;i++){const png=await checked.export({slide:checked.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));}
console.log(JSON.stringify({file:finalPath,slides:25,minutes:30,chartOwners,tableOwners}));
