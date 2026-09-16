# A03 — Indicateurs et risques

## Indicateurs disponibles

| Indicateur | Valeur et calcul | Portée |
| --- | --- | --- |
| Tickets terminés | 12 / 24 = 50 % | Relevé du 14/09, hors annulé, tailles non pondérées |
| Charge initiale | Somme des neuf lots = 82 j-h | Estimation du diaporama B1 |
| Budget initial | 82 × 450 € + autres postes = 44 250 € | Prévision B1 ; aucune dépense réelle |
| Navigation locale | Médiane de cinq parcours : 10 220 → 748 ms | CPU ×4, latence 100 ms, un passage/parcours |
| Qualité après correction | 404 tests Jest ; sept scénarios navigateur | Résultats consignés dans l’audit du 15/09 |
| Version distante | 872db19, version 0.1.0 ; santé OK | Sonde du 15/09 à 21:39 UTC |

Le classeur calcule le décompte Linear, les totaux B1 et les médianes depuis leurs valeurs sources. Les consommés de temps et de coûts restent vides, car non fournis. Aucun écart budget/réalisé ou capacité/charge ne peut être déduit d’une valeur manquante.

## Risques : analyse rétrospective

| Risque | Déclencheur observable | Réponse documentée |
| --- | --- | --- |
| Navigation bloquante | Clic suivi d’un long calcul dans le navigateur | Fond statique et indicateur d’attente |
| Régression de parcours | Scénario de recette en échec | Correction et nouvelle exécution de la recette |
| Mauvaise version servie | SHA distant différent de la version attendue | Vérification du déploiement et de la sonde |
| Démo indisponible | Connexion ou parcours impossible le jour J | Annoncer l’incident, montrer une capture datée, noter les critères non revérifiés |
| Indicateur trompeur | Statut Linear incohérent avec le périmètre testé | Rapprocher ticket, code et critère avant de conclure |

Cette analyse ne prétend pas reconstituer un registre initial approuvé. Aucun score de risque, délai consommé ou responsable externe n’est inventé.

## Tableau annuel simulé à M10

Ces entrées sont inventées pour l’exercice et séparées du relevé Linear réel. Elles illustrent les calculs exigés ; elles ne sont ni des dépenses ni des heures réellement consommées par Dorian.

| Indicateur | Formule / référence | Résultat du cas |
| --- | --- | --- |
| Charge à terminaison | 58 j-h consommés simulés + 28 j-h restants | 86 j-h |
| Écart de charge | 86 − 82 | +4 j-h |
| Autres postes B1 estimés | 44 250 − 82 × 450 | 7 350 € |
| Coût prévisionnel | 86 × 450 + 7 350 | 46 050 € |
| Écart au budget initial | 46 050 − 44 250 | +1 800 €, soit environ +4,07 % |
| Délai | Fin M12 au lieu de fin M11 | +1 mois |
| Capacité de l’équipe fictive | 12 j-h prévus / 10 j-h réservés à Spity | 120 % ; Dorian reporte 1 j-h d’Hugo et 1 j-h d’Inès |
| Séance de recette | 14 h affectées / 19 h disponibles, cinq membres | Détail des tâches et marges dans A02 |

Une revue hebdomadaire proposée actualise le reste à faire, le coût prévu, le jalon et les risques. Elle se conclut par une action et un responsable. L’arbitrage présenté dans CR-SIM-02 maintient les critères critiques et limite les enrichissements décoratifs. Les données du cas ne permettent pas d’attribuer historiquement quatre jours de dérive à la correction réelle de navigation.

Seuils proposés : charge supérieure à 100 % → déplacer ou retirer une tâche ; un critère critique en échec → pas d’acceptation ; disponibilité ou connexion en échec → diagnostiquer et annoncer le recours aux captures. Les échéances se mettent à jour avec la décision ; elles ne se déduisent pas automatiquement des jours-personne.

## Responsables des réponses dans le scénario

| Signal | Réalisation | Contrôle / décision |
| --- | --- | --- |
| Surcharge | Dorian replanifie avec Hugo et Inès | Claire arbitre le périmètre |
| Anomalie critique | Hugo corrige ; Léa adapte le parcours si nécessaire | Inès recontrôle ; Dorian clôt |
| Version indisponible | Sami diagnostique et prépare le secours | Dorian décide de la démonstration |
| Consigne inaccessible | Léa adapte les supports | Inès reformule ; Dorian vérifie les conditions |
