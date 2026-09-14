"""Generate rehearsal notes from the exact slide plan, without changing evidence."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/rncp/bloc-03'
slides = json.loads((DOCS / 'donnees/support-oral.json').read_text(encoding='utf-8'))
assert sum(s['minutes'] for s in slides) == 30

def clock(minutes):
    seconds = round(minutes * 60)
    return f'{seconds // 60:02d}:{seconds % 60:02d}'

parts = ['''# Guide de répétition — Bloc 3 Spity

Support associé : spity-bloc-3-30-minutes-visuel-v7.pptx. Vingt-deux diapositives principales couvrent trente minutes, dont six minutes de démonstration. Les trois dernières sont des annexes de réponse aux questions ; elles ne prolongent pas la présentation. Les graphiques et captures servent de repères visuels. Les explications détaillées restent dans les notes.

## Fil conducteur

Expliquer comment organiser et sécuriser la livraison d'un parcours utile : trouver un partenaire puis participer à une sortie organisée par un club. Annoncer dès le début la distinction entre le logiciel et ses preuves réelles, l'analyse historique et la mise en situation fictive de pilotage.

Le texte oral ci-dessous développe chaque diapositive et propose ses transitions. Le rythme prévu est d'environ 120 à 130 mots par minute, avec des pauses pour montrer les chiffres, et six minutes de manipulation commentée. La durée effective dépend du débit et de la démonstration : une répétition chronométrée permet d'ajuster les pauses et les exemples. Les diapositives avancent manuellement. Le rôle personnel et les échanges réels doivent être précisés avec le candidat avant la remise.

## Repères de temps

| Slide | Sujet | Durée | Temps cumulé |
| --- | --- | --- | --- |''']
elapsed = 0
for s in [slide for slide in slides if slide['minutes']>0]:
    elapsed += s['minutes']
    parts.append(f"| {s['number']} | {s['title']} | {clock(s['minutes'])} | {clock(elapsed)} |")
parts.append('''
À 15:00, terminer l'arbitrage de périmètre. À 23:00, quitter le suivi client pour lancer les six minutes de démonstration. À 29:00, revenir au bilan. Si une explication dépasse, condenser un exemple ; ne pas supprimer entièrement une compétence ni la démonstration.

## Notes par diapositive
''')
for s in slides:
    timing=f"{clock(s['startMinute'])} à {clock(s['endMinute'])}" if s['minutes'] else 'questions du jury, hors des trente minutes'
    parts.append(f"### {s['number']}. {s['title']}\n\nRepère : {timing}. Nature : {s['nature']}.\n\n**Texte oral proposé**\n\n{s['script']}\n")
    if s.get('action'): parts.append(f"**À montrer ou manipuler**\n\n{s['action']}\n")
    if s.get('transition'): parts.append(f"**Transition**\n\n{s['transition']}\n")
    parts.append(f"Source : {s['source']}\n")
parts.append('''## Questions probables du jury

1. **Qu'avez-vous réellement fait et qu'avez-vous simulé ?** Présenter les contributions personnelles confirmées par le candidat. Les commits et les vérifications sont observables. L'équipe CP/DEV/QA, les jours J1-J15, les coûts et les comptes rendus client appartiennent au cas fictif. Un test réussi ne prouve pas un échange client.
2. **Pourquoi Kanban ?** Le scénario retient un petit effectif, des priorités variables et des livraisons progressives. Une limite de travail en cours, des critères de terminé et des jalons structurent le suivi. Ne pas affirmer que Scrum a été pratiqué sans trace correspondante.
3. **Quel est le chemin vers la soutenance ?** Accès/profils, matching, événements, recette/corrections et validation J14 avant la démonstration J15. La recette peut commencer sur les fonctions prêtes ; sa clôture attend les corrections. Montrer A01 et les dépendances.
4. **Comment obtenez-vous 4 465 EUR ?** Valorisation du travail à terminaison : CP 29 h × 45 EUR, DEV 64 h × 35 EUR, QA 24 h × 30 EUR = 4 265 EUR ; ajouter 200 EUR de frais. Les taux et charges sont des hypothèses du lot. Le budget global B1 est de 38 126 EUR HT dans les fiches détaillées, sur 79 j-h. Il ne faut ni remplacer ce total par les coûts B3, ni les additionner. L’ancien diaporama B1 affiche une autre estimation, documentée dans COHERENCE_INTER_BLOCS.md.
5. **La réserve fait-elle disparaître le dépassement ?** Non : le coût reste supérieur de 195 EUR à la référence de 4 270 EUR. La réserve de 427 EUR porte le plafond à 4 697 EUR et laisse 232 EUR de marge. Un écart doit rester visible même s'il est absorbable.
6. **Pourquoi 50 % de tâches terminées ne signifie pas 50 % de produit livré ?** Le dénominateur est dix tâches du cas, de tailles différentes. Les 77 h consommées mesurent un effort, pas une valeur acquise. Linear donne aussi 12 Done sur 24 non annulés : ce second 50 % concerne un autre dénominateur et reste non pondéré. Les critères de recette déterminent la validation fonctionnelle.
7. **Pourquoi reporter la demande nouvelle ?** Elle ajoute 540 EUR et conduit à 5 005 EUR, soit 308 EUR au-dessus du plafond. La charge DEV atteindrait 76 h pour 72 disponibles. Le report préserve les critères du lot et doit être validé par le commanditaire du scénario.
8. **Quelle preuve existe pour votre arbitrage réel ?** Le commit 689e59d du 20 juillet décrit le passage de la recette CI au standalone. Les résultats des runs sont rapportés par le dossier historique ; la comparaison des options est une analyse rétrospective. Ne pas la présenter comme un compte rendu rédigé à l'époque.
9. **Comment traitez-vous un conflit DEV/QA ?** Faire expliciter les impacts, identifier les critères non négociables, comparer charge et échéance, décider puis rendre la décision accessible. A05 décrit une situation fictive et critique les limites d'une réponse seulement directive.
10. **Comment équilibrez-vous la charge ?** Comparer charge et capacité par rôle, pas seulement leur somme. CP est à 29/30 h, DEV à 64/72 h et QA à 24/30 h. Un transfert suppose la compétence nécessaire et doit préserver l'indépendance de la recette.
11. **Que change une situation de handicap ou une équipe internationale ?** Convenir des besoins avec la personne : supports structurés, sous-titres, clavier, pauses et modalités adaptées. Prévoir horaires avec fuseau, préparation asynchrone et reformulation des décisions. Ne pas inventer de diagnostic ou de situation réelle.
12. **Comment prouvez-vous l'efficacité d'une formation ?** Définir un niveau attendu, un exercice observable et un contrôle après pratique. Exemples : inscriptions concurrentes, scénario navigateur reproductible et mise à jour autonome du tableau de bord. Les ateliers du cas ne sont pas déclarés réellement suivis.
13. **Quel client a validé et est-il satisfait ?** Aucun résultat réel n'est disponible dans les éléments fournis. Les trois comptes rendus sont simulés, avec Claire Martin pour le Collectif Altitude Grimpe, commanditaire fictif du Bloc 1. Les objectifs de NPS du cadrage ne sont pas des résultats. Le dispositif proposé mesure critères acceptés, réussite sans aide, utilité et blocages, avec date et nombre de répondants. Présenter les retours réels seulement lorsqu'ils existent.
14. **Que prouvent vos vérifications ?** Le 14 septembre, lint, typage, build, 389 tests unitaires et six scénarios navigateur ont réussi. La recette locale utilise next dev et une MariaDB dédiée. Elle ne prouve ni une validation client, ni une recette actuelle du déploiement distant, ni une couverture de 100 %. Les 126 tests du Bloc 2 en juillet et les 152 tests Jest du Bloc 4 en août décrivent d’autres périmètres datés ; ne pas les additionner.
15. **Que faites-vous si la démonstration échoue ?** Annoncer l'incident, utiliser les captures du 14 septembre et la dernière recette identifiée, puis préciser les critères non revalidés en direct. Revenir au besoin client et proposer une nouvelle vérification après correction.

## Exercices de répétition

- Faire une présentation chronométrée, puis réduire les digressions qui dépassent les repères.
- Dans une copie du classeur, ajouter cinq heures restantes à T06 : la prévision doit atteindre 122 h et 4 640 EUR. Expliquer l'effet puis restaurer l'entrée.
- Retrouver en moins de trente secondes l'annexe qui répond à chacune des sept compétences.
- Rejouer la démonstration avec une session grimpeur et une session club ; utiliser A08 pour les six minutes détaillées.
- Faire une simulation de quinze minutes de questions sans inventer de faits pour combler une information manquante.

## Pièces à garder ouvertes

Le diaporama et ses notes, le classeur, le dossier PDF, A08, les captures et COHERENCE_INTER_BLOCS.md. Les confirmations de date, d'équipe et de dépôt sont suivies dans CHECKLIST_REMISE.md.
''')
(DOCS / 'GUIDE_ORAL.md').write_text('\n'.join(parts).strip() + '\n', encoding='utf-8', newline='\n')
print('Guide généré : 30 minutes, 25 notes et 15 questions.')
