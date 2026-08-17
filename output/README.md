# Exports de remise

Ce répertoire contient uniquement les livrables générés destinés à la consultation. Les sources de vérité ne sont pas modifiées ici : elles restent versionnées dans `docs/` et `spity/`.

| Fichier | Source | Usage |
| --- | --- | --- |
| [`pdf/dossier-bloc-04-spity.pdf`](pdf/dossier-bloc-04-spity.pdf) | Dossier, preuves structurées et captures sous `docs/rncp/bloc-04/` | Dossier Bloc 4 autonome, prêt à consulter ou imprimer. |
| [`pdf/dossier-bloc-04-spity.pdf.sha256`](pdf/dossier-bloc-04-spity.pdf.sha256) | PDF généré | Empreinte détachée permettant de vérifier le livrable final. |

## Régénération contrôlée

Depuis `spity/` :

```bash
nvm use
python3 -m venv .venv-docs
. .venv-docs/bin/activate
python -m pip install -r requirements-docs.txt
npm run bloc4:workflow-scripts
npm run bloc4:manifest
npm run bloc4:final-audit
npm run bloc4:pdf
npm run bloc4:pdf:verify
npm run bloc4:check
```

Le manifeste protège les sources et les preuves stables. L'audit transversal est ensuite intégré au PDF, puis l'empreinte détachée protège le PDF final sans créer de dépendance circulaire. Les fichiers temporaires de rendu restent ignorés par Git dans `tmp/`.
