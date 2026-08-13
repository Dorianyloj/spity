# Collaborer avec le support Spity

Spity est actuellement maintenu par une petite équipe sans service support séparé. Pour rester adapté au projet, le rôle de support niveau 1 peut être tenu par le product owner ou un utilisateur pilote, et le niveau 2 par le mainteneur technique. Le référentiel Bloc 4 autorise une mise en situation professionnelle réelle ou fictive.

## Répartition des responsabilités

| Activité | Support niveau 1 | Mainteneur niveau 2 | Product owner |
| --- | --- | --- | --- |
| Recevoir et anonymiser le retour | Responsable | Informé | Informé |
| Reproduire le parcours utilisateur | Responsable | Consulté | Consulté |
| Qualifier priorité et impact | Consulté | Consulté | Responsable |
| Analyser journaux, code et données techniques | Informé | Responsable | Informé |
| Développer et tester le correctif | Informé | Responsable | Consulté |
| Valider le résultat fonctionnel | Responsable | Consulté | Responsable si impact métier |
| Répondre à l'utilisateur et clôturer | Responsable | Fournit l'explication technique | Informé |

## Informations collectées

- date, canal et rôle utilisateur anonymisé ;
- version/révision, navigateur, écran et préconditions ;
- résultat observé, résultat attendu, fréquence et impact ;
- étapes minimales de reproduction ;
- captures ou journaux strictement anonymisés ;
- contournement éventuel et urgence métier.

Les mots de passe, jetons, adresses privées, exports de base et données personnelles sont interdits dans les tickets.

## Flux de traitement

1. Le support crée une issue avec `support-client.yml` et vérifie l'anonymisation.
2. Il reproduit le cas et propose P1 à P4.
3. Le mainteneur confirme ou ajuste la priorité, relie une fiche d'anomalie et expose ses hypothèses.
4. Support et technique conviennent d'un résultat vérifiable avant le développement.
5. Le correctif suit la CI/CD ; le mainteneur transmet version, cause et test de non-régression.
6. Le support rejoue le parcours, confirme le résultat et rédige une réponse compréhensible.
7. Le ticket est clôturé avec les contributions de chaque partie et une recommandation éventuelle.

## Délais cibles

| Priorité | Accusé de réception | Qualification | Objectif de résolution |
| --- | --- | --- | --- |
| P1 | 30 min | 1 h | Rétablissement ou rollback en priorité absolue. |
| P2 | 4 h ouvrées | 1 jour ouvré | Correctif dans le prochain lot urgent. |
| P3 | 1 jour ouvré | 3 jours ouvrés | Planification dans une itération. |
| P4 | 3 jours ouvrés | Backlog mensuel | Arbitrage produit. |

Ces délais sont des objectifs internes, pas un engagement contractuel 24/7.

## Registre de collaboration

Chaque collaboration support/mainteneur clôturée est consignée dans `support-collaborations/` sous la forme `SPITY-SUP-YYYY-NNNN.json`. La fiche lie le contexte anonymisé, une anomalie source, les critères fonctionnels, l'expertise technique, les transmissions entre rôles, la validation support et les preuves. La politique `support-collaboration-policy.json` impose le cycle `open` → `technical-analysis` → `awaiting-support-validation` → `closed`.

La commande `npm run support:check` refuse notamment une simulation non déclarée, une transmission manquante du support vers le mainteneur ou en retour, une clôture sans validation support, une preuve hors dépôt, une URL non HTTPS ou une donnée sensible. `npm run support:exercise` rejoue ces erreurs uniquement en mémoire. Le workflow `Support collaboration` exécute le contrôle à chaque modification concernée et mensuellement, avec rapport conservé 90 jours.

## Mise en situation Bloc 4

`SPITY-SUP-2026-0001` reprend l'anomalie réelle de contraste `SPITY-INC-2026-0001`. Le rôle support, le retour et la validation fonctionnelle sont une simulation contrôlée et explicitement identifiée ; les constats techniques, le correctif et les résultats CI sont réels et vérifiables. La fiche ne prétend ni à un échange client authentique ni à un déploiement de production.
