# Dossier Bloc 3 — Coordonner et piloter Spity

## Projet et cadre de la mise en situation

Spity est une plateforme d’escalade développée seul par Dorian sur un an. Le Bloc 3 présente une **organisation d’équipe fictive** pour piloter ce projet : Dorian, Léa, Hugo, Inès et Sami, avec Claire côté client. Les affectations, disponibilités, consommés, formations et réunions sont simulés. Les fonctionnalités, commits et mesures techniques restent des traces réelles, identifiées séparément.

La référence B1 retenue représente 82 j-h et 44 250 € estimés. Ces charges sont réparties entre les membres, jamais multipliées par l’effectif. Le taux de 450 €/j-h est une convention moyenne du cas. Les mois M1–M12 sont relatifs ; les dates Git sont conservées en annexe. Aucun montant réel dépensé ni accord client historique n’est inventé.

Le support commence par le sommaire et le projet puis couvre les sept compétences, dont C.3.1, C3.2.1 et C3.4.2 obligatoires. Les sources d’évaluation et les 40 correspondances sont conservées avec leurs empreintes. Les notes sont rédigées à la première personne et les repères de répétition restent dans le guide privé.

## C.3.1

### Organiser le travail de l’équipe

Nature : **Organisation de l’équipe fictive appuyée sur les outils réels**.

Dans ce scénario, je suis chef de projet et responsable des priorités produit. Je retiens un fonctionnement inspiré de Kanban : chaque tâche a une personne responsable, une échéance, une dépendance et un critère de fin.

Léa prépare les parcours et les maquettes. Hugo développe et propose une revue du code. Inès vérifie les critères de recette ; Sami contrôle l’environnement et la livraison. Je clos la tâche quand les preuves attendues sont présentes. Claire valide les décisions de périmètre et la réception côté client.

Je complète le backlog par un planning annuel. Lors de la revue hebdomadaire, chacun actualise son reste à faire et signale les blocages. Je compare ensuite la charge aux disponibilités avant d’arbitrer.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Planifier les travaux sur une année

Nature : **Mise en situation pédagogique explicitement simulée**.

Je répartis les neuf lots du cadrage sur douze mois relatifs. Les 82 jours-personne sont la charge totale de l’équipe, pas 82 jours par personne. Les membres interviennent à temps partiel selon les phases.

Léa pilote le cadrage UX avec moi, Sami prépare le socle et Hugo prend en charge les lots de développement. Inès pilote la recette, avec Sami pour la livraison et moi pour la documentation et la restitution. Le planning détaillé répartit aussi les contributions de chaque personne à l’intérieur des lots.

Je garde les dépendances : les accès avant les profils, les événements avant les inscriptions et une version stable avant la recette. Les dates Git restent une preuve du développement réel ; les mois de ce planning représentent le scénario d’équipe.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Une équipe, des responsabilités précises

Nature : **Mise en situation pédagogique explicitement simulée**.

Je répartis le travail entre cinq membres. Je prends le pilotage et les priorités produit. Léa s’occupe des parcours et des maquettes. Hugo développe les interfaces et les API. Inès prépare la recette, qualifie les défauts et vérifie les corrections. Sami prend en charge l’infrastructure, la sécurité et le déploiement.

Claire représente le club client : elle exprime le besoin, valide le périmètre et prononce la réception. Je reste responsable de la coordination interne. Dans ma matrice RACI, je distingue celui qui réalise de celui qui décide, avec un seul décideur par activité.

Je prévois les moyens adaptés : outil de maquette pour Léa, dépôt et base de test pour Hugo, comptes et scénarios dédiés pour Inès, pipeline et environnement isolé pour Sami. Inès est un persona malentendant ; je prépare des consignes écrites et des sous-titres, indépendamment de son niveau technique.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

## C3.2.1

### L’avancement réel des fonctionnalités

Nature : **État des fonctionnalités vérifié dans le code le 16 septembre 2026**.

Pour faire le point sur mon avancement, j’ai rapproché les tâches de mon backlog des fonctionnalités présentes dans le site. L’inscription et la connexion sont déjà réalisées, pour les grimpeurs comme pour les clubs. Les améliorations restantes sur les sessions concernent leur renouvellement et la rotation des jetons.

J’ai aussi réalisé les profils avec avatar, la publication avec image, les likes et les commentaires simples. La carte affiche les salles et les falaises. Pour les topos, je peux ajouter une voie, faire un signalement et partager un lien ou un PDF. Les événements permettent de gérer les inscriptions et la capacité.

Je garde à droite les suites à développer : modifier ou supprimer une publication, compléter les fonctions des clubs, ajouter les votes sur les topos et enrichir le fil social. Ce bilan me permet de prioriser ce qui manque encore, sans compter une fonction déjà disponible comme un travail à recommencer.

Pour organiser les prochaines évolutions du scénario, je les confie à Hugo, avec Léa pour les parcours, Inès pour les tests et Sami pour la livraison. Ces attributions ne changent pas l’auteur réel du logiciel.

Source : A09 ; audit du 16/09/2026 ; dépôt applicatif a805162.

### Un tableau de bord pour décider

Nature : **Mise en situation pédagogique explicitement simulée**.

Au point du mois 10 de mon scénario, je consolide les chiffres de chaque membre. Le détail donne 58 jours-personne consommés et 28 restants, soit 86 à terminaison au lieu de 82. Avec un taux moyen conventionnel de 450 euros par jour et les autres postes, la prévision atteint 46 050 euros, soit 1 800 euros de plus.

Je regarde aussi les disponibilités réservées à Spity sur la prochaine période : dix jours pour l’équipe, face à douze jours de tâches. La surcharge concerne Hugo, avec quatre jours prévus pour trois disponibles, et Inès, avec trois pour deux. Je reporte un jour de développement et un jour de recette non critiques hors période, après vérification des dépendances.

Le jalon révisé passe de fin M11 à fin M12. Je présente à Claire l’effet sur le délai et je conserve les critères critiques. Tous ces consommés et disponibilités sont les hypothèses chiffrées du scénario.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Anticiper les points de vigilance

Nature : **Mise en situation pédagogique explicitement simulée**.

Je donne à chaque risque un signal et une personne responsable. Si Hugo ou Inès dépasse sa capacité, je reprends les priorités avec eux et j’annonce l’effet sur le jalon à Claire.

Si un critère critique échoue, Hugo corrige et Inès recontrôle. Si l’environnement devient indisponible, Sami diagnostique et prépare le secours. Pour l’accessibilité des échanges, Léa adapte les supports et je vérifie avec Inès qu’elle peut retrouver et reformuler les consignes.

Je termine chaque revue avec une action datée et un responsable. Je ne ferme pas un risque uniquement parce qu’une action a été promise : je demande le résultat du contrôle.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

## C3.2.2

### Arbitrer face à une navigation trop lente

Nature : **Arbitrage réel ; comparaison rétrospective**.

Je prends maintenant un problème réel que j’ai rencontré sur Spity : lorsque je cliquais dans la barre de navigation, le passage à la page suivante semblait très lent.

Le diagnostic local a montré que l’initialisation du fond animé occupait le navigateur. J’ai repris les options possibles dans ce tableau pour expliquer l’arbitrage. Garder l’animation conservait le problème observé. L’optimiser ou la différer pouvait être étudié, mais je n’ai pas de mesure permettant d’affirmer le gain de cette option.

Le choix retenu a été de remplacer le fond par un SVG statique et d’ajouter un indicateur d’attente. Je conserve ainsi le motif graphique, en acceptant de perdre le mouvement décoratif.

Le changement a été intégré et livré. Pour vérifier son effet, je m’appuie sur la comparaison avant et après que je vous montre ensuite.

Source : Audit navigation du 15/09 ; commit 83e4c29.

### Mesurer l’effet de la correction

Nature : **Mesures locales contrôlées, échantillon limité**.

Ici, je compare les mêmes cinq parcours avant et après la correction. Les mesures ont été réalisées localement sur une compilation de production, avec un processeur ralenti quatre fois et une latence réseau simulée de 100 millisecondes.

La médiane passe de 10,22 secondes à 0,748 seconde. L’amélioration est nette dans ce protocole : le navigateur n’a plus à effectuer le calcul décoratif au changement de page.

Je garde cependant la portée de la mesure : il y a un passage par parcours, dans un environnement local contrôlé. Je ne présente donc pas ces chiffres comme les temps de tous les utilisateurs en production. Ils me permettent de vérifier l’effet de la correction dans des conditions comparables.

Dans mon scénario, je confie à Inès la comparaison des mêmes parcours, à Hugo l’analyse technique et à Sami la vérification de la version livrée. Les mesures affichées restent celles du contrôle local réel.

Source : Audit navigation du 15/09 ; donnees/projet-reel.json, performance.

## C3.3.1

### Adapter la posture à une situation précise

Nature : **Mise en situation pédagogique explicitement simulée**.

Dans cette situation simulée, Léa propose une animation plus riche. Inès signale des blocages et Hugo estime l’effort nécessaire. Je commence par écouter leurs observations et par faire préciser les impacts : c’est ma posture participative.

J’explique ensuite à Léa et à Claire pourquoi je privilégie les parcours utilisables. Je m’appuie sur les critères et les mesures : c’est la posture persuasive. Je fixe une limite claire à Hugo et à l’équipe : aucun blocage critique ne peut être accepté comme terminé.

Enfin, je délègue à Inès l’exécution de la recette et à Sami le contrôle de livraison, avec un résultat attendu et un point de retour. Je garde la décision de priorité, sans refaire leur travail à leur place. Avec du recul, trancher avant d’avoir écouté l’équipe ferait perdre des informations utiles.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Organiser une collaboration accessible

Nature : **Mise en situation pédagogique explicitement simulée**.

Pour la séance de recette du scénario, je répartis quatorze heures de travail entre les cinq membres, pour dix-neuf heures disponibles au total. Hugo et Inès ont quatre heures affectées sur cinq ; Léa, Sami et moi avons chacun deux heures sur trois.

Je coordonne les priorités et la décision client. Léa vérifie les parcours et adapte les supports. Hugo prépare et corrige la version. Inès exécute les scénarios et rédige les réserves. Sami prépare les comptes et contrôle la version. Ces heures détaillent une activité des lots du planning : elles ne s’ajoutent pas une deuxième fois aux 82 jours.

Pour Inès, je fournis les consignes par écrit, des sous-titres vérifiés et une prise de parole à la fois. Je lui demande de reformuler la consigne. À distance, je précise les fuseaux, je prévois un retour asynchrone et un glossaire français-anglais. Chaque échange se termine par une action, un responsable et un retour attendu.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

## C3.3.2

### Évaluer les compétences utiles au projet

Nature : **Mise en situation pédagogique explicitement simulée**.

J’évalue les besoins de chaque rôle avant de choisir une formation. Cette grille est une hypothèse pédagogique. Un niveau un signifie que la personne travaille avec de l’aide ; deux signifie qu’elle est autonome ; trois couvre les cas complexes.

Je dois progresser sur le suivi des écarts. Léa doit vérifier l’accessibilité des maquettes. Inès doit produire une recette reproductible et vérifier le clavier. Sami doit maîtriser le retour arrière. Hugo est supposé autonome sur les API et la sécurité applicative ; je vérifie cette hypothèse par la revue de code, sans lui imposer une formation inutile.

Je relie chaque écart à la mission confiée et à un résultat observable. Les besoins d’aménagement d’Inès sont traités séparément de son niveau technique.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Prévoir une progression vérifiable

Nature : **Mise en situation pédagogique explicitement simulée**.

Je prévois quatre actions ciblées : une heure de recalcul du suivi pour moi, une heure d’audit de maquette pour Léa, deux heures de recette et de clavier pour Inès, puis une heure de retour arrière pour Sami avec Hugo.

Les cinq heures correspondent au temps des apprenants. Je prévois séparément deux heures d’accompagnement par Hugo pour Inès et Sami, et une heure par moi pour Léa. Ces huit heures de formation et d’accompagnement sont comprises dans les lots et distinctes de la séance de recette.

Je fournis des supports écrits, des sous-titres et des pauses adaptées. Je vérifie l’efficacité par une tâche réalisée sans aide. Si une compétence critique reste indisponible, j’ajuste l’accompagnement puis j’étudie un renfort QA ponctuel, décrit en annexe, sans annoncer un recrutement déjà décidé.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

## C3.4.1

### Un compte rendu qui aide à décider

Nature : **Mise en situation pédagogique explicitement simulée**.

Au point M10 avec Claire, je structure le compte rendu du scénario en trois parties : constat, décision et actions. J’annonce les 1 800 euros et le mois de décalage, puis je relie cet écart à la priorité du client : disposer de parcours utilisables.

Claire arbitre le périmètre proposé. Je mets à jour le planning ; Léa ajuste les parcours ; Hugo prépare la version ; Inès prépare la recette M11 ; Sami vérifie l’environnement. Le compte rendu précise le livrable attendu et le prochain contrôle pour chacun.

Ce compte rendu est simulé. Il utilise la correction réelle de navigation pour illustrer une décision d’équipe, sans prétendre que cet échange fictif est à l’origine historique du changement.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Prévoir les points de validation

Nature : **Mise en situation pédagogique explicitement simulée**.

Je place les validations au fil du projet simulé. Au mois 3, Léa prépare les parcours et je présente le périmètre à Claire. Au mois 10, Hugo documente les options techniques et je présente les écarts pour permettre l’arbitrage client.

Au mois 11, Inès rend son rapport et Hugo traite les anomalies ; je décide si la version peut être démontrée. Au mois 12, Sami prépare la version contrôlée et je conduis la restitution. Claire prononce alors la réception selon les critères observés.

Pour chaque réserve, je désigne une personne, un résultat attendu et une échéance. Inès vérifie ensuite la correction : une promesse de correction ne suffit pas à fermer la réserve.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

### Mesurer le retour pour agir

Nature : **Mise en situation pédagogique explicitement simulée**.

Je confie à Inès le relevé des parcours réussis et des blocages. Léa recueille l’utilité perçue auprès des personas. Claire examine la conformité des critères, et je consolide le bilan avec le nombre de participants et la date.

Les seuils sont les objectifs du scénario : au moins 80 % de réussite sans aide, une utilité moyenne de quatre sur cinq, tous les critères critiques acceptés et aucun blocage critique ouvert. Je ne présente pas de résultat réel de satisfaction.

Si un objectif n’est pas atteint, Léa analyse la difficulté d’usage, Hugo corrige, Inès recontrôle et Sami prépare la livraison. Je propose ensuite à Claire une nouvelle validation du périmètre concerné.

Source : Équipe, planning et affectations : donnees/mise-en-situation.json ; annexes A01–A07.

## C3.4.2

### Les critères de validation

Nature : **Protocole proposé pour la démonstration**.

Avant de vous montrer le logiciel, je précise ce que nous allons vérifier. Pour les partenaires, je regarde la cohérence des filtres et la lisibilité de l’état d’une demande.

Pour les événements, je vérifie l’inscription et les places disponibles. Avec la session club, je retrouve les participants et les commandes liées à ce rôle. Je montre aussi l’utilisation des commandes au clavier.

J’utilise une base de démonstration avec des comptes de test. Le résultat attendu reste concret : un grimpeur comprend ce qu’il peut faire, et un club retrouve les informations nécessaires pour organiser sa sortie.

Ces critères me servent ensuite à faire le bilan de la démonstration et à identifier les éventuelles réserves.

Source : A08 ; captures du 15/09 ; recette du projet.

### Passer du suivi à l’usage.

Nature : **Manipulation à réaliser devant le jury**.

Je passe maintenant au logiciel. Je commence avec une session grimpeur pour vous montrer la recherche de partenaires. Ensuite, je passe sur un événement, puis sur la session club pour retrouver les participants.

Je garde les mêmes critères tout au long du parcours : des filtres cohérents, un état compréhensible et des actions adaptées au rôle de l’utilisateur.

Source : A08 ; environnement local isolé.

### Trouver un partenaire

Nature : **Manipulation en direct ; capture datée de secours**.

Je commence par le profil du grimpeur. Ici, je retrouve sa pratique et son niveau : ce sont les informations qui donnent du contexte à la recherche.

Je vais maintenant dans les partenaires. Je sélectionne une discipline et je regarde comment la liste s’adapte. Je peux consulter un profil pour vérifier s’il correspond à la sortie que je veux préparer.

Je passe ensuite à la demande de partenariat. Ce que je veux rendre clair pour l’utilisateur, c’est l’état de sa demande : il doit savoir où il en est avant de poursuivre. Si une demande existe déjà, je présente l’état affiché ; je n’ai pas besoin d’en créer une deuxième pour montrer ce fonctionnement.

Le parcours peut ensuite se poursuivre vers les événements pour préparer une sortie.

Source : Capture matching du 15/09 ; code et recette matching.

### S’inscrire et retrouver les participants

Nature : **Manipulation en direct ; capture datée de secours**.

Je passe maintenant aux événements. Sur la fiche, je retrouve les informations de la sortie et les places disponibles. Je peux vérifier l’action proposée pour l’inscription et l’état affiché pour ce compte.

Si le compte est déjà inscrit, je peux le voir directement. Sinon, je peux effectuer l’inscription et vérifier la confirmation.

Je passe ensuite à la session club. L’objectif est de retrouver les participants et les commandes de gestion adaptées à ce rôle. Le grimpeur et le club n’ont pas les mêmes actions à réaliser.

Je termine avec les commandes au clavier pour montrer le déplacement du focus et leur activation. Je peux maintenant revenir à mes critères et distinguer les résultats observés des points qui resteraient à vérifier.

Source : Capture événements du 15/09 ; A08 ; recette événements.

### Conclure par une décision de validation

Nature : **Éléments du projet documentés**.

Pour terminer, je reviens aux critères que nous avons suivis : les partenaires, l’inscription, les participants et l’utilisation au clavier.

À partir du résultat observé, je peux demander une décision : accepté, accepté avec réserve ou refusé. Si un point reste à corriger, je le décris précisément et je lui associe une action, un responsable et une prochaine vérification.

Ce que je retiens de Spity, c’est l’importance de relier l’organisation du travail à un résultat utilisable. Les tickets me donnent une vue sur le travail, les contrôles me permettent de vérifier les changements et la démonstration me ramène au besoin de l’utilisateur.

Merci pour votre attention. Je suis prêt à répondre à vos questions.

Dans le scénario d’équipe, je restitue les résultats d’Inès à Claire. Elle décide de la réception. Je confie les réserves d’usage à Léa, les corrections à Hugo et la livraison à Sami, puis Inès vérifie à nouveau.

Source : Synthèse des pièces citées ; matrice des compétences.
