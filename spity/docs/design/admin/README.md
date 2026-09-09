# Maquette locale — administration Spity

Statut : proposition à valider, pas une fonctionnalité déployée.

Cet aperçu autonome reprend le logo public, les couleurs, les polices et la structure de Spity. Il n'utilise pas Superdesign, ne contacte aucune API et ne modifie aucun compte. Tous les noms, e-mails, publications et historiques affichés sont fictifs. Les simulations restent en mémoire et disparaissent au rechargement.

## Ouvrir l'aperçu

Depuis le dossier applicatif `spity/` :

```sh
node docs/design/admin/preview.mjs
```

Ouvrir http://127.0.0.1:3113/docs/design/admin/index.html. Le serveur n'écoute que sur localhost et sert une liste explicite de fichiers. Les polices sont reprises du cache Next local lorsqu'il existe ; sinon les polices système prennent le relais. Aucune dépendance ou police n'est téléchargée. Ctrl+C arrête le serveur.

## Parcours à valider

- Vue d'ensemble : comptes, clubs, publications, administrateurs et dernières actions.
- Comptes : recherche, filtres, suspension/réactivation avec motif ; administrateur protégé.
- Publications : filtre de visibilité, masquage/rétablissement avec motif.
- Historique : action, cible, date, administrateur et motif ; mis à jour après chaque simulation.
- Affichage mobile, navigation clavier, confirmation native avec annulation et retour du focus.

Les autres rubriques de la navigation sont des repères visuels ; elles n'ouvrent pas la production. Aucun système de signalement, suppression définitive, attribution d'accès ou métrique de disponibilité n'est simulé.

## Après validation seulement

Implémenter un accès administrateur distinct des profils grimpeur/club, les contrôles serveur, la révocation de sessions lors d'une suspension, les listes paginées, la modération réversible et l'audit transactionnel. Nommer le premier administrateur uniquement à partir du compte existant explicitement choisi par le propriétaire. La maquette ne crée ni ce rôle ni ce compte.

## Vérification de l'aperçu

Avec le serveur local lancé et Chromium Playwright installé :

```sh
node docs/design/admin/verify.mjs
```

Les captures sont des fichiers temporaires, hors sources de l'application. Cette étape ne nécessite pas MariaDB.
