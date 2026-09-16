# Guide oral — Spity, projet solo sur un an

Support : **v17**, 23 slides principales et trois annexes. La cible de 30 minutes inclut six minutes de démonstration. Les notes sont un canevas : les pauses, explications des graphiques et manipulations doivent être réglées par une répétition chronométrée. Ce fichier ne garantit pas la durée d’une lecture mot à mot.

## Fil conducteur

Présenter le projet développé seul par Dorian Joly, sa chronologie vérifiable, le suivi, une correction réelle et la livraison. Le planning annuel, les chiffres de suivi, la collaboration ponctuelle, la formation et les retours sont **simulés pour l’exercice** et séparés des traces réelles. Ils illustrent les critères du référentiel ; ils ne sont pas des événements vécus ni la cause historique des corrections.

La durée d’un an et le travail en solo sont confirmés par le candidat. Les dates exactes de l’année restent à préciser. Le budget B1 est une estimation. Les dates Git, le relevé Linear et les mesures techniques conservent chacun leur portée.

## Repères

| Slide | Sujet | Durée cible | Fin |
| --- | --- | --- | --- |
| 1 | Une année pour construire Spity. | 00:30 | 00:30 |
| 2 | Sommaire | 00:30 | 01:00 |
| 3 | Relier les grimpeurs. Simplifier les sorties. | 01:00 | 02:00 |
| 4 | Une méthode adaptée au travail solo | 01:00 | 03:00 |
| 5 | Planifier les travaux sur une année | 01:30 | 04:30 |
| 6 | Affecter les missions et prévoir les moyens | 01:30 | 06:00 |
| 7 | Linear : un état daté du travail | 01:00 | 07:00 |
| 8 | Un tableau de bord pour décider | 01:30 | 08:30 |
| 9 | Anticiper les points de vigilance | 01:00 | 09:30 |
| 10 | Arbitrer face à une navigation trop lente | 01:30 | 11:00 |
| 11 | Mesurer l’effet de la correction | 01:00 | 12:00 |
| 12 | Adapter la posture à une situation précise | 01:30 | 13:30 |
| 13 | Organiser une collaboration accessible | 01:30 | 15:00 |
| 14 | Évaluer les compétences utiles au projet | 01:30 | 16:30 |
| 15 | Prévoir une progression vérifiable | 01:30 | 18:00 |
| 16 | Un compte rendu qui aide à décider | 01:30 | 19:30 |
| 17 | Prévoir les points de validation | 01:00 | 20:30 |
| 18 | Mesurer le retour pour agir | 01:00 | 21:30 |
| 19 | Préparer une démonstration vérifiable | 01:30 | 23:00 |
| 20 | Passer du suivi à l’usage. | 00:30 | 23:30 |
| 21 | Trouver un partenaire | 02:30 | 26:00 |
| 22 | S’inscrire et retrouver les participants | 03:00 | 29:00 |
| 23 | Conclure par une décision de validation | 01:00 | 30:00 |

À 06:00 : suivi ; à 09:30 : arbitrage ; à 12:00 : management ; à 15:00 : compétences ; à 18:00 : client ; à 23:00 : démonstration ; à 29:00 : validation.

## Notes par diapositive

### 1. Une année pour construire Spity.

**Repère : 00:00–00:30** — Durée déclarée et preuves du dépôt.

Spity est un projet d’escalade que j’ai développé seul sur un an. Je présente sa gestion et le logiciel. Les traces de développement, la correction de navigation et le déploiement sont réels. Pour traiter les compétences de pilotage, de collaboration et de suivi client qui ne sont pas toutes documentées dans le projet solo, j’ajoute des mises en situation explicitement signalées. Elles se déroulent dans le cadre d’une année, sans être présentées comme des événements réellement vécus.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** Durée déclarée par le candidat ; CADRAGE_PROJET.md ; historique Git.

### 2. Sommaire

**Repère : 00:30–01:00** — Plan aligné sur les deux PDF fournis.

Je présente d’abord le besoin et le projet solo. Je déroule ensuite les sept compétences dans l’ordre : planification, suivi, arbitrage, management, compétences, suivi client et démonstration. Les six minutes de manipulation sont incluses dans les trente minutes. Les trois compétences signalées comme obligatoires dans le PDF fourni sont la planification, le suivi de l’avancement et la démonstration. Toutes les autres restent traitées.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** Référentiel p. 11–14 ; compétences obligatoires p. 4.

### 3. Relier les grimpeurs. Simplifier les sorties.

**Repère : 01:00–02:00** — Éléments du projet documentés.

Spity répond à deux besoins complémentaires. Un grimpeur cherche une personne avec laquelle pratiquer et une sortie adaptée. Un club souhaite organiser une activité et retrouver les participants. Le produit regroupe donc des profils, des partenaires, des événements et un répertoire de lieux. Ces besoins servent de fil conducteur à la démonstration. La capture montre une interface de la base de démonstration, avec des données de test. Le Collectif Altitude Grimpe présent dans le cadrage initial est un commanditaire fictif ; il ne constitue pas la preuve d’un client réel. Aucun accord de ce collectif n’est revendiqué ici.

**À montrer :** Montrer le besoin utilisateur puis le répertoire, sans détailler chaque fonction.

**Source :** CADRAGE_PROJET.md ; capture lieux du 15/09/2026 ; Bloc 1.

### 4. Une méthode adaptée au travail solo

**Repère : 02:00–03:00** — Outils réels ; cadre méthodologique argumenté et calendrier pédagogique.

Je retiens un flux inspiré de Kanban, adapté à un projet solo où les priorités évoluent. Linear apporte la visibilité sur les tâches. Le rétroplanning complète le tableau en montrant les dates cibles et les dépendances, que le simple statut d’un ticket ne suffit pas à expliquer. Les deux outils sont compatibles : un lot planifié contient des tâches suivies dans Linear. Git et la CI relient les modifications à leurs contrôles. Le dépôt prouve l’existence de ces outils ; il ne prouve pas que toutes les pratiques proposées ont été appliquées historiquement. Dans la mise en situation, une revue hebdomadaire actualise le reste à faire et les risques.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** Linear 14/09 ; dépôt ; A01.

### 5. Planifier les travaux sur une année

**Repère : 03:00–04:30** — Mise en situation pédagogique explicitement simulée.

Le graphique répartit les neuf lots du cadrage sur douze mois relatifs. Les charges de référence viennent du Bloc 1 : elles totalisent 82 jours-personne estimés. Leur position dans le calendrier est une reconstruction pédagogique, pas le planning historique retrouvé. L’étude et la mesure du besoin précèdent la conception. La réalisation des parcours s’appuie sur l’authentification et les profils. Les événements doivent exister avant la recette des inscriptions. Les contrôles se poursuivent pendant la réalisation, puis la restitution intervient au dernier mois. Les points de vigilance portent sur les dépendances, le temps disponible en solo et la préparation d’une recette sur une version stable. Les vraies dates de commits restent dans l’annexe, séparées de ce modèle.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** B1 : neuf lots, 82 j-h ; mise-en-situation.json ; A01.

### 6. Affecter les missions et prévoir les moyens

**Repère : 04:30–06:00** — Mise en situation pédagogique explicitement simulée.

Dans la réalité, j’ai réalisé Spity seul. Le tableau sépare donc les responsabilités du projet individuel et une extension pédagogique de recette. Pour cette séance fictive, un testeur réalise les contrôles et Dorian reste responsable du livrable. Un représentant de club fictif décide de l’acceptation dans la mise en situation. Les missions sont affectées selon les compétences nécessaires, pas selon une situation de handicap. Le persona testeur est malentendant : les consignes écrites, les sous-titres vérifiés et les échanges asynchrones rendent sa mission accessible. Les ressources matérielles et logicielles sont celles du projet. Le budget de référence reste l’estimation B1, distincte des dépenses réelles non fournies.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A02 ; données B1 ; séance pédagogique dans mise-en-situation.json.

### 7. Linear : un état daté du travail

**Repère : 06:00–07:00** — Observation historique non pondérée.

Le relevé du 14 septembre contient 25 tickets, dont un annulé. Sur les 24 autres, 12 sont terminés, un est en cours, quatre sont à faire et sept restent dans le backlog. Le ratio de tickets terminés vaut donc 50 %. Sa lecture demande deux précautions. D’abord, les tickets n’ont pas tous la même taille. Ensuite, certains statuts peuvent être en retard sur le logiciel : le relevé contient par exemple un sujet d’authentification à faire alors que des parcours de connexion existent dans le dépôt. Le tableau permet de repérer un écart à vérifier ; il ne permet pas de conclure que toute la fonction est terminée. Je conserve la date du relevé et je ne présente pas ces nombres comme un état en direct du 16 septembre.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** donnees/linear-2026-09-14.json ; A09.

### 8. Un tableau de bord pour décider

**Repère : 07:00–08:30** — Mise en situation pédagogique explicitement simulée.

Le relevé Linear est réel et daté. Ce tableau est, lui, un exemple chiffré simulé pour montrer comment suivre les autres dimensions du projet. À M10, 58 jours-personne sont supposés consommés et 28 restent à faire. La prévision devient 86 jours, contre 82 initialement. À 450 euros par jour et en conservant les autres postes B1 à 7 350 euros, le total atteint 46 050 euros, soit un écart de 1 800 euros. Le jalon passe de la fin du mois 11 à la fin du mois 12. La prochaine période contient 12 jours de travail pour une capacité hypothétique de 10 : il faut déplacer deux jours de charge ou réduire le périmètre. Ces valeurs servent à expliquer les formules et les décisions ; elles ne sont pas mon temps ou mes dépenses réels.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** mise-en-situation.json ; classeur, Suivi SIMULE ; A03.

### 9. Anticiper les points de vigilance

**Repère : 08:30–09:30** — Mise en situation pédagogique explicitement simulée.

Un tableau de bord doit déclencher des actions. Je propose donc des signaux observables : dépasser la capacité, échouer sur un critère critique, ne pas pouvoir ouvrir le logiciel ou ne pas comprendre une consigne de recette. Chaque ligne associe une réponse et un responsable. Dans le projet solo, Dorian porte ces décisions. La ligne sur la recette accessible appartient à la séance fictive avec testeur. La revue hebdomadaire proposée rapproche les tickets, les écarts et les risques, puis conserve une action datée. Le tableau est un dispositif de pilotage pédagogique ; aucune cotation historique ou réunion réellement tenue n’est revendiquée.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A03 ; scénario annuel ; audit navigation pour le problème réel.

### 10. Arbitrer face à une navigation trop lente

**Repère : 09:30–11:00** — Arbitrage réel ; comparaison rétrospective.

Le cas réel est la lenteur signalée lors des clics de navigation. La conséquence est visible : l’utilisateur attend sans percevoir clairement le résultat de son action. Le diagnostic local montre que l’initialisation du fond animé monopolise le navigateur. Le tableau compare les options comme outil d’aide à la décision. Garder le fond conserve le problème. Optimiser ou différer l’animation peut être étudié, mais aucun gain n’a été mesuré dans les preuves disponibles. Le choix retenu remplace le fond par un SVG statique et ajoute un indicateur d’attente. Il conserve le motif graphique et sacrifie le mouvement. Le changement est réel ; la comparaison formalisée ici est rétrospective. Les mesures suivantes permettent d’en discuter l’effet.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** Audit navigation du 15/09 ; commit 83e4c29.

### 11. Mesurer l’effet de la correction

**Repère : 11:00–12:00** — Mesures locales contrôlées, échantillon limité.

Le graphique compare les mêmes cinq parcours avant et après la correction. Les mesures sont réalisées avec Chromium, un processeur ralenti quatre fois et une latence réseau simulée de 100 millisecondes. Avant correction, le temps médian observé est de 10 220 millisecondes. Après correction, il est de 748 millisecondes. La comparaison montre un effet très net dans ces conditions. Elle reste un échantillon d’un passage par parcours : ce n’est ni une moyenne sur tous les utilisateurs, ni un engagement de performance, ni une mesure en production. Le protocole et les valeurs sont conservés dans l’audit. Je préfère présenter les temps et leurs limites plutôt que transformer un test local en promesse générale.

**À montrer :** Comparer les barres de deux parcours et expliquer le protocole.

**Source :** Audit navigation du 15/09 ; donnees/projet-reel.json, performance.

### 12. Adapter la posture à une situation précise

**Repère : 12:00–13:30** — Mise en situation pédagogique explicitement simulée.

Cette situation est simulée : j’imagine une séance de recette ponctuelle, sans transformer Spity en projet développé en équipe. Le testeur demande de traiter les blocages, tandis que le porteur souhaite enrichir le décor. Une posture participative sert d’abord à écouter les faits et les impacts. Une posture persuasive permet d’expliquer le compromis. La posture directive fixe une limite : un critère critique en échec empêche l’acceptation. Enfin, la posture délégative confie un scénario de test avec un résultat attendu et un point de contrôle. La critique porte sur une décision trop rapide du porteur : elle peut faire perdre une information utile. La recommandation est de faire reformuler le problème, comparer les options, décider puis écrire l’action. Aucun conflit réel n’est attribué à une personne.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A05 ; séance pédagogique ; référentiel p. 12–13.

### 13. Organiser une collaboration accessible

**Repère : 13:30–15:00** — Mise en situation pédagogique explicitement simulée.

Dans la simulation, la séance comporte quatre heures de travail pour le porteur et quatre pour le testeur, chacun disposant de cinq heures. La répartition respecte les compétences et conserve une marge. Ce n’est pas une capacité réelle mesurée. Pour le persona malentendant, les consignes sont écrites, les sous-titres sont vérifiés et les prises de parole organisées. Le contrôle consiste à faire reformuler la consigne et retrouver la décision. Dans un contexte à distance et multiculturel, les invitations indiquent les heures locales et le vocabulaire partagé évite les ambiguïtés. Linear suit les actions, Git identifie la version et le dossier centralise les preuves. Un point court, préparé par écrit, se termine par un responsable et un retour attendu.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A02/A05 ; mise-en-situation.json, review.

### 14. Évaluer les compétences utiles au projet

**Repère : 15:00–16:30** — Mise en situation pédagogique explicitement simulée.

Les compétences nécessaires sont le suivi, le développement, la recette et la vérification au clavier. Cette grille est pédagogique : elle ne constitue pas une note réellement attribuée à Dorian ou à un testeur. L’échelle va de zéro, non abordé, à trois, autonome sur des cas complexes. Dans le cas, le porteur lit le suivi avec aide mais doit expliquer seul les écarts : il passe donc d’un niveau un à une cible deux. Le développement est supposé autonome et ne demande pas de formation prioritaire. Le testeur sait suivre une consigne mais doit produire une recette reproductible et vérifier le clavier sans aide. Ces écarts justifient les actions de formation. Le niveau technique reste indépendant de la situation de handicap.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A06 ; mise-en-situation.json, skills.

### 15. Prévoir une progression vérifiable

**Repère : 16:30–18:00** — Mise en situation pédagogique explicitement simulée.

Le plan répond aux écarts de la grille. Le porteur dispose d’un atelier d’une heure avant la revue M10 pour recalculer et expliquer le tableau de bord. Le testeur dispose de deux heures avant la recette M11 pour pratiquer la recette et les contrôles clavier. Les durées sont des hypothèses de formation, distinctes des huit heures de la séance de recette. Les supports sont écrits et sous-titrés, les pauses et le temps supplémentaire sont adaptés au besoin. L’efficacité se juge sur une tâche réalisée sans aide, pas sur la seule présence. Si une compétence critique reste indisponible, la fiche de renfort prépare une mission, un profil et des critères pour un service RH dans la mise en situation. Aucun recrutement n’est réellement engagé.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A06 ; mise-en-situation.json, training ; annexe 26.

### 16. Un compte rendu qui aide à décider

**Repère : 18:00–19:30** — Mise en situation pédagogique explicitement simulée.

Le compte rendu montré est fictif et identifié CR-SIM-02. Il relie les chiffres de la simulation au besoin d’un persona club. Le constat annonce la prévision, son écart et sa conséquence sur le jalon. La décision pédagogique consiste à conserver le fond statique et à protéger les critères de recette. Les actions distinguent le porteur, le testeur ponctuel et le représentant de club fictif. Le document donne aussi un prochain point de validation. Cette structure aide un client à comprendre et à choisir. La correction du fond est réellement présente dans le logiciel, mais ce compte rendu n’est pas son origine historique et n’a pas été signé par un client réel.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A07 ; mise-en-situation.json, clientReviews ; retours simulés du candidat.

### 17. Prévoir les points de validation

**Repère : 19:30–20:30** — Mise en situation pédagogique explicitement simulée.

Les points de validation du modèle annuel suivent les risques du projet. Le cadrage vérifie le besoin avant d’engager la réalisation. La revue M10 expose les écarts et permet de décider. La recette M11 rapproche chaque critère de son résultat et prépare les corrections. La restitution M12 porte sur la dernière version prête. Une réserve entraîne une action avec un responsable et une échéance à convenir. Ces rendez-vous sont planifiés dans la simulation ; ils ne sont pas des réunions historiques déclarées. Le calendrier évite de découvrir à la dernière minute que le logiciel ne répond pas au parcours attendu.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A01/A07 ; planning annuel simulé.

### 18. Mesurer le retour pour agir

**Repère : 20:30–21:30** — Mise en situation pédagogique explicitement simulée.

Les indicateurs sont définis avant la séance : réussite sans aide, utilité perçue, conformité des critères critiques et blocages ouverts. Le protocole note aussi l’effectif, car une moyenne isolée masque le nombre de retours. Les cibles affichées sont pédagogiques, pas des engagements signés. Les résultats restent non mesurés. Si la réussite sans aide est faible, il faut identifier l’étape difficile. Une faible utilité demande de revenir au besoin. Un blocage critique empêche l’acceptation et déclenche une correction suivie d’une nouvelle vérification. Ces indicateurs complètent les tests techniques, qui ne mesurent pas la satisfaction.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A07 ; indicateurs proposés pour les personas simulés.

### 19. Préparer une démonstration vérifiable

**Repère : 21:30–23:00** — Protocole proposé pour la démonstration.

La démonstration est préparée autour de critères visibles. Pour les partenaires, je vérifie les filtres et l’état d’une demande. Pour un événement, je montre l’inscription et les places disponibles. Avec la session club, je retrouve les participants et les commandes autorisées. Je termine par un passage au clavier. La préparation se fait sur une base isolée contenant des comptes de test. Avant l’oral, il faut vérifier les dates des événements, les connexions et la version utilisée. Les captures du 15 septembre servent de secours si un incident empêche une manipulation. Dans ce cas, j’annonce le problème et le critère qui n’a pas été revérifié en direct. Je ne transforme pas une capture en validation actuelle.

**À montrer :** Préparer deux sessions et annoncer les critères avant de changer d’écran.

**Source :** A08 ; captures du 15/09 ; recette du projet.

### 20. Passer du suivi à l’usage.

**Repère : 23:00–23:30** — Manipulation à réaliser devant le jury.

Je passe à la démonstration. Les comptes utilisés sont des comptes de test dans une base dédiée. Je commence avec une session grimpeur, puis je passe à la session club pour retrouver les participants. L’objectif est de montrer les critères annoncés, pas de parcourir toutes les pages du site.

**À montrer :** Basculer dans le navigateur préparé ; annoncer la version.

**Source :** A08 ; environnement local isolé.

### 21. Trouver un partenaire

**Repère : 23:30–26:00** — Manipulation en direct ; capture datée de secours.

Afficher le profil de la session grimpeur et expliquer la discipline et le niveau utilisés. Ouvrir la recherche de partenaires, modifier un filtre et vérifier que les résultats restent cohérents. Consulter un profil compatible, puis montrer l’état d’une demande. Si une demande existe déjà, expliquer cet état au lieu d’annoncer un nouvel envoi. Lorsque le partenariat est accepté, montrer le passage vers les événements. Décrire chaque résultat visible avec les mots d’un utilisateur.

**À montrer :** 0:30–1:00 profil ; 1:00–2:00 filtres ; 2:00–3:00 demande. Adapter aux données disponibles.

**Source :** Capture matching du 15/09 ; code et recette matching.

### 22. S’inscrire et retrouver les participants

**Repère : 26:00–29:00** — Manipulation en direct ; capture datée de secours.

Ouvrir un événement futur et montrer les places restantes. Procéder à l’inscription ou expliquer l’état déjà inscrit. Passer dans le navigateur de la session club et retrouver la liste des participants. Montrer que les commandes dépendent du rôle et vérifier un passage au clavier. Revenir aux critères annoncés : préciser ceux qui ont été montrés, ceux qui nécessitent une réserve et ceux qui reposent uniquement sur une preuve de test. Revenir au diaporama avant la fin des six minutes.

**À montrer :** 3:00–4:00 inscription ; 4:00–5:15 club ; 5:15–5:45 clavier ; 5:45–6:00 retour aux critères.

**Source :** Capture événements du 15/09 ; A08 ; recette événements.

### 23. Conclure par une décision de validation

**Repère : 29:00–30:00** — Éléments du projet documentés.

Je termine par le résultat des manipulations : quels critères ont réussi et quelles réserves restent ouvertes ? La décision doit être formulée à partir de ce qui a été montré : accepté, accepté avec réserve ou refusé. Chaque réserve décrit une action, un responsable et une prochaine vérification. Cette validation est recherchée à la fin de la démonstration ; elle n’est pas inventée à l’avance. Le support a présenté les sept compétences, en séparant le projet solo réel sur un an, les estimations initiales et les mises en situation pédagogiques. Les traces du logiciel et les limites des simulations restent disponibles dans les annexes.

**À montrer :** Donner le bilan réel des manipulations, puis ouvrir les questions.

**Source :** Synthèse des pièces citées ; matrice des compétences.

### 24. Les sept compétences et leurs preuves

**Repère : Annexe hors timing** — Analyse de couverture, sans attribution de compétence.

Chaque compétence dispose d’un contenu visible, de notes et d’une annexe détaillée. Les compétences obligatoires sont repérées dans le PDF fourni. La matrice distingue les faits, les estimations et les simulations. Cette correspondance prouve la présence des éléments dans le support ; elle ne préjuge pas de leur évaluation par le jury.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** cadre-evaluation.json ; MATRICE_PREUVES.md.

### 25. Les étapes enregistrées dans Git

**Repère : Annexe hors timing** — Durée déclarée ; chronologie rétrospective issue de Git.

Le projet s’inscrit sur un an, comme indiqué dans mon cadrage personnel. Le dépôt apporte des repères complémentaires : les fondations techniques sont enregistrées en janvier, puis les interfaces, les profils et les lieux en mai. En juillet apparaissent le matching, les événements et la recette automatisée. En août, le projet intègre davantage de maintenance et de supervision. En septembre, il évolue avec les médias, l’administration et les contributions aux falaises. Cette chronologie est reconstruite à partir des commits. Elle montre ce qui est traçable, mais ne remplace pas un planning initial approuvé. Le premier commit ne date pas nécessairement le début de la réflexion sur le projet. Les mois exacts de début et de fin de l’année restent à confirmer. Je ne transforme pas une période sans commit en absence de travail.

**À montrer :** Suivre la frise ; ouvrir un commit uniquement si le jury demande la preuve.

**Source :** donnees/projet-reel.json ; preuves/historique-git.txt.

### 26. Préparer un besoin de renfort

**Repère : Annexe hors timing** — Mise en situation pédagogique explicitement simulée.

Cette fiche montre comment transmettre un besoin au service RH dans la mise en situation. Le déclencheur est un écart critique qui persiste après formation. La mission est limitée à quatre heures de recette, avec compétences, disponibilité à confirmer et livrable précis. La sélection se fait par un exercice accessible et l’accueil donne les critères et les seuls accès nécessaires. Le coût indicatif de 180 euros serait supplémentaire et doit être arbitré avant tout engagement. Le projet réel est solo : aucun service RH n’a été sollicité ni renfort engagé.

**À montrer :** Expliquer les éléments affichés et leur source.

**Source :** A06 ; fiche de mise en situation pédagogique.

## Réponses à préparer

- **Pourquoi un an et 82 j-h ?** Un an est une durée déclarée ; 82 j-h est la charge estimée du cadrage. Aucun relevé de temps ne permet de comparer le consommé.
- **Avec quelle équipe ?** Projet solo confirmé. Présenter les responsabilités assumées et les aides effectivement reçues ; ne pas inventer de collaborateurs.
- **Quel client a validé ?** Aucune réception réelle jointe. Les trois retours sont pédagogiques et simulés.
- **Pourquoi 12/24 ?** Relevé Linear du 14 septembre, hors ticket annulé, non pondéré ; ce n’est pas la moitié du produit validé.
- **Pourquoi la correction de navigation ?** Calcul décoratif bloquant reproduit localement, puis SVG statique et indicateur d’attente ; voir l’audit daté.
- **Les temps sont-ils ceux de la production ?** Non. Protocole local contrôlé, un passage par parcours. La sonde distante prouve seulement la santé et la révision servie à cet instant.
- **Le Bloc 3 est-il entièrement démontré ?** Les sept compétences et leurs critères disposent de contenus. Certains sont traités par une mise en situation annoncée. Cela ne vaut ni expérience vécue ni acquisition décidée par le jury.
- **Que faire si la démo échoue ?** Dire quel critère n’a pas pu être revérifié, utiliser une capture datée puis décrire la suite nécessaire.

## Répétition

Préparer A08, les deux sessions locales et les événements futurs. Expliquer oralement un chiffre de chaque graphique, son unité et sa limite. Rejouer les six minutes de démonstration. Vérifier les règles de dépôt du campus et les pièces nécessaires dans CHECKLIST_REMISE.md. Aucun dépôt externe ni validation du jury n’est déclaré par ce guide.
