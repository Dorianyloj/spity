# Guide de répétition — Bloc 3 Spity

Support associé : soutenance-bloc-03-spity.pptx. Quinze diapositives principales couvrent trente minutes, démonstration comprise. Les trois dernières sont des annexes de secours ou de réponse aux questions ; elles ne prolongent pas la présentation.

## Fil conducteur

Expliquer comment organiser et sécuriser la livraison d'un parcours utile : trouver un partenaire puis participer à une sortie organisée par un club. Annoncer dès le début la distinction entre le logiciel et ses preuves réelles, l'analyse historique et la mise en situation fictive de pilotage.

Les notes ci-dessous servent à préparer une explication personnelle. Elles ne constituent pas un texte à réciter. Le rôle personnel et les échanges réels doivent être précisés avec le candidat avant la remise.

## Repères de temps

| Slide | Sujet | Durée | Temps cumulé |
| --- | --- | --- | --- |
| 1 | Spity - Coordonner et piloter | 00:30 | 00:30 |
| 2 | Un parcours pour préparer une sortie | 01:30 | 02:00 |
| 3 | Kanban et des jalons de validation | 01:30 | 03:30 |
| 4 | Un planning de quinze jours ouvrés | 01:30 | 05:00 |
| 5 | Des responsabilités explicites | 01:00 | 06:00 |
| 6 | À J10, la prévision atteint 117 heures | 02:00 | 08:00 |
| 7 | Surveiller la charge et les risques | 02:00 | 10:00 |
| 8 | Arbitrage réel : tester le standalone | 02:00 | 12:00 |
| 9 | Arbitrage de périmètre à J10 | 01:00 | 13:00 |
| 10 | Adapter le management à la situation | 02:00 | 15:00 |
| 11 | Une décision comprise et retrouvable | 02:00 | 17:00 |
| 12 | Former sur les écarts utiles au projet | 03:00 | 20:00 |
| 13 | Le client valide des critères explicites | 03:00 | 23:00 |
| 14 | Démonstration : préparer une sortie | 06:00 | 29:00 |
| 15 | Des décisions reliées à leurs preuves | 01:00 | 30:00 |

À 13:00, terminer l'arbitrage de périmètre. À 23:00, quitter le suivi client pour lancer les six minutes de démonstration. À 29:00, revenir au bilan. Si une explication dépasse, condenser un exemple ; ne pas supprimer entièrement une compétence ni la démonstration.

## Notes par diapositive

### 1. Spity - Coordonner et piloter

Nature : Introduction.

Durée : 30 secondes. Présenter le sujet et annoncer le fil conducteur : organiser une sortie avec un partenaire et un club. La présentation combine le logiciel et ses traces réelles avec un cas pédagogique de pilotage explicitement fictif. Ne pas présenter les rôles fictifs comme des collègues réels. Source : référentiel Bloc 3 p. 11-14. Visuel : fichier de marque existant du dépôt Spity, utilisé comme illustration et non comme photo de l’équipe.

### 2. Un parcours pour préparer une sortie

Nature : Produit réel et cas pédagogique.

Durée : 1 min 30. Expliquer les deux utilisateurs, grimpeur et club. Le grimpeur recherche un partenaire et un événement ; le club gère sa sortie et ses participants. Les critères sont le matching, la traçabilité de la demande, la capacité et les droits du club. Distinguer la partie observée, la partie historique et la simulation. Les comptes de démonstration ne sont pas des personnes interrogées. Sources : dossier §1-2 ; cahier de recettes Bloc 2 ; vérification courante.

### 3. Kanban et des jalons de validation

Nature : C.3.1 · Simulation pédagogique.

Durée : 1 min 30. Le choix Kanban est proposé pour un petit effectif et un flux variable. Deux tâches de réalisation simultanées au maximum rendent les blocages visibles. La définition de terminé inclut les critères, la revue et la recette. Expliquer pourquoi ne pas affirmer avoir pratiqué Scrum si cela n’est pas documenté. Linear sert au backlog, Git aux changements et le classeur au pilotage chiffré. Source : dossier §3 et A01.

### 4. Un planning de quinze jours ouvrés

Nature : C.3.1 · Simulation pédagogique.

Durée : 1 min 30. Présenter les jours relatifs J1 à J15 sans leur attribuer des dates historiques. Distinguer phases d’étude, mesure, conception, réalisation et restitution. La recette commence sur les fonctions prêtes et se clôt après les événements et les corrections. Les fins initiales et revues sont conservées dans le classeur. Le chemin vers la démonstration passe par la validation à J14. Source : A01 et donnees/pilotage.json.

### 5. Des responsabilités explicites

Nature : C.3.1 · Simulation pédagogique.

Durée : 1 minute. Présenter CP, DEV et QA comme des rôles du scénario. Un seul A par activité. Le client décide du périmètre ; le chef de projet organise ; DEV réalise ; QA contrôle. Les disponibilités sont des hypothèses sur le lot, pas des temps historiques. Les ressources comprennent la machine, Node, MariaDB, Git, le backlog et les supports partagés. L’organisation prévoit des supports accessibles et des aménagements convenus avec les personnes. Source : A02.

### 6. À J10, la prévision atteint 117 heures

Nature : C3.2.1 · Simulation pédagogique.

Durée : 2 minutes. Expliquer chaque indicateur avec son dénominateur : cinq tâches terminées sur dix, avec des tailles différentes. Les 77 heures consommées ne sont pas un taux d’achèvement. Le reste à faire de 40 heures donne une prévision de 117 heures pour 112 prévues. Le budget économique passe de 4 270 à 4 465 euros, soit +195 euros et +4,6 %. La réserve de 427 euros donne un plafond de 4 697 euros et une marge de 232 euros. Modifier une entrée du classeur pendant les questions pour montrer le recalcul. Sources : A03, classeur, données du cas.

### 7. Surveiller la charge et les risques

Nature : C3.2.1 · Simulation pédagogique.

Durée : 2 minutes. La charge par rôle vaut CP 29/30 h, DEV 64/72 h et QA 24/30 h. La capacité totale ne peut pas être déplacée sans vérifier les compétences. CP est proche de sa limite et doit préserver son temps d’arbitrage. Les risques prioritaires portent sur l’environnement de démonstration, la surcharge et les demandes nouvelles. Donner un déclencheur et une action, pas seulement une couleur. Une revue quotidienne traite les blocages ; deux revues hebdomadaires examinent coûts et capacité. Source : A03 et A05.

### 8. Arbitrage réel : tester le standalone

Nature : C3.2.2 · Git observé et analyse rétrospective.

Durée : 2 minutes. Le commit 689e59d du 20 juillet remplace la recette CI en développement par le serveur standalone du build. Le dossier historique rapporte l’échec d’un run pendant les compilations à froid, puis la réussite après consolidation. La comparaison des trois options est rétrospective : elle n’est pas présentée comme un compte rendu contemporain. La décision visible dans Git est le standalone. Le résultat recherché est la fidélité à l’artefact de livraison. Source : git show 689e59d ; cahier de recettes Bloc 2, consolidation standalone.

### 9. Arbitrage de périmètre à J10

Nature : C3.2.2 · Simulation pédagogique.

Durée : 1 minute. Une demande supplémentaire fictive vaut 12 h DEV et 4 h QA, soit 540 euros. Elle porte le coût à 5 005 euros et la charge DEV à 76 heures pour 72 disponibles. Le scénario retient le report, avec maintien des critères de recette et décision du client fictif dans CR02. Les contributions aux topos évoquées sont un lot pédagogique ; ne pas les présenter comme une photographie de l’état actuel du code. Source : A04 et CR02.

### 10. Adapter le management à la situation

Nature : C3.3.1 · Simulation pédagogique.

Durée : 2 minutes. Expliquer une posture avec des actes : écouter les contraintes, comparer les options, décider et suivre. Participatif pour estimer, persuasif pour argumenter le report, directif sur une règle critique, délégatif avec un résultat et un contrôle clairs. Ne pas confondre délégation et absence de suivi. Le management est un exercice fictif, et les collaborateurs réels restent à préciser par le candidat. Source : A05.

### 11. Une décision comprise et retrouvable

Nature : C3.3.1 · Simulation pédagogique.

Durée : 2 minutes. Décrire le désaccord DEV/QA à J10 : une nouvelle fonction face au besoin de stabiliser la recette. Demander faits, impacts et aide nécessaire. La réunion est courte, les options sont préparées et le client décide du périmètre. La synthèse écrite garantit la traçabilité. Donner les adaptations possibles sans inventer un handicap réel : sous-titrage, support structuré, temps supplémentaire, travail asynchrone. Dans un contexte international, indiquer les fuseaux et vérifier la compréhension par reformulation. Source : A05.

### 12. Former sur les écarts utiles au projet

Nature : C3.3.2 · Simulation pédagogique.

Durée : 3 minutes. Présenter l’échelle 0 à 3 et préciser qu’il ne s’agit pas d’une notation réelle de collaborateurs. La cible est l’autonomie sur un cas courant. CP pratique la lecture des écarts, DEV la concurrence, QA les tests navigateur et le clavier. Les six heures sont intégrées dans T03, T06 et T07, sans double comptage. La réussite est vérifiée par une exécution autonome. Si l’écart persiste, prévoir accompagnement ou besoin de renfort formulé aux RH, avec compétence, mission, durée et budget. Aucun recrutement ni achat de formation n’a été effectué. Source : A06.

### 13. Le client valide des critères explicites

Nature : C3.4.1 · Comptes rendus simulés.

Durée : 3 minutes. Présenter CR01, CR02 et CR03. Ils sont explicitement fictifs et non envoyés à une personne réelle. Un compte rendu comprend avancement, écarts, décision, responsable, échéance et prochain point. Les critères relient besoin et logiciel. Les indicateurs proposés sont critères acceptés, parcours sans aide, utilité sur cinq et blocages. Une absence de répondants reste non mesurée. Décrire comment recueillir une confirmation réelle sans prétendre qu’elle existe. Sources : A07 ; référentiel p. 13-14.

### 14. Démonstration : préparer une sortie

Nature : C3.4.2 · Application locale vérifiée.

Durée : 6 minutes, démonstration incluse. Basculer vers le navigateur local sur 127.0.0.1:3313, avec une session grimpeur et une session club distinctes. 45 s : profil ; 75 s : matching et demande ; 75 s : événement et inscription ; 90 s : club et participants ; 45 s : capacité et clavier ; 30 s : critères et réserves. Les comptes sont des données de démonstration. En cas d’incident, annoncer le critère non revalidé et utiliser les captures datées en annexe, sans les faire passer pour une démonstration en direct. Source : A08 et preuves/verification.json.

### 15. Des décisions reliées à leurs preuves

Nature : Bilan · 30 minutes de présentation au total.

Durée : 1 minute. Rappeler que les preuves techniques sont vérifiables et datées, et que les parties de management, de budget et de comptes rendus sont un cas pédagogique fictif. Les sept compétences sont reliées aux annexes. Mentionner les limites utiles : aucune mesure réelle de satisfaction, identité de l’équipe et consignes du campus à confirmer. Ouvrir l’échange en proposant de revenir sur un arbitrage, une hypothèse du classeur ou un critère de démonstration. Source : matrice de preuves et checklist de remise.

### 16. Annexe : parcours partenaire

Nature : Capture locale du 14 septembre 2026.

Annexe à afficher uniquement si utile pendant les questions ou en secours. Capture de l’application locale avec données de démonstration. Source : preuves/captures/manifest.json.

### 17. Annexe : gestion des événements

Nature : Capture locale du 14 septembre 2026.

Annexe de secours. La capture montre le rôle club dans la base dédiée. Elle ne remplace pas une validation réelle par un client. Source : preuves/captures/manifest.json.

### 18. Annexe : retrouver une preuve

Nature : Correspondance avec les sept compétences.

Annexe documentaire. Le dossier PDF contient les huit annexes et la matrice. Le classeur conserve les entrées et les formules. Les résultats courants sont dans verification.json. Sources officielles : référentiel p. 11-14, modalités p. 6/8/11, grille BC03 page unique. Le règlement spécial n’est pas fourni.

## Questions probables du jury

1. **Qu'avez-vous réellement fait et qu'avez-vous simulé ?** Présenter les contributions personnelles confirmées par le candidat. Les commits et les vérifications sont observables. L'équipe CP/DEV/QA, les jours J1-J15, les coûts et les comptes rendus client appartiennent au cas fictif. Un test réussi ne prouve pas un échange client.
2. **Pourquoi Kanban ?** Le scénario retient un petit effectif, des priorités variables et des livraisons progressives. Une limite de travail en cours, des critères de terminé et des jalons structurent le suivi. Ne pas affirmer que Scrum a été pratiqué sans trace correspondante.
3. **Quel est le chemin vers la soutenance ?** Accès/profils, matching, événements, recette/corrections et validation J14 avant la démonstration J15. La recette peut commencer sur les fonctions prêtes ; sa clôture attend les corrections. Montrer A01 et les dépendances.
4. **Comment obtenez-vous 4 465 EUR ?** Valorisation du travail à terminaison : CP 29 h × 45 EUR, DEV 64 h × 35 EUR, QA 24 h × 30 EUR = 4 265 EUR ; ajouter 200 EUR de frais. Les taux et charges sont des hypothèses du cas.
5. **La réserve fait-elle disparaître le dépassement ?** Non : le coût reste supérieur de 195 EUR à la référence de 4 270 EUR. La réserve de 427 EUR porte le plafond à 4 697 EUR et laisse 232 EUR de marge. Un écart doit rester visible même s'il est absorbable.
6. **Pourquoi 50 % de tâches terminées ne signifie pas 50 % de produit livré ?** Le dénominateur est dix tâches du cas, de tailles différentes. Les 77 h consommées mesurent un effort, pas une valeur acquise. Les critères de recette déterminent la validation fonctionnelle.
7. **Pourquoi reporter la demande nouvelle ?** Elle ajoute 540 EUR et conduit à 5 005 EUR, soit 308 EUR au-dessus du plafond. La charge DEV atteindrait 76 h pour 72 disponibles. Le report préserve les critères du lot et doit être validé par le commanditaire du scénario.
8. **Quelle preuve existe pour votre arbitrage réel ?** Le commit 689e59d du 20 juillet décrit le passage de la recette CI au standalone. Les résultats des runs sont rapportés par le dossier historique ; la comparaison des options est une analyse rétrospective. Ne pas la présenter comme un compte rendu rédigé à l'époque.
9. **Comment traitez-vous un conflit DEV/QA ?** Faire expliciter les impacts, identifier les critères non négociables, comparer charge et échéance, décider puis rendre la décision accessible. A05 décrit une situation fictive et critique les limites d'une réponse seulement directive.
10. **Comment équilibrez-vous la charge ?** Comparer charge et capacité par rôle, pas seulement leur somme. CP est à 29/30 h, DEV à 64/72 h et QA à 24/30 h. Un transfert suppose la compétence nécessaire et doit préserver l'indépendance de la recette.
11. **Que change une situation de handicap ou une équipe internationale ?** Convenir des besoins avec la personne : supports structurés, sous-titres, clavier, pauses et modalités adaptées. Prévoir horaires avec fuseau, préparation asynchrone et reformulation des décisions. Ne pas inventer de diagnostic ou de situation réelle.
12. **Comment prouvez-vous l'efficacité d'une formation ?** Définir un niveau attendu, un exercice observable et un contrôle après pratique. Exemples : inscriptions concurrentes, scénario navigateur reproductible et mise à jour autonome du tableau de bord. Les ateliers du cas ne sont pas déclarés réellement suivis.
13. **Quel client a validé et est-il satisfait ?** Aucun résultat réel n'est disponible dans les éléments fournis. Les trois comptes rendus sont simulés. Le dispositif proposé mesure critères acceptés, réussite sans aide, utilité et blocages, avec date et nombre de répondants. Présenter les retours réels seulement lorsqu'ils existent.
14. **Que prouvent vos vérifications ?** Le 14 septembre, lint, typage, build, 389 tests unitaires et six scénarios navigateur ont réussi. La recette locale utilise next dev et une MariaDB dédiée. Elle ne prouve ni une validation client, ni une recette actuelle du déploiement distant, ni une couverture de 100 %.
15. **Que faites-vous si la démonstration échoue ?** Annoncer l'incident, utiliser les captures du 14 septembre et la dernière recette identifiée, puis préciser les critères non revalidés en direct. Revenir au besoin client et proposer une nouvelle vérification après correction.

## Exercices de répétition

- Faire une présentation chronométrée, puis réduire les digressions qui dépassent les repères.
- Dans une copie du classeur, ajouter cinq heures restantes à T06 : la prévision doit atteindre 122 h et 4 640 EUR. Expliquer l'effet puis restaurer l'entrée.
- Retrouver en moins de trente secondes l'annexe qui répond à chacune des sept compétences.
- Rejouer la démonstration avec une session grimpeur et une session club ; utiliser A08 pour les six minutes détaillées.
- Faire une simulation de quinze minutes de questions sans inventer de faits pour combler une information manquante.

## Pièces à garder ouvertes

Le diaporama et ses notes, le classeur, le dossier PDF, A08 et les captures. Les confirmations de date, d'équipe et de dépôt sont suivies dans CHECKLIST_REMISE.md.
