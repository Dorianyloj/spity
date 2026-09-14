# Bloc 3 - Kit de soutenance Spity

État au 14 septembre 2026 : dossier, support oral, classeur, annexes et démonstration préparés. Le kit est disponible pour la répétition. Les confirmations personnelles et administratives de la checklist restent nécessaires avant remise ; aucune validation de compétence par le jury n'est présumée.

**Intitulé : Coordonner et piloter un projet de développement d'applications logicielles.**

## Commencer ici

| Besoin | Fichier |
| --- | --- |
| Tout récupérer pour la répétition | [Kit ZIP](../../../output/bloc-03/kit-soutenance-spity.zip) |
| Lire le dossier et les neuf annexes | [PDF](../../../output/pdf/dossier-bloc-03-spity.pdf) ; [source modifiable](DOSSIER_BLOC_03.md) |
| Présenter en trente minutes | [PowerPoint visuel avec texte oral et timing](../../../output/presentations/spity-bloc-3-30-minutes-visuel-v7.pptx) ; [guide d'oral](GUIDE_ORAL.md) |
| Manipuler les coûts, charges et risques | [Classeur Excel](../../../outputs/bloc03-01a09eba/pilotage-spity.xlsx) ; [données du cas](donnees/pilotage.json) |
| Retrouver les preuves par compétence | [Matrice](MATRICE_PREUVES.md) ; [vérifications datées](VERIFICATION.md) |
| Justifier les données et retrouver Linear | [A09 : relevé et estimations](annexes/A09_DONNEES_LINEAR.md) ; [25 tickets observés](donnees/linear-2026-09-14.json) |
| Relier les quatre blocs | [Revue de cohérence](COHERENCE_INTER_BLOCS.md) : commanditaire, budget global, lot B3 et preuves datées. |
| Lancer ou répéter la démonstration | [Procédure A08](annexes/A08_DEMONSTRATION.md) ; [outils](../../../tools/bloc3/README.md) |
| Finaliser les informations et le dépôt | [Checklist de remise](CHECKLIST_REMISE.md) |

Le kit distingue les faits techniques observés d'une mise en situation fictive de management. Les charges, coûts, rôles et comptes rendus du scénario sont des hypothèses explicites. L'équipe réelle, les échanges client et les dates du campus restent à préciser avec Dorian.

Le commanditaire fictif reprend celui du Bloc 1 : Collectif Altitude Grimpe, représenté par Claire Martin. Le budget global cité est celui des fiches détaillées B1, 38 126 EUR HT sur 79 jours-homme. Le lot pédagogique B3 est distinct. Les anciens diaporamas B1 affichent 44 250 EUR et 82 jours-homme ; cet écart est documenté dans la revue de cohérence et reste à harmoniser avant une remise commune.

Le diaporama visuel comporte 22 slides principales et 3 annexes. Huit graphiques modifiables présentent le planning, les coûts, la charge et la formation. Une matrice montre les risques, des captures agrandies accompagnent la démonstration et une illustration représente l'équipe fictive. Les [sources des visuels](visuels/README.md) sont documentées. Les notes développent le texte à dire, les transitions et les manipulations. Les repères totalisent 24 minutes d'explications et 6 minutes de démonstration. Prévoir une répétition chronométrée pour ajuster le débit ; le PowerPoint avance manuellement. Les fichiers soutenance-bloc-03-spity.pptx et spity-bloc-3-30-minutes.pptx conservent les versions précédentes comme archives.

Le 14 septembre, les contrôles ont réussi : lint, TypeScript, build, 389 tests unitaires dans 72 suites et six scénarios navigateur avec une MariaDB dédiée. La démonstration se lance sur http://127.0.0.1:3313 avec `powershell -File tools/bloc3/demo.ps1` depuis la racine. Premier lancement sur une nouvelle machine : utiliser `-Prepare` selon A08. Les résultats détaillés et leur portée figurent dans VERIFICATION.md.

## 1. Modalités établies par les documents fournis

| Point | Attendu officiel | Source |
| --- | --- | --- |
| Épreuve | Oral individuel de 45 minutes : 30 minutes de présentation et 15 minutes d'échange avec le jury. | S2, p. 6 |
| Contenu | Présentation de la gestion du projet et démonstration du logiciel développé pendant la formation. Prévoir la démonstration dans les 30 minutes de présentation. | S1, p. 11 ; S2, p. 6 |
| Situation | Mise en situation professionnelle réelle ou fictive. | S1, p. 11 |
| Calendrier annoncé | Période du 1er au 29 septembre 2026. La convocation du campus doit préciser le passage individuel ; cette période n'est pas la date limite de dépôt. | S2, p. 4 |
| Dépôt | Déposer les livrables et le support de présentation sur DigiformaCertif dans le délai imparti. Le document indique une invalidation du bloc en cas de défaut de dépôt. | S2, p. 11 |
| Validation | Au moins 50 % des compétences acquises, sans compétence éliminatoire non acquise. Avec les sept compétences de la grille, cela correspond à au moins quatre compétences acquises, sous réserve de la condition sur les éliminatoires. | S2, p. 8 ; S3 |

Les trois documents ne fixent pas de nombre de pages pour un dossier écrit du Bloc 3, ni de nombre de diapositives. Les plafonds de 30 et 20 pages de S2 concernent respectivement les Blocs 2 et 4. Notre dossier de travail regroupera les explications et les preuves pour construire le support oral.

Le règlement spécial de certification, mentionné dans S2 p. 6 et 10, n'est pas parmi les trois pièces analysées. Il reste à vérifier pour le détail du dépôt, les éventuelles contraintes complémentaires et l'identification des compétences éliminatoires. La grille fournie ne les identifie pas explicitement. La préparation vise la couverture des sept compétences.

## 2. Checklist des sept compétences

Les éléments ci-dessous synthétisent S1 p. 11 à 14 et S3. Les formats proposés dans la dernière colonne sont des choix de préparation, pas des modèles imposés par YNOV. RACI signifie Responsible, Accountable, Consulted, Informed ; RASCI ajoute Support.

| Compétence | Ce que le jury doit pouvoir constater | Documents ou démonstrations à préparer |
| --- | --- | --- |
| **C.3.1 - Planifier** | Méthode et outil de planification justifiés et compatibles ; phases, tâches, ressources, responsabilités et points de vigilance identifiés. | Méthodologie, planning détaillé avec dépendances et jalons, ressources humaines/financières/matérielles, matrice des responsabilités. |
| **C3.2.1 - Suivre l'avancement** | Outil adapté et suivi régulier avec des indicateurs mesurables sur l'avancement, les coûts, les délais, les risques et les ressources humaines. | Tableau de bord daté, extraits du suivi de projet, comparaison prévisionnel/réalisé et interprétation des écarts. |
| **C3.2.2 - Arbitrer** | Problème et conséquences expliqués, options comparées, décision argumentée permettant de résoudre le problème. | Fiche d'arbitrage : constat, options, aide à la décision, choix, impacts et résultat. |
| **C3.3.1 - Piloter l'équipe** | Missions réparties selon les compétences et une charge équilibrée ; style managérial expliqué, communication adaptée, analyse critique et recommandations réalistes. | Répartition des missions et de la charge, outils de communication et de partage, étude d'une situation managériale. |
| **C3.3.2 - Développer les compétences** | Besoins du projet identifiés, compétences actuelles et à acquérir évaluées, plan de développement détaillé et formations adaptées. | Grille de compétences commentée et plan de formation ; besoin de recrutement à expliciter si applicable. |
| **C3.4.1 - Assurer le suivi client** | Comptes rendus clairs qui facilitent les décisions, points de validation organisés et indicateurs de satisfaction cohérents. | Comptes rendus d'avancement, calendrier et traces des validations, indicateurs de satisfaction définis et résultats disponibles. |
| **C3.4.2 - Démontrer le logiciel** | Dernière version utilisable, fonctionnalités attendues présentées avec un vocabulaire adapté au client et démonstration permettant la validation. | Logiciel opérationnel, scénario de démonstration relié aux besoins et critères d'acceptation. |

### Critères à contrôler pendant la relecture et la répétition

- [ ] **C.3.1** : justifier la méthode réellement utilisée ; choisir un outil cohérent (Gantt, rétroplanning, etc.) ; rendre visibles les phases d'étude, de mesure, de conception, de réalisation et de restitution ; affecter les tâches selon les compétences et tenir compte des situations de handicap ; identifier les points de vigilance.
- [ ] **C3.2.1** : documenter la fréquence du suivi et les décisions qu'il déclenche ; donner la date, la source et la méthode de calcul de chaque indicateur ; couvrir coûts, délais, avancement, risques et charge/capacité de l'équipe. Un décompte de tickets ne couvre pas tous ces critères.
- [ ] **C3.2.2** : partir d'un écart ou d'une dérive ; décrire les options et leurs conséquences ; fournir un outil d'aide à la décision, par exemple un logigramme ou une matrice de comparaison ; expliquer le résultat de l'arbitrage.
- [ ] **C3.3.1** : expliquer le ou les styles managériaux employés et les techniques d'animation ; analyser une situation ou une posture avec recul ; traiter les adaptations au handicap et les spécificités multiculturelles/internationales applicables au contexte ; justifier les outils collaboratifs et le partage des ressources.
- [ ] **C3.3.2** : comparer niveau actuel et niveau attendu ; préciser les objectifs, bénéficiaires et modalités des formations ; prévoir les adaptations au handicap ; expliciter les besoins de recrutement et leur transmission RH si le cas le nécessite. Pour rendre le plan exploitable, proposer échéances et critères de réussite.
- [ ] **C3.4.1** : relier chaque compte rendu aux évolutions livrées, aux difficultés et aux décisions attendues du client ; expliciter les points de validation réalisés et le suivi qualité ; distinguer les indicateurs de satisfaction des indicateurs techniques et signaler les mesures encore non réalisées.
- [ ] **C3.4.2** : relier chaque étape de démonstration à une fonctionnalité attendue et à son critère d'acceptation ; expliquer la valeur pour l'utilisateur ; identifier la version présentée et vérifier les parcours avant l'oral.

## 3. Éléments Spity déjà repérés

L'inventaire ci-dessous a servi de point de départ. Le kit et les vérifications listés plus haut le complètent. Le tableau Linear a été relu en direct le 14 septembre. Le relevé actuel, les 30 activités estimées et les règles de calcul figurent dans [A09](annexes/A09_DONNEES_LINEAR.md).

| Base existante | Utilité possible pour le Bloc 3 | Limite ou complément nécessaire |
| --- | --- | --- |
| [Cadrage produit](../../../CADRAGE_PROJET.md) et [livrables Bloc 1](../bloc-01/) | Besoins, périmètre, parties prenantes, risques et budget prévisionnel. | Confirmer le périmètre réellement retenu, les acteurs impliqués et les écarts au prévisionnel. La cartographie des acteurs ne remplace pas une affectation des tâches de l'équipe. |
| [État daté du backlog Linear](../../audits/2026-09-09-synchronisation-linear.md) | Base pour expliquer le suivi, les priorités et les dépendances. | Document du 9 septembre : 12 Done, 5 Todo, 7 Backlog, 1 Canceled. Il n'invente ni dates cibles ni estimations et ne constitue pas à lui seul un suivi des coûts et délais. Relecture directe du 14 septembre : 12 Done, 4 Todo, 1 In Progress, 7 Backlog, 1 Canceled ; voir A09. |
| Historique Git et [retour d'expérience Bloc 2](../../bc02/19_RETOUR_EXPERIENCE_ET_CHOIX_TECHNIQUES.md) | Traces des réalisations et pistes pour un cas d'arbitrage. | Un changement technique devient une preuve d'arbitrage lorsque l'écart, les options, le choix et les conséquences sont explicités. |
| [Cahier de recettes Bloc 2](../../bc02/10_CAHIER_RECETTES_C231.md) et [preuves Bloc 4](../bloc-04/preuves/README.md) | Base pour les critères d'acceptation, la préparation de la démonstration et les indicateurs de qualité. | Rejouer les parcours utiles sur la version présentée. Les preuves de tests et de maintenance ne constituent pas automatiquement une validation ou une satisfaction client. |

Le document de synchronisation du 9 septembre indique que les 24 tickets non annulés sont attribués à Dorian Joly. Cela ne suffit pas à conclure qu'aucune autre personne n'a participé au projet. L'équipe, les interlocuteurs et leurs rôles restent à préciser avec le candidat.

Les parties à documenter en priorité sont le planning confronté au réalisé, le suivi des coûts et de la charge, le management, le développement des compétences et les échanges de validation avec le client.

## 4. Organisation proposée pour notre travail

1. **Poser le contexte** : rôle du candidat, personnes réellement impliquées, commanditaire ou interlocuteurs, période du projet, contraintes et date de soutenance.
2. **Rassembler les preuves disponibles** : planning, backlog daté, estimations ou temps suivis, dépenses, décisions, échanges et retours utilisateurs. Identifier ce qui manque.
3. **Rédiger les sept parties** : pour chacune, expliquer le contexte, l'action personnelle, les choix, les résultats, les limites et les preuves associées.
4. **Construire le support et la démonstration** : garder les pièces détaillées dans un dossier d'annexes et associer chaque compétence à ses diapositives et preuves.
5. **Répéter et contrôler le dépôt** : tenir les 30 minutes, préparer les réponses du jury et respecter les exigences confirmées du campus.

### Répartition proposée des 30 minutes

Cette répartition est une recommandation de préparation, pas une exigence officielle.

| Séquence | Durée |
| --- | --- |
| Contexte Spity, besoin et nature des preuves | 2 min 30 |
| C.3.1 - Méthode, planning et ressources | 4 min |
| C3.2.1 - Suivi et indicateurs | 5 min |
| C3.2.2 - Cas d'arbitrage | 3 min 30 |
| C3.3.1 - Management et communication | 3 min |
| C3.3.2 - Compétences et formations | 2 min 30 |
| C3.4.1 - Suivi client et validations | 2 min 30 |
| C3.4.2 - Démonstration | 6 min |
| Bilan et transition vers les questions | 1 min |
| **Total présentation, démonstration incluse** | **30 min** |

### Informations à préciser ensemble

- Qui a travaillé sur Spity, avec quel rôle et quelle disponibilité ?
- Qui a exprimé les besoins, testé le logiciel ou validé des étapes ?
- Quelles sont les dates réelles du projet, de la soutenance et du dépôt ?
- Quels planning, suivis de temps/coûts, échanges et retours existent déjà ?
- Quelles précisions le règlement spécial et les consignes du campus apportent-ils ?

Si certaines situations de management ou de relation client sont fictives, les présenter comme telles et les distinguer des faits et preuves réels. Le référentiel admet une situation fictive, mais cela ne permet pas de présenter une équipe inventée, un compte rendu reconstitué ou une validation simulée comme un événement réellement survenu. Les détails d'application seront rapprochés des consignes du campus.

## 5. Sources consultées

- **S1** - « Référentiel Expert en développement logiciel RNCP39583 (1) (2).pdf », pages 11 à 14, intitulé Bloc 3 et colonnes Activités, Compétences, Modalités et Critères d'évaluation. La [copie déjà archivée dans le dépôt](../referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf) est identique au fichier fourni : SHA-256 `4892018d969edff4ea79dfd90b23ec0c37ab5bd618af0cd9b831ba878cfe4466`.
- **S2** - « 25-26 Modalités_Evaluations_Titre EDL RNCP39583_YNOV_M2_filiere Info (2).pdf », Ludovic NAY, V1.0, rentrée 2025. Pages 4 (planning), 6 (modalités), 8 (validation), 10 (documents de référence) et 11 (dépôt). Fichier fourni dans le dossier Téléchargements du candidat, non recopié dans le dépôt.
- **S3** - « 24 10 10 Grille évaluation Expert en développement logiciel_BC03.pdf », page unique : sept compétences, livrables et critères, résultat « Acquis / Non Acquis ». Fichier fourni dans le dossier Téléchargements du candidat, non recopié dans le dépôt.

Les pages pertinentes ont été extraites et contrôlées visuellement, notamment l'alignement des modalités par bloc et les lignes de la grille. Les trois PDF d'origine n'ont pas été modifiés.
