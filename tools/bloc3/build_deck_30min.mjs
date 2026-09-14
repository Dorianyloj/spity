import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const root=process.cwd();
const tmp=path.join(root,'tmp/bloc3/30min');
await fs.mkdir(tmp,{recursive:true});
const runtimeModules=process.env.RUNTIME_NODE_MODULES??path.join(root,'tmp/bloc3/build/node_modules');
process.env.RUNTIME_NODE_MODULES=runtimeModules;
const require=createRequire(path.join(runtimeModules,'resolver.cjs'));
const {Presentation,PresentationFile,FileBlob}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const skill=process.env.BLOC3_PRESENTATION_SKILL??'C:/Users/JOLYDorian/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.11809/skills/presentations';
const python=process.env.BLOC3_PYTHON??'C:/Users/JOLYDorian/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const {finalizePresentation,resolvePresentationFont}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const font=resolvePresentationFont({fontFamily:'Arial',availableFonts:['Arial']});
const doc=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/diaporama-30min.json'),'utf8'));
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
const ink='#18312D',green='#246B58',pale='#EDF3EF';
const tableOwners=[];
const time=m=>`${String(Math.floor(m)).padStart(2,'0')}:${String(Math.round((m%1)*60)).padStart(2,'0')}`;
let elapsed=0;
function text(slide,value,x,y,w,h,size=27,bold=false,color=ink){
  const shape=slide.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  shape.text=value;shape.text.style={typeface:font,fontSize:size,bold,color,autoFit:'none'};
  return shape;
}
async function photo(slide,file,x,y,w,h,fit='contain'){
  slide.images.add({blob:new Uint8Array(await fs.readFile(path.join(root,file))),contentType:file.endsWith('.png')?'image/png':'image/jpeg',position:{left:x,top:y,width:w,height:h},fit,alt:path.basename(file)});
}
function table(slide,c,number){
  const h=c.takeaway?(c.detail?300:350):430;
  const t=slide.tables.add({rows:c.rows.length,columns:c.rows[0].length,left:64,top:180,width:1152,height:h,values:c.rows,columnWidths:c.widths});
  t.borders.assign({style:'solid',fill:'#FFFFFF',width:1});
  for(let i=0;i<c.rows.length;i++){
    t.rows[i].height=h/c.rows.length;
    for(let j=0;j<c.rows[0].length;j++){
      const cell=t.getCell(i,j);cell.fill=i===0?green:i%2?pale:'#FFFFFF';
      cell.text.style={typeface:font,fontSize:24,bold:i===0,color:i===0?'#FFFFFF':ink};
    }
  }
  tableOwners.push(number);
  if(c.takeaway)text(slide,c.takeaway,72,c.detail?515:559,1100,82,27,true,green);
  if(c.detail)text(slide,c.detail,72,613,1100,43,23,false,ink);
}
for(const item of doc.slides){
  const slide=presentation.slides.add();slide.background.fill='#FFFFFF';
  item.startMinute=elapsed;elapsed+=item.minutes;item.endMinute=elapsed;
  const timing=item.minutes?`${time(item.startMinute)} à ${time(item.endMinute)}`:'Questions du jury';
  const spoken=[item.script,item.transition].filter(Boolean).join('\n\n');
  item.spokenWords=spoken.trim().split(/\s+/).length;
  item.notes=`REPÈRE : ${timing}. Durée prévue : ${time(item.minutes)}.\n\nTEXTE ORAL\n${item.script}\n\n${item.action?'GESTE OU MANIPULATION\n'+item.action+'\n\n':''}${item.transition?'TRANSITION\n'+item.transition+'\n\n':''}SOURCE ET NATURE\n${item.nature}. ${item.source}`;
  slide.speakerNotes.textFrame.setText(item.notes);
  const c=item.content;
  if(item.layout==='cover'){
    slide.background.fill=ink;
    await photo(slide,'spity/public/images/brand/escalade-falaise-coucher-soleil.jpeg',790,0,490,720,'cover');
    text(slide,'SPITY',64,96,660,90,74,true,'#FFFFFF');
    text(slide,'Coordonner et piloter\nun projet logiciel',64,244,690,150,46,true,'#FFFFFF');
    text(slide,'Dorian Joly\nRNCP39583, Bloc 3',64,506,620,90,28,false,'#DAE5DE');
    text(slide,'30 minutes, démonstration incluse',64,645,660,40,24,false,'#DAE5DE');
  }else{
    text(slide,item.title,64,44,1152,115,44,true);
    text(slide,`${item.nature}    ${timing}    ${item.number}`,64,672,1152,25,16,false,'#56665F');
    if(item.layout==='table')table(slide,c,item.number);
    else if(item.layout==='columns'||item.layout==='demo_intro'){
      c.items.forEach(([heading,body],i)=>{
        const x=72+i*592;
        text(slide,heading,x,210,520,86,31,true,green);
        text(slide,body,x,315,520,265,28);
      });
      if(c.takeaway)text(slide,c.takeaway,72,589,1100,65,25,true,green);
    }else if(item.layout==='numbers'){
      c.values.forEach(([value,label],i)=>{
        const x=72+i*389;
        text(slide,value,x,226,340,96,62,true,green);
        text(slide,label,x,334,340,80,29);
      });
      text(slide,c.takeaway,72,478,1110,96,32,true);
      text(slide,c.detail,72,592,1110,56,24,false,green);
    }else if(item.layout==='photo'){
      c.items.forEach(([heading,body],i)=>{
        text(slide,heading,64,226+i*180,390,78,29,true,green);
        text(slide,body,64,313+i*180,390,105,27);
      });
      await photo(slide,c.image,493,180,723,471);
    }else throw new Error(`Disposition inconnue : ${item.layout}`);
  }
}
assert.equal(elapsed,30);
assert.equal(doc.slides.filter(s=>s.minutes>0).length,22);
assert.equal(doc.slides.filter(s=>s.demo).reduce((sum,s)=>sum+s.minutes,0),6);
await fs.writeFile(path.join(root,'docs/rncp/bloc-03/donnees/support-oral.json'),JSON.stringify(doc.slides,null,2)+'\n');
const candidate=path.join(tmp,'candidate.pptx');
await(await PresentationFile.exportPptx(presentation)).save(candidate);
const finalPath=path.join(root,'output/presentations/spity-bloc-3-30-minutes.pptx');
await fs.mkdir(path.dirname(finalPath),{recursive:true});
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit',...tableOwners.flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:tableOwners,fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const checked=await PresentationFile.importPptx(await FileBlob.load(finalPath));
for(let i=0;i<checked.slides.items.length;i++){
  const png=await checked.export({slide:checked.slides.items[i],format:'png',scale:1});
  await fs.writeFile(path.join(tmp,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
}
console.log(JSON.stringify({file:finalPath,slides:doc.slides.length,mainSlides:22,totalMinutes:30,demoMinutes:6,spokenWordsOutsideDemo:doc.slides.filter(s=>s.minutes&&!s.demo).reduce((sum,s)=>sum+s.spokenWords,0)}));
