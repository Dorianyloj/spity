# Comprendre le diaporama v17

Projet **solo**, développé sur **un an**. Les compléments pédagogiques de planning, suivi, collaboration, formation et retours sont explicitement simulés. Les coûts B1 restent prévisionnels.

## 1. Une année pour construire Spity.

Du besoin des grimpeurs à un site déployé.

Spity est un projet d’escalade que j’ai développé seul sur un an. Je présente sa gestion et le logiciel. Les traces de développement, la correction de navigation et le déploiement sont réels. Pour traiter les compétences de pilotage, de collaboration et de suivi client qui ne sont pas toutes documentées dans le projet solo, j’ajoute des mises en situation explicitement signalées. Elles se déroulent dans le cadre d’une année, sans être présentées comme des événements réellement vécus.

Nature : Durée déclarée et preuves du dépôt.

## 2. Sommaire

Présentation du projet, puis les compétences dans l’ordre du référentiel.

Je présente d’abord le besoin et le projet solo. Je déroule ensuite les sept compétences dans l’ordre : planification, suivi, arbitrage, management, compétences, suivi client et démonstration. Les six minutes de manipulation sont incluses dans les trente minutes. Les trois compétences signalées comme obligatoires dans le PDF fourni sont la planification, le suivi de l’avancement et la démonstration. Toutes les autres restent traitées.

Nature : Plan aligné sur les deux PDF fournis.

## 3. Relier les grimpeurs. Simplifier les sorties.

Deux besoins concrets pour guider les fonctionnalités.

Spity répond à deux besoins complémentaires. Un grimpeur cherche une personne avec laquelle pratiquer et une sortie adaptée. Un club souhaite organiser une activité et retrouver les participants. Le produit regroupe donc des profils, des partenaires, des événements et un répertoire de lieux. Ces besoins servent de fil conducteur à la démonstration. La capture montre une interface de la base de démonstration, avec des données de test. Le Collectif Altitude Grimpe présent dans le cadrage initial est un commanditaire fictif ; il ne constitue pas la preuve d’un client réel. Aucun accord de ce collectif n’est revendiqué ici.

Nature : Éléments du projet documentés.

## 4. Une méthode adaptée au travail solo

Flux de tâches inspiré de Kanban ; rétroplanning annuel pour les jalons.

Je retiens un flux inspiré de Kanban, adapté à un projet solo où les priorités évoluent. Linear apporte la visibilité sur les tâches. Le rétroplanning complète le tableau en montrant les dates cibles et les dépendances, que le simple statut d’un ticket ne suffit pas à expliquer. Les deux outils sont compatibles : un lot planifié contient des tâches suivies dans Linear. Git et la CI relient les modifications à leurs contrôles. Le dépôt prouve l’existence de ces outils ; il ne prouve pas que toutes les pratiques proposées ont été appliquées historiquement. Dans la mise en situation, une revue hebdomadaire actualise le reste à faire et les risques.

Nature : Outils réels ; cadre méthodologique argumenté et calendrier pédagogique.

## 5. Planifier les travaux sur une année

M1–M12 : modèle pédagogique sur un an, sans dates calendaires inventées.

Le graphique répartit les neuf lots du cadrage sur douze mois relatifs. Les charges de référence viennent du Bloc 1 : elles totalisent 82 jours-personne estimés. Leur position dans le calendrier est une reconstruction pédagogique, pas le planning historique retrouvé. L’étude et la mesure du besoin précèdent la conception. La réalisation des parcours s’appuie sur l’authentification et les profils. Les événements doivent exister avant la recette des inscriptions. Les contrôles se poursuivent pendant la réalisation, puis la restitution intervient au dernier mois. Les points de vigilance portent sur les dépendances, le temps disponible en solo et la préparation d’une recette sur une version stable. Les vraies dates de commits restent dans l’annexe, séparées de ce modèle.

Nature : Mise en situation pédagogique explicitement simulée.

## 6. Affecter les missions et prévoir les moyens

Projet réel : Dorian seul. Extension simulée : une séance avec un testeur ponctuel.

Dans la réalité, j’ai réalisé Spity seul. Le tableau sépare donc les responsabilités du projet individuel et une extension pédagogique de recette. Pour cette séance fictive, un testeur réalise les contrôles et Dorian reste responsable du livrable. Un représentant de club fictif décide de l’acceptation dans la mise en situation. Les missions sont affectées selon les compétences nécessaires, pas selon une situation de handicap. Le persona testeur est malentendant : les consignes écrites, les sous-titres vérifiés et les échanges asynchrones rendent sa mission accessible. Les ressources matérielles et logicielles sont celles du projet. Le budget de référence reste l’estimation B1, distincte des dépenses réelles non fournies.

Nature : Mise en situation pédagogique explicitement simulée.

## 7. Linear : un état daté du travail

Observation du 14 septembre 2026 ; un ticket annulé exclu du dénominateur.

Le relevé du 14 septembre contient 25 tickets, dont un annulé. Sur les 24 autres, 12 sont terminés, un est en cours, quatre sont à faire et sept restent dans le backlog. Le ratio de tickets terminés vaut donc 50 %. Sa lecture demande deux précautions. D’abord, les tickets n’ont pas tous la même taille. Ensuite, certains statuts peuvent être en retard sur le logiciel : le relevé contient par exemple un sujet d’authentification à faire alors que des parcours de connexion existent dans le dépôt. Le tableau permet de repérer un écart à vérifier ; il ne permet pas de conclure que toute la fonction est terminée. Je conserve la date du relevé et je ne présente pas ces nombres comme un état en direct du 16 septembre.

Nature : Observation historique non pondérée.

## 8. Un tableau de bord pour décider

SIMULATION À M10 · exemple de suivi annuel, distinct des observations réelles.

Le relevé Linear est réel et daté. Ce tableau est, lui, un exemple chiffré simulé pour montrer comment suivre les autres dimensions du projet. À M10, 58 jours-personne sont supposés consommés et 28 restent à faire. La prévision devient 86 jours, contre 82 initialement. À 450 euros par jour et en conservant les autres postes B1 à 7 350 euros, le total atteint 46 050 euros, soit un écart de 1 800 euros. Le jalon passe de la fin du mois 11 à la fin du mois 12. La prochaine période contient 12 jours de travail pour une capacité hypothétique de 10 : il faut déplacer deux jours de charge ou réduire le périmètre. Ces valeurs servent à expliquer les formules et les décisions ; elles ne sont pas mon temps ou mes dépenses réels.

Nature : Mise en situation pédagogique explicitement simulée.

## 9. Anticiper les points de vigilance

Registre pédagogique, appuyé sur des problèmes possibles du projet.

Un tableau de bord doit déclencher des actions. Je propose donc des signaux observables : dépasser la capacité, échouer sur un critère critique, ne pas pouvoir ouvrir le logiciel ou ne pas comprendre une consigne de recette. Chaque ligne associe une réponse et un responsable. Dans le projet solo, Dorian porte ces décisions. La ligne sur la recette accessible appartient à la séance fictive avec testeur. La revue hebdomadaire proposée rapproche les tickets, les écarts et les risques, puis conserve une action datée. Le tableau est un dispositif de pilotage pédagogique ; aucune cotation historique ou réunion réellement tenue n’est revendiquée.

Nature : Mise en situation pédagogique explicitement simulée.

## 10. Arbitrer face à une navigation trop lente

Cas réel du 15 septembre : un calcul décoratif bloque le navigateur.

Le cas réel est la lenteur signalée lors des clics de navigation. La conséquence est visible : l’utilisateur attend sans percevoir clairement le résultat de son action. Le diagnostic local montre que l’initialisation du fond animé monopolise le navigateur. Le tableau compare les options comme outil d’aide à la décision. Garder le fond conserve le problème. Optimiser ou différer l’animation peut être étudié, mais aucun gain n’a été mesuré dans les preuves disponibles. Le choix retenu remplace le fond par un SVG statique et ajoute un indicateur d’attente. Il conserve le motif graphique et sacrifie le mouvement. Le changement est réel ; la comparaison formalisée ici est rétrospective. Les mesures suivantes permettent d’en discuter l’effet.

Nature : Arbitrage réel ; comparaison rétrospective.

## 11. Mesurer l’effet de la correction

Mesures locales contrôlées du 15 septembre ; un passage par parcours.

Le graphique compare les mêmes cinq parcours avant et après la correction. Les mesures sont réalisées avec Chromium, un processeur ralenti quatre fois et une latence réseau simulée de 100 millisecondes. Avant correction, le temps médian observé est de 10 220 millisecondes. Après correction, il est de 748 millisecondes. La comparaison montre un effet très net dans ces conditions. Elle reste un échantillon d’un passage par parcours : ce n’est ni une moyenne sur tous les utilisateurs, ni un engagement de performance, ni une mesure en production. Le protocole et les valeurs sont conservés dans l’audit. Je préfère présenter les temps et leurs limites plutôt que transformer un test local en promesse générale.

Nature : Mesures locales contrôlées, échantillon limité.

## 12. Adapter la posture à une situation précise

SIMULATION · une recette ponctuelle avec testeur, dans un projet développé seul.

Cette situation est simulée : j’imagine une séance de recette ponctuelle, sans transformer Spity en projet développé en équipe. Le testeur demande de traiter les blocages, tandis que le porteur souhaite enrichir le décor. Une posture participative sert d’abord à écouter les faits et les impacts. Une posture persuasive permet d’expliquer le compromis. La posture directive fixe une limite : un critère critique en échec empêche l’acceptation. Enfin, la posture délégative confie un scénario de test avec un résultat attendu et un point de contrôle. La critique porte sur une décision trop rapide du porteur : elle peut faire perdre une information utile. La recommandation est de faire reformuler le problème, comparer les options, décider puis écrire l’action. Aucun conflit réel n’est attribué à une personne.

Nature : Mise en situation pédagogique explicitement simulée.

## 13. Organiser une collaboration accessible

SIMULATION · testeur malentendant, à distance ; contexte multiculturel prévu.

Dans la simulation, la séance comporte quatre heures de travail pour le porteur et quatre pour le testeur, chacun disposant de cinq heures. La répartition respecte les compétences et conserve une marge. Ce n’est pas une capacité réelle mesurée. Pour le persona malentendant, les consignes sont écrites, les sous-titres sont vérifiés et les prises de parole organisées. Le contrôle consiste à faire reformuler la consigne et retrouver la décision. Dans un contexte à distance et multiculturel, les invitations indiquent les heures locales et le vocabulaire partagé évite les ambiguïtés. Linear suit les actions, Git identifie la version et le dossier centralise les preuves. Un point court, préparé par écrit, se termine par un responsable et un retour attendu.

Nature : Mise en situation pédagogique explicitement simulée.

## 14. Évaluer les compétences utiles au projet

SIMULATION · niveaux pédagogiques, aucune évaluation personnelle réelle.

Les compétences nécessaires sont le suivi, le développement, la recette et la vérification au clavier. Cette grille est pédagogique : elle ne constitue pas une note réellement attribuée à Dorian ou à un testeur. L’échelle va de zéro, non abordé, à trois, autonome sur des cas complexes. Dans le cas, le porteur lit le suivi avec aide mais doit expliquer seul les écarts : il passe donc d’un niveau un à une cible deux. Le développement est supposé autonome et ne demande pas de formation prioritaire. Le testeur sait suivre une consigne mais doit produire une recette reproductible et vérifier le clavier sans aide. Ces écarts justifient les actions de formation. Le niveau technique reste indépendant de la situation de handicap.

Nature : Mise en situation pédagogique explicitement simulée.

## 15. Prévoir une progression vérifiable

PLAN SIMULÉ · formations proposées, pas de sessions déclarées suivies.

Le plan répond aux écarts de la grille. Le porteur dispose d’un atelier d’une heure avant la revue M10 pour recalculer et expliquer le tableau de bord. Le testeur dispose de deux heures avant la recette M11 pour pratiquer la recette et les contrôles clavier. Les durées sont des hypothèses de formation, distinctes des huit heures de la séance de recette. Les supports sont écrits et sous-titrés, les pauses et le temps supplémentaire sont adaptés au besoin. L’efficacité se juge sur une tâche réalisée sans aide, pas sur la seule présence. Si une compétence critique reste indisponible, la fiche de renfort prépare une mission, un profil et des critères pour un service RH dans la mise en situation. Aucun recrutement n’est réellement engagé.

Nature : Mise en situation pédagogique explicitement simulée.

## 16. Un compte rendu qui aide à décider

CR-SIM-02 · M10 · exemple pédagogique, interlocuteur club fictif.

Le compte rendu montré est fictif et identifié CR-SIM-02. Il relie les chiffres de la simulation au besoin d’un persona club. Le constat annonce la prévision, son écart et sa conséquence sur le jalon. La décision pédagogique consiste à conserver le fond statique et à protéger les critères de recette. Les actions distinguent le porteur, le testeur ponctuel et le représentant de club fictif. Le document donne aussi un prochain point de validation. Cette structure aide un client à comprendre et à choisir. La correction du fond est réellement présente dans le logiciel, mais ce compte rendu n’est pas son origine historique et n’a pas été signé par un client réel.

Nature : Mise en situation pédagogique explicitement simulée.

## 17. Prévoir les points de validation

Calendrier pédagogique cohérent avec le planning annuel.

Les points de validation du modèle annuel suivent les risques du projet. Le cadrage vérifie le besoin avant d’engager la réalisation. La revue M10 expose les écarts et permet de décider. La recette M11 rapproche chaque critère de son résultat et prépare les corrections. La restitution M12 porte sur la dernière version prête. Une réserve entraîne une action avec un responsable et une échéance à convenir. Ces rendez-vous sont planifiés dans la simulation ; ils ne sont pas des réunions historiques déclarées. Le calendrier évite de découvrir à la dernière minute que le logiciel ne répond pas au parcours attendu.

Nature : Mise en situation pédagogique explicitement simulée.

## 18. Mesurer le retour pour agir

Protocole proposé ; aucun résultat réel mesuré.

Les indicateurs sont définis avant la séance : réussite sans aide, utilité perçue, conformité des critères critiques et blocages ouverts. Le protocole note aussi l’effectif, car une moyenne isolée masque le nombre de retours. Les cibles affichées sont pédagogiques, pas des engagements signés. Les résultats restent non mesurés. Si la réussite sans aide est faible, il faut identifier l’étape difficile. Une faible utilité demande de revenir au besoin. Un blocage critique empêche l’acceptation et déclenche une correction suivie d’une nouvelle vérification. Ces indicateurs complètent les tests techniques, qui ne mesurent pas la satisfaction.

Nature : Mise en situation pédagogique explicitement simulée.

## 19. Préparer une démonstration vérifiable

La réussite s’observe sur des actions précises.

La démonstration est préparée autour de critères visibles. Pour les partenaires, je vérifie les filtres et l’état d’une demande. Pour un événement, je montre l’inscription et les places disponibles. Avec la session club, je retrouve les participants et les commandes autorisées. Je termine par un passage au clavier. La préparation se fait sur une base isolée contenant des comptes de test. Avant l’oral, il faut vérifier les dates des événements, les connexions et la version utilisée. Les captures du 15 septembre servent de secours si un incident empêche une manipulation. Dans ce cas, j’annonce le problème et le critère qui n’a pas été revérifié en direct. Je ne transforme pas une capture en validation actuelle.

Nature : Protocole proposé pour la démonstration.

## 20. Passer du suivi à l’usage.

Deux sessions pour un parcours complet.

Je passe à la démonstration. Les comptes utilisés sont des comptes de test dans une base dédiée. Je commence avec une session grimpeur, puis je passe à la session club pour retrouver les participants. L’objectif est de montrer les critères annoncés, pas de parcourir toutes les pages du site.

Nature : Manipulation à réaliser devant le jury.

## 21. Trouver un partenaire

Parcours grimpeur · base de démonstration.

Afficher le profil de la session grimpeur et expliquer la discipline et le niveau utilisés. Ouvrir la recherche de partenaires, modifier un filtre et vérifier que les résultats restent cohérents. Consulter un profil compatible, puis montrer l’état d’une demande. Si une demande existe déjà, expliquer cet état au lieu d’annoncer un nouvel envoi. Lorsque le partenariat est accepté, montrer le passage vers les événements. Décrire chaque résultat visible avec les mots d’un utilisateur.

Nature : Manipulation en direct ; capture datée de secours.

## 22. S’inscrire et retrouver les participants

Parcours grimpeur puis club · six minutes au total.

Ouvrir un événement futur et montrer les places restantes. Procéder à l’inscription ou expliquer l’état déjà inscrit. Passer dans le navigateur de la session club et retrouver la liste des participants. Montrer que les commandes dépendent du rôle et vérifier un passage au clavier. Revenir aux critères annoncés : préciser ceux qui ont été montrés, ceux qui nécessitent une réserve et ceux qui reposent uniquement sur une preuve de test. Revenir au diaporama avant la fin des six minutes.

Nature : Manipulation en direct ; capture datée de secours.

## 23. Conclure par une décision de validation

Conclure sur ce que les preuves permettent d’affirmer.

Je termine par le résultat des manipulations : quels critères ont réussi et quelles réserves restent ouvertes ? La décision doit être formulée à partir de ce qui a été montré : accepté, accepté avec réserve ou refusé. Chaque réserve décrit une action, un responsable et une prochaine vérification. Cette validation est recherchée à la fin de la démonstration ; elle n’est pas inventée à l’avance. Le support a présenté les sept compétences, en séparant le projet solo réel sur un an, les estimations initiales et les mises en situation pédagogiques. Les traces du logiciel et les limites des simulations restent disponibles dans les annexes.

Nature : Éléments du projet documentés.

## 24. Les sept compétences et leurs preuves

Deux PDF fournis, une correspondance explicite et aucune acquisition présumée.

Chaque compétence dispose d’un contenu visible, de notes et d’une annexe détaillée. Les compétences obligatoires sont repérées dans le PDF fourni. La matrice distingue les faits, les estimations et les simulations. Cette correspondance prouve la présence des éléments dans le support ; elle ne préjuge pas de leur évaluation par le jury.

Nature : Analyse de couverture, sans attribution de compétence.

## 25. Les étapes enregistrées dans Git

Repères réels de commits ; distincts du calendrier pédagogique M1–M12.

Le projet s’inscrit sur un an, comme indiqué dans mon cadrage personnel. Le dépôt apporte des repères complémentaires : les fondations techniques sont enregistrées en janvier, puis les interfaces, les profils et les lieux en mai. En juillet apparaissent le matching, les événements et la recette automatisée. En août, le projet intègre davantage de maintenance et de supervision. En septembre, il évolue avec les médias, l’administration et les contributions aux falaises. Cette chronologie est reconstruite à partir des commits. Elle montre ce qui est traçable, mais ne remplace pas un planning initial approuvé. Le premier commit ne date pas nécessairement le début de la réflexion sur le projet. Les mois exacts de début et de fin de l’année restent à confirmer. Je ne transforme pas une période sans commit en absence de travail.

Nature : Durée déclarée ; chronologie rétrospective issue de Git.

## 26. Préparer un besoin de renfort

FICHE SIMULÉE ET CONDITIONNELLE · aucun recrutement réel dans le projet solo.

Cette fiche montre comment transmettre un besoin au service RH dans la mise en situation. Le déclencheur est un écart critique qui persiste après formation. La mission est limitée à quatre heures de recette, avec compétences, disponibilité à confirmer et livrable précis. La sélection se fait par un exercice accessible et l’accueil donne les critères et les seuls accès nécessaires. Le coût indicatif de 180 euros serait supplémentaire et doit être arbitré avant tout engagement. Le projet réel est solo : aucun service RH n’a été sollicité ni renfort engagé.

Nature : Mise en situation pédagogique explicitement simulée.
