# 01 — Cadrage du projet et méthode

## 1. Le projet maintenu

Spity est un réseau social consacré à la communauté de l'escalade. Le Bloc 4 ne présente pas un prototype de maintenance : il documente les processus qui permettent à l'équipe de maintenir l'application, détecter les dérives, qualifier les anomalies, préparer un correctif et conserver une trace exploitable des décisions.

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

La finalité est de rendre chaque action maintenable et vérifiable. Une mise à jour de dépendance, un incident, une recommandation ou une release ne doit pas dépendre d'un souvenir oral ou d'une capture isolée. Pour être considéré terminé, un élément doit avoir :

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

Dans la configuration actuelle, le rôle support est représenté par une simulation contrôlée. Cette modalité est annoncée dans les preuves concernées : elle sert à démontrer le processus, jamais à inventer un retour client réel.

## 4. Principe de transparence

Le dossier distingue trois états :

| État | Ce qui peut être affirmé | Exemple dans Spity |
| --- | --- | --- |
| Contrôle local | Un contrat ou une règle a été rejoué de façon isolée. | Exercice qui refuse une mauvaise version ou un SHA inattendu. |
| Staging validé | La chaîne CI a construit et vérifié un candidat dans un environnement éphémère. | Images immuables, smoke test et contrôle version/révision sur `develop`. |
| Production observée | L'instance publique répond avec une version et une révision identifiées. | Route `/api/health` saine et fiche `observed-production`. |

Une CI verte ne suffit donc pas à déclarer une production promue. De même, une donnée simulée ne devient pas un retour utilisateur réel. Cette séparation est une exigence de qualité du dossier, pas une faiblesse à masquer.

## 5. Où retrouver l'information

- Le [dossier détaillé](../DOSSIER_BLOC_04.md) explique les décisions compétence par compétence.
- La [revue finale](../REVUE_FINALE_BLOC_04.md) permet une lecture directe des sept attendus.
- La [matrice de preuves](annexes/MATRICE_DE_PREUVES.md) relie chaque attendu à une source, une commande et une preuve.
- Le [glossaire](annexes/GLOSSAIRE.md) explicite les termes de maintenance employés dans le dossier.
