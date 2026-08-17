# Bloc 4 - Feuille de route compétence par compétence

**Démarrage :** 12 août 2026

**Dernière mise à jour :** 17 août 2026

**Projet :** Spity

J'ai traité le Bloc 4 comme un travail de maintenance appliqué au projet, et pas seulement comme un exercice de rédaction. Pour considérer une compétence terminée, j'ai exigé une mise en œuvre identifiable, des tests, une preuve datée et une procédure que je peux expliquer ou rejouer.

## État réel

| Ordre | Compétence | Fonctionnement présent | État d'approfondissement |
| --- | --- | --- | --- |
| 1 | C4.1.1 - Gérer les mises à jour | Dependabot, politique exécutable, audit planifié, SBOM, revue PR, lot compatible qualifié | **Terminé et vérifié** |
| 2 | C4.1.2 - Superviser et alerter | Politique versionnée, sondes qualifiées, alerte/rétablissement uniques, SLO 30 jours, couverture et exercice local | **Terminé et vérifié** |
| 3 | C4.2.1 - Consigner les anomalies | Registre JSON validé, cycle de vie, cause racine, confidentialité, formulaires et CI dédiée | **Terminé et vérifié** |
| 4 | C4.2.2 - Créer et déployer un correctif | Correctif de contrôle de promotion, CI/release, artefacts de vérification et rollback documenté | **Terminé et vérifié** |
| 5 | C4.3.1 - Proposer des améliorations | Registre mesurable, revue mensuelle, signaux qualifiés et CI dédiée | **Terminé et vérifié** |
| 6 | C4.3.2 - Tenir le journal des versions | Registre JSON, version/SHA, documentation des correctifs, preuve de santé, exercice et workflow mensuel | **Terminé et vérifié** |
| 7 | C4.3.3 - Collaborer avec le support | Registre contrôlé, transmissions support/mainteneur, validation fonctionnelle, exercice et CI mensuelle | **Terminé et vérifié** |

## Définition de terminé

Pour chaque ligne, les cinq conditions suivantes sont obligatoires :

1. le mécanisme fonctionne réellement dans le dépôt ou dans un environnement contrôlé ;
2. les erreurs importantes sont détectées automatiquement et produisent une action exploitable ;
3. les cas sain, dégradé et limite sont testés ;
4. les résultats sont datés, reproductibles et sans données sensibles ;
5. la procédure indique fréquence, responsabilités, décision et retour arrière.

La suite de contrôle finale comprend 152 tests Jest, 47 tests de maintenance, 11 scénarios MariaDB, 6 recettes Playwright, les audits Lighthouse et le contrôle `npm run bloc4:check`.

## C4.1.1 - Résultat obtenu

- [x] dépendances npm et GitHub Actions surveillées chaque semaine ;
- [x] correctifs/mineures regroupés, versions majeures isolées ;
- [x] politique JSON bloquant les vulnérabilités hors dérogation ;
- [x] dérogations et versions verrouillées avec propriétaire, motif et expiration ;
- [x] audit production/complet et SBOM CycloneDX générés sous Node 22 ;
- [x] workflow planifié avec artefact, ticket unique et fermeture après récupération ;
- [x] revue des nouvelles dépendances sur chaque pull request ;
- [x] mise à jour réelle du lockfile et qualification de la régression `@hookform/resolvers`/Ajv ;
- [x] couverture Jest, scénarios MariaDB, recettes Playwright et audits Lighthouse intégrés aux portes de qualité ;

## C4.1.2 - Résultat obtenu

- [x] politique de supervision versionnée : cadence, seuils, SLO, couverture minimale et règles d’alerte ;
- [x] sonde publique qualifiant S1/S2/S3, disponibilité réelle et causes actionnables ;
- [x] artefacts de sonde et de calcul SLO conservés 90 jours ;
- [x] issue unique pour incident de sonde, issue unique pour brèche SLO, commentaire et fermeture au rétablissement ;
- [x] objectif de disponibilité 99,5 % sur 30 jours calculé quotidiennement à partir des seuls runs planifiés ;
- [x] protection anti-bruit : pas d’alerte SLO avec moins de 96 observations ou 95 % de couverture ;
- [x] exercice local sain, indisponible et lent ; couverture dédiée des décisions de sonde et de SLO.
- [x] extraction et compilation automatique des blocs `actions/github-script`, avec preuve datée et cas de régression syntaxique testé.

Les limites restantes sont explicites : l’historique de latence P95, les ressources système et les Web Vitals devront rejoindre une plateforme de métriques persistantes. Aucun déploiement de production n’est déclenché par ces workflows.

## C4.2.1 - Résultat obtenu

- [x] registre versionné avec identifiants stables, sévérité, priorité, impact, propriétaire et preuves ;
- [x] machine à états contrôlée de `reported` à `closed`, avec refus des sauts, retours non autorisés et historiques non chronologiques ;
- [x] reproduction, cause racine, facteurs contributifs, décision, alternatives, actions et vérification obligatoires selon l’état ;
- [x] détection automatique des jetons, secrets, adresses privées, e-mails et clés privées dans toute fiche ;
- [x] deux anomalies réelles migrées honnêtement : une correction d’accessibilité clôturée, une dérive de release toujours planifiée ;
- [x] formulaires GitHub de signalement, rapport CI conservé 90 jours et couverture dédiée du cycle de vie ;
- [x] exercice en mémoire validant le cas conforme, la transition interdite et le rejet d’un jeton simulé.

## C4.2.2 - Résultat obtenu

- [x] traitement de la dérive `SPITY-INC-2026-0002` par un contrôle de promotion réutilisable, sans déploiement fictif ;
- [x] contrôle de santé exigeant désormais la version **et** la révision Git attendues ;
- [x] refus explicite des métadonnées incohérentes, classé `S3/deployment-verification` et documenté ;
- [x] exécution automatique après le smoke test de staging et avant la promotion de la candidate de release ;
- [x] rapport JSON conservé dans les artefacts CI/CD, scripts inclus dans le bundle de release ;
- [x] exercice local en mémoire : candidat conforme accepté, version et révision erronées refusées ;
- [x] contrôle de santé, incidents, SLO et décisions de promotion couverts par la suite de maintenance finale ;
- [x] preuve supplémentaire C422-04 : staging GitHub Actions validé après qualité, intégration, Lighthouse et recette BC02, sans prétendre à une production observée.

## C4.3.1 - Résultat obtenu

- [x] registre versionné de quatre améliorations avec identifiant, statut, priorisation et décision attribuée ;
- [x] formule de score exécutable, ordre de priorité contrôlé et refus des doublons ;
- [x] coût, délai, retour arrière et indicateurs de référence/cible obligatoires pour chaque proposition ;
- [x] signaux opérationnels et retour support simulé clairement déclaré, sans inventer de données utilisateur réelles ;
- [x] formulaire support enrichi pour qualifier les prochains retours anonymisés par zone, type de signal et bénéfice attendu ;
- [x] workflow mensuel, artefact 90 jours, exercice local et couverture dédiée des décisions de pilotage.

## C4.3.2 - Résultat obtenu

- [x] registre versionné à trois états : release publiée, version observée en production et candidat non déployé ;
- [x] identité SemVer/SHA, historique, rollback, évolutions et preuves obligatoires pour chaque fiche ;
- [x] documentation obligatoire de chaque correctif, avec lien vers la fiche d'anomalie ou le changelog ;
- [x] preuve de production exigeant `status: ok`, version et révision Git strictement concordantes ;
- [x] refus des chemins de preuve externes au dépôt, URLs non HTTPS et données sensibles ;
- [x] porte de qualité, contrôle de fiche pour chaque tag, workflow mensuel avec artefact 90 jours, bundle de release enrichi et couverture dédiée ;
- [x] exercice en mémoire : candidat CI faussement déployé, correctif sans documentation et santé incohérente refusés.

## C4.3.3 - Résultat obtenu

- [x] registre versionné de collaborations `SPITY-SUP-YYYY-NNNN` reliant contexte, anomalie source, critères fonctionnels, expertise technique et preuves ;
- [x] cycle contrôlé de `open` à `closed`, transmissions chronologiques obligatoires du support vers le mainteneur puis en retour ;
- [x] simulation contrôlée explicitement déclarée, identité du contact non collectée et distinction stricte entre CI validée et production observée ;
- [x] clôture refusée sans validation support, sans critères d'acceptation, sans cause racine ou sans retour d'expertise technique ;
- [x] détection des secrets, jetons, IP privées, e-mails, URLs non HTTPS et chemins de preuve hors dépôt ;
- [x] workflow mensuel, artefact 90 jours, exercice en mémoire et couverture dédiée de la collaboration support.

J'ai appliqué la même définition de terminé aux sept compétences. Pour la suite, les nouveaux retours du support devront être enregistrés comme tels, sans modifier la mise en situation déjà présente dans le dossier.

## Revue finale transversale

- [x] politique de revue des sept compétences, des sources opérationnelles, des preuves et du manifeste ;
- [x] commande `npm run bloc4:check` ajoutée à la porte `quality`, avec deux tests dédiés ;
- [x] rapport de lecture jury `REVUE_FINALE_BLOC_04.md` reliant l'attendu, le mécanisme, la commande et la preuve de chaque compétence ;
- [x] preuve C422-04 ajoutée pour le staging CI réellement validé ;
- [x] manifeste SHA-256 réconcilié avec les sources et preuves stables, puis empreinte détachée du PDF final ;
- [x] preuves textuelles P1 à P8 et captures A18/A19 intégrées directement dans le PDF remis.

## Règle de présentation

Le dossier et le PDF reprennent le travail que j'ai vérifié pour chaque compétence : automatisation, cas d'échec, preuves et procédure d'exploitation. Si le projet évolue, je devrai mettre à jour les preuves correspondantes et continuer à signaler clairement les mises en situation.
