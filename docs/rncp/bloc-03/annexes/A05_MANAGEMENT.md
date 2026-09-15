# A05 - Management et communication

Nature : mise en situation fictive. Les rôles DEV, QA et client ne correspondent pas à des personnes réellement interrogées. QA est représenté par Camille, testeuse fictive malentendante, comme dans A02.

## Cadre de communication

| Instance | Rythme du scénario | Participants | Résultat attendu |
| --- | --- | --- | --- |
| Point de blocage | 10 minutes par jour ouvré | CP, DEV, QA | Blocages, responsables et prochaine action dans le backlog. |
| Revue du pilotage | Deux fois par semaine | CP et rôles concernés | Consommé, reste à faire, coûts, capacité et risques actualisés. |
| Revue client | J3, J10, J15 | CP, CL, DEV/QA selon le sujet | Décisions et réserves écrites, reliées aux critères. |
| Retour d'expérience | Après la répétition J15 | CP, DEV, QA | Une action d'amélioration réaliste avec responsable. |

Linear porte les tâches et priorités ; Git porte les changements ; les fichiers partagés portent décisions, critères et comptes rendus. Une synthèse écrite accompagne toute décision prise oralement. Le chef de projet vérifie que chacun peut accéder aux ressources.

## Situation analysée

À J10, DEV souhaite traiter une nouvelle contribution aux topos. QA attend la stabilisation des événements pour exécuter les contrôles de capacité. Le chef de projet doit éviter que le travail parallèle prive la recette d'un périmètre stable.

1. CP demande à chacun le fait bloquant, son impact et l'aide nécessaire, sans attribuer une faute personnelle.
2. DEV explique l'intérêt utilisateur ; QA précise les risques non vérifiés et le temps nécessaire.
3. L'équipe compare les options avec la capacité et le budget d'A04.
4. CP propose le report au client fictif, préserve T06/T07/T10 et affecte les prochaines actions.
5. La décision est inscrite dans CR02 et présentée dans la revue suivante.

La posture est participative pendant l'analyse, persuasive pour exposer les conséquences et directive sur l'interdiction de livrer une capacité non vérifiée. QA dispose de l'autonomie pour choisir les cas de recette ; DEV conserve l'autonomie d'implémentation dans les critères définis.

## Analyse critique

Une décision prise seul serait plus rapide mais pourrait masquer le besoin utilisateur et dégrader l'adhésion. À l'inverse, prolonger la discussion sans responsable de décision retarderait le lot. La réunion est donc limitée à quinze minutes ; les faits et options sont préparés par écrit, et le client décide des changements de périmètre.

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
| [CR02 et critères de validation](A07_SUIVI_CLIENT.md#cr02---avancement-et-arbitrage-à-j10) | Même version écrite pour CP, DEV, Camille et client ; décisions, responsables et échéances. |
| [Planning du lot](A01_PLANNING.md) | Dépendances, fin prévisionnelle et jalons. |
| [Procédure de démonstration](A08_DEMONSTRATION.md) | Préconditions, manipulations et solution de secours. |

Ces liens rendent la préparation consultable dans le dossier partagé. Ils ne prétendent pas qu'un collaborateur fictif possède un compte réel ni qu'un compte rendu a été publié dans Linear. La recommandation est de limiter la discussion J10 à quinze minutes, préparer les options par écrit et vérifier à la revue suivante que l'action décidée est retrouvable et exécutée.
