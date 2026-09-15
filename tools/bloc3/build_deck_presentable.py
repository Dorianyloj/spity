"""Build the editable v16 deck from the reviewed v14 notes and project evidence.

Run from any directory: python tools/bloc3/build_deck_presentable.py
Dependencies: tools/bloc3/requirements-presentation.txt.
Rendering and visual review are separate; this generator never records a review.
"""
from pathlib import Path
import json
from PIL import Image
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION, XL_LEGEND_POSITION, XL_TICK_LABEL_POSITION
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/rncp/bloc-03'
OUT = ROOT / 'output/bloc-03/spity-bloc-3-30-minutes-visuel-v16.pptx'
SOURCE = json.loads((DOCS / 'donnees/support-oral.json').read_text())
PLAN = json.loads((DOCS / 'donnees/consolidation.json').read_text())
INK, GREEN, LIME, PAPER = '12332D', '286957', 'D8F28B', 'F6F5EF'
MUTED, LINE, WHITE, ORANGE = '5C6C65', 'DDE3D9', 'FFFFFF', 'B64E2E'
PALE, DARKCARD = 'EBEFE6', '1C453B'
FONT = 'Arial'
P = Presentation()
P.slide_width, P.slide_height = Inches(16), Inches(9)
P.core_properties.title = 'Spity — Piloter le projet | Bloc 3'
P.core_properties.subject = 'Soutenance RNCP39583 — 30 minutes, démonstration incluse'
P.core_properties.author = 'Dorian Joly'
P.core_properties.language = 'fr-FR'


def color(value):
    return RGBColor.from_string(value)


def rect(s, x, y, w, h, fill, radius=False, stroke=None):
    shape = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE,
                               Inches(x), Inches(y), Inches(w), Inches(h))
    if radius:
        shape.adjustments[0] = .04
    shape._element.spPr.append(OxmlElement('a:effectLst'))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color(fill)
    if stroke:
        shape.line.color.rgb = color(stroke)
        shape.line.width = Pt(.8)
    else:
        shape.line.fill.background()
    return shape


def txt(s, text, x, y, w, h, size=22, bold=False, fill=INK, align=PP_ALIGN.LEFT):
    box = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = 0
    tf.margin_top = tf.margin_bottom = 0
    for i, line in enumerate(str(text).split('\n')):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name, p.font.size, p.font.bold = FONT, Pt(size), bold
        p.font.color.rgb = color(fill)
        p.alignment = align
        p.space_after = Pt(4)
    return box


def line(s, x1, y1, x2, y2, fill=LINE, width=1):
    shape = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    shape.line.color.rgb = color(fill)
    shape.line.width = Pt(width)
    shape._element.spPr.append(OxmlElement('a:effectLst'))


def pill(s, text, x, y, w, dark=False):
    rect(s, x, y, w, .36, DARKCARD if dark else PALE, True)
    txt(s, text, x+.13, y+.065, w-.26, .24, 10, True, LIME if dark else GREEN)


def picture(s, relative, x, y, w, h, cover=False):
    path = ROOT / relative
    with Image.open(path) as im:
        ratio = im.width / im.height
    if cover:
        pic = s.shapes.add_picture(str(path), Inches(x), Inches(y), width=Inches(w), height=Inches(h))
        target = w/h
        if ratio > target:
            pic.crop_left = pic.crop_right = (1-target/ratio)/2
        else:
            pic.crop_top = pic.crop_bottom = (1-ratio/target)/2
    else:
        iw, ih = (w, w/ratio) if ratio > w/h else (h*ratio, h)
        pic = s.shapes.add_picture(str(path), Inches(x+(w-iw)/2), Inches(y+(h-ih)/2), width=Inches(iw), height=Inches(ih))
    pic._element.nvPicPr.cNvPr.set('descr', path.stem)
    return pic


def base(n, title, section, subtitle='', dark=False):
    s = P.slides.add_slide(P.slide_layouts[6])
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = color(INK if dark else PAPER)
    txt(s, 'SPITY', .65, .35, 1.3, .28, 13, True, LIME if dark else INK)
    txt(s, section.upper(), 2.1, .38, 11, .25, 10, True, 'B9CABE' if dark else MUTED)
    if title:
        txt(s, title, .65, 1.02, 14.7, .72, 35, True, WHITE if dark else INK)
    if subtitle:
        txt(s, subtitle, .68, 1.87, 14.5, .65, 17, False, 'C7D6CB' if dark else MUTED)
    line(s, .65, 8.45, 15.35, 8.45, DARKCARD if dark else LINE)
    txt(s, 'DORIAN JOLY  /  RNCP39583 · BLOC 3', .65, 8.61, 7, .2, 9, False, 'B9CABE' if dark else MUTED)
    txt(s, f'{n:02d}', 14.6, 8.54, .75, .32, 16, True, LIME if dark else GREEN, PP_ALIGN.RIGHT)
    s.notes_slide.notes_text_frame.text = SOURCE[n-1]['notes']
    return s


def callout(s, text, y=7.65, dark=False):
    rect(s, .65, y, .055, .42, LIME if dark else GREEN)
    txt(s, text, .88, y+.025, 14.15, .55, 18, True, LIME if dark else GREEN)


def stat(s, value, label, x, y, w=3.5, dark=False, detail=None):
    txt(s, value, x, y, w, .95, 56, True, LIME if dark else GREEN)
    txt(s, label, x, y+1.02, w, .6, 20, True, WHITE if dark else INK)
    if detail:
        txt(s, detail, x, y+1.82, w, 1.1, 16, False, 'C7D6CB' if dark else MUTED)


def table(s, rows, widths, x=.65, y=2.65, h=4.6, size=17):
    t = s.shapes.add_table(len(rows), len(rows[0]), Inches(x), Inches(y), Inches(sum(widths)), Inches(h)).table
    for i, width in enumerate(widths):
        t.columns[i].width = Inches(width)
    for ri, row in enumerate(rows):
        t.rows[ri].height = Inches(h/len(rows))
        for ci, value in enumerate(row):
            cell = t.cell(ri, ci)
            cell.text = str(value)
            cell.margin_left = Inches(.15)
            cell.margin_right = Inches(.12)
            cell.margin_top = Inches(.07)
            cell.margin_bottom = Inches(.06)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.fill.solid()
            cell.fill.fore_color.rgb = color(INK if ri == 0 else WHITE if ri%2 else PALE)
            for p in cell.text_frame.paragraphs:
                p.font.name, p.font.size = FONT, Pt(size)
                p.font.bold = ri == 0 or ci == 0
                p.font.color.rgb = color(WHITE if ri == 0 else INK)
            props = cell._tc.get_or_add_tcPr()
            for tag in ['lnL', 'lnR', 'lnT', 'lnB']:
                edge = OxmlElement('a:'+tag)
                edge.append(OxmlElement('a:noFill'))
                props.append(edge)
    return t


def chart(s, categories, series, x, y, w, h, maximum, dark=False, stacked=False,
          fmt='0', colors=None, labels=True, legend=False, minimum=0, reverse=True):
    data = CategoryChartData()
    data.categories = categories
    for name, vals in series:
        data.add_series(name, vals)
    ch = s.shapes.add_chart(XL_CHART_TYPE.BAR_STACKED if stacked else XL_CHART_TYPE.BAR_CLUSTERED,
                           Inches(x), Inches(y), Inches(w), Inches(h), data).chart
    ch.chart_style = 10
    ch.has_title = False
    ch.font.name = FONT
    ch.font.size = Pt(16)
    ch.font.color.rgb = color(WHITE if dark else INK)
    ch.has_legend = legend
    if legend:
        ch.legend.position = XL_LEGEND_POSITION.BOTTOM
        ch.legend.include_in_layout = False
        ch.legend.font.name, ch.legend.font.size = FONT, Pt(13)
    ch.category_axis.reverse_order = reverse
    ch.category_axis.tick_label_position = XL_TICK_LABEL_POSITION.LOW
    ch.category_axis.tick_labels.font.size = Pt(16)
    ch.value_axis.minimum_scale = minimum
    ch.value_axis.maximum_scale = maximum
    ch.value_axis.tick_labels.font.size = Pt(12)
    ch.value_axis.tick_labels.number_format = fmt
    ch.value_axis.has_major_gridlines = True
    ch.value_axis.major_gridlines.format.line.color.rgb = color(DARKCARD if dark else LINE)
    ch.value_axis.major_gridlines.format.line.width = Pt(.6)
    for axis in [ch.category_axis, ch.value_axis]:
        axis.format.line.fill.background()
        axis.tick_labels.font.name = FONT
        axis.tick_labels.font.color.rgb = color('C7D6CB' if dark else MUTED)
    plot = ch.plots[0]
    plot.gap_width = 65
    plot.has_data_labels = labels
    if labels:
        plot.data_labels.position = XL_LABEL_POSITION.OUTSIDE_END if not stacked else XL_LABEL_POSITION.CENTER
        plot.data_labels.font.name, plot.data_labels.font.size = FONT, Pt(17)
        plot.data_labels.font.bold = True
        plot.data_labels.font.color.rgb = color(WHITE if dark else INK)
        plot.data_labels.number_format = fmt
    for i, ser in enumerate(ch.series):
        fill = (colors or [GREEN, 'BBCBAE'])[i % len(colors or [GREEN, 'BBCBAE'])]
        if fill is None:
            ser.format.fill.background()
        else:
            ser.format.fill.solid()
            ser.format.fill.fore_color.rgb = color(fill)
        ser.format.line.fill.background()
    # Prevent theme-dependent chart-area backgrounds in PowerPoint / LibreOffice.
    for parent in [ch._chartSpace, ch._chartSpace.chart.plotArea]:
        props = OxmlElement('c:spPr')
        props.append(OxmlElement('a:noFill'))
        border = OxmlElement('a:ln')
        border.append(OxmlElement('a:noFill'))
        props.append(border)
        parent.append(props)
    return ch


def points(ch, fills):
    for point, fill in zip(ch.series[0].points, fills):
        point.format.fill.solid()
        point.format.fill.fore_color.rgb = color(fill)
        point.format.line.fill.background()


# 01 — Opening.
s = base(1, '', 'Soutenance · septembre 2026', dark=True)
picture(s, 'spity/public/images/brand/escalade-falaise-coucher-soleil.jpeg', 8.65, 0, 7.35, 8.4, True)
pill(s, 'COORDONNER & PILOTER', .7, 1.55, 3.0, True)
txt(s, 'Un projet.\nUne équipe.\nUn cap.', .65, 2.28, 8, 3.5, 64, True, WHITE)
txt(s, 'Spity, le lien entre grimpeurs et clubs.', .7, 6.23, 7.4, .8, 24, False, 'C7D6CB')
txt(s, 'Dorian Joly', .7, 7.35, 4, .4, 20, True, LIME)
txt(s, '30 min · démonstration incluse', 10, 7.75, 5.3, .4, 17, True, WHITE, PP_ALIGN.RIGHT)

# 02 — Agenda with explicit timing.
s = base(2, 'Sommaire', 'Le parcours de la présentation', dark=True)
stat(s, '30', 'minutes pour présenter', .75, 2.9, 4, True, '24 min d’explications\n6 min de démonstration')
for i, (num, label, timing) in enumerate(SOURCE[1]['content']['items']):
    y = 2.65+i*.91
    txt(s, num, 5.6, y, .7, .5, 25, True, LIME)
    txt(s, label, 6.5, y, 5.7, .48, 24, True, WHITE)
    txt(s, timing, 12.5, y+.1, 2.65, .35, 14, False, 'C7D6CB', PP_ALIGN.RIGHT)
    line(s, 6.5, y+.65, 15.15, y+.65, DARKCARD)
callout(s, 'Du besoin utilisateur à la décision de validation.', dark=True)

# 03 — Product and audience.
s = base(3, 'Relier les grimpeurs. Simplifier les sorties.', '01 / Le projet Spity', 'Le besoin du commanditaire fictif : Collectif Altitude Grimpe.')
for i, (label, heading, detail) in enumerate([
    ('GRIMPEUR', 'Trouver un partenaire', 'Un niveau adapté, une discipline\ncommune, une sortie à rejoindre.'),
    ('CLUB', 'Organiser une sortie', 'Publier un événement, gérer les\nplaces et retrouver les participants.')]):
    y = 2.85+i*2.05
    pill(s, label, .7, y, 1.8)
    txt(s, heading, .7, y+.57, 5.7, .6, 27, True)
    txt(s, detail, .7, y+1.17, 5.7, .8, 18, False, MUTED)
rect(s, 6.85, 2.68, 8.5, 4.82, INK, True)
picture(s, 'docs/rncp/bloc-03/preuves/captures/lieux-2026-09-15.png', 7.03, 2.83, 8.14, 4.46)
callout(s, 'Un parcours démontré : partenaire → événement → inscription.')

# 04 — Actual elapsed time and estimated effort use different units.
s = base(4, 'Spity : un an de développement', '01 / Le projet Spity', 'Un projet développé sur une année. Les barres présentent la charge estimée dans le Bloc 1.')
seq = PLAN['globalPlanning']['sequence']
chart(s, [r['title'] for r in seq],
      [('Charge estimée', [r['personDays'] for r in seq])], .6, 2.6, 10.5, 4.75, 14,
      fmt='0" j-h"', colors=[GREEN])
rect(s, 11.55, 2.7, 3.8, 4.65, PALE, True)
stat(s, '1 an', 'durée réelle du projet', 11.85, 3.08, 3.15)
txt(s, '82 j-h estimés', 11.85, 5.27, 3.1, .5, 22, True)
txt(s, 'Charge estimée du MVP.\nRéférence de cadrage B1.', 11.85, 5.96, 3.1, .85, 17, False, MUTED)
callout(s, 'La suite : un scénario fictif de préparation sur 15 jours, à partir de Spity déjà développé.')

# 05 — Flow and ceremonies.
s = base(5, 'Un flux visible, des rendez-vous utiles', '02 / Organiser le travail', 'Linear : relevé réel. Kanban et rituels Scrum : scénario fictif de 15 jours.')
chart(s, ['Terminé', 'En cours', 'À faire', 'Backlog'], [('Tickets', [12, 1, 4, 7])], .6, 2.75, 7.0, 3.7, 14)
pill(s, '12 / 24 TERMINÉS', 1.1, 6.8, 2.6)
txt(s, 'Relevé du 14/09 · sans pondération', 1.1, 7.25, 6.2, .35, 15, False, MUTED)
for i, (name, when, detail) in enumerate([
    ('Planning', 'J3', 'Objectif, tâches et capacité'), ('Daily', '10 min / jour', 'Avancement, obstacle, action'),
    ('Review', 'J10 et J15', 'Parcours et retour client'), ('Rétrospective', 'J15', 'Une amélioration à suivre')]):
    y=2.7+i*1.08
    rect(s, 8.05, y, 7.3, .93, WHITE, True)
    txt(s, name, 8.28, y+.16, 2.9, .38, 21, True)
    txt(s, when, 12.0, y+.18, 3.0, .3, 14, True, GREEN, PP_ALIGN.RIGHT)
    txt(s, detail, 8.28, y+.57, 6.6, .26, 14, False, MUTED)
callout(s, '2 tâches en réalisation au maximum. Une réunion produit une action retrouvable.')

# 06 — Relative lot planning.
s = base(6, 'Scénario fictif : 15 jours de préparation', '02 / Organiser le travail', 'Développement réel : 1 an. J1 à J15 désignent uniquement les jours ouvrés de cet exercice.')
chart(s, ['Étude', 'Mesure', 'Conception', 'Réalisation', 'Recette', 'Restitution'],
      [('Début', [1,1,2,3,10,14]), ('Durée', [1,2,2,9,4,1])], .65, 2.65, 10.7, 4.5, 15,
      minimum=1, stacked=True, fmt='"J"0', colors=[None, GREEN], labels=False)
for i,(day,label) in enumerate([('J3','Périmètre et critères'),('J10','Écarts et arbitrages'),('J14','Recette terminée'),('J15','Démonstration')]):
    y=2.88+i*1.06
    pill(s,day,11.85,y,1.0)
    txt(s,label,11.85,y+.44,3.4,.42,18,True)
callout(s, 'Sur le logiciel existant : préciser les critères, stabiliser les parcours, tester et démontrer.')

# 07 — Team allocation.
s = base(7, 'Des missions claires, des moyens adaptés', '02 / Organiser le travail', 'Équipe et capacités du scénario. QA signifie assurance qualité.')
for i,(role,cap,title,detail) in enumerate([
    ('CP','30 h','Chef de projet','Organiser le travail\nArbitrer les demandes\nPréparer la validation'),
    ('DEV','72 h','Développeur','Réaliser les parcours\nSécuriser les inscriptions\nCorriger les anomalies'),
    ('QA','30 h','Camille','Préparer les critères T02\nRecetter les parcours T07\nConsignes écrites et sous-titres')]):
    x=.65+i*5.02
    rect(s,x,2.75,4.65,3.8,WHITE,True)
    pill(s,role,x+.27,3.0,1.0)
    txt(s,cap,x+.27,3.55,4,.82,47,True,GREEN)
    txt(s,title,x+.27,4.5,4,.5,24,True)
    txt(s,detail,x+.27,5.18,4.13,1.2,17,False,MUTED)
txt(s,'Camille : QA malentendante fictive · charge prévue de 24 h pour 30 h disponibles.',.7,6.86,14.5,.5,17,True,GREEN)
callout(s,'Ordinateur, navigateur, base locale. Linear : tâches. Git : versions. RACI : annexe 24.')

# 08 — Workload variance.
s = base(8, 'Anticiper 5 heures de travail supplémentaires', '03 / Suivre et décider', 'À J10 : 77 h consommées + 40 h restantes = 117 h prévues à terminaison.')
ch=chart(s,['Planning','Accès','Événements','Recette','Corrections'],[('Écart de charge',[1,2,2,2,-2])],.7,2.7,9.7,4.55,3,minimum=-3,fmt='+0" h";-0" h"')
points(ch,[ORANGE,ORANGE,ORANGE,ORANGE,GREEN])
stat(s,'+5 h','112 h → 117 h',11.1,2.95,4)
line(s,11.1,4.97,15.3,4.97)
txt(s,'Deux dates décalées',11.1,5.25,4.0,.5,21,True)
txt(s,'Événements : J11 → J12\nRecette : J13 → J14',11.1,5.94,4.1,1.15,19,False,MUTED)
callout(s,'Chaque glissement vaut un jour. Un écart de charge ne se confond pas avec un retard.')

# 09 — Budget centerpiece.
s=base(9,'Une dérive visible. Une marge encore disponible.','03 / Suivre et décider','Budget du lot pédagogique ; distinct du budget global B1 de 44 250 €.',True)
ch=chart(s,['Initial','Prévision','Plafond'],[('Budget',[4270,4465,4697])],.65,2.85,9.8,3.65,5500,True,fmt='0" €"',colors=[LIME])
points(ch,['87A38D',LIME,'C7D6CB'])
stat(s,'232 €','de marge sous le plafond',11.0,3.0,4.35,True,'+195 € par rapport\nà la référence de 4 270 €')
callout(s,'La réserve absorbe l’écart ; elle ne le fait pas disparaître.',dark=True)

# 10 — Capacity, native chart.
s=base(10,'Le point de tension : la capacité du chef de projet','03 / Suivre et décider','La charge se compare à la capacité de chaque rôle, pas seulement au total de l’équipe.')
chart(s,['CP','DEV','QA'],[('Charge',[29,64,24]),('Marge',[1,8,6])],.65,2.95,10.1,3.9,80,stacked=True,fmt='0" h"',colors=['85A689','DAE5D1'],legend=True)
stat(s,'96,7 %','de la capacité CP',11.2,2.96,4)
txt(s,'1 h de marge',11.2,5.03,4,.55,27,True,ORANGE)
txt(s,'Alerte au-delà de 90 %.\nLimiter les demandes.\nProtéger les arbitrages.',11.2,5.74,4,1.4,18,False,MUTED)
callout(s,'CP : 29/30 h · DEV : 64/72 h · QA : 24/30 h.')

# 11 — Risks and concrete actions.
s=base(11,'Repérer le risque. Déclencher une action.','03 / Suivre et décider','Chaque risque possède un responsable, un déclencheur et une réponse dans A03.')
txt(s,'PROBABILITÉ',.8,2.6,3,.35,12,True,MUTED)
for r in range(3):
    for c in range(3):
        value=(3-r)*(c+1)
        rect(s,1.3+c*1.5,3.05+r*1.13,1.4,1.03,'E9B193' if value>=6 else 'D7E8AF' if value>=3 else PALE,True)
    txt(s,str(3-r),.8,3.37+r*1.13,.4,.35,17,True)
for c in range(3):txt(s,str(c+1),1.83+c*1.5,6.58,.4,.4,17,True)
txt(s,'R01',4.64,3.35,1,.4,20,True)
txt(s,'R02 · R03\nR04 · R05',4.38,4.32,1.33,.72,14,True)
txt(s,'IMPACT',4.8,7.0,1.5,.3,12,True,MUTED)
for i,(rid,title,action) in enumerate([
    ('R01','Démonstration','Sonde en échec → vérifier l’environnement.'),
    ('R02','Charge CP','Plus de 90 % → limiter les demandes.'),
    ('R03','Périmètre','Plafond dépassé → arbitrer avant engagement.'),
    ('R04','Inscriptions','Capacité incohérente → bloquer la validation.'),
    ('R05','Dépôt','Pièce manquante → contrôler la checklist.')]):
    y=2.75+i*.87
    pill(s,rid,6.65,y,1.0)
    txt(s,title,7.85,y-.02,7,.4,21,True)
    txt(s,action,7.85,y+.4,7.5,.4,16,False,MUTED)
callout(s,'Priorité : préserver une démonstration utilisable et un périmètre maîtrisé.')

# 12 — Technical decision.
s=base(12,'Choisir un test proche du logiciel livré','03 / Arbitrer','Problème documenté : les compilations du serveur de développement perturbent la recette.',True)
for i,(num,title,benefit,limit) in enumerate([
    ('01','Retries','Ajouter des tentatives','Risque de masquer la cause'),
    ('02','Préchauffage','Réduire les compilations','Routes à préparer'),
    ('03','Standalone','Tester le build livré','Construction préalable')]):
    x=.65+i*5.02
    selected=i==2
    rect(s,x,2.88,4.65,3.95,LIME if selected else DARKCARD,True)
    fg=INK if selected else WHITE
    txt(s,num,x+.3,3.16,3,.55,31,True,INK if selected else LIME)
    txt(s,title,x+.3,4.07,4.05,.63,29,True,fg)
    txt(s,benefit,x+.3,5.02,4.05,.76,20,True,fg)
    txt(s,limit,x+.3,6.06,4.05,.5,16,False,INK if selected else 'C7D6CB')
callout(s,'Choix visible dans Git : 689e59d · 20 juillet 2026. Comparaison rétrospective.',dark=True)

# 13 — Scope decision.
s=base(13,'Reporter les topos pour préserver le lot','03 / Arbitrer','Demande fictive à J10 : +12 h DEV et +4 h QA, soit +540 €.')
ch=chart(s,['Lot engagé','Avec demande','Plafond'],[('Coût',[4465,5005,4697])],.65,2.87,10.1,3.95,6000,fmt='0" €"')
points(ch,[GREEN,ORANGE,'A7BA9C'])
pill(s,'DÉCISION DU CAS',11.25,2.97,3.1)
txt(s,'Report',11.2,3.75,4,.95,52,True,GREEN)
txt(s,'−308 € de marge\nDEV : 76 h / 72 h',11.2,5.0,4.1,1.15,22,True,ORANGE)
txt(s,'Les critères de recette\nrestent inchangés.',11.2,6.37,4.1,.8,18,False,MUTED)
callout(s,'Ajouter, réduire la recette ou reporter : la décision protège la qualité et la capacité.')

# 14 — Management, use four concrete situations instead of decoration.
s=base(14,'Adapter la posture à la situation','04 / L’équipe et le client','Cas fictif : DEV veut ajouter une fonction ; QA attend un parcours stable.',True)
for i,(title,verb,detail) in enumerate([
    ('Participatif','Écouter','Comparer les options et leurs impacts.'),
    ('Persuasif','Expliquer','Justifier le report auprès du client.'),
    ('Directif','Fixer','Maintenir les critères de livraison.'),
    ('Délégatif','Confier','Donner un résultat et un contrôle.')]):
    x=.65+(i%2)*7.52;y=2.72+(i//2)*1.95
    rect(s,x,y,7.18,1.72,DARKCARD,True)
    txt(s,title.upper(),x+.25,y+.2,6.6,.3,12,True,LIME)
    txt(s,verb,x+.25,y+.66,2.6,.6,30,True,WHITE)
    txt(s,detail,x+3.0,y+.67,3.85,.8,19,False,'DCE6DA')
callout(s,'Rétro J15 : sortir les diagnostics techniques du daily ; CP suit la prochaine action.',dark=True)

# 15 — Accessible remote collaboration.
s=base(15,'Une équipe à distance, des décisions accessibles','04 / L’équipe et le client','Camille, QA malentendante fictive · scénario Paris / Montréal.')
table(s,[['Situation','Aménagement retenu'],['Réunions','Sous-titres testés ; une personne parle à la fois.'],['Décisions','Synthèse écrite, responsable et échéance.'],['Formation','Consignes écrites et démonstration sous-titrée.']], [3.1,11.6],y=2.62,h=2.95,size=21)
for i,(day,verb) in enumerate([('J3','Comprendre'),('J10','Retrouver'),('J14','Réaliser sans aide')]):
    x=.82+i*5.02
    pill(s,day,x,6.05,1.0)
    txt(s,verb,x+1.27,6.04,3.6,.5,22,True)
txt(s,'Paris / Montréal : créneau commun avec fuseaux, avis écrits, glossaire FR/EN et reformulation.',.82,7.0,14.4,.6,18,False,MUTED)

# 16 — Exact six competencies.
s=base(16,'Cibler les écarts qui menacent le lot','04 / Développer les compétences','Grille du scénario : niveau actuel, cible et justification commentée dans les notes.')
table(s,[['Rôle','Compétence','Actuel','Cible'],['CP','Planning et suivi des écarts','1','2'],['CP','Animation et arbitrage','2','2'],['DEV','Développement typé et validation','2','2'],['DEV','Transactions et concurrence','1','2'],['Camille, QA','Recette navigateur reproductible','1','2'],['Camille, QA','Clavier et formulaires','1','2']], [2.3,8.5,1.95,1.95], y=2.65,h=4.38,size=20)
callout(s,'0 : non abordé · 1 : accompagné · 2 : autonome · 3 : cas complexes.')

# 17 — Training cards.
s=base(17,'Six heures pour renforcer l’autonomie','04 / Développer les compétences','6 h incluses dans les tâches · 60 € de ressources complémentaires dans le scénario.')
for i,(role,when,time,topic,success) in enumerate([
    ('CP','J3','1 h','Tableau de bord','Expliquer un écart recalculé.'),
    ('DEV','J9–J12','2 h','Concurrence','Une place, une seule inscription acceptée.'),
    ('Camille, QA','J10–J14','3 h','Recette + clavier','Rejouer un cas sans aide.')]):
    x=.65+i*5.02
    rect(s,x,2.72,4.65,3.97,WHITE,True)
    pill(s,role,x+.25,3.0,2.1)
    txt(s,when,x+.27,3.57,3.9,.35,16,True,MUTED)
    txt(s,time,x+.27,4.12,3.9,.85,48,True,GREEN)
    txt(s,topic,x+.27,5.07,4.1,.6,23,True)
    txt(s,success,x+.27,5.83,4.1,.72,18,False,MUTED)
txt(s,'Camille : 2 h de recette + 1 h de clavier ; consignes écrites et démonstration sous-titrée.',.75,7.02,14.5,.5,17,True,GREEN)
callout(s,'À J12 : si une compétence critique reste indisponible, arbitrer le besoin RH (annexe 26).')

# 18 — Client report with actual structured content.
s=base(18,'Transformer la review en décision','04 / Le suivi client','CR02 · J10 · compte rendu fictif avec Claire Martin, Collectif Altitude Grimpe.')
for i,(label,heading,detail) in enumerate([
    ('01 / CONSTAT','Un écart à traiter','Événements : J11 → J12\nPrévision : 4 465 €'),
    ('02 / DÉCISION','Reporter les topos','Maintenir le périmètre\net les critères de recette.'),
    ('03 / ACTIONS','Responsables et dates','DEV : T06 à J12\nQA : recette J14 · CP : J15')]):
    x=.65+i*5.02
    rect(s,x,2.8,4.65,3.05,WHITE,True)
    txt(s,label,x+.25,3.1,4.1,.3,12,True,GREEN)
    txt(s,heading,x+.25,3.77,4.1,.8,25,True)
    txt(s,detail,x+.25,4.74,4.1,.91,19,False,MUTED)
for i,(day,label) in enumerate([('J3','Périmètre'),('J10','Review / CR02'),('J15','Validation / CR03')]):
    x=.9+i*5.0
    pill(s,day,x,6.47,1)
    txt(s,label,x+1.25,6.46,3.7,.48,21,True)
callout(s,'A07 centralise les comptes rendus et critères. La rétrospective suit la review J15.')

# 19 — Measurement protocol.
s=base(19,'Mesurer la satisfaction pour agir','04 / Le suivi client','Protocole proposé à J15 : 2 grimpeurs et 1 club. Résultats réels non mesurés.')
for i,(value,name,method) in enumerate([
    ('100 %','Critères critiques','Acceptés / évalués'),('≥ 80 %','Parcours sans aide','Réussis sans aide / tentés'),
    ('≥ 4/5','Utilité perçue','Moyenne des notes + effectif'),('0','Blocage critique','Tâches empêchées encore ouvertes')]):
    x=.65+i*3.77
    rect(s,x,2.9,3.42,3.82,WHITE,True)
    txt(s,value,x+.22,3.29,3,.93,40,True,GREEN)
    txt(s,name,x+.22,4.52,3,1.0,23,True)
    txt(s,method,x+.22,5.8,3,.75,16,False,MUTED)
callout(s,'Sous le seuil : qualifier le problème → affecter une correction → vérifier à nouveau.')

# 20 — Live demonstration interlude.
s=base(20,'','05 / Démontrer et valider',dark=True)
picture(s,'spity/public/images/brand/escalade-falaise-gros-plan.jpeg',8.8,0,7.2,8.4,True)
pill(s,'DÉMONSTRATION EN DIRECT',.75,1.65,3.55,True)
txt(s,'Passer du suivi\nà l’usage.',.7,2.49,8.0,2.15,54,True,WHITE)
txt(s,'6 min',.7,5.15,6,.99,64,True,LIME)
txt(s,'Une session grimpeur.\nUne session club.',.75,6.75,7.3,1.04,25,False,WHITE)

# 21/22 — Browser evidence and readable step labels.
for n,title,filename,steps in [
    (21,'Trouver un partenaire','matching',['Profil','Filtres','Demande']),
    (22,'Retrouver les participants','evenements',['Événement','Inscription','Participants'])]:
    s=base(n,title,'05 / Démonstration', 'Parcours grimpeur' if n==21 else 'Parcours club')
    rect(s,.65,2.4,9.2,5.84,INK,True)
    picture(s,f'docs/rncp/bloc-03/preuves/captures/{filename}-2026-09-15.png',.79,2.51,8.92,5.62)
    for i,label in enumerate(steps):
        y=3.14+i*1.37
        pill(s,f'0{i+1}',10.7,y,1.0)
        txt(s,label,10.7,y+.48,4.4,.53,28,True)
    txt(s,'Capture de secours · 15/09/2026',10.7,7.85,4.5,.25,11,False,MUTED)

# 23 — Clear final decision.
s=base(23,'Valider ce qui a été réellement démontré','05 / Démontrer et valider','Quatre critères, puis une décision explicite sur le périmètre présenté.',True)
for i,(name,criteria) in enumerate([
    ('Partenaire','Filtres cohérents et état de demande clair.'),('Inscription','Confirmation et capacité respectée.'),
    ('Organisation club','Participant visible et commandes autorisées.'),('Utilisation','Commandes nommées et parcours au clavier.')]):
    x=.65+(i%2)*7.52;y=2.7+(i//2)*1.6
    rect(s,x,y,7.18,1.36,DARKCARD,True)
    txt(s,name,x+.23,y+.18,6.7,.43,24,True,LIME)
    txt(s,criteria,x+.23,y+.8,6.7,.43,17,False,WHITE)
txt(s,'Accepté  /  Accepté avec réserve  /  Refusé',.8,6.6,14.4,.58,29,True,WHITE)
callout(s,'Chaque réserve : une action, un responsable, une échéance. Transmission au Bloc 4.',dark=True)

# 24 — Responsibilities, full native table.
s=base(24,'Qui réalise ? Qui décide ?','Annexe / Matrice RACI','CP : chef de projet · DEV : développeur · QA : Camille · client fictif.')
table(s,[['Activité','CP','DEV','QA','Client'],['Périmètre et critères','R','C','C','A'],['Planification et affectation','A/R','C','C','I'],['Réalisation','A','R','C','I'],['Recette des parcours','A','C','R','C'],['Corrections','A','R','C','I'],['Arbitrage délai, coût, périmètre','R','C','C','A'],['Acceptation de la démonstration','R','C','C','A']], [7.1,1.9,1.9,1.9,1.9],y=2.6,h=4.6,size=19)
callout(s,'R : réalise · A : décide · C : consulté · I : informé.')

# 25 — Sensitivity, independently evaluated alternatives.
s=base(25,'Quand le budget ou la capacité basculent','Annexe / Sensibilité','Variantes indépendantes : leurs coûts ne se cumulent pas.')
table(s,SOURCE[24]['content']['rows'],[3.9,3.1,2.7,5.0],y=2.7,h=4.45,size=20)
callout(s,'Une marge budgétaire positive ne garantit pas une capacité suffisante par métier.')

# 26 — Conditional recruitment; no invented hiring.
s=base(26,'Préparer un renfort, sans l’engager','Annexe / Demande aux RH','Fiche conditionnelle préparée par CP ; non envoyée, non activée.')
table(s,[['Point à transmettre','Besoin conditionnel'],['Déclencheur à J12','Compétence critique indisponible après formation.'],['Mission et disponibilité','Renfort QA : 4 h à J12–J13 ; recette transmissible à Camille.'],['Sélection et accueil','Exercice accessible, disponibilité à confirmer ; accueil CP : 0,5 h.'],['Coût supplémentaire','180 € de renfort + 22,50 € CP = 202,50 €.'],['Arbitrage avant engagement','Prévision : 4 667,50 € · marge : 29,50 € · CP : 29,5/30 h.']], [3.8,10.9],y=2.6,h=4.58,size=19)
callout(s,'Décider sur le besoin, la disponibilité, le coût et l’accueil du renfort.')

assert len(P.slides) == len(SOURCE) == 26
assert sum(s['minutes'] for s in SOURCE) == 30
assert sum(s['minutes'] for s in SOURCE if s['demo']) == 6
for n, slide in enumerate(P.slides, 1):
    assert slide.notes_slide.notes_text_frame.text == SOURCE[n-1]['notes']
    for shape in slide.shapes:
        assert shape.left >= 0 and shape.top >= 0, (n, shape.name)
        assert shape.left+shape.width <= P.slide_width+10, (n, shape.name, 'right')
        assert shape.top+shape.height <= P.slide_height+10, (n, shape.name, 'bottom')
OUT.parent.mkdir(parents=True, exist_ok=True)
P.save(OUT)
print(OUT)
