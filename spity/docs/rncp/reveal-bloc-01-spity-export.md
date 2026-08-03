# Export du diaporama Reveal.js Spity

## Ouvrir le diaporama

Fichier :

```text
spity/docs/rncp/reveal-bloc-01-spity.html
```

Tu peux l'ouvrir directement dans un navigateur. La présentation utilise Reveal.js depuis CDN :

```text
https://cdn.jsdelivr.net/npm/reveal.js@5.1.0
```

Il faut donc une connexion internet au moment de l'ouverture, sauf si Reveal.js est ensuite installé localement dans le projet.

## Présenter

- Flèches droite/gauche : navigation.
- `F` : plein écran.
- `S` : mode présentateur avec notes.
- `Esc` : vue globale des slides.

## Exporter en PDF

1. Ouvre le fichier HTML dans Chrome ou Chromium.
2. Ajoute `?print-pdf` à la fin de l'URL.
3. Lance l'impression avec `Ctrl+P`.
4. Choisis `Enregistrer au format PDF`.
5. Réglages recommandés :
   - orientation : paysage ;
   - marges : aucune ;
   - arrière-plans graphiques : activés ;
   - échelle : 100%.

Exemple si le fichier est ouvert localement :

```text
file:///.../spity/docs/rncp/reveal-bloc-01-spity.html?print-pdf
```

## Export HTML partageable

Le fichier HTML peut être partagé tel quel avec le dossier du projet, car les images sont chargées depuis :

```text
spity/public/images/
```

Pour un export totalement autonome hors projet, il faudra soit :

- remplacer les chemins d'images par des images embarquées en base64 ;
- ou copier le HTML avec le dossier `public/images`.

