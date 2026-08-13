# Journal des versions déployées

## Finalité

Le registre `release-journal/` est la source de vérité C4.3.2. Il rend traçables les versions publiées, les versions effectivement observées après déploiement et les candidats qui ne doivent pas être confondus avec une mise en production. Il complète `CHANGELOG.md` : le changelog explique l'évolution produit ; le journal rattache cette évolution à une identité version/révision, aux correctifs documentés et à une preuve de déploiement lorsqu'elle existe.

## Statuts contrôlés

| Statut | Signification | Peut compter comme déployé ? |
| --- | --- | --- |
| `published` | Tag et release GitHub publiés. | Non, sans preuve d'observation. |
| `observed-production` | Santé de production `ok`, version et SHA complets concordants. | Oui. |
| `candidate` | CI ou staging validés, sans preuve de santé en production. | Non. |

Une fiche `observed-production` exige l'environnement `production`, une observation datée et la réponse de santé avec exactement la même version et la même révision que l'identité déclarée. Une fiche candidate qui serait étiquetée à tort comme déployée est donc refusée.

## Contenu obligatoire

Chaque fiche contient une identité SemVer/SHA, les fonctionnalités et correctifs, les liens de documentation de chaque correctif, les risques ou limites utiles, le rollback, l'historique attribué et les preuves. Les chemins de preuves restent dans le dépôt et les URLs doivent utiliser HTTPS. Les secrets, jetons, e-mails et adresses privées sont refusés.

## Exploitation

```bash
npm run releases:check
npm run releases:exercise
npm run bloc4:releases
```

La validation est exécutée à chaque modification du journal et au premier jour de chaque mois par le workflow `Release journal`. Elle génère un rapport conservé 90 jours. La CI de release exige en plus une fiche `candidate` ou `published` correspondant à la version taguée. Lors d'une future promotion, le mainteneur complète ensuite l'observation post-déploiement : la validation du candidat ne remplace jamais la preuve de production.

Le mainteneur renseigne identité, changements, correctifs, risques et rollback ; le responsable de release vérifie les preuves et la chronologie ; la supervision atteste l'observation de production. Tout retour arrière est inscrit comme une nouvelle fiche ou une nouvelle décision, sans réécrire l'historique Git.
