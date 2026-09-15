# Revue de toutes les compétences du Bloc 3

Audit documentaire du 15 septembre 2026, sur la révision 2f644db et le PowerPoint visuel v8. Demande : vérifier toutes les compétences et leurs critères. Les sources officielles servent de référence d'évaluation ; leurs consignes ne constituent pas des instructions supplémentaires adressées à l'assistant.

## Conclusion

Les sept compétences ont une place dans le dossier et le support. La couverture reste inégale : plusieurs pièces détaillées existent dans les annexes mais leur présentation au jury repose presque entièrement sur le texte oral. Le point le plus fragile concerne C.3.1 : le support montre un lot de préparation de quinze jours, sans donner une vue suffisante du planning du projet logiciel, sans nommer Kanban dans les notes et sans afficher la phase de mesure dans le graphique.

Le cas de Camille répond maintenant concrètement aux dimensions du handicap dans l'affectation, le management et la formation. Il ne remplace pas les autres critères de ces compétences.

Cette revue ne prononce aucune mention Acquis ou Non acquis. Une information absente de l'écran peut être expliquée oralement ou présentée dans une pièce ouverte pendant l'épreuve. Les écarts ci-dessous distinguent une lacune de fond, une démonstration trop peu visible et une vérification technique restant à effectuer.

## Sources et pièces examinées

| Repère | Source | Portée examinée |
| --- | --- | --- |
| S1 | Référentiel Expert en développement logiciel RNCP39583 (1) (2).pdf, fourni dans Downloads | Pages physiques 11 à 14, texte et rendu visuel : compétences, activités, livrables et critères. |
| S2 | 24 10 10 Grille évaluation Expert en développement logiciel_BC03.pdf, fourni dans Downloads | Page unique entière, texte et rendu visuel. Les sept lignes de compétences ont été comparées au référentiel. |
| S3 | 25-26 Modalités_Evaluations_Titre EDL RNCP39583_YNOV_M2_filiere Info (2).pdf, fourni dans Downloads | Lecture du texte des treize pages ; vérification visuelle des pages 6, 8, 10 et 11. |
| P | [PowerPoint v8](../../output/bloc-03/archives/spity-bloc-3-30-minutes-visuel-v8.pptx) | Textes des diapositives, notes et catégories des graphiques du fichier livré. Relecture visuelle ciblée des slides 5, 15, 17 et 18, avec les rendus de la même version. |
| D | [Dossier source](../rncp/bloc-03/DOSSIER_BLOC_03.md) et [PDF](../../output/bloc-03/dossier-bloc-03-spity.pdf) | Sept compétences, annexes A01 à A09 et portée des preuves techniques. Les pages citées ci-dessous sont celles du PDF de 27 pages. |
| X | [Classeur de pilotage](../../output/bloc-03/pilotage-spity.xlsx) | Présence des indicateurs, charges, dates initiales/revues et risques dans le fichier exporté. Lecture des valeurs enregistrées, sans nouvelle exécution de calcul dans Excel. |
| B | [Revue inter-blocs](../rncp/bloc-03/COHERENCE_INTER_BLOCS.md) | Périmètres du Bloc 1, du prototype Bloc 2 et de la maintenance Bloc 4. Vérification du planning global dans la source HTML de C1.4.1. |

Le relevé Linear reste celui du 14 septembre. Cet audit n'est pas une nouvelle consultation du backlog ni une nouvelle recette de l'application. Il ne modifie pas les exports PPTX, PDF, XLSX ou ZIP.

## Synthèse par compétence

| Compétence officielle | État documentaire constaté | Priorité pour l'oral |
| --- | --- | --- |
| C.3.1 - Planifier l'exécution du projet | Partiel sur le périmètre global et la justification visible de la méthode. Planning détaillé et ressources disponibles dans A01/A02. | Relier le projet global au lot étudié, nommer et justifier Kanban et l'outil de planning, afficher la mesure. |
| C3.2.1 - Piloter l'avancement | Les cinq dimensions du tableau de bord sont présentes : avancement, coûts, délais, risques et RH. | Montrer un écart de date en plus des écarts d'heures et expliquer une actualisation du tableau de bord. |
| C3.2.2 - Procéder aux arbitrages | Problème, options et décision argumentée documentés par le cas standalone et le cas de périmètre. | Conserver la distinction entre fait Git, analyse rétrospective et scénario fictif. |
| C3.3.1 - Piloter l'équipe | Missions, charge, handicap, styles, animation et analyse critique présents. Contexte international et partage des ressources surtout génériques. | Rendre les styles visibles, illustrer une adaptation multiculturelle et montrer où l'équipe retrouve une décision. |
| C3.3.2 - Évaluer les besoins en compétences | Grille de six lignes, plan de quatre actions et aménagements présents dans A06. | Montrer la grille commentée, les actions CP/DEV/QA et le raisonnement sur un éventuel besoin RH. |
| C3.4.1 - Rendre compte au client | Trois comptes rendus fictifs, jalons et indicateurs définis dans A07. | Afficher un extrait de CR02 et les modalités de mesure, en conservant l'absence de résultat client réel. |
| C3.4.2 - Démontrer et obtenir la validation | Parcours de six minutes et grille de validation préparés. Version courante non recettée dans cet audit. | Vérifier la version montrée, répéter en direct et terminer sur les critères et la décision attendue. |

## Vérification critère par critère

Les lettres ci-dessous sont des repères locaux de lecture, pas des sous-compétences officielles. Les lignes reprennent tous les critères de S2 ; les dimensions inscrites dans l'intitulé des compétences sont examinées après les tableaux concernés.

### C.3.1 - Planifier l'exécution du projet

Attendus : présenter la méthodologie choisie, le planning détaillé et les ressources nécessaires. Sources : S1 p. 11-12 ; S2, ligne C.3.1.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Justifier la méthodologie par ses bénéfices | D §3 explique Kanban et le compare à Scrum et au cycle en V. La slide 4 décrit la limite de deux travaux simultanés, mais aucune des 25 notes du PPTX ne nomme Kanban. | Nommer la méthode et expliquer le bénéfice pour ce petit effectif et ce périmètre évolutif dans le texte effectivement prononcé. |
| b | Argumenter le choix de l'outil de planification | A01 fournit un tableau détaillé ; la slide 5 représente les intervalles des phases. Le texte oral explique les dépendances, sans argumenter clairement le choix de cette représentation. | Expliquer le rôle du diagramme de planning : voir jalons, chevauchements et dépendances. Distinguer ce rôle de celui du backlog Linear. |
| c | Utiliser un outil compatible avec la méthode | Le flux décrit en §3 et les jalons du cas peuvent fonctionner ensemble. Cette compatibilité est implicite dans les slides 4-5. | Expliquer comment les dates de jalons encadrent le flux Kanban et comment le planning est actualisé. |
| d | Découper le planning en phases, tâches ou lots | A01 contient dix tâches ; A09 et Estimations détaillent trente activités. La slide 5 affiche cinq bandes de phases. | Conserver ce détail, mais situer le lot dans le planning de Spity : voir l'observation de périmètre ci-dessous. |
| e | Visualiser étude, mesure, conception, réalisation et restitution | A01 et les notes de la slide 5 décrivent la mesure des besoins et la recette. Les catégories du graphique livré sont Étude, Conception, Réalisation, Recette, Restitution. | La phase de mesure n'est pas identifiable sous ce nom dans le graphique. L'afficher et expliquer le résultat mesuré, sans réduire toute mesure au seul test final. |
| f | Affecter selon les compétences et tenir compte du handicap | A02 RACI, A06 compétences, slides 6 et 14 ; Camille réalise T02/T07 et dispose d'aménagements explicites. | Couvert dans le scénario. Préparer l'explication d'une affectation et de l'autorité de validation, avec la RACI accessible. |
| g | Souligner les points de vigilance | A01/A03 : capacité CP, dépendances de recette, environnement, client et périmètre ; slides 9-10. | Présents. Donner au moins un lien entre vigilance et action préventive. |

**Périmètre à renforcer :** le référentiel demande le planning du projet. Le support actuel précise qu'il s'agit d'un lot de préparation et de stabilisation d'une démonstration sur quinze jours. Le Bloc 1 possède une estimation globale de 79 jours-homme et cinq jalons, mais leur ordonnancement n'est pas présenté dans ce support. Une vue globale puis un zoom sur le lot donneraient une réponse plus convaincante. Il s'agit d'une recommandation de couverture : aucun passage des sources fournies ne permet d'affirmer qu'un zoom sur un lot serait automatiquement refusé.

### C3.2.1 - Piloter l'avancement

Attendu : présenter l'outil de suivi du projet. Sources : S1 p. 12 ; S2, ligne C3.2.1.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Adapter l'outil au projet et à la méthodologie | A03/A09, classeur et slide 4 : Linear pour statuts/priorités/dépendances, classeur pour charge et coût. | Couverture présente. Expliciter le lien avec Kanban et montrer un ticket relié à un critère ou une décision. |
| b | Choisir des indicateurs mesurables pour délais, coûts et avancement | X Pilotage B7:C19 ; Planning E8:F18 et N8:N18 ; A03. Les slides 7-8 montrent surtout charge et coût. | Montrer aussi un écart calendaire : T06 finit à J12 au lieu de J11, T07 à J14 au lieu de J13. Les +5 h de charge ne sont pas un retard de cinq jours. |
| c | Intégrer avancement, coûts, délais, risques et RH aux tableaux de bord | Avancement/coûts dans Pilotage ; délais dans Planning ; risques dans Risques ; RH dans Pilotage B22:L25. Slides 4-10. | Les cinq dimensions sont présentes. Préparer un exemple d'actualisation et expliquer le rythme de suivi d'A03/A05. |

Le relevé réel de Linear et les estimations fictives restent séparés. Douze tickets Done sur vingt-quatre non annulés ne constituent pas un pourcentage de produit livré. La consultation du classeur réalisée pour cet audit confirme les données enregistrées, pas un nouveau recalcul dans Microsoft Excel.

### C3.2.2 - Procéder aux arbitrages

Attendu : présenter un cas d'arbitrage rencontré au cours du projet. Sources : S1 p. 12 ; S2, ligne C3.2.2.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Exposer le problème et ses conséquences | A04, slides 11-12 : recette perturbée par la compilation à froid ; nouvelle demande dépassant budget et capacité. | Présent. Bien rattacher la conséquence au déroulement du projet. |
| b | Détailler les options possibles | A04 compare retries, préchauffage et standalone, puis ajout, réduction de recette ou report de périmètre. Slide 11 affiche trois options. | Présent. Le candidat doit expliquer aussi le coût ou la limite de l'option retenue. |
| c | Argumenter une décision qui résout le problème | Choix standalone visible dans Git ; report fictif maintenant les critères et la marge du lot. | Présent. Les succès de runs distants restent des résultats historiques rapportés par B2. |

L'intitulé mentionne les outils d'aide à la décision et un logigramme entre parenthèses. A04 possède un tableau comparatif et une logique de décision écrite. Un logigramme court renforcerait la démonstration de la démarche ; la grille ne l'isole pas comme un livrable distinct obligatoirement remis.

### C3.3.1 - Piloter l'équipe

Attendus : affectation des missions, style(s) managérial(aux), outils de communication et objectifs. Sources : S1 p. 12-13 ; S2, ligne C3.3.1.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Prendre en compte les spécificités du handicap | A02/A05 et slides 6/14 : missions, sous-titres, échanges écrits, contrôles prévus avec Camille. | Présent et concret dans le scénario. Les contrôles restent des critères attendus, sans succès réel annoncé. |
| b | Répartir la charge de façon équilibrée | A03 et slide 9 : CP 29/30 h, DEV 64/72 h, QA 24/30 h. | La tension CP est reconnue. Expliquer les limites de capacité et l'action retenue ; une marge positive ne suffit pas à prouver un équilibre satisfaisant. La recette est déjà affectée à QA, elle ne doit pas être racontée comme une nouvelle décharge chiffrée de CP. |
| c | Identifier et décrire le style managérial | A05 et notes slide 13 : participatif, persuasif, directif et délégation. Aucun de ces noms n'apparaît sur la slide 13. | Couvert oralement, à rendre plus visible avec les situations correspondantes. Il n'est pas exigé de prétendre utiliser les quatre styles dans toute situation. |
| d | Présenter des techniques d'animation adaptées | A05 : faits, impacts, écoute, échange préparé et limité dans le temps, autonomie et contrôle ; notes slide 13. | Présent. Montrer une intervention concrète du chef de projet. |
| e | Analyser de façon critique une situation ou posture | A05 et notes slide 13 comparent réponse seulement directive et discussion sans échéance. | Présent. Conserver l'explication des limites et du choix final. |
| f | Proposer des recommandations réalistes et réalisables | A05 prévoit préparation écrite, réunion courte, responsabilité de décision et suivi. | Présent. Ne pas déclarer une amélioration mesurée si elle est seulement prévue. |
| g | Utiliser des outils collaboratifs permettant le partage de ressources | A05 nomme fichiers partagés, décisions et ressources ; Linear et Git sont observables. | Démonstration encore abstraite dans le diaporama. Montrer où trouver critères, CR et prochaine action, avec des liens utilisables. |
| h | Choisir les outils selon leur objectif | D §7/A05 distinguent tâches, changements, décisions et échanges synchrones. | Présent dans le dossier, peu visible à l'écran. Expliquer le choix et l'accès pour l'équipe. |

**Dimension inscrite dans la compétence : contexte multiculturel et international.** A05 mentionne fuseaux, acronymes, écrit et reformulation. La slide 14 ne l'aborde que brièvement dans ses notes. Une situation précise manque encore pour montrer comment adapter langue de travail, horaires ou interprétation d'un désaccord. On peut développer un scénario explicite sans attribuer une nationalité ni un comportement culturel à une personne réelle. Le texte ne fixe pas une nationalité obligatoire dans l'équipe.

### C3.3.2 - Évaluer les besoins en compétences

Attendus : grille commentée des besoins et plan de développement. Sources : S1 p. 13 ; S2, ligne C3.3.2.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Identifier les compétences nécessaires au projet | A06 identifie six lignes de compétences CP/DEV/QA. Les notes de la slide 15 expliquent les besoins prioritaires. | Présent. Conserver le lien besoin du projet / risque / compétence. |
| b | Commenter une grille comparant acquis actuels et cibles | A06 comprend une échelle 0-3, des niveaux et justifications. La slide 15 affiche des barres CP/DEV/QA toutes à 1 puis 2, sans grille détaillée. | Montrer un extrait de la grille avec compétence, niveau actuel, cible et justification. Le graphe actuel peut être compris à tort comme un niveau global par personne. |
| c | Établir et détailler un plan adapté au public | A06 : quatre actions, publics, durées, tâches d'accueil, modalités et critères de réussite. | Présent dans l'annexe. Afficher les actions CP et DEV autant que celle de Camille et préciser les échéances tirées du planning. |
| d | Préconiser des formations selon besoins du projet et profils | Ateliers sur pilotage, concurrence, recette navigateur et clavier. Les ressources du dépôt servent de support. | Présent. Expliquer la modalité de formation retenue et le résultat attendu, sans imposer un organisme externe ou une certification absents des critères. |
| e | Adapter les modalités de formation au handicap | A06 et slide 16 : consignes écrites, démonstration sous-titrée, exercice autonome, adaptation si nécessaire. | Présent. Distinguer problème d'accès à une consigne et besoin technique ; conserver le même objectif professionnel. |

**Dimension inscrite dans la compétence : transmission des besoins de recrutement aux RH.** A06 justifie l'absence de recrutement permanent et prépare une demande conditionnelle. Cette fiche reste générique et n'apparaît pas dans les notes des slides 15-16. Préparer le raisonnement « compétence critique indisponible, formation insuffisante, renfort à demander » et les informations à transmettre. Aucune embauche réelle ni aucun envoi fictivement présenté comme réel n'est nécessaire pour expliquer le cas.

### C3.4.1 - Effectuer les comptes rendus au client

Attendus : comptes rendus des évolutions/améliorations, points de validation et indicateurs de satisfaction. Sources : S1 p. 13-14 ; S2, ligne C3.4.1.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Rédiger des comptes rendus clairs et ordonnés | A07 contient CR01, CR02 et CR03. La slide 17 affiche leurs codes et jalons, pas leur contenu. | Montrer un extrait de CR02 : avancement, écart, décision, responsable, échéance. La simple liste de rendez-vous ne montre pas la qualité du compte rendu. |
| b | Faciliter les décisions du client | CR02 associe 4 465 EUR prévus, risque de dépassement et report des topos. Notes slide 17. | Présent. Faire lire le lien entre information et décision au lieu de seulement citer le numéro du CR. |
| c | Organiser la validation pour suivre qualité, fonctions et délais | A01/A07, J3/J10/J15 et critères d'acceptation. | Présent. Clarifier ce qui est validé à chaque jalon, qui décide et comment une réserve devient une action. |
| d | Définir des indicateurs de satisfaction cohérents | A07 propose méthode, seuil et questionnaire pour quatre indicateurs. Slide 18 affiche leurs noms et insiste surtout sur l'absence de mesure. | Mettre en avant le protocole : quoi mesurer, auprès de qui, quand, avec quel seuil et quelle action. Conserver la mention non mesurée pour les résultats réels. |

La grille demande des indicateurs définis et cohérents. Elle n'impose pas un pourcentage de satisfaction déjà obtenu auprès de clients réels dans un cas fictif. Une valeur inventée et présentée comme observée fragiliserait la preuve ; un calcul d'exemple explicitement simulé peut expliquer la méthode si utile.

### C3.4.2 - Démontrer les fonctionnalités et obtenir la validation

Attendu : démonstration du logiciel par le candidat devant le jury. Sources : S1 p. 14 ; S2, ligne C3.4.2.

| Repère | Critère de la grille, reformulé | Pièce et constat | Ajustement nécessaire ou conseillé |
| --- | --- | --- | --- |
| a | Disposer d'un logiciel utilisable | A08, environnement dédié et résultats de recette datés du 14 septembre. VERIFICATION précise que le matching a changé ensuite. | À vérifier sur la version réellement montrée. Une capture datée et une ancienne réussite de tests ne suffisent pas à attester l'état courant. |
| b | Démontrer les fonctionnalités attendues | Slides 19-21 et A08 : matching, demande, inscription, participants club et clavier ; lien avec les critères du lot et les fonctions du B2. | Parcours préparé. Répéter la manipulation complète et expliciter les fonctions hors démonstration. |
| c | Employer un vocabulaire adapté au client | A08 et notes 20-21 parlent de sortie, place disponible, demande et participant. | Présent. Garder les explications techniques pour les questions si elles ne servent pas la compréhension du résultat. |
| d | Permettre une validation du projet à l'issue de la démo | Notes slide 21 et A07 prévoient critères, réserves et périmètre. La slide 22 bascule surtout vers la maintenance. | Conclure visiblement par critères vérifiés, réserves, décision attendue ; conserver ensuite la transmission au Bloc 4. Aucun accord réel du client ne doit être présumé. |

**Dimension inscrite dans la compétence : dernière version développée.** Identifier le SHA et l'environnement, puis relancer les contrôles adaptés à cette version avant la répétition finale. L'arbre testé du 14 septembre diffère de celui de la révision auditée, comme le signale déjà VERIFICATION.md. Cet audit ne conclut ni à un dysfonctionnement ni à une utilisabilité actuelle.

## Corrections à traiter dans l'ordre

| Priorité de préparation | Action concrète | Critères concernés |
| --- | --- | --- |
| 1 | Reprendre la séquence de planning : vue globale de Spity puis lot détaillé, justification Kanban et outil de planification, phase de mesure clairement visible. | C.3.1 |
| 2 | Montrer la grille de compétences et le plan de formation des trois rôles, avec le cas Camille conservé. | C3.3.2 |
| 3 | Afficher CR02 et le protocole de satisfaction ; terminer la démonstration sur une grille de validation. | C3.4.1 et C3.4.2 |
| 4 | Vérifier et répéter le logiciel sur un SHA identifié après les évolutions du matching. | C3.4.2 |
| 5 | Donner des repères visuels sur les styles de management, le partage des ressources, le contexte international et le besoin RH conditionnel. | C3.3.1 et C3.3.2 |
| 6 | Montrer un écart de date et justifier la maîtrise de la charge CP. | C3.2.1 et C3.3.1 |

Ces améliorations peuvent remplacer des éléments trop généraux dans les slides existantes. Il n'est pas nécessaire d'allonger l'oral : les 30 minutes, dont les 6 minutes de démonstration choisies pour ce support, peuvent rester le cadre. La durée de six minutes n'est pas une obligation officielle.

## Modalités et limites à garder en tête

- S1 p. 11 autorise une mise en situation réelle ou fictive et attend le logiciel développé pendant la formation.
- S3 p. 6 prévoit un oral individuel de 45 minutes : 30 minutes de présentation et 15 minutes d'échange. Aucun nombre de diapositives ni plafond de pages du dossier B3 n'est fixé dans les trois documents examinés.
- S3 p. 8 indique au moins 50 % des compétences acquises et aucune compétence éliminatoire non acquise. Pour sept compétences, atteindre au moins 50 % suppose arithmétiquement au moins quatre compétences. Cela ne signifie pas qu'il faut se préparer seulement à quatre ni que quatre critères suffisent. L'identité d'éventuelles compétences éliminatoires n'est pas établie par la grille fournie.
- S3 p. 6 et 10 renvoie au règlement spécial de certification, non fourni. Ses exigences complémentaires restent à vérifier avec les documents du campus.
- S3 p. 11 prévoit le dépôt des livrables et du support sur DigiformaCertif dans le délai imparti. Cet audit ne procède à aucun dépôt.
- Les divergences de budget du Bloc 1 restent documentées dans COHERENCE_INTER_BLOCS.md. Les coûts du lot B3 ne remplacent pas le budget global.

## Portée de la présente revue

Le travail réalisé est une vérification de couverture et de traçabilité. Les exports restent ceux de la révision 2f644db. Aucune donnée réelle n'a été inventée, aucun statut Linear n'a été modifié et aucun nouveau test applicatif n'a été annoncé. Les recommandations ci-dessus restent à appliquer dans une révision du support.
