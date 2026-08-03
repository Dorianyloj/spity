# Tests d'intégration du prototype - C2.2.2

## 1. Objectif

Ce document complète le harnais unitaire décrit dans [`04_HARNAIS_TESTS_UNITAIRES.md`](./04_HARNAIS_TESTS_UNITAIRES.md). Il démontre les parcours critiques du prototype BC02 avec les composants réels suivants :

- serveur Next.js et Route Handlers ;
- cookies de session signés ;
- validation Zod et autorisations par rôle ;
- dépôts Drizzle ;
- migrations `0000` à `0004` ;
- base MariaDB 11.4.

Le test source est [`spity/tests/integration/api-workflows.test.mjs`](../../spity/tests/integration/api-workflows.test.mjs). Il utilise le module `node:test` fourni par Node.js 22 et l'API native `fetch`, sans mock du réseau ni de la base.

## 2. Stratégie retenue

Le scénario crée trois comptes éphémères avec un suffixe UUID : deux grimpeurs et un club. Il les utilise exclusivement via les endpoints HTTP publics. Les identifiants sont supprimés dans le hook de fin, même en cas d'échec, et les suppressions en cascade nettoient profils, demandes, événements et inscriptions.

Lorsqu'aucune URL n'est fournie, le test :

1. démarre Next.js sur `127.0.0.1:3102` ;
2. attend que `/api/health` confirme l'accès à MariaDB ;
3. exécute les scénarios dans un ordre déterministe ;
4. nettoie les comptes de test ;
5. arrête le processus Next.js.

Pour tester un serveur déjà actif, la variable `INTEGRATION_BASE_URL` évite de créer un second processus :

```bash
INTEGRATION_BASE_URL=http://127.0.0.1:3000 npm run test:integration
```

## 3. Cas automatisés

| ID | Domaine | Action | Résultat contrôlé |
| --- | --- | --- | --- |
| IT-AUTH-01 | Accès | Appeler le matching sans cookie | Réponse `401`, aucune donnée retournée. |
| IT-PROFILE-01 | Profils | Créer deux grimpeurs et un club | Réponses `201`, profils correspondant aux rôles. |
| IT-MATCH-01 | Matching | Consulter l'annuaire avec le premier grimpeur | Profil courant absent, second profil présent, champ `email` absent. |
| IT-MATCH-02 | Demandes | S'envoyer une demande | Réponse `422`. |
| IT-MATCH-03 | Demandes | Créer deux fois la même demande | Première réponse `201`, seconde `409`. |
| IT-MATCH-04 | Autorisation | Répondre comme émetteur puis comme destinataire | Émetteur refusé `403`, destinataire accepté `200`. |
| IT-SEC-01 | Origine | Muter avec une origine externe | Réponse `403`. |
| IT-EVENT-01 | Rôle | Créer un événement avec un grimpeur | Réponse `403`. |
| IT-EVENT-02 | Club | Créer un événement futur d'une place | Réponse `201`, capacité restante égale à 1. |
| IT-EVENT-03 | Concurrence | Envoyer deux inscriptions en parallèle | Une réponse `200`, une réponse `409`, un seul participant en base. |
| IT-EVENT-04 | Confidentialité | Lire l'événement comme club puis grimpeur | Le club voit un participant ; le grimpeur reçoit `participants: []`. |
| IT-EVENT-05 | Désinscription | Libérer puis reprendre la dernière place | Compteur remis à zéro puis nouvelle inscription `200`. |
| IT-EVENT-06 | Annulation | Annuler puis tenter une nouvelle inscription | Événement traçable comme annulé, inscription refusée `409`. |

Le cas IT-EVENT-03 sollicite directement la transaction et le verrou `FOR UPDATE` du dépôt. Il prouve que deux requêtes concurrentes ne dépassent pas la capacité, ce qu'un test unitaire isolé ne peut pas démontrer.

## 4. Intégration continue

Le workflow [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) contient un job indépendant `MariaDB integration tests` :

1. GitHub Actions démarre le service `mariadb:11.4` avec healthcheck ;
2. `npm ci` installe les versions verrouillées ;
3. `npm run db:migrate` applique tout l'historique Drizzle sur une base vide ;
4. `npm run test:integration` démarre Next.js et exécute le scénario ;
5. le résultat TAP est conservé dans l'artefact `integration-<SHA>` pendant 30 jours.

Le job est séparé de `Quality gates`. Un échec indique ainsi clairement si la régression concerne les tests unitaires/compilation ou l'intégration avec MariaDB.

## 5. Résultat local de référence

Exécution du 20 juillet 2026 sur Node.js 22, Next.js 16.2.10 et MariaDB 11.4 :

```text
tests 10
pass 10
fail 0
duration_ms 14467.552506
```

Les dix résultats TAP correspondent au scénario parent et à neuf sous-scénarios. Les 69 tests Jest continuent de s'exécuter séparément avec 97,87 % de lignes, 90,90 % de branches et 100 % de fonctions sur le périmètre unitaire déclaré.

Après l'exécution sur la base initialement vide, les tables `users`, `events`, `partnership_requests` et `event_registrations` contenaient chacune zéro ligne. Ce contrôle confirme le nettoyage des données éphémères.

### Résultat GitHub Actions

L'[exécution no 29740751753](https://github.com/Dorianyloj/spity/actions/runs/29740751753) a réussi sur le SHA `1e1cb16a9908257dba9b2e8f8e251c672ac0a6d4` :

- job `MariaDB integration tests` réussi ;
- migrations appliquées sur le service `mariadb:11.4` neuf ;
- 10 résultats TAP réussis ;
- artefact `integration-1e1cb16a9908257dba9b2e8f8e251c672ac0a6d4` de 898 octets conservé jusqu'au 19 août 2026.

## 6. Traçabilité et couverture

| User story | Preuve d'intégration |
| --- | --- |
| US-AUTH-01 / US-AUTH-02 | Création de comptes, cookies de session et refus anonyme. |
| US-PROFILE-01 / US-PROFILE-02 | Création et lecture des profils correspondant aux rôles. |
| US-MATCH-01 | Annuaire réel, exclusion du profil courant et confidentialité de l'adresse. |
| US-MATCH-02 | Unicité, auto-demande, autorisation du destinataire et acceptation. |
| US-EVENT-01 | Création par le club, contrôle du rôle et annulation persistée. |
| US-EVENT-02 | Lecture de l'événement, capacité et données publiques. |
| US-EVENT-03 | Concurrence, unicité, désinscription et réactivation. |
| US-EVENT-04 | Compteurs réels et participants visibles uniquement par le propriétaire. |

## 7. Limites

- Le test exerce les dépôts au travers des API, sans mesurer séparément leur couverture de lignes.
- Les formulaires React et le rendu visuel ne sont pas pilotés dans un navigateur ; Playwright restera nécessaire pour la recette d'interface.
- Le scénario vérifie une seule instance Next.js et MariaDB. Un test de charge distribué dépasse le périmètre du prototype.
- La preuve distante dépend d'un artefact conservé 30 jours ; une capture du résumé du job sera ajoutée à l'annexe finale.

Ces limites n'empêchent pas la validation des règles critiques de C2.2.2 : elles identifient les contrôles complémentaires à traiter dans le cahier de recette C2.3.1.
