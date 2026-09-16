# A04 — Arbitrages appuyés sur le dépôt

## 1. Recette compilée — 20 juillet 2026

Trace : commit 689e59d, passage de la recette CI au build standalone. Problème décrit : les compilations du serveur de développement perturbent les vérifications. Le changement observable consiste à tester une construction compilée. La comparaison avec le préchauffage ou des tentatives supplémentaires est une analyse rétrospective, pas un procès-verbal historique.

## 2. Navigation — 15 septembre 2026

Signalement réel de Dorian : les clics de la navbar entraînent une attente importante. L’audit reproduit localement une longue initialisation du fond Vanta, alors que les réponses réseau arrivent rapidement dans l’échantillon.

| Choix analysé après coup | Avantage | Limite |
| --- | --- | --- |
| Conserver le fond animé | Maintenir son animation | Calcul bloquant observé toujours présent |
| Optimiser ou différer l’animation | Potentiellement garder le mouvement | Effet non mesuré dans les preuves disponibles |
| Remplacer par un SVG statique | Supprimer le calcul et conserver le motif | Perte de l’animation décorative |

Choix implémenté dans 83e4c29 : SVG topographique de 1 827 octets, suppression de p5/Vanta et indicateur d’attente. Les contrôles décrits dans l’audit ont réussi. Les temps médians des cinq parcours passent de 10 220 à 748 ms dans le protocole local indiqué. Aucun gain de production n’est chiffré.

La PR 35 regroupe ces changements avec les autres travaux de la branche, puis est fusionnée à 872db19. Le contrôle distant confirme la version le 15/09 à 21:39 UTC. La décision se défend avec son problème, son compromis, son changement et ses résultats ; aucun client réel n’est déclaré signataire.
