# Annexe — Matrice de preuves du Bloc 4

Cette matrice permet de passer rapidement d'un attendu à son mécanisme, sa commande et sa preuve. Les chemins sont relatifs au dépôt.

| Compétence | Attendu résumé | Source opérationnelle principale | Vérification | Preuve de référence | Limite explicitement assumée |
| --- | --- | --- | --- | --- | --- |
| C4.1.1 | Fréquence, périmètre et type de mises à jour | `spity/MAINTENANCE.md` ; `dependency-policy.json` | `npm run dependencies:check` | `B4-C411-03-controle-dependances-2026-08-13.json` | Les exceptions d'audit sont documentées et expirent ; aucune correction forcée cassante n'est appliquée. |
| C4.1.2 | Sondes, seuils, alertes et disponibilité | `spity/OBSERVABILITY.md` ; `monitoring-policy.json` | `npm run monitoring:slo` ; `npm run workflows:scripts:check` | `B4-C412-04-slo-supervision-2026-08-13.json` ; `B4-C412-05-validation-scripts-alertes-2026-08-17.json` | Une fenêtre courte est `insufficient-data`, elle ne crée pas de fausse indisponibilité. |
| C4.2.1 | Anomalie structurée, analysée et vérifiée | `spity/INCIDENT_MANAGEMENT.md` ; `incidents/` | `npm run incidents:check` | `B4-C421-03-registre-anomalies-2026-08-13.json` | L'incident de dérive reste planifié tant qu'une release n'est pas autorisée. |
| C4.2.2 | Correctif intégré et déployé via CI/CD | `spity/RELEASE_VERIFICATION.md` ; `verify-deployment.mjs` | `npm run bloc4:deployment-exercise` | `B4-C422-04-staging-verifie-2026-08-13.json` | La preuve confirme un staging, pas une promotion de production. |
| C4.3.1 | Améliorations réalistes, argumentées et mesurables | `spity/IMPROVEMENT_MANAGEMENT.md` ; `improvements/` | `npm run improvements:check` | `B4-C431-02-registre-ameliorations-2026-08-13.json` | Une recommandation n'est pas déclarée réalisée sans mesure de résultat. |
| C4.3.2 | Journal des versions et correctifs déployés | `spity/RELEASE_JOURNAL.md` ; `release-journal/` | `npm run releases:check` | `B4-C432-02-registre-versions-2026-08-13.json` | Un candidat CI est distinct d'une version observée en production. |
| C4.3.3 | Contexte, résolution et contributions support/technique | `spity/SUPPORT.md` ; `support-collaborations/` | `npm run support:check` | `B4-C433-02-registre-collaboration-support-2026-08-13.json` | Le cas est une simulation déclarée, pas un retour client revendiqué comme réel. |

## Contrôle transversal

`npm run bloc4:check` vérifie toute la matrice à partir de `spity/bloc4-audit-policy.json`. Il exige l'existence des documents et sources listés, contrôle les assertions des preuves, audite les registres et valide le manifeste SHA-256.

Les preuves textuelles de cette matrice sont reproduites intégralement dans les annexes P1 à P8 du PDF final ; elles ne sont donc pas seulement référencées par un chemin externe.

## Illustration des parcours applicatifs

Les captures réelles de l'application sont regroupées dans [`../../preuves/captures/`](../../preuves/captures/). Elles montrent l'accueil, le tableau de bord grimpeur, le matching, la gestion d'événements club et le profil mobile. Leurs scénarios, dimensions et date de production sont conservés dans leur manifeste ; elles complètent les preuves de maintenance sans se substituer aux contrôles automatisés.

## Illustration des preuves techniques

Les captures techniques A19 sont également regroupées dans [`../../preuves/captures/`](../../preuves/captures/). Elles apportent une lecture visuelle complémentaire des éléments suivants : état Git local, historique de `main`, CI GitHub Actions réussie sur `main`, CI et staging vérifiés sur `develop`, puis audit conforme des sept compétences. Elles complètent notamment C4.1.1, C4.1.2, C4.2.2 et C4.3.2 ; l'audit transversal les relie aussi à C4.2.1, C4.3.1 et C4.3.3.
