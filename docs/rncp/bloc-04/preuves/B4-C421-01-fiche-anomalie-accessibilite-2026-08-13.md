# B4-C421-01 - Fiche d'anomalie : contraste des états vides

## Identification

- identifiant : `B4-INC-2026-08-12-01` ;
- détection : 12 août 2026, pipeline CI GitHub Actions ;
- environnement : recette authentifiée avec MariaDB vierge ;
- qualification : S2 de maintenance, car la release est bloquée et l'information devient illisible pour certains utilisateurs ;
- données utilisées : comptes temporaires de test uniquement.

## Comportement observé

Le job `Audit authenticated accessibility` renvoyait un score Lighthouse de 0,96 au lieu du seuil de 1. Les titres et descriptions de certains états vides avaient un contraste insuffisant :

- texte sombre sur fond authentifié sombre pour `Demandes` et `Événements` ;
- après une première correction trop locale, texte blanc sur carte claire pour `Lieux` avec une base vierge.

La recette BC02 échouait aussi parce qu'un sélecteur Playwright cherchait l'ancien nom accessible d'un titre après l'ajout des liens de profils publics.

## Reproduction

1. Démarrer une MariaDB 11.4 vierge et appliquer les migrations.
2. Créer les comptes temporaires grimpeur/club avec le script d'audit.
3. Exécuter `npm run accessibility:audit`.
4. Ouvrir `/app/partnerships`, `/app/events` puis `/app/places` avec une base sans lieux personnalisés.
5. Inspecter l'audit `color-contrast` : les éléments `EmptyState` échouent selon leur surface parente.
6. Exécuter `npm run test:acceptance` pour reproduire l'ancien sélecteur de carte de matching.

## Analyse de cause

`EmptyState` était réutilisé directement sur le fond sombre de l'espace connecté et à l'intérieur de cartes claires. Il héritait de couleurs prévues pour un seul contexte. Une correction par couleur de texte seule inversait le défaut dans l'autre contexte. La recette BC02 couplait en parallèle son sélecteur au nom accessible exact du titre avant l'ajout d'un lien.

## Préconisation et correction

- rendre `EmptyState` autonome avec `bg-card`, `text-card-foreground` et `text-muted-foreground` ;
- faire sélectionner la carte Playwright par le texte contenu dans le titre, sans dépendre du préfixe accessible du lien ;
- épingler le Chromium Playwright dans la CI et rendre l'outil Lighthouse tolérant au verrouillage tardif de son dossier temporaire Windows ;
- valider sur une base vierge et une base existante.

## Validation

- 10 pages authentifiées sur 10 à 100 % Lighthouse ;
- lien d'évitement, réduction des animations et reflow mobile validés ;
- 6 scénarios BC02 sur 6 réussis ;
- CI GitHub verte sur la révision `e3784b7e6a1b3be4b7c6cb46938701bb4449027b`.

## Traçabilité

- `e5b4433` - restauration des portes d'acceptation et d'accessibilité ;
- `da7ebfb` - navigateur d'audit authentifié verrouillé ;
- `e3784b7` - état vide autonome et sûr en contraste ;
- CI : `https://github.com/Dorianyloj/spity/actions/runs/31604246584`.
