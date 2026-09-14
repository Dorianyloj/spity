import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const root=process.cwd(),tmp=path.join(root,'tmp/bloc3/visual-v3');
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
function groups(s,items,y=210){const width=1136/items.length;items.forEach(([big,label,detail],i)=>{const x=72+i*width;text(s,big,x,y,width-36,110,76,true,i===1?green:ink);text(s,label,x,y+134,width-36,95,30,true,green);if(detail)text(s,detail,x,y+252,width-36,104,25);});}
function table(s,rows,widths,number,top=185,height=422){
  const t=s.tables.add({rows:rows.length,columns:rows[0].length,left:64,top,width:1152,height,values:rows,columnWidths:widths});
  t.borders.assign({style:'solid',fill:paper,width:2});
  for(let r=0;r<rows.length;r++){t.rows[r].height=height/rows.length;for(let c=0;c<rows[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?green:r%2?'#E9EEE4':paper;cell.text.style={typeface:font,fontSize:24,bold:r===0,color:r===0?'#FFFFFF':ink};}}
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
  item.title=mainTitles[item.number]??item.title;
  if(item.number===13)item.source+=' Illustration fictive générée avec ImageGen, visuels/equipe-illustration.png. Aucune personne réelle représentée.';
  if(item.number===19)item.source+=' Photo de marque existante escalade-falaise-gros-plan.jpeg, illustration de la pratique.';
  if(item.number===5)item.source+=' Graphique des intervalles de phases à J10, entre les jours relatifs indiqués. Les jalons complets restent dans A01.';
  item.spokenWords=[item.script,item.transition].filter(Boolean).join(' ').trim().split(/\s+/).length;
  if(item.number===4)item.action='Montrer le flux des quatre états et expliquer la limite de deux tâches en cours.';
  if(item.number===5)item.action='Lire les phases du planning, puis montrer la recette à J14 avant la démonstration J15.';
  if(item.number===8)item.action='Comparer les barres du budget initial, de la prévision et du plafond. Expliquer les 232 euros de marge.';
  if(item.number===11)item.action='Comparer oralement les trois options. Mettre en avant le standalone et le commit qui atteste le choix.';
  if(item.number===13)item.action='Présenter les deux besoins DEV et QA. L’illustration représente une équipe fictive.';
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
    await image(s,`docs/rncp/bloc-03/preuves/captures/${matching?'matching':'evenements'}-2026-09-14.png`,326,20,936,640,'contain');
    footer(s,item);continue;
  }
  heading(s,item.title);footer(s,item);
  switch(item.number){
    case 2:
      await image(s,'docs/rncp/bloc-03/preuves/captures/lieux-2026-09-14.png',402,168,808,469,'contain');
      text(s,'Grimpeur',72,223,315,60,38,true,green);text(s,'Trouver\nun partenaire',72,307,310,115,35);
      text(s,'Club',72,477,315,60,38,true,green);text(s,'Organiser\nune sortie',72,557,310,85,30);break;
    case 3:
      groups(s,[['Réel','Logiciel et traces','Code, Git, tests datés.'],['Simulé','Cas de pilotage','Équipe, budget et réunions.']],210);
      break;
    case 4:{
      const t=table(s,[['À faire','En cours','À vérifier','Terminé'],['Besoin clair','Capacité libre','Fonction prête','Critères validés']],[288,288,288,288],4,220,270);
      ['#738E7E',green,'#578577','#18312D'].forEach((fill,c)=>{t.getCell(0,c).fill=fill;t.getCell(0,c).text.style={typeface:font,fontSize:34,bold:true,color:'#FFFFFF'};t.getCell(1,c).text.style={typeface:font,fontSize:28,color:ink};});
      takeaway(s,'2 tâches de réalisation simultanées au maximum',556);break;
    }
    case 5:{
      const cats=['Restitution','Recette','Réalisation','Conception','Étude'];
      const starts=[14,10,3,2,1],ends=[15,14,12,4,3];
      chart(s,5,cats,[{name:'Début',values:starts,fill:'none',line:{fill:'none',width:0},dataLabelOverrides:starts.map((_,idx)=>({idx,showValue:false}))},{name:'Intervalle',values:ends.map((end,i)=>end-starts[i]),fill:green,line:{fill:'none',width:0}}],{position:{left:70,top:175,width:1100,height:415},barOptions:{direction:'bar',grouping:'stacked',gapWidth:80},dataLabels:{showValue:false},xAxis:{visible:true,textStyle:{typeface:font,fontSize:24,fill:ink},majorGridlines:null},yAxis:{visible:true,min:1,max:15,majorUnit:2,numberFormatCode:'"J"0',textStyle:{typeface:font,fontSize:22,fill:ink},majorGridlines:{fill:'#DBDFD5',width:1}}});
      takeaway(s,'Recette à J14. Démonstration à J15.',603);break;
    }
    case 6:
      groups(s,[['30 h','Chef de projet','Organiser et arbitrer.'],['72 h','Développeur','Réaliser et corriger.'],['30 h','Testeur UX','Recetter les parcours.']],204);
      takeaway(s,'Le client valide le périmètre aux trois jalons.',604);break;
    case 7:
      chart(s,7,['Référence','Prévision'],[{name:'Heures',values:[112,117],valuesFormatCode:'0" h"',fill:green,points:[{idx:0,fill:sage},{idx:1,fill:green}]}],{position:{left:68,top:205,width:800,height:350}});
      aside(s,'+5 h','Écart prévu','77 h consommées\n40 h restantes');takeaway(s,'5 tâches terminées sur 10, de tailles différentes.',607);break;
    case 8:
      chart(s,8,['Initial','Prévision','Plafond'],[{name:'Euros',values:[4270,4465,4697],valuesFormatCode:'0" €"',fill:green,points:[{idx:0,fill:sage},{idx:1,fill:orange},{idx:2,fill:green}]}]);
      aside(s,'232 €','Marge restante','195 € au-dessus\ndu budget initial.');break;
    case 9:
      chart(s,9,['QA','DEV','CP'],[{name:'Charge',values:[24,64,29],valuesFormatCode:'0" h"',fill:green,dataLabelOverrides:[0,1,2].map(idx=>({idx,showValue:true,position:'center',textStyle:{typeface:font,fontSize:24,fill:'#FFFFFF'}}))},{name:'Marge',values:[6,8,1],valuesFormatCode:'0" h"',fill:gray,dataLabelOverrides:[0,1,2].map(idx=>({idx,showValue:idx!==2,position:'center',textStyle:{typeface:font,fontSize:24,fill:ink}}))}],{position:{left:70,top:185,width:805,height:420},barOptions:{direction:'bar',grouping:'stacked',gapWidth:95},hasLegend:true,dataLabels:{showValue:true,position:'center',textStyle:{typeface:font,fontSize:24,fill:ink}}});
      aside(s,'1 h','Marge du CP','Capacités du lot :\n30 h, 72 h, 30 h.');break;
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
      groups(s,[['01','Retries','Plus de temps.\nCause possiblement masquée.'],['02','Préchauffage','Compilations réduites.\nRoutes à préparer.'],['03','Standalone','Un test proche\ndu livrable.']],200);
      takeaway(s,'Choix visible dans Git : 689e59d, 20 juillet 2026.',610);break;
    case 12:
      chart(s,12,['Lot engagé','Avec demande','Plafond'],[{name:'Euros',values:[4465,5005,4697],valuesFormatCode:'0" €"',fill:green,points:[{idx:0,fill:green},{idx:1,fill:orange},{idx:2,fill:sage}]}]);
      aside(s,'Report','Décision du cas','+540 €\nDEV : 76 h / 72 h');break;
    case 13:
      await image(s,'docs/rncp/bloc-03/visuels/equipe-illustration.png',240,198,800,425,'contain');
      text(s,'DEV',72,203,165,55,34,true,green);text(s,'Ajouter\nune fonction',72,275,208,125,28);
      text(s,'QA',1068,203,145,55,34,true,green);text(s,'Stabiliser\nla recette',1042,275,175,130,28);
      takeaway(s,'Écouter les impacts, décider, puis suivre.',613);break;
    case 14:
      groups(s,[['Avant','Préparer','Ordre du jour.\nSupports structurés.'],['Pendant','Comprendre','Reformulation.\nModalités adaptées.'],['Après','Retrouver','Décision écrite.\nActions datées.']],207);
      takeaway(s,'Clavier, sous-titres, pauses et fuseaux explicites.',612);break;
    case 15:
      chart(s,15,['CP','DEV','QA'],[{name:'Niveau du cas',values:[1,1,1],fill:sage},{name:'Cible',values:[2,2,2],fill:green}],{position:{left:68,top:182,width:795,height:410},hasLegend:true,dataLabels:{showValue:false},barOptions:{direction:'column',grouping:'clustered',gapWidth:85},yAxis:{min:0,max:3,majorUnit:1,textStyle:{typeface:font,fontSize:23,fill:ink},majorGridlines:{fill:'#DBDFD5',width:1}}});
      aside(s,'1 à 2','De l’aide à l’autonomie','Suivi des écarts.\nConcurrence.\nRecette et clavier.');break;
    case 16:{
      chart(s,16,['CP','DEV','QA'],[{name:'Formation',values:[1,2,3],valuesFormatCode:'0" h"',points:[{idx:0,fill:orange},{idx:1,fill:sage},{idx:2,fill:green}],dataLabelOverrides:[0,1,2].map(idx=>({idx,showValue:true,textStyle:{typeface:font,fontSize:28,bold:true,fill:idx===2?'#FFFFFF':ink}}))}],{type:'doughnut',position:{left:70,top:178,width:570,height:445},doughnutOptions:{holeSize:65},hasLegend:true,legend:{position:'bottom',textStyle:{typeface:font,fontSize:24,fill:ink}},dataLabels:{showValue:true,position:'center',textStyle:{typeface:font,fontSize:28,bold:true,fill:ink}}});
      text(s,'6 h',295,327,270,100,64,true,green);text(s,'Pratiquer',734,218,460,65,38,true);text(s,'Puis réussir un cas\nen autonomie.',734,310,460,114,35);text(s,'Temps inclus dans les tâches.\n60 € de ressources fictives.',734,505,460,115,26);break;
    }
    case 17:
      groups(s,[['J3','Périmètre','CR01\nCritères attendus.'],['J10','Écarts','CR02\nDécision sur le lot.'],['J15','Validation','CR03\nAcceptation et réserves.']],205);
      takeaway(s,'Une décision, un responsable, une échéance.',612);break;
    case 18:
      text(s,'Non mesurée',72,222,1136,130,94,true,green);text(s,'Aucun résultat client réel disponible.',78,383,1080,70,34);
      [['Critères\nacceptés',72],['Parcours\nsans aide',363],['Utilité\nsur 5',654],['Blocages\ncritiques',945]].forEach(([value,x])=>text(s,value,x,533,260,104,28,true));break;
    case 20:
      await image(s,'docs/rncp/bloc-03/preuves/captures/matching-2026-09-14.png',64,156,1152,479,'contain',undefined);
      break;
    case 21:
      await image(s,'docs/rncp/bloc-03/preuves/captures/evenements-2026-09-14.png',64,156,1152,479,'contain',undefined);
      break;
    case 22:
      text(s,'Anticiper',72,214,500,90,67,true,green);text(s,'Les écarts de charge et de coût.',72,317,1090,65,32);
      text(s,'Décider',72,425,500,90,67,true,green);text(s,'Sur un périmètre et des preuves explicites.',72,528,1110,80,32);break;
    case 23:case 24:table(s,item.content.rows,item.content.widths,item.number,185,430);break;
    case 25:
      text(s,'Cadre officiel',72,205,520,66,34,true,green);text(s,'Référentiel, pages 11 à 14.\nModalités 2025–2026.\nGrille BC03.',72,315,520,230,30);
      text(s,'Portée des preuves',680,205,520,66,34,true,green);text(s,'389 tests unitaires.\n6 scénarios navigateur.\nAucune validation client réelle.',680,315,520,230,30);break;
    default:throw new Error(`Slide inconnue ${item.number}`);
  }
}
assert.equal(elapsed,30);assert.equal(doc.slides.length,25);
await fs.writeFile(path.join(root,'docs/rncp/bloc-03/donnees/support-oral.json'),JSON.stringify(doc.slides,null,2)+'\n');
await fs.writeFile(path.join(tmp,'chart-data.json'),JSON.stringify(chartContracts,null,2)+'\n');
const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(P)).save(candidate);
const finalPath=path.join(root,'output/presentations/spity-bloc-3-30-minutes-visuel-v3.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit',...tableOwners.flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:tableOwners,requiredNativeChartOwnerSlides:chartOwners,materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const checked=await PresentationFile.importPptx(await FileBlob.load(finalPath));
for(let i=0;i<checked.slides.items.length;i++){const png=await checked.export({slide:checked.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));}
console.log(JSON.stringify({file:finalPath,slides:25,minutes:30,chartOwners,tableOwners}));
