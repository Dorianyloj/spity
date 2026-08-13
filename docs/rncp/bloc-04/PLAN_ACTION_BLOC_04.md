# Bloc 4 - Feuille de route compétence par compétence

**Démarrage :** 12 août 2026

**Dernière mise à jour :** 13 août 2026

**Projet :** Spity

Le Bloc 4 est développé comme un chantier produit, pas comme une simple rédaction. Une compétence n'est déclarée industrialisée que lorsque le dépôt contient un fonctionnement réel, une automatisation, des tests, des preuves reproductibles et une procédure d'exploitation.

## État réel

| Ordre | Compétence | Fonctionnement présent | État d'approfondissement |
| --- | --- | --- | --- |
| 1 | C4.1.1 - Gérer les mises à jour | Dependabot, politique exécutable, audit planifié, SBOM, revue PR, lot compatible qualifié | **Industrialisée et vérifiée** |
| 2 | C4.1.2 - Superviser et alerter | Politique versionnée, sondes qualifiées, alerte/rétablissement uniques, SLO 30 jours, couverture et exercice local | **Industrialisée et vérifiée** |
| 3 | C4.2.1 - Consigner les anomalies | Registre JSON validé, cycle de vie, cause racine, confidentialité, formulaires et CI dédiée | **Industrialisée et vérifiée** |
| 4 | C4.2.2 - Créer et déployer un correctif | Correctif de contrôle de promotion, CI/release, artefacts de vérification et rollback documenté | **Industrialisée et vérifiée** |
| 5 | C4.3.1 - Proposer des améliorations | Registre mesurable, revue mensuelle, signaux qualifiés et CI dédiée | **Industrialisée et vérifiée** |
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

## C4.1.2 - Résultat obtenu

- [x] politique de supervision versionnée : cadence, seuils, SLO, couverture minimale et règles d’alerte ;
- [x] sonde publique qualifiant S1/S2/S3, disponibilité réelle et causes actionnables ;
- [x] artefacts de sonde et de calcul SLO conservés 90 jours ;
- [x] issue unique pour incident de sonde, issue unique pour brèche SLO, commentaire et fermeture au rétablissement ;
- [x] objectif de disponibilité 99,5 % sur 30 jours calculé quotidiennement à partir des seuls runs planifiés ;
- [x] protection anti-bruit : pas d’alerte SLO avec moins de 96 observations ou 95 % de couverture ;
- [x] exercice local sain, indisponible et lent ; 13 tests de maintenance couvrant les décisions de la sonde et du SLO.

Les limites restantes sont explicites : l’historique de latence P95, les ressources système et les Web Vitals devront rejoindre une plateforme de métriques persistantes. Aucun déploiement de production n’est déclenché par ces workflows.

## C4.2.1 - Résultat obtenu

- [x] registre versionné avec identifiants stables, sévérité, priorité, impact, propriétaire et preuves ;
- [x] machine à états contrôlée de `reported` à `closed`, avec refus des sauts, retours non autorisés et historiques non chronologiques ;
- [x] reproduction, cause racine, facteurs contributifs, décision, alternatives, actions et vérification obligatoires selon l’état ;
- [x] détection automatique des jetons, secrets, adresses privées, e-mails et clés privées dans toute fiche ;
- [x] deux anomalies réelles migrées honnêtement : une correction d’accessibilité clôturée, une dérive de release toujours planifiée ;
- [x] formulaires GitHub de signalement, rapport CI conservé 90 jours et 18 tests de maintenance ;
- [x] exercice en mémoire validant le cas conforme, la transition interdite et le rejet d’un jeton simulé.

## C4.2.2 - Résultat obtenu

- [x] traitement de la dérive `SPITY-INC-2026-0002` par un contrôle de promotion réutilisable, sans déploiement fictif ;
- [x] contrôle de santé exigeant désormais la version **et** la révision Git attendues ;
- [x] refus explicite des métadonnées incohérentes, classé `S3/deployment-verification` et documenté ;
- [x] exécution automatique après le smoke test de staging et avant la promotion de la candidate de release ;
- [x] rapport JSON conservé dans les artefacts CI/CD, scripts inclus dans le bundle de release ;
- [x] exercice local en mémoire : candidat conforme accepté, version et révision erronées refusées ;
- [x] 22 tests de maintenance couvrent la santé, les incidents, le SLO et les décisions de promotion.

## C4.3.1 - Résultat obtenu

- [x] registre versionné de quatre améliorations avec identifiant, statut, priorisation et décision attribuée ;
- [x] formule de score exécutable, ordre de priorité contrôlé et refus des doublons ;
- [x] coût, délai, retour arrière et indicateurs de référence/cible obligatoires pour chaque proposition ;
- [x] signaux opérationnels et retour support simulé clairement déclaré, sans inventer de données utilisateur réelles ;
- [x] formulaire support enrichi pour qualifier les prochains retours anonymisés par zone, type de signal et bénéfice attendu ;
- [x] workflow mensuel, artefact 90 jours, exercice local et 28 tests de maintenance couvrant les décisions de pilotage.

La prochaine étape est C4.3.2 : relier les livraisons réellement observées à un journal de versions immuable et vérifiable.

## Règle de présentation

Le dossier et le PDF restent des livrables de travail tant que les sept compétences n'ont pas franchi la même définition de terminé. Les bases existantes sont conservées, mais elles ne sont pas présentées comme industrialisées avant leur reprise dédiée.
