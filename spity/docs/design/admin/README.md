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

- Dashboard : périodes 7/30/90 jours, nouveaux comptes, publications créées, interactions et contributeurs, comparés à la période précédente de même durée.
- Graphique interchangeable (inscriptions, publications, interactions) avec tableau de valeurs accessible ; répartition grimpeurs/clubs et effectifs actuels.
- Modération : compteurs réactifs et raccourcis vers les listes de comptes suspendus et de publications masquées ; aperçu des comptes et dernières actions conservés.
- Comptes : recherche, filtres, suspension/réactivation avec motif ; administrateur protégé.
- Publications : filtre de visibilité, masquage/rétablissement avec motif.
- Historique : action, cible, date, administrateur et motif ; mis à jour après chaque simulation.
- Affichage mobile, navigation clavier, confirmation native avec annulation et retour du focus.

Les autres rubriques de la navigation sont des repères visuels ; elles n'ouvrent pas la production. Aucun système de signalement, suppression définitive, attribution d'accès ou métrique de disponibilité n'est simulé.

Les statistiques de démonstration se terminent au **9 septembre 2026**, indépendamment de l'horloge locale. Les périodes sont des jours calendaires UTC, inclusifs à l'affichage, avec bornes exclusives dans les calculs. Les interactions sont comptées à leur propre date (j'aime + commentaires) et les contributeurs sont les auteurs distincts ayant publié pendant la période, pas des visiteurs ou des utilisateurs connectés. L'historique inclut les contenus ensuite masqués. Les stocks actuels (comptes, répartition, suspensions et masquages) ne sont pas filtrés par période ; les actions de modération le sont. Les six comptes et cinq publications forment le même jeu de données que les listes, sans totaux inventés séparément.

## Après validation seulement

Implémenter un accès administrateur distinct des profils grimpeur/club, les contrôles serveur, la révocation de sessions lors d'une suspension, les listes paginées, la modération réversible et l'audit transactionnel. Nommer le premier administrateur uniquement à partir du compte existant explicitement choisi par le propriétaire. La maquette ne crée ni ce rôle ni ce compte.

## Vérification de l'aperçu

Avec le serveur local lancé et Chromium Playwright installé :

```sh
node --test docs/design/admin/dashboard.test.mjs
node docs/design/admin/verify.mjs
```

Les captures sont des fichiers temporaires, hors sources de l'application. Cette étape ne nécessite pas MariaDB.
