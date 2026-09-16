# Rapprochement du code et du backlog Linear — 16 septembre 2026

## État de cette intervention

**Corrections préparées, non appliquées dans Linear : intégration à installer et
compte à connecter dans la session.** Les statuts ci-dessous proviennent de
l'observation du 14 septembre ; ils ne constituent pas une lecture du tableau
actuel. Relire les descriptions et les critères actuels avant toute modification.

Code examiné : `a805162`, arbre applicatif
`587dcb012c325fa7a4225dafa8066edae0affcfa`. La preuve de déploiement du
15 septembre identifie la production `872db197b3e6bf3d053b698829c41674ae42a836`,
qui contient le même arbre applicatif. Aucun déploiement n'est réalisé ici.

Sources : [tableau Linear](https://linear.app/spitywa/team/SPI/all),
[observation du 14 septembre](../rncp/bloc-03/donnees/linear-2026-09-14.json),
[synchronisation du 9 septembre](2026-09-09-synchronisation-linear.md),
[preuve de production](../rncp/bloc-03/preuves/production-2026-09-15.json).

## Authentification : la connexion est livrée

SPI-6 est encore `Todo` dans l'observation, alors que l'inscription, la connexion
grimpeur/club, les JWT signés, les cookies sécurisés et la protection des routes
sont implémentés. La déconnexion efface le cookie. Le serveur refuse aussi les
sessions d'un compte suspendu et celles dont la version a été révoquée ; la
modération d'un compte incrémente cette version.

Le renouvellement et la rotation des jetons restent absents. La déconnexion
n'invalide pas le jeton côté serveur. Il faut donc séparer ces suites du périmètre
« connexion/inscription » déjà livré, conserver leur traçabilité dans un ticket
lié, puis clore SPI-6 si ses critères actuels correspondent au socle livré.
Sans cette séparation, le ticket global reste partiellement réalisé.

Preuves : `spity/src/features/auth/lib/session.ts`, `current-user.ts` et
`current-user.test.ts` ; routes `spity/src/app/api/auth/` ;
`spity/src/features/admin/lib/repository.ts`.

## Corrections à rapprocher des critères actuels

| Ticket | Statut observé le 14/09 | Réalisation vérifiée dans le code et correction proposée |
| --- | --- | --- |
| SPI-6 | Todo | Authentification livrée ; clôturer le socle après séparation des suites de gestion des sessions ci-dessus. |
| SPI-11 | Todo | Édition du profil, disciplines, niveaux, matériel et avatar avec upload présents. L'ancien blocage sur l'avatar est levé ; candidat à Done après lecture des critères actuels. |
| SPI-12 | Backlog | Profil club de base livré. Coachs et circuit de validation/affiliation restent à réaliser ; conserver ce reste dans le backlog. |
| SPI-15 | Todo | Création de publications avec texte, cotation et image livrée. Modification/suppression par l'auteur et saisie des tags contextuels restent absentes : périmètre partiellement réalisé. |
| SPI-16 | Backlog | Likes et commentaires simples livrés, avec modification/suppression des commentaires. Réponses imbriquées et actualisation automatique restent à réaliser ; séparer le socle livré de ces suites si les critères les regroupent encore. |
| SPI-17 | Backlog | Feed persistant livré. Pagination du feed, suivi/personnalisation et événements épinglés restent à réaliser. La pagination du profil ne remplit pas le critère du feed. |
| SPI-18 | Todo | Formulaire et publication avec image livrés. Vérifier le critère d'aperçu avant publication : le formulaire actuel ne montre pas de prévisualisation de l'image sélectionnée. Clore uniquement le périmètre réellement livré. |
| SPI-19 | Backlog | Modèles et coordonnées salles/falaises livrés. Géolocalisation des clubs et recherche spatiale restent distinctes ; séparer ces suites avant de clore le socle. |
| SPI-21 | Backlog | Carte Leaflet interactive salles/falaises avec regroupement des marqueurs livrée. Les clubs ne sont pas représentés : périmètre partiellement réalisé. |
| SPI-22 | Backlog | Ajout de voies, signalements, partage de liens et PDF de topos livrés. Modération des demandes de lieux présente ; ne pas l'assimiler à une modération complète des voies et votes. Le vote de consensus reste à réaliser. |
| SPI-24 | Backlog | Gestion opérationnelle et compteurs disponibles. Les statistiques historiques/agrégées restent un périmètre distinct du tableau de bord livré dans SPI-26. |
| SPI-27 | In Progress | Upload authentifié, contrôle de taille et de signature, réencodage WebP sans EXIF, contrôle de propriété et stockage privé présents. Volume persistant configuré et workflow de déploiement présents ; candidat à clôture après vérification des critères actuels et de la preuve de montage/migration demandée par le ticket. |

Les tickets déjà `Done` dans l'observation sont SPI-7, SPI-8, SPI-9, SPI-10,
SPI-13, SPI-14, SPI-20, SPI-23, SPI-25, SPI-26, SPI-28 et SPI-29.
Aucune réouverture n'est proposée dans ce rapprochement. SPI-5 reste annulé
(Prisma remplacé par Drizzle). Le socle sécurité/accessibilité de SPI-29
ne vaut pas certification RGAA exhaustive.

## Principales preuves complémentaires

- Profils et publications : `spity/src/features/profile/lib/workspace-repository.ts`,
  `profile-repository.ts`, `spity/src/features/profile/components/profile-posts.tsx`,
  `spity/src/app/api/posts/route.ts` et `spity/src/app/api/profile/club/route.ts`.
- Likes, commentaires et feed : `spity/src/features/feed/lib/feed-repository.ts`.
- Carte et contributions : `spity/src/features/places/components/places-map.tsx`,
  `spity/src/features/places/lib/request-repository.ts` et `spity/src/db/schema.ts`.
- Médias : `spity/src/features/media/lib/image-upload.ts`, `storage.ts`,
  `member-media.ts`, `spity/src/app/api/media/route.ts`,
  `spity/docker-compose.production.yml` et `.github/workflows/deploy-production.yml`.

Les fichiers de preuve datés et le graphique du diaporama restent fondés sur
l'observation du 14 septembre. Aucun nouveau total de tickets terminés n'est
annoncé avant lecture, mise à jour et vérification du tableau connecté.

## Vérifications exécutées le 16 septembre

Depuis `spity/`, avec Node 22.23.2 : `npm run lint`, `npm run typecheck` et
`npm test -- --runInBand` réussis (73 suites, 404 tests). Ces contrôles ne
constituent pas une nouvelle recette fonctionnelle en production.
