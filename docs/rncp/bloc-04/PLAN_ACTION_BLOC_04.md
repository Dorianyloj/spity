# Bloc 4 - État des lieux et plan d'action

**Certification :** Expert en développement logiciel

**Projet support :** Spity

**Date de cadrage :** 12 août 2026

## 1. Modalité d'évaluation

Le candidat remet un dossier écrit présentant la gestion du monitoring, le traitement des anomalies et la maintenance d'un logiciel développé au cours de sa formation.

Le référentiel officiel demande sept compétences :

- C4.1.1 : gérer les mises à jour des dépendances ;
- C4.1.2 : concevoir un système de supervision et d'alerte ;
- C4.2.1 : consigner les anomalies détectées ;
- C4.2.2 : créer et déployer un correctif via l'intégration et le déploiement continus ;
- C4.3.1 : proposer des améliorations argumentées ;
- C4.3.2 : établir un journal des versions déployées ;
- C4.3.3 : collaborer avec le support client sur un problème complexe.

## 2. Matrice de conformité initiale

| Compétence | Preuves déjà disponibles | Écart à combler | Statut |
| --- | --- | --- | --- |
| C4.1.1 | [Dependabot](../../../.github/dependabot.yml), `package.json`, `package-lock.json`, audit npm dans la CI et mise à jour de sécurité du 12 août 2026 | Capturer une pull request Dependabot validée par la CI et expliciter l'évaluation d'impact | Partiel |
| C4.1.2 | [Route de santé](../../../spity/src/app/api/health/route.ts), contrôles de staging/release et [workflow de supervision](../../../.github/workflows/production-monitoring.yml) | Produire l'historique d'exécution, une alerte contrôlée et sa résolution | Partiel |
| C4.2.1 | [Registre BC02](../../bc02/11_PLAN_CORRECTION_BOGUES_C232.md), historique de correctifs et [formulaire d'incident](../../../.github/ISSUE_TEMPLATE/incident-production.yml) | Consigner une anomalie de production réelle avec contexte, reproduction, analyse et décision | Partiel |
| C4.2.2 | [CI](../../../.github/workflows/ci.yml), [release](../../../.github/workflows/release.yml), modèle de pull request et commits `fix(...)` | Sélectionner un incident, relier le correctif, les tests, le déploiement et la vérification de production | Partiel |
| C4.3.1 | [État des lieux](../../audits/2026-08-12-etat-des-lieux-projet.md), résultats de couverture, audit npm et décalage de déploiement | Chiffrer coût, délai, risque et gain attendu pour chaque recommandation retenue | Partiel |
| C4.3.2 | [`CHANGELOG.md`](../../../CHANGELOG.md), version `0.1.0`, tags, release GitHub et métadonnées de santé | Ajouter la prochaine release déployée avec ses correctifs et sa révision | Présent à consolider |
| C4.3.3 | Aucun échange de support réel versionné | Réaliser et documenter un cas avec contexte, retour, résolution et contribution de chaque partie | À produire |

## 3. Plan de réalisation

### Phase 1 - Stabiliser le socle

1. [x] remettre la couverture Jest au-dessus des seuils sans les abaisser : 60,16 % des lignes, 59,07 % des fonctions et 77,56 % des branches ;
2. [x] intégrer les mises à jour non cassantes et conserver la décision motivée pour les alertes résiduelles ;
3. [ ] remettre `main`, CI et production sur une révision cohérente.

### Phase 2 - Produire les preuves d'exploitation

1. laisser le workflow de supervision s'exécuter selon sa planification ;
2. déclencher un exercice d'alerte contrôlé sans dégrader les données ;
3. consigner l'événement avec le formulaire d'incident ;
4. documenter diagnostic, correctif, tests, déploiement, vérification et retour arrière disponible.

### Phase 3 - Couvrir la maintenance et le support

1. prioriser trois améliorations à partir des indicateurs techniques et des retours utilisateurs ;
2. chiffrer leur coût, délai, risque et gain ;
3. documenter un échange réel avec un utilisateur pilote ou une personne assurant le support ;
4. mettre à jour le changelog et associer chaque correctif à une version déployée.

### Phase 4 - Assembler le dossier jury

1. rédiger un chapitre par compétence ;
2. associer chaque affirmation à une preuve datée et reproductible ;
3. ajouter les captures utiles sans dupliquer les sources ;
4. vérifier les liens, les versions et les révisions ;
5. exporter puis relire le PDF final page par page.

## 4. Critères de fin

Le bloc ne sera considéré prêt que lorsque :

- les sept compétences possèdent au moins une preuve vérifiable ;
- une anomalie est documentée de sa détection jusqu'à sa vérification en production ;
- une alerte de supervision est visible et expliquée ;
- le journal des versions correspond aux révisions réellement déployées ;
- la collaboration support repose sur un cas réel ;
- la CI de la révision présentée est verte.
