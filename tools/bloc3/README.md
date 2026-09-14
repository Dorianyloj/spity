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
| write_30min_content.py | Contenu des 22 slides principales et des trois annexes, texte oral et transitions. |
| build_deck_30min.mjs | Diaporama de 30 minutes et notes natives, contrôles de structure et géométrie, import et rendus. |
| build_guide.py | Notes et timing à partir de donnees/support-oral.json. |
| build_pdf.py | Dossier et annexes en PDF avec ReportLab et Arial. |
| validate.py | Cohérence des données et des fichiers livrés ; option --package pour créer le manifeste et le ZIP. |

Les générateurs XLSX/PPTX utilisent le module @oai/artifact-tool du runtime documentaire Codex, résolu depuis tmp/bloc3/build/node_modules. Il ne s'agit pas d'une dépendance de l'application. Le PPTX utilise aussi les validateurs du skill Presentations ; les chemins locaux peuvent être remplacés par BLOC3_PRESENTATION_SKILL et BLOC3_PYTHON. Le PDF utilise Python, ReportLab et les polices Arial de Windows. La validation utilise pypdf et la bibliothèque standard Python.

Ordre de préparation : prepare.py, classeur, write_30min_content.py, build_deck_30min.mjs, build_guide.py, relecture des textes, build_pdf.py, rendu et inspection de chaque page/slide/feuille, puis validate.py --package. Le finaliseur de présentation attend une nouvelle destination pour chaque révision : modifier finalPath avant une nouvelle finalisation. Les assertions chiffrées du classeur et de validate.py correspondent au scénario livré et doivent être réexaminées si ce scénario change. L'ancien build_deck.mjs correspond à la première version archivée et ne doit pas remplacer le nouveau plan oral.

Les textes explicatifs contiennent aussi des montants et des hypothèses : une modification de pilotage.json demande leur mise à jour cohérente. Les fichiers de preuves datées ne sont jamais une conséquence automatique de la génération des documents ; ne les actualiser qu'après exécution des contrôles concernés.

```powershell
python tools/bloc3/build_guide.py
python tools/bloc3/build_pdf.py
python tools/bloc3/validate.py --package
```

Le ZIP est un kit documentaire hors connexion. La démonstration exige le dépôt applicatif complet et ses dépendances ; l'archive n'embarque ni base de données, ni node_modules, ni secrets locaux.
