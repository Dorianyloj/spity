# Lenteur de navigation — 15 septembre 2026

## Constat et cause reproduite

Le problème signalé concerne les clics dans la navbar après connexion. La production expose la révision `c12e522c9a8c41adaed17f9aad2670bd54b9a9c0`. Lors du diagnostic, `/api/health` répond en 144 ms et l'accueil en 160 ms depuis le poste de test. Le VPS n'est pas saturé sur l'échantillon observé : application à 0 % CPU, MariaDB à 0,04 %, environ 4,8 Go de mémoire disponible. Ce relevé ponctuel n'exclut pas une autre charge à un autre moment.

Chaque page instancie `AppShell`, qui recrée le fond Vanta Topology. L'initialisation calcule un champ de bruit sur la surface de l'écran, puis anime 4 500 particules. Ce calcul synchrone monopolise le navigateur au moment où le contenu de la nouvelle page doit s'afficher. Les liens Next fonctionnent, mais ils ne montrent pas d'état d'attente.

Le même composant a été testé sur une compilation de production locale avec la base de démonstration isolée, sans connexion à un compte de production.

## Comparaison contrôlée

Chromium headless, viewport 1440 × 1000, processeur ralenti ×4, latence réseau simulée de 100 ms, débit descendant 1 000 000 octets/s. Les temps correspondent au clic Playwright, à l'arrivée sur l'URL et à la présence du titre de page ; un passage par parcours, sans objectif statistique ni engagement de performance en production.

| Destination | Avant | Après |
| --- | ---: | ---: |
| Partenaires | 11 041 ms | 1 123 ms |
| Événements | 9 917 ms | 763 ms |
| Demandes | 10 220 ms | 550 ms |
| Profil | 10 363 ms | 748 ms |
| Feed | 8 660 ms | 494 ms |

Avant correction, les réponses de navigation arrivent en 107 à 110 ms, mais une tâche bloque ensuite le navigateur pendant 7,8 à 8,5 secondes. Avec la préférence de mouvement réduit, qui désactive ce fond, les parcours initiaux passent déjà sous 840 ms. Après correction, la plus longue tâche observée par transition est de 186 ms et aucun canvas décoratif n'est créé.

## Correction

- Fond topographique SVG statique de 1 827 octets, aux couleurs Spity : aucune boucle d'animation ni initialisation p5 à chaque page.
- Suppression de `p5`, `vanta` et des types associés dans les dépendances et le lockfile.
- Indicateur dans le lien en attente avec `useLinkStatus`, sans décalage de mise en page ; annonce accessible, animation respectant la préférence de mouvement réduit. Le menu mobile conserve son comportement de fermeture et de retour du focus.
- Test navigateur dédié : suspendre la réponse de navigation, vérifier l'indicateur, libérer la réponse puis vérifier la page affichée et la disparition de l'attente.

## Validation et portée

ESLint, TypeScript, build de production et 404 tests Jest réussis. Les 7 scénarios Playwright passent sur la compilation de production locale, dont la navigation suspendue puis reprise et le menu mobile au clavier. Le rendu de la navbar et du fond a été inspecté sur ordinateur et mobile.

La recette sur le serveur compilé utilise `ACCEPTANCE_BASE_URL=http://localhost:3314`, avec l'environnement de la base isolée. Un premier lancement sur `127.0.0.1` a été refusé par la gestion des cookies sécurisés du client API ; un second a rencontré le quota d'authentification consommé par les mesures précédentes. Le lancement final utilise `localhost` et un nouveau processus local, sans modifier les protections ni la production.

Les mesures avant/après concernent la compilation locale, pas un déploiement. La production doit recevoir cette correction via la PR et la CI habituelles avant qu'une amélioration puisse y être confirmée.
