# 04 — C4.3 : Amélioration, versions et support

Les trois compétences C4.3 installent une boucle d'apprentissage : mesurer les sujets à améliorer, conserver l'historique des versions, puis organiser la réponse entre le support et la maintenance technique.

## C4.3.1 — Proposer des axes d'amélioration

### Attendu et réponse

Une recommandation doit être réaliste, argumentée et permettre de comparer coûts, délais et gains attendus. Spity utilise le registre `spity/improvements/` : chaque fiche versionnée relie une source, un impact, un risque réduit, une confiance, un effort, un coût en jours.homme, un délai, un rollback et des indicateurs de référence/cible.

La formule `impact × 3 + risque réduit × 2 + confiance − effort` ordonne les priorités actives. Le contrôleur refuse un ordre qui contredit cette formule, une donnée sensible ou une fiche clôturée sans résultat mesuré.

| Priorité | Objectif | Indicateur de résultat |
| --- | --- | --- |
| 1 | Mémoriser les métriques de supervision | Couverture p95 et disponibilité mesurées. |
| 2 | Étendre les contrats API critiques | Part des contrats effectivement testés. |
| 3 | Qualifier les futurs retours | Zone, type de signal et bénéfice attendu renseignés. |
| 4 | Étudier l'évolution Drizzle | Étude isolée, sans changement de lockfile automatique. |

La revue mensuelle est automatisée et conserve son rapport. Le product owner arbitre valeur, coût et délai ; le mainteneur valide faisabilité, mesures et rollback.

**Vérifier :** `npm run improvements:check` puis `npm run improvements:exercise`.

**Sources et preuves :** `spity/IMPROVEMENT_MANAGEMENT.md`, `spity/improvements/`, `spity/improvement-policy.json`, `.github/workflows/improvement-review.yml` et `B4-C431-01` à `B4-C431-03`.

## C4.3.2 — Établir le journal des versions déployées

### Attendu et réponse

Le journal doit documenter les versions et les correctifs effectivement déployés, sans transformer un candidat CI en déploiement réel. Les fiches JSON de `spity/release-journal/` utilisent trois statuts factuels :

| Statut | Sens | Justificatif attendu |
| --- | --- | --- |
| `published` | Version publiée | Tag et publication GitHub. |
| `observed-production` | Version réellement observée en production | Santé `ok` avec version et SHA exacts. |
| `candidate` | Candidat validé hors production | Résultat CI ou staging, explicitement non promu. |

Une fiche contient la version SemVer, le SHA complet, les évolutions, les correctifs, les risques, le rollback, l'historique et les preuves associées. Le validateur bloque les identités incohérentes, les preuves non accessibles, les secrets et un correctif sans documentation.

**Vérifier :** `npm run releases:check` puis `npm run releases:exercise`.

**Sources et preuves :** `spity/RELEASE_JOURNAL.md`, `spity/release-journal/`, `spity/release-journal-policy.json`, `.github/workflows/release-journal.yml` et `B4-C432-01` à `B4-C432-03`.

## C4.3.3 — Collaborer avec le support

### Attendu et réponse

La collaboration doit rendre visible le contexte fonctionnel, l'analyse technique, le correctif et la validation de la résolution. Spity formalise ce dialogue dans `spity/support-collaborations/` par des fiches `SPITY-SUP-YYYY-NNNN` liées aux incidents.

| Étape | Contribution support | Contribution maintenance |
| --- | --- | --- |
| Ouverture | Contexte anonymisé, écrans touchés, impact et critères fonctionnels. | Qualification technique initiale. |
| Analyse | Clarification du comportement attendu. | Cause racine, priorité et solution proposée. |
| Validation | Rejeu des critères fonctionnels. | Transmission des validations techniques et des limites de déploiement. |
| Clôture | Confirmation de résolution dans le scénario déclaré. | Historique et preuves contrôlables. |

Le cas fourni porte sur un contraste insuffisant des états vides. La fiche contient trois critères d'acceptation, l'analyse d'héritage de couleurs, la correction du composant, les résultats Lighthouse/Playwright/CI et une validation support simulée. La simulation est explicitement déclarée : elle prouve le protocole de collaboration, pas l'existence d'un utilisateur réel.

Le contrôleur rejette une fiche sans simulation déclarée, sans escalade, sans retour d'expertise, sans validation support à la clôture, sans preuve valide ou contenant une donnée sensible.

**Vérifier :** `npm run support:check` puis `npm run support:exercise`.

**Sources et preuves :** `spity/SUPPORT.md`, `spity/support-collaborations/`, `spity/support-collaboration-policy.json`, `.github/workflows/support-collaboration.yml` et `B4-C433-01` à `B4-C433-03`.

## À retenir pour l'entretien

Les améliorations ne sont pas présentées comme des promesses floues, les versions ne sont pas déclarées déployées sans observation et la collaboration support ne mélange pas le vécu fonctionnel avec l'analyse technique. Les trois registres rendent ces distinctions contrôlables à tout moment.
