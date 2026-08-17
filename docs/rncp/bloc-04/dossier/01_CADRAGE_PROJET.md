# 01 — Cadrage du projet et méthode

## 1. Le projet maintenu

Spity est le réseau social consacré à l'escalade que j'ai utilisé comme support pour cette certification. Dans ce Bloc 4, je présente les processus que j'ai mis en place pour maintenir l'application, repérer une dérive, qualifier une anomalie, préparer un correctif et garder une trace des décisions.

Le périmètre technique comprend Next.js 16, React 19, TypeScript, Drizzle ORM, MariaDB, Docker et GitHub Actions. Les fichiers de l'application sont centralisés dans `spity/`, les automatisations dans `.github/workflows/`, et les documents de certification dans `docs/rncp/bloc-04/`.

```text
Signal ou changement
        |
        v
Contrôle automatisé -> Registre versionné -> Décision documentée
        |                      |                    |
        +-> CI / tests / audit +-> Preuve datée      +-> Release ou amélioration
```

## 2. Objectif de maintenance

Mon objectif est de pouvoir retrouver et expliquer chaque décision. Une mise à jour de dépendance, un incident, une recommandation ou une release ne doit pas dépendre d'un souvenir oral ou d'une capture isolée. Je considère un élément terminé lorsqu'il possède :

1. un besoin ou un signal identifié ;
2. une source de vérité versionnée ;
3. une règle de gestion claire ;
4. un contrôle automatisé ou rejouable ;
5. une preuve datée sans donnée sensible ;
6. une limite ou un statut réel explicitement annoncé.

Cette définition est vérifiée à l'échelle du Bloc 4 par la politique `spity/bloc4-audit-policy.json` et son contrôleur `spity/scripts/check-bloc4-completeness.mjs`.

## 3. Rôles et responsabilités

| Rôle | Responsabilités dans le Bloc 4 |
| --- | --- |
| Mainteneur | Qualifie les problèmes techniques, applique les correctifs, exécute les contrôles et prépare les releases. |
| GitHub Actions | Rejoue la qualité, les tests, les audits, le staging et les contrôles de registre. |
| Dependabot | Propose les mises à jour planifiées de dépendances npm et GitHub Actions. |
| Product owner | Arbitre les priorités, coûts, délais et bénéfices attendus des améliorations. |
| Support niveau 1 / pilote | Formalise le contexte fonctionnel et valide les critères d'acceptation lorsqu'un retour est disponible. |

Dans la configuration actuelle, j'ai représenté le rôle support par une mise en situation. Je le précise dans les preuves concernées : cette situation sert à montrer le processus et ne correspond pas à un retour client réel.

## 4. Principe de transparence

Le dossier distingue trois états :

| État | Ce qui peut être affirmé | Exemple dans Spity |
| --- | --- | --- |
| Contrôle local | Un contrat ou une règle a été rejoué de façon isolée. | Exercice qui refuse une mauvaise version ou un SHA inattendu. |
| Staging validé | La chaîne CI a construit et vérifié un candidat dans un environnement éphémère. | Images immuables, smoke test et contrôle version/révision sur `develop`. |
| Production observée | L'instance publique répond avec une version et une révision identifiées. | Route `/api/health` saine et fiche `observed-production`. |

Une CI verte ne me suffit donc pas pour déclarer une mise en production. De la même façon, je ne transforme pas une donnée simulée en retour utilisateur réel. Cette distinction est importante pour présenter l'état du projet tel qu'il est.

## 5. Où retrouver l'information

- Le [dossier détaillé](../DOSSIER_BLOC_04.md) explique les décisions compétence par compétence.
- La [revue finale](../REVUE_FINALE_BLOC_04.md) permet une lecture directe des sept attendus.
- La [matrice de preuves](annexes/MATRICE_DE_PREUVES.md) relie chaque attendu à une source, une commande et une preuve.
- Le [glossaire](annexes/GLOSSAIRE.md) explicite les termes de maintenance employés dans le dossier.
