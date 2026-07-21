# Mon dossier de validation BC02 - Spity

## Identification

| Champ | Valeur |
| --- | --- |
| Candidat | Dorian Joly |
| Certification | Expert en développement logiciel - RNCP39583 |
| Bloc | BC02 - Concevoir et développer des applications logicielles |
| Projet | Spity, réseau social pour la communauté escalade |
| Prototype évalué | Application web responsive, version `0.1.0` |
| Branche de travail | `develop` |
| Release stable | `v0.1.0` |
| Date du dossier | 21 juillet 2026 |
| Dépôt | [github.com/Dorianyloj/spity](https://github.com/Dorianyloj/spity) |

## Déclaration de périmètre

Dans ce dossier, je présente le travail que j'ai réalisé sur Spity pour les neuf compétences du bloc BC02. Je me suis appuyé sur une version fonctionnelle, versionnée et testée du projet. Mon [audit de conformité aux documents officiels](./17_AUDIT_CONFORMITE_OFFICIEL_BC02.md) aboutit à vingt-cinq critères couverts et un critère partiel. J'ai volontairement séparé :

- la vision produit complète de Spity ;
- le prototype BC02 effectivement développé ;
- les fonctions testées et démontrables ;
- les limites et évolutions encore nécessaires.

Je ne présente pas comme terminée une fonction absente du périmètre ou encore non persistante. Pour chaque compétence, j'ai essayé de fournir une explication, un fichier ou un artefact, un résultat vérifiable et, lorsque c'est nécessaire, une limite clairement annoncée.

## Résumé du projet

J'ai imaginé Spity à partir d'un constat simple : un grimpeur utilise souvent plusieurs services pour rechercher un partenaire, trouver un lieu ou participer à une sortie. J'ai choisi de réunir ces usages dans un même prototype avec deux rôles :

- le **grimpeur**, qui gère son profil et son matériel, recherche des partenaires, traite des demandes et s'inscrit à des événements ;
- le **club**, qui gère sa fiche, publie des événements et suit les participants.

Un visiteur peut créer un compte ou se connecter. J'ai ensuite fait dépendre les autorisations, la capacité des événements et les données visibles du rôle et de la session active.

## Périmètre démontrable

| ID | Fonction |
| --- | --- |
| F01 | Inscription, connexion, session et déconnexion. |
| F02 | Création, consultation et modification des profils grimpeur et club. |
| F03 | Recherche de partenaires par texte, discipline, niveau, disponibilité et environnement. |
| F04 | Envoi, acceptation, refus et historique des demandes de partenariat. |
| F05 | Création, modification et annulation d'un événement par son club. |
| F06 | Consultation des événements et des capacités restantes. |
| F07 | Inscription et désinscription d'un grimpeur. |
| F08 | Consultation des participants par le club organisateur. |
| F09 | Validation, contrôle de session, rôle, origine, quota et réponses sûres. |
| F10 | Structure sémantique, clavier, reflow mobile et mouvement réduit. |

J'ai laissé hors du prototype évalué le fil social persistant, les likes/commentaires, la carte interactive, les topos collaboratifs, les notifications, la récupération de mot de passe et les parcours RGPD autonomes. Ces fonctions appartiennent à la vision complète, mais les intégrer sans pouvoir les tester correctement aurait fragilisé la démonstration.

## Architecture synthétique

```text
Navigateur React / composants accessibles
                 |
                 v
Next.js App Router et Route Handlers
                 |
       Zod + règles métier TypeScript
                 |
          Dépôts Drizzle ORM
                 |
                 v
             MariaDB 11.4
```

J'ai utilisé TypeScript strict de bout en bout. J'ai retenu Next.js pour réunir les pages, les composants serveur et les API dans un même projet, puis produire un artefact standalone sous Node.js 22. J'utilise Zod pour contrôler les données à l'exécution, Drizzle pour structurer les accès et les migrations, et MariaDB pour conserver les relations métier. Docker sépare l'application, les migrations et la base. Enfin, GitHub Actions reconstruit et teste chaque révision avant le staging.

## Résultats vérifiés

| Axe | Résultat de référence |
| --- | --- |
| Analyse statique | ESLint et TypeScript réussis. |
| Tests unitaires | 126 tests réussis dans 23 suites. |
| Couverture globale mesurée | 62,56 % lignes/instructions, 77,67 % branches et 55,06 % fonctions sur tout `src/`. |
| Intégration | 11 résultats HTTP/MariaDB réussis sur une base migrée à neuf. |
| Recette | 6 scénarios Playwright couvrant F01 à F10, sans retry ni skip. |
| Sécurité | 0 vulnérabilité haute ou critique de production ; dix catégories OWASP analysées. |
| Accessibilité authentifiée | Dix états à 100 % dans l'audit automatisé. |
| Lighthouse public | Performance 97 à 99, accessibilité 100, SEO 100. |
| Responsive | Reflow vérifié à 360 px sans défilement horizontal incohérent. |
| Livraison | Release `v0.1.0`, images immuables, bundle, manifeste et SHA-256. |
| Dernière CI probante | Run `29827790355`, cinq jobs réussis dont staging et couverture globale. |
| Annexes visuelles | Sept captures : produit desktop/mobile, historique Git, pipeline CI et release. |

## Couverture des compétences

### C2.1.1 - Environnements et déploiement

J'ai séparé les environnements de développement, de test, de staging et de production. J'ai défini les outils, les variables, les seuils et l'ordre des opérations. Le staging construit des images identifiées par SHA seulement après les contrôles qualité, puis vérifie les migrations et la santé de l'application dans un environnement isolé.

Preuve principale : [environnements, qualité et déploiement](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md).

### C2.1.2 - Intégration continue

J'ai construit le pipeline autour d'une installation verrouillée, du lint, du typage, de Jest, de l'audit, des configurations Compose, du build, de MariaDB, de l'accessibilité, de Lighthouse et de la recette standalone. Je voulais qu'un échec bloque réellement la promotion. Le run `29749715001`, où le staging a été ignoré après un échec, montre que ce mécanisme fonctionne.

Preuve principale : [protocole d'intégration continue](./03_PROTOCOLE_INTEGRATION_CONTINUE.md).

### C2.2.1 - Prototype maintenable

J'ai organisé le code par fonctionnalité afin de séparer la présentation, les API, les règles métier et les données. Les composants partagés et les contrats Zod m'ont permis de limiter la duplication. J'ai vérifié les user stories retenues sur desktop et sur mobile.

Preuve principale : [architecture et prototype](./05_ARCHITECTURE_PROTOTYPE_C221.md).

### C2.2.2 - Harnais unitaire

J'utilise Jest pour les validateurs, le parseur de matériel, les règles d'événements et de matching, le quota, le contrôle d'origine, les en-têtes, les principaux composants interactifs et le contrat Drizzle. Après une première mesure trop ciblée, j'ai étendu la configuration à tout `src/`. J'atteins 62,56 % des lignes et instructions. Les seuils globaux bloquent désormais la CI ; les tests MariaDB et Playwright complètent cette couverture.

Preuves principales : [harnais Jest](./04_HARNAIS_TESTS_UNITAIRES.md) et [tests d'intégration](./06_TESTS_INTEGRATION_C222.md).

### C2.2.3 - Sécurité et accessibilité

J'ai relié mes mesures de sécurité aux dix catégories OWASP 2025. Pour l'accessibilité, j'ai retenu le RGAA 4.1.2, adapté au contexte français. Je ne me suis pas limité aux scores automatisés : j'ai aussi vérifié le clavier, le focus, la réduction des mouvements et le reflow mobile.

Preuves principales : [sécurité OWASP](./07_SECURITE_OWASP_C223.md) et [accessibilité RGAA](./08_ACCESSIBILITE_RGAA_C223.md).

### C2.2.4 - Versions et déploiements

J'utilise Git, Semantic Versioning, un changelog et des images identifiées par SHA pour relier une évolution à l'artefact livré. La release stable reprend le même candidat que celui testé et fournit un bundle de déploiement autonome.

J'ai documenté la manipulation technique, mais je n'ai pas encore formalisé une session autonome avec des utilisateurs distincts de moi. C'est la raison pour laquelle je conserve ce critère comme partiel.

Preuve principale : [versions et déploiements](./09_VERSIONS_DEPLOIEMENTS_C224.md).

### C2.3.1 - Cahier de recettes

J'ai construit le cahier de recettes autour des fonctions F01 à F10, des deux rôles, des cas alternatifs, de la sécurité, de la structure et du mobile. Les scénarios sont automatisés et exécutés sur une MariaDB créée puis migrée à neuf.

Preuve principale : [cahier de recettes](./10_CAHIER_RECETTES_C231.md).

### C2.3.2 - Correction des bogues

J'ai conservé sept anomalies réellement rencontrées, puis je les ai qualifiées, corrigées et retestées. Dans le registre, je distingue un défaut du produit d'une erreur du harnais de test. Je n'ai baissé aucun seuil et je n'ai pas affaibli les cookies de production pour rendre la CI verte.

Preuve principale : [plan de correction](./11_PLAN_CORRECTION_BOGUES_C232.md).

### C2.4.1 - Documentation d'exploitation

J'ai rédigé trois manuels séparés pour le déploiement, l'utilisation et la maintenance de Spity. Ils décrivent les langages, les technologies, les commandes, les rôles, les diagnostics, les sauvegardes, les mises à jour et les retours arrière.

Preuves principales : [manuel de déploiement](./12_MANUEL_DEPLOIEMENT_C241.md), [manuel d'utilisation](./13_MANUEL_UTILISATION_C241.md) et [manuel de maintenance](./14_MANUEL_MISE_A_JOUR_C241.md).

## Démonstration que je prévois

1. Je présente le périmètre F01-F10 et les limites.
2. Je me connecte avec le compte grimpeur Lina.
3. Je montre son profil, son matériel, les filtres de matching et les lieux.
4. Je me connecte avec le compte club et je crée un événement de capacité `1`.
5. Je reviens au compte Lina pour réaliser l'inscription.
6. Je reviens au club pour afficher la participante puis annuler l'événement.
7. Je présente le run CI vert, le run bloqué et le registre de correction.
8. J'ouvre l'index des critères pour répondre aux questions du jury.

## Limites et perspectives

Je présente Spity comme un prototype de certification, pas comme une plateforme publique déjà prête à accueillir des données réelles. Les principales limites que j'ai identifiées sont :

- aucune session pilote externe formalisée à la date du dossier ;
- couverture des dépôts Drizzle et Route Handlers encore inférieure à celle des composants et règles métier ;
- récupération de mot de passe, export et suppression autonome de compte non exposés ;
- fil social, carte interactive et topos encore démonstratifs ou hors périmètre ;
- alertes modérées de dépendances suivies, sans vulnérabilité haute ou critique ;
- supervision, sauvegardes planifiées et test de restauration à industrialiser avant production publique.

Mes prochaines priorités sont la validation utilisateur, les parcours RGPD, la récupération de compte, la persistance sociale, la cartographie et le renforcement des tests des couches serveur.

## Conclusion

Avec Spity, je montre une chaîne complète de conception et de développement : j'ai cadré le besoin, structuré l'architecture, développé un ensemble cohérent de fonctions, automatisé les contrôles, corrigé les anomalies, produit une version stable et rédigé la documentation d'exploitation. Je ne veux pas que ce dossier repose uniquement sur mes explications : chaque compétence renvoie à du code versionné, une commande ou un résultat distant. La dernière preuve partielle que je dois encore formaliser est un essai utilisateur autonome avec des personnes externes au développement.

L'[index des critères](./15_INDEX_PREUVES_GRILLE_BC02.md) constitue le point d'entrée pour l'évaluation. Les documents techniques liés fournissent les explications et preuves nécessaires à chaque ligne de la grille.

Les [annexes visuelles](./18_ANNEXES_VISUELLES_BC02.md) regroupent les captures produit et GitHub utilisées pendant la soutenance.
