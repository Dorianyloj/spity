# B4-C422-02 - Traitement d'un correctif par la chaîne CI/CD

## Cas 1 - Correctif de sécurité effectivement déployé

La production expose la révision `49c4ea0ffa34b35e9ad5bc2e1a838eb82eb0b8ef`, commit `fix(security): update vulnerable runtime dependencies` du 23 juillet 2026. La route de santé confirme que ce binaire communique avec MariaDB et reste disponible sous la version `0.1.0-jury`.

Le run CI associé a été annulé par la règle de concurrence lorsqu'un commit plus récent a été poussé. Ce point réduit la force de cette preuve prise isolément ; il est donc complété par le cas 2 et par la chaîne actuelle, désormais bloquante avant promotion.

## Cas 2 - Correctif d'accessibilité entièrement validé

1. détection par la recette CI authentifiée ;
2. reproduction locale Windows, Linux, Chrome stable et base MariaDB vierge ;
3. correctifs atomiques `e5b4433`, `da7ebfb`, `e3784b7` ;
4. tests ciblés puis qualité complète ;
5. push SSH sur `main` ;
6. CI `31604246584` verte : qualité, MariaDB/accessibilité, Lighthouse public et six recettes BC02 ;
7. artefacts de couverture, intégration, accessibilité, Lighthouse et acceptation conservés par GitHub.

Le correctif n'est pas présenté comme déployé en production : la dérive est consignée séparément. Le workflow `Release` impose validation, images immuables, smoke test, manifeste, bundle, environnement de production et GitHub Release avant toute promotion.

## Retour arrière

- application : remettre le tag d'image précédent et vérifier `/api/health` ;
- migration : restaurer uniquement si l'ancienne application est incompatible, à partir d'une sauvegarde vérifiée ;
- code : ne pas réécrire l'historique, produire un commit de revert traçable ;
- décision : consigner cause, impact, version, heure et résultat des tests de rétablissement.
