"""Validate the submitted Bloc 3 case and native packages; optionally bundle them."""
import argparse
import hashlib
import json
import re
import subprocess
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/rncp/bloc-03'
PDF = ROOT / 'output/pdf/dossier-bloc-03-spity.pdf'
PPTX = ROOT / 'output/presentations/spity-bloc-3-30-minutes-visuel-v11.pptx'
XLSX = ROOT / 'outputs/bloc03-01a09eba/pilotage-spity.xlsx'
ZIP = ROOT / 'output/bloc-03/kit-soutenance-spity.zip'
S = {'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main(package):
    data = read(DOCS/'donnees/pilotage.json')
    tasks = data['tasks']
    roles = {r['id']:r for r in data['roles']}
    ids = {t['id'] for t in tasks}
    assert len(ids) == len(tasks) == 10
    for t in tasks:
        assert t['role'] in roles
        assert set(t['dependencies']) <= ids - {t['id']}
        assert 1 <= t['start'] <= t['finish'] <= 15
        assert all(t[k] >= 0 for k in ['plannedHours','spentHours','remainingHours'])
    def visit(task_id, stack):
        assert task_id not in stack, 'Dépendance cyclique'
        for dep in next(t for t in tasks if t['id']==task_id)['dependencies']:
            visit(dep, stack | {task_id})
    for task_id in ids: visit(task_id, set())
    planned = sum(t['plannedHours']*roles[t['role']]['hourlyRate'] for t in tasks)+sum(e['planned'] for e in data['expenses'])
    forecast = sum((t['spentHours']+t['remainingHours'])*roles[t['role']]['hourlyRate'] for t in tasks)+sum(e['forecast'] for e in data['expenses'])
    assert planned == 4270 and forecast == 4465
    assert sum(t['plannedHours'] for t in tasks)==112
    assert sum(t['spentHours']+t['remainingHours'] for t in tasks)==117
    details=data['estimateDetails']
    assert len(details)==30 and len({x['id'] for x in details})==30
    for t in tasks:
        for field in ['plannedHours','spentHours','remainingHours']:
            assert sum(x[field] for x in details if x['task']==t['id'])==t[field]
    inclusion=read(DOCS/'donnees/inclusion.json')
    assert inclusion['fictional'] and inclusion['role']=='QA'
    assert roles['QA']['capacityHours']==inclusion['capacityHours']
    qa_tasks=[t for t in tasks if t['role']=='QA']
    assert {t['id'] for t in qa_tasks}==set(inclusion['tasks'])
    assert sum(t['spentHours']+t['remainingHours'] for t in qa_tasks)==inclusion['forecastHours']
    for allocation in inclusion['preparationIncluded']:
        activity=next(x for x in details if x['id']==allocation['activity'])
        task=next(t for t in tasks if t['id']==allocation['task'])
        assert activity['task']==task['id'] and task['role']==allocation['role']
        assert 0 < allocation['hours'] <= activity['plannedHours']
    training=inclusion['trainingIncluded']
    assert 0 < training['hours'] <= next(t for t in qa_tasks if t['id']==training['task'])['plannedHours']
    snapshot=read(DOCS/'donnees/linear-2026-09-14.json')
    from collections import Counter
    assert len(snapshot['issues'])==25
    assert dict(Counter(x['status'] for x in snapshot['issues']))==snapshot['counts']=={'Done':12,'Todo':4,'In Progress':1,'Backlog':7,'Canceled':1}
    assert len({x['id'] for x in snapshot['issues']})==25
    assert sum(x['priority']=='High' and x['status'] not in ['Done','Canceled'] for x in snapshot['issues'])==7
    indicators = read(DOCS/'donnees/indicateurs.json')
    assert indicators['plannedCost']==planned and indicators['forecastCost']==forecast
    assert abs(indicators['margin']-232)<1e-8
    consolidation=read(DOCS/'donnees/consolidation.json')
    rituals=read(DOCS/'donnees/rituels.json')
    assert [x['id'] for x in rituals['events']]==['planning','daily','review','retro']
    assert next(x for x in rituals['events'] if x['id']=='daily')['targetMinutes']==10
    global_plan=consolidation['globalPlanning']
    assert sum(x['personDays'] for x in global_plan['sequence'])==79
    assert sum(x['personDays'] for x in global_plan['sequence'])/global_plan['capacityPersonDaysPerWeek']==15.8
    recruitment=consolidation['conditionalRecruitment']
    assert recruitment['activated'] is False and consolidation['clientSession']['actualParticipants'] is None
    additional=recruitment['specialistHours']*recruitment['specialistHourlyRate']+recruitment['additionalCPHours']*recruitment['cpHourlyRate']
    assert additional==202.5 and forecast+additional==4667.5
    cp_hours=sum(t['spentHours']+t['remainingHours'] for t in tasks if t['role']=='CP')
    assert cp_hours+recruitment['additionalCPHours']<=roles['CP']['capacityHours']
    slides = read(DOCS/'donnees/support-oral.json')
    assert len(slides)==25 and sum(s['minutes'] for s in slides)==30
    assert len([s for s in slides if s['minutes']>0])==22
    assert sum(s['minutes'] for s in slides if s['demo'])==6
    assert all(s['minutes']==0 for s in slides[22:])
    for s in slides[:22]:
        assert s['endMinute']-s['startMinute']==s['minutes']
        if not s['demo']:
            assert 100 <= s['spokenWords']/s['minutes'] <= 145, f"Densité orale incohérente : slide {s['number']}"
    assert len(list((DOCS/'annexes').glob('A*.md')))==9
    matrix = (DOCS/'MATRICE_PREUVES.md').read_text(encoding='utf-8')
    framework = read(DOCS/'donnees/cadre-evaluation.json')
    assert framework['eliminatoryCompetencies']==['C.3.1','C3.2.1','C3.4.2']
    assert framework['minimumAcquired']==4 and framework['mandatoryDeliverables']==14
    assert framework['presentationMinutes']==30 and framework['questionsMinutes']==15
    for competency in framework['competencies']:
        assert competency in matrix
    assert "Le règlement spécial n'est pas fourni" not in matrix
    for path in DOCS.rglob('*.md'):
        for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',path.read_text(encoding='utf-8')):
            if '://' in target or target.startswith('#'): continue
            resolved = (path.parent/target.split('#')[0]).resolve()
            if resolved==ZIP: continue
            assert resolved.exists(), f'Lien manquant : {path.name} -> {target}'
    with zipfile.ZipFile(XLSX) as z:
        assert z.testzip() is None
        sheets = [n for n in z.namelist() if re.fullmatch(r'xl/worksheets/sheet\d+\.xml',n)]
        assert len(sheets)==5
        formulas=0
        for name in sheets:
            tree = ET.fromstring(z.read(name))
            assert not tree.findall('.//s:c[@t="e"]',S), 'Erreur Excel exportée'
            formulas += len(tree.findall('.//s:f',S))
        assert formulas >= 40
        cells={c.attrib['r']:c.findtext('s:v',namespaces=S) for c in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//s:c',S)}
        for cell,value in {'C8':112,'C11':117,'C14':4270,'C16':4465,'C19':232}.items():
            assert float(cells[cell])==value, f'Cache Excel incorrect : {cell}'
    with zipfile.ZipFile(PPTX) as z:
        assert z.testzip() is None
        assert len([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==len(slides)
        notes=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n)]
        assert len(notes)==len(slides)
        for note in notes:
            assert len(''.join(ET.fromstring(z.read(note)).itertext()).strip())>80
        chart_parts=[n for n in z.namelist() if re.search(r'/charts/chart\d+\.xml$',n)]
        chart_workbooks=[n for n in z.namelist() if '/embeddings/' in n and n.endswith('.xlsx')]
        assert len(chart_parts)==7, 'Les sept graphiques doivent rester natifs'
        assert len(chart_workbooks)==7, 'Chaque graphique doit conserver ses données intégrées'
        for number in [6,14,16]:
            visible=' '.join(ET.fromstring(z.read(f'ppt/slides/slide{number}.xml')).itertext())
            assert inclusion['name'] in visible, f'Cas absent de la diapositive {number}'
        assert re.search(r'ficti[fv]', ' '.join(ET.fromstring(z.read('ppt/slides/slide14.xml')).itertext()))
        for number,terms in {4:['Kanban','Scrum','Planning','Daily','Review','Rétrospective'],5:['Mesure'],7:['J11','J12','J13','J14'],13:['Participatif','Persuasif','Directif','Délégatif','Rétro'],15:['Actuel','Cible','Concurrence'],16:['CP','DEV','Camille'],17:['CR02','J12','J14','Review'],18:['80','4/5'],22:['accepté','refusé'],25:['202,50','29,50']}.items():
            visible=' '.join(ET.fromstring(z.read(f'ppt/slides/slide{number}.xml')).itertext())
            assert all(term.casefold() in visible.casefold() for term in terms), f'Élément attendu absent de la slide {number}'
    reader=PdfReader(PDF)
    assert all(len(page.extract_text().strip())>90 for page in reader.pages)
    visual=read(DOCS/'preuves/controle-visuel.json')
    assert visual['presentation']['file']==PPTX.relative_to(ROOT).as_posix() and visual['presentation']['sha256']==digest(PPTX)
    assert visual['dossier']['pages']==len(reader.pages) and visual['dossier']['sha256']==digest(PDF)
    evidence=read(DOCS/'preuves/verification.json')
    current_tree=subprocess.check_output(['git','rev-parse','HEAD:spity'],cwd=ROOT,text=True).strip()
    verified_tree=subprocess.check_output(['git','rev-parse',f"{evidence['gitRevision']}:spity"],cwd=ROOT,text=True).strip()
    assert verified_tree==evidence['applicationTree'], 'La preuve doit correspondre à sa révision datée'
    head_matches=current_tree==verified_tree
    changed_tracked=subprocess.check_output(['git','diff','--name-only','HEAD','--','spity'],cwd=ROOT,text=True).splitlines()
    untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard','--','spity'],cwd=ROOT,text=True).splitlines()
    application_changes=sorted(set(changed_tracked+untracked))
    application_matches=head_matches and not application_changes
    if not application_matches:
        assert 'ne certifient pas la version courante' in (DOCS/'VERIFICATION.md').read_text(encoding='utf-8'), 'Documenter la portée historique des tests'
    for capture in read(DOCS/'preuves/captures/manifest.json'):
        assert (DOCS/'preuves/captures'/capture['file']).exists()
    report={'case':'simulation explicite','planningTasks':len(tasks),'baselineEUR':planned,'forecastEUR':forecast,'marginEUR':232,'slides':len(slides),'nativeCharts':len(chart_parts),'chartWorkbooks':len(chart_workbooks),'presentationMinutes':30,'pdfPages':len(reader.pages),'workbookSheets':len(sheets),'workbookFormulas':formulas,'applicationTree':current_tree,'verifiedApplicationTree':verified_tree,'applicationMatchesDatedEvidence':application_matches,'inclusionCase':inclusion['name'],'inclusionSlides':[6,14,16],'scope':'Cohérence documentaire et structure des exports ; aucun nouveau test applicatif ou dépôt externe. Les tests conservent leur révision et leur date.'}
    report.update({'headApplicationMatchesDatedEvidence':head_matches,'applicationWorkingTreeClean':not application_changes,'applicationWorkingTreeChanges':application_changes,'eliminatoryCompetencies':framework['eliminatoryCompetencies'],'minimumAcquiredCompetencies':framework['minimumAcquired'],'demonstrationReadyOnCurrentVersion':None})
    (DOCS/'preuves/controle-kit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    if package:
        included=sorted([p for p in DOCS.rglob('*') if p.is_file() and p.name!='MANIFEST.sha256']+[p for p in (ROOT/'tools/bloc3').glob('*') if p.is_file()]+[PDF,PPTX,XLSX])
        manifest=''.join(f'{digest(p)}  {p.relative_to(ROOT).as_posix()}\n' for p in included)
        (DOCS/'preuves/MANIFEST.sha256').write_text(manifest,encoding='utf-8',newline='\n')
        included.append(DOCS/'preuves/MANIFEST.sha256')
        ZIP.parent.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED) as z:
            for p in included: z.write(p,p.relative_to(ROOT).as_posix())
            z.writestr('LIRE_EN_PREMIER.txt', 'KIT BLOC 3 SPITY\n\nDossier : output/pdf/dossier-bloc-03-spity.pdf\nSlides : output/presentations/spity-bloc-3-30-minutes-visuel-v11.pptx\nClasseur : outputs/bloc03-01a09eba/pilotage-spity.xlsx\nGuide et checklist : docs/rncp/bloc-03/\nContrôle détaillé : docs/rncp/bloc-03/CONTROLE_COMPLETUDE.md\n\nLe diaporama comprend 22 slides pour 30 minutes, dont 6 de démonstration, et 3 annexes. Le guide contient le texte oral et les transitions. La durée effective se règle après une répétition chronométrée. Les situations de management sont fictives et identifiées. Les données personnelles et dates du campus restent à confirmer. Aucun dépôt externe effectué. La démonstration nécessite le dépôt Spity complet ; les fichiers techniques seuls ne contiennent pas toute l’application.\n\nLe règlement spécial identifie C.3.1, C3.2.1 et C3.4.2 comme éliminatoires. Les tests de la révision 9d166c0 restent datés : consulter VERIFICATION.md et le contrôle du kit pour la correspondance de la version présentée. La réussite du contrôle documentaire ne vaut pas nouvelle recette du logiciel.\n')
        with zipfile.ZipFile(ZIP) as z: assert z.testzip() is None
        report['zip']=str(ZIP.relative_to(ROOT))
        report['zipSHA256']=digest(ZIP)
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--package',action='store_true')
    main(parser.parse_args().package)
