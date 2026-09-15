# Exports de remise

Ce répertoire contient uniquement les livrables générés destinés à la consultation. Les sources de vérité ne sont pas modifiées ici : elles restent versionnées dans `docs/` et `spity/`.

| Fichier | Source | Usage |
| --- | --- | --- |
| [`pdf/dossier-bloc-04-spity.pdf`](pdf/dossier-bloc-04-spity.pdf) | `docs/rncp/bloc-04/DOSSIER_BLOC_04.md` | Dossier Bloc 4 prêt à consulter ou imprimer. |
| [`pdf/dossier-bloc-03-spity.pdf`](pdf/dossier-bloc-03-spity.pdf) | `docs/rncp/bloc-03/` | Dossier Bloc 3 et neuf annexes. |
| [PowerPoint Bloc 3 visuel](presentations/spity-bloc-3-30-minutes-visuel-v8.pptx) | `tools/bloc3/build_deck_visual.mjs` | 22 slides, 8 graphiques modifiables, captures agrandies, texte oral et démo de 6 minutes, puis 3 annexes. |
| [`bloc-03/kit-soutenance-spity.zip`](bloc-03/kit-soutenance-spity.zip) | Kit Bloc 3 vérifié | Dossier, slides, classeur, guide et checklist. |

Le classeur associé est dans [outputs/bloc03-01a09eba/pilotage-spity.xlsx](../outputs/bloc03-01a09eba/pilotage-spity.xlsx). La procédure Bloc 3 est décrite dans [tools/bloc3/README.md](../tools/bloc3/README.md).

## Régénération contrôlée

Depuis `spity/` :

```bash
npm run bloc4:pdf
npm run bloc4:manifest
npm run bloc4:check
```

Après toute modification du dossier source, le PDF et le manifeste doivent être régénérés puis contrôlés. Les fichiers temporaires de rendu restent ignorés par Git dans `tmp/`.
