"""Distinguish the candidate's actual duration from estimates and simulation."""


def align(slides):
    by = {s['number']: s for s in slides}
    by[3]['transition'] = 'Je distingue maintenant la durée réelle du projet et le scénario de pilotage.'
    by[4].update(
        title='Un an de développement ; un cas fictif de quinze jours',
        script="""J'ai développé Spity sur un an. C'est la durée réelle du projet, depuis son démarrage jusqu'à la version présentée. Le découpage affiché reprend les neuf lots du Bloc 1.

Les quatre-vingt-deux jours-homme correspondent à une estimation de charge du MVP. Ils ne mesurent pas mon temps réellement passé. Une quantité de travail estimée et une durée calendaire sont deux informations différentes. Je ne transforme donc pas cette estimation en calendrier réel.

Pour illustrer le Bloc 3, je présente ensuite un scénario fictif de préparation de démonstration sur quinze jours ouvrés, à partir du logiciel existant. J1 à J15 sont les jours de cet exercice. Les charges, les réunions et le budget associés restent des hypothèses pédagogiques.""",
        source="Durée d'un an confirmée par Dorian le 15 septembre 2026. Dates exactes et temps passé non fournis. Diaporama B1 p. 21 : neuf lots, 82 j-h estimés. Cas B3 : quinze jours ouvrés fictifs.",
        action='Montrer un an de développement réel, puis distinguer la charge estimée et les quinze jours fictifs.',
        nature='Durée réelle déclarée par le candidat ; estimation B1 et scénario fictif B3 distincts',
    )
    by[6]['title'] = 'Scénario fictif : quinze jours de préparation'
    old = 'Ce planning détaille quinze jours ouvrés relatifs.'
    new = "Ce planning est un exercice fictif de préparation de démonstration sur quinze jours ouvrés. Le développement réel de Spity a duré un an."
    by[6]['script'] = by[6]['script'].replace(old, new)
    for n in [3, 4, 6]:
        s = by[n]
        s['spokenWords'] = len((s['script']+' '+s.get('transition', '')).split())
        if 'notes' in s:
            prefix = s['notes'].split('\n\nTEXTE ORAL')[0]
            s['notes'] = (f"{prefix}\n\nTEXTE ORAL\n{s['script']}\n\n"
                          f"GESTE OU MANIPULATION\n{s['action']}\n\n"
                          f"TRANSITION\n{s['transition']}\n\n"
                          f"SOURCE ET NATURE\n{s['nature']}. {s['source']}")
