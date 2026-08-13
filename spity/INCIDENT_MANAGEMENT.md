# Gérer les anomalies Spity

Cette procédure transforme un signal GitHub en incident exploitable, traçable et vérifiable. Une issue est un canal de collecte ; la source de vérité technique est une fiche JSON versionnée dans `incidents/`, validée par `incident-policy.json` et `scripts/check-incident-registry.mjs`.

## Principes non négociables

- aucune fiche ne contient de mot de passe, jeton, secret, adresse IP privée, adresse e-mail, export de base ou réponse brute ;
- chaque incident reçoit un identifiant `SPITY-INC-YYYY-NNNN` qui ne change jamais ;
- un état déclaré doit correspondre à une transition chronologique autorisée ;
- une fiche résolue ou clôturée contient une cause racine, une décision, une action corrective, une vérification et une clôture ;
- une issue de production ne vaut pas déploiement : le traitement d’un correctif suit séparément `DEPLOYMENT.md`.

## Flux d’exploitation

| Étape | Responsable | Sortie vérifiable |
| --- | --- | --- |
| Signaler | Support, utilisateur pilote ou automatisation | Issue `Incident de production` ou `Anomalie produit ou qualité`, données anonymisées. |
| Trier | Mainteneur et product owner | Identifiant, sévérité S1-S4, priorité P1-P4, impact, propriétaire et prochaine action. |
| Reproduire | Mainteneur | Préconditions, étapes minimales, observé, attendu et fréquence. |
| Investiguer | Mainteneur | Méthode, cause racine, facteurs contributifs et périmètre. |
| Décider | Product owner avec mainteneur | Option retenue, alternatives écartées, risque et actions correctives/préventives. |
| Valider | Mainteneur et, si nécessaire, support | Tests, CI, résultat, révision et contrôle post-déploiement lorsque celui-ci est autorisé. |
| Clôturer | Responsable de la fiche | Date, rôle, résultat compréhensible, lien vers les preuves et recommandation éventuelle. |

## Cycle de vie contrôlé

```text
reported -> triaged -> investigating -> planned -> resolving -> validating -> resolved -> closed
                    \-> rejected / duplicate
```

`planned` reste un état ouvert : il formalise la décision sans inventer une correction ou un déploiement. Seules les transitions déclarées dans `incident-policy.json` sont acceptées. Une correction réouverte repart de `resolved` vers `resolving` ; aucune fiche clôturée ne peut être modifiée silencieusement.

## Commandes et portes qualité

```bash
npm run incidents:check
npm run incidents:exercise
npm run bloc4:incidents
```

`incidents:check` analyse toutes les fiches, vérifie les références de dépôt, les transitions, les obligations de clôture et les motifs de données sensibles. Il est inclus dans `npm run quality`. Le workflow GitHub `Incident registry` le rejoue sur les changements concernés, produit un rapport JSON et conserve l’artefact 90 jours.

L’exercice ne manipule que des objets JSON en mémoire : il accepte le registre canonique, refuse une transition `reported -> closed` et refuse un jeton Bearer simulé. Il ne contacte ni production, ni base de données, ni LXC.

## Gravité et décisions initiales

| Gravité | Exemple | Décision initiale |
| --- | --- | --- |
| S1 | Indisponibilité, perte ou corruption de données suspectée | Geler les déploiements, préserver les horodatages et activer le runbook d’incident. |
| S2 | Fonction critique ou accessibilité bloquante | Reproduction prioritaire, correction et validation avant la prochaine promotion. |
| S3 | Dérive de release, latence ou fonction secondaire dégradée | Consigner, mesurer, planifier une action et contrôler le risque utilisateur. |
| S4 | Défaut mineur sans blocage | Qualifier puis intégrer au backlog selon l’impact. |

Les priorités P1 à P4 décrivent l’ordre de traitement métier ; elles ne remplacent jamais la gravité technique. Les objectifs de réponse support sont définis dans `SUPPORT.md`.

## Limite assumée

La création de la fiche JSON après le signal est volontairement validée par un mainteneur : elle exige une anonymisation et une analyse qui ne doivent pas être automatisées à l’aveugle. En revanche, une fois versionnée, sa structure, son intégrité et son absence de marqueurs sensibles sont contrôlées automatiquement.
