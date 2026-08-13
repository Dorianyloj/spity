# Déployer une version de Spity

Cette procédure autonome est incluse dans chaque bundle de release. Elle déploie les images immuables de l'application et des migrations avec MariaDB. Le manuel détaillé et les choix techniques sont documentés dans [`../docs/bc02/12_MANUEL_DEPLOIEMENT_C241.md`](../docs/bc02/12_MANUEL_DEPLOIEMENT_C241.md) lorsque le dépôt complet est disponible.

## Prérequis

- Docker Engine 24 ou supérieur avec Docker Compose v2 ;
- Node.js 22 pour le contrôle de promotion fourni dans le bundle ;
- accès en lecture à `ghcr.io/dorianyloj/spity` et `ghcr.io/dorianyloj/spity-migrations` ;
- `curl` et `jq` pour contrôler la route de santé ;
- un fichier `.env.production` non versionné contenant des secrets propres à l'environnement ;
- un reverse proxy HTTPS devant le port local de l'application.

Le service applicatif écoute uniquement sur `127.0.0.1:${APP_PORT:-3000}` et MariaDB n'est pas publiée sur l'hôte. Le reverse proxy est le seul point d'entrée public attendu.

## 1. Vérifier le bundle

Depuis le dossier qui contient l'archive et son fichier `.sha256` :

```bash
sha256sum --check spity-0.1.0.tar.gz.sha256
tar --extract --gzip --file spity-0.1.0.tar.gz
cd spity-0.1.0
```

Adapter `0.1.0` à la version reçue. Comparer aussi `release-manifest.json` avec la release GitHub attendue : tag, version, révision et digests des deux images doivent correspondre.

## 2. Préparer l'environnement

```bash
cp .env.production.example .env.production
chmod 600 .env.production
```

Renseigner tous les secrets puis identifier exactement la release à déployer :

```dotenv
SPITY_IMAGE="ghcr.io/dorianyloj/spity"
SPITY_MIGRATION_IMAGE="ghcr.io/dorianyloj/spity-migrations"
IMAGE_TAG="0.1.0"
APP_VERSION="0.1.0"
APP_REVISION="SHA_GIT_COMPLET_DE_LA_RELEASE"
```

Générer les secrets sans les écrire dans l'historique du terminal partagé :

```bash
openssl rand -base64 48
openssl rand -base64 64
```

Utiliser des mots de passe différents pour `MARIADB_ROOT_PASSWORD`, `MARIADB_PASSWORD` et `JWT_SECRET`. Encoder dans `DATABASE_URL` les caractères réservés du mot de passe applicatif. Ne jamais utiliser uniquement `latest` comme référence de déploiement ou de retour arrière.

Valider la syntaxe Compose avant toute action :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
```

## 3. Sauvegarder et déployer

```bash
docker login ghcr.io
docker compose --env-file .env.production -f docker-compose.production.yml pull app migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d mariadb
```

Attendre que MariaDB soit saine :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps mariadb
```

Créer ensuite la sauvegarde. La commande `sh -c` évalue les secrets dans le conteneur MariaDB, sans dépendre des variables du shell hôte :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec -T mariadb \
  sh -c 'exec mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"' \
  > "backup-before-$IMAGE_TAG.sql"
test -s "backup-before-$IMAGE_TAG.sql"
```

Stocker cette sauvegarde sur un support chiffré distinct du serveur, puis exécuter la migration ponctuelle et démarrer l'application :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml \
  --profile migration run --rm migrate
docker compose --env-file .env.production -f docker-compose.production.yml \
  up -d --no-build app
```

## 4. Vérifier la promotion

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
DEPLOYMENT_ENVIRONMENT=production \
HEALTH_URL=http://127.0.0.1:3000/api/health \
EXPECTED_VERSION="$APP_VERSION" \
EXPECTED_REVISION="$APP_REVISION" \
HEALTH_OUTPUT_PATH=deployment-verification.json \
node scripts/verify-deployment.mjs
```

Le rapport `deployment-verification.json` doit indiquer `result: passed`. Une version ou une révision différente bloque la promotion : conserver les journaux, revenir au tag immuable précédent si nécessaire, puis consigner l'anomalie.

Vérifier ensuite via l'URL HTTPS publique :

1. ouverture de l'accueil et de la connexion ;
2. connexion avec un compte de contrôle non administrateur ;
3. consultation du profil et du répertoire des lieux ;
4. consultation du matching avec un compte grimpeur ;
5. consultation des événements avec un compte grimpeur puis un compte club.

N'ouvrir le trafic général qu'après ces contrôles. Ne jamais exécuter le script `db:seed` en production.

## 5. Instance isolée de démonstration jury

Cette étape est réservée à une instance éphémère identifiée comme environnement de démonstration. Elle ne doit jamais être exécutée sur une base contenant des comptes ou des contenus réels.

Renseigner l'URL publique dans le fichier d'environnement :

```dotenv
NEXT_PUBLIC_APP_URL="https://spity.fr"
```

Après les migrations et avant d'ouvrir l'accès au jury, charger le jeu de données déterministe :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml \
  --profile demo run --rm seed-demo
```

Le script ne manipule que les identifiants et adresses réservés à la démonstration. Il peut être rejoué pour réinitialiser ces données sans supprimer le volume MariaDB.

## 6. Exploitation courante

```bash
# État des services
docker compose --env-file .env.production -f docker-compose.production.yml ps

# Journaux applicatifs récents
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=200 app

# Journaux MariaDB récents
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=200 mariadb

# Redémarrage applicatif sans toucher à la base
docker compose --env-file .env.production -f docker-compose.production.yml restart app

# Arrêt applicatif en conservant les données
docker compose --env-file .env.production -f docker-compose.production.yml stop app
```

Ne pas utiliser `down --volumes` : cette option supprime le volume de données.

## 7. Revenir à la version précédente

1. Conserver les journaux et noter l'heure, la version, le symptôme et l'impact.
2. Remettre dans `.env.production` les valeurs `IMAGE_TAG`, `APP_VERSION` et `APP_REVISION` de la dernière release validée.
3. Tirer puis redémarrer uniquement l'image applicative :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml pull app
docker compose --env-file .env.production -f docker-compose.production.yml up -d --no-build app
```

4. Rejouer les contrôles de santé et les parcours critiques.
5. Restaurer la base uniquement si la migration est incompatible avec l'ancienne application et après validation explicite du responsable de déploiement.

Pour restaurer la sauvegarde validée :

```bash
docker compose --env-file .env.production -f docker-compose.production.yml stop app
cat "backup-before-VERSION.sql" | \
  docker compose --env-file .env.production -f docker-compose.production.yml exec -T mariadb \
  sh -c 'exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"'
docker compose --env-file .env.production -f docker-compose.production.yml up -d --no-build app
```

La restauration écrase l'état courant de la base : vérifier le fichier, sa date et son intégrité avant exécution. Les migrations destructives doivent être séparées en plusieurs releases afin que l'ancienne version applicative reste exploitable pendant la période de retour arrière.

## 8. Diagnostic rapide

| Symptôme | Contrôle | Action sûre |
| --- | --- | --- |
| MariaDB reste `unhealthy` | `logs mariadb` et espace disque | Corriger la cause sans supprimer le volume, puis redémarrer MariaDB. |
| La migration échoue | journaux du conteneur `migrate` | Ne pas démarrer la nouvelle application ; corriger la migration ou revenir au candidat précédent. |
| `/api/health` ne répond pas | `ps`, `logs app`, cohérence de `DATABASE_URL` | Conserver les preuves, corriger la configuration ou revenir à l'image précédente. |
| Version ou révision inattendue | variables `.env.production` et manifeste | Stopper la promotion et redéployer le tag immuable attendu. |
| Erreur HTTPS seulement | journaux et configuration du reverse proxy | Conserver l'application liée à localhost et corriger le proxy ou le certificat. |

Après tout incident, compléter le registre d'anomalies avec la cause, la décision de retour arrière et le résultat du retest.
