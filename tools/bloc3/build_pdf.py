"""Create a readable A4 dossier from the Bloc 3 Markdown sources."""
from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

ROOT=Path(__file__).resolve().parents[2]
DOCS=ROOT/'docs/rncp/bloc-03'
OUTPUT=ROOT/'output/pdf/dossier-bloc-03-spity.pdf'
FONTDIR=Path('C:/Windows/Fonts')
for name,file in [('Arial','arial.ttf'),('Arial-Bold','arialbd.ttf'),('Arial-Italic','ariali.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONTDIR/file)))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold',italic='Arial-Italic',boldItalic='Arial-Bold')
INK=colors.HexColor('#18312D'); GREEN=colors.HexColor('#246B58'); LIGHT=colors.HexColor('#EAF1ED')
styles={
    'body':ParagraphStyle('body',fontName='Arial',fontSize=9.8,leading=13.5,spaceAfter=6,textColor=INK,allowWidows=0,allowOrphans=0),
    'h1':ParagraphStyle('h1',fontName='Arial-Bold',fontSize=24,leading=29,spaceAfter=16,textColor=INK,keepWithNext=True),
    'h2':ParagraphStyle('h2',fontName='Arial-Bold',fontSize=15,leading=20,spaceBefore=12,spaceAfter=9,textColor=GREEN,keepWithNext=True),
    'h3':ParagraphStyle('h3',fontName='Arial-Bold',fontSize=11,leading=15,spaceBefore=8,spaceAfter=6,keepWithNext=True),
    'cell':ParagraphStyle('cell',fontName='Arial',fontSize=8.3,leading=11,textColor=INK),
    'head':ParagraphStyle('head',fontName='Arial-Bold',fontSize=8.3,leading=11,textColor=colors.white),
    'code':ParagraphStyle('code',fontName='Arial',fontSize=8.1,leading=11,spaceAfter=5,textColor=INK),
}

def inline(s):
    s=s.replace('’',"'").replace('–','-').replace('—','-').replace('\u00a0',' ')
    s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s)
    s=escape(s)
    s=re.sub(r'(?<=\d) (?=\d{3}(?:\D|$))','&nbsp;',s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
    return re.sub(r'`([^`]+)`',r'\1',s)

def markdown(path):
    lines=path.read_text(encoding='utf-8').splitlines()
    story=[]; i=0; code=False
    while i<len(lines):
        line=lines[i].strip()
        if line.startswith('```'): code=not code; i+=1; continue
        if not line: i+=1; continue
        if code:
            story.append(Paragraph(inline(line),styles['code'])); i+=1; continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                cells=[v.strip() for v in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[:\- ]+',c) for c in cells): rows.append(cells)
                i+=1
            columns=len(rows[0]); widths=[1]*columns
            if columns==3: widths=[1.15,1.75,1.6]
            if columns==4: widths=[1,1.5,1.2,1.8]
            if rows[0]==['ID','Statut observé','Priorité','Intitulé']: widths=[0.6,0.9,0.7,3.8]
            if rows[0]==['Tâche','Détail initial en heures','Total','Référence de contexte']: widths=[0.7,3.45,0.5,1.6]
            if rows[0]==['Cause du scénario','Écart h','Effet coût','Réponse']: widths=[2.1,0.55,0.8,2.2]
            if columns==5: widths=[0.65,1.65,0.75,0.7,2]
            if columns==6: widths=[0.45,2.4,0.5,0.5,0.6,0.9]
            if columns==7: widths=[0.5,2.4,0.6,0.85,0.8,0.8,1.1]
            if rows[0]==['Activité','CP','DEV','QA','CL']: widths=[3,0.7,0.7,0.7,0.7]
            if columns==6 and rows[0][0]=='Rôle': widths=[0.7,1,1.4,1.1,1.2,0.8]
            if columns==5 and rows[0][0]=='Action prévue': widths=[1.4,0.55,1.1,1.4,2]
            total=sum(widths)
            content=[[Paragraph(inline(c),styles['head' if n==0 else 'cell']) for c in row] for n,row in enumerate(rows)]
            t=Table(content,colWidths=[174*mm*w/total for w in widths],repeatRows=1,hAlign='LEFT')
            t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),4.5),('BOTTOMPADDING',(0,0),(-1,-1),4.5),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('LINEBELOW',(0,0),(-1,0),0.5,GREEN)]))
            story += [t,Spacer(1,9)]
            continue
        if line.startswith('# '): key='h1'; line=line[2:]
        elif line.startswith('## '): key='h2'; line=line[3:]
        elif line.startswith('### '): key='h3'; line=line[4:]
        else:
            key='body'
            if line.startswith('- '): line='• '+line[2:]
        story.append(Paragraph(inline(line),styles[key]));i+=1
    return story

def footer(canvas,doc):
    canvas.saveState();canvas.setStrokeColor(GREEN);canvas.line(18*mm,16*mm,192*mm,16*mm)
    canvas.setFont('Arial',8);canvas.setFillColor(INK)
    canvas.drawString(18*mm,11*mm,'SPITY | RNCP39583 | Bloc 3 | Réel et simulation identifiés')
    canvas.drawRightString(192*mm,11*mm,str(doc.page));canvas.restoreState()

def main():
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    story=[Spacer(1,32*mm),Paragraph('SPITY',ParagraphStyle('cover',fontName='Arial-Bold',fontSize=45,leading=50,textColor=GREEN)),Spacer(1,10*mm),Paragraph('Coordonner et piloter<br/>un projet logiciel',styles['h1']),Paragraph('Dossier de soutenance - Bloc 3',styles['h2']),Paragraph('Dorian Joly<br/>Expert en développement logiciel - RNCP39583<br/>Préparation du 14 septembre 2026',styles['body']),Spacer(1,12*mm),Paragraph('Réalisations vérifiables du projet et mise en situation pédagogique explicitement identifiée. Le dossier accompagne un oral de 30 minutes, démonstration incluse, suivi de 15 minutes de questions.',styles['body']),PageBreak()]
    files=[DOCS/'DOSSIER_BLOC_03.md',DOCS/'MATRICE_PREUVES.md',*sorted((DOCS/'annexes').glob('A*.md')),DOCS/'VERIFICATION.md']
    for n,f in enumerate(files):
        if not f.exists():raise FileNotFoundError(f)
        if n > 0:story.append(PageBreak())
        story.extend(markdown(f))
    doc=SimpleDocTemplate(str(OUTPUT),pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=18*mm,bottomMargin=22*mm,title='Spity - Dossier Bloc 3',author='Dorian Joly')
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(OUTPUT)

if __name__=='__main__':main()
