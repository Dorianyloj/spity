# Comprendre les diapositives du Bloc 3 quand on est développeur

Ce guide explique le [diaporama v13](../../../output/presentations/spity-bloc-3-30-minutes-visuel-v13.pptx) avec des situations de développement. Lis-le pour comprendre le raisonnement, puis utilise le [guide oral](GUIDE_ORAL.md) pour travailler la durée. Les phrases courtes ci-dessous sont des points de départ : elles ne remplissent pas à elles seules les trente minutes.

Pour les sigles et le vocabulaire, consulte le [lexique simple du Bloc 3](LEXIQUE_SIMPLE.md), qui développe notamment QA, CP, RACI et les termes des plannings et budgets.

## L'histoire que tu racontes

Tu développes Spity pour des grimpeurs et des clubs. Pour préparer une version à montrer, tu dois choisir les fonctionnalités, répartir le travail, suivre les problèmes et expliquer tes décisions. Le Bloc 3 présente cette organisation autour du code.

Une situation suffit pour comprendre le fil conducteur : **le client demande une fonction de plus alors que les inscriptions aux événements demandent encore des corrections.** Tu estimes le travail, regardes le temps disponible et proposes de reporter l'ajout pour terminer et tester ce qui est déjà prévu. Tu expliques ce choix à l'équipe et au client, puis tu montres le résultat.

L'application, le code et les preuves datées existent. L'équipe CP/DEV/QA, Camille, les heures, les réunions et les demandes client de ce cas sont fictifs. À l'oral, annonce cette mise en situation. Pour ces passages, « dans le scénario, je prévois… » décrit correctement ce que tu présentes.

## Les deux échelles du support

| Ce que tu regardes | Ce que cela signifie |
| --- | --- |
| Projet global du Bloc 1 | La vision de lancement de Spity : neuf lots, 82 jours-homme et 44 250 € de budget estimé. |
| Cas détaillé du Bloc 3 | Un exercice de préparation de démonstration sur quinze jours ouvrés, à partir des fonctions déjà développées. On suit ses heures, ses personnes et ses décisions. |

**Un lot** est un ensemble de travaux. Le support emploie ce mot pour les neuf grandes parties du B1 et pour le cas détaillé B3. Ces deux échelles expliquent la présence de deux plannings et de deux budgets.

**Un jour-homme** représente une journée de travail d'une personne. Les 82 jours-homme sont une quantité de travail. Pour dessiner le planning, le scénario suppose une capacité de cinq jours-homme par semaine : 82 ÷ 5 = 16,4 semaines. Cette projection n'est pas une durée historique mesurée. J10 signifie simplement le dixième jour ouvré du cas B3.

Les 4 465 € du cas B3 ne s'ajoutent pas aux 44 250 € du B1. Le dossier n'établit pas de comptabilité permettant de cumuler ces montants. Le budget global est une référence, le petit cas permet d'expliquer un suivi détaillé.

## Les diapositives, une par une

### 1. Spity

Tu annonces le sujet : Spity, son organisation et sa démonstration. Le jury doit comprendre ce que tu vas lui montrer.

**Avec tes mots :** « Je vais expliquer comment j'organise le travail autour de Spity, puis vous montrer un parcours grimpeur et club. »

### 2. Sommaire

Tu annonces les cinq parties : le projet, l'organisation, le suivi et les décisions, l'équipe et le client, puis la démonstration. Les horaires sont des repères pour ta répétition. Cette slide prend trente secondes.

**Avec tes mots :** « Je vais présenter le projet, expliquer comment j'organise et suis le travail, puis montrer le résultat dans l'application. »

### 3. Le besoin d'Altitude Grimpe

Tu présentes le problème utilisateur qui justifie le développement. Un grimpeur veut trouver un partenaire et rejoindre une sortie. Un club veut organiser un événement et voir ses participants. Altitude Grimpe et Claire Martin appartiennent au cadre fictif du B1.

**Avec tes mots :** « Ces besoins me servent à choisir les parcours à montrer et à vérifier si ce qu'on livre est utile. »

### 4. Le planning global du Bloc 1

Les neuf barres représentent les grandes parties du projet : cadrage, setup, authentification, profils, feed, répertoire, topos, événements et qualité. Lis leur ordre et leur durée estimée. Les 82 jours-homme viennent du diaporama B1. La capacité de cinq jours-homme par semaine sert à construire le graphique.

**Avec tes mots :** « Je garde le découpage de mon Bloc 1 pour situer les travaux. Ensuite, je vais détailler le suivi d'un cas plus petit. »

### 5. Le suivi : Linear et les rituels Scrum

Linear sert à retrouver les tickets et leur état. Kanban désigne ici ce suivi par colonnes. Dans le cas, on limite à deux les tâches en réalisation pour éviter de tout commencer sans terminer.

Les réunions ont chacune un usage : le **planning** choisit le travail à faire, le **daily** repère rapidement les blocages, la **review** montre le produit au client, la **rétrospective** améliore la façon de travailler. Exemple de daily : « Je suis bloqué sur le contrôle des places disponibles ; j'ai besoin d'un échange technique après le point. »

**Avec tes mots :** « Linear garde la trace du travail. Les réunions permettent de décider quoi faire et de lever les blocages. »

Le support décrit des réunions inspirées de Scrum, adaptées à un flux Kanban. Les 12 tickets terminés sur 24 non annulés viennent du relevé Linear daté. Des tickets de tailles différentes ne donnent pas automatiquement 50 % du travail réalisé.

### 6. Le lot : phases, mesures et dépendances

Tu zoomes sur les quinze jours du cas. On précise le besoin, on définit comment vérifier le résultat, on prépare la solution, on réalise, on teste, puis on présente. « Mesure » signifie ici rendre l'attente vérifiable : par exemple, une seule inscription acceptée quand il reste une place.

Une **dépendance** signifie qu'un travail attend un autre travail. La validation finale des événements attend les corrections nécessaires. Les tests peuvent commencer avant, sur ce qui fonctionne déjà.

**Avec tes mots :** « Je prévois du temps pour les tests et les corrections avant la démonstration. Je surveille les tâches qui risquent de décaler cette préparation. »

### 7. Les missions et les aménagements

CP signifie chef de projet : il organise et prend les décisions nécessaires. DEV développe et corrige. QA prépare et exécute les vérifications. Dans le cas, leurs disponibilités sont respectivement de 30, 72 et 30 heures.

Camille est la QA malentendante fictive. Ses missions restent les tests. On adapte les échanges avec des consignes écrites et des réunions sous-titrées, en tenant compte de ses besoins.

**Avec tes mots :** « Chaque personne sait ce qu'elle doit faire. Je vérifie aussi qu'elle dispose du temps et des informations nécessaires. »

### 8. Les causes des cinq heures supplémentaires

Au départ, les travaux du cas étaient estimés à **112 h**. Au point J10, on suppose **77 h déjà faites** et **40 h encore nécessaires**. La nouvelle estimation est donc **117 h**, soit **5 h de plus**.

Le graphique explique l'écart : clarification +1 h, accès +2 h, événements +2 h, tests +2 h et corrections réestimées −2 h. Les événements et la fin des tests glissent aussi d'un jour dans le planning. Un décalage de date et des heures de travail supplémentaires sont deux mesures différentes.

**Avec tes mots :** « Certaines tâches prennent plus de temps que prévu. Je garde l'estimation initiale et j'explique pourquoi la nouvelle estimation augmente. »

### 9. Le budget du lot de démonstration

On valorise les heures du scénario avec un tarif par rôle. Voici les quatre nombres à comprendre :

| Montant | Sens |
| --- | --- |
| 4 270 € | Coût prévu au départ pour le cas. |
| 427 € | Réserve prévue pour les imprévus. |
| 4 697 € | Limite totale du cas : 4 270 + 427. |
| 4 465 € | Nouvelle estimation du coût final au point J10. |

La nouvelle estimation dépasse le coût initial de **195 €**, mais reste **232 € sous la limite**. La réserve sert justement à absorber certains imprévus. Ces montants sont simulés, sans dépense réelle attestée.

**Avec tes mots :** « Le cas coûte plus cher que prévu, mais on garde 232 € de marge sur notre limite. Je regarde cette marge avant d'accepter un ajout. »

### 10. Le chef de projet approche sa limite

On compare le travail prévu pour chaque rôle avec son temps disponible. CP est à **29 h sur 30**, DEV à **64 h sur 72**, QA à **24 h sur 30**. Le point fragile est CP, qui n'a plus qu'une heure disponible.

**Avec tes mots :** « Même si l'équipe a encore du temps au total, la personne qui doit organiser et décider peut devenir le point de blocage. »

### 11. Des risques qui déclenchent une action

Un risque est un problème possible qu'on prépare à l'avance. Sur la matrice, un axe représente sa probabilité, l'autre ses conséquences. Un score élevé aide à repérer ce qu'il faut surveiller.

Exemple : la démonstration pourrait ne pas démarrer. On prévoit une vérification de l'environnement et des captures datées pour expliquer le parcours en cas de difficulté. Pour chaque risque, quelqu'un doit savoir quand agir et quoi faire.

**Avec tes mots :** « J'identifie ce qui peut bloquer la livraison et je prépare une réponse avant que le problème arrive. »

### 12. Le choix du build standalone

C'est un exemple technique : les compilations du serveur de développement perturbaient la recette navigateur rapportée dans le dossier historique. On compare augmenter les délais, préparer les routes à l'avance ou tester un serveur issu du build. Le choix visible dans Git est le standalone.

Le raisonnement de pilotage consiste à expliquer le problème, les solutions possibles et la raison du choix. Le commit est réel, la comparaison est une analyse faite après coup. Les résultats historiques gardent leur date et leur version.

**Avec tes mots :** « Tester le build permet de vérifier un logiciel plus proche de ce qu'on livre. J'explique pourquoi ce choix répond au problème rencontré. »

### 13. Une demande qui dépasse le lot

Le client fictif demande une fonction supplémentaire sur les topos. On l'estime à 12 h DEV et 4 h QA, soit 540 €. La nouvelle estimation serait **5 005 €**, donc **308 € au-dessus de la limite**. DEV aurait aussi **76 h de travail pour 72 h disponibles**.

Le scénario reporte l'ajout. On garde la demande pour plus tard et on conserve les tests du travail déjà prévu.

**Avec tes mots :** « L'ajout dépasse notre temps et notre budget. Je propose de le reporter pour finir correctement ce qu'on a déjà engagé. »

### 14. Des styles adaptés à la situation

Les quatre mots désignent des façons d'intervenir. **Participatif** : tu demandes les propositions de DEV et QA. **Persuasif** : tu expliques au client pourquoi tu proposes un report. **Directif** : tu fixes une règle claire sur les contrôles obligatoires avant livraison. **Délégatif** : tu confies le choix de l'implémentation au développeur, avec un résultat attendu.

**Avec tes mots :** « Je fais participer l'équipe aux choix, j'explique les décisions et je laisse de l'autonomie là où la personne maîtrise son travail. »

### 15. Camille et une équipe à distance

Tu expliques comment chacun reçoit et comprend les informations. Dans ce cas fictif : sous-titres, une personne qui parle à la fois, décisions écrites, créneau compatible avec Paris et Montréal, formulation simple et possibilité de répondre par écrit.

**Avec tes mots :** « Après une réunion, chacun doit pouvoir retrouver ce qu'il doit faire, même s'il a mal entendu ou n'était pas disponible au même moment. »

### 16. La grille des compétences du lot

Tu compares une compétence utile au projet avec le niveau nécessaire. Niveau 1 signifie que la personne réalise avec de l'aide, niveau 2 qu'elle sait faire seule sur un cas courant. Les notes décrivent le scénario, sans évaluer des collègues réels.

Exemple DEV : comprendre comment empêcher deux inscriptions concurrentes de prendre la dernière place. Exemple QA : rejouer le test de façon reproductible.

**Avec tes mots :** « Je repère ce que chacun doit apprendre pour réussir les tâches prévues. »

### 17. Un plan de formation pour chaque rôle

La grille précédente débouche sur du temps d'apprentissage : une heure pour le suivi des écarts côté CP, deux heures pour la concurrence côté DEV et trois heures pour les tests navigateur et clavier côté QA. Ces six heures sont déjà comprises dans les tâches du cas.

On vérifie ensuite que la personne réussit un exercice seule. Si une compétence critique reste manquante, le scénario prévoit d'étudier un renfort.

**Avec tes mots :** « Je réserve du temps pour apprendre, puis je vérifie que la personne sait utiliser ce qu'elle a appris sur le projet. »

### 18. Review J10 : une décision dans CR02

CR02 est simplement le deuxième compte rendu du cas. Le point client explique le décalage des événements, le coût prévu et le report des topos. Il précise ensuite qui fait quoi : DEV termine à J12, QA clôt les tests après correction à J14, CP prépare la présentation J15.

**Avec tes mots :** « Après le point client, je garde une trace de la décision et des prochaines actions pour éviter les malentendus. »

### 19. Mesurer la satisfaction et agir

Tu prépares une vérification avec des utilisateurs : arrivent-ils à terminer le parcours sans aide, trouvent-ils le résultat utile et rencontrent-ils des blocages ? Les valeurs 80 % et 4/5 sont des objectifs. Aucun résultat réel n'a été mesuré dans cette session fictive.

**Avec tes mots :** « Je veux vérifier que les utilisateurs arrivent à utiliser la fonction. Si ça bloque, je relève le problème, je prévois une correction et je refais le test. »

### 20. Place à la démonstration

Tu annonces le passage à l'application locale avec des comptes de test : d'abord le grimpeur, puis le club. Cette transition fait partie des six minutes de démonstration prévues avec les slides 21 et 22.

**Avec tes mots :** « Je vais maintenant montrer le parcours que nous avons préparé. »

### 21. Trouver un partenaire

Tu joues le rôle du grimpeur : profil, filtre de recherche, état de la demande, puis accès à une sortie et inscription. Tu décris ce que l'utilisateur fait et ce que l'écran confirme.

**Avec tes mots :** « Je cherche un partenaire adapté à ma pratique, puis je rejoins une sortie. Je vérifie que mon inscription est bien confirmée. »

### 22. Retrouver les participants

Tu passes côté club et retrouves l'inscription effectuée. Cela relie les deux rôles au même résultat. Tu montres les commandes utiles et un passage au clavier. Tout contrôle cité doit correspondre à ce que tu montres ou à une preuve de test identifiée.

**Avec tes mots :** « Le club retrouve maintenant le participant inscrit et peut suivre l'organisation de son événement. »

### 23. Les critères de validation du parcours

Tu reprends ce que tu avais promis de montrer et le résultat observé. « Accepté avec réserve » signifie qu'on conserve un point à traiter explicitement. Cette décision doit s'appuyer sur la démonstration. On ne préremplit pas un accord client fictif comme s'il avait été obtenu.

**Avec tes mots :** « Voici ce qui a été vérifié et les éventuels points restant à corriger. Pour chaque réserve, je précise la suite. »

### 24. Annexe : responsabilités du lot

RACI est un tableau de responsabilités : **R réalise**, **A a la décision finale**, **C donne son avis**, **I reçoit l'information**. Exemple : DEV réalise la correction, QA aide à vérifier le résultat, CP organise sa prise en compte.

**Avec tes mots :** « Ce tableau évite qu'une tâche reste sans responsable ou qu'on ne sache pas qui peut valider. »

### 25. Annexe : sensibilité du budget et de la capacité

« Sensibilité » signifie ici regarder ce qui se passe quand une hypothèse change. Exemple : deux heures de CP supplémentaires restent dans le budget, mais dépassent son temps disponible. Une situation peut être acceptable financièrement tout en étant impossible à planifier.

**Avec tes mots :** « Je teste les conséquences d'un imprévu sur le budget et sur le temps de chaque rôle. »

Chaque ligne est une variante indépendante, sans cumul automatique avec les autres.

### 26. Annexe : demande de renfort aux RH

Si la formation ne suffit pas, le scénario décrit une aide QA de quatre heures. Avec le temps d'accueil de CP, la variante ajoute 202,50 € et laisse 29,50 € sous le plafond. Il faut encore vérifier la disponibilité et décider de l'engagement. Cette aide n'est pas activée dans le cas de base.

**Avec tes mots :** « Si on a besoin d'aide, je précise la mission, le délai et le coût avant de demander un renfort. »

Les slides 24 à 26 servent aux questions du jury. Elles ne s'ajoutent pas aux trente minutes prévues pour les slides 1 à 23.

## Les mots à traduire dans ta tête

| Terme du support | Traduction simple |
| --- | --- |
| Piloter | Organiser le travail, regarder ce qui se passe et adapter les décisions. |
| Périmètre | Ce qu'on a prévu de livrer dans cette version. |
| Charge | Le travail nécessaire, exprimé en heures ou en jours-homme. |
| Capacité | Le temps disponible pour réaliser ce travail. |
| Prévision à terminaison | Ce qu'on estime nécessaire au total pour finir. |
| Reste à faire | Le travail encore nécessaire. |
| Arbitrage | Un choix expliqué entre plusieurs options. |
| Recette | Vérifier le résultat avec des critères définis. |
| Jalon | Un point du planning où un résultat doit être vérifié ou une décision prise. |
| Réserve budgétaire | Une somme prévue pour les imprévus. |
| Réserve après démonstration | Un point explicitement conservé pour correction ou vérification. |
| Commanditaire | La personne ou l'organisation qui demande le projet. |

Pour préparer une slide, entraîne-toi à expliquer le problème concret, ce que tu proposes et l'effet attendu. Si un mot te bloque, reprends la situation de développement correspondante et formule-la avec tes mots.
