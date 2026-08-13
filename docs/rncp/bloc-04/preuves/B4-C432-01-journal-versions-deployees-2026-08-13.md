# B4-C432-01 - Journal des versions déployées

## Exemplaire présenté

La source de vérité est désormais `spity/release-journal/`, validée par `npm run releases:check`. Elle distingue les états sans les confondre :

| Fiche | Identité | Statut | Évolutions ou correctifs | Preuve déterminante |
| --- | --- | --- | --- | --- |
| `SPITY-REL-2026-0001` | `v0.1.0` / `0bdd4e7` | `published` | Parcours escalade, Docker, CI et métadonnées de santé. | Release GitHub et `CHANGELOG.md`. |
| `SPITY-REL-2026-0002` | `0.1.0-jury` / `49c4ea0` | `observed-production` | Correctif des dépendances runtime vulnérables. | Santé publique `ok`, version et SHA concordants. |
| `SPITY-REL-2026-0003` | `0.1.0` / `e3784b7` | `candidate` | Correctif de contraste des états vides. | CI verte, explicitement insuffisante pour déclarer la production. |

## Correctif déployé et documentation

La fiche observée rattache le correctif de sécurité à `CHANGELOG.md`, à la preuve `B4-C422-01` et à la santé `B4-C412-02`. Son rollback, son historique et les liens de preuve sont obligatoires. Un correctif déployé sans documentation est bloqué par le validateur.

## Tenue durable

Chaque nouvelle promotion ajoute une fiche après contrôle post-déploiement, avec version SemVer, SHA complet, changements, corrections, risques, rollback et preuves. `published` et `candidate` sont utiles à la traçabilité, mais seul `observed-production` compte comme déployé. Le workflow mensuel et les preuves C432-02/C432-03 rendent cette règle vérifiable.
