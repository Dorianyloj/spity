"""Build the data-driven annexes and evidence index for the Bloc 3 kit."""
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/rncp/bloc-03'
DATA = json.loads((DOCS / 'donnees/pilotage.json').read_text(encoding='utf-8'))

def write(name, text):
    target = DOCS / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text.strip() + '\n', encoding='utf-8', newline='\n')

def table(headers, rows):
    return '\n'.join(['| ' + ' | '.join(headers) + ' |', '| ' + ' | '.join(['---'] * len(headers)) + ' |'] + ['| ' + ' | '.join(str(v) for v in row) + ' |' for row in rows])

def metrics():
    roles = {r['id']: r for r in DATA['roles']}
    tasks = DATA['tasks']
    planned = sum(t['plannedHours'] for t in tasks)
    spent = sum(t['spentHours'] for t in tasks)
    remaining = sum(t['remainingHours'] for t in tasks)
    base = sum(t['plannedHours'] * roles[t['role']]['hourlyRate'] for t in tasks) + sum(e['planned'] for e in DATA['expenses'])
    forecast = sum((t['spentHours'] + t['remainingHours']) * roles[t['role']]['hourlyRate'] for t in tasks) + sum(e['forecast'] for e in DATA['expenses'])
    return dict(plannedHours=planned, spentHours=spent, remainingHours=remaining, forecastHours=spent+remaining, plannedCost=base, forecastCost=forecast, reserve=base*DATA['reserveRate'], ceiling=base*(1+DATA['reserveRate']), margin=base*(1+DATA['reserveRate'])-forecast)

def main():
    m = metrics()
    write('donnees/indicateurs.json', json.dumps(m, ensure_ascii=False, indent=2))
    rows = [[t['id'], t['title'], t['role'], f"J{t['start']}-J{t['finish']}", f"J{t['forecastFinish']}", t['plannedHours'], ', '.join(t['dependencies']) or 'Aucune'] for t in DATA['tasks']]
    write('annexes/A01_PLANNING.md', '# A01 - Planning et jalons\n\nNature : simulation pédagogique sur quinze jours ouvrés relatifs. Les jours ne sont pas des dates historiques. Le planning initial est conservé pour comparer les écarts à J10.\n\n' + table(['ID','Tâche','Rôle','Prévu','Fin revue','Heures prévues','Prérequis'], rows) + '''

Le planning distingue étude (T01), mesure des besoins (T02), conception de l'organisation (T03), réalisation (T04/T05/T06), mesure du résultat et corrections (T07/T10), pilotage (T08) et restitution (T09). Les tâches de recette commencent sur les fonctions déjà livrées. Leur clôture dépend aussi de T06 et T10. La préparation du support peut avancer avant la réception ; la démonstration finale exige une recette terminée.

| Jalon | Condition de passage | Autorité dans le scénario |
| --- | --- | --- |
| J3 - Périmètre | Besoins et critères formalisés | Client fictif |
| J8 - Parcours partenaire | Accès, profils et matching vérifiés | CP avec QA |
| J10 - Revue d'écarts | Reste à faire et arbitrages actualisés | CP et client fictif |
| J14 - Recette | Événements et corrections vérifiés | CP avec QA |
| J15 - Restitution | Parcours démontré, réserves identifiées | Client fictif |

Points de vigilance : charge CP proche de sa capacité, dépendance de la recette à la stabilisation des événements, démarrage de la base locale, disponibilité du client et éventuelles demandes nouvelles. Une fin revue n'écrase jamais la référence initiale.

Historique réel distinct : premier commit le 22 janvier 2026, socle le 24 janvier, interface en mai, recette et corrections en juillet, maintenance en août, évolutions et backlog en septembre. Ces jalons sont issus de Git ; ils ne donnent pas le temps de travail réel ni la date de démarrage contractuelle du projet.
''')
    role_rows = []
    for role in DATA['roles']:
        tasks = [t for t in DATA['tasks'] if t['role'] == role['id']]
        p=sum(t['plannedHours'] for t in tasks)
        f=sum(t['spentHours']+t['remainingHours'] for t in tasks)
        role_rows.append([role['id'],p,f,role['capacityHours'],f"{f/role['capacityHours']:.1%}",role['hourlyRate']])
    risk_rows=[[r['id'],r['title'],r['probability'],r['impact'],r['probability']*r['impact'],r['owner']] for r in DATA['risks']]
    write('annexes/A03_INDICATEURS_RISQUES.md', '# A03 - Indicateurs, coûts et risques\n\nNature : données simulées à J10. Les taux servent à valoriser le travail dans le cas ; aucune dépense réelle n’est attestée.\n\n' + table(['Rôle','Prévu h','À terminaison h','Capacité h','Occupation','EUR/h'],role_rows) + '''

Les trois rôles représentent 112 h prévues, 77 h consommées et 40 h restantes. La prévision de 117 h est supérieure de 5 h au plan. La somme des capacités vaut 132 h, mais cette capacité ne se substitue pas librement entre métiers : DEV ne peut pas absorber du travail QA sans vérifier ses compétences et la séparation réalisation/validation.

Coût initial : 28 x 45 + 62 x 35 + 22 x 30 = 4 090 EUR de travail, plus 180 EUR de frais, soit 4 270 EUR. Prévision : 29 x 45 + 64 x 35 + 24 x 30 = 4 265 EUR, plus 200 EUR de frais, soit 4 465 EUR. Le dépassement de 195 EUR vaut 4,6 % de la référence. La réserve de 427 EUR porte le plafond à 4 697 EUR, avec 232 EUR de marge prévisionnelle.

Le consommé économique du cas vaut 2 945 EUR, dont 2 825 EUR de travail et 120 EUR de frais. Il ne s'agit pas d'un relevé bancaire. Les variations sont calculées à périmètre et taux constants.

## Registre des risques

Échelle proposée : probabilité et impact de 1 (faible) à 3 (fort). Priorité = produit des deux. Un score de 6 ou 9 déclenche une revue avant engagement du jalon. Ce score aide à ordonner l'analyse, sans remplacer la décision.

''' + table(['ID','Risque','P','I','Score','Responsable'],risk_rows) + '\n\n' + '\n\n'.join(f"**{r['id']}** - Déclencheur : {r['trigger']}. Réponse : {r['response']}." for r in DATA['risks']) + '''

## Règles de suivi

Chaque rôle actualise son consommé et son reste à faire. CP vérifie deux fois par semaine l'écart, les dates et la capacité. Une variation de budget dépassant la réserve, une charge supérieure à la capacité ou un critère critique non vérifié déclenche un arbitrage documenté. Les indicateurs de qualité s'appuient sur les résultats réellement exécutés dans VERIFICATION.md.

Linear a été relu directement le 14 septembre : 12 Done, 4 Todo, 1 In Progress, 7 Backlog et 1 Canceled. Le taux de tickets Done est de 12 / 24 = 50 % hors annulé. Il ne mesure pas la part de produit livrée. A09 conserve le relevé, les dépendances lues, les 30 activités estimées et les tests de sensibilité. La feuille Linear reste distincte du scénario.
''')
    matrix = [
        ['C.3.1','Méthode, planning, phases, ressources, affectations, handicap, vigilances','A01 ; A02','Simulation et traces Git'],
        ['C3.2.1','Outil cohérent, indicateurs mesurables, coûts, délais, risques, RH','A03 ; A09 ; classeur ; vérification','Linear observé, simulation et tests datés'],
        ['C3.2.2','Problème, conséquences, options et décision argumentée','A04 ; commit 689e59d','Git observé, analyse rétrospective et simulation'],
        ['C3.3.1','Missions, charge, style, communication, critique et adaptations','A02 ; A05','Simulation'],
        ['C3.3.2','Grille commentée, écarts, formations adaptées et besoin RH','A06','Simulation'],
        ['C3.4.1','Comptes rendus, jalons de validation et satisfaction','A07','Simulation ; satisfaction réelle non mesurée'],
        ['C3.4.2','Logiciel utilisable, fonctions attendues, vocabulaire client, validation','A08 ; recette ; captures','Résultats explicités dans VERIFICATION.md'],
    ]
    write('MATRICE_PREUVES.md','# Correspondance avec la grille BC03\n\nCette matrice constate une couverture documentaire ; elle n’attribue pas la mention Acquis, qui relève du jury.\n\n'+table(['Compétence','Critères couverts','Pièces','Nature'],matrix)+'''

Le règlement spécial n'est pas fourni. La règle de 50 % des compétences et l'absence d'éliminatoire non acquise est rappelée, mais aucune compétence n'est déclarée éliminatoire sur simple supposition. Les preuves d'une situation fictive ne sont pas des attestations de management réel.
''')
    from competence_annexes import enrich
    enrich(DOCS)
    def git(*args):
        return subprocess.check_output(['git',*args],cwd=ROOT,text=True,encoding='utf-8').strip()
    # Les preuves datées ne sont pas régénérées : produire des documents ne rejoue pas les tests.
    write('preuves/historique-git.txt',git('log','-20','--date=short','--format=%h %ad %s')+'\n\nArbitrage :\n'+git('show','--stat','--format=commit %H%nDate: %ad%nSubject: %s','--date=short','689e59d'))
    print(json.dumps(m,ensure_ascii=False))

if __name__ == '__main__': main()
