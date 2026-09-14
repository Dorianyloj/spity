# A09 - Données de pilotage et rapprochement Linear

## 1. Observation du 14 septembre 2026

Le tableau Linear authentifié de l’équipe Spity contient 25 tickets : 12 Done, 4 Todo, 1 In Progress, 7 Backlog et 1 Canceled. Les 24 non annulés sont affectés à dorian joly. Lecture directe du tableau et de quatre fiches, conservée dans donnees/linear-2026-09-14.json avec leurs URL. Aucun statut n’a été modifié pour améliorer un indicateur.

Source : https://linear.app/spitywa/team/SPI/all. Ce relevé est une transcription structurée, pas un export exhaustif de l’historique Linear.

| ID | Statut observé | Priorité | Intitulé |
| --- | --- | --- | --- |
| SPI-5 | Canceled | Urgent | SPITY-001: Prisma schema User + Club |
| SPI-6 | Todo | High | SPITY-002: JWT auth grimpeur/club |
| SPI-7 | Done | High | SPITY-003: Login/register pages |
| SPI-8 | Done | Urgent | SPITY-004: Docker compose Next+MariaDB+phpMyAdmin |
| SPI-9 | Done | Urgent | SPITY-005: Drizzle schema initial |
| SPI-10 | Done | Medium | SPITY-006: GitHub Actions CI/CD |
| SPI-11 | Todo | High | SPITY-007: CRUD profil grimpeur (disciplines, niveaux, matos) |
| SPI-12 | Backlog | Medium | SPITY-008: CRUD profil club (coachs, validation) |
| SPI-13 | Done | High | SPITY-009: Page profil grimpeur + édition |
| SPI-14 | Done | Medium | SPITY-010: Page profil club |
| SPI-15 | Todo | High | SPITY-011: CRUD Post (texte, media, tags, cotation) |
| SPI-16 | Backlog | Medium | SPITY-012: Likes + commentaires |
| SPI-17 | Backlog | High | SPITY-013: Feed principal (posts + events épinglés) |
| SPI-18 | Todo | High | SPITY-014: Create post + upload images |
| SPI-19 | Backlog | High | SPITY-015: Modèles Salle/Falaise (géoloc) |
| SPI-20 | Done | Medium | SPITY-016: Modèle Voie + topos (cotation, état) |
| SPI-21 | Backlog | Medium | SPITY-017: Carte interactive salles/falaises/clubs |
| SPI-22 | Backlog | Medium | SPITY-018: Fiche falaise + topos collaboratifs |
| SPI-23 | Done | Medium | SPITY-019: CRUD Event club (inscriptions, capacité) |
| SPI-24 | Backlog | Medium | SPITY-020: Club dashboard (stats, events) |
| SPI-25 | Done | Medium | SPITY-021: Calendrier events + inscription |
| SPI-26 | Done | Medium | SPITY-022: Club dashboard |
| SPI-27 | In Progress | High | SPITY-023: Upload media sécurisé |
| SPI-28 | Done | Low | SPITY-024: Tests unitaires critiques (auth, posts) |
| SPI-29 | Done | Low | SPITY-025: Sécurité OWASP + accessibilité RGAA |

## 2. Indicateurs réellement calculables

| Indicateur | Calcul | Interprétation |
| --- | --- | --- |
| Tickets clos, hors annulé | 12 / 24 = 50 % | Comptage non pondéré ; pas 50 % du produit livré. |
| Tickets ouverts | 4 + 1 + 7 = 12 | Reste de périmètre dans ce tableau. |
| Travail en cours | 1 ticket | SPI-27 ; 1 / 2 de la limite proposée pour le cas. |
| Ouverts prioritaires High | 7 / 12 = 58,3 % | SPI-6, 11, 15, 17, 18, 19 et 27. |
| Affectation nominale | 24 / 24 non annulés | Un nom dans Linear ne prouve pas une équipe complète. |

L’archive du 9 septembre indiquait 5 Todo et aucun In Progress. Le relevé actuel indique 4 Todo et 1 In Progress. Cette différence entre deux photographies ne reconstitue pas les transitions exactes ni leur date. Aucun débit hebdomadaire, vélocité, temps de cycle ou burndown réel n’est calculé sans historique suffisant.

## 3. Une dépendance qui détermine la priorité

Le chemin décrit dans les fiches est SPI-27 (médias), puis SPI-15 (API Post), puis SPI-18 (formulaire et recette). SPI-18 dépend aussi directement du service média. La relation native affichée est Related ; la dépendance fonctionnelle vient du texte des fiches.

**SPI-27** - Description lue : service média privé implémenté au commit bafa599. Migration MariaDB et persistance du volume cible restent à valider avant clôture. Intégration avatar/posts et règles de partage restent distinctes. Statut In Progress.

**SPI-15** - Description lue : modèle et lecture existants. API de création, modification et suppression des posts, contrôle propriétaire, validation et tests restent à fournir. Dépendance média SPI-27.

**SPI-18** - Description lue : formulaire de publication, aperçu, erreurs, envoi et actualisation du fil. Dépend de SPI-15 et SPI-27, puis recette de bout en bout.

**SPI-6** - Description lue : connexion et JWT existent. Renouvellement, rotation et révocation des sessions restent dans le périmètre du ticket.

Décision de pilotage proposée : demander la preuve de migration et de persistance cible de SPI-27 avant sa clôture, puis réexaminer SPI-15 et SPI-18. Les tests unitaires du service ne suffisent pas à déclarer tout le parcours publication livré. Ce dossier ne rejoue pas cette validation et ne change pas le statut du ticket.

Le matching démontré dans B2/B3 n’a pas de ticket dédié identifié parmi ces 25 intitulés. Il reste sourcé dans le dossier B2 et le code. Les autres renvois SPI ci-dessous sont des liens de contexte, pas la preuve que le lot pédagogique correspond aux heures enregistrées sur ces tickets.

## 4. Construction des 112 heures du cas

Décomposition pédagogique en 30 activités de 2 à 8 heures, revue par livrable. Référence conservée, consommé simulé à J10 et reste à faire réestimé séparément. Les renvois SPI donnent le contexte produit sans impliquer une équivalence de périmètre ou un effort historique.

| Tâche | Détail initial en heures | Total | Référence de contexte |
| --- | --- | --- | --- |
| T01 | 2 h cadrer les deux parcours + 2 h fixer inclusions et exclusions + 2 h préparer les critères de décision | 6 | Dossier B1/B2/B3 |
| T02 | 3 h écrire les cas grimpeur + 3 h écrire les cas club + 2 h définir les critères accessibles | 8 | Dossier B1/B2/B3 |
| T03 | 2 h décomposer le lot + 2 h ajuster les dépendances de recette + 2 h affecter les responsabilités | 6 | Dossier B1/B2/B3 |
| T04 | 6 h vérifier les contrats accès et profils + 7 h stabiliser les contrôles de rôles + 5 h rejouer les cas de session et profil | 18 | SPI-6, SPI-13, SPI-14 |
| T05 | 5 h préparer les cas de compatibilité + 7 h stabiliser filtres et demande partenaire + 4 h vérifier le parcours partenaire | 16 | Dossier B1/B2/B3 |
| T06 | 6 h préparer les règles événement + 8 h stabiliser capacité et inscriptions + 4 h contrôler les participants autorisés | 18 | SPI-23, SPI-25, SPI-26 |
| T07 | 4 h préparer jeux de données et recette + 6 h rejouer les parcours et les limites + 4 h contrôler clavier, erreurs et retours | 14 | SPI-28, SPI-29 |
| T08 | 3 h suivre charges et dépendances + 3 h préparer la revue et arbitrer + 2 h formaliser réserves et validation | 8 | Dossier B1/B2/B3 |
| T09 | 3 h construire le support de restitution + 3 h répéter le parcours et les secours + 2 h préparer la transmission maintenance | 8 | Dossier B1/B2/B3 |
| T10 | 4 h corriger les défauts bloquants du cas + 4 h rejouer les tests de non-régression + 2 h documenter les réserves | 10 | SPI-23, SPI-29 |

Les 30 activités sont disponibles ligne à ligne dans la feuille Estimations du classeur, avec leur consommé simulé et leur reste à faire. Les totaux de la feuille Planning sont calculés à partir de ces lignes. La formation est déjà incluse : 1 h CP dans T03, 2 h DEV dans T06 et 3 h QA dans T07.

## 5. Explication des écarts à J10

| Cause du scénario | Écart h | Effet coût | Réponse |
| --- | --- | --- | --- |
| T03 : dépendances de recette à préciser | 1 | +45 EUR | Revoir les prérequis et réserver le jalon. |
| T04 : contrôles de rôles et sessions | 2 | +70 EUR | Conserver les cas de refus et de session. |
| T06 : capacité et participants | 2 | +70 EUR | Protéger le contrôle de capacité. |
| T07 : recette et accessibilité | 2 | +60 EUR | Allonger la vérification de 2 h. |
| T10 : corrections réestimées | -2 | -70 EUR | Hypothèse de moins de reprises, à surveiller. |
| Infrastructure : hypothèse révisée | 0 | +20 EUR | Actualiser le poste de frais. |
| Total | +5 h | +195 EUR | 112 h deviennent 117 h ; 4 270 EUR deviennent 4 465 EUR. |

Les 77 h consommées représentent 65,8 % des 117 h prévues à terminaison. Il s’agit d’une consommation de charge et pas d’un taux d’avancement physique. Cinq tâches terminées sur dix ne valent pas 50 % du travail réalisé, car leurs tailles diffèrent. Le consommé économique du cas atteint 2 945 EUR ; le reste à engager vaut 1 520 EUR, frais inclus.

## 6. Tests de sensibilité du lot

| Hypothèse isolée | Prévision EUR | Marge EUR | Capacité |
| --- | --- | --- | --- |
| Prévision J10 | 4465 | 232 | Capacités respectées |
| Recette +6 h | 4645 | 52 | Capacités respectées |
| DEV +8 h | 4745 | -48 | Capacités respectées |
| CP +2 h | 4555 | 142 | Capacité CP dépassée |
| Topo +16 h | 5005 | -308 | Capacité DEV dépassée |

Chaque ligne modifie seulement la prévision J10 ; les scénarios ne se cumulent pas. Avec 8 h DEV de plus, le budget dépasse le plafond de 48 EUR malgré une capacité DEV encore respectée. Avec 2 h CP de plus, le budget reste admissible mais CP dépasse sa capacité d’une heure. Le pilotage doit donc examiner les deux contraintes.

## 7. Règles de qualité des données

Chaque donnée porte une nature : observation Linear datée, preuve technique datée, hypothèse de scénario ou résultat calculé. Les taux et capacités ne sont pas présentés comme un benchmark de marché. Les objectifs de satisfaction restent des objectifs sans questionnaire réalisé. Les comptes rendus fictifs n’attestent ni accord réel ni signature. Une mise à jour du backlog demande un nouveau relevé daté ; elle ne doit jamais écraser cette photographie.
