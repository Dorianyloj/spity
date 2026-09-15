"""Extend generated annexes with global planning and calendar follow-up."""
import json

def enrich(docs):
    case=json.loads((docs/'donnees/consolidation.json').read_text(encoding='utf-8'))
    g=case['globalPlanning']; total=0;rows=[]
    for x in g['sequence']:
        start=total/g['capacityPersonDaysPerWeek'];total+=x['personDays'];end=total/g['capacityPersonDaysPerWeek']
        interval=f'{start:g} à {end:g}'.replace('.',',')
        rows.append(f"| {x['milestone']} - {x['title']} | {x['personDays']} j-h | {interval} | {x['result']} |")
    text="""

<!-- pagebreak -->

## Planning global, puis zoom sur le lot

Le diaporama du Bloc 1, p. 21, répartit 82 jours-homme entre neuf lots. Leurs intitulés et charges sont conservés dans reference-bloc-01.json ; B1-L01 à B1-L09 sont des identifiants de rapprochement ajoutés pour ce dossier. Le tableau ci-dessous donne un ordonnancement pédagogique séquentiel avec une capacité constante de 5 j-h par semaine. Les intervalles sont exprimés en semaines écoulées depuis un départ relatif, sans date historique inventée. Un jalon est franchi sur son résultat attendu, pas uniquement sur une consommation de temps.

| Lot du MVP cible | Charge B1 | Semaines écoulées | Résultat de passage |
| --- | --- | --- | --- |
"""+'\n'.join(rows)+"""

Le total est de 82 / 5 = 16,4 semaines de capacité, sous cette hypothèse séquentielle. Cette séquence reprend les charges du B1, pas l'état de livraison actuel de chaque fonction. Le prototype B2, les évolutions réelles de Linear et le registre de maintenance B4 gardent leurs périmètres datés. Les jours J1-J15 du lot B3 sont distincts des identifiants des neuf lots globaux. Les heures et coûts du lot ne s'ajoutent pas automatiquement au budget global.

Le suivi du cas combine Kanban dans Linear et des réunions inspirées de Scrum : planning J3, daily de dix minutes, reviews J10/J15 et rétrospective J15. Ce choix répond au petit effectif, aux priorités évolutives et au besoin de retours rapides. La limite de deux travaux simultanés évite la dispersion. Les critères de recette conditionnent le passage à Terminé. Les jalons intermédiaires et rôles du cas restent ceux d'une adaptation, sans revendication de Scrum complet. A05 détaille les objectifs et traces des réunions.

Le planning à barres complète le flux Kanban. Il permet de voir les chevauchements, les dates et les conditions de passage sans figer l'ordre de tous les petits travaux. Linear expose le travail courant ; les jalons fixent les engagements et le classeur conserve dates initiales et dates revues. Cette distinction justifie les outils et leur compatibilité. Dans le lot, la mesure porte sur les besoins et critères T02, puis sur la conformité de la recette T07.
"""
    p=docs/'annexes/A01_PLANNING.md';p.write_text(p.read_text(encoding='utf-8').rstrip()+text.rstrip()+'\n',encoding='utf-8',newline='\n')
    p=docs/'annexes/A03_INDICATEURS_RISQUES.md'
    text="""

## Écarts de dates et décision de suivi

| Tâche | Fin initiale | Fin revue à J10 | Retard prévisionnel | Conséquence |
| --- | --- | --- | --- | --- |
| T06 - Événements | J11 | J12 | 1 jour | Préserver les critères de capacité et préparer les corrections. |
| T07 - Recette | J13 | J14 | 1 jour | Clôturer après T06 et T10, avant la démonstration J15. |

Le retard se calcule par fin revue moins fin initiale. Ces deux écarts ne s'additionnent pas pour annoncer deux jours de retard de la démonstration : celle-ci reste prévue à J15. Les +5 h de charge ne sont pas cinq jours de retard. Exemple de mise à jour : renseigner le reste à faire T06 et sa nouvelle fin, relire charge/coût, vérifier la dépendance de T07 puis consigner l'effet dans CR02.

CP atteint 96,7 % de sa capacité, au-dessus de l'alerte de 90 %. Le scénario limite les demandes nouvelles et protège ses créneaux d'arbitrage. La recette est déjà confiée à QA ; ce n'est pas une nouvelle réaffectation faisant gagner des heures à CP. Tout ajout mobilisant plus que sa marge d'une heure nécessite un arbitrage. La capacité restante des autres rôles ne prouve pas qu'ils disposent de la compétence requise pour reprendre une tâche.
"""
    p.write_text(p.read_text(encoding='utf-8').rstrip()+text.rstrip()+'\n',encoding='utf-8',newline='\n')
    p=docs/'MATRICE_PREUVES.md'
    text="""

## Repères dans le support corrigé

| Compétence | Diapositives à présenter | Pièce détaillée |
| --- | --- | --- |
| C.3.1 | 4 : global ; 5 : Kanban ; 6 : phases ; 7 : missions | A01/A02 ; RACI en annexe 24 |
| C3.2.1 | 5 à 11 : flux, dates, charge, coûts et risques | A03/A09 ; classeur |
| C3.2.2 | 12-13 : problème, options et décision | A04 ; sensibilité en annexe 25 |
| C3.3.1 | 7, 10, 14-15 : missions, capacité, styles, handicap et contexte international | A02/A05 |
| C3.3.2 | 16 : grille ; 17 : formations et déclencheur RH | A06 ; variante RH en annexe 26 |
| C3.4.1 | 18 : CR02 ; 19 : protocole de satisfaction | A07 |
| C3.4.2 | 20-22 : manipulation ; 23 : validation et réserves | A07/A08 ; vérification de la version |
"""
    p.write_text(p.read_text(encoding='utf-8').rstrip()+text.rstrip()+'\n',encoding='utf-8',newline='\n')
