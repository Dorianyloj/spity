# Exports de remise

Ce répertoire contient uniquement les livrables générés destinés à la consultation. Les sources de vérité ne sont pas modifiées ici : elles restent versionnées dans `docs/` et `spity/`.

| Fichier | Source | Usage |
| --- | --- | --- |
| [`pdf/dossier-bloc-04-spity.pdf`](pdf/dossier-bloc-04-spity.pdf) | `docs/rncp/bloc-04/DOSSIER_BLOC_04.md` | Dossier Bloc 4 prêt à consulter ou imprimer. |
| [`pdf/dossier-bloc-03-spity.pdf`](pdf/dossier-bloc-03-spity.pdf) | `docs/rncp/bloc-03/` | Dossier Bloc 3 et neuf annexes. |
| [PowerPoint Bloc 3 visuel](presentations/spity-bloc-3-30-minutes-visuel-v16.pptx) | `tools/bloc3/build_deck_presentable.py` | 23 slides principales, sommaire compris, 7 graphiques modifiables, grille de compétences, suivi client, captures datées et démo de 6 minutes, puis 3 annexes. |
| [PDF du diaporama Bloc 3](pdf/spity-bloc-3-30-minutes-visuel-v16.pdf) | PowerPoint v16 | Version à consulter ou projeter sans PowerPoint. |
| [`bloc-03/kit-soutenance-spity.zip`](bloc-03/kit-soutenance-spity.zip) | Kit Bloc 3 vérifié | Dossier, slides, classeur, guide et checklist. |

Le classeur associé est dans [outputs/bloc03-01a09eba/pilotage-spity.xlsx](../outputs/bloc03-01a09eba/pilotage-spity.xlsx). La procédure Bloc 3 est décrite dans [tools/bloc3/README.md](../tools/bloc3/README.md).

Le [contrôle de complétude du Bloc 3](../docs/rncp/bloc-03/CONTROLE_COMPLETUDE.md) vérifie chaque critère, identifie les trois compétences éliminatoires et distingue la couverture documentaire des vérifications encore nécessaires avant remise.

## Régénération contrôlée

Depuis `spity/` :

```bash
npm run bloc4:pdf
npm run bloc4:manifest
npm run bloc4:check
```

Après toute modification du dossier source, le PDF et le manifeste doivent être régénérés puis contrôlés. Les fichiers temporaires de rendu restent ignorés par Git dans `tmp/`.
