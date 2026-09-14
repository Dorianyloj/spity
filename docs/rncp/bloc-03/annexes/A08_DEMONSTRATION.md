# A08 - Démonstration de six minutes

Le scénario porte sur le parcours grimpeur/club. Les trois captures de secours ont été réalisées le 14 septembre 2026 sur la base dédiée et figurent dans preuves/captures. Elles complètent la recette exécutée à cette date ; elles ne dispensent pas de vérifier le logiciel avant chaque nouvelle soutenance.

## Installation de démonstration isolée

Depuis la racine du dépôt, avec les dépendances installées dans spity/, Node.js 22 recommandé par le projet, Docker Desktop démarré et Chromium Playwright disponible :

```powershell
# Prépare uniquement une base dédiée sur 127.0.0.1:33313 et charge les données de test.
powershell -File tools/bloc3/demo.ps1 -Prepare
# Rejoue la recette existante sur la base de démonstration.
powershell -File tools/bloc3/demo.ps1 -Verify
# Démarre ensuite l'application sur http://127.0.0.1:3313.
powershell -File tools/bloc3/demo.ps1
```

Le script ne modifie pas .env.local et impose sa propre base spity_bloc3_demo. Les secrets aléatoires restent dans tmp/bloc3/demo.env, ignoré par Git. Le mode -Prepare réinitialise les seuls comptes et objets de démonstration via le script existant : il sert à préparer ou rétablir la répétition, pas à charger une production. Sans -Prepare, les données sont conservées.

Ouvrir deux profils de navigateur distincts pour conserver une session grimpeur et une session club. Comptes locaux issus du seed : lina.demo@spity.local et club.demo@spity.local ; mot de passe public de démonstration : SpityDemo2026! Ce mot de passe n'est pas une recommandation pour un compte réel.

## Déroulé

| Temps | Action | Explication orientée client | Critère visible |
| --- | --- | --- | --- |
| 0:00-0:45 | Session grimpeur et profil | « Je prépare une sortie correspondant à mon niveau et à mes disponibilités. » | Profil et rôle identifiés. |
| 0:45-2:00 | Matching et filtres | « Je réduis la liste aux partenaires compatibles ; je peux vérifier l'état d'une demande. » | Résultats cohérents et état compréhensible. |
| 2:00-3:15 | Événements et inscription | « Je consulte la sortie et les places disponibles, puis je m'inscris. » | Inscription confirmée ou état déjà inscrit expliqué. |
| 3:15-4:45 | Session club et participants | « Le club voit qui participe et garde la maîtrise de l'événement. » | Commandes club et participants autorisés. |
| 4:45-5:30 | Capacité, erreurs et accessibilité | « Les règles évitent les dépassements ; les commandes restent utilisables au clavier. » | Contrôle observable ou preuve de test précisément identifiée. |
| 5:30-6:00 | Retour aux critères | « Voici les critères couverts, les réserves et la décision attendue. » | Grille de validation et limites. |

Avant chaque répétition, vérifier les dates futures des événements. Un compte déjà inscrit sert à montrer l'état existant ; pour rejouer une inscription, choisir un autre événement ou préparer à nouveau les données dédiées. Ne pas improviser une modification sur une production pendant la soutenance.

## Préparation du jour J

Vérifier /api/health, les deux connexions, les pages /app/matching et /app/events, puis un parcours complet. Noter la version et le SHA. Préparer le diaporama, le classeur et les preuves hors connexion. Désactiver les notifications personnelles et fermer les onglets sans rapport avec le projet.

En cas d'incident : annoncer précisément le problème, conserver le message utile, présenter la capture datée de secours et expliquer la dernière vérification disponible. Revenir à la grille et indiquer quel critère ne peut pas être revalidé en direct. Un environnement arrêté ne doit pas être présenté comme une recette réussie.

Les résultats effectivement obtenus pendant cette préparation figurent dans VERIFICATION.md : les six scénarios navigateur ont réussi avec la base dédiée. Arrêter le serveur avec Ctrl+C avant de rejouer -Verify ; le serveur de recette utilise le même port. Pour arrêter ensuite la seule base dédiée, exécuter : docker compose --env-file tmp/bloc3/demo.env -f tools/bloc3/compose.demo.yml -p spity-bloc3-demo stop.
