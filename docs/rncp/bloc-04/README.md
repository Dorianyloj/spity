# Bloc 4 - Maintenir l'application en condition opérationnelle

Ce répertoire est le chantier Bloc 4 de Spity selon le référentiel Ynov 2024, pages 15 à 17. Les compétences sont désormais reprises une à une et ne sont déclarées industrialisées qu'après fonctionnement réel, automatisation et tests.

## Livrables

- [`DOSSIER_BLOC_04.md`](DOSSIER_BLOC_04.md) : dossier de travail couvrant C4.1.1 à C4.3.3 ;
- [`PLAN_ACTION_BLOC_04.md`](PLAN_ACTION_BLOC_04.md) : état réel et feuille de route compétence par compétence ;
- [`preuves/`](preuves) : preuves figées, fiches d'anomalie, recommandations, journal et exercice support ;
- [`../../../output/pdf/dossier-bloc-04-spity.pdf`](../../../output/pdf/dossier-bloc-04-spity.pdf) : export de travail vérifié visuellement, à régénérer après chaque compétence ;
- [`../referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf`](../referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf) : source officielle.

## Sources opérationnelles

- [`../../../spity/MAINTENANCE.md`](../../../spity/MAINTENANCE.md) ;
- [`../../../spity/OBSERVABILITY.md`](../../../spity/OBSERVABILITY.md) ;
- [`../../../spity/SUPPORT.md`](../../../spity/SUPPORT.md) ;
- [`../../../spity/DEPLOYMENT.md`](../../../spity/DEPLOYMENT.md) ;
- workflows CI, release et supervision sous `.github/workflows/`.

## Reproduction

Depuis `spity/` :

```bash
npm run bloc4:capture
npm run bloc4:exercise
npm run quality
```

La génération PDF et le manifeste sont décrits dans la procédure de build du dossier. Les preuves externes sont publiques et datées. L'exercice support est explicitement fictif, conformément à la modalité d'évaluation autorisée.
