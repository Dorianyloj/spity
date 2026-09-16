# A02 — Équipe fictive, responsabilités et ressources

**Mise en situation demandée par le candidat.** Le développement historique reste solo. Le scénario comporte cinq membres du projet et Claire, cliente fictive. Les rôles couvrent toute l’année, pas seulement une séance de test.

## Équipe et livrables

| Personne | Rôle | Mission | Livrable |
| --- | --- | --- | --- |
| Dorian | Chef de projet / produit | Prioriser, affecter, suivre les coûts et délais, arbitrer et restituer | Backlog, planning et comptes rendus |
| Léa | Designer UX/UI | Concevoir les parcours, maquettes et adaptations accessibles | Maquettes et critères UX |
| Hugo | Développeur full-stack | Développer les interfaces et API, corriger les anomalies | Code, tests unitaires et pull requests |
| Inès | Testeuse QA / accessibilité | Préparer et exécuter les scénarios, qualifier et recontrôler les défauts | Rapport de recette et réserves |
| Sami | DevOps / sécurité | Préparer les environnements, contrôler la sécurité et livrer | Pipeline, sauvegarde, version et contrôle de santé |

Claire représente le club : elle exprime le besoin, valide le périmètre et décide de la réception. Sa disponibilité côté client est hors charge de réalisation des cinq membres ; aucun contrat ni salaire réel n’est déclaré.

## Matrice RACI

| Activité | Dorian | Léa | Hugo | Inès | Sami | Claire |
| --- | --- | --- | --- | --- | --- | --- |
| Périmètre et besoin | R | R | C | C | C | A |
| Parcours et maquettes | A | R | C | C | I | C |
| Interfaces et API | A | C | R | C | C | I |
| Sécurité et environnements | A | I | C | C | R | I |
| Recette et recontrôle | A | C | C | R | C | C |
| Livraison | A | I | C | C | R | I |
| Réception client | R | C | C | C | C | A |

R réalise ; A décide ; C est consulté ; I est informé. Chaque ligne a un seul A et au moins un R. Le pilote du lot coordonne les contributions ; il n’en réalise pas forcément toute la charge. Dorian porte la coordination interne, Claire les décisions de périmètre et de réception.

## Moyens affectés

Léa dispose d’un outil de maquette et des critères UX. Hugo utilise Git, Next.js, MariaDB, les tests et une base dédiée. Inès dispose de comptes de test, scénarios, navigateur et rapports de défauts. Sami utilise Docker, CI/CD, sauvegardes et environnement isolé. Dorian partage backlog, planning et classeur ; Claire consulte les démonstrations et comptes rendus. Ces affectations sont fictives ; la présence des outils dans le dépôt est réelle.

## Charge annuelle et point M10

| Personne | Base j-h | Consommé simulé | Reste simulé | Prévision j-h |
| --- | --- | --- | --- | --- |
| Dorian | 12 | 9 | 4 | 13 |
| Léa | 12 | 10 | 2 | 12 |
| Hugo | 39 | 28 | 12 | 40 |
| Inès | 11 | 6 | 7 | 13 |
| Sami | 8 | 5 | 3 | 8 |
| TOTAL | 82 | 58 | 28 | 86 |

Les 82 j-h sont partagés, jamais multipliés par cinq. Le taux de 450 €/j-h est un taux moyen conventionnel repris du cadrage pour le scénario, pas cinq tarifs individuels. Les personnes interviennent à temps partiel ; une année ne représente pas cinq équivalents temps plein.

## Prochaine période : disponibilités réservées à Spity

| Personne | Charge j-h | Capacité j-h | Taux |
| --- | --- | --- | --- |
| Dorian | 2 | 2 | 100% |
| Léa | 1 | 1 | 100% |
| Hugo | 4 | 3 | 133% |
| Inès | 3 | 2 | 150% |
| Sami | 2 | 2 | 100% |
| TOTAL | 12 | 10 | 120 % |

Dorian reporte un jour de développement d’Hugo et un jour de recette non critique d’Inès hors période. Il vérifie les dépendances et présente le jalon révisé à Claire. Cette disponibilité limitée appartient au scénario ; elle n’est pas déduite d’un temps de travail réel.

<!-- pagebreak -->

## Séance de recette : affectation détaillée

| Personne | Charge h | Capacité h | Tâches |
| --- | --- | --- | --- |
| Dorian | 2 | 3 | Prioriser les réserves 1 h ; préparer la décision client 1 h. |
| Léa | 2 | 3 | Vérifier les parcours et les libellés 1 h ; adapter les supports 1 h. |
| Hugo | 4 | 5 | Préparer la version 1 h ; corriger les défauts 2 h ; tests unitaires 1 h. |
| Inès | 4 | 5 | Préparer les critères 1 h ; exécuter et recontrôler 2 h ; rédiger le rapport 1 h. |
| Sami | 2 | 3 | Préparer les comptes et l’environnement 1 h ; vérifier version et santé 1 h. |

Total : 14 h affectées pour 19 h disponibles. Ces tâches détaillent les lots du planning : aucune addition automatique aux 82 j-h. Les formations d’A06 sont distinctes de cette séance et elles aussi incluses dans les lots.

## Adaptation des échanges

Inès est un persona malentendant. Léa prépare des supports écrits lisibles et des sous-titres vérifiés ; Dorian organise une voix à la fois, les pauses et les retours asynchrones. Inès reformule la consigne et retrouve la décision. Son handicap ne détermine pas son niveau technique : la mission est affectée selon ses compétences, puis les moyens sont adaptés.
