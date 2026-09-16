# Mon fil conducteur — Spity v19

Document personnel. Le texte ci-dessous reprend ce que je peux dire à l’oral, avec les titres du support. Les repères de manipulation restent dans GUIDE_ORAL.md.

## 1. Une année pour construire Spity.

Bonjour, je vais vous présenter Spity, le projet que j’ai développé seul sur un an autour de l’escalade. Mon objectif est de faciliter la recherche de partenaires et l’organisation de sorties.

Je vais vous montrer comment j’organise le travail, comment je suis l’avancement et comment je prends mes décisions. Je m’appuie sur le logiciel et sur les traces de son développement. Pour les situations de collaboration et de suivi client, j’utilise aussi des exemples simulés, que je distingue du projet réel.

## 2. Sommaire

Je commence par vous présenter Spity et les besoins auxquels il répond. Ensuite, je vous explique ma méthode d’organisation, le suivi du projet et un arbitrage concret sur la navigation.

Je poursuis avec la collaboration, le développement des compétences et le suivi client. Pour terminer, je vous montre le logiciel à travers un parcours de grimpeur et un parcours de club, puis nous revenons sur les critères de validation.

## 3. Relier les grimpeurs. Simplifier les sorties.

Avec Spity, je pars de deux besoins assez simples. Du côté du grimpeur, je veux permettre de trouver un partenaire qui pratique la même discipline, avec un niveau adapté. Du côté du club, je veux faciliter l’organisation d’une sortie et le suivi des participants.

J’ai donc construit le produit autour des profils, de la recherche de partenaires, des événements et des lieux d’escalade. Ici, vous voyez le répertoire des lieux sur ma base de démonstration.

Le parcours que je vais vous présenter suit cette logique : je trouve un partenaire, je consulte une sortie, puis je m’inscris. Cela me permet de relier chaque fonctionnalité à un besoin concret.

## 4. Une méthode adaptée au travail solo

Comme je travaille seul, j’ai besoin d’une organisation qui reste simple à utiliser. Je m’appuie sur Linear pour retrouver mes tâches, leurs priorités et leur état. Le fonctionnement que je retiens est inspiré de Kanban : je rends le travail visible et je garde une vue sur ce qui reste à faire.

Le tableau de tâches ne suffit pas pour visualiser toute l’année. Je le complète donc ici par un rétroplanning reconstruit pour la mise en situation. Il me permet de montrer les dépendances et les points de validation.

Enfin, Git conserve les versions et la CI exécute les contrôles automatiques. Dans le fonctionnement proposé, je prévois une revue hebdomadaire pour actualiser le reste à faire et les risques.

## 5. Planifier les travaux sur une année

J’ai repris les neuf lots de mon cadrage et leurs charges estimées, qui représentent au total 82 jours-personne. Un jour-personne correspond à une journée de travail pour une personne : c’est une charge, alors que l’année correspond à la durée du projet.

Pour ce planning, j’ai réparti les lots sur douze mois relatifs. C’est une reconstruction pédagogique : les dates réellement enregistrées dans Git sont présentées séparément.

Je commence par l’étude et la mesure du besoin, puis la conception. L’authentification et les profils servent de base aux autres parcours. Un événement doit être disponible avant que je puisse vérifier une inscription. Je garde aussi des contrôles pendant la réalisation, puis une phase de recette avant la restitution.

Mes points de vigilance sont surtout les dépendances entre les fonctions, ma disponibilité et la stabilité de la version à présenter.

## 6. Affecter les missions et prévoir les moyens

J’ai développé Spity seul : dans le projet réel, je prends en charge le cadrage, la réalisation et la livraison. Pour expliquer comment je répartirais les missions lors d’une recette avec un intervenant, j’ai préparé cette mise en situation.

Je confierais l’exécution des scénarios à un testeur ponctuel, tout en restant responsable du livrable. Le représentant du club déciderait de l’acceptation dans cet exemple. La lettre R indique qui réalise, et la lettre A qui décide.

J’ai choisi un persona de testeur malentendant. Je lui donnerais des consignes écrites, des sous-titres vérifiés et la possibilité de faire un retour par écrit. J’adapte les échanges à ses besoins, tout en affectant la mission selon ses compétences.

Pour les moyens, je m’appuie sur mon environnement de développement, la base de données, Docker et le serveur. Les 44 250 euros restent l’estimation initiale du cadrage.

## 7. L’avancement réel des fonctionnalités

Pour faire le point sur mon avancement, j’ai rapproché les tâches de mon backlog des fonctionnalités présentes dans le site. L’inscription et la connexion sont déjà réalisées, pour les grimpeurs comme pour les clubs. Les améliorations restantes sur les sessions concernent leur renouvellement et la rotation des jetons.

J’ai aussi réalisé les profils avec avatar, la publication avec image, les likes et les commentaires simples. La carte affiche les salles et les falaises. Pour les topos, je peux ajouter une voie, faire un signalement et partager un lien ou un PDF. Les événements permettent de gérer les inscriptions et la capacité.

Je garde à droite les suites à développer : modifier ou supprimer une publication, compléter les fonctions des clubs, ajouter les votes sur les topos et enrichir le fil social. Ce bilan me permet de prioriser ce qui manque encore, sans compter une fonction déjà disponible comme un travail à recommencer.

## 8. Un tableau de bord pour décider

Pour montrer le suivi des coûts et des délais, je prends maintenant un exemple chiffré simulé au dixième mois du projet.

Dans cet exemple, j’ai 58 jours-personne consommés et 28 jours estimés pour terminer. Ma prévision atteint donc 86 jours, contre 82 au départ. Avec la valorisation de 450 euros par jour et les autres postes du cadrage, j’arrive à 46 050 euros : l’écart est de 1 800 euros.

Je regarde aussi le délai : la livraison prévue à la fin du mois 11 passe à la fin du mois 12. Enfin, je compare la charge à ma capacité. Si je prévois 12 jours de travail alors que je n’en ai que 10 de disponibles, je dois déplacer deux jours de charge ou revoir le périmètre.

Ces chiffres sont les hypothèses du cas. Ils me servent à expliquer comment je détecte un écart et comment je prends une décision.

## 9. Anticiper les points de vigilance

Je veux que mon suivi débouche sur une action. Pour chaque risque, je définis donc un signal et une réponse.

Dans cette mise en situation, si ma charge dépasse ma capacité, je déplace une tâche et je revois le jalon. Si un critère critique échoue, je corrige avant de valider. Si le logiciel devient indisponible pendant une présentation, je décris l’incident et je m’appuie sur les captures datées pour expliquer le parcours.

Pour la séance avec le testeur fictif, je prévois aussi un essai des consignes et des sous-titres. Je vérifie ainsi que les conditions de recette sont adaptées.

À chaque revue proposée, je rapproche ces risques de l’avancement, des coûts et des délais. Je termine avec une action et un responsable identifiés.

## 10. Arbitrer face à une navigation trop lente

Je prends maintenant un problème réel que j’ai rencontré sur Spity : lorsque je cliquais dans la barre de navigation, le passage à la page suivante semblait très lent.

Le diagnostic local a montré que l’initialisation du fond animé occupait le navigateur. J’ai repris les options possibles dans ce tableau pour expliquer l’arbitrage. Garder l’animation conservait le problème observé. L’optimiser ou la différer pouvait être étudié, mais je n’ai pas de mesure permettant d’affirmer le gain de cette option.

Le choix retenu a été de remplacer le fond par un SVG statique et d’ajouter un indicateur d’attente. Je conserve ainsi le motif graphique, en acceptant de perdre le mouvement décoratif.

Le changement a été intégré et livré. Pour vérifier son effet, je m’appuie sur la comparaison avant et après que je vous montre ensuite.

## 11. Mesurer l’effet de la correction

Ici, je compare les mêmes cinq parcours avant et après la correction. Les mesures ont été réalisées localement sur une compilation de production, avec un processeur ralenti quatre fois et une latence réseau simulée de 100 millisecondes.

La médiane passe de 10,22 secondes à 0,748 seconde. L’amélioration est nette dans ce protocole : le navigateur n’a plus à effectuer le calcul décoratif au changement de page.

Je garde cependant la portée de la mesure : il y a un passage par parcours, dans un environnement local contrôlé. Je ne présente donc pas ces chiffres comme les temps de tous les utilisateurs en production. Ils me permettent de vérifier l’effet de la correction dans des conditions comparables.

## 12. Adapter la posture à une situation précise

Pour la partie management, je m’appuie sur une situation simulée de recette avec un testeur ponctuel. Dans cet exemple, je souhaite enrichir le décor, alors que le testeur me signale des blocages dans les parcours.

Je commencerais par l’écouter et lui demander des faits précis : c’est la posture participative. Ensuite, j’expliquerais pourquoi je privilégie un parcours utilisable plutôt qu’un enrichissement graphique : c’est la posture persuasive.

Je fixerais aussi une limite claire : je ne valide pas tant qu’un critère critique reste en échec. C’est la posture directive. Enfin, je lui confierais la recette avec un résultat attendu et un point de contrôle, dans une posture délégative.

Avec du recul, décider trop vite de mon côté pourrait me faire perdre une alerte utile. Je retiens donc une séquence simple : écouter, comparer les impacts, décider et écrire la prochaine action.

## 13. Organiser une collaboration accessible

Dans la même simulation, je répartis la séance selon les missions de chacun. Je prévois quatre heures pour mon travail et quatre heures pour celui du testeur, avec cinq heures disponibles de chaque côté. Cela laisse une heure de marge à chacun.

Pour le persona malentendant, je prépare les consignes par écrit, je vérifie les sous-titres et j’organise une prise de parole à la fois. Je lui demande de reformuler la consigne pour vérifier que nous nous sommes compris.

Si nous travaillons à distance, je précise les fuseaux dans l’invitation et je prévois aussi un retour asynchrone. Un glossaire partagé en français et en anglais aide à éviter les ambiguïtés.

Enfin, chaque outil a un objectif : Linear pour les actions, Git pour la version et le dossier partagé pour les critères et les preuves. Je termine l’échange avec une action, un responsable et un retour attendu.

## 14. Évaluer les compétences utiles au projet

Pour choisir une formation, je commence par regarder l’écart entre le niveau actuel et le niveau nécessaire. Cette grille appartient à la mise en situation : les niveaux sont des hypothèses d’exercice.

J’utilise une échelle de zéro à trois. Au niveau un, la personne réalise la tâche avec de l’aide. Au niveau deux, elle est autonome. Au niveau trois, elle sait aussi traiter les cas complexes.

Dans l’exemple, je me place au niveau un sur le suivi, avec une cible au niveau deux : je dois pouvoir expliquer seul les écarts. Le développement est supposé autonome, donc je ne le retiens pas comme priorité de formation.

Pour le testeur fictif, je vise une recette reproductible et une vérification au clavier réalisées sans aide. Ce sont ces besoins techniques qui orientent le plan, indépendamment du handicap.

## 15. Prévoir une progression vérifiable

À partir de cette grille, je propose deux actions dans la mise en situation. Pour le suivi, je prévois un atelier d’une heure avant la revue du mois 10, afin de recalculer les écarts et de les expliquer sans aide.

Pour le testeur fictif, je propose deux heures de pratique sur la recette et le clavier avant le mois 11. Je prépare des consignes écrites et un support sous-titré. J’adapte les pauses et le temps nécessaire à ses besoins.

Ces formations sont prévues avant la séance de recette : je ne compte pas leurs heures dans la charge de cette séance. Pour vérifier leur efficacité, je regarde si la tâche peut être réalisée de façon autonome.

Si un écart critique persiste, je prévois d’abord un accompagnement adapté, puis j’étudie un renfort ponctuel. J’ai détaillé ce besoin conditionnel dans la fiche en annexe.

## 16. Un compte rendu qui aide à décider

Pour le suivi client, j’ai préparé un compte rendu simulé avec un représentant de club. Je l’organise en trois parties : le constat, la décision et les actions.

Au mois 10, j’annonce l’écart du cas : 1 800 euros supplémentaires et un mois de décalage. Je le relie au besoin exprimé dans l’exemple : garder un parcours fluide et utilisable.

La décision proposée est de conserver le fond statique et de maintenir les critères de recette. De mon côté, je révise le suivi. Le testeur prépare la recette et le représentant du club revoit les critères au prochain point.

Cette structure donne à mon interlocuteur les informations utiles pour décider. Le compte rendu est simulé ; il illustre le suivi et ne constitue pas l’origine historique de la correction du site.

## 17. Prévoir les points de validation

Je prévois plusieurs points de validation dans mon calendrier simulé pour vérifier le résultat au fur et à mesure.

Au mois 3, je fais confirmer le besoin et les critères. Au mois 10, je présente les écarts et les options pour décider de la suite. Au mois 11, je rapproche les résultats de recette des critères attendus. Au mois 12, je présente la dernière version disponible.

Si une réserve apparaît, je la transforme en action avec un responsable et une échéance à convenir. L’objectif est de garder un lien entre le besoin de départ, ce qui est développé et ce qui peut être accepté.

## 18. Mesurer le retour pour agir

Pour recueillir un retour utile, je propose quatre indicateurs. Je regarde si le parcours est réalisé sans aide, si le service est jugé utile, si les critères critiques sont acceptés et si des blocages restent ouverts.

Les seuils affichés sont les objectifs proposés pour la mise en situation. Je n’ai pas de résultats réels de satisfaction à présenter. Lors d’une séance, je noterais aussi le nombre de participants pour donner un sens aux pourcentages et à la moyenne.

Si la réussite sans aide est faible, je cherche l’étape qui pose problème. Si l’utilité est mal évaluée, je reviens au besoin. Et si un blocage critique reste ouvert, je corrige avant de demander l’acceptation.

Je complète ainsi les tests techniques par un regard sur l’utilisation du produit.

## 19. Les critères de validation

Avant de vous montrer le logiciel, je précise ce que nous allons vérifier. Pour les partenaires, je regarde la cohérence des filtres et la lisibilité de l’état d’une demande.

Pour les événements, je vérifie l’inscription et les places disponibles. Avec la session club, je retrouve les participants et les commandes liées à ce rôle. Je montre aussi l’utilisation des commandes au clavier.

J’utilise une base de démonstration avec des comptes de test. Le résultat attendu reste concret : un grimpeur comprend ce qu’il peut faire, et un club retrouve les informations nécessaires pour organiser sa sortie.

Ces critères me servent ensuite à faire le bilan de la démonstration et à identifier les éventuelles réserves.

## 20. Passer du suivi à l’usage.

Je passe maintenant au logiciel. Je commence avec une session grimpeur pour vous montrer la recherche de partenaires. Ensuite, je passe sur un événement, puis sur la session club pour retrouver les participants.

Je garde les mêmes critères tout au long du parcours : des filtres cohérents, un état compréhensible et des actions adaptées au rôle de l’utilisateur.

## 21. Trouver un partenaire

Je commence par le profil du grimpeur. Ici, je retrouve sa pratique et son niveau : ce sont les informations qui donnent du contexte à la recherche.

Je vais maintenant dans les partenaires. Je sélectionne une discipline et je regarde comment la liste s’adapte. Je peux consulter un profil pour vérifier s’il correspond à la sortie que je veux préparer.

Je passe ensuite à la demande de partenariat. Ce que je veux rendre clair pour l’utilisateur, c’est l’état de sa demande : il doit savoir où il en est avant de poursuivre. Si une demande existe déjà, je présente l’état affiché ; je n’ai pas besoin d’en créer une deuxième pour montrer ce fonctionnement.

Le parcours peut ensuite se poursuivre vers les événements pour préparer une sortie.

## 22. S’inscrire et retrouver les participants

Je passe maintenant aux événements. Sur la fiche, je retrouve les informations de la sortie et les places disponibles. Je peux vérifier l’action proposée pour l’inscription et l’état affiché pour ce compte.

Si le compte est déjà inscrit, je peux le voir directement. Sinon, je peux effectuer l’inscription et vérifier la confirmation.

Je passe ensuite à la session club. L’objectif est de retrouver les participants et les commandes de gestion adaptées à ce rôle. Le grimpeur et le club n’ont pas les mêmes actions à réaliser.

Je termine avec les commandes au clavier pour montrer le déplacement du focus et leur activation. Je peux maintenant revenir à mes critères et distinguer les résultats observés des points qui resteraient à vérifier.

## 23. Conclure par une décision de validation

Pour terminer, je reviens aux critères que nous avons suivis : les partenaires, l’inscription, les participants et l’utilisation au clavier.

À partir du résultat observé, je peux demander une décision : accepté, accepté avec réserve ou refusé. Si un point reste à corriger, je le décris précisément et je lui associe une action, un responsable et une prochaine vérification.

Ce que je retiens de Spity, c’est l’importance de relier l’organisation du travail à un résultat utilisable. Les tickets me donnent une vue sur le travail, les contrôles me permettent de vérifier les changements et la démonstration me ramène au besoin de l’utilisateur.

Merci pour votre attention. Je suis prêt à répondre à vos questions.

## 24. Synthèse du pilotage

Cette synthèse reprend les éléments sur lesquels je m’appuie pour piloter Spity : une organisation du travail, des indicateurs, des choix argumentés et des critères de validation.

Le projet a été développé en solo. J’ai utilisé les traces réelles pour présenter l’avancement et l’arbitrage de navigation. Les mises en situation m’ont permis d’expliquer comment je préparerais une collaboration, une formation et un suivi client.

Si vous souhaitez revenir sur un point, je peux reprendre le tableau, le calcul ou la décision correspondante.

## 25. Les étapes enregistrées dans Git

Voici les étapes que je peux retrouver dans l’historique du dépôt. Les fondations techniques sont enregistrées en janvier. En mai apparaissent les premiers parcours, avec la connexion, les profils et les lieux.

En juillet, je retrouve le matching, les événements et la recette automatisée. En août, les changements portent davantage sur la maintenance et la supervision. En septembre, le produit s’enrichit avec les médias, l’administration et les contributions aux falaises.

Cette frise situe les versions enregistrées. Elle est distincte du planning annuel reconstruit : une date de commit me dit quand un changement a été enregistré, mais pas combien d’heures il a demandé.

## 26. Préparer un besoin de renfort

Si une compétence de recette restait indisponible après la formation, je préparerais ce besoin de renfort dans le cadre de la mise en situation.

Je commencerais par préciser le déclencheur et la mission : quatre heures de recette sur les parcours et le clavier, avec un résultat reproductible. Je demanderais un profil capable de décrire une anomalie et de communiquer clairement par écrit.

Pour la sélection, je proposerais un exercice accessible sur une base de test. À l’accueil, je fournirais les critères, les accès nécessaires et un point de restitution.

À 45 euros de l’heure, le coût indicatif serait de 180 euros, à arbitrer en plus du budget de base. C’est une fiche conditionnelle : je n’ai pas engagé de recrutement dans mon projet solo.
