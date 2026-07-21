# Dossier de validation BC02 - Spity

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

Ce dossier documente les neuf compétences du bloc BC02 à partir d'une réalisation fonctionnelle, versionnée et testée. L'[audit de conformité aux documents officiels](./17_AUDIT_CONFORMITE_OFFICIEL_BC02.md) conclut à vingt-quatre critères couverts, un critère partiel et un critère à compléter. Il distingue volontairement :

- la vision produit complète de Spity ;
- le prototype BC02 effectivement développé ;
- les fonctions testées et démontrables ;
- les limites et évolutions encore nécessaires.

Une fonction absente du périmètre ou non persistante n'est pas présentée comme terminée. Les preuves associent systématiquement une explication, un fichier ou artefact, un résultat vérifié et une limite éventuelle.

## Résumé du projet

Spity répond au besoin des grimpeurs qui utilisent plusieurs services distincts pour rechercher un partenaire, trouver un lieu ou participer à une sortie. Le prototype réunit deux rôles :

- le **grimpeur**, qui gère son profil et son matériel, recherche des partenaires, traite des demandes et s'inscrit à des événements ;
- le **club**, qui gère sa fiche, publie des événements et suit les participants.

Le visiteur peut créer un compte ou se connecter. Les autorisations, la capacité des événements et les données visibles dépendent ensuite du rôle et de la session.

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

Le fil social persistant, les likes/commentaires, la carte interactive, les topos collaboratifs, les notifications, la récupération de mot de passe et les parcours RGPD autonomes restent hors du prototype évalué.

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

L'application utilise TypeScript strict de bout en bout. Next.js rassemble pages, composants serveur et API dans un artefact standalone Node.js 22. Zod valide les données à l'exécution, Drizzle structure les accès et les migrations, MariaDB conserve les relations métier. Docker sépare l'application, les migrations et la base. GitHub Actions construit et teste chaque révision avant staging.

## Résultats vérifiés

| Axe | Résultat de référence |
| --- | --- |
| Analyse statique | ESLint et TypeScript réussis. |
| Tests unitaires | 86 tests réussis. |
| Couverture ciblée | 96 % lignes, 89,69 % branches, 100 % fonctions. |
| Couverture globale mesurée | 20,23 % des lignes et instructions ; critère C2.2.2 à compléter. |
| Intégration | 11 résultats HTTP/MariaDB réussis sur une base migrée à neuf. |
| Recette | 6 scénarios Playwright couvrant F01 à F10, sans retry ni skip. |
| Sécurité | 0 vulnérabilité haute ou critique de production ; dix catégories OWASP analysées. |
| Accessibilité authentifiée | Dix états à 100 % dans l'audit automatisé. |
| Lighthouse public | Performance 97 à 99, accessibilité 100, SEO 100. |
| Responsive | Reflow vérifié à 360 px sans défilement horizontal incohérent. |
| Livraison | Release `v0.1.0`, images immuables, bundle, manifeste et SHA-256. |
| Dernière CI probante | Run `29819189642`, cinq jobs réussis dont staging. |

## Couverture des compétences

### C2.1.1 - Environnements et déploiement

Les environnements développement, test, staging et production sont séparés. Les outils, secrets, seuils et séquences de déploiement sont définis. Le staging construit des images par SHA uniquement après les contrôles qualité, puis vérifie migrations et santé dans un environnement isolé.

Preuve principale : [environnements, qualité et déploiement](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md).

### C2.1.2 - Intégration continue

Le pipeline décrit l'installation verrouillée, le lint, le typage, Jest, l'audit, les configurations Compose, le build, MariaDB, l'accessibilité, Lighthouse et la recette standalone. Un échec bloque la promotion, comme le prouve le run `29749715001`.

Preuve principale : [protocole d'intégration continue](./03_PROTOCOLE_INTEGRATION_CONTINUE.md).

### C2.2.1 - Prototype maintenable

L'architecture par feature sépare présentation, API, règles métier et données. Les composants partagés et les contrats Zod limitent la duplication. Le prototype répond aux user stories retenues sur desktop et mobile.

Preuve principale : [architecture et prototype](./05_ARCHITECTURE_PROTOTYPE_C221.md).

### C2.2.2 - Harnais unitaire

Jest couvre les validateurs, le parseur de matériel, les règles d'événements et de matching, le quota, le contrôle d'origine, les en-têtes et des composants critiques. Ce périmètre ciblé atteint 96 % des lignes, mais la mesure globale atteint 20,23 % : la majorité du code développé n'est pas encore couverte par des tests unitaires. L'intégration réelle et Playwright renforcent la non-régression sans remplacer ce critère.

Preuves principales : [harnais Jest](./04_HARNAIS_TESTS_UNITAIRES.md) et [tests d'intégration](./06_TESTS_INTEGRATION_C222.md).

### C2.2.3 - Sécurité et accessibilité

La sécurité est reliée aux dix catégories OWASP 2025. Le RGAA 4.1.2 est retenu et justifié pour le contexte français. Les résultats automatisés sont complétés par des contrôles clavier, focus, mouvement réduit et mobile.

Preuves principales : [sécurité OWASP](./07_SECURITE_OWASP_C223.md) et [accessibilité RGAA](./08_ACCESSIBILITE_RGAA_C223.md).

### C2.2.4 - Versions et déploiements

Git, Semantic Versioning, le changelog et les images par SHA relient le besoin à l'artefact. La release stable promeut le même candidat testé et fournit un bundle de déploiement autonome.

La manipulation technique est documentée, mais une session autonome formalisée avec des utilisateurs distincts du développeur reste nécessaire pour rendre la preuve complète.

Preuve principale : [versions et déploiements](./09_VERSIONS_DEPLOIEMENTS_C224.md).

### C2.3.1 - Cahier de recettes

Le cahier couvre toutes les fonctions F01 à F10, les rôles, les cas alternatifs, la sécurité, la structure et le mobile. Les scénarios sont automatisés et exécutés sur une MariaDB migrée.

Preuve principale : [cahier de recettes](./10_CAHIER_RECETTES_C231.md).

### C2.3.2 - Correction des bogues

Sept anomalies réelles ont été détectées, qualifiées, corrigées et retestées. Le registre différencie les défauts produit des erreurs de harnais. Aucun seuil ni cookie de production n'a été affaibli pour obtenir une CI verte.

Preuve principale : [plan de correction](./11_PLAN_CORRECTION_BOGUES_C232.md).

### C2.4.1 - Documentation d'exploitation

Trois manuels séparés permettent de déployer, utiliser et maintenir Spity. Ils décrivent les langages, technologies, commandes, rôles, diagnostics, sauvegardes, mises à jour et retours arrière.

Preuves principales : [manuel de déploiement](./12_MANUEL_DEPLOIEMENT_C241.md), [manuel d'utilisation](./13_MANUEL_UTILISATION_C241.md) et [manuel de maintenance](./14_MANUEL_MISE_A_JOUR_C241.md).

## Démonstration conseillée

1. Présenter le périmètre F01-F10 et les limites.
2. Se connecter avec le compte grimpeur Lina.
3. Montrer son profil, son matériel, les filtres de matching et les lieux.
4. Se connecter avec le compte club et créer un événement de capacité `1`.
5. Revenir au compte Lina et s'inscrire.
6. Revenir au club pour afficher la participante et annuler l'événement.
7. Présenter le run CI vert, le run bloqué et le registre de correction.
8. Ouvrir l'index des critères pour répondre aux questions du jury.

## Limites et perspectives

La réalisation est un prototype de certification, pas une plateforme publique prête à accueillir des données réelles. Les limites principales sont :

- aucune session pilote externe formalisée à la date du dossier ;
- couverture unitaire globale de 20,23 %, inférieure à la majorité demandée par C2.2.2 ;
- récupération de mot de passe, export et suppression autonome de compte non exposés ;
- fil social, carte interactive et topos encore démonstratifs ou hors périmètre ;
- alertes modérées de dépendances suivies, sans vulnérabilité haute ou critique ;
- supervision, sauvegardes planifiées et test de restauration à industrialiser avant production publique.

Les priorités suivantes sont la validation utilisateur, les parcours RGPD, la récupération de compte, la persistance sociale, la cartographie et le renforcement de la couverture des composants de présentation.

## Conclusion

Spity démontre une chaîne cohérente de conception et de développement : besoin cadré, architecture structurée, fonctionnalités cohérentes, contrôles automatisés, correction d'anomalies, version stable et documentation d'exploitation. Le dossier ne repose pas uniquement sur une description : chaque compétence renvoie à du code versionné, une commande ou un résultat distant. L'acquisition complète reste conditionnée par le renforcement de la couverture unitaire globale et la formalisation d'un essai utilisateur autonome.

L'[index des critères](./15_INDEX_PREUVES_GRILLE_BC02.md) constitue le point d'entrée pour l'évaluation. Les chapitres détaillés qui suivent fournissent les explications et preuves nécessaires à chaque ligne de la grille.
