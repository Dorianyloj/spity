"""Document the observed Linear snapshot and explain the teaching case estimates."""
from pathlib import Path
import json
from collections import Counter

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/rncp/bloc-03'

def write(name, content):
    (DOCS/name).write_text(content.strip()+'\n', encoding='utf-8', newline='\n')

def table(headers, rows):
    return '\n'.join(['| '+' | '.join(headers)+' |', '| '+' | '.join(['---']*len(headers))+' |']+['| '+' | '.join(map(str,r))+' |' for r in rows])

def main():
    # Transcription of the authenticated Linear board read on 14 September.
    # No undocumented API, inferred completion date or invented estimate.
    raw = [
        (5,'Prisma schema User + Club','Canceled','Urgent','spity-001-prisma-schema-user-club'),
        (6,'JWT auth grimpeur/club','Todo','High','spity-002-jwt-auth-grimpeurclub'),
        (7,'Login/register pages','Done','High','spity-003-loginregister-pages'),
        (8,'Docker compose Next+MariaDB+phpMyAdmin','Done','Urgent','spity-004-docker-compose-nextmariadbphpmyadmin'),
        (9,'Drizzle schema initial','Done','Urgent','spity-005-drizzle-schema-initial'),
        (10,'GitHub Actions CI/CD','Done','Medium','spity-006-github-actions-cicd'),
        (11,'CRUD profil grimpeur (disciplines, niveaux, matos)','Todo','High','spity-007-crud-profil-grimpeur-disciplines-niveaux-matos'),
        (12,'CRUD profil club (coachs, validation)','Backlog','Medium','spity-008-crud-profil-club-coachs-validation'),
        (13,'Page profil grimpeur + édition','Done','High','spity-009-page-profil-grimpeur-edition'),
        (14,'Page profil club','Done','Medium','spity-010-page-profil-club'),
        (15,'CRUD Post (texte, media, tags, cotation)','Todo','High','spity-011-crud-post-texte-media-tags-cotation'),
        (16,'Likes + commentaires','Backlog','Medium','spity-012-likes-commentaires'),
        (17,'Feed principal (posts + events épinglés)','Backlog','High','spity-013-feed-principal-posts-events-epingles'),
        (18,'Create post + upload images','Todo','High','spity-014-create-post-upload-images'),
        (19,'Modèles Salle/Falaise (géoloc)','Backlog','High','spity-015-modeles-sallefalaise-geoloc'),
        (20,'Modèle Voie + topos (cotation, état)','Done','Medium','spity-016-modele-voie-topos-cotation-etat'),
        (21,'Carte interactive salles/falaises/clubs','Backlog','Medium','spity-017-carte-interactive-sallesfalaisesclubs'),
        (22,'Fiche falaise + topos collaboratifs','Backlog','Medium','spity-018-fiche-falaise-topos-collaboratifs'),
        (23,'CRUD Event club (inscriptions, capacité)','Done','Medium','spity-019-crud-event-club-inscriptions-capacite'),
        (24,'Club dashboard (stats, events)','Backlog','Medium','spity-020-club-dashboard-stats-events'),
        (25,'Calendrier events + inscription','Done','Medium','spity-021-calendrier-events-inscription'),
        (26,'Club dashboard','Done','Medium','spity-022-club-dashboard'),
        (27,'Upload media sécurisé','In Progress','High','spity-023-upload-media-securise'),
        (28,'Tests unitaires critiques (auth, posts)','Done','Low','spity-024-tests-unitaires-critiques-auth-posts'),
        (29,'Sécurité OWASP + accessibilité RGAA','Done','Low','spity-025-securite-owasp-accessibilite-rgaa'),
    ]
    issues=[dict(id=f'SPI-{n}', title=f'SPITY-{n-4:03}: {title}',status=status,priority=priority,assignee=None if n==5 else 'dorian joly',url=f'https://linear.app/spitywa/issue/SPI-{n}/{slug}') for n,title,status,priority,slug in raw]
    details={
        'SPI-27': 'Description lue : service média privé implémenté au commit bafa599. Migration MariaDB et persistance du volume cible restent à valider avant clôture. Intégration avatar/posts et règles de partage restent distinctes. Statut In Progress.',
        'SPI-15': 'Description lue : modèle et lecture existants. API de création, modification et suppression des posts, contrôle propriétaire, validation et tests restent à fournir. Dépendance média SPI-27.',
        'SPI-18': 'Description lue : formulaire de publication, aperçu, erreurs, envoi et actualisation du fil. Dépend de SPI-15 et SPI-27, puis recette de bout en bout.',
        'SPI-6': 'Description lue : connexion et JWT existent. Renouvellement, rotation et révocation des sessions restent dans le périmètre du ticket.',
    }
    snapshot=dict(observedDate='2026-09-14',source='https://linear.app/spitywa/team/SPI/all',method='Transcription du tableau authentifié via navigateur ; lecture détaillée de SPI-27, SPI-15, SPI-18 et SPI-6.',nature='Observation des statuts Linear, pas nouvelle validation fonctionnelle du code',issues=issues,detailSummaries=details,counts=dict(Counter(i['status'] for i in issues)),caveat='Les descriptions détaillées datent du 9 septembre. Aucun délai, estimation, temps passé ni taux de livraison pondéré extrait. Les liens Related ne sont pas assimilés à une relation native blocks.')
    write('donnees/linear-2026-09-14.json',json.dumps(snapshot,ensure_ascii=False,indent=2))
    data=json.loads((DOCS/'donnees/pilotage.json').read_text(encoding='utf-8'))
    # Each tuple is: deliverable, initial estimate, simulated effort at J10, remaining estimate.
    work={
        'T01':[('Cadrer les deux parcours',2,2,0),('Fixer inclusions et exclusions',2,2,0),('Préparer les critères de décision',2,2,0)],
        'T02':[('Écrire les cas grimpeur',3,3,0),('Écrire les cas club',3,3,0),('Définir les critères accessibles',2,2,0)],
        'T03':[('Décomposer le lot',2,2,0),('Ajuster les dépendances de recette',2,3,0),('Affecter les responsabilités',2,2,0)],
        'T04':[('Vérifier les contrats accès et profils',6,6,0),('Stabiliser les contrôles de rôles',7,8,0),('Rejouer les cas de session et profil',5,6,0)],
        'T05':[('Préparer les cas de compatibilité',5,5,0),('Stabiliser filtres et demande partenaire',7,7,0),('Vérifier le parcours partenaire',4,4,0)],
        'T06':[('Préparer les règles événement',6,6,0),('Stabiliser capacité et inscriptions',8,4,6),('Contrôler les participants autorisés',4,0,4)],
        'T07':[('Préparer jeux de données et recette',4,4,0),('Rejouer les parcours et les limites',6,0,7),('Contrôler clavier, erreurs et retours',4,0,5)],
        'T08':[('Suivre charges et dépendances',3,3,0),('Préparer la revue et arbitrer',3,3,0),('Formaliser réserves et validation',2,0,2)],
        'T09':[('Construire le support de restitution',3,0,3),('Répéter le parcours et les secours',3,0,3),('Préparer la transmission maintenance',2,0,2)],
        'T10':[('Corriger les défauts bloquants du cas',4,0,3),('Rejouer les tests de non-régression',4,0,3),('Documenter les réserves',2,0,2)],
    }
    links={'T01':[],'T02':[],'T03':[],'T04':['SPI-6','SPI-13','SPI-14'],'T05':[],'T06':['SPI-23','SPI-25','SPI-26'],'T07':['SPI-28','SPI-29'],'T08':[],'T09':[],'T10':['SPI-23','SPI-29']}
    wbs=[]
    for task in data['tasks']:
        task['linearReferences']=links[task['id']]
        for j,(label,planned,spent,remaining) in enumerate(work[task['id']],1):
            wbs.append(dict(id=f"{task['id']}.{j}",task=task['id'],role=task['role'],deliverable=label,plannedHours=planned,spentHours=spent,remainingHours=remaining))
        for field in ['plannedHours','spentHours','remainingHours']:
            assert sum(x[field] for x in wbs if x['task']==task['id'])==task[field]
    data['estimateDetails']=wbs
    data['estimateMethod']='Décomposition pédagogique en 30 activités de 2 à 8 heures, revue par livrable. Référence conservée, consommé simulé à J10 et reste à faire réestimé séparément. Les renvois SPI donnent le contexte produit sans impliquer une équivalence de périmètre ou un effort historique.'
    data['costAssumptions']={'rates':'CP 45, DEV 35, QA 30 EUR/h : hypothèses de valorisation pédagogique, pas salaires ni tarifs de marché.','capacity':'CP 30 h, DEV 72 h, QA 30 h sur le lot ; réservations de capacité fictives, pas trois salariés observés.','expenses':'Infrastructure : hypothèse 3 unités à 40 EUR, revue à 3 unités à 46,67 EUR arrondies à 140 EUR. Formation : ressource pédagogique 60 EUR. Aucune facture.','training':'Les 6 h de formation sont incluses dans T03 (CP 1 h), T06 (DEV 2 h) et T07 (QA 3 h).','scope':'Reconstitution pédagogique de stabilisation des parcours existants. Le lot ne prétend pas réaliser les 12 tickets ouverts ni le développement complet du MVP.'}
    data['sensitivity']=[dict(label=label,cp=cp,dev=dev,qa=qa) for label,cp,dev,qa in [('Prévision J10',0,0,0),('Recette +6 h',0,0,6),('DEV +8 h',0,8,0),('CP +2 h',2,0,0),('Topo +16 h',0,12,4)]]
    write('donnees/pilotage.json',json.dumps(data,ensure_ascii=False,indent=2))
    rows=[[x['id'],x['status'],x['priority'],x['title']] for x in issues]
    text='# A09 - Données de pilotage et rapprochement Linear\n\n## 1. Observation du 14 septembre 2026\n\n'
    text+='Le tableau Linear authentifié de l’équipe Spity contient 25 tickets : 12 Done, 4 Todo, 1 In Progress, 7 Backlog et 1 Canceled. Les 24 non annulés sont affectés à dorian joly. Lecture directe du tableau et de quatre fiches, conservée dans donnees/linear-2026-09-14.json avec leurs URL. Aucun statut n’a été modifié pour améliorer un indicateur.\n\n'
    text+='Source : https://linear.app/spitywa/team/SPI/all. Ce relevé est une transcription structurée, pas un export exhaustif de l’historique Linear.\n\n'
    text+=table(['ID','Statut observé','Priorité','Intitulé'],rows)+'\n\n'
    text+='## 2. Indicateurs réellement calculables\n\n'
    text+=table(['Indicateur','Calcul','Interprétation'],[['Tickets clos, hors annulé','12 / 24 = 50 %','Comptage non pondéré ; pas 50 % du produit livré.'],['Tickets ouverts','4 + 1 + 7 = 12','Reste de périmètre dans ce tableau.'],['Travail en cours','1 ticket','SPI-27 ; 1 / 2 de la limite proposée pour le cas.'],['Ouverts prioritaires High','7 / 12 = 58,3 %','SPI-6, 11, 15, 17, 18, 19 et 27.'],['Affectation nominale','24 / 24 non annulés','Un nom dans Linear ne prouve pas une équipe complète.']])+'\n\n'
    text+='L’archive du 9 septembre indiquait 5 Todo et aucun In Progress. Le relevé actuel indique 4 Todo et 1 In Progress. Cette différence entre deux photographies ne reconstitue pas les transitions exactes ni leur date. Aucun débit hebdomadaire, vélocité, temps de cycle ou burndown réel n’est calculé sans historique suffisant.\n\n'
    text+='## 3. Une dépendance qui détermine la priorité\n\n'
    text+='Le chemin décrit dans les fiches est SPI-27 (médias), puis SPI-15 (API Post), puis SPI-18 (formulaire et recette). SPI-18 dépend aussi directement du service média. La relation native affichée est Related ; la dépendance fonctionnelle vient du texte des fiches.\n\n'
    text+='\n\n'.join(f'**{key}** - {value}' for key,value in details.items())+'\n\n'
    text+='Décision de pilotage proposée : demander la preuve de migration et de persistance cible de SPI-27 avant sa clôture, puis réexaminer SPI-15 et SPI-18. Les tests unitaires du service ne suffisent pas à déclarer tout le parcours publication livré. Ce dossier ne rejoue pas cette validation et ne change pas le statut du ticket.\n\n'
    text+='Le matching démontré dans B2/B3 n’a pas de ticket dédié identifié parmi ces 25 intitulés. Il reste sourcé dans le dossier B2 et le code. Les autres renvois SPI ci-dessous sont des liens de contexte, pas la preuve que le lot pédagogique correspond aux heures enregistrées sur ces tickets.\n\n'
    text+='## 4. Construction des 112 heures du cas\n\n'+data['estimateMethod']+'\n\n'
    text+=table(['Tâche','Détail initial en heures','Total','Référence de contexte'],[[t['id'],' + '.join(str(x['plannedHours'])+' h '+x['deliverable'].lower() for x in wbs if x['task']==t['id']),t['plannedHours'],', '.join(t['linearReferences']) or 'Dossier B1/B2/B3'] for t in data['tasks']])+'\n\n'
    text+='Les 30 activités sont disponibles ligne à ligne dans la feuille Estimations du classeur, avec leur consommé simulé et leur reste à faire. Les totaux de la feuille Planning sont calculés à partir de ces lignes. La formation est déjà incluse : 1 h CP dans T03, 2 h DEV dans T06 et 3 h QA dans T07.\n\n'
    text+='## 5. Explication des écarts à J10\n\n'
    text+=table(['Cause du scénario','Écart h','Effet coût','Réponse'],[['T03 : dépendances de recette à préciser',1,'+45 EUR','Revoir les prérequis et réserver le jalon.'],['T04 : contrôles de rôles et sessions',2,'+70 EUR','Conserver les cas de refus et de session.'],['T06 : capacité et participants',2,'+70 EUR','Protéger le contrôle de capacité.'],['T07 : recette et accessibilité',2,'+60 EUR','Allonger la vérification de 2 h.'],['T10 : corrections réestimées',-2,'-70 EUR','Hypothèse de moins de reprises, à surveiller.'],['Infrastructure : hypothèse révisée',0,'+20 EUR','Actualiser le poste de frais.'],['Total','+5 h','+195 EUR','112 h deviennent 117 h ; 4 270 EUR deviennent 4 465 EUR.']])+'\n\n'
    text+='Les 77 h consommées représentent 65,8 % des 117 h prévues à terminaison. Il s’agit d’une consommation de charge et pas d’un taux d’avancement physique. Cinq tâches terminées sur dix ne valent pas 50 % du travail réalisé, car leurs tailles diffèrent. Le consommé économique du cas atteint 2 945 EUR ; le reste à engager vaut 1 520 EUR, frais inclus.\n\n'
    text+='## 6. Tests de sensibilité du lot\n\n'
    sensitivity=[]
    for x in data['sensitivity']:
        cost=4465+45*x['cp']+35*x['dev']+30*x['qa']
        load=(29+x['cp'],64+x['dev'],24+x['qa'])
        alert='Capacité CP dépassée' if load[0]>30 else 'Capacité DEV dépassée' if load[1]>72 else 'Capacité QA dépassée' if load[2]>30 else 'Capacités respectées'
        sensitivity.append([x['label'],cost,4697-cost,alert])
    text+=table(['Hypothèse isolée','Prévision EUR','Marge EUR','Capacité'],sensitivity)+'\n\n'
    text+='Chaque ligne modifie seulement la prévision J10 ; les scénarios ne se cumulent pas. Avec 8 h DEV de plus, le budget dépasse le plafond de 48 EUR malgré une capacité DEV encore respectée. Avec 2 h CP de plus, le budget reste admissible mais CP dépasse sa capacité d’une heure. Le pilotage doit donc examiner les deux contraintes.\n\n'
    text+='## 7. Règles de qualité des données\n\n'
    text+='Chaque donnée porte une nature : observation Linear datée, preuve technique datée, hypothèse de scénario ou résultat calculé. Les taux et capacités ne sont pas présentés comme un benchmark de marché. Les objectifs de satisfaction restent des objectifs sans questionnaire réalisé. Les comptes rendus fictifs n’attestent ni accord réel ni signature. Une mise à jour du backlog demande un nouveau relevé daté ; elle ne doit jamais écraser cette photographie.\n'
    write('annexes/A09_DONNEES_LINEAR.md',text)
    print(json.dumps({'linear':snapshot['counts'],'estimateLines':len(wbs),'tasks':len(data['tasks'])}))

if __name__=='__main__': main()
