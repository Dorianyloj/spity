# 03 — C4.2 : Anomalies et correctifs

Dans cette partie, je pars d'un signal observé dans Spity, puis je montre comment je l'ai qualifié et traité. J'ai séparé le constat fonctionnel, l'analyse technique et le déploiement afin de conserver une chronologie lisible.

## C4.2.1 — Consigner les anomalies détectées

### Attendu

Une anomalie doit être collectée de façon structurée, décrite pour être reproductible, analysée, puis accompagnée d'une préconisation. Sa clôture doit reposer sur une vérification et non sur une simple déclaration.

### Ce que j'ai mis en place

Le signal initial est recueilli via une issue avec les informations minimales : date, impact, version/révision, reproduction, preuves anonymisées et confirmation de confidentialité. Après triage, une fiche `SPITY-INC-YYYY-NNNN` devient la source de vérité dans `spity/incidents/`.

| Étape du cycle | But |
| --- | --- |
| `reported` puis `triaged` | Conserver le signal et qualifier son impact. |
| `investigating` | Reproduire et analyser la cause. |
| `planned` puis `resolving` | Prendre une décision traçable et mettre en œuvre l'action. |
| `validating`, `resolved`, `closed` | Vérifier l'effet, consigner la preuve et fermer seulement si le résultat est conforme. |

Le contrôleur refuse notamment un identifiant dupliqué, une transition interdite, une clôture sans vérification, une chronologie incohérente ou une donnée sensible. Deux exemples réels sont conservés : une correction d'accessibilité clôturée après validations et une dérive de production qui reste planifiée tant qu'aucune release autorisée n'a été faite.

### Vérifier

```bash
npm run incidents:check
npm run incidents:exercise
```

L'exercice teste le registre sain et des erreurs représentatives, sans modifier les données versionnées.

**Sources et preuves :** `spity/INCIDENT_MANAGEMENT.md`, `spity/incidents/`, `spity/incident-policy.json`, `spity/scripts/check-incident-registry.mjs`, et les preuves `B4-C421-01` à `B4-C421-04` dans `../preuves/`.

## C4.2.2 — Créer et déployer un correctif via CI/CD

### Attendu

Le candidat doit décrire un correctif, l'intégrer et le déployer par une chaîne CI/CD. La validation doit garantir que le bon binaire est vérifié et que l'on n'affirme pas un déploiement qui n'a pas été observé.

### Ce que j'ai mis en place

L'anomalie de dérive entre la révision de production observée et la référence auditée a conduit à un contrôle de promotion explicite. `verify-deployment.mjs` exige, avant acceptation d'un candidat, l'URL de santé, la version attendue et le SHA Git complet attendu.

```text
Image immuable par SHA
        -> staging éphémère
        -> smoke test
        -> contrôle version + révision
        -> rapport conservé
        -> candidat de release
```

Une application disponible avec une version ou une révision différente est classée comme vérification de déploiement échouée. Elle n'est pas assimilée à une release réussie. La CI applique ce contrôle après le smoke test de staging ; la release applique le même contrat avant toute promotion stable.

### Rejouer et interpréter la preuve

```bash
npm run bloc4:deployment-exercise
```

L'exercice démarre uniquement un serveur HTTP local en mémoire. Il accepte un candidat cohérent, puis refuse séparément une version et une révision inattendues. La preuve `B4-C422-04` ajoute une exécution GitHub Actions réellement réussie sur `develop`, avec qualité, MariaDB, Lighthouse, recette, staging, image immuable et artefact de vérification.

Cette preuve dit exactement ce qu'elle prouve : un staging validé. Elle ne prétend pas qu'une promotion de production a eu lieu.

### Retour arrière

Un rollback remet le tag d'image immuable précédent, rejoue le contrôle de version/révision et journalise la décision. Une restauration MariaDB exige une sauvegarde et une validation explicite si une migration empêche le retour de l'ancienne application. L'historique Git n'est jamais réécrit.

**Sources et preuves :** `spity/RELEASE_VERIFICATION.md`, `spity/DEPLOYMENT.md`, `spity/scripts/verify-deployment.mjs`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, et `B4-C422-01` à `B4-C422-04` dans `../preuves/`.

## À retenir pour l'entretien

La démonstration repose sur une chaîne que je peux rejouer, pas seulement sur une capture de CI. L'incident reste ouvert tant que la production n'a pas été promue, le staging est identifié comme tel et le script compare le binaire observé au binaire attendu.
