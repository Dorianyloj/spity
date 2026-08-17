# Bloc 4 - Revue finale de complétude

**Projet :** Spity
**Référentiel :** Expert en développement logiciel Ynov 2024, pages 15 à 17
**Date de la revue :** 17 août 2026

## Objet de la revue

Cette revue donne au jury une lecture directe des sept compétences du Bloc 4. Elle ne remplace pas les sources opérationnelles : elle montre comment retrouver, rejouer et contrôler les mécanismes réellement versionnés.

La commande `npm run bloc4:check` vérifie ensemble les sept déclarations du dossier, les sources opérationnelles, les preuves JSON, les registres vivants et tous les SHA-256 du manifeste. Elle ne contacte ni la production, ni une base de données, ni un service externe.

## Grille de conformité

| Compétence | Attendu du référentiel | Réponse opérationnelle Spity | Contrôle reproductible | Preuve principale |
| --- | --- | --- | --- | --- |
| C4.1.1 | Fréquence, périmètre et type de mises à jour | Dependabot hebdomadaire, revue mensuelle, politique npm/Actions et SBOM | `npm run dependencies:check` | `B4-C411-03` |
| C4.1.2 | Sondes, seuils, signalement et disponibilité | Sonde santé 15 min, seuil latence, SLO 30 jours, incidents uniques et scripts d'alerte compilés | `npm run monitoring:slo` et `npm run workflows:scripts:check` | `B4-C412-04` et `B4-C412-05` |
| C4.2.1 | Collecte structurée, fiche reproductible, analyse et préconisation | Registre d'incidents, cycle contrôlé, formulaires et confidentialité | `npm run incidents:check` et `npm run incidents:exercise` | `B4-C421-03` |
| C4.2.2 | Correctif décrit, intégré et déployé par CI/CD | Vérification version/SHA, staging immuable, smoke test et rollback | `npm run bloc4:deployment-exercise` | `B4-C422-04` |
| C4.3.1 | Recommandations argumentées, réalistes et mesurables | Backlog priorisé, coûts/délais, indicateurs et revue mensuelle | `npm run improvements:check` et `npm run improvements:exercise` | `B4-C431-02` |
| C4.3.2 | Journal de versions et correctifs déployés documentés | Identité SemVer/SHA, corrections, santé et rollback | `npm run releases:check` et `npm run releases:exercise` | `B4-C432-02` |
| C4.3.3 | Contexte, résolution et contributions support/technique | Registre de transmissions, critères fonctionnels et expertise L2 | `npm run support:check` et `npm run support:exercise` | `B4-C433-02` |

## Contrôles de cohérence transversaux

1. Chaque compétence a une documentation d'exploitation, des données structurées, une automatisation et au moins une preuve datée.
2. Les incidents, améliorations, versions et collaborations support sont revalidés depuis leur source de vérité à chaque `npm run bloc4:check`.
3. Le manifeste `preuves/MANIFEST.sha256` couvre le dossier, les politiques, les scripts, les workflows, les tests et les preuves stables ; toute dérive de contenu échoue. Le PDF final est contrôlé séparément par son empreinte détachée.
4. Les simulations sont explicitement déclarées. Le cas support C4.3.3 ne prétend ni à un retour client réel ni à un déploiement de production.
5. La production n'est jamais déclarée mise à jour sur la seule base d'une CI verte. La preuve C4.2.2 confirme un staging validé et la preuve C4.3.2 distingue version observée, version publiée et candidat.

## État de clôture

Les sept compétences sont **industrialisées et vérifiées**. Les preuves P1 à P8, l'audit transversal et les captures A18/A19 sont intégrés au PDF final. Les prochaines actions de maintenance restent séparées de ce constat : traiter les futures alertes, enregistrer les retours réellement reçus et ne promouvoir une nouvelle version qu'après les portes de release prévues.
