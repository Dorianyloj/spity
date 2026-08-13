# Pilotage des améliorations

## Finalité

Ce dispositif transforme les signaux d'exploitation et les retours qualifiés en décisions produit mesurables. Il répond à C4.3.1 sans confondre une recommandation, une amélioration approuvée et une livraison effective.

La source de vérité est `improvements/`. Chaque fiche est validée par `scripts/check-improvement-backlog.mjs` avant d'être étudiée en revue mensuelle.

## Données obligatoires

Chaque amélioration contient :

- un identifiant stable, son état, une description et un responsable de décision ;
- une priorité calculée par `impact * 3 + riskReduction * 2 + confidence - effort` ;
- un coût en jours.homme, un délai calendaire et un retour arrière ;
- au moins un indicateur avec référence, cible, unité, direction et méthode de mesure ;
- un signal opérationnel, un retour utilisateur anonymisé ou une simulation explicitement déclarée ;
- des preuves accessibles depuis le dépôt et un historique chronologique.

Les priorités actives sont uniques et doivent suivre le score décroissant puis l'effort croissant. Une fiche `completed` doit présenter un résultat vérifié ; une recommandation approuvée ne devient donc jamais une réalisation fictive.

## Revue mensuelle

| Rôle | Responsabilité |
| --- | --- |
| Product owner | Arbitre la priorité, le coût, le délai et l'acceptation du risque. |
| Mainteneur | Vérifie les indicateurs, les preuves, la faisabilité technique et le rollback. |
| Support niveau 1 / pilote | Qualifie le contexte et le bénéfice attendu sans conserver de donnée personnelle. |

À chaque premier jour du mois, le workflow `Improvement review` valide le registre, exécute ses tests et conserve le rapport 90 jours. La revue décide ensuite : approuver, lancer, différer, rejeter ou clôturer avec une mesure avant/après.

## Commandes

```bash
npm run improvements:check
npm run improvements:exercise
npm run bloc4:improvements
```

L'exercice utilise uniquement des données en mémoire. Il accepte le backlog canonique, refuse un score incohérent et refuse une adresse e-mail insérée dans une source de retour. Il ne contacte ni production, ni LXC, ni base de données.

## Retours et confidentialité

Le formulaire `support-client.yml` collecte désormais la zone fonctionnelle, le type de signal et le bénéfice attendu. Ces champs servent aux prochains retours réels anonymisés. À ce jour, le seul retour non opérationnel exploité dans le backlog est une simulation Bloc 4 explicitement identifiée ; elle ne vaut pas donnée utilisateur réelle.

Le registre rejette les secrets, jetons, clés privées, adresses IP privées et e-mails. Les pièces jointes, exports et identifiants personnels restent hors du dépôt.
