# Superviser Spity

Cette procédure décrit les sondes, seuils, alertes et réactions attendues pour la production Spity.

## Objectif de service

- disponibilité mensuelle cible : 99,5 % pour la route de santé publique ;
- détection d'une indisponibilité : au prochain contrôle planifié, cible de 15 minutes ;
- prise en charge d'une alerte S1/S2 : moins de 30 minutes pendant une plage de maintenance active ;
- aucune alerte ne contient de secret, de donnée personnelle ou de réponse brute non maîtrisée.

GitHub Actions peut différer l'heure exacte d'un cron selon la charge de la plateforme. Le délai réel est donc mesuré dans l'historique et ne constitue pas une garantie temps réel.

## Périmètre et indicateurs

La route `GET /api/health` vérifie l'application et sa connexion MariaDB. La sonde `scripts/check-health.mjs` contrôle :

| Indicateur | Seuil | Finalité |
| --- | --- | --- |
| Réponse HTTP | 2xx | Détecter une indisponibilité réseau ou applicative. |
| JSON valide | Obligatoire | Éviter un faux positif sur une page HTML d'erreur. |
| `status` | Exactement `ok` | Confirmer que l'application et MariaDB sont utilisables. |
| `version` | Chaîne non vide | Identifier la version observée. |
| `revision` | SHA non vide | Assurer la traçabilité Git du binaire. |
| Latence | 3 000 ms maximum | Détecter une dégradation visible avant le timeout. |
| Timeout | 15 000 ms | Borner une sonde bloquée. |
| Tentatives | 1 initiale + 2 reprises | Réduire les alertes dues à un incident réseau transitoire. |

Une révision attendue peut être fournie avec `EXPECTED_REVISION`. Une différence devient alors une alerte de dérive de déploiement.

## Chaîne de supervision

1. Le workflow `Production monitoring` est planifié toutes les 15 minutes et peut être déclenché manuellement.
2. Il récupère la version contrôlée de la sonde et utilise Node.js 22.
3. La sonde interroge la route de santé, applique les seuils et produit `.monitoring/production-health.json`.
4. Le rapport est conservé 30 jours comme artefact GitHub Actions.
5. En cas d'échec, une issue unique `[Incident production] Supervision en échec` est créée ou rafraîchie.
6. Au premier contrôle réussi, l'issue reçoit un commentaire de retour à la normale puis est fermée.

## Qualification et escalade

| Niveau | Exemple | Première action |
| --- | --- | --- |
| S1 | Route indisponible, perte ou corruption de données suspectée | Geler les déploiements, conserver les journaux, envisager le rollback. |
| S2 | Authentification, matching ou événement critique indisponible | Reproduire, isoler la révision et préparer un correctif prioritaire. |
| S3 | Latence, révision inattendue ou fonction secondaire dégradée | Consigner, mesurer et planifier selon l'impact. |
| S4 | Anomalie cosmétique sans blocage | Ajouter au backlog de maintenance. |

Le formulaire `incident-production.yml` impose date, gravité, version, reproduction, preuves, analyse, validation et clôture.

## Exercice contrôlé

La commande suivante utilise exclusivement un serveur HTTP local éphémère :

```bash
npm run bloc4:exercise
```

Elle valide un cas sain puis un cas HTTP 503/applicatif `degraded`, vérifie les reprises et génère la preuve C4.1.2/C4.2.1. Elle ne modifie ni la production ni MariaDB.

Pour tester l'ouverture et la fermeture d'une issue dans GitHub Actions, un mainteneur peut déclencher manuellement le workflow avec une URL d'exercice maîtrisée. L'exercice doit être annoncé, son issue marquée comme simulation et refermée après le contrôle de récupération.

## Limites et amélioration prévue

La supervision actuelle est synthétique : elle contrôle disponibilité, base, version, révision et latence depuis GitHub. Elle ne remplace pas des métriques persistantes de taux d'erreur, CPU, mémoire, espace disque, temps de requête ou Core Web Vitals réels. La recommandation prioritaire du Bloc 4 est d'ajouter une plateforme de métriques et un tableau de bord avec rétention.
