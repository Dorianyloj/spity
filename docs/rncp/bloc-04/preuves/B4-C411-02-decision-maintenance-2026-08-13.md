# B4-C411-02 - Décision de maintenance du 13 août 2026

## Contexte

L'audit complet npm a détecté huit alertes dans l'outillage de développement : quatre hautes liées à Lighthouse/Puppeteer et quatre modérées liées à Drizzle Kit/esbuild. L'audit limité à la production ne détectait aucune vulnérabilité.

## Évaluation d'impact

| Lot | Exposition | Correctif disponible | Risque du changement | Décision |
| --- | --- | --- | --- | --- |
| Lighthouse/Puppeteer | Outils CI et accessibilité, pas de code livré au navigateur | Mise à jour majeure disponible | Modification possible du lancement Chrome et des scores | Mettre à jour puis rejouer toutes les portes navigateur. |
| ESLint Next | Outil de qualité | Version 16.3 alignée avec Next 16.3 | Faible | Aligner les versions. |
| Types Node | Compilation uniquement | Branche 22 disponible | Faible à moyen | Aligner avec `.nvmrc` Node 22. |
| Drizzle/esbuild | Génération/migration en développement | npm propose une rétrogradation majeure de Drizzle Kit | Élevé et cassant | Reporter, ne pas utiliser `--force`, conserver les mesures compensatoires. |
| `@hookform/resolvers` 5.7.1 | Résolveur de formulaires ; Spity utilise uniquement Zod | Mise à jour compatible en apparence | `npm sbom` échoue sur le pair optionnel Ajv 8 face à Ajv 6 d'ESLint | Conserver exactement 5.2.2, avec verrou contrôlé et échéance au 13 octobre 2026. |

## Réalisation

- `lighthouse` : `12.6.1` vers `13.4.1` ;
- `puppeteer-core` : `24.43.1` vers `25.6.0` ;
- `@playwright/test` : `1.61.1` vers `1.62.1` ;
- `eslint-config-next` : `16.2.11` vers `16.3.0` ;
- `@types/node` : branche 20 vers branche 22.
- lot compatible du lockfile : React/React DOM `19.2.8`, Tailwind `4.3.3`, Framer Motion `12.43.0`, MySQL2 `3.23.3`, React Hook Form `7.85.0`, Zod `4.4.3`, dotenv `17.4.2` et ESLint `9.39.5`.

La politique est maintenant exécutable dans `spity/dependency-policy.json`. Le contrôle `npm run dependencies:check` refuse les vulnérabilités hors politique, les dérogations expirées et les versions verrouillées incohérentes. Il produit aussi un SBOM CycloneDX et un rapport JSON. Deux workflows complètent Dependabot : audit planifié avec ticket automatique, et revue bloquante des nouvelles dépendances en pull request.

## Résultat attendu

- aucune alerte haute ou critique dans l'audit complet ;
- aucune vulnérabilité de production ;
- lint, types, tests, build, intégration MariaDB, accessibilité et recettes Playwright verts ;
- lockfile régénéré et traçable par SHA-256.

## Résultat obtenu

- politique conforme sous Node `22.23.2` et npm `10.9.8` ;
- 0 vulnérabilité de production, 0 alerte haute/critique dans l'audit complet ;
- 4 alertes modérées de développement couvertes par une dérogation Drizzle/esbuild datée ;
- SBOM CycloneDX valide de 841 composants, associé au SHA-256 du lockfile ;
- 152 tests Jest, 8 tests de maintenance, 11 scénarios MariaDB et 6 recettes Playwright réussis ;
- 10 pages authentifiées à 100 % d'accessibilité ;
- Lighthouse public : performance de 0,97 à 0,99, accessibilité et SEO à 1.

La preuve JSON `B4-C411-01-audit-dependances-2026-08-13.json` fige les versions et l'audit. `B4-C411-03-controle-dependances-2026-08-13.json` conserve l'évaluation de politique sous le runtime cible, le verrou daté, l'inventaire des mises à jour et les métadonnées du SBOM.
