# A01 — Chronologie et planification

## Période réelle déclarée

Un an, projet réalisé seul par Dorian Joly. Mois de début et de fin non fournis. Les étapes ci-dessous sont des dates de commits, pas des durées de travail ni un planning approuvé.

| Date Git | Étape | Révision |
| --- | --- | --- |
| 2026-01-24 | Fondations Next.js et Drizzle | c2783de |
| 2026-05-04 | Authentification | f92a86d |
| 2026-05-04 | Profils et onboarding | 84d85c9 |
| 2026-05-05 | Répertoire des lieux | 97b425b |
| 2026-07-20 | Matching et événements | aa5079c |
| 2026-07-20 | Recette sur build compilé | 689e59d |
| 2026-07-28 | Commentaires du feed | 6809b3e |
| 2026-08-13 | Maintenance des dépendances | f892c31 |
| 2026-08-13 | Supervision | 95c01f7 |
| 2026-09-09 | Médias sécurisés | bafa599 |
| 2026-09-09 | Administration | 62937d5 |
| 2026-09-11 | Voies et alertes en falaise | 3ae0323 |
| 2026-09-11 | Liens et PDF de topos | efda3e8 |
| 2026-09-15 | Fiabilisation des parcours de démonstration | 363f681 |
| 2026-09-15 | Correction de la navigation | 83e4c29 |
| 2026-09-15 | Fusion de la PR 35 | 872db19 |

## Estimation initiale du diaporama B1

| Lot | Charge estimée |
| --- | --- |
| Cadrage, UX, backlog | 8 j-h |
| Setup technique | 6 j-h |
| Auth et sécurité de base | 10 j-h |
| Profils grimpeur/club | 9 j-h |
| Feed social | 12 j-h |
| Répertoire géolocalisé | 10 j-h |
| Topos collaboratifs | 9 j-h |
| Événements clubs | 8 j-h |
| Tests, accessibilité, documentation | 10 j-h |

Total : **82 j-h estimés**. Un jour-personne mesure une charge, pas une durée calendaire. Aucun Gantt annuel inventé ne remplace le planning initial absent.

## Dépendances de démonstration

Connexion → profil → recherche et demande de partenaire ; événement existant → inscription ; rôle club → consultation des participants. Préparer les données et vérifier le parcours avant la soutenance. Le jalon personnel de passage reste à confirmer.

Le classeur, feuille Chronologie, reprend les dates et références. Joindre le planning initial et ses modifications si ces documents existent.

## Modèle annuel d’équipe — mise en situation

M1–M12 sont des mois relatifs, sans dates calendaires inventées. Les cinq personnes interviennent à temps partiel. Le modèle montre la prévision révisée à M10, avec restitution M12 au lieu de M11. Les pilotes coordonnent les contributions indiquées, sous le pilotage global de Dorian.

| Lot | Début | Fin | Charge estimée | Pilote et contributions |
| --- | --- | --- | --- | --- |
| Cadrage / UX | M1 | M2 | 8 j-h | Léa pilote ; Dorian 4 j-h, Léa 4 j-h |
| Setup technique | M2 | M3 | 6 j-h | Sami pilote ; Hugo 2 j-h, Sami 4 j-h |
| Auth / sécurité | M3 | M4 | 10 j-h | Hugo pilote ; Hugo 8 j-h, Sami 2 j-h |
| Profils | M4 | M5 | 9 j-h | Hugo pilote ; Hugo 6 j-h, Léa 3 j-h |
| Feed social | M5 | M7 | 12 j-h | Hugo pilote ; Hugo 8 j-h, Léa 2 j-h, Dorian 2 j-h |
| Répertoire | M6 | M8 | 10 j-h | Hugo pilote ; Hugo 6 j-h, Léa 3 j-h, Inès 1 j-h |
| Topos | M8 | M10 | 9 j-h | Hugo pilote ; Hugo 5 j-h, Inès 3 j-h, Dorian 1 j-h |
| Événements | M8 | M10 | 8 j-h | Hugo pilote ; Hugo 4 j-h, Inès 2 j-h, Dorian 2 j-h |
| Tests / access. / doc. | M10 | M12 | 10 j-h | Inès pilote ; Inès 5 j-h, Sami 2 j-h, Dorian 3 j-h |

Phases : étude M1 ; mesure du besoin M2 ; conception M2–M3 ; réalisation M3–M10 ; mesure de conformité et recette M10–M11 ; restitution M12. Les contrôles accompagnent la réalisation. Léa prépare les parcours avant le développement d’Hugo ; Sami stabilise l’environnement ; Inès teste une version identifiée ; Dorian organise la décision de Claire.

Dépendances : authentification avant profils ; événement avant inscription ; correction avant recontrôle. Chaque tâche précise son responsable, sa date cible, son livrable et son critère de fin. La revue hebdomadaire confronte le reste à faire aux disponibilités ; elle ne présente pas cinq personnes disponibles à temps plein.
