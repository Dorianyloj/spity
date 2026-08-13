# Captures visuelles — Bloc 4

Ces captures sont produites par `npm run bloc4:visuals` depuis l'application Spity réellement exécutée en local avec les données de démonstration. Elles complètent les preuves structurées JSON : elles montrent les parcours visibles, sans remplacer les contrôles de maintenance, de CI/CD et de registre.

| Identifiant | Écran | Scénario | Fichier |
| --- | --- | --- | --- |
| B4-VIS-01 | Accueil public | Consultation de la page de présentation sans authentification. | `B4-VIS-01-accueil-public-spity-2026-08-13.png` |
| B4-VIS-02 | Tableau de bord grimpeur | Session authentifiée d'un compte de démonstration. | `B4-VIS-02-tableau-de-bord-grimpeur-2026-08-13.png` |
| B4-VIS-03 | Matching | Recherche de partenaires depuis le compte grimpeur de démonstration. | `B4-VIS-03-matching-grimpeur-2026-08-13.png` |
| B4-VIS-04 | Événements club | Consultation de la gestion d'événements depuis le compte club de démonstration. | `B4-VIS-04-evenements-club-2026-08-13.png` |
| B4-VIS-05 | Profil mobile | Consultation du profil grimpeur dans un viewport mobile de 390 × 844 px. | `B4-VIS-05-profil-grimpeur-mobile-2026-08-13.png` |

Le fichier `manifest.json` conserve la date de production, les dimensions et la taille de chaque capture. Il ne contient pas de mot de passe, de cookie, de jeton, d'export de base ou de donnée personnelle. Les captures utilisent uniquement les comptes de démonstration et les données locales prévues pour la recette.

## Reproduction

Depuis `spity/`, avec MariaDB locale démarrée, migrations appliquées, données de démonstration chargées et l'application disponible :

```bash
npm run bloc4:visuals
npm run bloc4:manifest
npm run bloc4:check
```

Les images ne prouvent pas à elles seules une compétence de maintenance. Elles sont l'illustration visuelle des parcours de l'application ; les preuves de supervision, incidents, correctifs CI/CD, améliorations, versions et support restent les fichiers C411 à C433 du répertoire parent.
