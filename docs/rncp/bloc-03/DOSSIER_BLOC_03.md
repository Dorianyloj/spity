# Spity - Coordonner et piloter un projet logiciel

Dorian Joly | Expert en développement logiciel | RNCP39583 | Bloc 3

## 1. Périmètre et nature des preuves

Spity propose des profils de grimpeurs et de clubs, la recherche de partenaires, des événements et un répertoire de lieux d'escalade. Le fil conducteur retenu pour la soutenance est : un grimpeur trouve un partenaire et une sortie, tandis que le club organise l'événement et contrôle ses participants.

Le dépôt apporte des réalisations techniques et un historique vérifiables. Ce dossier y ajoute une mise en situation professionnelle fictive, explicitement autorisée par le référentiel, pour démontrer les méthodes de planification, de management et de suivi client. Une réalisation technique ne prouve pas à elle seule qu'une équipe a été managée ou qu'un client a validé une décision.

Le Bloc 3 reprend le même projet que les autres livrables. Le Bloc 1 en définit le besoin, le commanditaire fictif et l'estimation globale. Le Bloc 2 apporte le prototype F01-F10 et les preuves de réalisation. Le Bloc 4 documente la maintenance, les anomalies et le support. Cette articulation des compétences n'est pas un calendrier : le dossier Bloc 4 du 13 août précède la préparation du Bloc 3 du 14 septembre. Le détail des rapprochements figure dans [la revue inter-blocs](COHERENCE_INTER_BLOCS.md).

| Nature | Utilisation dans ce dossier |
| --- | --- |
| Observé | Fichiers et commits inspectés, commandes effectivement exécutées et résultats datés. |
| Historique documenté | Résultats présents dans les anciens dossiers ; conservés avec leur date, sans les présenter comme une mesure actuelle. |
| Simulation pédagogique | Équipe type, planning J1 à J15, estimations de charge, coûts, formations et réunions du cas de pilotage. |
| À confirmer | Composition réelle de l'équipe, interlocuteurs réels, dates du campus et consignes du règlement spécial. |

Les documents parlent d'un oral individuel de 45 minutes, dont 30 minutes de présentation et 15 minutes d'échange. La démonstration est intégrée à la présentation. Aucun nombre de pages n'est imposé au Bloc 3 dans les trois pièces fournies. Le support et les livrables doivent être déposés sur DigiformaCertif dans le délai du campus. Sources : référentiel p. 11 à 14 ; modalités 2025-2026 p. 6, 8, 10 et 11 ; grille BC03 p. 1.

## 2. Objectifs, acteurs et critères de succès

Le besoin présenté consiste à faciliter l'organisation d'une pratique collective de l'escalade. La démonstration doit montrer un parcours compréhensible pour le client : se connecter, identifier un partenaire compatible, consulter une sortie, s'inscrire et retrouver cette inscription côté club.

Le cas pédagogique reprend le commanditaire du Bloc 1 : le Collectif Altitude Grimpe, association régionale fictive représentée par Claire Martin, présidente fictive, pour une zone pilote Lyon-Grenoble. Il répartit le travail entre un chef de projet jouant également un rôle technique, un développeur fictif et un testeur UX fictif. Cette répartition ne remplace pas les contributions personnelles décrites dans le Bloc 2. Les noms des comptes de démonstration désignent des données de test ; ils ne désignent ni des collaborateurs ni des personnes interrogées.

| Objectif du cas | Critère d'acceptation | Mode de contrôle |
| --- | --- | --- |
| Trouver un partenaire | Les critères de recherche filtrent les résultats ; une demande possède un état visible. | Parcours matching et partenariats. |
| Organiser une sortie | Un club crée ou consulte un événement et accède à ses participants autorisés. | Parcours club. |
| Gérer les inscriptions | La capacité est respectée ; inscription et désinscription sont restituées. | Recette et scénario de démonstration. |
| Rendre le parcours utilisable | Les commandes sont nommées et accessibles au clavier ; les erreurs sont compréhensibles. | Contrôle manuel et tests disponibles. |
| Maîtriser la restitution | Les fonctionnalités montrées correspondent au périmètre accepté et à la version identifiée. | Grille de validation en fin de démonstration. |

La réalisation personnelle exacte et les interactions humaines réelles seront précisées par le candidat. Le dossier ne transforme pas les hypothèses du cas en expérience professionnelle attestée.

## 3. C.3.1 - Méthode et organisation du travail

Pour la mise en situation, je retiens un tableau Kanban dans Linear avec des réunions inspirées de Scrum : planning, daily, review et rétrospective. Le fonctionnement est adapté au lot de quinze jours. Les tâches traversent les états À faire, En cours, À vérifier et Terminé. Une limite de deux tâches de réalisation simultanées rend les blocages visibles et évite de commencer plusieurs fonctions sans terminer leur recette. Le passage à Terminé nécessite les critères d'acceptation, la revue et les vérifications du lot.

Ce choix correspond à un petit effectif et à des priorités qui peuvent évoluer. Les réunions inspirées de Scrum rendent réguliers les échanges sur le travail, les retours client et les améliorations de l'équipe. Le cas conserve ses rôles CP/DEV/QA/CL et ne revendique pas l'application complète de Scrum ni des Sprints réellement documentés. Le cycle en V donnerait une structure stable, mais retarderait les retours sur les parcours. Kanban permet de conserver des livraisons progressives tout en rendant la date de démonstration visible.

Linear a été consulté directement le 14 septembre 2026 : 25 tickets, dont 12 Done, 4 Todo, 1 In Progress, 7 Backlog et 1 Canceled. A09 conserve le relevé et les liens. Le ticket actif SPI-27 concerne les médias et conditionne le parcours de publication SPI-15 puis SPI-18, d'après les descriptions lues. Le classeur de pilotage joint complète ce suivi par les charges, les jalons et les coûts. Git assure la traçabilité des modifications ; il ne remplace pas une mesure du temps passé.

A01 présente d'abord les cinq jalons globaux du Bloc 1 : Socle 16 j-h, Découverte 15, Organisation 17, Communauté 14 et Stabilisation 17. À capacité constante de 5 j-h par semaine, un ordonnancement séquentiel représente 15,8 semaines. Cette projection pédagogique reprend les 79 j-h de C1.4.1, sans inventer un calendrier réalisé. Le diagramme à barres montre la séquence et les dépendances ; Kanban organise le flux quotidien.

Le planning pédagogique couvre quinze jours ouvrés relatifs, J1 à J15, sans leur attribuer des dates de réalisation historiques. Il distingue étude, mesure des besoins, conception de l'organisation, réalisation, recette et restitution. Les dépendances et les jalons sont détaillés dans A01. T07 peut commencer sur les parcours déjà livrés, mais sa clôture dépend aussi de la recette des événements et des corrections T10. La démonstration J15 reste conditionnée à ces deux validations.

Ce lot de préparation et de stabilisation s'appuie sur le logiciel existant. Il ne représente pas le développement complet de Spity, estimé à 79 jours-homme dans la fiche C1.4.1 du Bloc 1. Les jalons J1-J5 de cette fiche sont distincts des jours relatifs J1-J15 du présent exercice.

Les ressources sont trois rôles, une machine de développement, Node.js 22 comme référence projet, MariaDB, un navigateur, Git, Linear et un espace documentaire partagé. Les charges et taux du scénario sont des hypothèses économiques ; ils ne représentent pas des salaires versés ou des dépenses réellement engagées.

## 4. C.3.1 - Responsabilités et accessibilité de l'organisation

La matrice RACI d'A02 affecte un seul responsable de décision par activité. Le développeur réalise les fonctions, QA prépare et exécute la recette, le chef de projet organise et arbitre, le client valide le périmètre et les résultats attendus. Les rôles sont distincts même lorsqu'une personne réelle pourrait en cumuler plusieurs.

Le rôle QA est incarné par Camille, testeuse malentendante entièrement fictive. Elle prépare les critères T02 et réalise la recette T07 selon ses compétences, avec 30 h disponibles pour 24 h prévues à terminaison. Le scénario prévoit de convenir avec elle de consignes écrites, de réunions sous-titrées et d'une synthèse des décisions avec responsable et échéance. A02 précise les responsabilités ; aucune situation de santé n'est attribuée à une personne réelle.

La préparation des aménagements est comprise dans les tâches existantes : 0,5 h CP dans T03.3 et 0,5 h CP dans T08.2. L'outil de visioconférence est supposé déjà fournir un sous-titrage adapté. Ces hypothèses conservent les charges et le budget du lot ; si elles ne suffisent pas, le CP réestime avant engagement. Le cas est explicité dans donnees/inclusion.json et visible sur les diapositives 6, 14 et 16.

Dans un contexte multiculturel ou international simulé, les décisions sont rédigées en français simple et les termes techniques sont expliqués dans un glossaire. CP et Camille sont situés à Paris, DEV travaille depuis Montréal dans le cas. Les invitations indiquent Europe/Paris et America/Toronto ; DEV prépare un avis écrit et retrouve la décision dans CR02. Le glossaire français/anglais et le contrôle par reformulation sont détaillés dans A05. La compréhension est vérifiée par reformulation, et non déduite du silence en réunion.

## 5. C3.2.1 - Tableau de bord et rythme de suivi

Le tableau de bord pédagogique est arrêté à J10. Chaque mise à jour renseigne le consommé, le reste à faire, le statut et la fin prévisionnelle. Le planning J3 fixe l'objectif et les tâches retenues avec la capacité disponible. Le daily de dix minutes permet aux rôles mobilisés d'adapter la prochaine action. Les reviews J10/J15 confrontent le produit aux attentes du client ; la rétrospective J15 retient une amélioration de la collaboration. Deux fois par semaine, CP contrôle aussi les charges et les risques dans le tableau de bord. A05 décrit les participants, durées cibles et traces de chaque réunion.

| Indicateur du cas simulé | Calcul et résultat à J10 | Utilité |
| --- | --- | --- |
| Tâches terminées | 5 / 10 = 50 % | État du flux ; les tâches n'ont pas toutes la même taille. |
| Charge initiale | Somme des charges prévues = 112 h | Référence de comparaison. |
| Charge consommée | Somme des heures consommées = 77 h | Effort déjà mobilisé dans la simulation. |
| Reste à faire | Somme des estimations restantes = 40 h | Effort encore nécessaire. |
| Charge à terminaison | 77 + 40 = 117 h, soit +5 h | Anticiper une dérive avant la clôture. |
| Coût initial hors réserve | Main-d'œuvre 4 090 EUR + frais 180 EUR = 4 270 EUR | Budget économique de référence. |
| Coût prévisionnel final | Main-d'œuvre 4 265 EUR + frais 200 EUR = 4 465 EUR | Écart de +195 EUR, soit +4,6 %. |
| Réserve initiale | 10 % de 4 270 = 427 EUR | Plafond du cas de 4 697 EUR ; marge prévisionnelle de 232 EUR. |

Le délai se lit séparément de la charge : T06 passe de J11 à J12 (+1 jour ouvré) et T07 de J13 à J14 (+1 jour), tandis que la démonstration reste à J15. Ces glissements ne s'additionnent pas comme deux jours de retard du lot. CP atteint 29/30 h, soit 96,7 %, au-dessus du seuil d'alerte de 90 %. Il limite les demandes nouvelles et protège le temps d'arbitrage.

Les heures consommées ne sont pas un pourcentage d'achèvement. Le passage à Terminé repose sur la validation du résultat. Les coûts sont des valorisations de charge en euros, hors taxes conventionnellement dans la simulation ; aucune facture réelle n'est représentée.

La référence globale retenue est la fiche C1.4.2 du Bloc 1 : 79 jours-homme à 420 EUR HT, soit 33 180 EUR, plus 1 480 EUR d'exploitation annuelle et 3 466 EUR de provision, pour un total de 38 126 EUR HT. Les 4 270 EUR du lot B3 ne remplacent pas cette estimation et ne lui sont pas ajoutés. Les périmètres et hypothèses diffèrent ; aucune économie réelle ne peut être déduite de leur comparaison. L'ancien diaporama B1 affiche 82 jours-homme et 44 250 EUR : cette divergence avec les fiches détaillées est identifiée dans la revue inter-blocs et reste à harmoniser avant une remise commune.

Le classeur recalcule les totaux et la charge par rôle après modification des entrées. Les risques sont suivis séparément avec responsable, déclencheur et réponse. Les 112 h initiales sont décomposées en 30 activités dans la feuille Estimations. Planning et Pilotage calculent leurs totaux à partir de ces entrées. A09 explique les causes des 5 h supplémentaires et les tests de sensibilité : 8 h DEV de plus dépassent le budget de 48 EUR ; 2 h CP de plus respectent le budget mais dépassent sa capacité d'une heure. Le relevé réel des 25 tickets Linear reste dans une feuille distincte.

## 6. C3.2.2 - Arbitrage documenté sur la recette

Un cas réel documenté concerne la recette navigateur du 20 juillet 2026. Le dossier Bloc 2 rapporte un échec de recette sur le run 29749715001, avec un staging non exécuté. Le serveur de développement compilait à froid pendant les scénarios. Le commit 689e59d remplace l'exécution CI par le serveur standalone issu du build et ajuste l'utilisation de localhost pour la session.

Le fait vérifié pendant cette préparation est la présence du commit et de ses modifications dans l'historique local. Les résultats des runs distants sont des résultats historiques rapportés dans le dossier Bloc 2 ; ils ne sont pas présentés comme une nouvelle consultation des serveurs GitHub.

| Option analysée a posteriori | Avantage | Limite |
| --- | --- | --- |
| Augmenter les délais et ajouter des retries | Modification rapide du harnais. | Peut masquer l'instabilité et conserve l'écart avec l'artefact livré. |
| Préchauffer le serveur de développement | Réduit certaines compilations pendant la recette. | Dépend de la liste des routes préchauffées. |
| Tester le build standalone | Teste un artefact proche de celui utilisé dans Docker. | Ajoute un temps de build et demande un environnement cohérent. |

La modification retenue dans le code correspond à la troisième option. Le dossier historique associe la consolidation au run 29750556481, qui a réussi sans retry. La comparaison des options ci-dessus est une analyse rétrospective de préparation, pas la reproduction d'un procès-verbal de décision contemporain.

Le raisonnement est réutilisable : échec reproductible, recherche de la cause, distinction produit/harnais, comparaison des options, correction de la cause, nouvelle exécution puis autorisation de livraison. A04 présente aussi un arbitrage simulé de périmètre pour montrer l'effet sur les charges et l'engagement client.

## 7. C3.3.1 - Management et communication

Dans la simulation, j'utilise un style participatif pour estimer et répartir les tâches, un style persuasif pour expliquer une priorité contestée et un style directif limité aux règles de sécurité ou de livraison. La délégation porte sur un résultat attendu, avec une échéance, une autonomie définie et un point de contrôle.

À J10, le chef de projet approche 29 h prévues à terminaison pour 30 h disponibles. La marge est réduite : je limite les demandes nouvelles, conserve à QA la préparation de recette déjà prévue dans son rôle et conserve un point de validation court. Le développeur reste responsable des corrections ; QA conserve un regard indépendant sur leur validation. Le détail de charge par rôle est calculé dans le classeur.

La situation analysée dans A05 met en scène une demande de nouvelle fonctionnalité alors que QA attend un parcours stable. Une réponse uniquement directive ferait taire le désaccord sans traiter la surcharge. Je fais expliciter les impacts par chaque rôle, conserve les critères de qualité et propose au client un report documenté de la demande. La décision et ses conséquences restent accessibles à tous.

Les outils ont chacun une finalité : Linear pour tâches et blocages, Git pour les changements, Markdown pour décisions et comptes rendus, visioconférence pour les échanges synchrones. Les liens utiles sont regroupés dans la même tâche afin d'éviter une décision perdue dans une conversation. A05 contient le protocole d'animation, les aménagements de Camille et le retour critique. Une seule personne parle à la fois, les sous-titres sont testés et les informations inaccessibles sont reprises par écrit avant de poursuivre. Le compte rendu RT01 de rétrospective propose de sortir le diagnostic technique du daily et de vérifier la tenue des trois premiers points du prochain lot. Les réunions précisent les échanges du cas existant, sans ajouter un second forfait aux charges. Les durées réellement consommées restent à relever si le cas est appliqué.

Les contrôles prévus sont observables : à J3, Camille accède au support et reformule une consigne ; à J10, elle retrouve la décision, le responsable et l'échéance ; à J14, elle réalise un cas de recette sans aide. Ce sont des critères du scénario, sans résultat réel attesté. Un échec conduit à identifier si le besoin concerne l'accès à l'information ou la compétence technique, puis à ajuster le support ou l'accompagnement.

## 8. C3.3.2 - Évaluation et développement des compétences

La grille A06 utilise une échelle explicite : 0 non abordé, 1 réalisé avec accompagnement, 2 autonome sur un cas courant, 3 capable de traiter les cas complexes et d'accompagner. Elle compare les besoins du projet et les niveaux hypothétiques des rôles. Ces notes ne constituent pas une évaluation réelle de Dorian Joly ou d'un collaborateur.

Les écarts retenus concernent les transactions et la concurrence pour DEV, les tests navigateur et l'accessibilité pour QA, ainsi que le pilotage de la charge pour CP. Le plan prévoit des ateliers courts intégrés aux tâches, de la pratique accompagnée et une vérification par un résultat observable. La formation n'est pas déclarée réussie parce qu'un lien a été consulté.

L'efficacité est vérifiée par une démonstration ou un exercice : deux inscriptions concurrentes sur une dernière place, scénario navigateur reproductible, contrôle au clavier et mise à jour autonome du tableau de bord. Le plan de 6 h comprend 1 h CP dans T03, 2 h DEV dans T06 et 3 h QA dans T07. Pour Camille, les 2 h de recette navigateur et l'heure de parcours clavier utilisent des consignes écrites, une démonstration sous-titrée et des échanges disponibles par écrit. Le critère technique reste la réalisation autonome d'un cas. Les écarts de compétences QA ne sont pas déduits de sa malentendance. Le budget de formation fictif de 60 EUR couvre des ressources complémentaires ; le temps d'apprentissage est inclus dans les charges, sans double comptage.

Dans ce cas de courte durée, un recrutement permanent n'est pas retenu. Si la compétence critique reste indisponible et bloque le jalon, le chef de projet transmet aux RH une demande de renfort précisant mission, compétence, durée, charge, budget et critères de sélection. A06 et l'annexe 25 du diaporama présentent une fiche conditionnelle : déclencheur J12, spécialiste QA 4 h à J12-J13 et accueil CP 0,5 h. Cette variante non activée ajoute 202,50 EUR, porte la prévision à 4 667,50 EUR et conserve 29,50 EUR de marge. Elle n'est ni un recrutement réalisé ni une modification du budget de base.

## 9. C3.4.1 - Comptes rendus et validation client

Les trois comptes rendus d'A07 sont des mises en situation fictives. Le premier fixe le périmètre et les critères, le deuxième présente les écarts et l'arbitrage, le troisième décrit une répétition de validation et les réserves de démonstration. Aucun n'est signé au nom d'une personne réelle et aucun envoi n'est affirmé.

Le rôle CL représente ici Claire Martin pour le Collectif Altitude Grimpe. Le cas support B4-C433-01 fournit un exemple de transmission entre besoins fonctionnels, cause technique et vérifications. Il reste une simulation de support et ne constitue pas un retour client réel à réutiliser comme preuve de satisfaction. De même, les objectifs de NPS et de rétention du Bloc 1 restent des cibles non mesurées.

CR01 est relié au planning J3, CR02 à la review J10 et CR03 à la review J15. La rétrospective RT01 d'A05 traite séparément les pratiques de l'équipe. Chaque compte rendu indique le jour relatif, les rôles présents dans le scénario, ce qui a été présenté, les écarts, les décisions et les prochaines actions. Une décision précise son responsable et son échéance. Le suivi qualité s'appuie sur une grille qui relie chaque fonctionnalité attendue à son résultat.

Les indicateurs de satisfaction proposés sont : proportion de critères acceptés, proportion de scénarios réussis sans aide, note d'utilité de 1 à 5 et nombre de blocages signalés. Le nombre de répondants et la date doivent accompagner tout résultat. Le protocole J15 prévoit deux grimpeurs et un représentant de club, sans recrutement réellement réalisé. A07 fixe les seuils : 100 % des critères critiques, au moins 80 % des parcours sans aide, utilité moyenne au moins 4/5 et aucun blocage critique. Tout écart déclenche une action affectée et un nouveau contrôle. À ce stade, aucune réponse de client réel n'est disponible. Une mesure manquante reste « non mesurée » ; elle ne vaut ni zéro ni 100 %.

La validation se fait par fonction avec trois décisions possibles : accepté, accepté avec réserve ou refusé. Les réserves redeviennent des actions datées. Un procès-verbal fictif ne prouve pas une réception contractuelle du logiciel ; une validation réelle nécessitera l'interlocuteur et sa confirmation.

## 10. C3.4.2 - Démonstration du logiciel

Le scénario de six minutes part d'un besoin utilisateur : « préparer une sortie avec les bonnes personnes ». Une session grimpeur montre le profil, le matching et l'inscription à un événement ; une session club montre la gestion et les participants. Le vocabulaire reste fonctionnel : place disponible, demande envoyée, inscription confirmée. Les mécanismes de base de données sont réservés aux questions techniques.

Les comptes de démonstration sont ceux du script seed-demo.mjs. Ils doivent être utilisés sur un environnement local de démonstration identifié. Le guide A08 prévoit la préparation, les critères d'acceptation, les deux sessions navigateur et une solution de secours avec les captures du 15 septembre 2026. Ces captures permettent de poursuivre l'explication en cas d'incident, mais ne remplacent pas la preuve d'un logiciel utilisable le jour de l'épreuve.

L'état des vérifications courantes est conservé dans preuves/verification.json et expliqué dans VERIFICATION.md. Il distingue lint, TypeScript, tests unitaires, construction et recette complète. La réussite de tests isolés ne permet pas de déclarer une recette avec MariaDB réussie si elle n'a pas été exécutée.

À la fin du parcours, je reprends les critères avec le jury : recherche de partenaire, accès au bon rôle, inscription, capacité et visibilité des participants. Je présente les limites constatées et le traitement des réserves avant de demander la validation du périmètre démontré.

## 11. Bilan et préparation de l'entretien

Le dossier relie chacune des sept compétences à une action, un résultat attendu et une pièce vérifiable. Les preuves réelles couvrent le produit, le code, les tests exécutés et l'arbitrage technique historique. Le cas pédagogique complète la démonstration des méthodes de pilotage, sans transformer les échanges simulés en faits réels.

Les points restant à confirmer par le candidat sont la composition réelle de l'équipe, les interlocuteurs et retours réellement obtenus, la date de soutenance, la date limite de dépôt et les dispositions du règlement spécial. Ils sont regroupés dans la checklist de remise, pour ne pas être oubliés derrière la préparation technique.

Le guide d'oral contient les notes de présentation, une répartition totalisant trente minutes et des questions probables. Le candidat doit reformuler les explications avec ses mots et être capable de modifier une hypothèse du classeur, d'expliquer un écart et de retrouver une preuve.

La transmission vers la maintenance s'appuie sur les registres déjà documentés au Bloc 4 : version identifiée, anomalies qualifiées, responsables, réserves et critères de vérification. Le constat de production en retard de 19 commits du 13 août reste historique. Il ne décrit pas l'état actuel du site. Les preuves de juillet, août et septembre conservent leurs dates et leurs périmètres, sans additionner les nombres de tests ni assimiler une réussite locale à une promotion en production.

<!-- pagebreak -->

## 12. Sources et pièces jointes

S1 : référentiel Expert en développement logiciel RNCP39583, p. 11 à 14, copie archivée dans docs/rncp/referentiel. S2 : modalités YNOV M2 2025-2026, p. 4, 6, 8, 10 et 11, fichier fourni par le candidat. S3 : grille d'évaluation BC03, page unique, fichier fourni par le candidat.

Preuves projet : historique Git, commit 689e59d ; docs/bc02/10_CAHIER_RECETTES_C231.md ; docs/bc02/19_RETOUR_EXPERIENCE_ET_CHOIX_TECHNIQUES.md ; docs/audits/2026-09-09-synchronisation-linear.md ; captures du 15 septembre 2026 dans preuves/captures ; résultats de vérification produits pendant cette préparation.

Annexes : A01 planning, A02 responsabilités, A03 indicateurs et risques, A04 arbitrages, A05 management, A06 compétences et formations, A07 suivi client, A08 démonstration, A09 données et rapprochement Linear. Les données numériques du cas sont centralisées dans donnees/pilotage.json et reprises dans le classeur joint. La matrice de preuves donne les correspondances avec la grille officielle.

Continuité du projet : Bloc 1, C1.1.1 p. 2, C1.4.1 p. 7-8 et C1.4.2 p. 2-4 ; Bloc 2, dossier final du 23 juillet et retour d'expérience ; Bloc 4, dossier du 13 août, anomalie B4-C421-02 et cas support B4-C433-01. La revue COHERENCE_INTER_BLOCS.md conserve les références précises et les divergences documentaires.
