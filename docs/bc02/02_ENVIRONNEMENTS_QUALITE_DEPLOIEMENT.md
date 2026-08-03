# Environnements, qualité et protocole de déploiement - C2.1.1

## 1. Objectif et compétence couverte

Ce document décrit la mise en œuvre des environnements de développement, de test et de production de Spity ainsi que les outils de suivi de qualité et de performance.

Il répond à la compétence C2.1.1 du bloc BC02 :

> Mettre en œuvre des environnements de déploiement et de test en y intégrant les outils de suivi de performance et de qualité afin de permettre le bon déroulement de la phase de développement du logiciel.

Les livrables associés sont :

- le protocole de déploiement continu ;
- les critères de qualité et de performance ;
- la description de l'environnement de développement ;
- l'identification du compilateur, du serveur d'application et du gestionnaire de sources ;
- les séquences de déploiement et de retour arrière.

## 2. Environnement de développement

### Poste de référence

| Composant | Choix | Rôle |
| --- | --- | --- |
| Système | Windows avec PowerShell | Poste de développement de référence. |
| Éditeur | Visual Studio Code ou Codex | Édition, revue et navigation dans le code. |
| Runtime | Node.js 22 | Exécution de Next.js et des outils npm. |
| Gestionnaire de paquets | npm 10 ou supérieur | Installation reproductible via `npm ci`. |
| Framework | Next.js 16 avec React 19 | Serveur d'application et interface web. |
| Compilateur | TypeScript 5 et compilateur Next.js/Turbopack | Typage statique et production des bundles. |
| Base de données | MariaDB 11.4 dans Docker | Persistance locale isolée du poste. |
| ORM | Drizzle ORM et Drizzle Kit | Requêtes typées et migrations. |
| Gestion de sources | Git et GitHub | Historique, branches, revues et intégration. |

La version Node.js attendue est conservée dans `spity/.nvmrc`. Les contraintes compatibles sont également déclarées dans `package.json`.

### Démarrage reproductible

Depuis le dossier `spity/` de l'application :

```bash
npm ci
cp .env.example .env.local
# Remplacer les secrets de démonstration.
docker compose --env-file .env.local up -d --wait
npm run db:migrate
npm run dev
```

La base est publiée uniquement sur `127.0.0.1:3306`. phpMyAdmin n'est pas démarré par défaut et nécessite le profil explicite `tools`.

## 3. Séparation des environnements

| Propriété | Développement | Test | Production |
| --- | --- | --- | --- |
| Fichier modèle | `.env.example` | `.env.test.example` | `.env.production.example` |
| Fichier secret local | `.env.local` | `.env.test` | `.env.production` |
| Orchestration | `docker-compose.yml` | `docker-compose.test.yml` | `docker-compose.production.yml` |
| Base | MariaDB persistante | MariaDB isolée en `tmpfs` | MariaDB persistante, non exposée au réseau hôte |
| Port base | `127.0.0.1:3306` | `127.0.0.1:3307` | Aucun port publié |
| Application | `next dev` sur le poste | Serveur de test/CI | Image Docker Next.js standalone |
| Données | Données locales | Données jetables | Volume sauvegardé |
| Secrets | Valeurs locales non versionnées | Valeurs réservées aux tests | Secrets injectés au déploiement |

Les fichiers contenant les valeurs réelles sont ignorés par Git. Seuls les modèles suffixés `.example` sont versionnés.

## 4. Architecture de l'environnement de production

Le fichier `docker-compose.production.yml` définit trois responsabilités :

1. `mariadb` conserve les données dans un volume et n'expose aucun port à l'extérieur du réseau Docker ;
2. `migrate` utilise la cible Docker `migration` pour appliquer les migrations avant le démarrage de la nouvelle version ;
3. `app` exécute uniquement la sortie Next.js standalone, sans dépendances de développement.

L'application est liée à `127.0.0.1:3000` par défaut. En exploitation, un reverse proxy termine HTTPS et transmet les requêtes à ce port local.

La route `GET /api/health` vérifie réellement l'accès à MariaDB et identifie le binaire déployé. Elle retourne :

- `200 { "status": "ok", "version": "X.Y.Z", "revision": "SHA" }` lorsque l'application et la base sont disponibles ;
- `503 { "status": "unavailable", "version": "X.Y.Z", "revision": "SHA" }` lorsqu'une dépendance est indisponible.

Aucun détail de connexion ou message interne n'est exposé par cette route.

## 5. Gestion des secrets

Les règles suivantes sont obligatoires :

- aucun mot de passe, jeton ou secret réel dans Git, une image Docker ou un rapport ;
- secrets différents entre développement, test et production ;
- mot de passe applicatif MariaDB différent du mot de passe `root` ;
- secret de session généré aléatoirement avec au moins 64 octets en production ;
- rotation d'un secret immédiatement après toute exposition suspectée ;
- valeur `DATABASE_URL` cohérente avec l'utilisateur et le mot de passe MariaDB ;
- caractères spéciaux d'un mot de passe encodés lorsqu'ils sont placés dans une URL.

Commande de génération recommandée :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 6. Outils de qualité et de performance

| Outil | Commande | Résultat attendu |
| --- | --- | --- |
| ESLint | `npm run lint` | Aucune erreur. |
| TypeScript | `npm run typecheck` | Aucune erreur de type. |
| Next.js | `npm run build` | Build de production réussi. |
| npm audit | `npm run security:audit` | Aucune vulnérabilité haute ou critique en production. |
| Lighthouse | `npm run perf:audit` | Respect des seuils des pages principales. |
| Docker Compose | `docker compose ... config --quiet` | Configuration valide pour les trois environnements. |
| Healthcheck | `GET /api/health` | Réponse HTTP 200 après déploiement. |

Les tests et la couverture automatisée sont exécutés par `npm run test:coverage`. Lighthouse mesure les pages d'accueil, de connexion et d'inscription, vérifie chaque seuil et enregistre les rapports JSON dans `.lighthouseci`.

## 7. Critères de qualité et de performance

| Indicateur | Seuil bloquant |
| --- | --- |
| Erreurs ESLint | 0 |
| Erreurs TypeScript | 0 |
| Build de production | Réussi |
| Tests automatisés | 100 % des tests réussis |
| Couverture lignes et instructions | Au moins 60 % sur tout `src/` |
| Couverture fonctions | Au moins 55 % sur tout `src/` |
| Couverture branches | Au moins 75 % sur tout `src/` |
| Vulnérabilités critiques ou hautes de production | 0 non justifiée |
| Lighthouse performance | Au moins 85/100 |
| Lighthouse accessibilité | 100/100 |
| Lighthouse bonnes pratiques | Au moins 90/100 |
| Lighthouse SEO | Au moins 90/100 |
| API principales dans l'environnement de référence | 95e percentile inférieur à 500 ms |
| Healthcheck après déploiement | HTTP 200 |

Les seuils Lighthouse sont codés dans `spity/scripts/run-lighthouse.mjs`. Une mesure reproductible est réalisée sur chaque page publique ; l'audit authentifié séparé vérifie dix états supplémentaires et le reflow mobile.

## 8. Protocole de déploiement continu

### 8.1 Conditions d'entrée

Un déploiement ne peut commencer que si :

1. la modification est tracée dans Git ;
2. la branche a été relue et intégrée selon le protocole CI ;
3. lint, typage, tests, audit et build sont réussis ;
4. la migration éventuelle a été relue et testée sur une base jetable ;
5. une version d'image immuable est identifiée par le SHA du commit ou un tag de version ;
6. la sauvegarde et la procédure de retour arrière sont prêtes.

### 8.2 Séquence de déploiement

1. Construire les images avec les cibles `runner` et `migration` du `Dockerfile`.
2. Étiqueter l'image avec le numéro de version et le SHA Git, sans réutiliser uniquement `latest` comme preuve.
3. Démarrer ou vérifier MariaDB et attendre son état `healthy`.
4. Sauvegarder la base avant toute migration de schéma en production.
5. Exécuter le service `migrate` une seule fois.
6. Démarrer la nouvelle version de `app` sur l'environnement de validation.
7. Attendre le healthcheck puis exécuter les smoke tests et le cahier de recettes ciblé.
8. Exécuter Lighthouse sur les pages représentatives.
9. Promouvoir les mêmes digests validés vers la production, sans reconstruction.
10. Vérifier le healthcheck, les journaux, les parcours critiques et les indicateurs de performance.
11. Enregistrer la version, la date, le SHA, l'opérateur et les résultats dans l'historique de déploiement.

Commandes de référence :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml pull app migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d mariadb
docker compose --env-file .env.production -f docker-compose.production.yml --profile migration run --rm --no-build migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d --no-build app
docker compose --env-file .env.production -f docker-compose.production.yml ps
```

### 8.3 Vérifications après déploiement

- `app` et `mariadb` sont `healthy` ;
- `/api/health` répond en HTTP 200 ;
- inscription, connexion et consultation du profil fonctionnent ;
- aucune erreur nouvelle n'apparaît dans les journaux ;
- les métriques Lighthouse respectent les seuils ;
- aucune migration n'a supprimé ou rendu incohérentes les données attendues.

### 8.4 Retour arrière

Le retour arrière est déclenché lorsqu'un contrôle bloquant échoue ou lorsqu'une anomalie critique est détectée.

1. Arrêter la promotion et conserver les journaux utiles au diagnostic.
2. Redéployer l'image immuable précédemment validée.
3. Restaurer la sauvegarde uniquement si la migration n'est pas compatible avec l'ancienne version.
4. Vérifier `/api/health` et les parcours critiques.
5. Créer une anomalie avec la cause, l'impact, les éléments de preuve et la décision prise.
6. Corriger sur une branche séparée puis reprendre la séquence complète.

Les migrations doivent être conçues de manière rétrocompatible lorsque cela est possible : ajout avant suppression, remplissage des nouvelles colonnes, bascule applicative, puis nettoyage dans une version ultérieure.

## 9. Éléments de preuve C2.1.1

Les preuves à conserver pour le dossier final sont :

- les trois configurations Compose et leurs fichiers d'exemple ;
- le `Dockerfile` multi-étapes et `.dockerignore` ;
- une capture d'une validation `docker compose config --quiet` réussie ;
- une capture des conteneurs `healthy` ;
- un résultat de `npm run quality` ;
- un rapport `npm run security:audit` ;
- les rapports Lighthouse générés dans `.lighthouseci` ;
- un exemple de déploiement réussi et un exercice de retour arrière ;
- l'historique Git des évolutions de l'environnement.

## 10. Résultats de validation initiaux

État vérifié le 20 juillet 2026 :

- les configurations Compose développement, test et production sont syntaxiquement valides ;
- l'audit des dépendances de production ne signale aucune vulnérabilité haute ou critique et conserve deux alertes modérées liées à `postcss` dans Next.js ;
- l'audit complet conserve six alertes modérées, dont la chaîne de développement `drizzle-kit/esbuild` ;
- le seuil CI est volontairement bloquant à partir du niveau `high` ; les alertes modérées restent suivies et ne sont pas masquées ;
- leur évolution reste suivie et une mise à jour non cassante devra être appliquée dès sa disponibilité.

L'image standalone a été construite sous Node.js 22, lancée sous l'utilisateur non privilégié `nextjs` et vérifiée avec une MariaDB de test migrée. La route `/api/health` a répondu `200 { "status": "ok" }`. Les résultats Lighthouse doivent être actualisés à chaque version livrée.

Résultats Lighthouse 12.6.1 obtenus sur le build de production :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | ---: | ---: | ---: | ---: |
| Accueil | 98 | 100 | 100 | 100 |
| Connexion | 97 | 100 | 100 | 100 |
| Inscription | 99 | 100 | 100 | 100 |

Le premier audit avait détecté une performance de 77 sur l'accueil et une accessibilité de 90 sur les formulaires. L'optimisation des images, la correction du contraste, de la hiérarchie des titres et de la taille des cibles tactiles ont permis de franchir les seuils.
