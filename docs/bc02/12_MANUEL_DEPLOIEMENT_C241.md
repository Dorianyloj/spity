# Manuel de déploiement de Spity - C2.4.1

## Identification du document

| Champ | Valeur |
| --- | --- |
| Produit | Spity |
| Version documentée | `0.1.0` et versions ultérieures compatibles |
| Public | Développeur, exploitant, évaluateur RNCP |
| Environnements | Développement local, recette CI, staging et production Docker |
| Sources exécutables | [`spity/docker-compose.yml`](../../spity/docker-compose.yml), [`spity/docker-compose.production.yml`](../../spity/docker-compose.production.yml), [`spity/DEPLOYMENT.md`](../../spity/DEPLOYMENT.md) |
| Compétence | C2.4.1 - documentation technique d'exploitation |
| Dernière vérification | 20 juillet 2026 |

## 1. Objet et périmètre

Ce manuel permet d'installer Spity depuis les sources, de promouvoir une release immuable en production, de contrôler son bon fonctionnement et de revenir à une version précédente. Il couvre l'application Next.js et sa base MariaDB.

Les données de démonstration sont strictement réservées aux environnements locaux ou éphémères. Elles ne doivent jamais être chargées sur une base de production.

## 2. Architecture déployée

```text
Navigateur
    |
    | HTTPS
    v
Reverse proxy / terminaison TLS
    |
    | HTTP sur 127.0.0.1:3000
    v
Application Next.js (conteneur non-root)
    |
    | DATABASE_URL sur le réseau Docker privé
    v
MariaDB 11.4 + volume persistant

Image de migration Drizzle -- exécution ponctuelle --> MariaDB
```

En production, le port applicatif est lié à l'interface locale et MariaDB ne publie aucun port hôte. Le reverse proxy HTTPS est donc l'unique entrée publique. La migration est un service ponctuel distinct : son succès est obligatoire avant le démarrage de la nouvelle version applicative.

## 3. Choix technologiques

| Couche | Technologie ou langage | Choix d'exploitation |
| --- | --- | --- |
| Langage | TypeScript en mode strict | Un langage partagé côté interface et serveur limite les divergences de contrats et rend le typage vérifiable par CI. |
| Application | Next.js App Router et React | Les pages, composants serveur et Route Handlers sont construits et livrés dans un même artefact. |
| Exécution | Node.js 22 | Version fixée par `.nvmrc`, `package.json` et l'image Docker pour rendre les builds reproductibles. |
| Validation | Zod | Les entrées et réponses métier sont contrôlées à l'exécution en complément du typage TypeScript. |
| Accès aux données | Drizzle ORM | Le schéma typé et les migrations versionnées évitent les modifications manuelles non traçables. |
| Base de données | MariaDB 11.4 | Base relationnelle adaptée aux comptes, relations de partenariat, inscriptions et capacités d'événements. |
| Présentation | Tailwind CSS et composants internes | Le design system reste dans le dépôt et peut être audité pour le responsive et l'accessibilité. |
| Conteneurs | Docker multi-stage et Compose v2 | Les images application/migration sont séparées ; le conteneur applicatif final fonctionne avec un utilisateur non-root. |
| Livraison | GitHub Actions et GHCR | Chaque image staging est identifiée par le SHA Git ; une release promeut le candidat déjà construit, puis génère un bundle et un manifeste. |
| Contrôle | Jest, Playwright, axe, Lighthouse | La publication est précédée de portes qualité unitaires, fonctionnelles, sécurité, accessibilité et performance. |

Les décisions détaillées d'architecture se trouvent dans [l'architecture du prototype](./05_ARCHITECTURE_PROTOTYPE_C221.md) et le protocole de livraison dans [la gestion des versions](./09_VERSIONS_DEPLOIEMENTS_C224.md).

## 4. Prérequis

### 4.1 Depuis les sources

- Linux, macOS ou Windows avec un environnement de terminal compatible ;
- Node.js `22.x` et npm `10+` ;
- Docker Engine 24+ avec Docker Compose v2 ;
- ports locaux `3000` et `3306` disponibles ;
- Git pour récupérer et versionner les sources.

Contrôler les versions :

```bash
node --version
npm --version
docker --version
docker compose version
```

### 4.2 Depuis une release

- Docker Engine 24+ et Docker Compose v2 ;
- accès en lecture aux images GHCR privées ou publiques de Spity ;
- `curl`, `jq`, `sha256sum`, `tar` et `openssl` ;
- nom DNS, certificat TLS et reverse proxy pour l'exposition publique ;
- stratégie de sauvegarde chiffrée hors du serveur.

## 5. Installation de développement

Depuis la racine du dépôt :

```bash
cd spity
cp .env.example .env.local
```

Remplacer les secrets d'exemple dans `.env.local`. Un secret JWT peut être généré avec :

```bash
openssl rand -base64 64
```

Démarrer MariaDB, installer exactement les dépendances verrouillées, appliquer les migrations puis lancer l'application :

```bash
docker compose --env-file .env.local up -d mariadb
npm ci
npm run db:migrate
npm run dev
```

Contrôler :

```bash
docker compose --env-file .env.local ps
curl --fail http://localhost:3000/api/health
```

L'application est accessible sur <http://localhost:3000>. Pour ouvrir phpMyAdmin localement :

```bash
docker compose --env-file .env.local --profile tools up -d
```

L'outil est alors disponible sur <http://localhost:8083> par défaut. Il ne fait pas partie de la production.

### 5.1 Données de démonstration

Après les migrations, charger le jeu de démonstration uniquement en local :

```bash
npm run db:seed
```

Le script réinitialise les lignes associées à ses comptes de démonstration. Il est donc interdit sur une base contenant de vraies données.

### 5.2 Arrêt local

```bash
docker compose --env-file .env.local down
```

Cette commande conserve le volume. Ne pas ajouter `--volumes` si les données doivent être conservées.

## 6. Déploiement d'une release en production

La release GitHub fournit une archive `spity-VERSION.tar.gz`, sa somme SHA-256, un manifeste, le Compose de production, un modèle d'environnement et une procédure autonome.

### 6.1 Vérifier et extraire le bundle

```bash
sha256sum --check spity-0.1.0.tar.gz.sha256
tar --extract --gzip --file spity-0.1.0.tar.gz
cd spity-0.1.0
```

Adapter la version. Le `release-manifest.json` doit contenir le tag, le SHA Git, les images et leurs digests attendus. En cas d'écart, interrompre le déploiement.

### 6.2 Créer la configuration secrète

```bash
cp .env.production.example .env.production
chmod 600 .env.production
```

Variables obligatoires :

| Variable | Usage | Règle |
| --- | --- | --- |
| `MARIADB_ROOT_PASSWORD` | administration et sauvegarde | Secret dédié, jamais commité. |
| `MARIADB_PASSWORD` | compte SQL applicatif | Secret différent du compte root. |
| `DATABASE_URL` | connexion de l'application et des migrations | Mot de passe applicatif encodé comme composant d'URL. |
| `JWT_SECRET` | signature des sessions | Au moins 64 octets aléatoires. |
| `SPITY_IMAGE` | image applicative | `ghcr.io/dorianyloj/spity`. |
| `SPITY_MIGRATION_IMAGE` | image des migrations | `ghcr.io/dorianyloj/spity-migrations`. |
| `IMAGE_TAG` | tag Docker immuable | Version stable, jamais `latest` seul. |
| `APP_VERSION` | version annoncée par `/api/health` | Identique à `package.json` et au tag sans `v`. |
| `APP_REVISION` | révision annoncée par `/api/health` | SHA Git complet du tag. |
| `APP_PORT` | port local derrière le proxy | `3000` par défaut. |

Valider la configuration sans afficher les valeurs dans un ticket ou un document partagé :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
```

### 6.3 Tirer les images et démarrer MariaDB

```bash
docker login ghcr.io
docker compose --env-file .env.production -f docker-compose.production.yml pull app migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d mariadb
docker compose --env-file .env.production -f docker-compose.production.yml ps mariadb
```

Attendre l'état `healthy`. Si MariaDB reste indisponible, consulter ses journaux et ne pas lancer la migration.

### 6.4 Sauvegarder

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec -T mariadb \
  sh -c 'exec mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"' \
  > "backup-before-$IMAGE_TAG.sql"
test -s "backup-before-$IMAGE_TAG.sql"
```

Le `sh -c` est volontaire : les variables sont évaluées à l'intérieur du conteneur, où Compose les a injectées. Chiffrer et transférer la sauvegarde sur un support distinct avant de poursuivre.

### 6.5 Migrer et démarrer

```bash
docker compose --env-file .env.production -f docker-compose.production.yml \
  --profile migration run --rm --no-build migrate
docker compose --env-file .env.production -f docker-compose.production.yml \
  up -d --no-build app
```

Un échec de migration bloque la promotion. Ne pas contourner cette étape et ne pas exécuter `db:push` en production.

### 6.6 Contrôler la version

```bash
health="$(curl --fail --silent http://127.0.0.1:3000/api/health)"
printf '%s\n' "$health" | jq .
printf '%s\n' "$health" | jq --exit-status \
  --arg version "$APP_VERSION" \
  --arg revision "$APP_REVISION" \
  '.status == "ok" and .version == $version and .revision == $revision'
docker compose --env-file .env.production -f docker-compose.production.yml ps
```

Le contrôle fonctionnel public porte ensuite sur l'accueil, la connexion, le profil, les lieux, le matching et les événements. La promotion ne peut être déclarée réussie qu'après validation de l'URL HTTPS et du certificat.

## 7. Reverse proxy et sécurité d'exposition

Le reverse proxy doit :

- terminer TLS avec un certificat valide ;
- rediriger HTTP vers HTTPS ;
- transmettre `Host`, `X-Forwarded-For` et `X-Forwarded-Proto` ;
- appliquer une limite de taille et des délais adaptés ;
- ne jamais exposer MariaDB ni le port Docker interne ;
- conserver les en-têtes de sécurité émis par Next.js.

Le conteneur applicatif est déjà lié à `127.0.0.1`. Une modification vers `0.0.0.0` doit faire l'objet d'une revue de sécurité.

## 8. Exploitation et supervision

```bash
# Santé et état
curl --fail --silent http://127.0.0.1:3000/api/health | jq .
docker compose --env-file .env.production -f docker-compose.production.yml ps

# Journaux
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=200 app
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=200 mariadb

# Redémarrage applicatif
docker compose --env-file .env.production -f docker-compose.production.yml restart app
```

Une supervision externe doit au minimum vérifier la disponibilité HTTPS et `/api/health`. Ne jamais consigner les cookies, le JWT, `DATABASE_URL` ou les mots de passe dans les preuves d'incident.

## 9. Retour arrière et restauration

Le premier choix est un retour arrière applicatif : remettre le tag, la version et le SHA précédents dans `.env.production`, puis tirer et relancer `app`. Cette opération évite de toucher aux données si les migrations restent rétrocompatibles.

```bash
docker compose --env-file .env.production -f docker-compose.production.yml pull app
docker compose --env-file .env.production -f docker-compose.production.yml up -d --no-build app
```

Restaurer la base uniquement si l'ancienne application ne peut pas exploiter le schéma migré, avec validation du responsable et acceptation de la perte des écritures postérieures à la sauvegarde :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml stop app
cat "backup-before-VERSION.sql" | \
  docker compose --env-file .env.production -f docker-compose.production.yml exec -T mariadb \
  sh -c 'exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"'
docker compose --env-file .env.production -f docker-compose.production.yml up -d --no-build app
```

Après retour arrière, contrôler la santé, rejouer les parcours critiques et inscrire l'incident dans le [plan de correction](./11_PLAN_CORRECTION_BOGUES_C232.md).

## 10. Diagnostic

| Situation | Preuve à relever | Décision |
| --- | --- | --- |
| MariaDB `unhealthy` | `ps mariadb`, `logs mariadb`, espace disque | Corriger l'infrastructure sans supprimer le volume. |
| Migration en erreur | sortie du service `migrate`, migration concernée | Bloquer la nouvelle version ; corriger par une nouvelle migration. |
| Application en redémarrage | `logs app`, `DATABASE_URL`, santé MariaDB | Corriger la configuration ou revenir à l'image précédente. |
| Santé OK mais version fausse | JSON de santé, manifeste et `.env.production` | Interrompre la promotion ; redéployer le tag attendu. |
| Échec uniquement via HTTPS | certificat et journaux du proxy | Maintenir l'application locale et corriger le proxy. |

## 11. Checklist de déploiement

- [ ] Bundle et somme SHA-256 vérifiés.
- [ ] Tag, SHA et digests comparés au manifeste.
- [ ] Secrets propres à l'environnement et fichier protégé.
- [ ] Configuration Compose valide.
- [ ] MariaDB saine et sauvegarde non vide externalisée.
- [ ] Migration ponctuelle terminée avec succès.
- [ ] Application saine avec version et révision exactes.
- [ ] HTTPS, certificat et parcours critiques vérifiés.
- [ ] Résultat, opérateur, heure et éventuel incident consignés.

## 12. Preuves reproductibles

La configuration d'environnement et les contrôles qualité sont décrits dans [C2.1.1](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md). La chaîne distante, les images immuables et la release `v0.1.0` sont tracées dans [C2.2.4](./09_VERSIONS_DEPLOIEMENTS_C224.md). La procédure courte réellement embarquée avec la release est [`spity/DEPLOYMENT.md`](../../spity/DEPLOYMENT.md).

### Relevé de vérification du 20 juillet 2026

| Contrôle exécuté | Résultat |
| --- | --- |
| Résolution des liens relatifs des six documents d'exploitation | Conforme, aucun lien local manquant. |
| `docker compose --env-file .env.example -f docker-compose.yml config --quiet` | Succès. |
| `docker compose --env-file .env.production.example -f docker-compose.production.yml config --quiet` | Succès. |
| Sauvegarde avec `mariadb-dump` et variables évaluées dans le conteneur | Succès, fichier SQL non vide de 33 005 octets sur la base locale de démonstration. |
| `npm run release:verify -- v0.1.0` | Succès, tag et version `0.1.0` concordants. |
| `GET /api/health` sur l'application locale | HTTP réussi, `status` égal à `ok`, version `0.1.0`. |

Les secrets et le contenu de la sauvegarde ne sont pas intégrés au dépôt. La restauration, destructive par nature, est documentée mais n'a pas été exécutée sur la base de travail.
