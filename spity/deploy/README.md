# Production Spity

## Fonctionnement

Un push sur `main` déclenche les tests (qualité, MariaDB, accessibilité, performance et parcours utilisateur). Quand ils réussissent, **Deploy production VPS** construit les deux images du commit testé, exécute un démarrage de contrôle avec une base isolée, puis publie les images sur GHCR. La production utilise leurs **digests SHA-256**, pas une étiquette mutable `latest`.

Le workflow ne traite que les événements `push` de `main` de ce dépôt. Une pull request, un fork, un test en échec ou la relance d'une vieille CI ne peut pas lancer ce déploiement. Les mises à jour sont sérialisées ; un nouveau push n'interrompt pas une migration en cours. Si plusieurs commits attendent, les versions déjà supplantées sont ignorées.

Sur le VPS, le récepteur verrouille le déploiement puis :

1. Vérifie la base, son volume existant et l'application actuellement saine.
2. Enregistre la configuration précédente et son image exacte pour le retour arrière.
3. Télécharge les images vérifiées, avec une authentification GHCR temporaire.
4. Sauvegarde la base avant migration (`mariadb-dump --single-transaction`, fichier privé et SHA-256).
5. Exécute les migrations sans données de démonstration.
6. Remplace uniquement le conteneur applicatif, sans recréer MariaDB.
7. Vérifie la santé, la version et le commit en local et en HTTPS public.

Si le remplacement ou la vérification échoue, il tente de redémarrer **l'image précédente de l'application** et signale l'échec dans GitHub. Il ne restaure jamais automatiquement la base : une migration SQL peut être partiellement appliquée ou incompatible avec l'ancienne version. Les migrations doivent donc rester rétrocompatibles (ajout avant suppression). Une restauration nécessite une décision humaine pour éviter de perdre les écritures récentes.

Une courte indisponibilité est possible pendant le remplacement du conteneur : ce n'est pas un déploiement sans interruption.

## Organisation du VPS

```text
/opt/spity/
  repo/                         ancien checkout conservé, non modifié par le CD
    spity/.env.production       secrets existants, permissions 600
  automation/
    receive.sh                  commande autorisée à la clé Actions
    production.json             chemins et URL, sans secrets
  releases/<date>-<commit>/     Compose, images, manifeste et résultat du déploiement
    rollback.compose.json       configuration résolue privée : contient des secrets
  backups/                      sauvegardes SQL privées avant migration
  incoming/                     transfert et jeton GHCR temporaires, effacés à la fin
  current.json                  dernier déploiement réussi
  deploy.lock                   verrou côté serveur
```

Le projet Docker reste `spity-production`. Le volume existant `spity-production_mariadb_production_data` est obligatoire : s'il manque, le déploiement refuse de créer une base vide. Les images envoyées sont conservées dans `spity-production_media_production_data`, indépendamment des versions applicatives. Aucun `down -v`, nettoyage Docker global, effacement de volume ou `db:seed` n'est exécuté.

L'application reste sur `127.0.0.1:3100`, derrière le nginx/HTTPS existant. Les autres applications du VPS ne sont pas modifiées. Les builds et les tests s'effectuent sur les runners GitHub, pas sur le VPS.

## Configuration initiale

Prérequis : l'installation Spity existante dans `/opt/spity`, Docker avec Compose v2+, Node.js 22+ (scripts système sans dépendance npm), `bash`, `tar` et `flock`. L'utilisateur `ubuntu` doit déjà pouvoir utiliser Docker. Ne pas utiliser cette procédure pour initialiser une base de production vide.

Dans l'environnement GitHub **production**, configurer :

| Type | Nom | Valeur |
| --- | --- | --- |
| Variable | `VPS_HOST` | adresse ou nom du VPS |
| Variable | `VPS_PORT` | port SSH |
| Variable | `VPS_USER` | `ubuntu` |
| Secret | `VPS_SSH_KEY` | clé privée Ed25519 dédiée, sans phrase secrète |
| Secret | `VPS_KNOWN_HOSTS` | clé publique **vérifiée** du serveur, avec `[hôte]:port` |

La clé privée ne doit jamais être commitée, collée dans une issue ou affichée dans les journaux. Générer une paire dédiée portant le commentaire `spity-github-actions`, enregistrer la clé privée dans le secret GitHub, puis transférer uniquement sa partie publique `actions.pub` sur le serveur, avec `receive.sh`, `production.json.example` et `install-receiver.sh`.

Vérifier les chemins/URL dans `production.json.example`, puis exécuter une fois, via l'accès SSH administrateur existant :

```bash
bash /chemin/du/transfert/install-receiver.sh /chemin/du/transfert
```

L'installateur refuse d'écraser un récepteur existant. Il sauvegarde `authorized_keys` avant d'y ajouter une entrée `restrict,command="/opt/spity/automation/receive.sh"`. La clé Actions ne peut lancer que `deploy`, sans terminal ni transfert de port. Cela réduit son usage, mais ne constitue pas une isolation forte : l'exécution de code de déploiement avec accès Docker reste privilégiée. Protéger les accès au dépôt et aux secrets GitHub.

La clé d'hôte doit provenir de l'accès SSH déjà vérifié ou d'une empreinte confirmée avec l'administrateur, jamais d'un `ssh-keyscan` aveuglément accepté pendant chaque déploiement. Ne pas désactiver `StrictHostKeyChecking`.

Il n'est pas nécessaire de conserver un PAT GHCR sur le VPS : le `GITHUB_TOKEN` du job, limité à `packages:read`, voyage dans le transfert SSH privé. Sa copie et la configuration Docker temporaire sont supprimées après le déploiement. Le fichier `.env.production` ne quitte jamais le VPS. Pour une production sans validation manuelle à chaque push, ne pas ajouter de reviewer obligatoire à l'environnement GitHub.

## Contrôles et reprise

- GitHub Actions : **Continuous integration**, puis **Deploy production VPS**. La dernière étape contrôle l'URL publique depuis l'extérieur du VPS.
- VPS : consulter `current.json` et `releases/<version>/deployment.json`, sans publier `rollback.compose.json` ni le dump SQL.
- Santé : `curl --fail https://spity.fr/api/health` doit exposer le SHA du commit attendu.
- Si la CI échoue, corriger puis pousser un nouveau commit ; aucun déploiement de secours ne contourne les tests.
- Si la livraison échoue temporairement, relancer le workflow CD du commit courant. Si un commit plus récent existe déjà, corriger/relancer sa CI.
- Pour un retour arrière manuel, conserver le verrou et cibler le fichier exact du déploiement échoué :

```bash
flock /opt/spity/deploy.lock docker compose --project-name spity-production \
  -f /opt/spity/releases/<version>/rollback.compose.json \
  up --detach --no-deps --no-build --pull never app
```

Contrôler ensuite la santé et la compatibilité du schéma. Après un retour arrière manuel, `current.json` n'est pas réécrit automatiquement : le signaler dans le suivi d'incident. Ne jamais restaurer un dump sans sauvegarder l'état courant et faire valider la perte potentielle des écritures postérieures au dump.

Les sauvegardes et anciennes images restent conservées : surveiller l'espace disque et décider d'une rétention après vérification des restaurations. Ces sauvegardes locales **ne protègent pas d'une perte du VPS** ; une copie chiffrée hors serveur et des exercices de restauration restent nécessaires. Aucune purge automatique n'est installée.

## Vérification des scripts

```bash
cd spity
node --test tests/maintenance/deploy-vps.test.mjs
bash -n deploy/receive.sh deploy/install-receiver.sh
```

Les tests simulent Docker : ils vérifient l'ordre sauvegarde/migration, les digests, les contrôles de santé, les échecs et le retour arrière sans toucher une vraie base. Le workflow complète ces tests par un démarrage Docker/MariaDB isolé avant chaque livraison.

Références : [événement GitHub `workflow_run`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run), [concurrence GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency), [registre GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry), [configuration Compose](https://docs.docker.com/reference/compose-file/services/).
