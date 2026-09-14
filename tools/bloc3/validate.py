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
PPTX = ROOT / 'output/presentations/soutenance-bloc-03-spity.pptx'
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
    indicators = read(DOCS/'donnees/indicateurs.json')
    assert indicators['plannedCost']==planned and indicators['forecastCost']==forecast
    assert abs(indicators['margin']-232)<1e-8
    slides = read(DOCS/'donnees/support-oral.json')
    assert len(slides)==18 and sum(s['minutes'] for s in slides)==30
    assert slides[13]['minutes']==6 and all(s['minutes']==0 for s in slides[15:])
    assert len(list((DOCS/'annexes').glob('A*.md')))==8
    matrix = (DOCS/'MATRICE_PREUVES.md').read_text(encoding='utf-8')
    for competency in ['C.3.1','C3.2.1','C3.2.2','C3.3.1','C3.3.2','C3.4.1','C3.4.2']:
        assert competency in matrix
    for path in DOCS.rglob('*.md'):
        for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',path.read_text(encoding='utf-8')):
            if '://' in target or target.startswith('#'): continue
            resolved = (path.parent/target.split('#')[0]).resolve()
            if resolved==ZIP: continue
            assert resolved.exists(), f'Lien manquant : {path.name} -> {target}'
    with zipfile.ZipFile(XLSX) as z:
        assert z.testzip() is None
        sheets = [n for n in z.namelist() if re.fullmatch(r'xl/worksheets/sheet\d+\.xml',n)]
        assert len(sheets)==3
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
        assert len([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==18
        notes=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n)]
        assert len(notes)==18
        for note in notes:
            assert len(''.join(ET.fromstring(z.read(note)).itertext()).strip())>80
    reader=PdfReader(PDF)
    assert all(len(page.extract_text().strip())>90 for page in reader.pages)
    evidence=read(DOCS/'preuves/verification.json')
    current_tree=subprocess.check_output(['git','rev-parse','HEAD:spity'],cwd=ROOT,text=True).strip()
    assert current_tree==evidence['applicationTree'], 'Le code applicatif diffère des preuves datées'
    assert not subprocess.check_output(['git','diff','HEAD','--','spity'],cwd=ROOT,text=True).strip()
    for capture in read(DOCS/'preuves/captures/manifest.json'):
        assert (DOCS/'preuves/captures'/capture['file']).exists()
    report={'case':'simulation explicite','planningTasks':len(tasks),'baselineEUR':planned,'forecastEUR':forecast,'marginEUR':232,'slides':len(slides),'presentationMinutes':30,'pdfPages':len(reader.pages),'workbookSheets':len(sheets),'workbookFormulas':formulas,'applicationTree':current_tree,'scope':'Cohérence documentaire et structure des exports ; aucun nouveau test applicatif ou dépôt externe.'}
    (DOCS/'preuves/controle-kit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    if package:
        included=sorted([p for p in DOCS.rglob('*') if p.is_file() and p.name!='MANIFEST.sha256']+[p for p in (ROOT/'tools/bloc3').glob('*') if p.is_file()]+[PDF,PPTX,XLSX])
        manifest=''.join(f'{digest(p)}  {p.relative_to(ROOT).as_posix()}\n' for p in included)
        (DOCS/'preuves/MANIFEST.sha256').write_text(manifest,encoding='utf-8',newline='\n')
        included.append(DOCS/'preuves/MANIFEST.sha256')
        ZIP.parent.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED) as z:
            for p in included: z.write(p,p.relative_to(ROOT).as_posix())
            z.writestr('LIRE_EN_PREMIER.txt', 'KIT BLOC 3 SPITY\n\nDossier : output/pdf/dossier-bloc-03-spity.pdf\nSlides : output/presentations/soutenance-bloc-03-spity.pptx\nClasseur : outputs/bloc03-01a09eba/pilotage-spity.xlsx\nGuide et checklist : docs/rncp/bloc-03/\n\nLes situations de management sont fictives et identifiées. Les données personnelles et dates du campus restent à confirmer. Aucun dépôt externe effectué. La démonstration nécessite le dépôt Spity complet ; les fichiers techniques seuls ne contiennent pas toute l’application.\n')
        with zipfile.ZipFile(ZIP) as z: assert z.testzip() is None
        report['zip']=str(ZIP.relative_to(ROOT))
        report['zipSHA256']=digest(ZIP)
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--package',action='store_true')
    main(parser.parse_args().package)
