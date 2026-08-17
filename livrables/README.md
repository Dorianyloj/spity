# Livrables de remise

Ce répertoire contient uniquement les fichiers finaux à transmettre ou à ouvrir pendant la soutenance. Les sources restent dans `docs/` et le code de l'application dans `spity/`.

## Contenu

| Dossier | Usage |
| --- | --- |
| [`bloc-04/`](bloc-04/) | Remise autonome du Bloc 4 : PDF final, empreinte SHA-256 et mode d'emploi. |

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

Le manifeste protège les sources et les preuves stables. L'audit transversal est ensuite intégré au PDF, puis l'empreinte détachée protège le livrable final sans créer de dépendance circulaire. Les fichiers de travail et rapports temporaires ne doivent jamais être ajoutés dans `livrables/`.
