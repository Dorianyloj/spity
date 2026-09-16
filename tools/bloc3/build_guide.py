"""Generate private rehearsal material and the exact first-person speaker text."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DOCS=ROOT/'docs/rncp/bloc-03'
slides=json.loads((DOCS/'donnees/support-oral.json').read_text())
assert sum(s['minutes'] for s in slides)==30

def clock(value):
    seconds=round(value*60)
    return f'{seconds//60:02}:{seconds%60:02}'

parts=['''# Mon guide oral — Spity

**Document personnel de répétition — à garder hors projection.** Support associé : v21.

Les rubriques **Texte à dire** sont identiques aux notes PowerPoint et rédigées à la première personne. Les repères, manipulations et sources ci-dessous servent uniquement à la préparation. Les diapositives projetées et leurs notes natives ne contiennent aucun chronométrage de présentation.

## Mes repères de répétition

Je vise trente minutes, dont six de démonstration. Les 23 diapositives principales portent le fil de l’oral ; les trois dernières sont des annexes pour les questions. J’ajuste mon débit et mes pauses en répétant avec le logiciel : lire le texte seul ne garantit pas la durée du passage.

| Slide | Sujet | Durée cible | Fin |
| --- | --- | --- | --- |''']
for s in slides:
    if s['minutes']:
        parts.append(f"| {s['number']} | {s['title']} | {clock(s['minutes'])} | {clock(s['endMinute'])} |")
parts.append('\nRepères privés : 06:00 suivi ; 09:30 arbitrage ; 12:00 management ; 15:00 compétences ; 18:00 client ; 23:00 démonstration ; 29:00 conclusion.\n\n## Mon texte par diapositive\n')
explanations=['# Mon fil conducteur — Spity v21\n\nDocument personnel. Le texte ci-dessous reprend ce que je peux dire à l’oral, avec les titres du support. Les repères de manipulation restent dans GUIDE_ORAL.md.\n']
for s in slides:
    timing=f"{clock(s['startMinute'])}–{clock(s['endMinute'])}" if s['minutes'] else 'Annexe pour les questions'
    parts.append(f"### {s['number']}. {s['title']}\n\n**Repère privé : {timing}.**\n\n**Texte à dire**\n\n{s['script']}\n\n**Préparation / manipulation — ne pas lire**\n\n{s['action'] or 'Je prends appui sur les éléments affichés et je marque une pause avant de poursuivre.'}\n\n**Source de préparation :** {s['source']}\n")
    explanations.append(f"## {s['number']}. {s['title']}\n\n{s['script']}\n")
parts.append('''## Mes réponses possibles aux questions

- **Pourquoi un an et 82 j-h ?** « J’ai développé Spity sur un an. Les 82 jours-personne correspondent à l’estimation de charge de mon cadrage. Je distingue cette charge de la durée calendaire. »
- **Avec quelle équipe ?** « J’ai réalisé le projet seul. Pour le scénario, je pilote Léa en UX/UI, Hugo au développement, Inès en QA et Sami en DevOps. Claire représente le client. Cette équipe couvre toute l’année et reste fictive. »
- **Quel client a validé ?** « Mes exemples de retours et de comptes rendus sont simulés. Je n’ai pas de réception réelle signée à présenter. »
- **Comment je mesure l’avancement ?** « Je rapproche mon backlog du code et des contrôles. Je distingue la connexion déjà livrée des améliorations de sessions encore à réaliser. Le relevé Linear du 14 septembre reste une archive ; ma slide présente le bilan des fonctionnalités du 16 septembre. »
- **Pourquoi supprimer l’animation ?** « Le calcul décoratif bloquait la navigation. Le fond statique conserve le motif et supprime cette initialisation ; les mesures locales montrent l’effet de la correction. »
- **Ces temps sont-ils ceux de la production ?** « Je les ai présentés comme une comparaison locale contrôlée. La sonde distante vérifie la santé et la version servie à un instant précis ; elle ne mesure pas ces parcours. »
- **Qu’ai-je simulé ?** « J’ai distingué le développement réel des hypothèses de planning, de consommé, de affectation d’équipe, de formation et de suivi client. Je peux expliquer les calculs et les décisions de chacun de ces exemples. »

## Mes variantes pendant la démonstration

Ces variantes restent dans ce guide personnel. Je choisis uniquement celle qui correspond à ce que j’observe, sans annoncer une réussite à l’avance.

- **Inscription réussie :** « La confirmation est affichée. Je peux maintenant vérifier la présence de ce compte dans les participants. »
- **Compte déjà inscrit :** « Ce compte est déjà inscrit : l’état affiché le confirme. Je vous montre maintenant comment le club le retrouve. »
- **Demande déjà existante :** « Une demande existe déjà. Son état reste visible, ce qui permet à l’utilisateur de savoir où il en est. »
- **Incident :** « Ce parcours ne répond pas comme prévu. Je vous montre l’interface datée pour expliquer le fonctionnement attendu, et je garde ce critère comme non revérifié en direct. »
- **Bilan sans réserve observée :** « Les critères que nous venons de parcourir ont été vérifiés. Je peux proposer la validation de ce périmètre. »
- **Bilan avec réserve :** « Je garde une réserve sur ce point. Je prévois une correction puis une nouvelle vérification avant de le considérer comme validé. »

## Ma préparation

Je prépare A08, deux sessions locales, des événements futurs et la version choisie. Je répète les manipulations au clavier et je vérifie les règles de dépôt du campus. Pour projeter, j’utilise le diaporama ou son PDF ; je garde ce guide et les contrôles documentaires sur mon écran de présentation.
''')
(DOCS/'GUIDE_ORAL.md').write_text('\n'.join(parts).rstrip()+'\n')
(DOCS/'COMPRENDRE_LES_DIAPOS.md').write_text('\n'.join(explanations).rstrip()+'\n')
print('Guide personnel et texte oral v21 générés : 26 notes à la première personne.')
