# Profil Spity — maquette à valider

Prototype **local et interactif**, pas une fonctionnalité intégrée ou déployée. Le profil de Camille Martin, son e-mail en `.test`, ses publications et son inventaire sont fictifs. Aucune API, base de données, session utilisateur ou production n'est contactée. Les modifications restent en mémoire et disparaissent au rechargement. Aucun stockage local persistant. Aucun Superdesign.

## Explorer

Depuis le dossier applicatif `spity/` :

```sh
node docs/design/profile/preview.mjs
```

Ouvrir [le profil local](http://127.0.0.1:3114/docs/design/profile/index.html). Le port 3114 est distinct de la maquette admin (3113). Le serveur écoute uniquement sur `127.0.0.1`, sert une liste fermée de fichiers, refuse toute écriture et interdit les connexions et envois de formulaires par CSP. Les polices sont reprises du cache local Next s'il existe, sinon les polices système sont utilisées. Aucun téléchargement n'est nécessaire. Ctrl+C arrête le serveur.

Les liens de navigation générale sont des repères non interactifs. L'aperçu concerne le **profil grimpeur** ; les profils club et l'administration existante ne sont pas modifiés.

## Parcours proposés

- **Aperçu** : présentation, niveaux par discipline, environnement, six créneaux habituels, envies de grimpe, préférences de partenaire, publications récentes.
- **Vue membre** : même fiche sans réglages, e-mail, suivi de complétude, inventaire privé ni notes personnelles. Seuls les équipements explicitement partagés sont affichés. « Public » signifie ici réservé aux membres connectés, pas accessible sur Internet.
- **Modifier le profil** : nom, ville, bio, photo locale JPG/PNG/WebP de 2 Mo maximum, retour aux initiales. Annuler ne modifie pas la fiche. Les images ne quittent pas le navigateur et leurs URL temporaires sont libérées.
- **Pratique et partenaires** : niveaux uniquement pour les disciplines cochées, objectifs, environnement, disponibilités, niveau recherché, style, note et pause de recherche. La pause retire la demande de session, pas la fiche entière.
- **Publications** : filtres par discipline, lecture détaillée, composition fictive avec ou sans illustration. Les dates des nouvelles publications de démonstration sont fixées au 9 septembre 2026.
- **Matériel** : recherche, filtres privé/partagé, création, modification, disponibilité en session, retrait après confirmation. Les notes restent privées, même pour un équipement partagé. Les compteurs comptent les références de matériel, pas les quantités dans chaque référence.
- **Réglages** : raccourcis vers les éditeurs, résumé des informations partagées, adresse de connexion privée. Aucun formulaire de mot de passe ni action de suppression réelle du compte.
- **Cas limites** : exemple de profil vide, aucune publication dans une discipline, recherche sans résultat, matériel entièrement privé, recherche de partenaire en pause, erreurs de formulaire, annulation et remise à zéro.

Les compteurs sont calculés depuis le même jeu de données que les listes. La complétude utilise six critères explicites ; elle n'est ni un score de performance ni une certification de fiabilité. Aucun karma, taux de réussite, historique de progression ou nombre de visites inventé. Les niveaux et états du matériel sont déclaratifs.

## Vérifier

```sh
node --test docs/design/profile/model.test.mjs
node docs/design/profile/verify.mjs
```

Le second script utilise le serveur local lancé, Chromium Playwright et le moteur axe actuel déjà fourni par Lighthouse. Il vérifie interactions, séparation des données, absence d'appels externes, erreurs, dialogues clavier, mobile 320/390 px, tablette et desktop. Captures dans le dossier ignoré `tmp/profile-preview/` à la racine du dépôt. Pas besoin de Docker ni de MariaDB.

## Après validation, pas avant

Réutiliser les composants React de Spity et ses contrôles serveur existants. Cette maquette **ne constitue pas un contrôle d'accès** : toutes ses données fictives sont publiques dans le module de démonstration. En application, la projection membre devra être faite côté serveur, avec sélection explicite des colonnes autorisées.

Points d'intégration identifiés lors de la lecture du projet :

- Séparer `/profile/me` (présentation personnelle) des formulaires, tout en conservant l'onboarding et la variante club.
- Le schéma possède déjà nom, bio, localisation, disponibilités, préférences, objectifs et inventaire. Réutiliser ses valeurs, avec validation serveur, erreurs réseau, états de chargement et protection contre la perte de brouillon.
- La photo actuelle est une URL externe ; un véritable upload nécessite un traitement d'image sûr et un stockage/avatar lisible par les membres. **Ne pas réutiliser tel quel `/api/media/[id]`**, actuellement réservé au propriétaire. La couverture ici est décorative et fixe, pas un nouveau champ.
- Le DTO de fiche membre doit être enrichi explicitement pour les disponibilités, préférences et matériel partagé, en excluant toujours e-mail, notes et objets privés. Décider de la visibilité et présenter ce partage clairement aux utilisateurs existants avant migration de comportement.
- Conserver l'exclusion des publications masquées par la modération ; compter les publications au serveur, pas avec la longueur d'une liste plafonnée à 30, et prévoir la pagination.
- La création de publication et la demande de session depuis la fiche sont des parcours proposés à raccorder aux services réels ; les simulations ne doivent jamais être présentées comme des envois réussis en production.
- Définir séparément les parcours sécurisés de changement d'e-mail/mot de passe et de suppression du compte. Ne pas exposer de faux boutons fonctionnels.
- Ajouter les métadonnées privées `noindex`, tests d'autorisation/projection, tests des formulaires et vérifications mobile/clavier avant déploiement.

Les fichiers restent sous `docs/design/profile`, déjà exclu de l'image Docker. Aucun changement à Next, à la base, à la CI/CD ou à la production pour cette proposition.

## Images et cohérence visuelle

Logo et photos réutilisés de Spity ; sources et licences dans [ATTRIBUTIONS.md](../../../public/images/demo/climbing/ATTRIBUTIONS.md), accessibles via « Crédits, sources et licences » dans l'aperçu. Images recadrées à l'affichage. Couleurs, police Outfit optionnelle, dimensions des contrôles et fond sombre reprennent Spity. Les règles de cohérence visuelle, d'accessibilité et de métadonnées ont conduit à des dialogues natifs, des contrôles étiquetés, un focus visible, des erreurs liées aux champs et l'absence d'indexation/animations.
