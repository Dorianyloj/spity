"""Close the coverage audit with explicit evidence and a 30-minute narrative."""
import json
from pathlib import Path

def align(slides):
    root=Path(__file__).resolve().parents[2]
    case=json.loads((root/'docs/rncp/bloc-03/donnees/consolidation.json').read_text(encoding='utf-8'))
    by={s['number']:s for s in slides}
    def update(n,title,script,source,transition='',action='',**extra):
        by[n].update(title=title,script=script.strip(),source=source,transition=transition,action=action,**extra)
    update(3,'Le planning global du Bloc 1',"""
Le diaporama du Bloc 1 prévoit quatre-vingt-deux jours-homme pour le MVP. Je reprends ses neuf lots et leurs charges : cadrage, socle technique, authentification, profils, fil social, répertoire, topos, événements et qualité. Leur total correspond à la référence de lancement.

Je représente ici une séquence pédagogique à cinq jours-homme par semaine. Elle demande seize virgule quatre semaines de capacité. Les barres ne reconstituent pas les dates réellement travaillées. Chaque lot doit produire un résultat vérifiable avant sa clôture.

Le suivi détaillé présenté ensuite porte sur un lot de préparation de démonstration, avec les parcours déjà développés au Bloc 2. Ses jours J1 à J15 désignent des jours relatifs de ce cas. Le budget global reste celui du Bloc 1.
""",'Diaporama B1, p. 21 : 8+6+10+9+12+10+9+8+10=82 j-h. A01 et reference-bloc-01.json. Séquence pédagogique à 5 j-h/semaine, soit 16,4 semaines.', 'Je choisis une méthode adaptée au suivi de ce travail.',action='Lire les neuf lots du Bloc 1, puis distinguer le planning global du suivi détaillé.',nature='C.3.1, neuf lots du diaporama Bloc 1')
    update(4,'Kanban pour suivre, des jalons pour décider',"""
Je retiens Kanban pour le cas : un petit effectif, des priorités évolutives et des retours rapides. La limite de deux tâches de réalisation simultanées réduit la dispersion. Une tâche ne passe à terminé qu'après vérification de ses critères. Des réunions inspirées de Scrum complètent ce flux ; le cycle en V rendrait les retours intermédiaires moins fréquents.

Linear rend visibles les sujets, leurs statuts et leurs dépendances. Le relevé réel du quatorze septembre contient vingt-cinq tickets, dont douze terminés et un annulé. Douze sur vingt-quatre donne cinquante pour cent de tickets, pas cinquante pour cent de produit livré. SPI-27, le service médias, conditionne l'API SPI-15 puis le formulaire SPI-18.

Le planning à barres complète ce flux : il expose les dates, les chevauchements et les conditions de passage. Kanban pilote le travail courant ; les jalons encadrent les engagements. Les critères et comptes rendus sont partagés dans A07, le code dans Git. Ces documents pédagogiques restent distincts des tickets réellement observés dans Linear.
""",'Dossier §3 ; A01/A05/A07/A09. Linear observé le 14 septembre, sans nouvelle modification des tickets. A07 et Git contiennent les ressources réellement consultables.', 'Je zoome maintenant sur le planning du lot.',action='Montrer les statuts, nommer Kanban et retrouver A07 depuis les ressources du dossier.')
    update(5,'Le lot : phases, mesures et dépendances',"""
Ce planning détaille quinze jours ouvrés relatifs. L'étude cadre le besoin. La mesure transforme ce besoin en critères observables, par exemple une seule inscription acceptée sur la dernière place. La conception fixe les responsabilités et les moyens. La réalisation fournit les parcours, la recette mesure leur conformité et la restitution prépare la décision du client.

Le diagramme à barres rend les chevauchements lisibles. Il complète Kanban sans imposer que toutes les activités attendent la fin de la précédente. QA peut préparer et tester les fonctions déjà disponibles. La clôture de la recette dépend toutefois de la stabilisation des événements et des corrections. La démonstration reste prévue à J15, après la recette J14.

Je conserve les dates initiales dans le classeur pour mesurer les dérives. À J10, les événements sont prévus à J12 au lieu de J11 et la recette à J14 au lieu de J13. Chaque glissement vaut un jour. Ce décalage de date est distinct de l'augmentation de charge. A01 conserve les dix tâches et les trente activités estimées sont détaillées dans A09.
""",'A01, A03, A09 et Planning. Étude T01, mesure T02, conception T03, réalisation T04-T06, recette T07/T10, restitution T09.', 'La répartition des missions permet de tenir ces engagements.',action='Lire la phase Mesure, les chevauchements puis les dates initiales et revues.',nature='C.3.1, planning fictif du lot à J10')
    by[7]['script'] += " Les dates évoluent aussi : événements J11 à J12, recette J13 à J14. Dans les deux cas, le retard prévu vaut un jour."
    by[9]['script'] += " CP dépasse l'alerte de 90 %. QA était déjà chargé de la recette."
    update(13,'Des styles adaptés à la situation',"""
Le développeur souhaite ajouter une fonction alors que Camille attend une version stable. Leurs besoins sont différents : faire évoluer le produit et vérifier le périmètre engagé. Je demande les faits, les impacts et l'aide nécessaire avant de choisir une réponse.

La posture participative sert à comparer leurs propositions. La posture persuasive permet d'expliquer au client les conséquences du report. Je reste directif sur les critères critiques de livraison : on ne valide pas une capacité non vérifiée. La délégation porte sur un résultat et un contrôle. DEV choisit l'implémentation ; Camille choisit les cas de recette dans les critères convenus.

Une réponse seulement directive ferait taire le désaccord sans traiter sa cause. Une discussion sans échéance consommerait la faible marge du chef de projet. Je retiens quinze minutes, avec les options préparées par écrit, une autorité de décision identifiée et une prochaine action datée. Je vérifie ensuite l'application de cette décision. Ce fonctionnement donne de l'autonomie à l'équipe tout en protégeant les engagements du lot. Le résultat managérial décrit ici appartient au scénario fictif.
""",'A05, situation de désaccord, styles et analyse critique. Illustration fictive conservée.', 'Ces échanges doivent être accessibles à toute l’équipe.',action='Associer chaque style à une action, puis expliquer la limite d’une réponse seulement directive.')
    update(14,'Camille et une équipe à distance',"""
Camille est notre testeuse QA malentendante fictive. Nous convenons de supports écrits, de sous-titres testés et d'une seule personne qui parle à la fois. La synthèse conserve l'action, le responsable et l'échéance. La formation utilise des consignes écrites et une démonstration sous-titrée.

Dans le même scénario, le développeur travaille depuis Montréal, tandis que CP et Camille sont à Paris. L'invitation indique les deux fuseaux et propose un créneau commun. Comme la maîtrise du français peut varier, j'utilise un résumé simple et un glossaire français-anglais. DEV peut transmettre son avis par écrit avant la décision. Je ne déduis pas un accord du silence ou d'une différence de style d'expression.

Le contrôle porte sur l'accès à l'information : reformuler une consigne à J3, retrouver une décision à J10, réaliser un cas sans aide à J14. Les résultats restent à constater. Si les sous-titres ou une formulation ne suffisent pas, je reprends par écrit et ajuste les modalités avec la personne. Le compte rendu partagé devient la référence commune.
""",'A02/A05/A06 ; inclusion.json et consolidation.json. Camille et le contexte Paris/Montréal sont fictifs ; aucune nationalité ou situation réelle inférée.', 'Je compare ensuite les compétences disponibles aux besoins du projet.',action='Présenter les adaptations de Camille puis le cas Paris/Montréal et le contrôle commun.',nature='C3.3.1, handicap et contexte international simulés')
    update(15,'La grille des compétences du lot',"""
Cette grille compare une compétence précise à un niveau attendu. Zéro signifie non abordé, un réalisé avec accompagnement, deux autonome sur un cas courant et trois capable de traiter les cas complexes. Les niveaux sont ceux de l'exercice fictif, pas des évaluations réelles des personnes.

Le chef de projet progresse sur le suivi des écarts. DEV doit sécuriser les inscriptions concurrentes. Camille doit rendre la recette navigateur et le contrôle clavier reproductibles. L'animation et le développement typé sont maintenus au niveau deux dans le cas.

Je commente l'écart avec un exemple observable : expliquer pourquoi une seule demande obtient la dernière place. Une note globale par personne masquerait ce besoin. L'objectif reste la compétence utile au projet, indépendamment de la situation de handicap.
""",'A06 : six compétences et échelle 0-3. Besoins et niveaux simulés.', 'Chaque écart conduit à une action de formation ciblée.',action='Commenter une ligne complète : rôle, compétence, niveau actuel et cible.')
    update(16,'Un plan de formation pour chaque rôle',"""
Les six heures de formation sont déjà comprises dans les tâches. À J3, le chef de projet consacre une heure au tableau de bord et doit expliquer un écart recalculé. DEV dispose de deux heures pendant T06, entre J9 et J12, pour pratiquer les inscriptions concurrentes. Camille dispose de trois heures dans T07, entre J10 et J14 : deux pour la recette navigateur et une pour le clavier.

Les ateliers commencent par une pratique accompagnée, puis un cas autonome. Camille reçoit des consignes écrites et une démonstration sous-titrée. Si le support est inaccessible, on le corrige ; si la difficulté reste technique, on ajuste l'accompagnement. Soixante euros de ressources sont prévus dans le budget fictif.

À J12, si une compétence critique reste indisponible, CP prépare une demande de renfort aux RH. La fiche précise mission, délai, exercice de sélection et coût maximal. L'annexe présente une variante chiffrée qui doit être arbitrée avant engagement. Elle n'est pas activée dans le budget de base et aucune demande réelle n'est envoyée.
""",'A06 et consolidation.json. Formation CP 1 h/T03, DEV 2 h/T06, QA 3 h/T07. Variante RH séparée, annexe 25.', 'Le client reçoit ensuite un compte rendu qui permet de décider.',action='Lire les trois actions et leurs critères de réussite, puis indiquer le déclencheur RH.',nature='C3.3.2, formations et besoin RH simulés')
    update(17,'CR02 : une décision à J10',"""
Voici un extrait du compte rendu pédagogique adressé à Claire Martin, pour le Collectif Altitude Grimpe. Il reprend le même commanditaire fictif que le Bloc 1. Les points de validation ont lieu à J3 pour le périmètre, à J10 pour les écarts et à J15 pour la démonstration.

À J10, les événements glissent de J11 à J12. La prévision atteint quatre mille quatre cent soixante-cinq euros, avec deux cent trente-deux euros sous le plafond. Ajouter les contributions aux topos dépasserait le budget et la capacité DEV. Le client fictif retient donc le report de cette demande, avec maintien des critères de recette.

Le compte rendu rend les actions vérifiables : DEV termine T06 à J12, QA clôt la recette après corrections à J14 et CP prépare la validation J15. Chacun retrouve le même document dans A07. Les évolutions, le risque, la décision, les responsables et les échéances restent liés. Une réserve devient une tâche suivie, et non une remarque oubliée. Cet exemple montre la forme d'un échange client utile ; il ne prouve pas un accord réellement obtenu.
""",'A07 CR02, A01, A04. Document partagé accessible dans le dépôt ; compte rendu et accord client fictifs.', 'Je complète cette validation par un protocole de satisfaction.',action='Montrer l’écart, la décision et les responsables ; ouvrir A07 si le jury demande le compte rendu complet.')
    update(18,'Mesurer la satisfaction et agir',"""
À J15, je prévois une session pilote fictive avec deux grimpeurs et un représentant de club. Aucun participant n'a réellement été recruté pour cette mesure. Les résultats restent non mesurés.

Je relève la part de critères critiques acceptés, avec une cible de cent pour cent. Je compte les parcours réussis sans aide, avec une cible de quatre-vingts pour cent. L'utilité attendue est au moins quatre sur cinq et aucun blocage critique ne doit rester ouvert.

Chaque résultat indique sa date, son effectif et sa méthode. Un faible effectif ne représente pas tous les utilisateurs. Sous le seuil, je qualifie l'obstacle, affecte une correction et vérifie le parcours à nouveau. Les tests techniques ne remplacent pas cette appréciation du besoin par les utilisateurs.
""",'A07 : définitions, seuils et questionnaire ; consolidation.json : effectif prévu uniquement, résultats null.', 'Je montre maintenant le parcours qui sera évalué.',action='Lire un indicateur avec son calcul et son seuil, puis expliquer l’action déclenchée.')
    update(22,'Les critères de validation du parcours',"""
Je termine par les critères annoncés : trouver un partenaire adapté, comprendre l'état de la demande, confirmer une inscription et retrouver le participant côté club. Je rappelle les contrôles montrés au clavier ainsi que la portée des preuves de capacité.

Pour chacun, la décision attendue est accepté, accepté avec réserve ou refusé. Le constat doit correspondre à ce qui a réellement été observé pendant la démonstration. Si une fonction n'a pas été parcourue ou un contrôle a échoué, je l'indique et je conserve la réserve avec son responsable et sa prochaine vérification.

Je demande alors si ce périmètre répond aux critères convenus. Les réserves alimentent le suivi de maintenance du Bloc 4 avec la version identifiée. Aucun accord réel n'est prérempli au nom du client.
""",'A07 grille de validation ; A08 ; Bloc 4 suivi des réserves et anomalies.', 'Je suis prêt à répondre aux questions et à retrouver les preuves.',action='Demander la décision sur les critères. Terminer à 30:00.',nature='C3.4.2, décision attendue après démonstration')
    update(23,'Annexe : responsabilités du lot','La matrice RACI distingue réalisation, décision, consultation et information. Une seule autorité A est retenue par activité. Camille est le rôle QA fictif. Les aménagements modifient les échanges, sans retirer sa responsabilité de recette.','A02, matrice RACI du scénario.',nature='Annexe, organisation fictive')
    update(25,'Annexe : demande de renfort aux RH','Si une compétence critique reste indisponible à J12, le scénario prévoit une demande au service RH fictif. Quatre heures de spécialiste à 45 euros ajoutent 180 euros, et une demi-heure de CP ajoute 22,50 euros. La prévision de cette variante devient 4 667,50 euros, soit 29,50 euros sous le plafond. La disponibilité J12-J13, le devis et le résultat attendu restent à confirmer. Cette variante indépendante n’est ni activée dans le classeur de base ni présentée comme une embauche réelle.','A06 et consolidation.json, variante RH non activée.',nature='Annexe, demande et devis pédagogiques')
    assert sum(x['personDays'] for x in case['globalPlanning']['sequence'])==82
