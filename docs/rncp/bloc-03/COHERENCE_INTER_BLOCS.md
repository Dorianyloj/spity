# Cohérence de Spity entre les Blocs 1, 2, 3 et 4

Revue documentaire du 14 septembre, complétée le 15 septembre 2026. Elle rapproche les livrables existants et précise leur reprise dans le Bloc 3. Elle ne vaut ni validation du jury ni nouvelle mesure de production.

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

## Référence de cadrage conservée : le diaporama Bloc 1

La demande d'harmonisation prend le Bloc 1 comme point de départ. Le Bloc 3 reprend maintenant le [diaporama Bloc 1](../bloc-01/diapo-bloc-01-spity.pdf), pages 20-22 : neuf lots, 82 jours-homme et 44 250 EUR. Les sources du Bloc 1 ne sont pas modifiées pour les faire correspondre au Bloc 3. Le candidat doit confirmer que ce diaporama est bien sa version présentée ou remise.

| Poste du diaporama B1, p. 22 | Montant de référence |
| --- | --- |
| Développement MVP | 36 900 EUR |
| Infrastructure annuelle | 1 200 EUR |
| Médias et cartographie | 900 EUR |
| Nom de domaine et email | 250 EUR |
| Sécurité et conformité | 2 000 EUR |
| Tests et recette | 3 000 EUR |
| **Total** | **44 250 EUR** |

Le développement reprend 82 j-h à 450 EUR/jour, soit 36 900 EUR. Les autres postes totalisent 7 350 EUR. Le diaporama n'explicite pas la convention fiscale du total ; le Bloc 3 conserve EUR sans lui ajouter une mention HT. Ces sommes restent des estimations de cadrage, sans facture réelle ni budget global consommé inventé.

| Repère de pilotage | Valeur | Périmètre |
| --- | --- | --- |
| Budget global de cadrage B1 | 44 250 EUR, dont 82 j-h de développement | Référence du lancement MVP reprise à l'identique. |
| Lot détaillé du cas B3 | 112 h ; référence 4 270 EUR et réserve 427 EUR | Exercice de préparation/stabilisation des parcours de démonstration. |
| Prévision B3 à J10 | 77 h consommées + 40 h restantes = 117 h ; 4 465 EUR | Prévision pédagogique du lot, marge de 232 EUR sous son plafond. |

Le lot détaille le pilotage en heures par rôle. Ses taux sont propres au scénario et ne résultent pas d'une conversion du TJM du B1. Les coûts du lot ne sont pas ajoutés au budget global, car ils peuvent recouvrir des travaux communs. Aucune comparaison ne permet d'en déduire une économie ou un dépassement global du projet. Une véritable consolidation demanderait l'affectation des temps et dépenses à chaque poste du B1.

**Autre version conservée :** les fiches [C1.4.1](../bloc-01/C1.4.1-cahier-fonctionnel-charge.pdf), p. 7-8, et [C1.4.2](../bloc-01/C1.4.2-budget-previsionnel.pdf), p. 2-4, portent 79 j-h à 420 EUR HT/jour et 38 126 EUR HT. Le Bloc 3 les utilisait jusqu'à la v11. La v12 reprend le diaporama B1 pour la charge, les lots et le budget. Les deux sources ne doivent pas être fusionnées. Les données retenues et l'empreinte du diaporama figurent dans [reference-bloc-01.json](donnees/reference-bloc-01.json).

## Périmètre, planning et risques

Le Bloc 1 décrit une vision large : profils, matching, lieux, topos, événements et social. Sa page 20 classe authentification, profils, feed et répertoire en Must ; topos et événements en Should ; matching et notifications en Could. Le parcours matching/événements choisi pour la démonstration B3 est disponible dans le prototype B2 ; ce choix d'oral n'est pas une nouvelle priorisation du MVP initial. Le Bloc 2 sélectionne F01-F10 et déclare notamment la cartographie interactive, les contributions aux topos et le social complet hors de son prototype évalué de juillet. Ces limites sont celles d'une version datée.

L'[archive de backlog du 9 septembre](../../audits/2026-09-09-synchronisation-linear.md) signale ensuite un périmètre partiellement livré, avec 12 Done, 5 Todo, 7 Backlog et 1 Canceled. Le Bloc 3 se concentre sur les parcours effectivement vérifiés à nouveau le 15 septembre. Il ne présente pas le lot comme un redéveloppement historique de tout Spity. Le report fictif d'une contribution aux topos concerne le lot étudié, pas l'abandon de la vision du Bloc 1.

Les neuf lots de la page 21 sont repris dans A01 avec des identifiants B1-L01 à B1-L09 ajoutés pour le rapprochement. Le graphique propose leur séquence à 5 j-h/semaine, soit 16,4 semaines pour 82 j-h. Cette hypothèse de capacité n'est pas une date de livraison constatée. J1-J15 désignent seulement les jours ouvrés relatifs du lot B3. Les codes de risques du Bloc 3 sont propres au lot : ils ne renumérotent pas le registre du Bloc 1. Le risque de dérive de périmètre a un lien thématique avec le risque R5 de l'ancien support B1, sans identité de fiche.

## Mesures datées et environnements

| Source | Résultats rapportés | Lecture correcte |
| --- | --- | --- |
| [Bloc 2, 23 juillet](../../bc02/16_DOSSIER_FINAL_BC02.md) | 126 tests unitaires dans 23 suites, 11 résultats HTTP/MariaDB et 6 scénarios navigateur. | Preuves historiques du prototype BC02, avec couverture globale documentée. |
| [Bloc 4, 13 août](../bloc-04/DOSSIER_BLOC_04.md) | 152 tests Jest, 43 tests de maintenance, 11 scénarios MariaDB et 6 recettes Playwright. | Catégories distinctes, conservées comme résultats du dossier de maintenance. |
| [Bloc 3, 15 septembre](VERIFICATION.md) | 389 tests unitaires dans 72 suites et 6 scénarios navigateur, lint, types et build réussis. | Contrôles locaux datés ; recette sous next dev, sans nouvelle validation distante du standalone. |

Ces nombres ne doivent pas être fusionnés ni transformés en courbe de qualité : les versions et périmètres de tests diffèrent. Une hausse du nombre de tests ne mesure ni la satisfaction client ni la couverture globale actuelle.

Le [constat B4-C421-02](../bloc-04/preuves/B4-C421-02-anomalie-derive-production-2026-08-13.md) rapporte une production saine mais en retard de 19 commits le 13 août. Ce nombre n'est pas un état actuel. Le Bloc 3 utilise l'environnement local identifié dans A08 ; une CI verte ou une démonstration locale réussie ne prouve pas une promotion en production.

Les objectifs d'acquisition, de rétention, de NPS et de note d'application du Bloc 1 restent des **cibles**. Aucun résultat client réel n'a été trouvé dans les pièces examinées. Les statistiques de marché et promesses chiffrées du cadrage initial ne sont pas reprises comme faits vérifiés dans le Bloc 3.

## Reprise dans les livrables

Le diaporama conserve les trente minutes, ses graphiques modifiables, les grandes captures et les trois annexes. Le commanditaire apparaît dans le contexte, un planning global des neuf lots du diaporama B1 précède le zoom sur les quinze jours du lot, le budget du lot cite la référence globale et la matrice de preuves et cette revue distinguent juillet, août et septembre. Le guide oral, le dossier et les comptes rendus simulés reprennent ces précisions.

La palette verte, les photos d'escalade et les parcours grimpeur/club prolongent l'identité des autres livrables. Les tableaux complets restent dans les annexes. Le support visuel du Bloc 3 conserve sa propre composition pour rester lisible à l'oral.
