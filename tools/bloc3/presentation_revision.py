"""Add the agenda after content enrichment, keeping stable layout identifiers."""


def align(slides):
    by = {s['number']: s for s in slides}
    by[2]['transition'] = 'Je reprends ensuite le planning global défini dans le Bloc 1.'
    by[6]['script'] = """Dans le scénario, le chef de projet organise, le développeur réalise et Camille prépare les tests. QA signifie assurance qualité ; son rôle consiste ici à vérifier les parcours et leurs critères. Camille est une testeuse malentendante fictive. Elle intervient sur T02 et T07, selon ses compétences, avec vingt-quatre heures prévues pour trente disponibles.

Les consignes sont écrites, les réunions sous-titrées et les décisions accessibles après chaque échange. Une heure de préparation est déjà comprise dans le pilotage. Le tableau des responsabilités précise qui réalise et qui décide.

Nous utilisons un ordinateur, un navigateur et une base locale pour développer et tester. Linear suit les tâches, Git conserve les versions et les documents partagés gardent les décisions. Le budget présenté ensuite valorise les moyens du cas."""
    by[6]['source'] += ' A02 : moyens matériels, logiciels et collaboration. Rôles CP/DEV/QA/CL du scénario.'
    by[11]['minutes'] = 1.5
    by[11]['script'] = """Cet exemple part d'un problème technique documenté dans le Bloc 2. Les compilations du serveur de développement perturbaient la recette navigateur. Il fallait rendre les tests plus proches du logiciel livré.

Je compare trois options. Augmenter les délais ou ajouter des tentatives est rapide, mais peut masquer la cause. Préchauffer les routes réduit les compilations pendant les tests, à condition d'avoir préparé toutes les routes utiles. Tester le serveur standalone issu du build demande une construction préalable, mais rapproche la recette du livrable.

Le commit visible dans Git retient cette troisième option et ajuste aussi localhost pour les sessions. Le dossier historique rapporte une exécution réussie après consolidation. La comparaison des options est mon analyse rétrospective ; elle n'est pas un compte rendu rédigé le jour de la décision. Les résultats gardent leur version et leur date.

Ce cas montre comment je justifie un choix : je pars du problème, j'examine les conséquences des options et je relie la solution au résultat attendu."""
    agenda = {
        'number': 0, 'title': 'Sommaire', 'minutes': 0.5,
        'nature': 'Le déroulé de la présentation', 'layout': 'agenda',
        'content': {'items': [
            ['01', 'Le projet Spity', '01:00 à 03:00'],
            ['02', 'Organiser le travail', '03:00 à 07:00'],
            ['03', 'Suivre et décider', '07:00 à 15:00'],
            ['04', "L'équipe et le client", '15:00 à 23:00'],
            ['05', 'Démontrer et valider', '23:00 à 30:00'],
        ]},
        'script': "Je commence par le besoin et le projet Spity. Je présente ensuite l'organisation du travail, puis le suivi et les décisions prises dans le scénario. J'explique comment accompagner l'équipe et échanger avec le client. À vingt-trois minutes, je passe à l'application pour montrer le parcours, puis faire le bilan des critères vérifiés.",
        'source': 'Ordre du support et repères de répétition. Trente minutes, dont six minutes de démonstration.',
        'action': 'Annoncer les cinq parties sans détailler encore les chiffres.',
        'transition': 'Je commence par le besoin utilisateur.', 'demo': False,
    }
    slides.insert(1, agenda)
    for number, slide in enumerate(slides, 1):
        slide['contentNumber'] = slide['number']
        slide['number'] = number
    assert len(slides) == 26 and sum(s['minutes'] for s in slides) == 30
