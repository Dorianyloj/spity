# Vérification de promotion

## Objectif

Une image ne peut être considérée comme promue que si son endpoint `/api/health` expose exactement la version et la révision Git attendues. Ce contrôle traite le risque de dérive relevé dans `SPITY-INC-2026-0002` : un service disponible mais exécutant un binaire différent de la référence validée.

La vérification ne déclenche aucun déploiement et ne donne aucune autorisation de production. Elle transforme une promotion déjà demandée en résultat vérifiable : `passed` ou `failed`.

## Contrat exécutable

`scripts/verify-deployment.mjs` appelle le contrat de santé partagé et exige :

- `HEALTH_URL` : URL HTTP(S) du candidat déjà démarré ;
- `EXPECTED_VERSION` : version de l'artefact attendu ;
- `EXPECTED_REVISION` : SHA Git complet de l'artefact attendu ;
- `DEPLOYMENT_ENVIRONMENT` : environnement déclaré (`staging`, `production` ou `exercise`) ;
- `HEALTH_OUTPUT_PATH` : chemin facultatif du rapport JSON.

Une version ou une révision différente est classée `S3/deployment-verification`, produit un rapport et fait échouer la commande. Une indisponibilité applicative reste classée selon la politique de supervision existante.

## Utilisation contrôlée

Après le démarrage du candidat et avant l'ouverture du trafic :

```bash
DEPLOYMENT_ENVIRONMENT=staging \
HEALTH_URL=http://127.0.0.1:3000/api/health \
EXPECTED_VERSION=0.1.1 \
EXPECTED_REVISION=SHA_GIT_COMPLET \
HEALTH_OUTPUT_PATH=deployment-verification.json \
npm run deployment:verify
```

Le rapport ne contient que la version, la révision, le résultat de santé et les seuils. Il exclut les secrets de déploiement, les données utilisateurs et les valeurs de `.env.production`.

## Intégration CI/CD

- le pipeline `Continuous integration` exécute le contrôle après le smoke test d'une image de staging et avant son arrêt/publication ;
- le pipeline `Release` exécute le même contrôle sur l'image candidate taguée avant sa promotion stable ;
- l'artefact `staging-*` ou `release-staging-*` conserve `deployment-verification.json` pendant la durée définie par le workflow ;
- le bundle de release embarque les deux scripts nécessaires au contrôle post-promotion.

## Exercice reproductible

```bash
npm run bloc4:deployment-exercise
```

Cet exercice n'utilise qu'un serveur HTTP local en mémoire. Il prouve qu'un candidat conforme passe et que deux candidats volontairement incohérents (version puis révision) sont refusés, sans Docker, LXC, base de données ni appel de production.
