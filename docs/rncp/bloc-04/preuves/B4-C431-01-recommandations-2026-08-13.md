# B4-C431-01 - Recommandations d'amélioration

## Méthode

Les propositions sont notées sur 5 selon l'impact utilisateur, la réduction du risque et l'effort. La priorité favorise l'impact et la réduction du risque, puis pénalise l'effort : `score = impact + risque réduit - effort`.

| Priorité | Recommandation | Impact | Risque réduit | Effort | Score | Délai | Coût estimé | Gain mesurable |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | Ajouter métriques persistantes et tableau de bord | 5 | 5 | 3 | 7 | 3 jours | 2 à 3 j.h puis 0,5 j.h/mois | MTTD inférieur à 15 min, disponibilité et latence mensuelles démontrables. |
| 2 | Promouvoir une release alignée avec `main` | 5 | 5 | 2 | 8 | 1 à 2 jours | 1 j.h hors fenêtre de surveillance | Supprimer l'écart de 19 commits et exposer version/SHA exacts. |
| 3 | Porter la couverture des API critiques à 70 % | 4 | 4 | 4 | 4 | 5 jours | 3 à 5 j.h | Réduire les régressions auth, événements, matching et migrations. |
| 4 | Industrialiser le support et les retours terrain | 4 | 3 | 2 | 5 | 2 jours | 1,5 j.h puis 0,25 j.h/semaine | 100 % des tickets qualifiés avec version, reproduction et réponse. |
| 5 | Réduire la dette des outils Drizzle/esbuild | 3 | 3 | 4 | 2 | Étude de 3 jours | 2 à 4 j.h selon migration | Supprimer les quatre alertes modérées de développement sans rétrogradation. |

## Recommandation 1 - Observabilité persistante

Ajouter un collecteur de métriques ou un service d'uptime avec rétention, puis un tableau de bord : disponibilité, p50/p95 de latence, erreurs HTTP, saturation mémoire/CPU, espace disque MariaDB et échecs de tâches. Conserver la sonde GitHub comme contrôle externe.

## Recommandation 2 - Release alignée

Préparer `v0.1.1`, vérifier sauvegarde, migrations, digests et smoke test, puis promouvoir avec le workflow existant. Le risque principal est une migration ou une configuration d'environnement ; le retour arrière documenté réduit ce risque.

## Recommandation 3 - Tests des chemins critiques

La couverture globale dépasse juste le seuil de 60 %, alors que plusieurs route handlers restent à 0 % Jest et sont surtout couverts en intégration. Ajouter des tests de contrat ciblés sur authentification, permissions, événements, matching et erreurs MariaDB.

## Recommandation 4 - Support terrain

Utiliser le formulaire support, mesurer accusé de réception, délai de qualification, délai de résolution et réouverture. Une revue mensuelle transforme les retours récurrents en backlog produit.

## Recommandation 5 - Dette Drizzle

Tester une version amont de Drizzle Kit sur une branche dédiée avec génération et migration d'une base jetable. Ne jamais appliquer la rétrogradation proposée automatiquement sans comparer le schéma et les migrations.

## Arbitrage

Les priorités 1 et 2 apportent le plus grand gain opérationnel. La priorité 2 exige une autorisation explicite de déploiement ; elle reste donc préparée mais non exécutée dans ce dossier. Les recommandations sont réalisables sans refonte de l'application.
