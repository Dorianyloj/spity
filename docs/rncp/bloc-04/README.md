# Bloc 4 - Maintenir l'application en condition opérationnelle

Ce répertoire est le chantier Bloc 4 de Spity selon le référentiel Ynov 2024, pages 15 à 17. Les compétences sont désormais reprises une à une et ne sont déclarées industrialisées qu'après fonctionnement réel, automatisation et tests.

## Livrables

- [`dossier-jury/`](dossier-jury/) : dossier de remise structuré, pédagogique et autonome pour le jury ;
- [`DOSSIER_BLOC_04.md`](DOSSIER_BLOC_04.md) : dossier de travail couvrant C4.1.1 à C4.3.3 ;
- [`PLAN_ACTION_BLOC_04.md`](PLAN_ACTION_BLOC_04.md) : état réel et feuille de route compétence par compétence ;
- [`REVUE_FINALE_BLOC_04.md`](REVUE_FINALE_BLOC_04.md) : grille jury liant chaque attendu, mécanisme, commande et preuve ;
- [`preuves/`](preuves) : preuves figées, fiches d'anomalie, recommandations, journal et collaboration support contrôlée ;
- [`preuves/captures/`](preuves/captures/) : parcours applicatifs, état Git, CI/CD et audit des compétences, avec manifestes de capture reproductibles ;
- [`../../../output/pdf/dossier-bloc-04-spity.pdf`](../../../output/pdf/dossier-bloc-04-spity.pdf) : export de travail vérifié visuellement, à régénérer après chaque compétence ;
- [`../referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf`](../referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf) : source officielle.

## Sources opérationnelles

- [`../../../spity/INCIDENT_MANAGEMENT.md`](../../../spity/INCIDENT_MANAGEMENT.md) : cycle de gestion des anomalies, rôles et portes qualité ;

- [`../../../spity/RELEASE_VERIFICATION.md`](../../../spity/RELEASE_VERIFICATION.md) : vérification version/révision avant promotion d'un candidat ;

- [`../../../spity/RELEASE_JOURNAL.md`](../../../spity/RELEASE_JOURNAL.md) : registre des versions, correctifs documentés et preuve de déploiement ;

- [`../../../spity/SUPPORT.md`](../../../spity/SUPPORT.md) : processus, registre de transmissions support/mainteneur et confidentialité ;

- [`../../../spity/IMPROVEMENT_MANAGEMENT.md`](../../../spity/IMPROVEMENT_MANAGEMENT.md) : registre d'améliorations, priorisation et revue mensuelle ;

- [`../../../spity/MAINTENANCE.md`](../../../spity/MAINTENANCE.md) ;
- [`../../../spity/OBSERVABILITY.md`](../../../spity/OBSERVABILITY.md) ;
- [`../../../spity/SUPPORT.md`](../../../spity/SUPPORT.md) ;
- [`../../../spity/DEPLOYMENT.md`](../../../spity/DEPLOYMENT.md) ;
- workflows CI, release et supervision sous `.github/workflows/`.

## Reproduction

Depuis `spity/` :

```bash
npm run bloc4:capture
npm run bloc4:visuals
npm run bloc4:tech-visuals
npm run bloc4:exercise
npm run bloc4:improvements
npm run bloc4:releases
npm run bloc4:support
npm run bloc4:check
npm run bloc4:final-audit
npm run quality
```

La génération PDF et le manifeste sont décrits dans la procédure de build du dossier. `bloc4:check` contrôle les sept compétences, les preuves, les registres et le manifeste sans appel externe. Les preuves externes sont publiques et datées. La collaboration support est une simulation contrôlée explicitement déclarée, conformément à la modalité d'évaluation autorisée.
