# Déployer une version de Spity

## Prérequis

- Docker Engine 24 ou supérieur avec Docker Compose v2 ;
- accès en lecture aux images `ghcr.io/dorianyloj/spity` et `ghcr.io/dorianyloj/spity-migrations` ;
- un fichier `.env.production` non versionné contenant des secrets propres à l'environnement ;
- un reverse proxy HTTPS devant le port local de l'application.

## Préparer l'environnement

```bash
cp .env.production.example .env.production
```

Renseigner tous les secrets puis identifier exactement la release à déployer :

```dotenv
SPITY_IMAGE="ghcr.io/dorianyloj/spity"
SPITY_MIGRATION_IMAGE="ghcr.io/dorianyloj/spity-migrations"
IMAGE_TAG="0.1.0"
APP_VERSION="0.1.0"
APP_REVISION="SHA_GIT_COMPLET_DE_LA_RELEASE"
```

Ne jamais utiliser uniquement `latest` comme référence de déploiement ou de retour arrière.

## Sauvegarder et déployer

Depuis le dossier `spity/` :

```bash
docker login ghcr.io
docker compose --env-file .env.production -f docker-compose.production.yml pull app migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d mariadb
docker compose --env-file .env.production -f docker-compose.production.yml exec -T mariadb \
  mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" > "backup-before-$IMAGE_TAG.sql"
docker compose --env-file .env.production -f docker-compose.production.yml \
  --profile migration run --rm --no-build migrate
docker compose --env-file .env.production -f docker-compose.production.yml \
  up -d --no-build app
```

La sauvegarde doit être stockée sur un support chiffré distinct du serveur.

## Vérifier la promotion

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
curl --fail --silent http://127.0.0.1:3000/api/health
```

La réponse doit contenir `status: ok`, la version demandée et le SHA de la release. Vérifier ensuite les parcours inscription, connexion, profil, matching et événements avant d'ouvrir le trafic à tous les utilisateurs.

## Revenir à la version précédente

1. Remettre dans `.env.production` les valeurs `IMAGE_TAG`, `APP_VERSION` et `APP_REVISION` de la dernière release validée.
2. Tirer puis redémarrer cette image avec `pull app` et `up -d --no-build app`.
3. Vérifier la route de santé et les parcours critiques.
4. Restaurer la sauvegarde uniquement si la migration appliquée n'est pas rétrocompatible.
5. Enregistrer l'incident, sa cause et les résultats du nouveau test dans le registre d'anomalies.

Les migrations destructives doivent être séparées en plusieurs releases afin que l'ancienne version applicative reste exploitable pendant la période de retour arrière.
