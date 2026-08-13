# B4-C433-01 - Mise en situation de collaboration support

## Nature de la preuve

Cette collaboration est une **mise en situation fictive**, modalité explicitement autorisée par le référentiel. Le rôle support est simulé ; l'anomalie, la reproduction, les commits et les résultats de CI sont réels. Aucun échange humain externe n'est inventé.

## Contexte du retour client

- rôle : utilisateur pilote grimpeur utilisant un lecteur d'écran et un contraste renforcé ;
- contexte : première connexion sur une instance fraîche, consultation de `Lieux` puis des écrans sans données ;
- retour : « Les messages indiquant qu'aucun lieu ou événement n'est disponible sont presque invisibles selon l'écran. » ;
- impact : information essentielle non perceptible, navigation possible mais compréhension dégradée ;
- priorité proposée par le support : P2, accessibilité bloquante pour un sous-ensemble d'utilisateurs.

## Contribution du support niveau 1 simulé

1. Anonymise le retour et ne collecte ni compte réel ni donnée personnelle.
2. Précise rôle, écran, base vierge, navigateur et résultat attendu.
3. Reproduit sur `Demandes`, `Événements` et `Lieux`.
4. Fournit au mainteneur le texte exact, le contexte clair/sombre et la fréquence 100 %.
5. Demande un critère de clôture : score Lighthouse accessibilité égal à 1 sur les dix pages authentifiées et message lisible dans les deux contextes.

## Contribution du mainteneur niveau 2

1. Lance la recette sur Windows, Linux, Chrome/Chromium et MariaDB vierge.
2. Identifie le composant partagé `EmptyState` et l'héritage de couleurs comme cause racine.
3. Explique pourquoi la première correction texte blanc n'est pas suffisante dans une carte claire.
4. Rend le composant autonome avec les tokens `bg-card`, `text-card-foreground` et `text-muted-foreground`.
5. Ajoute/maintient les portes automatiques, puis fournit commits, CI et procédure de rollback.

## Résolution apportée

- composant utilisable sur fond sombre comme dans une carte claire ;
- 10/10 pages authentifiées à 100 % Lighthouse ;
- reflow mobile, lien d'évitement et réduction des animations validés ;
- 6/6 recettes BC02 et CI complète vertes sur `e3784b7`.

## Retour de validation support simulé

Le support rejoue les trois écrans sur une base vierge, vérifie la présence des titres et descriptions, puis confirme le critère de clôture automatisé. La réponse proposée à l'utilisateur est :

> Le défaut venait d'un composant d'état vide partagé entre des surfaces claires et sombres. Sa surface et ses couleurs sont désormais explicites. Les dix parcours authentifiés atteignent le seuil d'accessibilité prévu et le correctif restera protégé par la CI.

## Enseignement commun

Le support a apporté le contexte d'usage exact et le critère fonctionnel ; le mainteneur a apporté la cause technique, le correctif et la preuve automatisée. L'équipe décide d'ajouter systématiquement le type de données initiales (base vierge ou peuplée) aux tickets de rendu conditionnel.
