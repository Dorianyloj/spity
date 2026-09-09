# Intégration du profil grimpeur

La validation du 9 septembre 2026 est reprise dans `/profile/me` et `/app/profiles/[userId]`. Les parcours club et onboarding sont conservés. Le prototype statique reste une référence, pas l'application réelle.

## Fonctionnement

- Aperçu et complétude calculés depuis les données enregistrées ; aucun score de fiabilité inventé.
- Identité, pratique et préférences enregistrées séparément via `PATCH /api/profile/settings`. Validation stricte, contrôle d'origine, taille de requête bornée et verrouillage transactionnel du propriétaire.
- Inventaire existant réutilisé. Affichage membre désactivé pour tous les profils sans consentement explicite `partnerSearch.shareEquipment === true`. Seules les références disponibles sont sélectionnées, sans notes privées ni identifiant du propriétaire. Pas de migration SQL nécessaire : le réglage est dans le JSON existant.
- Import JPEG/PNG/WebP de 5 Mio maximum, normalisation WebP et suppression des métadonnées par le service existant. `/api/media/[id]` reste privé ; `/api/avatars/[id]` et `/api/post-media/[id]` exigent un membre connecté et un attachement autorisé. Les images utilisées ne peuvent pas être supprimées par le nettoyage des brouillons. Les médias de publications masquées deviennent inaccessibles par cette URL, sauf autre publication visible utilisant la même image.
- Publications réellement créées par transaction, pagination de 12, compte SQL excluant la modération. Filtres photo/texte sur la page courante : le modèle de données n'a pas de discipline par publication, contrairement aux exemples de la maquette.
- Demande réelle de partenaire et suivi des états existants, sans fausse réservation ni message non enregistré.
- Vues privées `noindex`, données API `private, no-store`. Les membres reçoivent une projection serveur du profil consulté, jamais son e-mail ni son inventaire privé.

Les changements d'e-mail/mot de passe et la suppression du compte demandent des parcours sécurisés distincts ; ils ne sont pas proposés comme actions fonctionnelles. La couverture reste décorative. Aucun changement de dépendance ni de configuration de déploiement.

## Vérifications

```sh
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Sur une base MariaDB **de test** migrée, avec Chromium installé et `CHROME_PATH` défini :

```sh
ADMIN_TEST_PRODUCTION=1 node --env-file-if-exists=.env.local --test tests/integration/profile.test.mjs
```

La CI existante exécute ce scénario dans son service MariaDB isolé. Il refuse une base ou un site distant, crée deux comptes temporaires, teste les droits, les pièces jointes, le partage, la modération, les sauvegardes et les demandes. Il contrôle les écrans desktop/320 px, les dialogues natifs, le retour du focus, axe et les erreurs de navigateur. Captures dans `.integration-results/profile-*.png`. La recette d'acceptation existante utilise également le nouveau formulaire.

La cohérence visuelle, l'accessibilité et les métadonnées ont guidé la réutilisation des composants Spity, les contrôles étiquetés, les dialogues natifs, les confirmations de retrait et la conservation des brouillons sur erreur. Aucun Superdesign. Le push de la branche de travail déclenche la CI, pas une mise en production ; le déploiement reste réservé à `main`.
