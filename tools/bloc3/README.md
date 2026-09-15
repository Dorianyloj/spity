# Outils de préparation du Bloc 3

Depuis la racine du dépôt. Les livrables finis sont accessibles dans [l'index du kit](../../docs/rncp/bloc-03/README.md) ; leur consultation ne demande aucune installation.

## Démonstration

Prérequis : dépendances applicatives installées dans spity/, Docker Desktop démarré, Node.js (22 recommandé par le projet) et navigateur Chromium Playwright installé. Sur une nouvelle machine, suivre d'abord spity/README.md pour les dépendances.

```powershell
powershell -File tools/bloc3/demo.ps1 -Prepare
powershell -File tools/bloc3/demo.ps1
```

Ouvrir http://127.0.0.1:3313. Le script utilise exclusivement la base spity_bloc3_demo sur le port 33313. Le premier appel crée les données de démonstration ; les appels sans option les conservent. Les secrets locaux aléatoires sont stockés sous tmp/bloc3/, ignoré par Git. Les comptes et le déroulé figurent dans A08.

Pour rejouer la recette, arrêter d'abord le serveur avec Ctrl+C, puis lancer `powershell -File tools/bloc3/demo.ps1 -Verify`. Pour réaliser de nouvelles captures, lancer le serveur, puis `node tools/bloc3/capture.mjs` ; vérifier la date et le contenu avant de remplacer les preuves datées.

## Sources et génération

Le dossier se modifie dans docs/rncp/bloc-03/. Les valeurs du cas sont centralisées dans donnees/pilotage.json. Les données du cas sont fictives et ne doivent pas être renommées en faits historiques lors d'une personnalisation.

| Outil | Fonction |
| --- | --- |
| prepare.py | Recalcul des indicateurs, génération d'A01/A03 et de la matrice ; extrait Git. Ne rejoue pas les tests. |
| build_workbook.mjs | Classeur natif avec formules, contrôles de recalcul et rendus. |
| write_30min_content.py | Contenu des 23 slides principales et des trois annexes, texte oral et transitions. |
| bloc_context.py | Contexte issu des Blocs 1, 2 et 4, appliqué par write_30min_content.py aux notes, sources et titres du support courant. |
| inclusion_context.py | Cas fictif de Camille lu dans inclusion.json, appliqué aux diapositives 6, 14 et 16 : missions, aménagements et formation. |
| competence_context.py | Corrections de couverture appliquées aux notes et titres : planning global, compétences, formation, management, suivi client et validation. |
| scrum_context.py | Rituels inspirés de Scrum, notes des slides 4/5/13/17 et distinction review/rétrospective. |
| competence_annexes.py | Compléments générés dans A01/A03 et la matrice, lus dans consolidation.json. |
| presentation_revision.py | Sommaire, notes ajustées et numérotation courante ; contentNumber conserve les identifiants des mises en page. |
| build_deck_presentable.py | Version courante v16 : python-pptx, 26 slides, notes natives, 7 graphiques et PDF exporté avec LibreOffice. |
| build_deck_visual.mjs | Archive v14 : 30 minutes, notes natives, 7 graphiques et leurs classeurs intégrés, tableaux modifiables, illustration et captures. Contrôles de structure et de géométrie, import et rendus. |
| build_deck_30min.mjs | Générateur de la version précédente, conservée en archive. |
| build_guide.py | Notes et timing à partir de donnees/support-oral.json. |
| build_pdf.py | Dossier et annexes en PDF avec ReportLab et Arial. |
| validate.py | Cohérence des données et des fichiers livrés ; option --package pour créer le manifeste et le ZIP. |

Les générateurs XLSX/PPTX utilisent le module @oai/artifact-tool du runtime documentaire Codex, résolu depuis tmp/bloc3/build/node_modules. Il ne s'agit pas d'une dépendance de l'application. Le PPTX utilise aussi les validateurs du skill Presentations ; les chemins locaux peuvent être remplacés par BLOC3_PRESENTATION_SKILL et BLOC3_PYTHON. Le PDF utilise Python, ReportLab et les polices Arial de Windows. La validation utilise pypdf et la bibliothèque standard Python.

Pour la v16, suivre la procédure ci-dessous à partir des données relues de `support-oral.json`. Les générateurs antérieurs `build_deck_visual.mjs`, `build_deck_30min.mjs` et `build_deck.mjs` restent des archives. Ils ne doivent pas remplacer le support courant. Le classeur, le dossier PDF et les preuves datées conservent leurs propres procédures. Une évolution du scénario demande une vérification des valeurs affichées dans le générateur, des notes, du classeur et des assertions de `validate.py`.

Les textes explicatifs contiennent aussi des montants et des hypothèses : une modification de pilotage.json demande leur mise à jour cohérente. Les fichiers de preuves datées ne sont jamais une conséquence automatique de la génération des documents ; ne les actualiser qu'après exécution des contrôles concernés.

La revue COHERENCE_INTER_BLOCS.md précise les sources de la reprise : commanditaire B1, budget global distinct du lot pédagogique, prototype B2 et transmission vers la maintenance B4. La v12 reprend le diaporama B1 : neuf lots, 82 j-h et 44 250 EUR. Les données et l'empreinte de cette source figurent dans reference-bloc-01.json. Les fiches B1 à 79 j-h / 38 126 EUR HT restent une autre version, sans modification des sources du Bloc 1.

```powershell
python tools/bloc3/build_guide.py
python tools/bloc3/build_pdf.py
python tools/bloc3/validate.py --package
```

Sous Linux, `build_pdf.py` accepte `BLOC3_FONT_DIR` pour désigner le dossier contenant `arial.ttf`, `arialbd.ttf` et `ariali.ttf`. Exemple : `BLOC3_FONT_DIR=/usr/share/fonts/truetype/msttcorefonts python3 tools/bloc3/build_pdf.py`.

Le ZIP est un kit documentaire hors connexion. La démonstration exige le dépôt applicatif complet et ses dépendances ; l'archive n'embarque ni base de données, ni node_modules, ni secrets locaux. Le contrôle distingue l'arbre applicatif enregistré et les modifications locales (fichiers suivis ou nouveaux non ignorés). S'ils diffèrent de la preuve datée, VERIFICATION.md doit en expliciter la limite et applicationMatchesDatedEvidence vaut false. La réussite du contrôle documentaire ne vaut pas une nouvelle recette de l'application. Le cadre d'évaluation sourcé et les trois compétences éliminatoires sont conservés dans donnees/cadre-evaluation.json.

## Données et relevé Linear du 14 septembre

enrich_pilotage.py conserve la transcription de la session Linear du 14 septembre et la construction initiale des 30 activités. Il ne se connecte pas à Linear et ne constitue pas une actualisation automatique. Une nouvelle observation doit produire une nouvelle source datée. linear_context.py injecte ce relevé et les explications des écarts dans le support. Le classeur comporte cinq feuilles ; Estimations alimente Planning puis Pilotage, et Linear conserve les statuts observés séparément. Les entrées de sensibilité se modifient dans Pilotage.

## Générer et vérifier la présentation v16

La v16 contient 23 diapositives présentées en trente minutes et trois annexes. Elle reprend la mise en page de la v15 et clarifie les notes 3, 4 et 6 grâce à timeline_context.py : un an réel, 82 j-h estimés, quinze jours fictifs. Les titres visibles sont reformulés ; les numéros du guide restent les repères de correspondance. Le générateur est indépendant du runtime documentaire Windows des anciennes versions.

```bash
python3 -m venv tmp/bloc3/presentation-venv
tmp/bloc3/presentation-venv/bin/pip install -r tools/bloc3/requirements-presentation.txt
tmp/bloc3/presentation-venv/bin/python tools/bloc3/build_deck_presentable.py
libreoffice --headless --convert-to pdf --outdir output/bloc-03 output/bloc-03/spity-bloc-3-30-minutes-visuel-v16.pptx
```

Sous Windows, utiliser les exécutables du dossier `Scripts` de l’environnement Python. Arial doit être disponible pour un rendu cohérent. Le PowerPoint contient des objets modifiables et les notes ; le PDF est destiné à la consultation et à la projection.

Après génération : rendre et inspecter les 26 diapositives, contrôler les graphiques et les notes, puis actualiser les empreintes et la portée de `preuves/controle-visuel.json` uniquement après ces contrôles. Enfin lancer `python tools/bloc3/validate.py --package` avec cet environnement Python pour vérifier et réunir le PPTX, le PDF, le dossier, le classeur et les guides. Une validation documentaire ne vaut pas recette de l’application ni répétition orale.
