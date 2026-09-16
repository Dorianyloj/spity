# Générer le kit Bloc 3 courant

La v21 présente le logiciel réel et un scénario de pilotage en équipe sur un an puis les sept compétences dans l’ordre des PDF du candidat. Les compléments pédagogiques sont explicitement simulés. Les livrables prêts à consulter sont dans [l’index du kit](../../docs/rncp/bloc-03/README.md).

## Sources

- `docs/rncp/bloc-03/donnees/support-oral.json` : contenu, timing et notes des 26 slides.
- `projet-reel.json`, `linear-2026-09-14.json`, `reference-bloc-01.json` : faits déclarés, observations et estimation B1, séparés.
- `mise-en-situation.json` : planning annuel, suivi chiffré, séance de recette, compétences et comptes rendus simulés.
- `sources-evaluation.json` et `couverture-criteres.json` : deux PDF fournis et correspondance de 40 points de lecture avec les sept compétences. Aucun critère ajouté ne devient une obligation extérieure au référentiel.
- Les Markdown du dossier et des annexes sont des sources éditables. Toute modification de scénario doit rester cohérente dans les textes, slides, formules et assertions.

## Génération

Python, LibreOffice, Arial (dossier), Poppins et Archivo Black (diaporama) sont nécessaires. Les deux dernières polices et leurs licences sont fournies dans `docs/rncp/bloc-03/assets/fonts/`. Les installer avant de générer ou d’éditer le PowerPoint. Les scripts n’utilisent plus le runtime documentaire des anciennes versions.

```bash
python3 -m venv tmp/bloc3/presentation-venv
tmp/bloc3/presentation-venv/bin/pip install -r tools/bloc3/requirements-presentation.txt
tmp/bloc3/presentation-venv/bin/python tools/bloc3/build_guide.py
tmp/bloc3/presentation-venv/bin/python tools/bloc3/build_deck_presentable.py
tmp/bloc3/presentation-venv/bin/python tools/bloc3/build_workbook.py
BLOC3_FONT_DIR=/usr/share/fonts/truetype/msttcorefonts tmp/bloc3/presentation-venv/bin/python tools/bloc3/build_pdf.py
libreoffice -env:UserInstallation=file:///tmp/spity-bloc3-render --headless --convert-to pdf --outdir output/bloc-03 output/bloc-03/spity-bloc-3-soutenance-v21.pptx
libreoffice -env:UserInstallation=file:///tmp/spity-bloc3-calc --headless --convert-to xlsx --outdir output/bloc-03 tmp/bloc3/workbook-source/pilotage-spity.xlsx
```

Le classeur est d’abord créé sous `tmp`, puis LibreOffice calcule les formules et exporte les valeurs en cache dans le livrable. La validation contrôle aussi ces caches. Sous Windows, utiliser les exécutables `Scripts` du venv et les polices Arial locales ; adapter le profil LibreOffice.

## Projection et notes

La v21 réserve les repères horaires et les consignes au guide personnel. Le champ `script` de chaque slide est le texte à dire ; `notes` lui est identique et alimente les notes natives. Les titres, sous-titres et contenus alimentent la projection. Les simulations restent signalées. Le contrôle du PDF refuse les mentions de minutes, les chronométrages et les consignes internes ; il vérifie aussi la première personne et l’égalité exacte des notes.

## Revue et paquet

Rendre puis inspecter les 26 slides et toutes les pages du dossier. Vérifier chiffres, textes, notes, nature des simulations, tableaux et coupures. Enregistrer ensuite les empreintes et la portée réelle de la revue dans `preuves/controle-visuel.json`. Le générateur ne déclare jamais automatiquement une revue visuelle.

```bash
tmp/bloc3/presentation-venv/bin/python tools/bloc3/validate.py --package
```

La validation vérifie les sources, la correspondance des critères, les données des deux graphiques natifs et le bilan fonctionnel, les notes, les formules, les liens, les rendus et le contenu du ZIP. Elle ne rejoue pas les tests applicatifs et ne décide pas de l’acquisition des compétences.

Les anciens outils et le cas complet se trouvent dans [le kit v16 archivé](../../output/bloc-03/archives/kit-scenario-15-jours-v16.zip). Ils ne régénèrent plus les sources courantes.

## Démonstration locale

Voir [A08](../../docs/rncp/bloc-03/annexes/A08_DEMONSTRATION.md). Les scripts PowerShell existants préparent uniquement une base locale dédiée, avec Node.js 22, Docker et les dépendances de l’application installées.

```powershell
powershell -File tools/bloc3/demo.ps1 -Prepare
powershell -File tools/bloc3/demo.ps1 -Verify
powershell -File tools/bloc3/demo.ps1
```

La préparation réinitialise les seules données de démonstration. Les secrets locaux restent dans `tmp`, ignoré par Git. Le ZIP documentaire ne contient pas l’application complète ni une base de données.

## Style de la v21

Le diaporama reprend les codes du PDF Bloc 1 fourni par Dorian : crème, vert foncé et olive, capitales épaisses, photographies d’escalade, tableaux et bandeaux de synthèse. La provenance des images et polices est dans [les sources visuelles](../../docs/rncp/bloc-03/assets/README.md). Le bilan fonctionnel est conservé ; les notes de la v21 intègrent les responsabilités de l’équipe fictive.

## Équipe du scénario v21

`mise-en-situation.json` contient les cinq membres, la cliente, les affectations par lot, la RACI et les disponibilités. Les charges des lots totalisent 82 j-h, partagés entre les membres. La prévision 86 j-h et la capacité 12/10 sont rapprochées des cinq lignes individuelles. Les feuilles Equipe SIMULEE, Planning SIMULE et RACI SIMULE du classeur conservent ce détail. La composition historique solo reste dans `projet-reel.json`.
