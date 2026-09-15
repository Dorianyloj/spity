# A01 - Planning et jalons

Nature : simulation pédagogique sur quinze jours ouvrés relatifs. Les jours ne sont pas des dates historiques. Le planning initial est conservé pour comparer les écarts à J10.

| ID | Tâche | Rôle | Prévu | Fin revue | Heures prévues | Prérequis |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Cadrage et périmètre | CP | J1-J2 | J2 | 6 | Aucune |
| T02 | Besoins et critères de recette | QA | J1-J3 | J3 | 8 | Aucune |
| T03 | Planning et ressources | CP | J2-J3 | J4 | 6 | Aucune |
| T04 | Accès et profils | DEV | J3-J5 | J6 | 18 | T01 |
| T05 | Matching et partenariats | DEV | J6-J8 | J8 | 16 | T04 |
| T06 | Événements et capacité | DEV | J9-J11 | J12 | 18 | T05 |
| T07 | Recette et accessibilité | QA | J10-J13 | J14 | 14 | T02, T05 |
| T08 | Suivi et validations client | CP | J1-J14 | J14 | 8 | Aucune |
| T09 | Restitution et démonstration | CP | J14-J15 | J15 | 8 | T07 |
| T10 | Corrections de recette | DEV | J12-J14 | J14 | 10 | T06 |

Le planning distingue étude (T01), mesure des besoins (T02), conception de l'organisation (T03), réalisation (T04/T05/T06), mesure du résultat et corrections (T07/T10), pilotage (T08) et restitution (T09). Les tâches de recette commencent sur les fonctions déjà livrées. Leur clôture dépend aussi de T06 et T10. La préparation du support peut avancer avant la réception ; la démonstration finale exige une recette terminée.

| Jalon | Condition de passage | Autorité dans le scénario |
| --- | --- | --- |
| J3 - Périmètre | Besoins et critères formalisés | Client fictif |
| J8 - Parcours partenaire | Accès, profils et matching vérifiés | CP avec QA |
| J10 - Revue d'écarts | Reste à faire et arbitrages actualisés | CP et client fictif |
| J14 - Recette | Événements et corrections vérifiés | CP avec QA |
| J15 - Restitution | Parcours démontré, réserves identifiées | Client fictif |

Points de vigilance : charge CP proche de sa capacité, dépendance de la recette à la stabilisation des événements, démarrage de la base locale, disponibilité du client et éventuelles demandes nouvelles. Une fin revue n'écrase jamais la référence initiale.

Historique réel distinct : premier commit le 22 janvier 2026, socle le 24 janvier, interface en mai, recette et corrections en juillet, maintenance en août, évolutions et backlog en septembre. Ces jalons sont issus de Git ; ils ne donnent pas le temps de travail réel ni la date de démarrage contractuelle du projet.

<!-- pagebreak -->

## Planning global, puis zoom sur le lot

Le diaporama du Bloc 1, p. 21, répartit 82 jours-homme entre neuf lots. Leurs intitulés et charges sont conservés dans reference-bloc-01.json ; B1-L01 à B1-L09 sont des identifiants de rapprochement ajoutés pour ce dossier. Le tableau ci-dessous donne un ordonnancement pédagogique séquentiel avec une capacité constante de 5 j-h par semaine. Les intervalles sont exprimés en semaines écoulées depuis un départ relatif, sans date historique inventée. Un jalon est franchi sur son résultat attendu, pas uniquement sur une consommation de temps.

| Lot du MVP cible | Charge B1 | Semaines écoulées | Résultat de passage |
| --- | --- | --- | --- |
| B1-L01 - Cadrage / UX | 8 j-h | 0 à 1,6 | Ateliers, wireframes et priorités |
| B1-L02 - Setup technique | 6 j-h | 1,6 à 2,8 | Socle Next.js, Docker, base et CI |
| B1-L03 - Auth / sécurité | 10 j-h | 2,8 à 4,8 | Accès et sessions contrôlés |
| B1-L04 - Profils | 9 j-h | 4,8 à 6,6 | Profils et formulaires exploitables |
| B1-L05 - Feed social | 12 j-h | 6,6 à 9 | Publications, médias et interactions |
| B1-L06 - Répertoire | 10 j-h | 9 à 11 | Lieux, fiches, filtres et carte |
| B1-L07 - Topos | 9 j-h | 11 à 12,8 | Voies, cotations, états et alertes |
| B1-L08 - Événements | 8 j-h | 12,8 à 14,4 | Création, inscriptions et capacité |
| B1-L09 - Tests / access. / doc. | 10 j-h | 14,4 à 16,4 | Recette, contrôles et documentation |

Le total est de 82 / 5 = 16,4 semaines de capacité, sous cette hypothèse séquentielle. Cette séquence reprend les charges du B1, pas l'état de livraison actuel de chaque fonction. Le prototype B2, les évolutions réelles de Linear et le registre de maintenance B4 gardent leurs périmètres datés. Les jours J1-J15 du lot B3 sont distincts des identifiants des neuf lots globaux. Les heures et coûts du lot ne s'ajoutent pas automatiquement au budget global.

Le suivi du cas combine Kanban dans Linear et des réunions inspirées de Scrum : planning J3, daily de dix minutes, reviews J10/J15 et rétrospective J15. Ce choix répond au petit effectif, aux priorités évolutives et au besoin de retours rapides. La limite de deux travaux simultanés évite la dispersion. Les critères de recette conditionnent le passage à Terminé. Les jalons intermédiaires et rôles du cas restent ceux d'une adaptation, sans revendication de Scrum complet. A05 détaille les objectifs et traces des réunions.

Le planning à barres complète le flux Kanban. Il permet de voir les chevauchements, les dates et les conditions de passage sans figer l'ordre de tous les petits travaux. Linear expose le travail courant ; les jalons fixent les engagements et le classeur conserve dates initiales et dates revues. Cette distinction justifie les outils et leur compatibilité. Dans le lot, la mesure porte sur les besoins et critères T02, puis sur la conformité de la recette T07.
