# Bloc 4 - Feuille de route compétence par compétence

**Démarrage :** 12 août 2026

**Dernière mise à jour :** 13 août 2026

**Projet :** Spity

Le Bloc 4 est développé comme un chantier produit, pas comme une simple rédaction. Une compétence n'est déclarée industrialisée que lorsque le dépôt contient un fonctionnement réel, une automatisation, des tests, des preuves reproductibles et une procédure d'exploitation.

## État réel

| Ordre | Compétence | Fonctionnement présent | État d'approfondissement |
| --- | --- | --- | --- |
| 1 | C4.1.1 - Gérer les mises à jour | Dependabot, politique exécutable, audit planifié, SBOM, revue PR, lot compatible qualifié | **Industrialisée et vérifiée** |
| 2 | C4.1.2 - Superviser et alerter | Route de santé, sonde, workflow planifié et exercice local | Base fonctionnelle à approfondir |
| 3 | C4.2.1 - Consigner les anomalies | Formulaire GitHub et deux fiches reproductibles | Base fonctionnelle à approfondir |
| 4 | C4.2.2 - Créer et déployer un correctif | CI complète, release par tag, rollback documenté | Base fonctionnelle à approfondir |
| 5 | C4.3.1 - Proposer des améliorations | Backlog chiffré et priorisé | Base documentaire à transformer en boucle de pilotage |
| 6 | C4.3.2 - Tenir le journal des versions | Changelog, release et version/révision de santé | Base fonctionnelle à approfondir |
| 7 | C4.3.3 - Collaborer avec le support | Formulaire support et exercice fictif déclaré | Base fonctionnelle à approfondir |

## Définition de terminé

Pour chaque ligne, les cinq conditions suivantes sont obligatoires :

1. le mécanisme fonctionne réellement dans le dépôt ou dans un environnement contrôlé ;
2. les erreurs importantes sont détectées automatiquement et produisent une action exploitable ;
3. les cas sain, dégradé et limite sont testés ;
4. les résultats sont datés, reproductibles et sans données sensibles ;
5. la procédure indique fréquence, responsabilités, décision et retour arrière.

## C4.1.1 - Résultat obtenu

- [x] dépendances npm et GitHub Actions surveillées chaque semaine ;
- [x] correctifs/mineures regroupés, versions majeures isolées ;
- [x] politique JSON bloquant les vulnérabilités hors dérogation ;
- [x] dérogations et versions verrouillées avec propriétaire, motif et expiration ;
- [x] audit production/complet et SBOM CycloneDX générés sous Node 22 ;
- [x] workflow planifié avec artefact, ticket unique et fermeture après récupération ;
- [x] revue des nouvelles dépendances sur chaque pull request ;
- [x] mise à jour réelle du lockfile et qualification de la régression `@hookform/resolvers`/Ajv ;
- [x] 152 tests Jest, 8 tests de maintenance, 11 scénarios MariaDB, 6 recettes Playwright et audits Lighthouse verts.

## Prochaine étape : C4.1.2

La reprise suivante doit transformer la supervision actuelle en véritable dispositif d'exploitation : historique durable des mesures, objectifs SLI/SLO, alertes anti-bruit, tableau de bord, mesure de disponibilité, escalade testée et preuve de récupération. Aucun déploiement de production ne sera déclenché sans autorisation explicite.

## Règle de présentation

Le dossier et le PDF restent des livrables de travail tant que les sept compétences n'ont pas franchi la même définition de terminé. Les bases existantes sont conservées, mais elles ne sont pas présentées comme industrialisées avant leur reprise dédiée.
