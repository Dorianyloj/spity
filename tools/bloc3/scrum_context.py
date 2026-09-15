"""Add Scrum-inspired meeting routines without claiming historical Scrum adoption."""
import json
from pathlib import Path

def align(slides):
    root=Path(__file__).resolve().parents[2]
    data=json.loads((root/'docs/rncp/bloc-03/donnees/rituels.json').read_text(encoding='utf-8'))
    by={s['number']:s for s in slides}
    by[4].update(title='Le suivi : Linear et les rituels Scrum',nature='Linear observé et réunions du scénario fictif',script="""Pour suivre le projet, le scénario combine un tableau Kanban dans Linear et des réunions inspirées de Scrum. Le tableau limite la réalisation à deux tâches simultanées. Les critères de recette conditionnent le passage à terminé. Les réunions donnent un rythme commun aux échanges.

À J3, le planning précise l'objectif du lot, les tâches retenues et la capacité disponible. Chaque jour, le daily dure dix minutes : où en sommes-nous, quel obstacle faut-il lever et quelle action adapter ? Le diagnostic technique se poursuit ensuite avec les personnes concernées. À J10 et J15, la review confronte les parcours aux attentes du client. Après la dernière revue, la rétrospective choisit une amélioration de notre fonctionnement.

Cette organisation est adaptée au lot de quinze jours. Elle ne revendique pas l'application complète du cadre Scrum. Linear conserve ses données réellement observées : douze tickets terminés sur vingt-quatre non annulés, sans pondération. Les dépendances médias, API et formulaire restent visibles. A05 détaille les réunions et A07 conserve les comptes rendus du cas. Une réunion doit conduire à une action retrouvable.""",source='A01/A05/A07 ; rituels.json. Linear observé le 14 septembre 2026. Guide Scrum 2020, p. 9-10 : '+data['source'],action='Associer chaque rituel à son objectif et à sa trace. Distinguer le flux Linear observé des réunions du scénario.',transition='Le planning montre les phases et les rendez-vous du lot.')
    by[5]['script']=by[5]['script'].replace('Il complète Kanban sans imposer', 'Il complète le tableau Kanban et les réunions sans imposer')
    by[5]['source']+=' A05 : planning J3, reviews J10/J15 et rétrospective J15.'
    by[13]['script']=by[13]['script'].replace('Je vérifie ensuite l\'application de cette décision. Ce fonctionnement donne de l\'autonomie à l\'équipe tout en protégeant les engagements du lot. Le résultat managérial décrit ici appartient au scénario fictif.', 'La rétrospective J15 complète cette analyse : nous séparons le daily des diagnostics techniques. CP vérifie cette amélioration aux trois premiers points du prochain lot. Cette décision appartient au scénario fictif.')
    by[13]['source']+=' A05, RT01 : amélioration du daily lors de la rétrospective J15.'
    by[17].update(title='Review J10 : une décision dans CR02',script="""La review est un échange sur le produit avec Claire Martin, pour le Collectif Altitude Grimpe. Dans le scénario, nous regardons les parcours disponibles et leurs critères, puis nous adaptons les priorités. Le planning J3 fixe le périmètre. Les reviews J10 et J15 organisent les retours intermédiaires puis la validation du parcours démontré.

À J10, le matching est disponible dans le cas, mais les événements restent à stabiliser. Leur fin glisse de J11 à J12. La prévision atteint quatre mille quatre cent soixante-cinq euros, avec deux cent trente-deux euros sous le plafond. La nouvelle demande de contributions aux topos dépasserait le budget et la capacité DEV. Le client fictif retient son report, en conservant les critères de recette.

CR02 garde la trace de cette décision. DEV termine T06 à J12, Camille clôt la recette après corrections à J14 et CP prépare la validation J15. Le document partagé relie l'écart, le choix et la prochaine action. La rétrospective examine ensuite notre façon de travailler, tandis que la review porte sur le produit. Les comptes rendus décrivent un exercice pédagogique, sans accord client réel attesté.""",source='A05, protocole des reviews ; A07, CR02 ; rituels.json. Compte rendu et accord client fictifs.',action='Montrer le résultat présenté, la décision issue du retour client et les actions datées.',transition='Les retours du client sont aussi suivis par un protocole de satisfaction.')
    assert [x['id'] for x in data['events']]==['planning','daily','review','retro']
