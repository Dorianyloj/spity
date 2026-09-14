# Cohérence de Spity entre les Blocs 1, 2, 3 et 4

Revue documentaire du 14 septembre 2026. Elle rapproche les livrables existants et précise leur reprise dans le Bloc 3. Elle ne vaut ni validation du jury ni nouvelle mesure de production.

## Un projet, quatre compétences complémentaires

| Bloc | Apport déjà documenté | Reprise dans le Bloc 3 |
| --- | --- | --- |
| 1 - Cadrer | Besoin des grimpeurs et clubs, commanditaire fictif, périmètre cible, architecture et estimation globale. | Même commanditaire et mêmes parcours prioritaires. Distinction entre budget du MVP et exercice de pilotage d'un lot. |
| 2 - Développer | Prototype F01-F10, code, tests, corrections, recette, release et manuels. | Parcours partenaire/événement et arbitrage sur la recette standalone. Les résultats de juillet restent datés. |
| 3 - Piloter | Préparation d'un lot de démonstration, charges, risques, arbitrages, responsabilités et suivi client. | Scénario pédagogique explicitement identifié, adossé au produit existant. |
| 4 - Maintenir | Supervision, registre d'anomalies, contrôles de livraison, journal des versions et collaboration support simulée. | Préparation de la transmission en maintenance et distinction entre validation locale, staging et production. |

Cette lecture décrit les compétences, pas l'ordre chronologique des dossiers : le Bloc 4 est daté du 13 août, avant la préparation du Bloc 3 du 14 septembre.

## Commanditaire et rôles

Le [livrable C1.1.1](../bloc-01/C1.1.1-cartographie-parties-prenantes.pdf), page 2, désigne le **Collectif Altitude Grimpe**, association régionale fictive représentée par **Claire Martin**, présidente fictive. La zone pilote est Lyon-Grenoble. Le Bloc 3 reprend ces éléments à la place du générique « club pilote ».

La cartographie du Bloc 1 distingue les rôles de développeur, architecte et exploitant. Le [dossier BC02](../../bc02/16_DOSSIER_FINAL_BC02.md) décrit les contributions de Dorian à la première personne. Le cas CP/DEV/QA du Bloc 3 représente une organisation fictive pour l'exercice ; il ne prouve pas l'existence de trois collaborateurs. Les comptes de démonstration ne sont pas des membres de cette équipe.

Le [cas support du Bloc 4](../bloc-04/preuves/B4-C433-01-collaboration-support-2026-08-13.md) est lui aussi déclaré fictif. Il fournit un exemple de transmission fonctionnelle et technique, pas un témoignage de client réel à recycler dans les comptes rendus du Bloc 3.

## Budgets : deux périmètres et une divergence du Bloc 1

La référence globale retenue pour expliquer le Bloc 3 est celle des fiches détaillées [C1.4.1](../bloc-01/C1.4.1-cahier-fonctionnel-charge.pdf), pages 7-8, et [C1.4.2](../bloc-01/C1.4.2-budget-previsionnel.pdf), pages 2-4 :

| Repère | Charge et calcul | Portée |
| --- | --- | --- |
| Bloc 1, fiches détaillées | 79 jours-homme à 420 EUR HT = 33 180 EUR ; exploitation annuelle 1 480 EUR ; provision 3 466 EUR ; total 38 126 EUR HT. | Estimation de lancement du MVP et de sa première année, pas une dépense constatée. |
| Bloc 3, référence du lot | 112 h valorisées par rôle et frais = 4 270 EUR ; réserve 427 EUR ; plafond 4 697 EUR. | Exercice pédagogique de préparation d'une démonstration sur un produit existant. |
| Bloc 3, prévision à J10 | 77 h consommées et 40 h restantes = 117 h ; 4 465 EUR prévus ; marge sous le plafond 232 EUR. | Prévision à terminaison de ce seul exercice. |

Les 4 270 EUR ne remplacent pas les 38 126 EUR. On ne les additionne pas : aucun rattachement comptable ne justifie un coût supplémentaire au budget global. On ne calcule pas non plus une économie du projet en les soustrayant. Les taux horaires du lot sont des hypothèses distinctes du taux journalier du Bloc 1, sans convention de conversion entre heures et jours-homme.

**Divergence à connaître :** le [diaporama PDF du Bloc 1](../bloc-01/diapo-bloc-01-spity.pdf), pages 21-22, et sa [version Reveal](../bloc-01/reveal-bloc-01-spity.html) affichent 82 jours-homme, 450 EUR/jour et 44 250 EUR. Ils ne correspondent pas aux fiches détaillées. La présente reprise privilégie les fiches C1.4.1/C1.4.2, qui détaillent les hypothèses et calculs. Elle ne prétend pas qu'une version a été validée par le commanditaire. Les anciens supports du Bloc 1 conservent cette divergence et doivent être harmonisés avant une remise commune.

## Périmètre, planning et risques

Le Bloc 1 décrit une vision large : profils, matching, lieux, topos, événements et social. Le Bloc 2 sélectionne F01-F10 et déclare notamment la cartographie interactive, les contributions aux topos et le social complet hors de son prototype évalué de juillet. Ces limites sont celles d'une version datée.

L'[archive de backlog du 9 septembre](../../audits/2026-09-09-synchronisation-linear.md) signale ensuite un périmètre partiellement livré, avec 12 Done, 5 Todo, 7 Backlog et 1 Canceled. Le Bloc 3 se concentre sur les parcours effectivement vérifiés le 14 septembre. Il ne présente pas le lot comme un redéveloppement historique de tout Spity. Le report fictif d'une contribution aux topos concerne le lot étudié, pas l'abandon de la vision du Bloc 1.

J1-J5 désignent des **jalons** dans C1.4.1. J1-J15 désignent des **jours ouvrés relatifs** dans le Bloc 3. Les 79 jours-homme du Bloc 1 ne sont donc pas comprimés en quinze jours. Les codes de risques du Bloc 3 sont propres au lot : ils ne renumérotent pas le registre du Bloc 1. Le risque de dérive de périmètre a un lien thématique avec le risque R5 de l'ancien support B1, sans identité de fiche.

## Mesures datées et environnements

| Source | Résultats rapportés | Lecture correcte |
| --- | --- | --- |
| [Bloc 2, 23 juillet](../../bc02/16_DOSSIER_FINAL_BC02.md) | 126 tests unitaires dans 23 suites, 11 résultats HTTP/MariaDB et 6 scénarios navigateur. | Preuves historiques du prototype BC02, avec couverture globale documentée. |
| [Bloc 4, 13 août](../bloc-04/DOSSIER_BLOC_04.md) | 152 tests Jest, 43 tests de maintenance, 11 scénarios MariaDB et 6 recettes Playwright. | Catégories distinctes, conservées comme résultats du dossier de maintenance. |
| [Bloc 3, 14 septembre](VERIFICATION.md) | 389 tests unitaires dans 72 suites et 6 scénarios navigateur, lint, types et build réussis. | Contrôles locaux datés ; recette sous next dev, sans nouvelle validation distante du standalone. |

Ces nombres ne doivent pas être fusionnés ni transformés en courbe de qualité : les versions et périmètres de tests diffèrent. Une hausse du nombre de tests ne mesure ni la satisfaction client ni la couverture globale actuelle.

Le [constat B4-C421-02](../bloc-04/preuves/B4-C421-02-anomalie-derive-production-2026-08-13.md) rapporte une production saine mais en retard de 19 commits le 13 août. Ce nombre n'est pas un état actuel. Le Bloc 3 utilise l'environnement local identifié dans A08 ; une CI verte ou une démonstration locale réussie ne prouve pas une promotion en production.

Les objectifs d'acquisition, de rétention, de NPS et de note d'application du Bloc 1 restent des **cibles**. Aucun résultat client réel n'a été trouvé dans les pièces examinées. Les statistiques de marché et promesses chiffrées du cadrage initial ne sont pas reprises comme faits vérifiés dans le Bloc 3.

## Reprise dans les livrables

Le diaporama conserve les trente minutes, ses graphiques modifiables, les grandes captures et les trois annexes. Le commanditaire apparaît dans le contexte, une vue des quatre blocs explique la continuité, le budget du lot cite la référence globale et l'annexe de preuves distingue juillet, août et septembre. Le guide oral, le dossier et les comptes rendus simulés reprennent ces précisions.

La palette verte, les photos d'escalade et les parcours grimpeur/club prolongent l'identité des autres livrables. Les tableaux complets restent dans les annexes. Le support visuel du Bloc 3 conserve sa propre composition pour rester lisible à l'oral.
