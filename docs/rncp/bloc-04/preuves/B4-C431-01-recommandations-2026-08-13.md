# B4-C431-01 - Revue initiale des améliorations

## Méthode reprise dans le registre

La revue initiale devient le backlog versionné `spity/improvements/`. La formule contrôlée est :

```text
score = impact * 3 + risque réduit * 2 + confiance - effort
```

Chaque priorité conserve une cible mesurable, un coût, un délai, un responsable, une décision et un retour arrière. Le contrôleur refuse désormais un score erroné, un indicateur sans cible, une priorité contraire au score ou une donnée personnelle dans un retour.

| Priorité | Amélioration | Score | Délai | Coût | Gain mesurable | Décision |
| --- | --- | ---: | --- | --- | --- | --- |
| 1 | Conserver métriques et tableau de bord | 26 | 3 jours | 2,5 j.h | 95 % de fenêtres avec p95 et disponibilité mesurables | Approuvée |
| 2 | Étendre les contrats API critiques | 20 | 5 jours | 4 j.h | 70 % des contrats critiques avec test dédié | Approuvée |
| 3 | Qualifier les retours produit anonymisés | 19 | 2 jours | 1,5 j.h | 100 % des futurs retours avec zone, signal et bénéfice | Approuvée |
| 4 | Qualifier l'outillage Drizzle | 13 | 3 jours d'étude | 3 j.h | 0 alerte d'outillage non qualifiée | En étude |

## Sources et limites honnêtes

Les deux premières priorités sont fondées sur les politiques de supervision, les tests CI et la dette de couverture. La troisième s'appuie sur une mise en situation support explicitement fictive : elle sert à livrer l'instrumentation de collecte, pas à prétendre que des retours utilisateurs réels existent déjà. Le formulaire GitHub recueille dès maintenant les prochains signaux anonymisés.

La promotion de release déjà renforcée par C4.2.2 n'est plus répétée comme recommandation active : elle est traitée par le correctif de vérification version/révision. La production n'est pas modifiée par cette revue.

## Revue et décision

Le product owner arbitre une fois par mois avec le mainteneur. Une amélioration peut être approuvée, lancée, différée, rejetée ou clôturée seulement avec une mesure vérifiée. Les actions réversibles restent privilégiées : désactivation du collecteur, retrait d'un test instable documenté, retour du formulaire ou abandon d'une branche d'étude. Aucune migration ni mise à jour forcée n'est autorisée par cette seule priorisation.
