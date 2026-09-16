# A08 - Démonstration de six minutes

Le scénario porte sur le parcours grimpeur/club. Les trois captures de secours actuelles ont été réalisées le 15 septembre 2026 sur la base dédiée et figurent dans preuves/captures. Elles complètent la recette exécutée à cette date ; elles ne dispensent pas de vérifier le logiciel avant chaque nouvelle soutenance.

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
| 0:00–0:30 | Présenter les sessions et la version | « Voici les comptes de démonstration et les critères. » | Version et environnement identifiés. |
| 0:30–1:00 | Profil grimpeur | « Je prépare une sortie selon ma pratique. » | Profil et discipline identifiés. |
| 1:00–2:00 | Recherche et filtres | « Je retrouve des partenaires adaptés. » | Résultats cohérents. |
| 2:00–3:00 | Demande de partenaire | « Je sais où en est ma demande. » | État lisible ; demande existante expliquée. |
| 3:00–4:00 | Événement et inscription | « Je consulte les places et m’inscris. » | Confirmation ou état déjà inscrit. |
| 4:00–5:15 | Session club | « Le club retrouve les participants. » | Liste et commandes autorisées. |
| 5:15–5:45 | Parcours au clavier | « Les commandes restent accessibles. » | Focus et activation observables. |
| 5:45–6:00 | Retour aux critères | « Voici les résultats et réserves à retenir. » | Critères montrés et limites précisés. |

Avant chaque répétition, vérifier les dates futures des événements. Un compte déjà inscrit sert à montrer l'état existant ; pour rejouer une inscription, choisir un autre événement ou préparer à nouveau les données dédiées. Ne pas improviser une modification sur une production pendant la soutenance.

## Préparation du jour J

Vérifier /api/health, les deux connexions, les pages /app/matching et /app/events, puis un parcours complet. Noter la version et le SHA. Préparer le diaporama v21, le classeur et les preuves hors connexion. Désactiver les notifications personnelles et fermer les onglets sans rapport avec le projet.

En cas d'incident : annoncer précisément le problème, conserver le message utile, présenter la capture datée de secours et expliquer la dernière vérification disponible. Revenir à la grille et indiquer quel critère ne peut pas être revalidé en direct. Un environnement arrêté ne doit pas être présenté comme une recette réussie.

VERIFICATION.md distingue la recette historique à six scénarios de la recette locale compilée à sept scénarios consignée dans l’audit de navigation du 15 septembre. Rejouer le parcours sur la version choisie avant l’oral. Arrêter le serveur avec Ctrl+C avant de rejouer -Verify ; le serveur de recette utilise le même port. Pour arrêter ensuite la seule base dédiée, exécuter : docker compose --env-file tmp/bloc3/demo.env -f tools/bloc3/compose.demo.yml -p spity-bloc3-demo stop.
