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
| build_deck_visual.mjs | Version courante : 30 minutes, notes natives, 7 graphiques et leurs classeurs intégrés, tableaux modifiables, illustration et captures. Contrôles de structure et de géométrie, import et rendus. |
| build_deck_30min.mjs | Générateur de la version précédente, conservée en archive. |
| build_guide.py | Notes et timing à partir de donnees/support-oral.json. |
| build_pdf.py | Dossier et annexes en PDF avec ReportLab et Arial. |
| validate.py | Cohérence des données et des fichiers livrés ; option --package pour créer le manifeste et le ZIP. |

Les générateurs XLSX/PPTX utilisent le module @oai/artifact-tool du runtime documentaire Codex, résolu depuis tmp/bloc3/build/node_modules. Il ne s'agit pas d'une dépendance de l'application. Le PPTX utilise aussi les validateurs du skill Presentations ; les chemins locaux peuvent être remplacés par BLOC3_PRESENTATION_SKILL et BLOC3_PYTHON. Le PDF utilise Python, ReportLab et les polices Arial de Windows. La validation utilise pypdf et la bibliothèque standard Python.

Ordre de préparation : prepare.py, classeur, write_30min_content.py, build_deck_visual.mjs, build_guide.py, relecture des textes, build_pdf.py, rendu et inspection de chaque page/slide/feuille, puis validate.py --package. Le finaliseur de présentation attend une nouvelle destination et un nouveau reçu pour chaque révision : modifier finalPath et tmp avant une nouvelle finalisation, puis synchroniser le chemin dans validate.py et les index. Les assertions chiffrées du classeur et de validate.py correspondent au scénario livré et doivent être réexaminées si ce scénario change. Les anciens build_deck.mjs et build_deck_30min.mjs correspondent aux versions archivées et ne doivent pas remplacer le support courant.

Les textes explicatifs contiennent aussi des montants et des hypothèses : une modification de pilotage.json demande leur mise à jour cohérente. Les fichiers de preuves datées ne sont jamais une conséquence automatique de la génération des documents ; ne les actualiser qu'après exécution des contrôles concernés.

La revue COHERENCE_INTER_BLOCS.md précise les sources de la reprise : commanditaire B1, budget global distinct du lot pédagogique, prototype B2 et transmission vers la maintenance B4. La v12 reprend le diaporama B1 : neuf lots, 82 j-h et 44 250 EUR. Les données et l'empreinte de cette source figurent dans reference-bloc-01.json. Les fiches B1 à 79 j-h / 38 126 EUR HT restent une autre version, sans modification des sources du Bloc 1.

```powershell
python tools/bloc3/build_guide.py
python tools/bloc3/build_pdf.py
python tools/bloc3/validate.py --package
```

Le ZIP est un kit documentaire hors connexion. La démonstration exige le dépôt applicatif complet et ses dépendances ; l'archive n'embarque ni base de données, ni node_modules, ni secrets locaux. Le contrôle distingue l'arbre applicatif enregistré et les modifications locales (fichiers suivis ou nouveaux non ignorés). S'ils diffèrent de la preuve datée, VERIFICATION.md doit en expliciter la limite et applicationMatchesDatedEvidence vaut false. La réussite du contrôle documentaire ne vaut pas une nouvelle recette de l'application. Le cadre d'évaluation sourcé et les trois compétences éliminatoires sont conservés dans donnees/cadre-evaluation.json.

## Données et relevé Linear du 14 septembre

enrich_pilotage.py conserve la transcription de la session Linear du 14 septembre et la construction initiale des 30 activités. Il ne se connecte pas à Linear et ne constitue pas une actualisation automatique. Une nouvelle observation doit produire une nouvelle source datée. linear_context.py injecte ce relevé et les explications des écarts dans le support. Le classeur comporte cinq feuilles ; Estimations alimente Planning puis Pilotage, et Linear conserve les statuts observés séparément. Les entrées de sensibilité se modifient dans Pilotage.

La v14 comprend 26 diapositives, dont 23 présentées en trente minutes et trois annexes. Elle conserve le contenu de la v13 et affiche uniquement les numéros dans les pieds de page. Les modules de contenu antérieurs gardent les identifiants de mise en page 1 à 25. presentation_revision.py ajoute le sommaire et attribue les numéros physiques ; le générateur visuel et les validateurs utilisent ces numéros physiques pour les références du PPTX.
