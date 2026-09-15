# Vérification du kit et de l'application

Contrôles exécutés le 14 septembre 2026. La révision de départ est dd2bee5 ; l'arbre applicatif correspondant est enregistré dans preuves/verification.json. Les modifications du kit concernent les documents et les outils de préparation.

Portée vérifiée le 15 septembre : les commits ea957b6, 3742f56 et 67dedd8 ont ensuite modifié l'affichage et les filtres du matching. Les résultats ci-dessous restent ceux de la révision dd2bee5 et ne certifient pas la version courante. La révision documentaire sur Camille n'exécute pas une nouvelle recette applicative. Avant la soutenance, relancer les contrôles sur la version effectivement démontrée et actualiser les preuves.

| Contrôle réellement exécuté | Résultat | Portée |
| --- | --- | --- |
| Lint | Réussi | Analyse ESLint du projet. |
| TypeScript | Réussi | Contrôle statique sans émission. |
| Tests unitaires | 389 tests réussis dans 72 suites | Aucun test ignoré ou instantané annoncé ; ce résultat n'est pas une couverture en pourcentage. |
| Build Next.js | Réussi, version installée 16.3.4 | Construction de l'application et vérification TypeScript. |
| MariaDB de démonstration | Créée, migrée et alimentée | Base dédiée spity_bloc3_demo sur 127.0.0.1:33313 ; la base habituelle n'est pas réinitialisée. |
| Recette navigateur | Six scénarios réussis, aucun échec, skip ou flaky | Inscription, profils, matching, partenariats, événements, droits et navigation mobile/clavier. |

Les contrôles ont utilisé Node.js 24.14.0 sur cette machine. Le projet déclare Node.js 22 comme référence ; il faut conserver cette distinction. Le runtime de génération des documents est indépendant du runtime applicatif.

Le premier build a échoué dans le bac à sable parce que les polices Google n'étaient pas accessibles. La nouvelle exécution avec accès réseau autorisé a réussi. Le build actuel conserve cette dépendance au téléchargement des polices lors d'une première construction.

La recette locale utilise le serveur next dev sur le port 3313, conformément à la configuration existante hors CI. Elle ne constitue pas une nouvelle recette distante du standalone. Les preuves de juillet décrivent ce second contexte séparément.

Un avertissement décoratif VANTA « No THREE defined on window » est apparu pendant la recette. Il n'a pas empêché les six parcours de réussir. Aucun déploiement de production, audit de sécurité externe ou validation par un client réel n'est déclaré dans cette vérification.

## Vérification des livrables

Le classeur contrôle les totaux et le recalcul après modification du reste à faire, du taux horaire, d'une capacité nulle et d'une entrée manquante. Les entrées de test sont restaurées avant export. Les cinq feuilles sont rendues et inspectées. La révision du 14 septembre ajoute les 30 activités sources, le relevé Linear daté et les scénarios de sensibilité. Les 175 formules du classeur sont contrôlées sans erreur exportée. La valeur de 50 % désigne les cinq tâches terminées sur dix du cas fictif.

PDF et PowerPoint sont rendus pour contrôler leur lisibilité, sans ouverture déclarée dans Microsoft PowerPoint. La checklist regroupe les confirmations restantes : équipe réelle, dates, règlement spécial et répétition. Aucun dépôt sur DigiformaCertif n'est effectué.
