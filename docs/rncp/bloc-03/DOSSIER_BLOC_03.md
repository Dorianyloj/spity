# Dossier Bloc 3 — Coordonner et piloter Spity

## Présentation et périmètre

Spity est un projet d’escalade développé **seul par Dorian Joly sur un an**, confirmé par le candidat. Le besoin est de trouver des partenaires et de préparer des sorties, avec des profils, lieux et événements. Le support commence par un sommaire puis présente le projet avant les sept compétences.

Les dates Git, les fonctionnalités, le relevé Linear et la correction de navigation sont des traces réelles. Les 82 j-h et 44 250 € du Bloc 1 sont des estimations. Le planning relatif, les consommés annuels, la collaboration ponctuelle, les niveaux de compétences et les comptes rendus sont des **mises en situation pédagogiques**, autorisées comme modalité par le référentiel fourni. Elles ne sont pas des faits historiques. Aucune période fictive de quinze jours ne structure le projet.

Les deux PDF du candidat sont conservés dans docs/rncp/referentiel/ avec leurs empreintes dans donnees/sources-evaluation.json. Les compétences obligatoires sont C.3.1, C3.2.1 et C3.4.2 ; toutes les sept compétences sont traitées. Les annexes donnent les détails sans surcharger les diapositives.
## C.3.1

### Une méthode adaptée au travail solo

Nature : **Outils réels ; cadre méthodologique argumenté et calendrier pédagogique**.

Je retiens un flux inspiré de Kanban, adapté à un projet solo où les priorités évoluent. Linear apporte la visibilité sur les tâches. Le rétroplanning complète le tableau en montrant les dates cibles et les dépendances, que le simple statut d’un ticket ne suffit pas à expliquer. Les deux outils sont compatibles : un lot planifié contient des tâches suivies dans Linear. Git et la CI relient les modifications à leurs contrôles. Le dépôt prouve l’existence de ces outils ; il ne prouve pas que toutes les pratiques proposées ont été appliquées historiquement. Dans la mise en situation, une revue hebdomadaire actualise le reste à faire et les risques.

Source : Linear 14/09 ; dépôt ; A01.

### Planifier les travaux sur une année

Nature : **Mise en situation pédagogique explicitement simulée**.

Le graphique répartit les neuf lots du cadrage sur douze mois relatifs. Les charges de référence viennent du Bloc 1 : elles totalisent 82 jours-personne estimés. Leur position dans le calendrier est une reconstruction pédagogique, pas le planning historique retrouvé. L’étude et la mesure du besoin précèdent la conception. La réalisation des parcours s’appuie sur l’authentification et les profils. Les événements doivent exister avant la recette des inscriptions. Les contrôles se poursuivent pendant la réalisation, puis la restitution intervient au dernier mois. Les points de vigilance portent sur les dépendances, le temps disponible en solo et la préparation d’une recette sur une version stable. Les vraies dates de commits restent dans l’annexe, séparées de ce modèle.

Source : B1 : neuf lots, 82 j-h ; mise-en-situation.json ; A01.

### Affecter les missions et prévoir les moyens

Nature : **Mise en situation pédagogique explicitement simulée**.

Dans la réalité, j’ai réalisé Spity seul. Le tableau sépare donc les responsabilités du projet individuel et une extension pédagogique de recette. Pour cette séance fictive, un testeur réalise les contrôles et Dorian reste responsable du livrable. Un représentant de club fictif décide de l’acceptation dans la mise en situation. Les missions sont affectées selon les compétences nécessaires, pas selon une situation de handicap. Le persona testeur est malentendant : les consignes écrites, les sous-titres vérifiés et les échanges asynchrones rendent sa mission accessible. Les ressources matérielles et logicielles sont celles du projet. Le budget de référence reste l’estimation B1, distincte des dépenses réelles non fournies.

Source : A02 ; données B1 ; séance pédagogique dans mise-en-situation.json.

## C3.2.1

### L’avancement réel des fonctionnalités

Nature : **État des fonctionnalités vérifié dans le code le 16 septembre 2026**.

Pour faire le point sur mon avancement, j’ai rapproché les tâches de mon backlog des fonctionnalités présentes dans le site. L’inscription et la connexion sont déjà réalisées, pour les grimpeurs comme pour les clubs. Les améliorations restantes sur les sessions concernent leur renouvellement et la rotation des jetons.

J’ai aussi réalisé les profils avec avatar, la publication avec image, les likes et les commentaires simples. La carte affiche les salles et les falaises. Pour les topos, je peux ajouter une voie, faire un signalement et partager un lien ou un PDF. Les événements permettent de gérer les inscriptions et la capacité.

Je garde à droite les suites à développer : modifier ou supprimer une publication, compléter les fonctions des clubs, ajouter les votes sur les topos et enrichir le fil social. Ce bilan me permet de prioriser ce qui manque encore, sans compter une fonction déjà disponible comme un travail à recommencer.

Source : A09 ; audit du 16/09/2026 ; dépôt applicatif a805162.

### Un tableau de bord pour décider

Nature : **Mise en situation pédagogique explicitement simulée**.

Le relevé Linear est réel et daté. Ce tableau est, lui, un exemple chiffré simulé pour montrer comment suivre les autres dimensions du projet. À M10, 58 jours-personne sont supposés consommés et 28 restent à faire. La prévision devient 86 jours, contre 82 initialement. À 450 euros par jour et en conservant les autres postes B1 à 7 350 euros, le total atteint 46 050 euros, soit un écart de 1 800 euros. Le jalon passe de la fin du mois 11 à la fin du mois 12. La prochaine période contient 12 jours de travail pour une capacité hypothétique de 10 : il faut déplacer deux jours de charge ou réduire le périmètre. Ces valeurs servent à expliquer les formules et les décisions ; elles ne sont pas mon temps ou mes dépenses réels.

Source : mise-en-situation.json ; classeur, Suivi SIMULE ; A03.

### Anticiper les points de vigilance

Nature : **Mise en situation pédagogique explicitement simulée**.

Un tableau de bord doit déclencher des actions. Je propose donc des signaux observables : dépasser la capacité, échouer sur un critère critique, ne pas pouvoir ouvrir le logiciel ou ne pas comprendre une consigne de recette. Chaque ligne associe une réponse et un responsable. Dans le projet solo, Dorian porte ces décisions. La ligne sur la recette accessible appartient à la séance fictive avec testeur. La revue hebdomadaire proposée rapproche les tickets, les écarts et les risques, puis conserve une action datée. Le tableau est un dispositif de pilotage pédagogique ; aucune cotation historique ou réunion réellement tenue n’est revendiquée.

Source : A03 ; scénario annuel ; audit navigation pour le problème réel.

## C3.2.2

### Arbitrer face à une navigation trop lente

Nature : **Arbitrage réel ; comparaison rétrospective**.

Le cas réel est la lenteur signalée lors des clics de navigation. La conséquence est visible : l’utilisateur attend sans percevoir clairement le résultat de son action. Le diagnostic local montre que l’initialisation du fond animé monopolise le navigateur. Le tableau compare les options comme outil d’aide à la décision. Garder le fond conserve le problème. Optimiser ou différer l’animation peut être étudié, mais aucun gain n’a été mesuré dans les preuves disponibles. Le choix retenu remplace le fond par un SVG statique et ajoute un indicateur d’attente. Il conserve le motif graphique et sacrifie le mouvement. Le changement est réel ; la comparaison formalisée ici est rétrospective. Les mesures suivantes permettent d’en discuter l’effet.

Source : Audit navigation du 15/09 ; commit 83e4c29.

### Mesurer l’effet de la correction

Nature : **Mesures locales contrôlées, échantillon limité**.

Le graphique compare les mêmes cinq parcours avant et après la correction. Les mesures sont réalisées avec Chromium, un processeur ralenti quatre fois et une latence réseau simulée de 100 millisecondes. Avant correction, le temps médian observé est de 10 220 millisecondes. Après correction, il est de 748 millisecondes. La comparaison montre un effet très net dans ces conditions. Elle reste un échantillon d’un passage par parcours : ce n’est ni une moyenne sur tous les utilisateurs, ni un engagement de performance, ni une mesure en production. Le protocole et les valeurs sont conservés dans l’audit. Je préfère présenter les temps et leurs limites plutôt que transformer un test local en promesse générale.

Source : Audit navigation du 15/09 ; donnees/projet-reel.json, performance.

## C3.3.1

### Adapter la posture à une situation précise

Nature : **Mise en situation pédagogique explicitement simulée**.

Cette situation est simulée : j’imagine une séance de recette ponctuelle, sans transformer Spity en projet développé en équipe. Le testeur demande de traiter les blocages, tandis que le porteur souhaite enrichir le décor. Une posture participative sert d’abord à écouter les faits et les impacts. Une posture persuasive permet d’expliquer le compromis. La posture directive fixe une limite : un critère critique en échec empêche l’acceptation. Enfin, la posture délégative confie un scénario de test avec un résultat attendu et un point de contrôle. La critique porte sur une décision trop rapide du porteur : elle peut faire perdre une information utile. La recommandation est de faire reformuler le problème, comparer les options, décider puis écrire l’action. Aucun conflit réel n’est attribué à une personne.

Source : A05 ; séance pédagogique ; référentiel p. 12–13.

### Organiser une collaboration accessible

Nature : **Mise en situation pédagogique explicitement simulée**.

Dans la simulation, la séance comporte quatre heures de travail pour le porteur et quatre pour le testeur, chacun disposant de cinq heures. La répartition respecte les compétences et conserve une marge. Ce n’est pas une capacité réelle mesurée. Pour le persona malentendant, les consignes sont écrites, les sous-titres sont vérifiés et les prises de parole organisées. Le contrôle consiste à faire reformuler la consigne et retrouver la décision. Dans un contexte à distance et multiculturel, les invitations indiquent les heures locales et le vocabulaire partagé évite les ambiguïtés. Linear suit les actions, Git identifie la version et le dossier centralise les preuves. Un point court, préparé par écrit, se termine par un responsable et un retour attendu.

Source : A02/A05 ; mise-en-situation.json, review.

## C3.3.2

### Évaluer les compétences utiles au projet

Nature : **Mise en situation pédagogique explicitement simulée**.

Les compétences nécessaires sont le suivi, le développement, la recette et la vérification au clavier. Cette grille est pédagogique : elle ne constitue pas une note réellement attribuée à Dorian ou à un testeur. L’échelle va de zéro, non abordé, à trois, autonome sur des cas complexes. Dans le cas, le porteur lit le suivi avec aide mais doit expliquer seul les écarts : il passe donc d’un niveau un à une cible deux. Le développement est supposé autonome et ne demande pas de formation prioritaire. Le testeur sait suivre une consigne mais doit produire une recette reproductible et vérifier le clavier sans aide. Ces écarts justifient les actions de formation. Le niveau technique reste indépendant de la situation de handicap.

Source : A06 ; mise-en-situation.json, skills.

### Prévoir une progression vérifiable

Nature : **Mise en situation pédagogique explicitement simulée**.

Le plan répond aux écarts de la grille. Le porteur dispose d’un atelier d’une heure avant la revue M10 pour recalculer et expliquer le tableau de bord. Le testeur dispose de deux heures avant la recette M11 pour pratiquer la recette et les contrôles clavier. Les durées sont des hypothèses de formation, distinctes des huit heures de la séance de recette. Les supports sont écrits et sous-titrés, les pauses et le temps supplémentaire sont adaptés au besoin. L’efficacité se juge sur une tâche réalisée sans aide, pas sur la seule présence. Si une compétence critique reste indisponible, la fiche de renfort prépare une mission, un profil et des critères pour un service RH dans la mise en situation. Aucun recrutement n’est réellement engagé.

Source : A06 ; mise-en-situation.json, training ; annexe 26.

## C3.4.1

### Un compte rendu qui aide à décider

Nature : **Mise en situation pédagogique explicitement simulée**.

Le compte rendu montré est fictif et identifié CR-SIM-02. Il relie les chiffres de la simulation au besoin d’un persona club. Le constat annonce la prévision, son écart et sa conséquence sur le jalon. La décision pédagogique consiste à conserver le fond statique et à protéger les critères de recette. Les actions distinguent le porteur, le testeur ponctuel et le représentant de club fictif. Le document donne aussi un prochain point de validation. Cette structure aide un client à comprendre et à choisir. La correction du fond est réellement présente dans le logiciel, mais ce compte rendu n’est pas son origine historique et n’a pas été signé par un client réel.

Source : A07 ; mise-en-situation.json, clientReviews ; retours simulés du candidat.

### Prévoir les points de validation

Nature : **Mise en situation pédagogique explicitement simulée**.

Les points de validation du modèle annuel suivent les risques du projet. Le cadrage vérifie le besoin avant d’engager la réalisation. La revue M10 expose les écarts et permet de décider. La recette M11 rapproche chaque critère de son résultat et prépare les corrections. La restitution M12 porte sur la dernière version prête. Une réserve entraîne une action avec un responsable et une échéance à convenir. Ces rendez-vous sont planifiés dans la simulation ; ils ne sont pas des réunions historiques déclarées. Le calendrier évite de découvrir à la dernière minute que le logiciel ne répond pas au parcours attendu.

Source : A01/A07 ; planning annuel simulé.

### Mesurer le retour pour agir

Nature : **Mise en situation pédagogique explicitement simulée**.

Les indicateurs sont définis avant la séance : réussite sans aide, utilité perçue, conformité des critères critiques et blocages ouverts. Le protocole note aussi l’effectif, car une moyenne isolée masque le nombre de retours. Les cibles affichées sont pédagogiques, pas des engagements signés. Les résultats restent non mesurés. Si la réussite sans aide est faible, il faut identifier l’étape difficile. Une faible utilité demande de revenir au besoin. Un blocage critique empêche l’acceptation et déclenche une correction suivie d’une nouvelle vérification. Ces indicateurs complètent les tests techniques, qui ne mesurent pas la satisfaction.

Source : A07 ; indicateurs proposés pour les personas simulés.

## C3.4.2

### Préparer une démonstration vérifiable

Nature : **Protocole proposé pour la démonstration**.

La démonstration est préparée autour de critères visibles. Pour les partenaires, je vérifie les filtres et l’état d’une demande. Pour un événement, je montre l’inscription et les places disponibles. Avec la session club, je retrouve les participants et les commandes autorisées. Je termine par un passage au clavier. La préparation se fait sur une base isolée contenant des comptes de test. Avant l’oral, il faut vérifier les dates des événements, les connexions et la version utilisée. Les captures du 15 septembre servent de secours si un incident empêche une manipulation. Dans ce cas, j’annonce le problème et le critère qui n’a pas été revérifié en direct. Je ne transforme pas une capture en validation actuelle.

Source : A08 ; captures du 15/09 ; recette du projet.

### Passer du suivi à l’usage.

Nature : **Manipulation à réaliser devant le jury**.

Je passe à la démonstration. Les comptes utilisés sont des comptes de test dans une base dédiée. Je commence avec une session grimpeur, puis je passe à la session club pour retrouver les participants. L’objectif est de montrer les critères annoncés, pas de parcourir toutes les pages du site.

Source : A08 ; environnement local isolé.

### Trouver un partenaire

Nature : **Manipulation en direct ; capture datée de secours**.

Afficher le profil de la session grimpeur et expliquer la discipline et le niveau utilisés. Ouvrir la recherche de partenaires, modifier un filtre et vérifier que les résultats restent cohérents. Consulter un profil compatible, puis montrer l’état d’une demande. Si une demande existe déjà, expliquer cet état au lieu d’annoncer un nouvel envoi. Lorsque le partenariat est accepté, montrer le passage vers les événements. Décrire chaque résultat visible avec les mots d’un utilisateur.

Source : Capture matching du 15/09 ; code et recette matching.

### S’inscrire et retrouver les participants

Nature : **Manipulation en direct ; capture datée de secours**.

Ouvrir un événement futur et montrer les places restantes. Procéder à l’inscription ou expliquer l’état déjà inscrit. Passer dans le navigateur de la session club et retrouver la liste des participants. Montrer que les commandes dépendent du rôle et vérifier un passage au clavier. Revenir aux critères annoncés : préciser ceux qui ont été montrés, ceux qui nécessitent une réserve et ceux qui reposent uniquement sur une preuve de test. Revenir au diaporama avant la fin des six minutes.

Source : Capture événements du 15/09 ; A08 ; recette événements.

### Conclure par une décision de validation

Nature : **Éléments du projet documentés**.

Je termine par le résultat des manipulations : quels critères ont réussi et quelles réserves restent ouvertes ? La décision doit être formulée à partir de ce qui a été montré : accepté, accepté avec réserve ou refusé. Chaque réserve décrit une action, un responsable et une prochaine vérification. Cette validation est recherchée à la fin de la démonstration ; elle n’est pas inventée à l’avance. Le support a présenté les sept compétences, en séparant le projet solo réel sur un an, les estimations initiales et les mises en situation pédagogiques. Les traces du logiciel et les limites des simulations restent disponibles dans les annexes.

Source : Synthèse des pièces citées ; matrice des compétences.

## Conclusion

La matrice détaille la couverture documentaire de chaque critère. La simulation illustre une capacité à raisonner ; elle ne prouve pas une expérience vécue de management. La démonstration doit être exécutée par le candidat sur la dernière version choisie. L’acquisition des compétences et la validation relèvent du jury. Les résultats de satisfaction et la décision finale ne sont pas préremplis.
