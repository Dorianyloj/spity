# 02 — C4.1 : Maintenance et supervision

Cette partie couvre les deux compétences préventives du Bloc 4 : garder les composants à jour et observer l'application de manière adaptée. Elles sont complémentaires : la première réduit le risque connu, la seconde détecte une dérive ou une indisponibilité en exploitation.

## C4.1.1 — Gérer les mises à jour des dépendances

### Attendu

Le processus doit préciser la fréquence, le périmètre et le type de mises à jour. Il doit aussi démontrer que les changements sont qualifiés avant leur intégration.

### Réponse mise en œuvre

Dependabot inspecte npm chaque lundi à 06:00 et les GitHub Actions à 06:30, en fuseau Europe/Paris. Une revue mensuelle complète cette cadence avec les versions disponibles, l'audit npm, les images et les notes de version.

| Type de mise à jour | Traitement |
| --- | --- |
| Correctif de sécurité de production | Priorité immédiate, contrôle renforcé et CI obligatoire. |
| Mise à jour mineure compatible | Regroupement possible, revue et tests avant fusion. |
| Mise à jour majeure | Pull request isolée, analyse de rupture, recette ciblée et stratégie de retour arrière. |
| Exception connue | Documentée avec propriétaire, expiration et contrôle automatique. |

Le périmètre inclut npm, les actions GitHub, Node.js, les navigateurs CI et les images. Il exclut les secrets et les données, qui ne sont jamais modifiés automatiquement.

### Résultat vérifiable

Le contrôle `npm run dependencies:check` exécute les audits de dépendances, applique la politique, vérifie les exceptions, inventorie les retards et produit un SBOM CycloneDX. La CI hebdomadaire conserve les artefacts 90 jours ; une revue de dépendance bloque également l'introduction d'une dépendance vulnérable en pull request.

Les preuves montrent la qualification d'un lot d'outillage et l'absence d'alerte haute ou critique après contrôle. Les alertes modérées restantes sont connues et encadrées : elles ne sont pas ignorées, elles ont une justification, un propriétaire et une échéance.

**Sources et preuves à présenter :**

- `spity/MAINTENANCE.md` et `spity/dependency-policy.json` ;
- `spity/scripts/check-dependency-policy.mjs` ;
- `.github/workflows/dependency-maintenance.yml` et `dependency-review.yml` ;
- `../preuves/B4-C411-01-audit-dependances-2026-08-13.json` à `B4-C411-03-controle-dependances-2026-08-13.json`.

## C4.1.2 — Concevoir la supervision et l'alerte

### Attendu

La supervision doit être adaptée au service, définir des sondes et seuils pertinents, caractériser disponibilité et performance, puis signaler les incidents sans produire de faux positifs.

### Réponse mise en œuvre

La route `/api/health` expose un état applicatif, la connexion MariaDB, la version et la révision sans révéler de secret. Une politique versionnée définit une sonde toutes les 15 minutes, un timeout de 15 secondes, deux tentatives et un seuil de latence de 3 secondes.

| Signal observé | Niveau | Action |
| --- | --- | --- |
| Erreur HTTP, réseau, timeout, JSON invalide ou état applicatif incorrect | S1 | Incident unique, investigation puis rétablissement vérifié. |
| Métadonnées version/révision absentes | S2 | Contrôle du contrat de supervision et correction prioritaire. |
| Latence élevée ou révision inattendue | S3 | Investigation performance ou déploiement, sans déclarer une indisponibilité fictive. |

Le SLO porte sur 30 jours et 99,5 % de disponibilité. Seuls les runs planifiés entrent dans le calcul. Une fenêtre avec moins de 96 observations ou moins de 95 % de couverture est explicitement classée `insufficient-data` : elle ne crée pas d'alerte de disponibilité trompeuse.

### Résultat vérifiable

`npm run monitoring:probe` contrôle la santé publique de manière explicite. `npm run monitoring:slo` calcule la couverture et la disponibilité à partir des rapports retenus. L'exercice `npm run bloc4:exercise` rejoue en mémoire un cas sain, un échec applicatif après reprises et une dégradation de latence S3. `npm run workflows:scripts:check` compile les blocs JavaScript des workflows d'alerte avant leur exécution distante.

**Sources et preuves à présenter :**

- `spity/OBSERVABILITY.md` et `spity/monitoring-policy.json` ;
- `spity/scripts/check-health.mjs` et `spity/scripts/evaluate-monitoring-window.mjs` ;
- `.github/workflows/production-monitoring.yml` et `availability-slo-report.yml` ;
- `../preuves/B4-C412-01-historique-supervision-2026-08-13.json` à `B4-C412-04-slo-supervision-2026-08-13.json` ;
- `../preuves/B4-C412-05-validation-scripts-alertes-2026-08-17.json`.

## À retenir pour l'entretien

Le dispositif ne se limite pas à « surveiller si le site répond ». Il distingue l'indisponibilité, une rupture de contrat et une performance dégradée ; il conserve les rapports, évite les faux incidents liés à une période trop courte et relie une alerte à un cycle d'incident contrôlé.
