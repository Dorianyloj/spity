# Mon retour d'expérience et mes choix techniques - BC02

Ce chapitre complète la synthèse et l'index officiel. J'y explique comment j'ai réellement construit Spity, les décisions que j'ai prises et les problèmes que j'ai rencontrés. Mon objectif n'est pas de reprendre toute la documentation fichier par fichier, mais de montrer ma démarche de développeur et la manière dont j'ai relié le besoin, le code, les tests et la livraison.

## 1. Pourquoi j'ai choisi ce projet

J'ai choisi le sujet de l'escalade parce qu'il permet de travailler sur autre chose qu'un simple CRUD. Le besoin mélange des profils, de la recherche, des relations entre utilisateurs, des événements, des lieux et des informations qui peuvent avoir un impact sur la sécurité. Cela m'a obligé à réfléchir à la fois à l'expérience utilisateur, aux règles métier et à la qualité des données.

Au départ, la vision de Spity était très large : un réseau social, des topos collaboratifs, une carte, des salles, des falaises, des clubs, des événements et du matching entre grimpeurs. Je me suis rapidement rendu compte qu'il serait impossible de rendre toutes ces fonctions fiables dans le temps du bloc 2. J'ai donc choisi de démontrer un noyau cohérent plutôt qu'une accumulation d'écrans partiellement fonctionnels.

Le fil conducteur que j'ai retenu est le suivant : un grimpeur crée son profil, indique sa pratique et son matériel, recherche un partenaire, échange une demande, consulte un événement puis s'y inscrit. En parallèle, un club peut publier cet événement, régler sa capacité et voir les participants. Ces deux parcours utilisent la même session, la même base et les mêmes règles d'autorisation.

Ce choix me permet de présenter une chaîne de bout en bout :

1. une interface utilisable sur desktop et mobile ;
2. des Route Handlers qui valident les entrées ;
3. des règles métier testables séparément ;
4. une persistance MariaDB avec contraintes ;
5. des tests unitaires, d'intégration et de recette ;
6. un pipeline qui bloque réellement une version défectueuse.

Je considère que ce périmètre est représentatif du produit final. Les topos, la carte et le fil social restent dans la vision, mais je ne les présente pas comme terminés. Cette distinction est importante dans mon dossier : je préfère annoncer clairement ce qui manque plutôt que de donner une impression de complétude qui ne résisterait pas à la démonstration.

## 2. Comment j'ai cadré le MVP

J'ai transformé la vision initiale en dix fonctions démontrables, notées F01 à F10. Elles couvrent l'authentification, les profils, le matching, les partenariats, les événements, les inscriptions, les contrôles de sécurité et le responsive. Pour chaque fonction, j'ai associé une user story et un résultat observable dans le [périmètre fonctionnel](./01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md).

Pour choisir ce qui entrait dans le MVP, j'ai utilisé trois questions simples :

- est-ce que la fonction sert directement un grimpeur ou un club ?
- est-ce que je peux la persister et la tester correctement ?
- est-ce qu'elle complète un parcours déjà commencé ?

Cette méthode m'a conduit aux décisions suivantes :

| Sujet | Décision | Raison |
| --- | --- | --- |
| Authentification et profils | Inclus | Point d'entrée obligatoire pour tous les parcours. |
| Matching et demandes | Inclus | Valeur principale pour le rôle grimpeur. |
| Événements et inscriptions | Inclus | Parcours complet reliant grimpeur, club et capacité. |
| Répertoire de lieux | Inclus en consultation | Utile à la démonstration, sans dépendre d'une API cartographique. |
| Carte interactive | Reportée | Nécessite le choix d'un fournisseur, des clés et une stratégie de quotas. |
| Fil social persistant | Reporté | Demande médias, modération, pagination et règles RGPD supplémentaires. |
| Topos collaboratifs | Reportés | Exigent une modération et une qualité de données plus poussées. |
| Notifications | Reportées | Dépendent d'un service asynchrone et d'un consentement utilisateur. |

J'ai aussi séparé le périmètre du produit de celui de la certification. Le fichier `CADRAGE_PROJET.md` conserve l'ambition globale, tandis que le dossier BC02 décrit seulement ce que je peux exécuter et prouver. Cette séparation m'a aidé à éviter deux erreurs : modifier constamment le périmètre pendant le développement et écrire une documentation qui promet plus que le code.

Pour la soutenance, j'ai prévu une démonstration courte avec deux comptes. Je commence avec Lina, le compte grimpeur, puis je passe sur le compte du Club Alpin Lyon. Je peux ainsi montrer les autorisations différentes et faire évoluer la même donnée sous deux points de vue. La capacité d'un événement fixée à une place rend la règle métier visible immédiatement.

## 3. L'architecture que j'ai retenue

J'ai retenu Next.js avec l'App Router parce qu'il me permet de garder les pages, les composants serveur, les composants interactifs et les API dans un projet TypeScript unique. Cela réduit le nombre de dépôts à maintenir pour le prototype, tout en conservant une séparation par couche.

Mon organisation principale est orientée par fonctionnalité :

```text
src/features/matching/
  components/
  lib/
  schemas.ts

src/features/events/
  components/
  lib/
  schemas.ts
```

Dans chaque feature, les composants gèrent l'affichage, les schémas Zod définissent les contrats, les règles pures portent les décisions métier et les repositories isolent Drizzle. Les pages de `src/app/` chargent l'utilisateur et les données initiales. Les Route Handlers de `src/app/api/` appliquent les contrôles HTTP et appellent la couche métier.

Je n'ai pas voulu mettre toute la logique dans les composants React. Par exemple, le filtrage des grimpeurs et les règles de capacité sont des fonctions indépendantes. Je peux donc les tester sans navigateur. De la même manière, les composants ne connaissent pas les colonnes MariaDB : ils manipulent des objets validés par les schémas.

J'ai utilisé TypeScript en mode strict. Lorsqu'une donnée vient d'une requête ou d'un JSON MariaDB, je la considère d'abord comme `unknown`. Elle doit passer par une validation ou un narrowing avant d'être utilisée. Cette contrainte ajoute du travail au début, mais elle m'a évité de propager des hypothèses implicites entre l'API et l'interface.

J'ai choisi les outils suivants pour des raisons précises :

| Outil | Utilisation dans Spity |
| --- | --- |
| React et Tailwind CSS | Composants interactifs et interface responsive. |
| React Hook Form | Gestion des formulaires et des erreurs associées aux champs. |
| Zod | Validation des entrées, sorties et formulaires. |
| Drizzle ORM | Requêtes typées et migrations versionnées. |
| MariaDB 11.4 | Contraintes relationnelles et transactions. |
| Jest et Testing Library | Règles pures et comportement visible des composants. |
| Playwright | Parcours navigateur sur l'artefact réellement livré. |
| Docker Compose | Environnements locaux, de test et de production reproductibles. |

Le détail des couches, des routes et des décisions est conservé dans mon [document d'architecture](./05_ARCHITECTURE_PROTOTYPE_C221.md).

## 4. Les données et les règles métier

Le modèle de données contient deux types de profils, les équipements, les lieux, les demandes de partenariat, les événements et les inscriptions. J'ai utilisé des clés étrangères avec suppression en cascade lorsque les données dépendent directement d'un utilisateur ou d'un événement. J'ai aussi ajouté des contraintes uniques pour empêcher les doublons fonctionnels.

Une demande de partenariat possède une `pairKey` stable. Elle représente la paire d'utilisateurs indépendamment de l'ordre expéditeur/destinataire. La contrainte unique en base empêche deux demandes concurrentes pour la même paire. L'API interdit aussi l'auto-demande et vérifie que le destinataire a activé la recherche de partenaire.

Pour les événements, le point le plus sensible est la capacité. Une simple vérification dans l'interface ne suffit pas : deux grimpeurs peuvent cliquer en même temps sur la dernière place. J'ai donc placé la règle dans une transaction MariaDB. La ligne de l'événement est verrouillée, le nombre d'inscriptions actives est recalculé, puis l'inscription est créée ou réactivée.

Le test d'intégration envoie volontairement deux inscriptions concurrentes sur la dernière place. J'attends une seule réussite et un refus pour l'autre demande. Ce scénario vérifie le comportement de MariaDB et de Drizzle ensemble, ce qu'un test unitaire ne pourrait pas garantir.

Pour chaque mutation, j'applique le même ordre de contrôle :

1. vérifier l'origine de la requête ;
2. récupérer et valider la session ;
3. vérifier le rôle ;
4. valider les paramètres et le corps avec Zod ;
5. vérifier l'autorisation sur la ressource ;
6. appliquer la règle métier ;
7. écrire avec Drizzle ;
8. valider la réponse avant de l'envoyer.

Cet ordre m'évite de charger ou de modifier une ressource avant d'avoir contrôlé l'identité. Il rend aussi les Route Handlers plus faciles à relire. Pour les listes, j'ai limité les résultats du matching à 100 profils dans le prototype. Je sais qu'une pagination et des index supplémentaires seront nécessaires à plus grande échelle, mais je préfère garder cette limite explicite plutôt que d'introduire une requête non bornée.

## 5. Ma démarche de sécurité

Je n'ai pas traité la sécurité comme une vérification ajoutée à la fin. J'ai utilisé l'OWASP Top 10:2025 comme grille de lecture et j'ai relié chaque catégorie à une mesure concrète du projet. La [matrice OWASP](./07_SECURITE_OWASP_C223.md) contient les fichiers concernés, les tests et les risques résiduels.

Les mots de passe sont hachés avec bcrypt. La session est stockée dans un cookie `HttpOnly`, `SameSite=Lax` et `Secure` en production. Les endpoints sensibles vérifient l'origine de la requête. Les entrées sont validées par Zod et je n'utilise pas de SQL brut dans le code applicatif. Les rôles `grimpeur` et `club` sont contrôlés côté serveur, même lorsque l'interface masque déjà une commande.

J'ai ajouté un quota sur la connexion. Le scénario d'intégration envoie onze échecs avec la même identité réseau. Les dix premières réponses sont des `401`, puis la onzième devient une `429` avec `Retry-After` et `X-RateLimit-Remaining: 0`. Ce test me permet de montrer que la protection existe au niveau HTTP et pas seulement dans une fonction isolée.

J'ai aussi configuré les en-têtes de sécurité : CSP, HSTS en production, `X-Frame-Options`, `X-Content-Type-Options`, politique de référent et permissions. La CSP contient encore `unsafe-inline` pour rester compatible avec le rendu actuel de Next.js. Je ne présente pas ce point comme idéal : avant une mise en production publique, je devrai étudier une stratégie avec nonce ou SRI.

Deux alertes modérées concernent le PostCSS embarqué par Next.js. La correction automatique proposée par npm impose un downgrade majeur incohérent. J'ai documenté le risque au lieu de forcer une mise à jour dangereuse. La CI reste bloquante dès le niveau haut ou critique.

Les autres limites que j'assume pour le prototype sont le quota en mémoire, l'absence de révocation serveur d'une session signée et l'absence de centralisation des alertes. Sur une architecture multi-instance, je remplacerais le quota local par Redis et j'ajouterais un identifiant de session révocable.

## 6. L'interface et l'accessibilité

J'ai voulu éviter une application qui fonctionne seulement dans le cas nominal. Les écrans asynchrones possèdent des états de chargement, des états vides et des messages de succès ou d'erreur. Les formulaires associent leurs erreurs aux champs. Les messages qui changent après une action utilisent `aria-live` ou `role="alert"`.

J'ai retenu le RGAA 4.1.2 parce que le projet est présenté dans un contexte français. Je l'ai complété avec axe, Lighthouse et des vérifications manuelles. Les audits authentifiés couvrent dix états de l'application. Les trois pages publiques atteignent 100 en accessibilité dans Lighthouse.

Un exemple concret de correction concerne le composant `EmptyState`. Son titre visuel était rendu avec un paragraphe. Visuellement, le résultat semblait correct, mais un lecteur d'écran ne pouvait pas l'utiliser comme titre de section. J'ai remplacé ce paragraphe par un `h2` et ajouté un test sémantique. Cette anomalie est enregistrée sous `BUG-A11Y-005`.

J'ai également vérifié :

- le parcours complet au clavier ;
- la présence d'un focus visible ;
- l'ordre logique des titres ;
- les libellés des boutons qui contiennent seulement une icône ;
- la préférence `prefers-reduced-motion` ;
- le reflow à 360 pixels ;
- l'absence de défilement horizontal incohérent ;
- les contrastes des textes et contrôles principaux.

Les annexes montrent le dashboard, le matching, la gestion des événements et le profil à 390 pixels. Pour moi, ces captures ne remplacent pas les tests : elles servent à rendre le résultat visible au jury. Les rapports axe, Lighthouse et Playwright restent la preuve reproductible.

## 7. Comment j'ai construit la stratégie de tests

J'ai séparé les tests en trois niveaux. Les tests unitaires sont rapides et isolent les règles. Les tests d'intégration démarrent MariaDB et traversent les API. La recette Playwright pilote les parcours depuis le navigateur sur un build standalone.

Au début, ma couverture Jest portait sur huit modules sélectionnés et affichait environ 96 %. Ce chiffre était correct pour ce périmètre, mais il ne représentait pas toute l'application. Lorsque j'ai exécuté une mesure contradictoire sur tout `src/`, je n'avais que 20,23 % des lignes. J'ai donc corrigé la configuration au lieu de conserver un pourcentage avantageux mais incomplet.

J'ai ajouté des tests pour les pages principales, les deux variantes du dashboard, le répertoire de lieux, les formulaires de profil, l'inventaire, le matching, les partenariats, les événements et le contrat Drizzle. Le résultat actuel est :

| Indicateur global | Résultat | Seuil bloquant |
| --- | ---: | ---: |
| Lignes et instructions | 62,56 % | 60 % |
| Branches | 77,67 % | 75 % |
| Fonctions | 55,06 % | 55 % |
| Tests | 126/126 | 100 % réussis |

Les seuils sont enregistrés dans `jest.config.ts`. Une baisse sous l'un de ces niveaux fait échouer `npm run test:coverage` et le job `Quality gates`. Le rapport complet est conservé comme artefact GitHub Actions.

La recette navigateur contient six scénarios qui couvrent F01 à F10. Je n'utilise ni retry ni test ignoré. Cette décision rend les échecs plus visibles, mais elle évite de masquer une instabilité. Les Server Components asynchrones et les cookies de production sont surtout vérifiés à ce niveau, car ils sont plus représentatifs dans l'application assemblée.

Je sais que 62,56 % ne signifie pas que tout est testé. Les repositories Drizzle, plusieurs Route Handlers et certaines fiches de lieux restent moins couverts que les composants et les règles pures. Ils constituent la prochaine priorité de renforcement.

## 8. Mon pipeline d'intégration et de livraison

Chaque push sur `develop` déclenche quatre jobs en parallèle : qualité, intégration MariaDB/accessibilité, Lighthouse et recette BC02. Le staging ne démarre que lorsque ces quatre portes sont vertes. J'ai choisi cette organisation pour que chaque job donne un diagnostic lisible et pour éviter qu'un test lent empêche de voir rapidement une erreur de typage.

Le job qualité exécute l'installation avec `npm ci`, ESLint, TypeScript, les 126 tests avec couverture, l'audit npm, la validation des trois fichiers Compose et le build Next.js. Le job d'intégration crée une base MariaDB vide, applique toutes les migrations puis exécute les scénarios HTTP. La recette construit le standalone utilisé dans l'image Docker avant de lancer Playwright.

J'ai rencontré un échec important sur le run `29749715001`. La recette distante utilisait `next dev` sur un cache froid et compilait des routes pendant les scénarios. Le staging a été bloqué, ce qui était le comportement attendu, mais le test ne portait pas exactement sur l'artefact livré. J'ai remplacé ce serveur par le build standalone et aligné l'URL de boucle locale sur `localhost` afin de conserver le cookie `Secure`. Le run suivant a réussi sans retry.

Le versionnement suit des commits conventionnels et une branche `develop`. La release `v0.1.0` contient un tag, un changelog, un bundle, un manifeste et des sommes SHA-256. Les images staging sont identifiées par le SHA du commit. Je peux donc relier une capture, un rapport et un conteneur à une révision précise.

La capture de l'annexe A6 montre le pipeline complet : cinq jobs réussis et six artefacts. Ce résultat est plus important qu'un simple build local, car GitHub repart d'un runner neuf avec une installation verrouillée.

## 9. Les anomalies qui m'ont fait progresser

J'ai conservé les anomalies réelles dans le [plan de correction](./11_PLAN_CORRECTION_BOGUES_C232.md). Je ne voulais pas inventer des bogues pour remplir le dossier. Certaines erreurs venaient du produit, d'autres du harnais, mais elles ont toutes été reproduites et retestées.

Le parseur de matériel m'a fourni un premier exemple. La saisie `Beal Joker corde 60 m 9,1 mm turquoise` était coupée au niveau de la virgule décimale. Le parseur traitait toutes les virgules comme des séparateurs de liste. J'ai corrigé l'expression de découpage et ajouté un test qui conserve le diamètre et la couleur.

Dans le matching, un grimpeur qui avait désactivé la recherche restait joignable par une nouvelle demande. La cause était un accès public commun à l'annuaire et à l'historique. J'ai séparé l'accès d'éligibilité de l'accès nécessaire pour afficher une ancienne relation.

Plusieurs erreurs Playwright étaient des erreurs de ciblage : un libellé correspondait à la fois au champ mot de passe et au bouton d'affichage, ou un rôle `alert` correspondait aussi à l'annonceur de route Next.js. Je les ai corrigées en ciblant la relation exacte entre le champ et son erreur, sans modifier artificiellement l'interface.

Enfin, GitHub signalait la dépréciation du runtime Node.js 20 pour certaines actions. J'ai migré `setup-node` et `upload-artifact` vers leur version 6. Le run suivant ne contenait plus l'annotation. Cette correction n'a pas changé le produit, mais elle améliore la maintenabilité de la chaîne.

La règle que j'ai retenue est simple : je ne ferme une anomalie qu'après le test ciblé et le pipeline complet. Je ne baisse pas un seuil, je n'ajoute pas un retry par défaut et je ne désactive pas une protection pour obtenir un résultat vert.

## 10. Mon bilan et la suite du projet

Ce bloc m'a obligé à aller plus loin que le développement des écrans. J'ai dû rendre l'environnement reproductible, définir des seuils, tester la concurrence, documenter les risques, analyser des échecs et produire une version que je peux relier à un SHA.

Le point dont je suis le plus satisfait est la cohérence du parcours grimpeur/club. Une inscription à un événement n'est pas seulement un bouton : elle dépend d'une session, d'un rôle, d'une date, d'une capacité, d'une transaction et d'une restitution différente selon l'utilisateur. C'est ce type de chaîne que je veux montrer pendant la soutenance.

Je garde aussi un regard critique sur le résultat. Spity n'est pas encore prêt pour une ouverture publique. Il manque notamment :

- une session pilote formalisée avec des utilisateurs externes ;
- l'export et la suppression autonome des données personnelles ;
- la récupération de compte ;
- une stratégie de sauvegarde automatisée et testée régulièrement ;
- un quota distribué et des sessions révocables ;
- la persistance complète du fil social, de la carte et des topos ;
- davantage de tests sur la couche serveur.

Ma prochaine étape prioritaire est une session utilisateur complémentaire. L'instance publique, les comptes de démonstration et le manuel rendent déjà le logiciel manipulable en autonomie ; je veux maintenant faire exécuter le parcours à deux personnes sans les guider, mesurer les blocages et ouvrir de nouvelles anomalies si nécessaire.

Ensuite, je renforcerai les parcours RGPD et les tests des Route Handlers avant d'ajouter de nouvelles fonctions. Pour la partie produit, la carte et les topos sont les évolutions les plus cohérentes avec le sujet, mais elles devront être accompagnées d'une stratégie de modération et de fiabilité des informations.

Pour conclure, ce dossier représente le travail que j'ai réellement réalisé et les décisions que je peux expliquer. Les résultats chiffrés, les commits, les captures et les runs CI sont présents pour permettre au jury de vérifier mes affirmations. Je préfère conserver une limite explicite plutôt que de présenter comme terminé un élément que je n'ai pas encore validé.
