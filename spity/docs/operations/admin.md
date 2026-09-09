# Administration Spity

L’espace `/app/admin` utilise les données réelles de MariaDB. Il n’est accessible qu’aux comptes possédant le droit `is_admin`, vérifié en base sur chaque requête. Le rôle grimpeur/club est conservé. La maquette de `docs/design/admin` reste indépendante et n’est pas publiée dans l’application.

## Activation serveur

L’utilisateur doit déjà être inscrit. Depuis l’image **migration** de la version déployée, exécuter `node scripts/grant-admin.mjs` avec l’adresse e-mail sur l’entrée standard et `DATABASE_URL` fourni par l’environnement sécurisé de déploiement. Ne pas passer de mot de passe, imprimer les variables d’environnement ou recopier les secrets dans une commande.

L’opération transactionnelle vérifie l’existence du compte et son absence de suspension, active le droit admin, invalide ses sessions et écrit un événement dans `admin_audit_logs`. Elle est idempotente et ne modifie pas le mot de passe. L’utilisateur doit se reconnecter. Aucun point d’entrée HTTP ne permet d’accorder ce droit.

## Fonctionnement

- Statistiques sur 7, 30 ou 90 journées UTC, journée en cours incluse et partielle ; comparaison avec une période précédente de même durée.
- Contributions : nombre d’auteurs distincts ayant publié, et non utilisateurs connectés.
- Interactions : likes datés et commentaires encore présents. Les likes antérieurs à la migration restent sans date et sont explicitement exclus de l’historique. Les contenus supprimés et likes retirés ne constituent pas un journal analytique permanent.
- Suspension : accès bloqué et sessions révoquées ; réactivation possible sans perte de données. Les profils publics et anciens contenus ne sont pas supprimés automatiquement. Les administrateurs sont protégés de cette action.
- Masquage : publication retirée du fil et du profil public, interactions directes refusées ; restauration possible. Ce n’est pas une suppression des fichiers média déjà publics.
- Toute modification requiert un motif de 8 à 500 caractères. État et audit sont écrits dans une même transaction. Une répétition du même état n’ajoute pas de faux événement.
- Écrans privés non indexables, listes paginées et DTO sans mots de passe ni jetons. Mutations JSON limitées à 4 Kio et protégées contre les requêtes intersites.

## Vérifications avant production

`npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run test:integration`, puis construction et pipeline de déploiement. Les tests admin refusent les hôtes distants : ne jamais les exécuter contre la production. La CI vérifie les branches `codex/**` avant fusion ; seul un push réussi sur `main`, validé par la CI, déclenche la production.

La migration `0008_admin_moderation` est additive. Le déploiement existant sauvegarde la base avant migration ; conserver cette sauvegarde et les volumes. Ne pas lancer de seed ni réinitialiser la base pour activer un administrateur.
