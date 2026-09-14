# A04 - Arbitrages et aide à la décision

## 1. Cas historique : recette sur le build standalone

Nature : modification Git observée ; conséquences historiques rapportées par le dossier Bloc 2 ; comparaison d'options rédigée a posteriori.

Le commit 689e59dccf15dc611dbddccea9cf81ccc187c40c, daté du 20 juillet 2026, modifie la configuration Playwright, le workflow CI et le harnais de recette. La recette CI passe au serveur issu du build standalone. La documentation historique rapporte un run en échec avant cette modification et un run réussi après consolidation, sans retry.

| Option | Fidélité à l'artefact livré | Traitement de la cause | Effort supplémentaire |
| --- | --- | --- | --- |
| Délais plus longs et retries | Faible | Partiel ; masque possible | Faible |
| Préchauffage du mode développement | Partielle | Dépend des routes préparées | Moyen |
| Build standalone | Forte | Retire la compilation à froid pendant la recette | Build et configuration |

La décision effectivement visible dans le code est le build standalone. Le gain recherché est une recette reproductible et représentative du déploiement. La contrainte acceptée est le temps de construction préalable. La livraison reste dépendante des contrôles.

Sources : `git show 689e59d` ; dossier Bloc 2, cahier de recettes, section « Consolidation sur l'artefact standalone ». Les runs 29749715001 et 29750556481 ne sont pas réinterrogés dans cette preuve.

## 2. Cas simulé : demande de contributions aux topos à J10

Le client fictif demande une contribution aux topos, dans le contexte de SPI-22 observé en Backlog le 14 septembre (A09). Le scénario ajoute 12 h DEV et 4 h QA. Ces heures sont des hypothèses pédagogiques ; aucun chiffrage n'est extrait du ticket.

| Option du scénario | Coût économique à terminaison | Conséquence |
| --- | --- | --- |
| Ajouter la demande | 4 465 + 12 x 35 + 4 x 30 = 5 005 EUR | Dépasse de 308 EUR le plafond de 4 697 EUR ; DEV atteint 76 h pour 72 h disponibles. |
| Remplacer une partie de la recette | Dépend du travail retiré | Réduit la capacité à valider le périmètre déjà engagé ; écart qualité non accepté. |
| Reporter la demande dans un lot ultérieur | 4 465 EUR pour le lot engagé | Préserve les critères de recette et une marge de 232 EUR. |

Décision fictive retenue : reporter la demande, conserver ses critères dans le backlog et préparer une estimation lors d'une prochaine revue. Le client fictif valide cette option dans CR02. La fonction reportée n'est pas déclarée supprimée du produit ou absente du code actuel : l'exercice porte sur un lot pédagogique distinct.

Logique de décision : qualifier la demande ; estimer charge et coût ; vérifier la capacité et les critères de qualité ; si le plafond ou la capacité sont dépassés, proposer un report ou une renégociation explicite ; consigner la décision et mettre à jour le backlog. Un jalon ne suffit pas à justifier le contournement d'un contrôle critique.
