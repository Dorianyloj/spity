# B4-C432-01 - Journal des versions déployées

## Versions publiées et observées

| Date | Version | Révision | État | Contenu principal | Preuve |
| --- | --- | --- | --- | --- | --- |
| 20 juillet 2026 | `v0.1.0` | `0bdd4e7a350094657b8037ee0714ca0ee0617310` | Release GitHub publiée | Parcours d'inscription, profils, lieux, matching, événements, Docker, CI, sécurité et documentation BC02. | `https://github.com/Dorianyloj/spity/releases/tag/v0.1.0` |
| 23 juillet 2026 | `0.1.0-jury` | `49c4ea0ffa34b35e9ad5bc2e1a838eb82eb0b8ef` | Observée en production le 13 août 2026 | Correctif des dépendances runtime vulnérables et instance jury disponible. | `https://spity.fr/api/health` et commit GitHub `49c4ea0` |

## Correctifs déployés documentés

La révision de production `49c4ea0` correspond au commit `fix(security): update vulnerable runtime dependencies`. La réponse de santé contient simultanément `status`, `version` et `revision`, ce qui relie le logiciel exécuté à son historique Git.

## Candidat non déployé

La révision `e3784b7` a une CI complète verte et corrige le contraste des états vides. Elle n'est pas ajoutée au tableau des versions déployées, car la production expose toujours `49c4ea0`. Une future entrée devra être créée uniquement après promotion et contrôle post-déploiement.

## Règle de tenue du journal

Chaque release ajoute : date UTC/Europe-Paris, tag SemVer, SHA complet, digests d'images, migrations, anomalies corrigées, nouvelles fonctions, risques connus, procédure de retour arrière et lien de vérification. `CHANGELOG.md` décrit les changements produit ; ce journal atteste uniquement ce qui est effectivement publié ou observé.
