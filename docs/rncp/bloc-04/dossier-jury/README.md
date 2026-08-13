# Dossier de remise — Bloc 4 Spity

Ce dossier est la porte d'entrée de remise du Bloc 4 : **maintenir l'application logicielle en condition opérationnelle**. Il traduit les mécanismes réellement versionnés de Spity en une lecture claire pour le jury, sans remplacer les sources techniques ni les preuves datées.

## Parcours recommandé

| Durée disponible | Lecture conseillée | Résultat attendu |
| --- | --- | --- |
| 5 minutes | Ce fichier, puis la [revue finale](../REVUE_FINALE_BLOC_04.md) | Voir les 7 compétences, leurs contrôles et leurs preuves principales. |
| 20 minutes | Les documents 01 à 05 dans l'ordre | Comprendre le projet, les décisions et les limites assumées. |
| Vérification complète | La [matrice de preuves](annexes/MATRICE_DE_PREUVES.md), les preuves et les commandes | Rejouer les contrôles sur les données et les sources versionnées. |

## Contenu du dossier

1. [01 — Cadrage du projet et méthode](01_CADRAGE_PROJET.md) : périmètre, architecture, rôles et règles de transparence.
2. [02 — C4.1 : maintenance et supervision](02_C4_1_MAINTENANCE_ET_SUPERVISION.md) : dépendances, sondes, alertes et SLO.
3. [03 — C4.2 : anomalies et correctifs](03_C4_2_ANOMALIES_ET_CORRECTIFS.md) : registre d'incidents, CI/CD, staging et rollback.
4. [04 — C4.3 : amélioration, versions et support](04_C4_3_EVOLUTION_RELEASE_SUPPORT.md) : backlog, journal de versions et collaboration support/mainteneur.
5. [05 — Preuves, reproductibilité et entretien](05_PREUVES_REPRODUCTIBILITE_ET_ENTRETIEN.md) : comment contrôler le dossier et le présenter.
6. [Annexes](annexes/) : [matrice de preuves](annexes/MATRICE_DE_PREUVES.md) et [glossaire](annexes/GLOSSAIRE.md).

## Documents de référence

- [Dossier détaillé Bloc 4](../DOSSIER_BLOC_04.md) : récit complet et index des annexes ;
- [Revue finale](../REVUE_FINALE_BLOC_04.md) : une ligne par compétence avec commande et preuve ;
- [Feuille de route](../PLAN_ACTION_BLOC_04.md) : état réel et définition de terminé ;
- [Répertoire des preuves](../preuves/README.md) : captures figées, exercices et manifeste ;
- [Référentiel officiel](../../referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf) : pages 15 à 17.

## Ce que le dossier permet d'affirmer

Chaque compétence est accompagnée d'une documentation d'exploitation, d'un mécanisme versionné, d'un contrôle reproductible et d'au moins une preuve datée. Les sept compétences sont contrôlées ensemble par `npm run bloc4:check`.

Le dossier ne confond jamais une simulation, un staging validé et une promotion de production. En particulier, le cas de support est une mise en situation explicitement déclarée et l'instance de production observée est saine mais n'est pas présentée comme mise à jour par la seule réussite d'une CI.

## Vérification rapide

Depuis le répertoire `spity/` :

```bash
npm run bloc4:check
npm run test:maintenance
npm run quality
```

Ces contrôles n'utilisent pas le LXC. Le premier vérifie les sept compétences, les sources, les registres, les preuves JSON et les empreintes SHA-256 du manifeste.
