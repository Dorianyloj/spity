# Les termes du Bloc 3 expliqués simplement

Ce lexique accompagne le [diaporama v16](../../../output/bloc-03/spity-bloc-3-30-minutes-visuel-v16.pptx) et le [guide d'explication des diapositives](COMPRENDRE_LES_DIAPOS.md). Les exemples reprennent Spity. L'équipe, les réunions et les chiffres du cas de quinze jours restent une simulation.

## QA et les autres rôles

**QA = Quality Assurance = assurance qualité.** Cela regroupe les pratiques qui donnent confiance dans la qualité du résultat : définir ce qu'on attend, préparer les vérifications et améliorer la manière de travailler. Les tests font partie du travail de qualité. Le terme QA est plus large que le seul fait de chercher des bugs. [Repère : ASQ, assurance et contrôle qualité](https://asq.org/quality-resources/quality-assurance-vs-control).

Dans ton support, **Camille est la QA fictive chargée des tests**. Elle prépare les critères, teste les inscriptions et vérifie le parcours au clavier. DEV développe la fonction, Camille vérifie le résultat avec les critères définis. La qualité reste une responsabilité partagée avec le reste de l'équipe.

| Terme | Signification et exemple |
| --- | --- |
| **CP** | **Chef de projet**. Il organise les tâches, suit les difficultés et prépare ou prend les décisions selon sa responsabilité. |
| **DEV** | **Développeur**. Il réalise les fonctions et corrige le code. |
| **CL** | **Client**, dans les données du cas. Claire Martin représente le client fictif Altitude Grimpe. |
| **RH** | **Ressources humaines**. Le service qui accompagne notamment les recrutements et la gestion du personnel. Une demande de renfort précise le besoin d'aide. |
| **UX** | **User Experience**, expérience utilisateur. Cela concerne la façon dont une personne comprend et utilise le produit. Exemple : sait-elle retrouver son inscription ? |
| **UI** | **User Interface**, interface utilisateur. Ce sont les écrans et commandes avec lesquels on interagit : boutons, champs, menus. |
| **Commanditaire** | La personne ou l'organisation qui demande le projet et porte ses attentes. |
| **Parties prenantes** | Les personnes concernées par le projet : client, équipe, utilisateurs, club, maintenance… |
| **Rôle** | Un ensemble de responsabilités. Une personne peut avoir plusieurs rôles, mais il faut préciser qui fait et qui décide pour chaque travail. |

UX et QA peuvent se croiser : QA peut vérifier qu'un parcours respecte les critères d'utilisation. UX concerne l'expérience vécue, QA l'organisation de la qualité. L'ancien libellé « testeur UX » du classeur décrit ici des tests de parcours et d'utilisation.

## Le projet et son planning

| Terme | Signification et exemple |
| --- | --- |
| **Piloter** | Organiser, observer l'avancement et adapter les décisions. Exemple : déplacer une tâche pour garder le temps de tester. |
| **Coordonner** | Faire en sorte que les travaux des personnes s'accordent. Prévenir QA quand une version est prête à tester. |
| **Cadrage** | Préciser au départ le besoin, ce qu'on va faire, les contraintes et la façon de vérifier le résultat. |
| **Périmètre** | Ce qu'on prévoit de réaliser dans cette version ou ce lot. Ajouter les contributions aux topos élargit le périmètre du cas. |
| **Lot** | Un ensemble de travaux suivi comme une partie du projet. Le B1 décrit neuf grands lots. Le B3 détaille un cas de préparation de démonstration. |
| **Livrable** | Un résultat qu'on peut remettre ou examiner : version de l'application, document, rapport de tests. |
| **MVP** | **Minimum Viable Product**, première version suffisamment utile pour la confronter aux utilisateurs et apprendre de leurs retours. Son périmètre reste limité. |
| **Prioriser** | Choisir ce qui passe avant le reste. Exemple : traiter un problème d'inscription avant une amélioration visuelle. |
| **Must / Should / Could / Won't** | Niveaux de priorité : indispensable / important / souhaitable si les moyens le permettent / exclu pour la période considérée. C'est la méthode **MoSCoW**. |
| **Arbitrage** | Un choix expliqué entre plusieurs options. Exemple : reporter un ajout plutôt que retirer les tests nécessaires. |
| **Report** | Décaler un travail à une prochaine période. La demande reste identifiée. |
| **Planning** | Organisation des travaux dans le temps. |
| **Gantt** | Un planning dessiné avec des barres : on voit quand chaque travail commence, finit et chevauche d'autres travaux. |
| **Phase** | Une étape regroupant des activités : étude, conception, réalisation, tests, présentation. |
| **Mesure**, dans la phase du cas | Définir des résultats observables. Exemple : une seule inscription acceptée pour la dernière place. |
| **Dépendance** | Un travail ou une validation a besoin d'un autre résultat. La validation finale attend les corrections nécessaires. |
| **Jalon** | Un point où un résultat doit être disponible ou une décision prise. Exemple : validation des tests à J14. |
| **Échéance** | La date ou le moment limite prévu pour une action. |
| **J1, J10, J15** | Premier, dixième, quinzième jour ouvré du scénario. Ce sont des repères relatifs. |
| **Jour ouvré** | Jour normalement travaillé dans l'organisation. Le cas raisonne avec cinq jours de travail par semaine. |
| **Jour-homme, j-h** | Quantité de travail d'une personne pendant une journée. Deux personnes pendant trois journées représentent six jours-homme. Le temps calendaire dépend aussi des dépendances et disponibilités. |
| **Charge** | Quantité de travail nécessaire, par exemple 24 heures de tests. |
| **Capacité** | Quantité de temps disponible pour travailler, par exemple 30 heures pour QA. |
| **Ressources** | Moyens disponibles : personnes, temps, argent, machines, outils. |
| **Affectation** | Attribution d'une tâche à une personne ou un rôle. |
| **Glissement / dérive du délai** | Une date prévue se décale. Une fin à J12 au lieu de J11 représente un jour de décalage. |

**Exemple charge/capacité :** Camille a 24 h de travail prévues et 30 h disponibles. Il reste 6 h de disponibilité. Ce calcul ne dit pas combien de fonctions sont terminées.

## Linear, les réunions et la communication

| Terme | Signification et exemple |
| --- | --- |
| **Linear** | L'outil de suivi des tickets utilisé pour Spity. |
| **Ticket / issue** | Une fiche décrivant un travail, une anomalie ou une demande, avec un état et des informations de suivi. |
| **Backlog** | La liste des travaux identifiés à traiter ou à réexaminer. Une demande présente dans le backlog n'est pas forcément engagée. |
| **Todo / In Progress / Done / Canceled** | À faire / en cours / terminé / annulé. Dans le cas, « terminé » suppose des critères vérifiés. |
| **Kanban** | Une façon de suivre le travail qui circule entre des états et de limiter le travail commencé en même temps. |
| **WIP** | **Work In Progress**, travail en cours. Une limite WIP de deux signifie au maximum deux éléments dans les états concernés par cette limite. |
| **Agile** | Une approche qui avance par étapes et adapte le travail à partir des résultats et des retours. |
| **Scrum** | Un cadre d'organisation avec des responsabilités et des événements définis, par cycles appelés Sprints. |
| **Sprint** | Un cycle Scrum d'un mois maximum, orienté vers un objectif. |
| **Planning / Sprint Planning** | Préparation du travail et de son objectif pour la période. |
| **Daily** | Point quotidien pour adapter le travail et repérer les obstacles. |
| **Review** | Échange sur le produit obtenu et les adaptations à prévoir. |
| **Rétrospective / rétro** | Échange sur la façon de travailler pour choisir une amélioration. |
| **Product Owner / PO** | En Scrum, responsabilité de la valeur du produit et de l'ordre du Product Backlog. |
| **Scrum Master** | En Scrum, responsabilité d'aider à comprendre et à mettre en œuvre ce cadre. |
| **Rituel** | Nom courant donné à un rendez-vous récurrent de l'équipe. |
| **Compte rendu / CR** | Trace écrite de ce qui a été discuté et décidé, avec les prochaines actions. **CR02** désigne le deuxième compte rendu du cas. |
| **Traçabilité** | Possibilité de retrouver l'origine et la suite d'une décision ou d'un travail : ticket, compte rendu, commit, résultat de test. |
| **Asynchrone** | Un échange auquel chacun peut répondre à un moment différent. Exemple : avis écrit avant une réunion. |

Les définitions Scrum renvoient au [Guide Scrum officiel, édition 2020](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-French.pdf). Dans le diaporama, le choix est un flux Kanban avec des réunions inspirées de Scrum. Le daily du scénario est prévu pour dix minutes. CP et CL ne deviennent pas automatiquement Scrum Master et Product Owner.

**Exemple review/rétro :** pendant la review, on regarde si les inscriptions répondent au besoin. Pendant la rétro, on constate que les longues discussions techniques rendent les points quotidiens moins utiles, puis on décide de prévoir ces échanges après le point.

## Les heures, les coûts et les indicateurs

| Terme | Signification et exemple |
| --- | --- |
| **Estimation** | Évaluation de ce qu'un travail devrait demander. Elle peut être révisée quand on en sait davantage. |
| **Référence initiale / baseline** | Le plan de départ conservé pour comparer la suite. Ici : 112 h et 4 270 € pour le cas B3. |
| **Consommé** | Ce qui a déjà été utilisé : heures réalisées ou argent dépensé. Les 77 h du cas sont une consommation simulée. |
| **Reste à faire / RAF** | Travail encore nécessaire pour terminer. Ici : 40 h. |
| **Prévision à terminaison / forecast** | Nouvelle estimation du total nécessaire pour finir. Ici : 77 h déjà faites + 40 h restantes = 117 h. |
| **Écart** | Différence entre deux valeurs comparables. 117 h prévues maintenant − 112 h prévues au départ = +5 h. |
| **Budget prévisionnel** | Coût estimé avant réalisation. |
| **TJM** | **Taux journalier moyen** : montant retenu pour une journée de travail. Le diaporama B1 utilise 450 €/jour. Cela ne désigne pas automatiquement un salaire. |
| **Taux horaire** | Montant retenu pour une heure de travail. Le cas utilise 45 €/h CP, 35 €/h DEV et 30 €/h QA. |
| **Valoriser les heures** | Leur associer un coût : heures × taux. Exemple : 4 h QA × 30 €/h = 120 €. |
| **Réserve budgétaire** | Somme prévue pour absorber des imprévus : 427 € dans le cas. |
| **Plafond** | Limite de coût retenue : 4 270 € + 427 € = 4 697 €. |
| **Marge budgétaire restante** | Argent encore disponible sous cette limite : 4 697 € − 4 465 € = 232 €. Ici, « marge » ne signifie pas bénéfice commercial. |
| **Marge de capacité** | Temps encore disponible : 30 h de capacité − 29 h prévues pour CP = 1 h. |
| **Indicateur / KPI** | Un chiffre choisi pour suivre un objectif. **Key Performance Indicator** signifie indicateur clé de performance. Exemple : part de parcours réussis sans aide. |
| **Tableau de bord** | Vue regroupant les informations utiles pour décider : avancement, dates, coûts, risques, disponibilité. |
| **Seuil d'alerte** | Valeur qui déclenche un examen ou une action. Le cas utilise 90 % de la capacité CP. |
| **Pondération** | Donner un poids différent aux éléments. Sans pondération, un ticket de trente minutes compte autant qu'un ticket de trois jours. |
| **Analyse de sensibilité** | Modifier une hypothèse et regarder l'effet. Exemple : ajouter deux heures CP et vérifier coût et disponibilité. |
| **Hypothèse** | Une valeur ou situation retenue pour raisonner, à distinguer d'un fait observé. |
| **Variante / scénario** | Une possibilité étudiée. Les lignes de l'annexe 25 sont des variantes indépendantes. |

La réserve budgétaire est fixée au départ. La marge restante évolue avec la prévision. Le projet global B1 et le lot B3 ont des périmètres différents : leurs budgets ne sont pas additionnés dans le dossier.

## Les tests, la qualité et les risques

| Terme | Signification et exemple |
| --- | --- |
| **Recette** | Vérifier qu'un résultat respecte les attentes et les critères convenus. Exemple : contrôler tout le parcours d'inscription. |
| **Critère d'acceptation / de recette** | Condition observable permettant de juger le résultat. Exemple : une seule personne obtient la dernière place disponible. |
| **Cas de test / scénario de test** | Situation préparée avec un départ, des actions et un résultat attendu. |
| **Reproductible** | Que l'on peut rejouer dans des conditions identifiées pour comparer les résultats. |
| **Anomalie / bug** | Un résultat qui ne correspond pas au comportement attendu. |
| **Blocage critique** | Problème qui empêche un usage essentiel dans le contexte évalué. Exemple : aucune inscription ne fonctionne. |
| **Validation** | Décision prise après comparaison du résultat aux critères attendus. Un test technique réussi et un accord client répondent à des questions différentes. |
| **Accepté avec réserve** | Acceptation accompagnée de points restant explicitement à traiter ou vérifier, selon les conditions convenues. |
| **Réserve après démonstration** | Point conservé pour correction ou vérification. Exemple : le parcours fonctionne mais un contrôle clavier reste à reprendre. |
| **Action corrective** | Travail visant à traiter un problème et sa cause. |
| **Risque** | Événement possible susceptible d'affecter le projet. Une indisponibilité future de la démonstration est un risque. |
| **Incident** | Problème survenu. Une démonstration qui ne démarre pas est un incident. |
| **Probabilité** | Estimation de la chance qu'un événement survienne. |
| **Impact** | Conséquence de cet événement sur le projet. |
| **Criticité / score de risque** | Repère combinant notamment probabilité et impact pour hiérarchiser les risques. |
| **Registre des risques** | Liste des risques avec leurs responsables et les actions prévues. |
| **Matrice** | Tableau qui croise des informations. La matrice de risques croise probabilité et impact. |
| **Déclencheur** | Événement ou seuil qui indique qu'il faut agir. |
| **Plan d'action** | Ce qu'on prévoit de faire, par qui et pour quand. |
| **Session pilote** | Premier essai avec un petit groupe pour observer les difficultés. Les participants de la slide 19 sont prévus, sans résultats réellement mesurés. |
| **Cible / objectif** | Résultat que l'on souhaite atteindre. La cible 4/5 n'est pas une note déjà obtenue. |
| **Taux de réussite** | Nombre de réussites divisé par le nombre de tentatives. Quatre parcours réussis sur cinq donnent 80 %. |
| **Effectif** | Nombre de personnes ou d'observations utilisées dans une mesure. |
| **Utilité perçue** | Ce que les utilisateurs déclarent trouver utile dans le produit. |

Dans l'exemple « quatre sur cinq », il s'agit d'expliquer un calcul, sans ajouter un résultat réel au dossier.

## Le travail avec l'équipe

| Terme | Signification et exemple |
| --- | --- |
| **Management participatif** | Faire contribuer les personnes à la réflexion. Demander à DEV et QA leurs options. |
| **Management persuasif** | Expliquer le raisonnement d'une décision pour en faciliter la compréhension et l'adhésion. |
| **Management directif** | Donner une consigne et des limites explicites. Exemple : respecter les contrôles de capacité avant livraison. |
| **Management délégatif** | Confier un résultat en laissant de l'autonomie sur la manière de le produire, avec un suivi convenu. |
| **Compétence** | Capacité à réaliser un travail dans une situation donnée. Exemple : sécuriser des inscriptions concurrentes. |
| **Niveau actuel / cible** | Ce que la personne sait faire aujourd'hui / le niveau nécessaire pour le travail prévu. |
| **Autonomie** | Capacité à accomplir la tâche sans accompagnement permanent, dans des limites connues. |
| **Montée en compétences** | Progression grâce à la pratique, l'accompagnement et la formation. |
| **Plan de formation** | Ce qu'on veut apprendre, comment, quand, pendant combien de temps et comment vérifier l'apprentissage. |
| **Renfort** | Aide supplémentaire pour un besoin identifié. Exemple : quatre heures d'un spécialiste QA. |
| **Inclusion** | Organisation qui permet aux personnes de participer au travail et aux décisions. |
| **Accessibilité** | Possibilité d'accéder à une information, un outil ou un service avec des besoins et moyens d'utilisation différents. Exemple : utiliser le formulaire au clavier. |
| **Aménagement** | Adaptation concrète convenue pour répondre à un besoin. Exemple du cas : sous-titres et décisions écrites pour Camille. |
| **Reformulation** | Redire une consigne avec ses mots pour vérifier une compréhension commune. |

**RACI** est un tableau pour clarifier les responsabilités. Dans ce support :

| Lettre | Nom anglais | Sens simple |
| --- | --- | --- |
| **R** | Responsible | Réalise le travail. |
| **A** | Accountable | Répond du résultat et porte la décision finale selon l'activité. |
| **C** | Consulted | Donne son avis avant la décision ou la réalisation. |
| **I** | Informed | Reçoit l'information utile. |

Le support affecte un seul A par activité. **RASCI** ajoute **S, Support** : apporte une aide à la réalisation. « Matrice RACI » signifie donc simplement tableau des responsabilités.

## Les mots techniques présents dans l'explication du choix de build

| Terme | Sens dans le support |
| --- | --- |
| **Build** | Construction d'une version exécutable de l'application à partir du code. |
| **Standalone** | Ici, serveur Next.js issu du build avec les éléments nécessaires à son exécution. Il faut toujours sa configuration et ses services externes, comme la base de données. |
| **Serveur de développement** | Serveur utilisé pendant le développement, avec des traitements utiles aux modifications du code. |
| **Compilation à froid** | Travail de compilation encore nécessaire au premier accès à une partie non préparée. |
| **Préchauffage** | Préparer les routes avant le test pour éviter de découvrir leur temps de compilation pendant le parcours. |
| **Retry** | Nouvelle tentative après un échec. |
| **Timeout** | Délai maximal d'attente avant de considérer qu'une opération n'a pas abouti. |
| **CI** | **Continuous Integration**, intégration continue : contrôles automatisés associés aux changements du code. |
| **Artefact** | Fichier ou résultat produit par une construction ou une exécution. Exemple : application compilée, rapport de test. |
| **E2E** | **End-to-end**, test d'un parcours de bout en bout, par exemple depuis l'inscription jusqu'au résultat visible côté club. |
| **Concurrence / inscriptions concurrentes** | Plusieurs opérations arrivent en même temps. Deux personnes tentent de prendre la dernière place. |
| **Transaction** | Ensemble d'opérations de base de données géré comme une unité. Les garanties adaptées et la logique de contrôle doivent protéger les accès concurrents. |
| **Environnement local / production** | Application lancée sur la machine de travail / environnement réellement utilisé par les utilisateurs. |
| **Données de test** | Comptes et informations préparés pour les vérifications et la démonstration. |

## Les codes du dossier

| Code ou terme | Traduction |
| --- | --- |
| **RNCP** | Répertoire national des certifications professionnelles. RNCP39583 est l'identifiant de la certification concernée par ton dossier. |
| **EDL** | Expert en développement logiciel, intitulé utilisé dans les documents de ta certification. |
| **Référentiel** | Document décrivant les compétences et les critères attendus. |
| **Bloc de compétences / BC** | Ensemble de compétences évaluées. BC03 désigne le Bloc 3. |
| **C3.2.1, C3.4.2…** | Identifiants permettant de retrouver une compétence dans la grille. |
| **Éliminatoire** | Dans les modalités de ce dossier, compétence qui doit être acquise pour valider le bloc, même si le nombre d'autres compétences acquises suffit. Voir le cadre officiel cité dans le README. |
| **T01, T02…** | Identifiants des tâches du scénario. |
| **R01, R02…** | Identifiants des risques du scénario. |
| **CR01, CR02…** | Identifiants des comptes rendus simulés. |
| **A01, A02…** | Identifiants des annexes où retrouver les détails. |
| **B1-L01…** | Identifiants ajoutés pour repérer les neuf lots repris du diaporama Bloc 1. |

**Exemple de traduction complète :** « À J10, la prévision à terminaison dépasse la référence initiale, mais reste sous le plafond. » Cela veut dire : « Au dixième jour du cas, on estime que finir coûtera plus cher que prévu au départ. On reste toutefois dans la limite qui inclut la réserve pour imprévus. »

## Question d'oral : le PO et la délégation

La question rapportée par un ami est : « Est-ce que le PO était quantitatif ou s'il déléguait ? » Le mot exact reste incertain. **Quantitatif** signifie fondé sur des quantités ou des chiffres. Cela ne s'oppose pas à la délégation. Si la question portait sur le style de management, un mot comme directif ou participatif a peut-être été employé. Il faut garder cette interprétation comme une hypothèse.

**PO** signifie **Product Owner**. En Scrum, il est responsable de la valeur du produit et de la gestion du backlog produit. Il peut déléguer des activités de cette gestion tout en conservant sa responsabilité. Les Developers organisent leur travail technique. Le PO n'est pas automatiquement leur supérieur hiérarchique. [Guide Scrum officiel, responsabilités de l'équipe et du PO, p. 6-7](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-French.pdf).

| Mot possible | Comportement concret |
| --- | --- |
| Directif | Donne une consigne précise et fixe les limites. |
| Participatif | Demande les avis et construit la décision avec les personnes concernées. |
| Délégatif | Confie un résultat et laisse une autonomie définie, avec un suivi convenu. |
| Quantitatif | S'appuie sur des chiffres, par exemple le taux de réussite des inscriptions. |

Ces comportements peuvent se combiner. Pour répondre au jury, décris une situation, la décision concernée et l'autonomie laissée à chacun.

**Exemple pédagogique si un projet possède réellement un PO :** « Le PO discutait des priorités avec l'équipe. Il pouvait confier la préparation des éléments du backlog tout en gardant la responsabilité de leur ordre. Les développeurs décidaient de l'implémentation technique. » Cet exemple n'atteste pas l'organisation réelle du projet de l'ami.

**Pour le cas Spity présenté :** « Dans mon scénario, je prévois une posture participative pour comparer les options et une délégation sur les choix techniques. Le développeur propose l'implémentation, QA prépare les tests et CP organise le suivi. Le client confirme les priorités métier. » Les rôles du cas restent CP/DEV/QA/CL, sans PO officiellement établi dans les éléments disponibles.
