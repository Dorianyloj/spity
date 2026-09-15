# A05 - Management et communication

Nature : mise en situation fictive. Les rôles DEV, QA et client ne correspondent pas à des personnes réellement interrogées. QA est représenté par Camille, testeuse fictive malentendante, comme dans A02.

## Des réunions inspirées de Scrum

Le cas utilise un tableau Kanban dans Linear et des réunions inspirées de Scrum pour inspecter le travail et adapter les prochaines actions. Cette organisation convient au petit effectif et au lot de quinze jours. Les responsabilités CP/DEV/QA/CL et les jalons du dossier sont conservés. Le cas ne revendique pas une mise en œuvre complète du cadre Scrum : ses réunions, rôles et jours relatifs ne constituent pas une preuve de Sprints réellement pratiqués.

| Réunion du scénario | Moment et durée cible | Participants | Objectif et trace |
| --- | --- | --- | --- |
| Planning | J3, 30 minutes | CP, DEV et QA ; CL pour confirmer le périmètre | Objectif du lot, tâches retenues et capacité ; CR01, critères T02 et planning T03. |
| Daily | Chaque jour ouvré, 10 minutes | Rôles mobilisés sur le travail courant ; CP facilite la levée des blocages | Progression, obstacle et prochaine action ; suivi du statut, du reste à faire et du responsable. |
| Review | J10 puis J15, 30 minutes par revue | CP, CL et DEV/QA selon les fonctions présentées | Parcours disponibles, retour client et priorités adaptées ; CR02/CR03 et réserves. |
| Rétrospective | J15 après la review, 20 minutes | CP, DEV et QA | Améliorer la façon de travailler ; RT01 avec une action, un responsable et une vérification. |

Le planning J3 inclut le point de périmètre déjà prévu. La review J10 est intermédiaire et la review J15 conclut le lot. Elles examinent le produit et ses usages. La rétrospective porte sur la collaboration et les pratiques de l'équipe. CP continue à vérifier coûts, dates et capacité deux fois par semaine dans le tableau de bord ; ce contrôle ne remplace pas le daily ni la discussion avec le client.

CP facilite les réunions et la levée des obstacles. DEV et QA organisent les travaux techniques selon l'objectif convenu. CL confirme les priorités métier. Une réunion quotidienne sert à adapter le travail de l'équipe ; elle ne devient pas un compte rendu individuel au chef de projet. Les noms Product Owner et Scrum Master ne sont pas attribués automatiquement à CL et CP.

Linear porte les tâches et priorités ; Git porte les changements ; les fichiers partagés portent les critères, décisions et comptes rendus. Une synthèse écrite accompagne toute décision orale. Dans le scénario, le ticket concerné renvoie au document de décision. Les tickets réels de Linear ne sont pas modifiés pour représenter ces réunions fictives.

Les durées sont des cibles d'animation, sans mesure historique disponible. Les réunions précisent les échanges déjà prévus dans les estimations globales des tâches ; aucun second forfait de réunions n'est ajouté. Une personnalisation réelle doit relever le temps de chaque participant, puis réestimer le travail si les échanges excèdent l'enveloppe prévue. La prévision pédagogique reste 4 465 EUR.

Référence de méthode : [Guide Scrum 2020, p. 9-10](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-French.pdf). Il distingue planification, inspection quotidienne, revue du résultat avec les parties prenantes et amélioration du fonctionnement de l'équipe. Les horaires et formats ci-dessus sont ceux du cas adapté. Les données du protocole figurent dans donnees/rituels.json.

<!-- pagebreak -->

## Exemple du daily J10

Simulation pédagogique : DEV signale que T06 nécessite encore 10 h et vise J12. Camille indique que la clôture de recette dépend d'une version stable des événements et des corrections. CP fait préciser la prochaine action et le risque sur J14. Le daily se termine sur l'action DEV : rendre T06 testable à J12 et actualiser le reste à faire au prochain point. Le diagnostic de concurrence est traité ensuite avec les seuls rôles concernés.

Cette trace quotidienne alimente la review J10 et CR02 : elle explique pourquoi le lot ne peut pas absorber une demande supplémentaire sans arbitrage. Le daily identifie le blocage, la review discute le résultat attendu avec le client, puis CR02 conserve la décision.

## RT01 - Rétrospective J15

Exemple fictif d'amélioration, sans résultat réel attesté. Constat retenu : les discussions techniques pendant le daily risquent de masquer la prochaine action. L'équipe conserve les synthèses écrites qui rendent les décisions accessibles et décide de sortir le diagnostic détaillé du point quotidien.

Action : CP recentre le daily sur progression, blocages et plan du jour ; DEV organise ensuite le diagnostic utile. Vérification au prochain lot : les trois premiers dailies durent dix minutes au maximum et chaque blocage possède une action écrite avec responsable. L'efficacité de l'amélioration reste à constater.

## Situation analysée

À J10, DEV souhaite traiter une nouvelle contribution aux topos. QA attend la stabilisation des événements pour exécuter les contrôles de capacité. Le chef de projet doit éviter que le travail parallèle prive la recette d'un périmètre stable.

1. CP demande à chacun le fait bloquant, son impact et l'aide nécessaire, sans attribuer une faute personnelle.
2. DEV explique l'intérêt utilisateur ; QA précise les risques non vérifiés et le temps nécessaire.
3. L'équipe compare les options avec la capacité et le budget d'A04.
4. CP propose le report au client fictif, préserve T06/T07/T10 et affecte les prochaines actions.
5. La décision est inscrite dans CR02 et présentée dans la revue suivante.

La posture est participative pendant l'analyse, persuasive pour exposer les conséquences et directive sur l'interdiction de livrer une capacité non vérifiée. QA dispose de l'autonomie pour choisir les cas de recette ; DEV conserve l'autonomie d'implémentation dans les critères définis.

## Analyse critique

L'arbitrage de périmètre pendant la review reste distinct de la rétrospective. Une décision prise seul serait plus rapide mais pourrait masquer le besoin utilisateur et dégrader l'adhésion. À l'inverse, prolonger la discussion sans responsable de décision retarderait le lot. La séquence d'arbitrage de la review est donc limitée à quinze minutes ; les faits et options sont préparés par écrit, et le client décide des changements de périmètre.

Le scénario prévoit 29 h CP pour 30 h disponibles. Cette marge d'une heure est fragile. La réponse est de limiter les demandes nouvelles, conserver à QA la préparation de recette et réserver le temps de CP à l'arbitrage et à la validation. Lors d'un prochain lot, l'estimation devra mieux inclure les échanges et la préparation de restitution.

## Inclusion et contexte international

Pour Camille, les modalités du cas sont concrètes : supports écrits avant la réunion, sous-titres testés et une seule personne qui parle à la fois. La synthèse écrite comporte chaque décision, son responsable et son échéance. Le chef de projet lui propose de reformuler l'action attendue et ajuste le support avec elle si un élément reste inaccessible. Un silence en réunion ne vaut pas accord.

Lors du désaccord DEV/QA à J10, chacun prépare ses arguments par écrit. Camille dispose du même temps de contribution que DEV. Le CP consigne l'arbitrage dans CR02 et rend la prochaine action retrouvable sans devoir réécouter l'échange oral. Si le sous-titrage ne suffit pas, les points clés sont repris par écrit avant de poursuivre la décision.

| Point de contrôle prévu | Critère observable | Trace à produire dans le scénario |
| --- | --- | --- |
| J3 : accéder et comprendre | Camille accède au support et reformule une consigne. | Vérification d'accès et reformulation de la consigne. |
| J10 : retrouver la décision | Camille retrouve l'action, le responsable et l'échéance dans la synthèse. | Référence à la décision de CR02. |
| J14 : réaliser sans aide | Camille rejoue un cas de recette et explique le résultat. | Cas, préconditions, résultat et preuve de recette. |

Ces vérifications sont planifiées, sans résultat réel attesté. En cas d'échec, le CP distingue une information inaccessible d'un besoin de formation technique, corrige la cause et réestime le travail restant si nécessaire. A02 précise l'heure de préparation CP déjà comprise dans T03 et T08 ; A06 décrit la formation. Les supports restent structurés et utilisables au clavier ; une démonstration n'utilise pas uniquement la couleur pour signaler un état.

Dans le contexte international simulé, CP et Camille travaillent à Paris, tandis que DEV travaille depuis Montréal. La maîtrise du français varie dans l'équipe ; aucune aptitude n'est déduite de la nationalité. L'invitation indique Europe/Paris et America/Toronto, avec un créneau commun confirmé par les participants. DEV prépare son avis écrit avant l'arbitrage. CP rédige un résumé en français simple et explique les termes dans un glossaire FR/EN : reste à faire / remaining effort, recette / acceptance testing. Chaque rôle reformule ensuite l'action, le responsable et l'échéance. Le contrôle consiste à retrouver la même décision dans CR02, y compris sans assister à toute la réunion.

## Ressources communes accessibles

| Ressource partagée | Utilisation et accès dans le cas |
| --- | --- |
| [Backlog Linear](https://linear.app/spitywa/team/SPI/all) | Statuts et dépendances réellement observés le 14 septembre ; CP vérifie l'accès de chaque rôle avant de l'utiliser dans le scénario. |
| [CR02 et critères de validation](A07_SUIVI_CLIENT.md#cr02---review-avancement-et-arbitrage-à-j10) | Même version écrite pour CP, DEV, Camille et client ; décisions, responsables et échéances. |
| [Planning du lot](A01_PLANNING.md) | Dépendances, fin prévisionnelle et jalons. |
| [Procédure de démonstration](A08_DEMONSTRATION.md) | Préconditions, manipulations et solution de secours. |

Ces liens rendent la préparation consultable dans le dossier partagé. Ils ne prétendent pas qu'un collaborateur fictif possède un compte réel ni qu'un compte rendu a été publié dans Linear. La recommandation est de limiter la discussion J10 à quinze minutes, préparer les options par écrit et vérifier à la revue suivante que l'action décidée est retrouvable et exécutée.
