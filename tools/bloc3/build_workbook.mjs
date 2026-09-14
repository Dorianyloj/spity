import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
process.on('uncaughtException', error => { console.error(error.stack); process.exit(1); });
const root=process.cwd();
const tmp=path.join(root,'tmp/bloc3/build');
const require=createRequire(path.join(tmp,'resolver.cjs'));
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const data=JSON.parse(await fs.readFile(path.join(root,'docs/rncp/bloc-03/donnees/pilotage.json'),'utf8'));
const wb=Workbook.create();
const main=wb.worksheets.add('Pilotage');
const plan=wb.worksheets.add('Planning');
const risk=wb.worksheets.add('Risques');
const ink='#18312D', green='#246B58', pale='#EFF4F0', blue='#1458B2';
function base(sh,range){sh.showGridLines=false;sh.getRange(range).format.font={name:'Arial',size:11,color:ink};sh.getRange(range).format.rowHeight=25;sh.getRange(range).format.verticalAlignment='center';}
function head(sh,range){sh.getRange(range).format={fill:green,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:36,wrapText:true};}
function input(sh,range){sh.getRange(range).format.font.color=blue;sh.getRange(range).format.fill='#FFF7DD';}
function put(sh,cell,value){sh.getRange(cell).values=[[value]];}
function formula(sh,cell,value){sh.getRange(cell).formulas=[[value]];}
function title(sh,label){put(sh,'B2',label);sh.getRange('B2').format.font={name:'Arial',size:17,bold:true,color:ink};sh.getRange('B2').format.rowHeight=34;put(sh,'B4','SIMULATION PÉDAGOGIQUE - état à J10, horizon de 15 jours ouvrés');put(sh,'B5','Les jours, charges, taux et réunions du cas ne sont pas des observations historiques.');sh.getRange('B4:B5').format.font.color='#8B4B08';}
base(main,'B2:L36');title(main,'Spity - Tableau de pilotage');main.tabColor=green;
main.getRange('B2:B36').format.columnWidth=33;main.getRange('C2:L36').format.columnWidth=13;
head(main,'B7:C7');main.getRange('B7:C7').values=[['Indicateur','Valeur']];
const summary=[['Charge prévue (h)',"=SUM('Planning'!H9:H18)"],['Charge consommée (h)',"=SUM('Planning'!I9:I18)"],['Reste à faire (h)',"=SUM('Planning'!J9:J18)"],['Prévision finale (h)',"=SUM('Planning'!K9:K18)"],['Tâches terminées',"=COUNTIFS('Planning'!G9:G18,\"Terminé\")/COUNTA('Planning'!A9:A18)"]];
summary.forEach((r,i)=>{put(main,`B${8+i}`,r[0]);formula(main,`C${8+i}`,r[1]);});main.getRange('C12').setNumberFormat('0.0%');
[['B14','Budget initial (EUR)'],['B15','Consommé (EUR)'],['B16','Prévision finale (EUR)'],['B17','Dépassement (EUR)'],['B18','Plafond avec réserve (EUR)'],['B19','Marge restante (EUR)']].forEach(([c,v])=>put(main,c,v));
formula(main,'C14','=SUM(I23:I25)+SUM(F30:F31)');formula(main,'C15','=SUM(J23:J25)+SUM(G30:G31)');formula(main,'C16','=SUM(K23:K25)+IF(COUNT(H30:H31)=2,SUM(H30:H31),NA())');formula(main,'C17','=C16-C14');formula(main,'C18','=C14*(1+F8)');formula(main,'C19','=C18-C16');
main.getRange('C14:C19').setNumberFormat('#,##0 "€";(#,##0) "€";"-"');main.getRange('B16:C16').format.fill=pale;main.getRange('B19:C19').format.font.bold=true;
put(main,'E7','Hypothèses');put(main,'E8','Réserve');put(main,'F8',data.reserveRate);put(main,'E9','Alerte charge');put(main,'F9',0.9);main.getRange('F8:F9').setNumberFormat('0%');input(main,'F8:F9');
put(main,'E11','Entrées bleues sur fond ambre : modifiables');put(main,'E12','Les formules recalculent charges, coûts et écarts.');put(main,'E14','EUR : valorisation économique du travail, hors taxes.');put(main,'E15','Les capacités portent sur tout le lot de 15 jours.');put(main,'E17','Source du cas : données pédagogiques, A01 à A04.');put(main,'E18','Archive Linear du 09/09/2026 : 12 Done / 24 actifs.');put(main,'E19','Cette archive est distincte des 10 tâches simulées.');
head(main,'B22:L22');main.getRange('B22:L22').values=[['Rôle','Capacité h','EUR / h','Prévu h','Consommé h','Restant h','Prévision h','Budget EUR','Consommé EUR','Prévision EUR','Occupation']];
data.roles.forEach((r,i)=>{const n=23+i;main.getRange(`B${n}:D${n}`).values=[[r.id,r.capacityHours,r.hourlyRate]];formula(main,`E${n}`,`=SUMIFS('Planning'!$H$9:$H$18,'Planning'!$C$9:$C$18,B${n})`);formula(main,`F${n}`,`=SUMIFS('Planning'!$I$9:$I$18,'Planning'!$C$9:$C$18,B${n})`);formula(main,`G${n}`,`=SUMIFS('Planning'!$J$9:$J$18,'Planning'!$C$9:$C$18,B${n})`);formula(main,`H${n}`,`=SUMIFS('Planning'!$K$9:$K$18,'Planning'!$C$9:$C$18,B${n})`);formula(main,`I${n}`,`=IF(ISNUMBER(D${n}),E${n}*D${n},NA())`);formula(main,`J${n}`,`=IF(ISNUMBER(D${n}),F${n}*D${n},NA())`);formula(main,`K${n}`,`=IF(ISNUMBER(D${n}),H${n}*D${n},NA())`);formula(main,`L${n}`,`=IF(ISNUMBER(C${n}),IF(C${n}=0,"n.a.",H${n}/C${n}),"À renseigner")`);});
input(main,'C23:D25');main.getRange('L23:L25').setNumberFormat('0.0%');main.getRange('I23:K25').setNumberFormat('#,##0;(#,##0);"-"');
main.getRange('L23:L25').conditionalFormats.add('cellIs',{operator:'greaterThan',formula:'$F$9',format:{fill:'#FDE5CD',font:{color:'#8B4B08',bold:true}}});
main.getRange('C19').conditionalFormats.add('cellIs',{operator:'lessThan',formula:0,format:{fill:'#FCE2E2',font:{color:'#A32121',bold:true}}});
put(main,'B28','Frais du scénario');main.getRange('B28').format.font.bold=true;head(main,'B29:H29');main.getRange('B29:H29').values=[['Poste','','','','Prévu EUR','Consommé EUR','Prévision EUR']];
data.expenses.forEach((e,i)=>{put(main,`B${30+i}`,e.label);main.getRange(`F${30+i}:H${30+i}`).values=[[e.planned,e.spent,e.forecast]];});input(main,'F30:H31');
put(main,'B34','La formation inclut 6 h déjà comptées dans les tâches. Aucun double comptage du temps.');
main.getRange('C8:C19').format.font.color=ink;

base(plan,'A2:N21');title(plan,'Spity - Planning et charges');plan.getRange('A2:A21').format.columnWidth=8;plan.getRange('B2:B21').format.columnWidth=34;plan.getRange('C2:N21').format.columnWidth=12;plan.getRange('G2:G21').format.columnWidth=15;plan.getRange('M2:M21').format.columnWidth=17;
head(plan,'A8:N8');plan.getRange('A8:N8').values=[['ID','Tâche','Rôle','Début J','Fin prévue J','Fin revue J','Statut','Prévu h','Consommé h','Restant h','Prévision h','Écart h','Prérequis','Retard j']];
data.tasks.forEach((t,i)=>{const n=9+i;plan.getRange(`A${n}:J${n}`).values=[[t.id,t.title,t.role,t.start,t.finish,t.forecastFinish,t.status,t.plannedHours,t.spentHours,t.remainingHours]];formula(plan,`K${n}`,`=IF(COUNT(I${n}:J${n})=2,SUM(I${n}:J${n}),NA())`);formula(plan,`L${n}`,`=K${n}-H${n}`);put(plan,`M${n}`,t.dependencies.join(', ')||'Aucun');formula(plan,`N${n}`,`=F${n}-E${n}`);});
plan.getRange('D9:F18').format.horizontalAlignment='center';plan.getRange('M9:N18').format.horizontalAlignment='center';input(plan,'D9:J18');plan.getRange('G9:G18').dataValidation={rule:{type:'list',values:['À faire','En cours','À vérifier','Terminé']}};plan.getRange('C9:C18').dataValidation={rule:{type:'list',values:['CP','DEV','QA']}};
plan.getRange('L9:L18').conditionalFormats.add('cellIs',{operator:'greaterThan',formula:0,format:{fill:'#FDE5CD'}});plan.getRange('N9:N18').conditionalFormats.add('cellIs',{operator:'greaterThan',formula:0,format:{fill:'#FDE5CD'}});
put(plan,'B20','Source : simulation pédagogique du lot. J1 à J15 ne sont pas des dates de réalisation historiques.');put(plan,'B21','La clôture de T07 requiert aussi les vérifications de T06 et T10. Les jalons sont décrits dans A01.');plan.freezePanes.freezeRows(8);plan.freezePanes.freezeColumns(2);

base(risk,'A2:H15');title(risk,'Spity - Registre des risques');risk.getRange('A2:A15').format.columnWidth=8;risk.getRange('B2:B15').format.columnWidth=38;risk.getRange('C2:F15').format.columnWidth=11;risk.getRange('G2:H15').format.columnWidth=48;
head(risk,'A8:H8');risk.getRange('A8:H8').values=[['ID','Risque','Probabilité','Impact','Score','Pilote','Réponse','Déclencheur']];
data.risks.forEach((r,i)=>{const n=9+i;risk.getRange(`A${n}:D${n}`).values=[[r.id,r.title,r.probability,r.impact]];formula(risk,`E${n}`,`=IF(COUNT(C${n}:D${n})=2,C${n}*D${n},NA())`);risk.getRange(`F${n}:H${n}`).values=[[r.owner,r.response,r.trigger]];});input(risk,'C9:D13');risk.getRange('A9:H13').format.rowHeight=72;risk.getRange('B9:B13').format.wrapText=true;risk.getRange('G9:H13').format.wrapText=true;
risk.getRange('C9:D13').dataValidation={rule:{type:'whole',operator:'between',formula1:1,formula2:3}};risk.getRange('E9:E13').conditionalFormats.add('cellIs',{operator:'greaterThanOrEqual',formula:6,format:{fill:'#FDE5CD',font:{color:'#8B4B08',bold:true}}});put(risk,'B15','Source : hypothèses du cas. Échelle de 1 (faible) à 3 (fort) ; revue des scores 6 ou 9.');

wb.recalculate();
const value=(sh,cell)=>sh.getRange(cell).values[0][0];
assert.equal(value(main,'C8'),112);assert.equal(value(main,'C11'),117);assert.equal(value(main,'C14'),4270);assert.equal(value(main,'C16'),4465);assert.equal(value(main,'C19'),232);
put(plan,'J14',15);wb.recalculate();assert.equal(value(main,'C11'),122);assert.equal(value(main,'C16'),4640);put(plan,'J14',10);
put(main,'D24',40);wb.recalculate();assert.equal(value(main,'C16'),4785);put(main,'D24',35);
put(main,'C23',0);wb.recalculate();assert.equal(value(main,'L23'),'n.a.');put(main,'C23',30);
put(plan,'J14',null);wb.recalculate();assert.notEqual(value(main,'C16'),4465);put(plan,'J14',10);
wb.recalculate();assert.equal(value(main,'C16'),4465);
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:30},summary:'Final error scan'});
await fs.writeFile(path.join(tmp,'workbook-errors.json'),errors.ndjson);assert.ok(errors.ndjson.includes('matched 0 entries'),'Final workbook contains formula errors');
const summaryCheck=await wb.inspect({kind:'table',range:'Pilotage!B7:C19',include:'values,formulas',tableMaxRows:15,tableMaxCols:2});await fs.writeFile(path.join(tmp,'workbook-check.json'),summaryCheck.ndjson);
for(const [sh,range,name] of [[main,'B2:L34','pilotage'],[plan,'A2:N21','planning'],[risk,'A2:H15','risques']]){const b=await wb.render({sheetName:sh.name,range,scale:1,format:'png'});await fs.writeFile(path.join(tmp,`${name}.png`),new Uint8Array(await b.arrayBuffer()));}
const out=path.join(root,'outputs/bloc03-01a09eba/pilotage-spity.xlsx');await fs.mkdir(path.dirname(out),{recursive:true});await(await SpreadsheetFile.exportXlsx(wb)).save(out);
console.log(JSON.stringify({file:out,baseline:4270,forecast:4465,margin:232,recalculationChecks:'remaining effort, hourly rate, zero capacity and blank input checked'}));
