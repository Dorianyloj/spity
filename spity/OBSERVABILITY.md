# Superviser Spity

Cette procédure définit un dispositif de supervision exploitable pour Spity. Sa source de vérité technique est `monitoring-policy.json` : toute modification de cadence, seuil ou SLO doit passer par une revue de code, les tests de maintenance et les deux workflows GitHub Actions.

## Objectifs de service

| Indicateur | Objectif | Mesure et décision |
| --- | --- | --- |
| Disponibilité | 99,5 % sur 30 jours glissants | Une exécution planifiée réussie compte comme disponible ; un échec `failure`, `timed_out` ou `action_required` compte comme indisponible. Une fenêtre est exploitable seulement à partir de 96 échantillons et 95 % de couverture. |
| Détection | 15 minutes visées | La sonde planifiée interroge la route publique toutes les 15 minutes. GitHub peut différer un cron : le délai est observé par la couverture, pas garanti en temps réel. |
| Latence | 3 000 ms maximum par sonde | Au-delà, l’état est `degraded`, gravité S3, sans transformer abusivement le service en indisponibilité. |
| Reprise | S1/S2 : moins de 30 minutes pendant une plage de maintenance active | Le mainteneur qualifie l’issue unique, conserve les preuves puis applique le runbook adapté. |

Le calcul SLO ne crée une alerte de disponibilité que si la couverture est suffisante. Une fenêtre trop courte ou incomplète est `insufficient-data` : elle est visible, mais elle ne génère pas de faux incident.

## Sondes et contrat contrôlé

`GET /api/health` confirme l’application et sa connexion MariaDB. `scripts/check-health.mjs`, appelé par `scripts/run-production-monitor.mjs`, contrôle :

| Contrôle | Code de qualification | Gravité | Impact disponibilité |
| --- | --- | --- | --- |
| HTTP non 2xx, timeout ou erreur réseau | `http_status`, `timeout`, `network_error` | S1 | Oui |
| JSON invalide ou `status` différent de `ok` | `invalid_json`, `application_status` | S1 | Oui |
| Version ou révision absente | `metadata_missing` | S2 | Non, mais contrat de supervision invalide |
| Révision différente de `EXPECTED_REVISION` | `revision_mismatch` | S3 | Non |
| Latence supérieure au seuil | `latency_threshold` | S3 | Non |

Une sonde réalise une tentative initiale et deux reprises, avec timeout de 15 secondes. Chaque rapport expose `status`, `availability`, `classification`, les tentatives, les seuils et les indicateurs observés. Il ne contient ni secret, ni donnée personnelle, ni réponse HTTP brute.

## Automatisation et conservation

1. **Production monitoring** s’exécute toutes les 15 minutes ou manuellement pour un exercice encadré. Il écrit `.monitoring/production-health.json`, publie un résumé GitHub Actions et conserve l’artefact 90 jours.
2. Tout état autre que `healthy` ouvre ou actualise une seule issue `[Incident production] Supervision en échec`, étiquetée `bug`. La gravité, le code, l’impact et le lien du run y sont repris sans contenu sensible.
3. La première sonde saine ajoute un commentaire de retour à la normale et ferme cette issue unique.
4. **Availability SLO report** s’exécute chaque jour à 06:17 UTC. Il consulte les runs *planifiés* de `production-monitoring.yml`, exclut les déclenchements manuels, calcule la disponibilité, la couverture et la fenêtre de 30 jours, puis conserve son JSON 90 jours.
5. Une disponibilité sous 99,5 % avec couverture suffisante ouvre ou actualise une seule issue `[SLO production] Disponibilité sous l’objectif`. Elle est fermée uniquement après un rapport `compliant`.

Le workflow SLO utilise `actions: read`, conformément au moindre privilège, et ne consomme que l’historique GitHub Actions du dépôt. Les annulations et résultats neutres ne sont pas assimilés à une indisponibilité ; ils réduisent la couverture, ce qui rend le manque de données explicite.

## Exploitation d’une alerte

| Gravité | Première action | Suite et clôture |
| --- | --- | --- |
| S1 | Geler les déploiements, vérifier le run et la route publique, préserver journaux et horodatages. | Isoler réseau, application ou base ; appliquer le rollback documenté si nécessaire ; valider une sonde saine avant clôture. |
| S2 | Vérifier la version, la révision et le contrat `/api/health`. | Corriger ou restaurer les métadonnées ; consigner la cause dans l’issue avant le retour à la normale. |
| S3 | Vérifier le seuil, la révision attendue et l’impact utilisateur. | Créer une action d’amélioration ou de déploiement ; ne clôturer qu’après mesure conforme ou décision documentée. |

Le formulaire `incident-production.yml` impose date, gravité, version, reproduction, preuves, analyse, validation et clôture. Le mainteneur relie l’issue d’alerte à cette fiche lorsque l’investigation dépasse le simple rétablissement automatique.

## Vérification contrôlée

```bash
npm run bloc4:exercise
npm run test:maintenance
```

L’exercice lance uniquement un serveur HTTP local éphémère. Il vérifie un cas sain, un HTTP 503/applicatif avec deux tentatives et une latence excessive classée S3 mais encore disponible. La preuve versionnée `B4-C412-03` ne touche ni la production, ni MariaDB, ni un LXC.

## Limites connues et prochaine amélioration

Les rapports de sonde individuels sont conservés 90 jours dans les artefacts ; le SLO quotidien exploite les conclusions des runs et expose donc la disponibilité et la couverture de façon durable. La latence est contrôlée à chaque sonde mais son P95 historique n’est pas encore agrégé depuis les artefacts. CPU, mémoire, disque, taux d’erreur applicatif, traces et Core Web Vitals ne sont pas non plus couverts.

La prochaine amélioration mesurée consiste à exporter des métriques persistantes (latence, erreurs, ressources et Web Vitals) vers un tableau de bord avec rétention, puis à enrichir le SLO de performance sans modifier la définition de disponibilité ci-dessus.
