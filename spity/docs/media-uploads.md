# Imports d’images privés

Ce service fournit le socle de SPI-27. Il ne modifie pas encore les formulaires
d’avatar (SPI-11) et de publication (SPI-18), et ne rend pas un fichier public.

## Contrat HTTP

Les trois opérations exigent la session du propriétaire. Les mutations réutilisent
le contrôle d’origine de l’application.

| Méthode et chemin | Comportement |
| --- | --- |
| `POST /api/media` | `multipart/form-data` contenant exactement un champ `file` ; réponse `201` avec `{ media: { id, url, mimeType, byteSize, width, height, visibility } }`. |
| `GET /api/media/:id` | Retourne le WebP au propriétaire, sans cache partagé. Un objet absent ou appartenant à un autre compte renvoie `404`. |
| `DELETE /api/media/:id` | Efface le fichier et ses métadonnées ; réponse `204`. La suppression d’un objet absent renvoie `404`. |

Une session absente renvoie `401`, une origine interdite `403`, un corps trop gros
`413`, un format non accepté `415`, un fichier invalide `422`, un quota atteint
`409`, trop de tentatives `429` avec `Retry-After`, et une panne de stockage `503`
sans divulguer de chemin ni d’erreur SQL.

Exemple côté navigateur déjà connecté :

```ts
const form = new FormData()
form.append('file', selectedFile)
const response = await fetch('/api/media', { method: 'POST', body: form })
const result = await response.json()
if (!response.ok) throw new Error(result.error)
// result.media.url est une URL privée, pas une URL d’avatar public.
```

Ne pas définir manuellement `Content-Type` : le navigateur fournit la frontière
multipart. Pour un aperçu privé, utiliser une requête avec la session ou une image
non optimisée ; l’optimiseur `next/image` ne relaie pas le cookie de l’utilisateur.

Les objets sont immuables : un remplacement commence par un nouvel import, puis
le consommateur bascule sa référence et supprime l’ancien objet après succès.
Le rattachement atomique à un avatar/post et ses règles de partage restent à
implémenter dans les parcours concernés. Ne pas simplement enregistrer cette URL
privée comme avatar partagé dans le formulaire actuel.

## Protections et limites

- JPEG, PNG et WebP uniquement, non animés, jusqu’à 5 Mio et 24 mégapixels.
- Limite réelle du corps HTTP : 5 Mio + 64 Kio, même sans `Content-Length` ou avec
  une valeur mensongère ; un seul fichier et aucun champ supplémentaire.
- Vérification de signature puis décodage complet. Les fichiers tronqués, SVG ou
  déguisés sont refusés ; le nom fourni par l’utilisateur n’est jamais utilisé.
- Réencodage WebP, orientation corrigée, côté maximal de 2048 pixels, retrait des
  métadonnées EXIF/GPS. Le traitement d’image a un délai maximal de 10 secondes.
- Noms UUID générés côté serveur ; stockage hors de `public/` ; lecture contrôlée
  par la base et le propriétaire ; `no-store`, `nosniff` et CORP `same-origin`.
- Maximum de 100 images et 100 Mio stockés par compte. Un verrou sur la ligne du
  propriétaire sérialise les contrôles de quota en base, y compris entre instances.
- Maximum de 10 tentatives d’import par compte et par tranche de 15 minutes dans
  chaque processus. Ce limiteur n’est pas distribué ; le quota de stockage l’est.

Le décodage et le réencodage utilisent la [documentation officielle de Sharp](https://sharp.pixelplumbing.com/api-constructor/)
et ses [options de sortie](https://sharp.pixelplumbing.com/api-output/). Ce contrôle
n’est pas une analyse antivirus générale, et le service n’accepte pas de documents.

Le chantier verrouille aussi Next.js 16.3.4 (minimum corrigé 16.3.3) et Sharp 0.35.4, à la suite
des avis de sécurité [Windows/Next.js](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36),
[optimisation d’images Next.js](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)
et [libheif/Sharp](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c).

## Configuration et exploitation

Appliquer la migration additive `0007_private_media_uploads.sql` avant utilisation :

```bash
npm run db:migrate
```

En développement, `MEDIA_STORAGE_DIR=.media` désigne un dossier privé relatif au
répertoire de l’application. Les fichiers sont exclus de Git et du contexte Docker.
Un emplacement sous `public/` ou à la racine d’un volume est refusé.

En Docker production, `/app/.media` est possédé par l’utilisateur non privilégié
`nextjs` et monté sur le volume persistant `media_production_data`. La base contient
le propriétaire, la taille et les dimensions, jamais le fichier original.

Sauvegarder **la base et ce volume ensemble**. Ne pas lancer `docker compose down -v`
sur un environnement à conserver. Plusieurs réplicas doivent partager le même
stockage ; un disque éphémère/serverless n’est pas supporté par cet adaptateur.
Configurer aussi les limites de corps et de durée de requête au reverse proxy.

Un échec d’insertion SQL déclenche la suppression du fichier créé. Un échec de
nettoyage est journalisé sous `media.orphan_cleanup_failed` pour intervention.
Un arrêt brutal entre écriture et insertion, ou une future suppression de compte,
peut laisser des fichiers orphelins : prévoir une réconciliation administrative
avant ouverture publique. Aucun effacement global automatique n’est introduit.

## Vérifications

```bash
npm test -- --runInBand src/features/media src/app/api/media
npm run typecheck
npm run test:integration
```

Les tests unitaires utilisent de vrais fichiers image et un stockage temporaire,
avec une base simulée pour les cas d’échec. Le parcours d’intégration MariaDB
vérifie import, confidentialité entre comptes, suppression et imports concurrents
au seuil du quota. Il nécessite une base migrée et un serveur disponibles.

### État vérifié le 9 septembre 2026

- 208 tests Jest réussis dans 37 suites, dont 55 tests ciblés sur les médias.
- TypeScript, ESLint et build de production réussis avec Next.js 16.3.4 et Sharp 0.35.4.
- Audit npm des dépendances de production : aucune vulnérabilité signalée à cette date.
- Configuration Docker Compose production validée ; aucun déploiement effectué.
- Exécution locale sous Node 24.14.0 ; la référence du projet et de la CI reste Node 22.
- Migration et tests MariaDB non exécutés localement : moteur Docker Desktop arrêté.

SPI-27 reste en cours jusqu’à validation avec la base migrée et vérification du
stockage dans l’environnement cible. Le branchement des formulaires d’avatar et
de publication reste suivi dans SPI-11 et SPI-18.
