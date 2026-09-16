# Exports de remise

Ce répertoire contient uniquement les livrables générés destinés à la consultation. Les sources de vérité ne sont pas modifiées ici : elles restent versionnées dans `docs/` et `spity/`.

| Fichier | Source | Usage |
| --- | --- | --- |
| [Dossier Bloc 2 PDF](bloc-02/DOSSIER_BC02_SPITY.pdf) et [HTML](bloc-02/DOSSIER_BC02_SPITY.html) | `docs/rncp/bloc-02/` | Dossier et annexes du Bloc 2. |
| [`bloc-04/dossier-bloc-04-spity.pdf`](bloc-04/dossier-bloc-04-spity.pdf) | `docs/rncp/bloc-04/DOSSIER_BLOC_04.md` | Dossier Bloc 4 prêt à consulter ou imprimer. |
| [`bloc-03/dossier-bloc-03-spity.pdf`](bloc-03/dossier-bloc-03-spity.pdf) | `docs/rncp/bloc-03/` | Dossier Bloc 3 et neuf annexes. |
| [PowerPoint Bloc 3 visuel](bloc-03/spity-bloc-3-soutenance-v21.pptx) | `tools/bloc3/build_deck_presentable.py` | 23 slides principales, trois annexes, deux graphiques modifiables et un bilan des fonctionnalités. Notes à la première personne ; chronométrage et consignes réservés au guide personnel. |
| [PDF du diaporama Bloc 3](bloc-03/spity-bloc-3-soutenance-v21.pdf) | PowerPoint v21 | Version à consulter ou projeter sans PowerPoint. |
| [`bloc-03/kit-soutenance-spity.zip`](bloc-03/kit-soutenance-spity.zip) | Kit Bloc 3 vérifié | Dossier, slides, classeur, guide et checklist. |

Le classeur associé est dans [output/bloc-03/pilotage-spity.xlsx](bloc-03/pilotage-spity.xlsx). La procédure Bloc 3 est décrite dans [tools/bloc3/README.md](../tools/bloc3/README.md).

La présentation courante est la **v21**. Les versions précédentes sont conservées dans [`bloc-03/archives/`](bloc-03/archives/) ; elles ne sont pas les fichiers à utiliser pour la soutenance. Tous les nouveaux exports vont dans le dossier du bloc concerné.

Le [contrôle de complétude du Bloc 3](../docs/rncp/bloc-03/CONTROLE_COMPLETUDE.md) vérifie chaque critère, identifie les trois compétences éliminatoires et distingue la couverture documentaire des vérifications encore nécessaires avant remise.

## Régénération contrôlée

Depuis `spity/` :

```bash
npm run bloc4:pdf
npm run bloc4:manifest
npm run bloc4:check
```

Après toute modification du dossier source, le PDF et le manifeste doivent être régénérés puis contrôlés. Les fichiers temporaires de rendu restent ignorés par Git dans `tmp/`.
