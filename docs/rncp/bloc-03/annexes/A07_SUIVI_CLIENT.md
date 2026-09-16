# A07 — Retours utilisateurs simulés

**Simulation pédagogique demandée par le candidat.** Les personas et leurs retours ci-dessous sont inventés. Aucun entretien, compte rendu signé, satisfaction mesurée ou accord client réel n’est déclaré. Les fonctionnalités et corrections citées sont réelles. Les échanges sont construits après coup ; ils ne sont pas l’origine historique des changements.

## SIM-01 — Grimpeur (persona fictif)

**Retour simulé :** « Je veux filtrer les partenaires selon la discipline que je pratique et comprendre l’état de ma demande. »

**Réponse proposée dans la review :** Montrer les filtres et les états ; vérifier la cohérence du niveau avec la discipline.

**Critère à vérifier :** Résultats cohérents et statut de demande lisible.

**Trace de réalisation distincte :** commit 363f681. Aucun accord de recette réellement reçu.

## SIM-02 — Responsable de club (persona fictif)

**Retour simulé :** « Je dois retrouver les inscrits et savoir s’il reste des places pour ma sortie. »

**Réponse proposée dans la review :** Présenter la capacité et la liste des participants avec une session club.

**Critère à vérifier :** Liste autorisée, inscription confirmée et capacité respectée.

**Trace de réalisation distincte :** commit 363f681. Aucun accord de recette réellement reçu.

## SIM-03 — Grimpeur (persona fictif)

**Retour simulé :** « Après un clic dans le menu, je veux savoir que ma navigation est en cours. »

**Réponse proposée dans la review :** Montrer l’indicateur d’attente et la correction du fond décoratif.

**Critère à vérifier :** Attente visible puis disparition à l’arrivée sur la page.

**Trace de réalisation distincte :** commit 83e4c29. Aucun accord de recette réellement reçu.

## Synthèse d’évolution proposée — exemple pédagogique

Périmètre de la review : partenaires et événements. Présenter les besoins ci-dessus, montrer les fonctionnalités, noter les critères observés et les éventuelles réserves. Dorian porte le projet et les corrections ; les personas ne sont ni des collaborateurs ni des clients réels. Une date de prochaine validation n’est fixée qu’au moment d’une séance réelle.

## Indicateurs à relever lors d’une séance réelle

| Indicateur proposé | Calcul / recueil | Résultat disponible |
| --- | --- | --- |
| Réussite du parcours | Parcours réussis sans aide / parcours tentés ; conserver l’effectif | Non mesuré |
| Utilité perçue | Question de 1 à 5, moyenne avec nombre de répondants | Non mesurée |
| Critères acceptés | Critères acceptés / critères effectivement évalués | Non mesurés |
| Blocages | Liste datée des difficultés empêchant une tâche | Aucun relevé utilisateur réel joint |

Un faible résultat déclencherait une qualification du problème, une priorité de correction et une nouvelle vérification. Aucun seuil n’est présenté comme un engagement conclu avec un client réel.

## Réception proposée

Pour chaque critère démontré, recueillir une décision : accepté, accepté avec réserve ou refusé. Une réserve doit préciser le problème, la suite attendue et la prochaine vérification. Cette procédure est proposée ; elle ne constitue pas un procès-verbal de réception.

Le signalement de lenteur de Dorian est un retour réel du porteur du projet, traité dans A04. Il reste distinct des trois retours simulés.

## Comptes rendus de l’équipe fictive et du client

Claire est la représentante fictive du club. Dorian prépare et restitue les décisions ; chaque action est confiée à un membre. Ces échanges ne sont pas l’origine historique des corrections du logiciel.

### CR-SIM-01 — M3 — Périmètre et critères

**Constat :** Personas : besoin de partenaires compatibles et de suivi des inscrits.

**Décision :** Retenir partenaires, événements et participants pour la démonstration.

**Actions et responsables :** Léa : formaliser les parcours ; Dorian : prioriser ; Claire : valider le périmètre M3.

**Validation :** Critères confirmés dans le scénario ; aucun accord réel.

### CR-SIM-02 — M10 — Écart et arbitrage

**Constat :** Suivi simulé : +1 800 € et +1 mois. Demande : animation plus riche.

**Décision :** Dans le scénario, conserver un fond statique et prioriser les critères de recette.

**Actions et responsables :** Dorian : réviser le suivi ; Hugo : préparer la version ; Inès : préparer M11 ; Sami : vérifier le déploiement ; Claire : arbitrer le périmètre.

**Validation :** Réexaminer critères et budget à la review M11 ; pas de signature réelle.

### CR-SIM-03 — M12 — Démonstration et réception

**Constat :** Résultats à relever pendant la démonstration.

**Décision :** Accepté, accepté avec réserve ou refusé selon les critères observés.

**Actions et responsables :** Inès : consigner les résultats ; Hugo et Léa : traiter les réserves ; Sami : livrer ; Dorian : restituer ; Claire : décider.

**Validation :** Décision finale non préremplie.

## Validation et satisfaction

M3 : Claire confirme les parcours préparés par Léa et le périmètre présenté par Dorian. M10 : Claire arbitre les options chiffrées par Hugo et consolidées par Dorian. M11 : Inès rapporte les résultats, Hugo corrige et Dorian autorise la démonstration. M12 : Sami prépare la version, Dorian restitue, Claire accepte, réserve ou refuse. Chaque réserve est affectée à Léa ou Hugo, puis recontrôlée par Inès avant livraison par Sami.

Inès relève la réussite et les blocages ; Léa recueille l’utilité perçue ; Claire examine les critères ; Dorian consolide le bilan avec l’effectif et la date. Cibles pédagogiques : réussite sans aide ≥ 80 %, utilité ≥ 4/5, 100 % des critères critiques acceptés, zéro blocage critique. **Résultats non mesurés.** Si une cible n’est pas atteinte, qualifier, affecter une correction et refaire le parcours avant réception.
