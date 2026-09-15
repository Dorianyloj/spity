"""Author the 30-minute presentation and its spoken rehearsal script."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
slides=[]

def add(title,minutes,nature,layout,content,script,source,action='',transition='',demo=False):
    slides.append(dict(number=len(slides)+1,title=title,minutes=minutes,nature=nature,layout=layout,content=content,script=script.strip(),source=source,action=action,transition=transition,demo=demo))

add('Spity',.5,'RNCP39583, Bloc 3','cover',{},'''
Bonjour, je suis Dorian Joly. Je vais présenter le pilotage de Spity, une application destinée à la communauté de l'escalade. Mon fil conducteur est la préparation d'une sortie, depuis la recherche d'un partenaire jusqu'à l'inscription à un événement. Je présenterai l'organisation du projet, les décisions de pilotage, puis une démonstration du logiciel.
''','Référentiel RNCP39583, p. 11 à 14. Photo de marque du dépôt, illustration sans lien avec une équipe réelle.',transition='Je commence par le besoin auquel répond le produit.')

add('Le besoin des grimpeurs et des clubs',1,'Produit Spity','photo',dict(image='docs/rncp/bloc-03/preuves/captures/lieux-2026-09-15.png',items=[['Grimpeur','Trouver un partenaire et rejoindre une sortie.'],['Club','Organiser un événement et suivre les participants.']]),'''
Le besoin retenu pour cette présentation est concret : préparer une sortie avec des personnes compatibles avec sa pratique. Un grimpeur doit pouvoir comprendre les profils proposés, consulter les informations d'un événement et savoir si son inscription a abouti. Le club a un autre besoin : organiser la sortie et retrouver les participants autorisés.

Ces deux points de vue déterminent ce que je vais montrer. Une page qui s'affiche correctement reste insuffisante si l'utilisateur ne comprend pas l'état de sa demande ou le nombre de places disponibles. Je retiens donc des critères observables sur le parcours complet. La capture présente le répertoire de lieux, qui apporte le contexte géographique de la pratique.
''','DOSSIER_BLOC_03 §1-2. Capture locale du 15 septembre 2026, données de démonstration.',transition='Il faut ensuite préciser sur quelles preuves repose cette présentation.')

add('Périmètre et nature des preuves',1,'Produit réel et mise en situation fictive','columns',dict(items=[['Éléments observés','Code, historique Git et tests datés.\nApplication et comptes de démonstration.'],['Cas pédagogique','Équipe CP, DEV et QA.\nPlanning, coûts et réunions simulés.']]),'''
Cette présentation combine deux ensembles que je distingue clairement. D'un côté, le logiciel existe. Le dépôt contient le code, des modifications datées et des résultats de vérification. Je peux montrer ces éléments et préciser leur portée.

De l'autre, j'utilise un cas professionnel fictif pour expliquer le pilotage d'une petite équipe. Les rôles, les charges, les coûts et les réunions client de ce cas sont des hypothèses pédagogiques. Le référentiel autorise une mise en situation réelle ou fictive. Je présente donc ces éléments comme un scénario. Les comptes de démonstration ne correspondent pas à des personnes interrogées. Cette distinction permet au jury de comprendre exactement ce qui est observé et ce qui relève de mon raisonnement de pilotage.
''','Référentiel p. 11. DOSSIER_BLOC_03 §1-2.',transition='Dans ce cadre, je retiens une organisation simple, adaptée au lot.')

add('Kanban et critères de fin',1.5,'C.3.1, simulation pédagogique','table',dict(rows=[['État','Condition'],['À faire','Besoin et critères explicites'],['En cours','Responsable et capacité disponibles'],['À vérifier','Fonction prête pour la recette'],['Terminé','Critères vérifiés et réserves traitées']],widths=[300,852],takeaway='Deux tâches de réalisation simultanées au maximum'),'''
Pour ce cas, je retiens Kanban, avec des jalons de validation. Le lot est court, l'effectif réduit et les priorités peuvent évoluer. L'objectif est de rendre le travail visible et d'éviter de commencer trop de fonctions avant de terminer leur vérification.

Une tâche entre dans le tableau lorsque son besoin et ses critères sont compréhensibles. Elle passe en cours lorsqu'un responsable dispose de la capacité nécessaire. Elle rejoint ensuite la colonne à vérifier, puis terminé après la recette. Je limite à deux le nombre de tâches de réalisation simultanées. Si une tâche reste bloquée, la priorité est de traiter ce blocage avant d'ouvrir un nouveau chantier.

Je conserve des jalons pour le périmètre, les écarts et la réception. Linear sert au suivi des tâches, Git à la traçabilité des changements, et le classeur aux charges et aux coûts. Je n'affirme pas que toutes les cérémonies Scrum ont été pratiquées sur le projet. Le choix présenté ici répond aux contraintes du scénario et reste contrôlable par des critères simples.
''','DOSSIER_BLOC_03 §3. A01 et A03.',action='Montrer les quatre états, puis expliquer le blocage avec un exemple.',transition='Ces règles de travail se placent dans un planning de quinze jours ouvrés.')

add('Planning et jalons du lot',1.5,'C.3.1, simulation sur quinze jours ouvrés','table',dict(rows=[['Jalon','Résultat attendu','Validation'],['J3','Périmètre et critères','Client fictif'],['J8','Parcours partenaire','CP et QA'],['J10','Écarts et arbitrages','CP et client'],['J14','Recette et corrections','CP et QA'],['J15','Démonstration et réserves','Client fictif']],widths=[160,660,332]),'''
Le planning couvre quinze jours ouvrés relatifs. J1 à J15 désignent les jours du cas, pas des dates historiques du développement de Spity. Je conserve la référence initiale pour pouvoir expliquer les changements au lieu d'effacer les retards.

Le travail commence par l'étude du besoin et la mesure des critères attendus. Il comprend ensuite la conception de l'organisation, la réalisation des parcours, leur recette et la restitution. À J3, le client fictif valide le périmètre. À J8, le parcours partenaire doit être vérifié. J10 sert à examiner les écarts et à arbitrer les demandes nouvelles. La recette se clôt à J14 avant la démonstration de J15.

Les dépendances sont essentielles. La recette peut commencer sur les fonctions déjà prêtes, mais sa clôture attend la vérification des événements et des corrections. La préparation des slides peut avancer en parallèle. En revanche, la démonstration finale exige un parcours stabilisé. Le planning relie donc des résultats attendus, des responsabilités et des conditions de passage, plutôt qu'une simple succession de dates.
''','A01. donnees/pilotage.json.',action='Pointer J10, puis la dépendance entre recette J14 et démonstration J15.',transition='Pour tenir ces jalons, chacun doit connaître sa responsabilité.')

add('Rôles et responsabilités',1,'C.3.1, équipe fictive du cas','table',dict(rows=[['Rôle','Responsabilité','Capacité'],['Chef de projet','Organiser et arbitrer','30 h'],['Développeur','Réaliser et corriger','72 h'],['Testeur UX','Recetter les parcours','30 h'],['Client','Valider le périmètre','3 points']],widths=[350,560,242],takeaway='Une seule autorité de décision par activité dans la matrice RACI'),'''
Le scénario distingue un chef de projet, un développeur et un testeur UX. Leurs capacités représentent respectivement trente, soixante-douze et trente heures sur le lot. Le client intervient aux points de validation.

La matrice RACI précise qui réalise, qui décide, qui doit être consulté et qui doit être informé. Une seule autorité de décision est désignée pour chaque activité. Par exemple, le développeur corrige une fonction, QA vérifie le résultat et le chef de projet suit la clôture. Le client reste responsable de l'acceptation du périmètre.

Cette organisation évite les tâches sans responsable et les validations implicites. Les capacités restent des hypothèses du cas. Elles ne correspondent pas à des feuilles de temps réellement renseignées par des collaborateurs.
''','A02 et A03.',transition='Une fois le travail réparti, je peux comparer le prévu et la prévision.')

add('Avancement à J10',1.5,'C3.2.1, simulation pédagogique','numbers',dict(values=[['112 h','Charge initiale'],['77 h','Charge consommée'],['40 h','Reste à faire']],takeaway='Prévision à terminaison : 117 h, soit 5 h de plus que prévu',detail='5 tâches terminées sur 10. Les tâches ont des tailles différentes.'),'''
Le tableau de bord est arrêté à J10. La charge initiale du lot est de cent douze heures. Soixante-dix-sept heures sont consommées dans le scénario et le reste à faire est estimé à quarante heures. La prévision à terminaison atteint donc cent dix-sept heures, soit cinq heures de plus que la référence.

Je distingue trois notions. Le consommé indique l'effort déjà mobilisé. Le reste à faire exprime l'effort encore nécessaire. Le statut terminé indique qu'un résultat a été vérifié. Cinq tâches sur dix sont terminées, mais ce ratio ne signifie pas que la moitié de la valeur du produit est livrée. Les tâches n'ont pas toutes la même taille.

Chaque rôle actualise ses estimations. Deux fois par semaine, le chef de projet vérifie les écarts et leur effet sur les jalons. Par exemple, si une fonction semble presque codée mais que sa recette reste importante, le reste à faire doit encore intégrer ce travail. Je préfère constater cet écart avant la démonstration pour pouvoir décider tant qu'une marge existe.
''','A03. Classeur Pilotage et Planning. Données simulées à J10.',action='Montrer le calcul 77 + 40 = 117, puis distinguer les heures du taux de tâches terminées.',transition='La même prévision permet de réévaluer le coût du lot.')

add('Budget prévisionnel du cas',1.5,'C3.2.1, montants fictifs en euros','table',dict(rows=[['Repère','Montant','Lecture'],['Budget initial hors réserve','4 270 €','Référence du lot'],['Prévision à terminaison','4 465 €','Écart de +195 €'],['Plafond avec réserve','4 697 €','Réserve initiale de 427 €'],['Marge sous le plafond','232 €','Capacité financière restante']],widths=[480,240,432],takeaway='Le dépassement reste visible même lorsque la réserve peut l’absorber'),'''
Le budget valorise le travail à partir de taux horaires fictifs. Il ne représente pas des salaires versés ni des factures. La référence initiale comprend quatre mille quatre-vingt-dix euros de travail et cent quatre-vingts euros de frais, soit quatre mille deux cent soixante-dix euros.

Avec les charges revues à J10, le travail atteint quatre mille deux cent soixante-cinq euros. Les frais prévisionnels sont de deux cents euros. Le total à terminaison est donc de quatre mille quatre cent soixante-cinq euros. L'écart est de cent quatre-vingt-quinze euros, soit environ quatre virgule six pour cent.

La réserve initiale de dix pour cent représente quatre cent vingt-sept euros. Elle porte le plafond à quatre mille six cent quatre-vingt-dix-sept euros. Il reste deux cent trente-deux euros de marge. La réserve n'efface pas le dépassement de la référence. Elle indique seulement que le scénario peut encore l'absorber. Une nouvelle demande doit être comparée à cette marge et à la capacité de l'équipe avant tout engagement.
''','A03. Classeur Pilotage. Taux et charges du cas fictif.',action='Pointer successivement référence, prévision, plafond et marge.',transition='La marge financière doit être lue avec la disponibilité de chaque rôle.')

add('Charge et capacité par rôle',1,'C3.2.1, simulation pédagogique','table',dict(rows=[['Rôle','Prévision','Capacité','Marge'],['Chef de projet','29 h','30 h','1 h'],['Développeur','64 h','72 h','8 h'],['Testeur UX','24 h','30 h','6 h']],widths=[480,224,224,224],takeaway='La capacité disponible dépend des compétences et des responsabilités'),'''
La charge totale reste inférieure à la capacité globale, mais cette somme peut masquer une tension sur un rôle. Le chef de projet est à vingt-neuf heures pour trente disponibles. Il ne conserve qu'une heure de marge. Le développeur dispose de huit heures et QA de six heures.

Ces heures ne sont pas librement interchangeables. Transférer une tâche suppose de vérifier la compétence de la personne et l'effet sur la qualité. Le développeur doit pouvoir corriger son travail, tandis que QA conserve un regard sur sa validation. Je protège donc le temps d'arbitrage du chef de projet et je limite les demandes supplémentaires. Le suivi par rôle rend cette décision plus précise qu'un simple total d'heures disponibles.
''','A03. Classeur Pilotage, charges à terminaison.',transition='Je relie ensuite ces points de vigilance à un registre des risques.')

add('Risques et réponses prévues',1,'C3.2.1, extrait du registre fictif','table',dict(rows=[['Risque','Déclencheur','Réponse'],['Démonstration indisponible','Sonde de santé en échec','Vérifier l’environnement et préparer le secours'],['Surcharge du chef de projet','Charge au-delà de 90 %','Limiter les demandes et répartir la préparation'],['Demande nouvelle','Capacité ou budget dépassé','Arbitrer avant engagement']],widths=[330,350,472]),'''
Le registre complet contient cinq risques. Je présente ici ceux qui influencent directement la restitution. Le premier concerne la disponibilité de la démonstration. La réponse consiste à vérifier l'environnement avant l'oral et à conserver des captures datées.

Le deuxième concerne la surcharge du chef de projet. Le seuil de quatre-vingt-dix pour cent déclenche une revue de la charge. Le troisième concerne une demande nouvelle qui dépasse la capacité ou le budget. Elle impose un arbitrage avant engagement.

Chaque risque possède un responsable, un déclencheur et une réponse. Le score de probabilité et d'impact aide à prioriser, mais la décision doit aussi examiner la conséquence concrète pour le projet. Une couleur seule ne dit pas ce que l'équipe doit faire.
''','A03, registre des cinq risques.',transition='Je vais illustrer cette logique de décision avec un changement réel du projet.')

add('Arbitrage technique sur la recette',2,'C3.2.2, fait Git et analyse rétrospective','table',dict(rows=[['Option','Intérêt','Limite'],['Ajouter des retries','Absorber certains délais','Risque de masquer la cause'],['Préchauffer le serveur dev','Limiter les compilations','Dépend des routes préparées'],['Tester le standalone','Se rapprocher du livrable','Construction préalable']],widths=[340,430,382],takeaway='Commit 689e59d du 20 juillet 2026 : recette CI sur le build standalone'),'''
Un arbitrage réel du dépôt concerne la recette navigateur. Le dossier historique de juillet rapporte un échec pendant l'utilisation du serveur de développement, avec des compilations à froid au cours des scénarios. Cela créait un écart entre l'environnement de recette et l'artefact destiné à être livré.

J'ai comparé rétrospectivement trois options pour expliquer le raisonnement. La première consiste à augmenter les délais ou à ajouter des tentatives. Elle est rapide à mettre en place, mais peut masquer la cause. La deuxième consiste à préchauffer le serveur de développement. Elle réduit certaines compilations pendant la recette, à condition d'avoir préparé toutes les routes utiles. La troisième consiste à tester le serveur standalone issu du build. Elle ajoute un temps de construction, mais rapproche la recette du livrable.

Le commit visible dans Git retient cette troisième option et ajuste aussi l'utilisation de localhost pour les sessions. Le dossier historique rapporte une exécution réussie après consolidation. Je précise la portée de la preuve : la modification est vérifiable dans Git. Les résultats distants sont rapportés par le dossier de l'époque. La comparaison présentée ici est une analyse rétrospective, pas un procès-verbal rédigé le jour de la décision.

Ce cas montre l'intérêt de rechercher la cause avant de modifier un seuil. Une recette utile doit rester reproductible et suffisamment proche des conditions de livraison pour éclairer une décision.
''','A04. git show 689e59d. Cahier de recettes Bloc 2, consolidation standalone.',action='Comparer les trois options et pointer le choix visible dans Git.',transition='Un arbitrage peut aussi porter sur le périmètre plutôt que sur un choix technique.')

add('Arbitrage d’une demande supplémentaire',1.5,'C3.2.2, demande fictive à J10','table',dict(rows=[['Effet de la demande','Avant','Après ajout'],['Coût à terminaison','4 465 €','5 005 €'],['Charge du développeur','64 h','76 h'],['Capacité du développeur','72 h','72 h']],widths=[530,311,311],takeaway='Décision du cas : reporter le lot et conserver les critères de recette',detail='12 h DEV + 4 h QA = 540 €. Le plafond serait dépassé de 308 €.'),'''
À J10, le client fictif demande un lot supplémentaire de contributions aux topos. Il s'agit d'une demande pédagogique, distincte de l'état actuel du code. Son estimation est de douze heures de développement et de quatre heures de recette, soit cinq cent quarante euros.

L'ajout porterait la prévision à cinq mille cinq euros, au-dessus du plafond de trois cent huit euros. Il porterait également la charge du développeur à soixante-seize heures pour soixante-douze disponibles. La difficulté concerne donc à la fois le budget et la capacité.

Je compare l'ajout, le retrait d'une partie de la recette et le report. Réduire la recette ferait perdre des contrôles sur le périmètre déjà engagé. Le scénario retient le report du lot supplémentaire. Le client fictif valide cette décision dans le compte rendu J10. Les critères restent dans le backlog pour une estimation ultérieure. Cette réponse explique ce qui peut être livré, à quel moment, et pourquoi la demande ne peut pas simplement être ajoutée sans conséquence.
''','A04 et CR02 dans A07. Simulation explicitement distincte du code actuel.',action='Faire lire les deux dépassements, puis exposer le report.',transition='Pour appliquer cette décision, je dois aussi la faire comprendre à l’équipe.')

add('Management et désaccord DEV / QA',1.5,'C3.3.1, situation managériale fictive','columns',dict(items=[['Situation','DEV souhaite ajouter une fonction.\nQA attend un parcours stable pour la recette.'],['Conduite retenue','Faire expliciter les impacts.\nDécider sur la charge et les critères.\nConsigner la décision et suivre son effet.']]),'''
Dans la situation fictive, le développeur souhaite avancer sur une nouvelle fonction alors que QA attend une version stable pour terminer la recette. Le désaccord exprime deux besoins légitimes : faire évoluer le produit et sécuriser ce qui doit être présenté.

Je commence par demander les faits, les impacts et l'aide nécessaire, sans attribuer une faute personnelle. J'utilise une posture participative pour comparer les estimations. J'adopte ensuite une posture persuasive pour expliquer les conséquences du report au client. Je reste directif sur les critères critiques de livraison, par exemple le contrôle de la capacité d'un événement.

La délégation conserve un résultat attendu et un point de contrôle. DEV traite les corrections et QA choisit les cas permettant de les vérifier. La décision rejoint le compte rendu et les tâches concernées.

Avec du recul, une réponse uniquement directive aurait pu faire taire le désaccord sans traiter la surcharge. À l'inverse, une discussion sans échéance aurait retardé le lot. Je retiens donc un échange court, préparé avec des faits, puis une décision explicite dont je vérifie l'application.
''','A05, situation analysée et analyse critique.',action='Expliquer ce que chaque rôle cherche à protéger, puis la limite de chaque posture.',transition='Cette organisation doit permettre à chacun de comprendre et de contribuer.')

add('Communication et adaptations',1.5,'C3.3.1, dispositions du scénario','columns',dict(items=[['Décisions accessibles','Ordre du jour en amont.\nSynthèse écrite et actions datées.\nLiens regroupés dans la tâche.'],['Modalités adaptées','Supports structurés et sous-titrage.\nPauses et temps de pratique adaptés.\nFuseaux explicites et travail asynchrone.']]),'''
Les outils doivent aider l'équipe à retrouver une décision et à agir. Dans le cas présenté, Linear porte les tâches et les blocages. Git conserve les modifications. Les documents partagés regroupent les décisions et les comptes rendus. La visioconférence sert lorsqu'un échange direct est nécessaire.

J'envoie l'ordre du jour avant la réunion et je diffuse une synthèse qui précise l'action, son responsable et son échéance. Une personne absente doit pouvoir comprendre la décision sans reconstituer toute une conversation.

Les adaptations se discutent avec la personne concernée. Elles peuvent inclure un support structuré, du sous-titrage, des pauses ou davantage de temps pour un exercice. Je n'attribue pas de situation de handicap à une personne sans information. Le scénario prévoit une organisation adaptable.

Dans un contexte international, j'indique le fuseau des rendez-vous, j'explique les acronymes et je permets une préparation asynchrone. Je vérifie la compréhension par reformulation. L'absence de question ou le silence en réunion ne suffisent pas à établir que chacun a compris la priorité ou le résultat attendu.
''','A02 et A05, inclusion et contexte international fictif.',action='Donner un exemple d’action datée puis un exemple d’adaptation convenue.',transition='La répartition du travail suppose également de connaître les compétences disponibles.')

add('Compétences actuelles et attendues',1,'C3.3.2, niveaux hypothétiques du cas','table',dict(rows=[['Rôle','Besoin du projet','Niveau du cas','Cible'],['CP','Suivi des écarts','1','2'],['DEV','Transactions concurrentes','1','2'],['QA','Recette navigateur et clavier','1','2']],widths=[140,700,172,140],takeaway='Échelle : 0 non abordé, 1 accompagné, 2 autonome, 3 capable d’accompagner'),'''
J'évalue les besoins avant de choisir une formation. La grille utilise quatre niveaux : non abordé, réalisé avec accompagnement, autonome sur un cas courant, puis capable de traiter des cas complexes et d'accompagner une autre personne.

Les niveaux affichés sont hypothétiques. Ils ne constituent pas une évaluation réelle de collaborateurs. Le chef de projet doit progresser sur le suivi des écarts. Le développeur doit maîtriser les inscriptions concurrentes. QA doit pouvoir rejouer la recette et contrôler le parcours au clavier.

La cible est l'autonomie sur un cas courant. Elle reste reliée à un résultat utile pour le lot. Cette grille évite de proposer une formation générale sans pouvoir expliquer quel risque ou quelle difficulté elle doit résoudre.
''','A06, grille de compétences du scénario.',transition='Je transforme ces écarts en actions courtes, avec une vérification du résultat.')

add('Plan de formation et vérification',1.5,'C3.3.2, actions fictives intégrées au lot','table',dict(rows=[['Public','Charge','Exercice de validation'],['Chef de projet','1 h','Modifier le reste à faire et expliquer l’écart'],['Développeur','2 h','Expliquer la protection de la dernière place'],['QA','3 h','Rejouer un scénario et contrôler le clavier']],widths=[330,150,672],takeaway='6 h incluses dans les tâches. 60 € de ressources complémentaires fictives.'),'''
Le plan prévoit une heure pour la lecture du tableau de bord par le chef de projet, deux heures sur la concurrence pour le développeur et trois heures sur la recette et le clavier pour QA. Ces six heures sont déjà incluses dans les tâches du planning. Les ajouter à nouveau créerait un double comptage de la charge.

Je définis une preuve de réussite pour chaque action. Le chef de projet modifie le reste à faire et explique le nouvel écart. Le développeur explique pourquoi une seule inscription peut être acceptée sur une dernière place. QA exécute un scénario de manière autonome et décrit un contrôle au clavier.

La consultation d'un support ne suffit pas à démontrer l'acquisition. Je prévois une pratique, puis un second cas réalisé avec davantage d'autonomie. Si l'écart persiste, je réévalue l'accompagnement et sa charge.

Le cas ne retient pas de recrutement permanent. Si une compétence critique reste indisponible, la demande de renfort aux RH doit préciser la mission, la durée, le budget et le résultat attendu. Cette fiche reste une proposition, sans envoi ni recrutement réellement effectué.
''','A06, plan de développement et fiche RH fictive.',action='Relier une heure de formation à un résultat observable, puis expliquer le non-double-comptage.',transition='Les résultats du lot doivent enfin être partagés et validés avec le client.')

add('Suivi client et points de validation',1.5,'C3.4.1, comptes rendus simulés','table',dict(rows=[['Point','Décision attendue','Trace'],['J3','Périmètre et critères','CR01'],['J10','Écarts et report de la demande','CR02'],['J15','Acceptation et réserves','CR03']],widths=[170,820,162],takeaway='Chaque action possède un responsable, une échéance et un prochain point'),'''
Le suivi client repose sur trois points dans le scénario. Le premier valide le périmètre et les critères attendus. Le deuxième présente l'avancement, les écarts et la décision sur la demande supplémentaire. Le troisième porte sur le parcours démontré et ses réserves.

Les trois comptes rendus sont fictifs et aucun accord réel n'est attesté. Leur structure montre toutefois comment préparer un échange utile : ce qui a été présenté, ce qui reste à faire, la difficulté rencontrée et la décision attendue. Une action comprend un responsable et une échéance. Le prochain point de suivi est identifié.

Par exemple, le compte rendu J10 reprend la prévision de quatre mille quatre cent soixante-cinq euros et le report du lot supplémentaire. Il conserve le lien entre une donnée de pilotage et une décision de périmètre.

La validation se fait par critère, avec les statuts accepté, accepté avec réserve ou refusé. Une réserve devient une action suivie. Ce dispositif permet de rechercher une confirmation explicite, au lieu de déduire l'acceptation du seul fait que le logiciel a été montré.
''','A07, CR01 à CR03. Référentiel p. 13-14.',action='Décrire le compte rendu J10 : écart, décision, responsable et échéance.',transition='La validation du périmètre et la satisfaction méritent chacune une mesure explicite.')

add('Mesure de satisfaction proposée',1,'C3.4.1, aucun résultat client réel disponible','table',dict(rows=[['Indicateur','Mesure prévue'],['Critères acceptés','Acceptés / évalués'],['Parcours sans aide','Terminés sans aide / tentés'],['Utilité perçue','Note de 1 à 5 et nombre de répondants'],['Blocages critiques','Nombre et description des obstacles']],widths=[400,752],takeaway='Satisfaction réelle : non mesurée à ce stade'),'''
Je propose quatre indicateurs complémentaires : la part des critères acceptés, la réussite des parcours sans aide, une note d'utilité et les blocages critiques signalés. Chaque résultat doit être accompagné de la date et du nombre de participants.

À ce stade, aucun retour de client réel n'est disponible dans les éléments du dossier. La mesure reste donc non réalisée. Elle ne vaut ni zéro ni cent pour cent. Les résultats des tests techniques ne remplacent pas une appréciation du besoin par un utilisateur.

Pendant une session pilote, je demanderais la tâche recherchée, le résultat obtenu et l'obstacle rencontré. Une réserve ou une difficulté doit ensuite rejoindre le suivi du projet avec une action identifiable, puis être vérifiée lors d'un nouveau passage.
''','A07, indicateurs et questionnaire proposés.',transition='Je vais maintenant montrer le parcours sur lequel portent ces critères.')

add('Démonstration du parcours',.5,'C3.4.2, séquence de six minutes','demo_intro',dict(items=[['Session grimpeur','Profil, partenaire et inscription'],['Session club','Événement, participants et droits']],takeaway='Critères : état compréhensible, capacité respectée et participant visible'),'''
Je passe maintenant au logiciel. La démonstration utilise des comptes locaux et des données de test. Je vais d'abord suivre le point de vue du grimpeur, puis celui du club. Les critères que je garde en tête sont la compréhension des états, la cohérence de l'inscription et la visibilité du participant pour le bon rôle.
''','A08 et preuves/verification.json.',action='Ouvrir les deux sessions déjà connectées. Lancer le chronomètre de démonstration.',transition='Je commence avec le compte grimpeur.',demo=True)

add('Parcours grimpeur',3,'C3.4.2, application locale et données de test','photo',dict(image='docs/rncp/bloc-03/preuves/captures/matching-2026-09-15.png',items=[['Profil et recherche','Vérifier le niveau et les disponibilités.'],['Demande et sortie','Lire l’état, consulter l’événement et s’inscrire.']]),'''
Je suis connecté en tant que grimpeur. Le profil donne les informations utiles pour ma pratique. Dans la recherche de partenaires, les filtres permettent de réduire les résultats. Je montre un filtre et j'explique ce qui change dans la liste. L'état de la demande permet ensuite de savoir si un échange est déjà engagé.

Je rejoins maintenant la page des événements. Je lis la date, le lieu et la capacité avant de m'inscrire. Je vérifie que l'interface confirme l'inscription et que l'état affiché reste cohérent. Si le compte était déjà inscrit, je l'annonce et j'utilise l'événement préparé pour la répétition.

Je décris le résultat du point de vue de l'utilisateur : il sait quelle sortie il rejoint et peut retrouver son inscription. Je vais vérifier ce même résultat depuis le rôle club.
''','Capture réelle du 15 septembre 2026. A08, recette navigateur datée.',action='0:00–0:40 : profil. 0:40–1:35 : filtre et demande. 1:35–2:40 : événement et inscription. 2:40–3:00 : confirmation. Laisser le navigateur affiché pendant les manipulations. La capture sert de secours.',transition='Je bascule sur la session du club organisateur.',demo=True)

add('Parcours club et validation',2.5,'C3.4.2, application locale et données de test','photo',dict(image='docs/rncp/bloc-03/preuves/captures/evenements-2026-09-15.png',items=[['Organisation','Retrouver l’événement et les participants.'],['Contrôles','Vérifier les droits et expliciter les réserves.']]),'''
Je suis maintenant connecté avec le rôle club. Je retrouve l'événement et je consulte les participants. L'inscription effectuée côté grimpeur doit apparaître de façon cohérente. Les commandes de gestion correspondent au rôle de l'organisateur.

Je montre aussi un passage au clavier sur les commandes utiles. Les règles de capacité et les refus d'accès disposent de scénarios de recette identifiés. Si je ne reproduis pas un contrôle en direct, je précise la preuve de test utilisée et sa date.

Je termine en reprenant les critères annoncés : un partenaire recherché, un état de demande compréhensible, une inscription cohérente et un participant visible pour le club. Je distingue les critères vérifiés de ceux qui restent hors du parcours. La validation attendue porte sur ce périmètre explicite, avec ses réserves éventuelles.
''','Capture réelle du 15 septembre 2026. A08 et preuves/verification.json.',action='0:00–1:15 : événement, commandes et participants. 1:15–2:00 : clavier et portée des preuves de capacité. 2:00–2:30 : critères et réserves. En cas d’incident, annoncer le contrôle non revalidé et utiliser la capture datée.',transition='Je reviens au bilan du pilotage.',demo=True)

add('Bilan du pilotage',1,'Bilan et ouverture des quinze minutes de questions','columns',dict(items=[['Résultats présentés','Parcours logiciel démontré.\nDécisions reliées aux coûts et à la capacité.\nPreuves classées par compétence.'],['Limites explicites','Management et budget du cas fictif.\nSatisfaction réelle non mesurée.\nContributions réelles à préciser.']]),'''
Cette présentation relie le besoin utilisateur à l'organisation du travail, puis aux décisions et à la validation. Le planning rend les dépendances visibles. Le tableau de bord permet d'anticiper les écarts. L'arbitrage tient compte de la capacité et des critères déjà engagés.

Je distingue les preuves techniques observables du cas pédagogique utilisé pour le management, le budget et les échanges client. La satisfaction réelle reste à mesurer et les contributions personnelles doivent correspondre aux faits disponibles.

L'amélioration prioritaire serait de recueillir des retours utilisateurs structurés et d'alimenter le suivi avec ces résultats. Je peux maintenant revenir sur une hypothèse du classeur, le choix d'un arbitrage ou l'un des critères de démonstration. Merci pour votre attention.
''','MATRICE_PREUVES, VERIFICATION et A01 à A08.',action='Terminer à 30:00. Les annexes restent disponibles uniquement pour les questions.',transition='Je suis prêt à répondre à vos questions.')

add('Annexe : correspondance des preuves',0,'Annexe pour les questions','table',dict(rows=[['Compétences','Pièces de référence'],['C.3.1 et C3.2.1','A01 à A03 et classeur'],['C3.2.2','A04 et commit 689e59d'],['C3.3.1 et C3.3.2','A05 et A06'],['C3.4.1 et C3.4.2','A07, A08 et vérifications']],widths=[460,692]),'Cette annexe sert à retrouver rapidement une pièce. La matrice du dossier détaille la nature de chaque preuve et les limites des situations fictives. La mention Acquis relève du jury.','MATRICE_PREUVES. Référentiel p. 11-14 et grille BC03.')
add('Annexe : calcul de la prévision',0,'Annexe, données fictives en euros','table',dict(rows=[['Poste','Calcul','Montant'],['Chef de projet','29 h × 45 €','1 305 €'],['Développement','64 h × 35 €','2 240 €'],['Recette','24 h × 30 €','720 €'],['Frais prévisionnels','Infrastructure et formation','200 €'],['Total à terminaison','Travail et frais','4 465 €']],widths=[370,560,222]),'Les charges incluent les temps de formation. Les quatre postes totalisent 4 465 euros. Les taux sont fictifs et le montant est une valorisation économique du cas, sans facture réelle correspondante.','A03 et classeur Pilotage.')
add('Annexe : sources et portée des contrôles',0,'Annexe documentaire','columns',dict(items=[['Cadre officiel','Référentiel RNCP39583, pages 11 à 14.\nModalités 2025–2026, pages 6, 8 et 11.\nGrille BC03, page unique.'],['Vérifications du 14 septembre','389 tests unitaires et 6 scénarios navigateur.\nRecette locale sur next dev et MariaDB dédiée.\nAucune validation par un client réel.']]),'Le règlement spécial n’a pas été fourni. Les contrôles datés ne prouvent pas le fonctionnement d’une autre version. La recette locale et le cas standalone historique correspondent à deux contextes explicitement séparés.','Trois PDF fournis par le candidat. VERIFICATION et preuves/verification.json.')

from bloc_context import align
align(slides)
from linear_context import align as align_linear
align_linear(slides)
from inclusion_context import align as align_inclusion
align_inclusion(slides)
from competence_context import align as align_competences
align_competences(slides)

assert len(slides)==25
assert sum(s['minutes'] for s in slides)==30
assert sum(s['minutes'] for s in slides if s['demo'])==6
document={'title':'Spity, soutenance Bloc 3 en trente minutes','mainSlideCount':22,'totalMinutes':30,'demoMinutes':6,'timingAssumption':'Environ 120 mots par minute hors manipulations, avec pauses et lecture des chiffres. À ajuster après une répétition chronométrée.','slides':slides}
target=ROOT/'docs/rncp/bloc-03/donnees/diaporama-30min.json'
target.write_text(json.dumps(document,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
for s in slides[:22]:
    words=len(s['script'].split())
    print(f"{s['number']:02d} {s['minutes']:3.1f} min {words:3d} mots {words/s['minutes']:5.1f} mots/min {'DEMO' if s['demo'] else ''}")
print('Total hors démonstration :',sum(len(s['script'].split()) for s in slides if s['minutes'] and not s['demo']),'mots pour 24 minutes.')
