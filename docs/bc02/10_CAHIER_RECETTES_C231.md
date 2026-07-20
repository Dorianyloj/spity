# Cahier de recettes - C2.3.1

## 1. Objet et périmètre

Ce cahier vérifie la conformité du prototype Spity aux fonctions F01 à F10 définies dans le [périmètre fonctionnel](./01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md). Il couvre les parcours fonctionnels des rôles grimpeur et club ainsi que les contrôles structurels, de sécurité et d'accessibilité demandés par la grille C2.3.1.

Version locale exécutée le 20 juillet 2026 :

| Élément | Valeur |
| --- | --- |
| Branche | `develop` |
| SHA du lot de recette | `2941a441657f85b3198b5e73f9e314a01221c977` |
| Application | Spity `0.1.0` |
| Runtime | Node.js 22, Next.js 16.2.10 |
| Navigateur | Playwright 1.61.1, Chromium 149 |
| Données | MariaDB 11.4 migrée avec Drizzle |
| Exécution | 6 scénarios réussis sur 6, aucun ignoré, aucun instable, 18,4 s |

## 2. Stratégie de recette

### Critères d'entrée

- les dépendances sont installées depuis `package-lock.json` ;
- `DATABASE_URL` et `JWT_SECRET` sont définis ;
- MariaDB est saine et toutes les migrations Drizzle sont appliquées ;
- Chromium est installé par Playwright ;
- les fonctions F01 à F10 sont disponibles sur la branche à vérifier.

### Règles d'exécution

1. La recette crée trois grimpeurs, un club et un compte d'inscription avec des adresses uniques.
2. Les scénarios s'exécutent séquentiellement avec un seul worker pour conserver le cycle métier.
3. Les actions sensibles sont réalisées par l'interface ; les comptes de préparation sont créés par les API publiques avec session réelle.
4. Chaque réponse inattendue, élément absent ou autorisation incorrecte fait échouer la commande.
5. Les comptes et leurs données liées sont supprimés avant et après l'exécution.
6. Un échec conserve capture, vidéo et trace ; chaque exécution produit aussi des rapports HTML, JSON et JUnit.

Commande locale :

```bash
npm run db:migrate
npm run test:acceptance
```

La CI exécute la même commande sur une MariaDB vide. Le job de staging dépend du succès de la recette : aucun déploiement `develop` ne peut donc contourner un échec fonctionnel.

## 3. Scénarios fonctionnels exécutés

| ID | Fonctions | Préconditions et actions principales | Résultat attendu | Résultat obtenu |
| --- | --- | --- | --- | :---: |
| REC-F01-001 | F01 | Ouvrir l'inscription, soumettre un mot de passe faible, créer un grimpeur, terminer l'onboarding, se déconnecter puis se reconnecter. | Erreur accessible sur le mot de passe faible ; session créée ; route d'onboarding imposée ; déconnexion et reconnexion effectives. | Conforme |
| REC-F02-001 | F02 | Ouvrir la fiche d'un grimpeur, modifier sa bio, puis créer par l'interface le profil complet d'un club. | Valeurs existantes restituées ; modification persistée ; profil club et accès à l'application créés. | Conforme |
| REC-F03-F04-001 | F03, F04 | Combiner localité, discipline, niveau, disponibilité et environnement ; vérifier l'état vide ; envoyer deux demandes ; accepter la première et refuser la seconde. | Seul le profil compatible apparaît ; les deux décisions sont possibles et restent visibles dans l'historique émetteur. | Conforme |
| REC-F05-F08-001 | F05, F06, F07, F08 | Le club crée une initiation d'une place ; un grimpeur s'inscrit ; le second est bloqué ; le club voit le participant, augmente la capacité, puis suit inscription, désinscription et annulation. | Création et modification persistées ; capacité jamais dépassée ; liste privée exacte ; place libérée ; événement annulé et traçable. | Conforme |
| REC-F09-001 | F09 | Accéder anonymement au matching, appeler le matching avec un club, muter depuis une origine étrangère et envoyer un UUID invalide. | Redirection vers la connexion avec CSP ; réponses respectives `403`, `403` et `422`, sans donnée sensible. | Conforme |
| REC-F10-001 | F10 | Charger le matching à 360 px avec réduction des animations, atteindre le lien par Tab, l'activer par Entrée et mesurer le document. | Un seul `h1`, navigation nommée, contrôle focusable, aucune largeur parasite et champs nommés. | Conforme |

## 4. Couverture des fonctions attendues

| Fonction | Preuve navigateur | Preuves complémentaires | État |
| --- | --- | --- | :---: |
| F01 Authentification | REC-F01-001 | Tests de validation, session, quota et routes HTTP | Couverte |
| F02 Profils | REC-F02-001 | Schémas Zod et intégration MariaDB des deux rôles | Couverte |
| F03 Matching | REC-F03-F04-001 | Tests unitaires des combinaisons de filtres | Couverte |
| F04 Partenariats | REC-F03-F04-001 | Intégration des conflits, droits et historique | Couverte |
| F05 Administration d'événements | REC-F05-F08-001 | Validation des dates, statuts et propriété | Couverte |
| F06 Consultation et capacité | REC-F05-F08-001 | Intégration de deux inscriptions concurrentes | Couverte |
| F07 Inscription et désinscription | REC-F05-F08-001 | Contraintes uniques MariaDB et réactivation | Couverte |
| F08 Suivi club | REC-F05-F08-001 | Contrôle API de confidentialité des participants | Couverte |
| F09 Sécurité | REC-F09-001 | Audit OWASP, audit npm, headers et tests CSRF/quota | Couverte |
| F10 Accessibilité | REC-F10-001 | Axe authentifié et Lighthouse à 100 % | Couverte sur le prototype |

## 5. Contrôles fonctionnels, structurels et de sécurité

| Type | Commande ou contrôle | Critère de succès | Résultat du 20 juillet 2026 |
| --- | --- | --- | --- |
| Fonctionnel navigateur | `npm run test:acceptance` | 6/6, aucun skip ou flaky | 6/6 en 18,4 s |
| Fonctionnel HTTP/DB | `npm run test:integration` | Toutes les étapes TAP réussies | 11 résultats réussis sur la release de référence |
| Structure | `npm run lint` | Aucune erreur ESLint | Réussi |
| Structure | `npm run typecheck` | Aucune erreur TypeScript | Réussi |
| Régression | `npm run test:coverage` | 100 % tests ; seuils dépassés | 86/86 ; lignes 96 %, branches 89,69 %, fonctions 100 % |
| Sécurité dépendances | `npm run security:audit` | Aucune alerte haute ou critique | Réussi ; 2 alertes modérées suivies |
| Construction | `npm run build` | Build production complet | 28 routes générées |
| Accessibilité | `npm run accessibility:audit` | Aucune violation axe sur l'échantillon | Réussi sur la release de référence |
| Performance | `npm run perf:audit` | Performance >= 85 ; accessibilité = 100 | Seuils réussis sur la release de référence |

Les résultats « release de référence » correspondent à la CI et à la release `v0.1.0` documentées dans [C2.2.4](./09_VERSIONS_DEPLOIEMENTS_C224.md). Le nouveau job de recette rejoue automatiquement son contrôle navigateur à chaque push et chaque pull request.

## 6. Résultat et décision

La recette locale du SHA `2941a44` est acceptée : toutes les fonctions F01 à F10 ont au moins un scénario nominal ou alternatif exécuté, les contrôles structurels sont réussis et les protections critiques refusent les accès invalides.

L'anomalie d'accessibilité détectée pendant la première exécution a été corrigée et retestée. Les échecs liés aux sélecteurs Playwright ont été qualifiés comme défauts du harnais, puis rendus déterministes. Le détail avant/après se trouve dans le [plan de correction C2.3.2](./11_PLAN_CORRECTION_BOGUES_C232.md).

### Preuve distante

L'[exécution GitHub Actions no 29747713909](https://github.com/Dorianyloj/spity/actions/runs/29747713909) a validé le SHA `f384a21136fdaff73810cecefafb24951b82d42e` le 20 juillet 2026 :

| Job | Résultat |
| --- | --- |
| `Quality gates` | Succès en 1 min 15 s |
| `MariaDB integration tests` | Succès en 4 min 01 s |
| `Lighthouse thresholds` | Succès en 1 min 46 s |
| `BC02 acceptance recipe` | Succès en 2 min 07 s |
| `Deploy verified staging images` | Succès en 3 min 19 s, déclenché seulement après les quatre portes précédentes |
| Artefact de recette | `acceptance-f384a21136fdaff73810cecefafb24951b82d42e`, 206 Ko, conservé 30 jours |
| Artefact staging | `staging-f384a21136fdaff73810cecefafb24951b82d42e`, 3,58 Ko, conservé 30 jours |

Cette exécution sur un runner et une base neufs confirme les résultats locaux, la génération des preuves et le caractère bloquant de la recette avant staging.

## 7. Preuves conservées

| Preuve | Emplacement ou nom |
| --- | --- |
| Scénarios exécutables | `spity/tests/acceptance/bc02-recipe.spec.ts` |
| Configuration | `spity/playwright.config.ts` |
| Rapport local lisible | `spity/playwright-report/index.html` |
| Résultats structurés | `spity/.acceptance-results/results.json` et `results.xml` |
| Diagnostics d'échec | `spity/test-results/` : capture, vidéo et trace |
| Artefact CI | `acceptance-<SHA>`, conservé 30 jours |
| Pipeline bloquant | Job `BC02 acceptance recipe` dans `.github/workflows/ci.yml` |

Les rapports locaux sont régénérables et ignorés par Git pour éviter de versionner des fichiers volumineux ou dépendants de la machine. Les rapports de référence sont conservés par GitHub Actions.
