# Synchronisation du backlog Spity — 9 septembre 2026

## Périmètre et vérification

Le [tableau Linear Spity](https://linear.app/spitywa/team/SPI/all) a été rapproché
du code de `main`, révision `66616a5`. Les 25 tickets et les sept projets existants
ont été actualisés, sans créer de projet ni de ticket de certification.

Les descriptions distinguent les fonctions livrées, le reste à développer et les
sources du code. Les descriptions initiales non vides sont conservées, sauf le
ticket SPI-29 dont la description était vide. Les statuts sont vérifiés après
rechargement dans Linear.

Résultat : **12 Done, 5 Todo, 7 Backlog, 1 Canceled et 0 In Progress**.
Avant synchronisation, le tableau contenait 2 Done et 23 Todo.

## Tickets

| Ticket | Statut final | Périmètre livré ou travail restant |
| --- | --- | --- |
| SPI-5 | Canceled | Choix Prisma abandonné ; schéma Drizzle suivi dans SPI-9. |
| SPI-6 | Todo | Authentification disponible ; renouvellement, rotation et révocation des sessions à terminer. |
| SPI-7 | Done | Pages de connexion et d'inscription. |
| SPI-8 | Done | Socle Docker Compose, MariaDB et image applicative. |
| SPI-9 | Done | Schéma Drizzle initial et migrations. |
| SPI-10 | Done | Mise en place des workflows CI/CD. |
| SPI-11 | Todo | Profil et matériel disponibles ; upload natif d'avatar dépendant de SPI-27. |
| SPI-12 | Backlog | Profil club de base disponible ; coachs et validation/affiliation à construire. |
| SPI-13 | Done | Interface d'édition et consultation du profil grimpeur ; upload suivi séparément. |
| SPI-14 | Done | Page et édition du profil club ; coachs/validation suivis dans SPI-12. |
| SPI-15 | Todo | Modèle et lecture des posts disponibles ; API de création/modification/suppression à livrer. |
| SPI-16 | Backlog | Likes et commentaires simples disponibles ; réponses imbriquées et actualisation temps réel/polling manquantes. |
| SPI-17 | Backlog | Fil persistant disponible ; pagination, suivi, personnalisation et événements épinglés manquants. |
| SPI-18 | Todo | Formulaire de publication à construire avec SPI-15 et SPI-27. |
| SPI-19 | Backlog | Coordonnées salles/falaises disponibles ; géolocalisation des clubs et recherche spatiale à compléter pour MariaDB. |
| SPI-20 | Done | Modèle Voie/Falaise et consultation ; contributions suivies dans SPI-22. |
| SPI-21 | Backlog | Annuaire et fiches disponibles ; carte interactive manquante. |
| SPI-22 | Backlog | Consultation des topos disponible ; contributions, votes et modération à construire. |
| SPI-23 | Done | Gestion des événements, inscriptions, capacité et participants. |
| SPI-24 | Backlog | Compteurs de base disponibles ; statistiques agrégées et historiques à construire. |
| SPI-25 | Done | Agenda chronologique et inscriptions ; pas de grille mensuelle annoncée comme livrée. |
| SPI-26 | Done | Gestion opérationnelle des événements du club ; analyses avancées suivies dans SPI-24. |
| SPI-27 | Todo | Upload authentifié et sécurisé à développer ; priorité remontée de Low à High. |
| SPI-28 | Done | Socle et tests unitaires des fonctions actuelles ; tests du futur CRUD Post dans SPI-15. |
| SPI-29 | Done | Socle sécurité et contrôles automatisés d'accessibilité des parcours actuels ; limites explicites. |

Les 24 tickets non annulés sont attribués à `dorian joly`. SPI-5 reste sans
assignation. Les noms, projets et labels existants des tickets sont conservés.

## Projets et ordre de réalisation

Les sept projets gardent leur nom. Leur statut passe de Backlog à In Progress
pour refléter un périmètre partiellement livré ; aucun n'est déclaré entièrement
terminé. Chaque projet reçoit un résumé produit, un état daté, les prochaines
étapes, une référence au code et `dorian joly` comme responsable.

| Projet | Priorité | Prochaine étape |
| --- | --- | --- |
| SPITY-MVP | High | Finaliser publications, médias et sessions avant ouverture publique. |
| SPITY-AUTH | High | Renouvellement et révocation des sessions. |
| SPITY-SOCIAL | High | Upload, API Post, puis formulaire de publication. |
| SPITY-PROFILS | Medium | Upload d'avatar ; coachs et validation ensuite. |
| SPITY-EVENTS | Medium | Statistiques avancées du club. |
| SPITY-REPERTOIRE | Low | Géolocalisation des clubs et carte interactive. |
| SPITY-TOPOS | Low | Contributions et modération des topos. |

L'ordre de réalisation et les dépendances sont renseignés dans les descriptions.
Aucune date cible ni estimation n'est inventée. Les dates de début ajoutées
automatiquement par Linear au changement de statut ont été effacées : la date
de cette synchronisation n'est pas la date historique de démarrage du projet.

## Qualité et limites

Commande exécutée depuis `spity/` :

```powershell
npm test -- --runInBand
```

Résultat du 9 septembre 2026 : **33 suites réussies, 152 tests réussis** avec
Node 24.14.0 ; la référence CI reste Node 22.

Aucun test d'intégration MariaDB, aucune recette navigateur ni aucun déploiement
en production n'a été exécuté pendant cette synchronisation. Les références
à ces contrôles décrivent les scripts et workflows présents dans le dépôt.

Le statut Done de SPI-29 ne constitue pas une certification RGAA exhaustive.
La révocation serveur des sessions, les quotas distribués, une CSP stricte et
les tests avec des utilisateurs externes restent des limites explicitement
documentées. De même, les cinq tickets techniques terminés de SPITY-MVP ne
signifient pas que le réseau social complet est prêt pour une ouverture publique.

Aucun code applicatif n'a été modifié dans cette intervention.
