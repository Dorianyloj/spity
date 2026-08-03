# Accessibilité du prototype et audit RGAA 4.1.2 - C2.2.3

## 1. Référentiel choisi

Spity retient le [Référentiel général d'amélioration de l'accessibilité 4.1.2](https://accessibilite.numerique.gouv.fr/) comme référence de C2.2.3.

Ce choix est justifié par quatre éléments :

1. il s'agit du référentiel technique officiel français applicable aux services web au moment de l'audit ;
2. ses 106 critères fournissent une méthode de contrôle testable, organisée en 13 thèmes ;
3. il est cohérent avec le contexte français du titre RNCP et du public de Spity ;
4. il s'appuie sur WCAG 2.1, dont les critères sont organisés autour des contenus perceptibles, utilisables, compréhensibles et robustes.

La DINUM indique que le RGAA 5 est en cours de rédaction pour une publication prévue fin 2026 et que les travaux fondés sur la version 4.1.2 ne doivent pas être reportés. La référence 4.1.2 reste donc adaptée au dossier remis en juillet 2026. Les règles de conformité WCAG imposent par ailleurs de considérer les pages complètes et les processus complets, pas seulement un composant isolé ([WCAG 2.1, section conformité](https://www.w3.org/TR/WCAG21/#conformance)).

## 2. Portée de l'audit

### Échantillon public

| État | Route | Parcours |
| --- | --- | --- |
| Accueil | `/` | Comprendre le service et accéder à l'authentification. |
| Connexion | `/login` | Renseigner les identifiants, afficher le mot de passe, recevoir une erreur. |
| Inscription | `/register` | Créer un compte et choisir un rôle. |

### Échantillon authentifié

| Rôle | Route ou état | Parcours |
| --- | --- | --- |
| Grimpeur | `/app` | Tableau de bord et navigation principale. |
| Grimpeur | `/app/matching` | Recherche, filtres et fiches de partenaires. |
| Grimpeur | `/app/partnerships` | Demandes émises et reçues. |
| Grimpeur | `/app/places` | Recherche et consultation du répertoire. |
| Grimpeur | `/app/events` | Consultation et inscription. |
| Grimpeur | `/profile/me` | Onglets et formulaires du profil. |
| Club | `/app/events` | Formulaire de publication et administration. |
| Club | `/profile/me` | Profil et compte club. |
| Grimpeur mobile | `/app`, largeur 360 px | Reflow du tableau de bord. |
| Grimpeur mobile | `/profile/me`, largeur 360 px | Reflow des onglets et formulaires. |

L'échantillon couvre le processus complet de création de compte, de profil, de matching et d'événement retenu pour le BC02. Les états sans contenu et avec données sont exercés grâce à des comptes éphémères créés par le script.

## 3. Méthode combinée

L'audit ne confond pas score automatisé et conformité RGAA. Il combine :

- inspection sémantique des composants et pages ;
- tests axe dans Jest sur les contrôles partagés, les deux formulaires d'authentification et le formulaire événement ;
- test clavier du bouton d'affichage du mot de passe ;
- Lighthouse public sur trois pages de production ;
- Lighthouse authentifié sur dix états, avec seuil accessibilité bloquant de 100 % ;
- pilotage Chrome du lien d'évitement et de la préférence `prefers-reduced-motion` ;
- mesure du reflow à 360 px par comparaison de `scrollWidth` et `clientWidth` ;
- captures pleine page du tableau de bord et du profil mobile ;
- contrôle manuel des critères non automatisables sur le périmètre fonctionnel.

Commandes de reproduction :

```bash
npm test -- --runInBand
npm run accessibility:audit
npm run perf:audit
```

Le script `run-authenticated-accessibility.mjs` démarre Next.js avec MariaDB, crée un grimpeur et un club, contrôle les pages avec leurs cookies de session, produit les rapports et captures dans `.accessibility`, supprime les comptes, puis arrête le serveur. Le job GitHub Actions conserve ces preuves pendant 30 jours.

## 4. Écarts trouvés et corrections

Le premier audit n'a pas été présenté comme réussi. Il a détecté les écarts suivants :

| ID | Écart initial | Mesure avant | Correction | Résultat après |
| --- | --- | --- | --- | --- |
| A11Y-01 | Absence de lien d'évitement global. | Non mesuré | Premier élément focusable « Aller au contenu principal », cible focusable `#contenu-principal`. | Navigation clavier automatisée réussie. |
| A11Y-02 | Erreurs d'authentification et certains retours de profil non annoncés. | Retours seulement visuels | `role="alert"`, `role="status"`, `aria-live`, `aria-invalid` et `aria-describedby`. | Tests axe sans violation détectée. |
| A11Y-03 | Pas de prise en compte globale de la réduction des animations. | Défilement fluide et transitions actifs | Media query `prefers-reduced-motion: reduce`, animations et transitions ramenées à 0,01 ms, scroll automatique. | Style calculé `scroll-behavior: auto`. |
| A11Y-04 | Saut de titre de niveau 1 à niveau 3 sur le dashboard et les lieux. | Scores 98/100 | `CardTitle` devient un titre de niveau 2 ; les titres internes restent de niveau 3. | 100/100 sur les deux pages. |
| A11Y-05 | Badge gris : contraste 4,15:1 au lieu de 4,5:1. | Matching 96/100 | Texte neutre assombri de `#65736b` à `#55645b`. | Contraste calculé 5,21:1 ; matching 100/100. |
| A11Y-06 | Texte de progression : contraste 3,12:1. | Profils 96/100 | Vert foncé assombri de `#5f8f50` à `#376b31`. | Contraste calculé 5,22:1 ; profils 100/100. |
| A11Y-07 | Le bouton de déconnexion créait un document de 397 px à 360 px. | Échec du test de reflow | Commande mobile compacte de 44 x 44 px avec nom accessible et tooltip. | Dashboard : `scrollWidth=360`, `clientWidth=360`. |
| A11Y-08 | Les onglets du profil créaient un document de 566 px à 360 px. | Échec du test de reflow | Barre limitée à 100 % de son conteneur avec défilement interne contrôlé. | Profil : `scrollWidth=360`, `clientWidth=360`. |
| A11Y-09 | Seuil CI accessibilité fixé à 95 %. | Une régression mineure pouvait passer. | Seuil Lighthouse porté à 100 % pour la catégorie accessibilité. | CI bloquante sous 1,00. |

Les ratios sont calculés selon la luminance relative utilisée par WCAG/RGAA. Les corrections sont appliquées aux tokens ou composants partagés afin d'éviter une correction locale fragile.

## 5. Grille par thème RGAA

Le RGAA 4.1.2 contient 106 critères répartis en 13 thèmes. Le tableau suivant qualifie chaque thème sur l'échantillon audité. « Non applicable » signifie que le prototype ne contient pas le type de contenu concerné ; cela ne vaut pas pour une future fonctionnalité qui l'introduirait.

| Thème RGAA | Situation dans Spity | Contrôles et preuves | Résultat échantillon |
| --- | --- | --- | :---: |
| **1. Images** | Logos décoratifs, images d'ambiance, avatar éventuel. | `alt=""` pour le décoratif ; nom accessible pour l'avatar porteur d'information ; texte utile hors des images de fond. | Conforme sur l'échantillon |
| **2. Cadres** | Aucun `iframe` dans le prototype. | Recherche du code et inspection DOM. | Non applicable |
| **3. Couleurs** | Badges, états, textes sur fonds clairs et sombres. | Les états possèdent un libellé ; ratios corrigés à 5,21:1 et 5,22:1 ; Lighthouse 100 %. | Conforme sur l'échantillon |
| **4. Multimédia** | Aucun média temporel audio ou vidéo. | Inspection du périmètre. | Non applicable |
| **5. Tableaux** | Aucun tableau de données dans les parcours retenus. | Les listes sont structurées en articles/cartes. | Non applicable |
| **6. Liens** | Navigation, fiches de lieux, agenda et actions de retour. | Intitulés explicites, focus visible, destination compréhensible hors contexte immédiat. | Conforme sur l'échantillon |
| **7. Scripts** | Filtres, onglets, formulaires, retours dynamiques. | Contrôles natifs, noms accessibles, clavier, `aria-live`/`role`, axe et test Puppeteer. | Conforme sur l'échantillon |
| **8. Éléments obligatoires** | Pages françaises générées par Next.js. | `lang="fr"`, métadonnées de titre/description, balisage valide contrôlé par Lighthouse. | Conforme sur l'échantillon |
| **9. Structuration** | Header, navigation, contenu principal, sections et titres. | Landmark `main`, navigation nommée, un `h1`, ordre `h1` puis `h2`/`h3` corrigé. | Conforme sur l'échantillon |
| **10. Présentation** | Responsive, focus, animations et contenus masqués. | CSS séparée, focus visible, réduction de mouvement, zoom/reflow à 360 px sans débordement du document. | Conforme sur l'échantillon |
| **11. Formulaires** | Authentification, profils, filtres et événements. | Labels associés, fieldset/legend pour le rôle, autocomplete auth, erreurs reliées, validation Zod, boutons occupés avec `aria-busy`. | Conforme sur l'échantillon |
| **12. Navigation** | Header, barre d'onglets et accès au contenu. | Lien d'évitement, `aria-current`, ordre DOM logique, zones de scroll internes, commandes au moins 44 px. | Conforme sur l'échantillon |
| **13. Consultation** | Aucun délai, clignotement, rafraîchissement automatique ou document téléchargé. | Responsive portrait, réduction des animations, absence de limite de temps dans le parcours. | Conforme pour les critères applicables |

## 6. Résultats automatisés du 20 juillet 2026

### Lighthouse public en production

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | :---: | :---: | :---: | :---: |
| Accueil | 99 | **100** | 100 | 100 |
| Connexion | 97 | **100** | 96 | 100 |
| Inscription | 99 | **100** | 96 | 100 |

### Lighthouse authentifié

| État | Score accessibilité |
| --- | :---: |
| Dashboard grimpeur | **100** |
| Matching grimpeur | **100** |
| Demandes grimpeur | **100** |
| Lieux grimpeur | **100** |
| Événements grimpeur | **100** |
| Profil grimpeur | **100** |
| Événements club | **100** |
| Profil club | **100** |
| Dashboard grimpeur, viewport 360 x 800 | **100** |
| Profil grimpeur, viewport 360 x 800 | **100** |

### Contrôles d'interaction et de reflow

```text
Lien d'évitement premier au focus : réussi
Cible #contenu-principal après activation : réussie
Préférence de réduction du mouvement : réussie
Dashboard 360 px : scrollWidth 360, aucun débordement
Profil 360 px   : scrollWidth 360, aucun débordement
```

Les captures `dashboard-mobile.png` et `profile-mobile.png` sont générées dans l'artefact `.accessibility`. Leur inspection confirme l'absence de chevauchement incohérent ; la navigation et les onglets utilisent un scroll interne lorsque tous les items ne tiennent pas sur une seule ligne.

### Preuve GitHub Actions

L'[exécution no 29743712530](https://github.com/Dorianyloj/spity/actions/runs/29743712530) est réussie sur le SHA `3779eee23e86f013c76e54f8f96a44a87a80b31c` :

- audit authentifié exécuté avec succès en 2 min 24 s ;
- job `Lighthouse thresholds` réussi sur les pages publiques ;
- artefact `accessibility-3779eee23e86f013c76e54f8f96a44a87a80b31c` de 1 509 342 octets ;
- rapports JSON, synthèse et deux captures mobiles conservés jusqu'au 19 août 2026.

### Tests de composants

Les tests `jest-axe` couvrent :

- Input et Textarea avec erreurs ;
- toolbar de recherche et filtres ;
- formulaires connexion et inscription ;
- formulaire de création d'événement ;
- activation clavier de l'affichage du mot de passe.

Ils s'intègrent au seuil de couverture et au job `Quality gates`.

## 7. Limites et plan de maintien

Un score axe ou Lighthouse de 100 % ne contrôle pas tous les critères RGAA, notamment la pertinence éditoriale, la compréhension par des utilisateurs réels et l'interopérabilité complète avec les lecteurs d'écran. En conséquence :

- le résultat est formulé comme conformité de l'échantillon aux critères applicables vérifiés, pas comme déclaration légale de conformité globale du futur service ;
- un passage manuel NVDA + Firefox et VoiceOver + Safari reste requis avant une publication publique ;
- chaque nouveau composant interactif doit rejoindre les tests axe ou le scénario navigateur ;
- tout ajout de vidéo, iframe, tableau complexe, carte ou upload déclenchera la réouverture des thèmes actuellement non applicables ;
- les rapports CI sont conservés 30 jours et les résultats synthétiques sont inscrits dans ce dossier.

## 8. Conclusion

Le prototype répond au RGAA 4.1.2 sur l'échantillon fonctionnel BC02 vérifié : structure, formulaires, navigation clavier, annonces dynamiques, contrastes, réduction des animations et reflow mobile sont traités et testés. Les écarts détectés lors du premier passage ont été corrigés puis retestés à 100 % sur treize pages ou états publics et authentifiés.

La limite restante concerne la validation avec plusieurs technologies d'assistance et des utilisateurs en situation de handicap ; elle est inscrite au plan de recette avant mise en production.
