# Gestion des versions et déploiements progressifs - C2.2.4

## 1. Objectif et critères couverts

Ce document décrit la réponse de Spity à la compétence C2.2.4 : déployer chaque modification validée de façon progressive, vérifier sa fiabilité fonctionnelle et technique, tracer les évolutions et conserver une dernière version manipulable.

La grille d'évaluation attend :

- l'historique des différentes versions ;
- la dernière version fonctionnelle, fiable et viable ;
- un système de gestion de versions effectivement utilisé ;
- la traçabilité des évolutions du prototype ;
- un logiciel qu'un utilisateur peut manipuler en autonomie.

## 2. Convention de version

Spity utilise Semantic Versioning sous la forme `MAJEURE.MINEURE.CORRECTIF` :

| Élément | Incrément | Exemple |
| --- | --- | --- |
| `MAJEURE` | Rupture de compatibilité ou migration non rétrocompatible | `1.0.0` vers `2.0.0` |
| `MINEURE` | Nouvelle fonctionnalité compatible | `0.1.0` vers `0.2.0` |
| `CORRECTIF` | Correction compatible sans nouvelle capacité métier | `0.1.0` vers `0.1.1` |

Tant que le périmètre MVP n'est pas stabilisé en production, la version majeure reste `0`. La source de vérité est `spity/package.json`. Une release stable exige simultanément :

1. une version stable dans `package.json` ;
2. une entrée datée correspondante dans [`CHANGELOG.md`](../../CHANGELOG.md) ;
3. un tag Git annoté `v<version>` sur le commit validé ;
4. une GitHub Release portant le même tag ;
5. deux images OCI applicative et migration portant la version, le SHA et un digest immuable.

Le script `npm run release:verify -- vX.Y.Z` bloque la publication si le tag, `package.json` et le changelog divergent.

## 3. Identifiants et traçabilité

| Identifiant | Rôle | Immutabilité |
| --- | --- | --- |
| Commit Git | Modification élémentaire et auteur | Immuable par SHA |
| Tag `vX.Y.Z` | Point de version stable | Immuable après publication |
| Entrée `CHANGELOG.md` | Évolutions utiles au lecteur | Versionnée dans Git |
| Image `sha-<SHA>` | Résultat déployé automatiquement sur staging | Immuable |
| Image `<X.Y.Z>` | Version promue en production | Immuable par convention |
| Digest `sha256:...` | Preuve binaire de l'image exacte | Immuable par définition |
| Tag `staging` | Dernier commit `develop` validé | Mobile |
| Tag `latest` | Dernière release stable | Mobile, jamais utilisé seul pour un rollback |

La route `GET /api/health` retourne `status`, `version` et `revision`. Elle permet donc de vérifier qu'une instance exécute bien le binaire attendu, en plus de tester sa connexion MariaDB.

## 4. Déploiement continu vers staging

Le job `Deploy verified staging images` de [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) s'exécute après le succès des trois jobs CI sur chaque push `develop` :

1. construction des images `runner` et `migration` à partir du SHA contrôlé ;
2. injection de la version et du SHA dans l'image applicative ;
3. démarrage d'une MariaDB isolée ;
4. application des migrations avec l'image dédiée ;
5. démarrage de l'image applicative sous l'utilisateur non privilégié `nextjs` ;
6. smoke test de `/api/health` avec égalité stricte de la version et du SHA ;
7. publication des tags immuables `sha-<SHA>` et mobiles `staging` sur GHCR ;
8. conservation pendant 30 jours du JSON de santé et des inspections OCI ;
9. enregistrement du job dans l'environnement GitHub `staging`.

Un échec dans les tests, la migration, le démarrage, le contrat de santé ou la publication empêche le déploiement staging.

## 5. Promotion d'une release stable

Le workflow [`.github/workflows/release.yml`](../../.github/workflows/release.yml) est déclenché par un tag `vX.Y.Z` et comporte trois niveaux :

| Niveau | Contrôles | Résultat |
| --- | --- | --- |
| Validation | Cohérence de version, qualité, couverture, audit, build, MariaDB, accessibilité et Lighthouse | Candidat accepté ou publication bloquée |
| Staging de release | Récupération obligatoire des images `sha-<SHA>` déjà déployées, nouvelle migration et smoke test | Tags `candidate-X.Y.Z` sur les mêmes images |
| Production | Promotion des mêmes digests, bundle, somme SHA-256 et GitHub Release | Tags `X.Y.Z` et `latest`, release téléchargeable |

Aucune image n'est reconstruite entre le déploiement continu staging et la promotion stable. La seule opération autorisée est l'ajout de tags au digest déjà vérifié.

Le bundle de release contient :

- `docker-compose.production.yml` ;
- `.env.production.example` sans secret ;
- `DEPLOYMENT.md` ;
- `CHANGELOG.md` ;
- `release-manifest.json` avec version, tag, SHA, images et digests ;
- une somme SHA-256 du fichier compressé.

## 6. Contrôles de fiabilité

| Axe | Contrôle bloquant | Preuve |
| --- | --- | --- |
| Structure | ESLint et TypeScript sans erreur | Job de validation |
| Régression | 100 % des tests et seuils de couverture atteints | Rapport de couverture |
| Données | Migrations sur MariaDB vide et parcours HTTP réels | Résultats TAP |
| Sécurité | Aucune vulnérabilité de production haute ou critique | Journal npm audit |
| Accessibilité | Audit public et authentifié sans violation détectée | Rapports Lighthouse et axe |
| Performance | Seuils Lighthouse du projet respectés | Rapports JSON |
| Exploitation | Conteneurs réels, migration, healthcheck et métadonnées exactes | JSON de santé et inspections OCI |
| Intégrité | Même digest entre staging, candidat et production | `release-manifest.json` |

## 7. Historique et dernière version

L'historique fonctionnel lisible est tenu dans [`CHANGELOG.md`](../../CHANGELOG.md). L'historique exhaustif reste disponible dans Git avec l'auteur, la date, le message conventionnel et le SHA de chaque modification.

| Version | Date | SHA | État | Preuves |
| --- | --- | --- | --- | --- |
| `0.1.0` | 20 juillet 2026 | À renseigner après promotion | Candidate MVP BC02 | CI, staging, release et manifeste à renseigner |

La version `0.1.0` couvre les parcours inscription, connexion, profil, lieux, matching, partenariats et événements. Le prototype peut être démarré localement avec Docker ou depuis ses images de release en suivant [`spity/DEPLOYMENT.md`](../../spity/DEPLOYMENT.md).

## 8. Retour arrière

Le retour arrière utilise le tag de version précédent ou, de préférence, son digest enregistré dans le manifeste :

1. suspendre la promotion et conserver les journaux ;
2. rétablir `IMAGE_TAG`, `APP_VERSION` et `APP_REVISION` de la dernière version fiable ;
3. redémarrer l'image sans reconstruction ;
4. vérifier la route de santé et les parcours critiques ;
5. restaurer la sauvegarde seulement si la migration n'est pas rétrocompatible ;
6. ouvrir une anomalie et rejouer tout le pipeline après correction.

Les suppressions de colonnes ou de données sont différées afin de conserver une fenêtre de compatibilité avec la version précédente.

## 9. Retours utilisateurs

Les contrôles automatisés prouvent la stabilité technique mais ne remplacent pas l'observation d'utilisateurs. Une session pilote doit réunir au moins trois profils : un grimpeur cherchant un partenaire, un grimpeur organisant une sortie et un représentant de club.

Chaque participant exécute sans assistance les tâches suivantes :

1. créer un compte et compléter son profil ;
2. trouver un partenaire compatible et envoyer une invitation ;
3. accepter une relation avec un second compte ;
4. créer un événement puis s'y inscrire ;
5. retrouver la version utilisée dans la réponse de santé fournie par l'opérateur.

| Champ collecté | Contenu attendu |
| --- | --- |
| Session | Date, version, SHA et environnement |
| Profil | Rôle utile au test, sans donnée personnelle inutile |
| Tâche | Réussie sans aide, réussie avec aide ou échouée |
| Mesure | Durée, erreur rencontrée et étape de blocage |
| Retour | Commentaire reformulé et niveau de sévérité |
| Décision | Accepté, correction planifiée ou hors périmètre justifié |

Aucun retour réel n'est inventé dans ce dossier. Cette preuve restera indiquée comme manquante jusqu'à l'exécution documentée d'une session avec des participants distincts du développeur.

## 10. État de couverture C2.2.4

| Critère | Réalisation | État |
| --- | --- | --- |
| Système de gestion de versions | Git, SemVer, tags, changelog et validateur | Réalisé |
| Évolutions tracées | Commits conventionnels et changelog `0.1.0` | Réalisé |
| Déploiement progressif | CI vers staging puis promotion des mêmes digests | Réalisé techniquement, preuve distante à ajouter |
| Dernière version fiable | Release `v0.1.0` avec bundle et manifeste | À publier après validation distante |
| Manipulation autonome | Compose et guide de déploiement versionné | Réalisé techniquement |
| Performance auprès des utilisateurs | Protocole défini | Session pilote réelle à organiser |
