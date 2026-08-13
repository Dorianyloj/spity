# Maintenir Spity en condition opérationnelle

Cette procédure décrit la maintenance préventive et corrective de l'application Spity. Elle complète `DEPLOYMENT.md` et sert de référence pour la compétence C4.1.1 du Bloc 4.

## Périmètre

Le suivi couvre quatre familles :

- dépendances npm de production et de développement dans `package.json` et `package-lock.json` ;
- actions GitHub utilisées par la CI, la release et la supervision ;
- images de conteneurs Next.js et MariaDB ;
- runtime Node.js, TypeScript et navigateurs utilisés par les recettes.

Les secrets, données MariaDB et contenus utilisateurs ne font jamais partie d'une mise à jour automatique.

## Fréquence et responsabilités

| Fréquence | Action | Mode | Responsable |
| --- | --- | --- | --- |
| Chaque lundi à 06:00 | Recherche des mises à jour npm groupées par production/développement | Dependabot automatique vers `develop` | Mainteneur |
| Chaque lundi à 06:30 | Recherche des nouvelles versions d'actions GitHub | Dependabot automatique vers `develop` | Mainteneur |
| À chaque CI | Audit des dépendances de production, lint, types, tests, build et recettes | Automatique et bloquant | GitHub Actions |
| Chaque mois | Revue de `npm outdated`, `npm audit` complet et images Docker | Manuel assisté | Mainteneur |
| Sous 24 h | Qualification d'une vulnérabilité critique ou haute exploitable en production | Manuel prioritaire | Mainteneur |
| Avant chaque release | Validation du lockfile, des migrations, des images et du retour arrière | Manuel + workflow Release | Mainteneur |

## Contrôles réellement exécutés

La politique n'est pas seulement documentaire. Elle est définie dans `dependency-policy.json` et appliquée par `npm run dependencies:check`. Cette commande :

1. exécute séparément l'audit de production et l'audit complet ;
2. refuse toute alerte haute ou critique de production ;
3. refuse toute alerte modérée de développement qui ne possède pas une dérogation nommée, motivée, attribuée et datée ;
4. refuse une dérogation expirée ou une version verrouillée différente du lockfile ;
5. produit un SBOM CycloneDX et un rapport JSON sous `tmp/dependency-maintenance/` ;
6. inventorie les versions installées, souhaitées et majeures disponibles.

Le workflow `Dependency maintenance` rejoue ce contrôle chaque lundi à 05:00 UTC et sur demande. Il conserve le rapport et le SBOM pendant 90 jours. En cas d'échec, il ouvre ou actualise un ticket GitHub unique ; au retour à la conformité, il documente la récupération et clôt ce ticket.

Chaque pull request vers `develop` ou `main` déclenche en plus `Dependency review`. Une nouvelle dépendance comportant une vulnérabilité modérée ou supérieure, qu'elle soit de production ou de développement, bloque la revue. Dependabot groupe seulement les correctifs et versions mineures compatibles ; chaque version majeure reste isolée pour empêcher qu'une rupture soit noyée dans un lot.

## Processus de mise à jour

1. Identifier la source, la version installée, la version cible, la sévérité et le périmètre production/développement.
2. Lire les notes de version pour tout changement majeur ou de sécurité.
3. Isoler le lot : sécurité urgente, mises à jour compatibles ou migration majeure.
4. Modifier le manifeste avec npm afin de recalculer le lockfile et son intégrité.
5. Exécuter `npm run quality`, puis les recettes MariaDB, Playwright et accessibilité si le lot touche le runtime, la base ou le navigateur.
6. Contrôler `npm audit --omit=dev --audit-level=high` : aucune vulnérabilité haute ou critique de production n'est acceptée.
7. Faire valider la CI de la révision et conserver ses artefacts.
8. Déployer par image immuable et vérifier version/révision via `/api/health`.
9. Revenir au tag précédent si une régression critique est détectée ; restaurer la base uniquement si une migration incompatible l'exige.

## Politique de décision

| Situation | Décision |
| --- | --- |
| Correctif de sécurité de production compatible | Intégration prioritaire après CI complète. |
| Mise à jour mineure compatible | Regroupement hebdomadaire pour limiter le bruit. |
| Mise à jour majeure | Branche dédiée, analyse de rupture, plan de retour arrière et recette ciblée. |
| Vulnérabilité uniquement dans un outil de développement non exposé | Qualification documentée et traitement planifié ; aucune commande `npm audit fix --force` sans revue. |
| Correctif proposé qui rétrograde une dépendance ou casse l'API | Refus temporaire motivé, suivi de l'amont et mesures compensatoires. |

## Lot de maintenance du 13 août 2026

Le contrôle a détecté quatre alertes hautes dans Lighthouse/Puppeteer, limitées à l'outillage mais corrigibles. Le lot a donc mis à jour :

- Lighthouse de `12.6.1` vers `13.4.1` ;
- Puppeteer Core de `24.43.1` vers `25.6.0` ;
- Playwright de `1.61.1` vers `1.62.1` ;
- `eslint-config-next` de `16.2.11` vers `16.3.0`, aligné avec Next.js ;
- les types Node.js vers la branche 22, alignée avec `.nvmrc`.

Le même lot compatible a ensuite actualisé le lockfile, notamment vers React/React DOM `19.2.8`, Tailwind `4.3.3`, Framer Motion `12.43.0`, MySQL2 `3.23.3`, React Hook Form `7.85.0`, Zod `4.4.3`, dotenv `17.4.2` et ESLint `9.39.5`. Les versions majeures encore disponibles ne sont pas fusionnées avec ce lot : elles nécessitent chacune une branche, une lecture des ruptures et une qualification ciblée.

La tentative de mise à jour de `@hookform/resolvers` vers `5.7.1` a produit un défaut réel de chaîne d'approvisionnement : `npm sbom` échouait avec `ESBOMPROBLEMS`, car le pair optionnel Ajv `^8.12.0` entrait en conflit avec Ajv 6 utilisé par ESLint. Ajouter Ajv 8 uniquement pour satisfaire un résolveur inutilisé aurait augmenté artificiellement le périmètre. La dépendance reste donc verrouillée à `5.2.2` jusqu'au 13 octobre 2026. Cette décision est exécutable : le contrôle échoue si le verrou change ou dépasse sa date de revue.

Après ce lot, l'audit complet ne contient plus d'alerte haute ou critique. Quatre alertes modérées restent liées à Drizzle Kit/esbuild dans l'outillage de développement. npm propose une rétrogradation cassante de Drizzle Kit : elle n'est pas appliquée. Les mesures compensatoires sont l'absence d'exposition du serveur de développement, l'audit de production bloquant et l'exécution des migrations depuis des images contrôlées.

## Preuves attendues pour chaque lot

- diff de `package.json` et `package-lock.json` ;
- rapport d'audit avant/après et décision sur les alertes restantes ;
- rapport de politique et SBOM CycloneDX générés par `npm run dependencies:check` ;
- URL de CI verte avec SHA Git ;
- résultats des tests touchés ;
- version, révision et contrôle de santé après déploiement ;
- entrée dans `CHANGELOG.md` et le journal des versions déployées.
