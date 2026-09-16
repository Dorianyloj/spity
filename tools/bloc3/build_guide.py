"""Generate the rehearsal guide and explanations from the current slide source."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DOCS=ROOT/'docs/rncp/bloc-03'
slides=json.loads((DOCS/'donnees/support-oral.json').read_text())
assert sum(s['minutes'] for s in slides)==30

def clock(value):
    seconds=round(value*60)
    return f'{seconds//60:02}:{seconds%60:02}'

parts=['''# Guide oral — Spity, projet solo sur un an

Support : **v17**, 23 slides principales et trois annexes. La cible de 30 minutes inclut six minutes de démonstration. Les notes sont un canevas : les pauses, explications des graphiques et manipulations doivent être réglées par une répétition chronométrée. Ce fichier ne garantit pas la durée d’une lecture mot à mot.

## Fil conducteur

Présenter le projet développé seul par Dorian Joly, sa chronologie vérifiable, le suivi, une correction réelle et la livraison. Le planning annuel, les chiffres de suivi, la collaboration ponctuelle, la formation et les retours sont **simulés pour l’exercice** et séparés des traces réelles. Ils illustrent les critères du référentiel ; ils ne sont pas des événements vécus ni la cause historique des corrections.

La durée d’un an et le travail en solo sont confirmés par le candidat. Les dates exactes de l’année restent à préciser. Le budget B1 est une estimation. Les dates Git, le relevé Linear et les mesures techniques conservent chacun leur portée.

## Repères

| Slide | Sujet | Durée cible | Fin |
| --- | --- | --- | --- |''']
for s in slides:
    if s['minutes']:
        parts.append(f"| {s['number']} | {s['title']} | {clock(s['minutes'])} | {clock(s['endMinute'])} |")
parts.append('\nÀ 06:00 : suivi ; à 09:30 : arbitrage ; à 12:00 : management ; à 15:00 : compétences ; à 18:00 : client ; à 23:00 : démonstration ; à 29:00 : validation.\n\n## Notes par diapositive\n')
explanations=['# Comprendre le diaporama v17\n\nProjet **solo**, développé sur **un an**. Les compléments pédagogiques de planning, suivi, collaboration, formation et retours sont explicitement simulés. Les coûts B1 restent prévisionnels.\n']
for s in slides:
    timing=f"{clock(s['startMinute'])}–{clock(s['endMinute'])}" if s['minutes'] else 'Annexe hors timing'
    parts.append(f"### {s['number']}. {s['title']}\n\n**Repère : {timing}** — {s['nature']}.\n\n{s['script']}\n\n**À montrer :** {s['action'] or 'Expliquer les éléments affichés et leur source.'}\n\n**Source :** {s['source']}\n")
    explanations.append(f"## {s['number']}. {s['title']}\n\n{s['subtitle']}\n\n{s['script']}\n\nNature : {s['nature']}.\n")
parts.append('''## Réponses à préparer

- **Pourquoi un an et 82 j-h ?** Un an est une durée déclarée ; 82 j-h est la charge estimée du cadrage. Aucun relevé de temps ne permet de comparer le consommé.
- **Avec quelle équipe ?** Projet solo confirmé. Présenter les responsabilités assumées et les aides effectivement reçues ; ne pas inventer de collaborateurs.
- **Quel client a validé ?** Aucune réception réelle jointe. Les trois retours sont pédagogiques et simulés.
- **Pourquoi 12/24 ?** Relevé Linear du 14 septembre, hors ticket annulé, non pondéré ; ce n’est pas la moitié du produit validé.
- **Pourquoi la correction de navigation ?** Calcul décoratif bloquant reproduit localement, puis SVG statique et indicateur d’attente ; voir l’audit daté.
- **Les temps sont-ils ceux de la production ?** Non. Protocole local contrôlé, un passage par parcours. La sonde distante prouve seulement la santé et la révision servie à cet instant.
- **Le Bloc 3 est-il entièrement démontré ?** Les sept compétences et leurs critères disposent de contenus. Certains sont traités par une mise en situation annoncée. Cela ne vaut ni expérience vécue ni acquisition décidée par le jury.
- **Que faire si la démo échoue ?** Dire quel critère n’a pas pu être revérifié, utiliser une capture datée puis décrire la suite nécessaire.

## Répétition

Préparer A08, les deux sessions locales et les événements futurs. Expliquer oralement un chiffre de chaque graphique, son unité et sa limite. Rejouer les six minutes de démonstration. Vérifier les règles de dépôt du campus et les pièces nécessaires dans CHECKLIST_REMISE.md. Aucun dépôt externe ni validation du jury n’est déclaré par ce guide.
''')
(DOCS/'GUIDE_ORAL.md').write_text('\n'.join(parts).rstrip()+'\n')
(DOCS/'COMPRENDRE_LES_DIAPOS.md').write_text('\n'.join(explanations).rstrip()+'\n')
print('Guide et explications générés depuis les 26 notes v17.')
