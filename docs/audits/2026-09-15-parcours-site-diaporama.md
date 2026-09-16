# Parcours du site présentés dans le diaporama — 15 septembre 2026

## Périmètre

Référence : `output/bloc-03/archives/spity-bloc-3-30-minutes-visuel-v16.pptx`, diapositives 3 et 20 à 23, et scénario `docs/rncp/bloc-03/annexes/A08_DEMONSTRATION.md`.

Le parcours annoncé est : profil grimpeur → recherche de partenaire → demande → événement → inscription → participants côté club. Les éléments de gestion de projet (planning, budget, RACI, renfort RH) décrivent l'exercice de soutenance ; ils ne sont pas des fonctionnalités à ajouter au réseau social.

## Correspondance entre présentation et logiciel

| Critère présenté | Fonction déjà disponible | Correction apportée |
| --- | --- | --- |
| Profil et rôle identifiés | Inscription, connexion, profils grimpeur et club, édition des profils | Parcours rejoués dans le navigateur. |
| Filtres cohérents | Recherche par texte, discipline, niveau, disponibilité et environnement | Le niveau doit correspondre à la discipline choisie ; sans discipline choisie, seules les disciplines pratiquées sont prises en compte. Le niveau affiché suit la discipline filtrée. |
| État de demande clair | Envoi, acceptation, refus et suivi des demandes | Actualisation des profils et des statuts, confirmation fondée sur la réponse du serveur, retour utilisable après une erreur. |
| Partenaire → événement | Pages partenaires et événements | Lien « Trouver une sortie » sur une demande acceptée. |
| Confirmation et capacité respectée | Inscription, désinscription, contrôle transactionnel de la capacité | Actualisation après un conflit, badge « Complet », récupération après une panne réseau ou une réponse invalide. |
| Organisation club | Création, édition, annulation, participants réservés au propriétaire | Actualisation des participants sans rechargement ; état vide explicite. Un échec d'enregistrement conserve le formulaire. |
| Utilisation | Commandes nommées, navigation clavier, affichage mobile | Vérifications navigateur rejouées avec les nouvelles commandes d'actualisation. |

Les profils de matching, demandes et événements se réactualisent toutes les 15 secondes lorsque la page est visible, au retour dans la fenêtre et au rétablissement de la connexion. Un bouton permet aussi une actualisation immédiate. Les actualisations automatiques sont suspendues pendant une mutation ou l'édition d'un événement, afin de préserver les actions et le formulaire en cours. Une lecture ancienne ne peut pas écraser une mutation terminée.

## Vérifications exécutées

Environnement local dédié : Node.js 22.23.2, MariaDB 11.4, base `spity_bloc3_demo`, projet Compose `spity-site-demo`. Les secrets sont dans un fichier ignoré et ne sont pas inclus dans ce compte rendu.

- ESLint et TypeScript : réussis.
- Compilation de production `npm run build` : réussie. L'environnement dédié a été chargé dans le shell ; le premier lancement via l'option Node `--env-file` était incompatible avec les workers du build Next.js.
- Suite Jest complète : 73 suites, 405 tests réussis. Après l'ajout du dernier test sur la décision de partenariat renvoyée par le serveur, les deux suites concernées ont été rejouées : 11 tests réussis, dont ce nouveau test.
- Recette Playwright `tests/acceptance/bc02-recipe.spec.ts` : 6 scénarios réussis, couvrant inscription/connexion, profils, demandes, événements/participants, droits/origine et clavier/mobile. Les échanges entre comptes utilisent les boutons d'actualisation sans rechargement de page.
- Intégration `tests/integration/api-workflows.test.mjs` : 12 sous-scénarios réussis (13 tests avec le scénario parent). Le contrôle réel de deux inscriptions concurrentes à la dernière place retourne une réussite et un conflit ; les accès privés et les rôles sont également vérifiés.

Les tests ajoutés couvrent notamment le filtre discipline/niveau, les actualisations, les erreurs réseau, une réponse serveur invalide, la conservation du formulaire, le conflit de capacité et la protection contre une réponse d'actualisation ancienne.

## Limites de cette vérification

Cette vérification porte sur le parcours de démonstration annoncé, pas sur l'ensemble de la vision produit du cadrage. La synchronisation utilise des requêtes périodiques ; ce n'est pas une notification instantanée. Les contrôles clavier/mobile ne constituent pas un audit RGAA complet.

Les résultats concernent la version locale modifiée. Aucun déploiement en production n'a été effectué pendant cette tâche. Les captures de secours du diaporama restent les captures datées de sa préparation et ne sont pas présentées comme de nouvelles captures de cette correction.
