# Périmètre fonctionnel et user stories du prototype BC02

## 1. Finalité du document

Ce document fixe le périmètre du prototype Spity présenté pour le bloc BC02 du titre Expert en développement logiciel RNCP39583.

Il constitue le contrat de référence entre :

- les besoins fonctionnels retenus ;
- les fonctionnalités à développer ;
- les tests unitaires et d'intégration ;
- le cahier de recettes ;
- les preuves présentées au jury.

Une fonctionnalité absente de ce périmètre ne sera pas présentée comme terminée. Toute évolution du périmètre devra être tracée dans l'historique du projet et répercutée dans les scénarios de recette.

## 2. Positionnement de Spity

Spity est une application web communautaire destinée aux pratiquants et aux clubs d'escalade. Le prototype BC02 doit démontrer un parcours cohérent permettant :

1. de créer et sécuriser un compte grimpeur ou club ;
2. de compléter un profil adapté au rôle choisi ;
3. de rechercher des partenaires compatibles ;
4. de demander et confirmer une mise en relation ;
5. de publier, consulter et gérer des événements de club ;
6. de s'inscrire à un événement dans la limite des places disponibles.

Le prototype est une application web responsive. Une application mobile native n'est pas incluse dans le périmètre évalué.

## 3. Acteurs

### Visiteur

Utilisateur non authentifié pouvant consulter la présentation de Spity, créer un compte ou se connecter.

### Grimpeur

Utilisateur authentifié possédant un profil grimpeur. Il peut gérer ses informations, rechercher des partenaires, gérer ses demandes de mise en relation, consulter les événements et s'y inscrire.

### Club

Utilisateur authentifié possédant un profil club. Il peut gérer son profil, créer et administrer ses événements et consulter les inscriptions associées.

### Système

Ensemble des traitements automatiques chargés de valider les données, contrôler les autorisations, maintenir les capacités des événements et produire des réponses cohérentes en cas d'erreur.

## 4. Périmètre retenu

### Fonctionnalités obligatoires

| Identifiant | Domaine | Fonctionnalité |
| --- | --- | --- |
| F01 | Authentification | Inscription avec choix du rôle, connexion, session et déconnexion. |
| F02 | Profils | Création, consultation et modification du profil correspondant au rôle. |
| F03 | Matching | Annuaire de grimpeurs avec filtres par discipline, niveau et localité. |
| F04 | Mise en relation | Envoi, acceptation et refus d'une demande de partenariat. |
| F05 | Événements | Création, modification et annulation d'un événement par un club. |
| F06 | Découverte | Consultation des événements à venir et de leur capacité disponible. |
| F07 | Inscriptions | Inscription et désinscription d'un grimpeur à un événement. |
| F08 | Suivi club | Consultation de la liste et du nombre d'inscrits par le club organisateur. |
| F09 | Sécurité | Contrôle des accès, validation des entrées, protection des sessions et gestion sûre des erreurs. |
| F10 | Accessibilité | Parcours principaux utilisables au clavier, structurés et compréhensibles avec les technologies d'assistance. |

### Hors périmètre du prototype BC02

Les fonctionnalités suivantes appartiennent à la vision produit, mais ne sont pas nécessaires à la validation du prototype retenu :

- fil social, publications, médias, commentaires, likes et stories ;
- topos collaboratifs, secteurs, voies et votes de cotation ;
- carte géographique interactive et calcul de distance GPS ;
- messagerie instantanée et notifications push ;
- paiement, abonnement ou billetterie ;
- modération communautaire avancée ;
- validation automatique de l'affiliation auprès de la FFME ;
- application mobile native ;
- authentification par fournisseur externe ou OTP ;
- récupération de mot de passe par courrier électronique.

Ces exclusions devront apparaître dans le dossier final afin de distinguer clairement le prototype évalué des évolutions prévues.

## 5. Matrice simplifiée des autorisations

| Action | Visiteur | Grimpeur | Club |
| --- | :---: | :---: | :---: |
| Consulter la landing page | Oui | Oui | Oui |
| Créer un compte ou se connecter | Oui | Sans objet | Sans objet |
| Modifier son propre profil | Non | Oui | Oui |
| Rechercher des grimpeurs | Non | Oui | Non |
| Envoyer ou traiter une demande de partenariat | Non | Oui | Non |
| Consulter les événements | Non | Oui | Oui |
| Créer et administrer un événement | Non | Non | Oui |
| S'inscrire à un événement | Non | Oui | Non |
| Consulter les inscrits d'un événement | Non | Non | Oui, pour ses événements uniquement |

L'absence d'autorisation doit conduire à une réponse explicite `401` pour un utilisateur non authentifié ou `403` pour un utilisateur authentifié ne disposant pas du rôle requis.

## 6. User stories et critères d'acceptation

### US-AUTH-01 - Créer un compte

**En tant que** visiteur, **je veux** créer un compte grimpeur ou club **afin de** rejoindre Spity avec les droits correspondant à mon rôle.

Priorité : Must have.

Critères d'acceptation :

1. Étant donné une adresse électronique non utilisée, un mot de passe conforme et un rôle valide, lorsque le formulaire est soumis, alors le compte est créé, une session sécurisée est ouverte et l'utilisateur est dirigé vers l'onboarding.
2. Une adresse électronique est normalisée et ne peut être associée qu'à un seul compte.
3. Un mot de passe doit contenir au moins huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
4. Une adresse déjà utilisée produit une erreur métier explicite sans créer de doublon.
5. Une donnée invalide est refusée côté client et côté serveur.
6. Les erreurs sont annoncées de manière accessible et ne reposent pas uniquement sur la couleur.

### US-AUTH-02 - Se connecter et se déconnecter

**En tant que** titulaire d'un compte, **je veux** ouvrir et fermer une session **afin de** protéger l'accès à mes données.

Priorité : Must have.

Critères d'acceptation :

1. Des identifiants valides ouvrent une session et redirigent vers le profil ou l'onboarding selon l'état du compte.
2. Des identifiants invalides retournent un message générique ne révélant pas l'existence du compte.
3. Le cookie de session est `HttpOnly`, `SameSite` et `Secure` en production.
4. Les routes protégées refusent les requêtes sans session valide.
5. La déconnexion invalide le cookie de session et interdit immédiatement l'accès aux routes protégées depuis le navigateur.
6. Les tentatives anormales sont limitées sans permettre le verrouillage abusif d'un compte par un tiers.

### US-PROFILE-01 - Gérer un profil grimpeur

**En tant que** grimpeur, **je veux** renseigner mon profil **afin de** recevoir des résultats de matching pertinents.

Priorité : Must have.

Critères d'acceptation :

1. Le profil comporte un nom d'affichage, une bio facultative, une localité, au moins une discipline, le niveau correspondant à chaque discipline sélectionnée et le matériel disponible.
2. Les disciplines proposées sont au minimum le bloc, la voie et le trad.
3. Les cotations acceptées vont de `4a` à `8c+` pour le prototype.
4. Un utilisateur ne peut créer qu'un seul profil grimpeur.
5. Seul le propriétaire peut modifier son profil.
6. L'adresse électronique et les données de session ne sont jamais affichées dans l'annuaire public.

### US-PROFILE-02 - Gérer un profil club

**En tant que** club, **je veux** renseigner mon identité et ma localisation **afin de** publier des événements identifiables.

Priorité : Must have.

Critères d'acceptation :

1. Le profil comporte un nom, une bio facultative, une localité et un numéro d'affiliation FFME facultatif.
2. Un utilisateur ne peut créer qu'un seul profil club.
3. Seul le propriétaire peut modifier le profil.
4. L'absence de vérification automatique FFME est indiquée comme limite du prototype ; aucun badge « vérifié » n'est attribué automatiquement.

### US-MATCH-01 - Rechercher des partenaires

**En tant que** grimpeur, **je veux** filtrer les autres grimpeurs **afin de** trouver un partenaire compatible.

Priorité : Must have.

Critères d'acceptation :

1. L'annuaire n'affiche que les profils grimpeurs complétés et n'affiche pas le profil de l'utilisateur courant.
2. Les résultats peuvent être filtrés par discipline, niveau et localité.
3. Plusieurs filtres actifs sont combinés et leur état reste visible.
4. La suppression des filtres restaure la liste complète autorisée.
5. Une recherche sans résultat affiche un état vide compréhensible et permet de réinitialiser les filtres.
6. Les résultats suivent un ordre déterministe documenté.

### US-MATCH-02 - Gérer une demande de partenariat

**En tant que** grimpeur, **je veux** proposer une mise en relation et répondre aux demandes reçues **afin de** confirmer un intérêt mutuel.

Priorité : Must have.

Critères d'acceptation :

1. Un grimpeur peut envoyer une demande à un autre grimpeur depuis sa fiche.
2. Il est impossible de s'envoyer une demande à soi-même.
3. Une seule demande active peut exister pour une même paire de grimpeurs.
4. Le destinataire peut accepter ou refuser une demande en attente.
5. Seul le destinataire peut traiter la demande.
6. Les statuts autorisés sont `pending`, `accepted` et `declined` ; toute transition invalide est refusée.
7. Les demandes émises et reçues sont consultables dans un tableau de bord.

### US-EVENT-01 - Administrer un événement

**En tant que** club, **je veux** créer, modifier ou annuler un événement **afin de** proposer une activité aux grimpeurs.

Priorité : Must have.

Critères d'acceptation :

1. Un événement comporte un titre, un type, une description, une localité, une date et heure de début, une date et heure de fin et une capacité strictement positive.
2. La fin est postérieure au début et un nouvel événement commence dans le futur.
3. Seul un compte club possédant un profil complet peut créer un événement.
4. Seul le club organisateur peut modifier ou annuler son événement.
5. Une capacité ne peut pas être réduite sous le nombre d'inscriptions actives.
6. Un événement annulé reste traçable, est indiqué comme tel et n'accepte plus d'inscription.

### US-EVENT-02 - Consulter les événements

**En tant que** utilisateur authentifié, **je veux** consulter les événements à venir **afin de** découvrir les activités proposées par les clubs.

Priorité : Must have.

Critères d'acceptation :

1. La liste présente les événements futurs non annulés dans l'ordre chronologique.
2. Chaque résultat affiche le club, le titre, le type, la localité, la date et le nombre de places restantes.
3. La fiche d'un événement fournit l'ensemble des informations utiles sans exposer les données privées des participants.
4. Un état vide est affiché lorsqu'aucun événement ne correspond aux filtres.

### US-EVENT-03 - S'inscrire à un événement

**En tant que** grimpeur, **je veux** m'inscrire ou me désinscrire d'un événement **afin de** gérer ma participation.

Priorité : Must have.

Critères d'acceptation :

1. Seul un grimpeur possédant un profil complet peut s'inscrire.
2. Une seule inscription active est autorisée par couple utilisateur/événement.
3. Une inscription est refusée si l'événement est complet, annulé ou déjà commencé.
4. Deux inscriptions concurrentes ne peuvent pas dépasser la capacité définie.
5. Une désinscription avant le début libère immédiatement une place.
6. Le grimpeur peut consulter ses inscriptions à venir.

### US-EVENT-04 - Suivre les inscriptions d'un club

**En tant que** club organisateur, **je veux** consulter les participants de mes événements **afin de** préparer l'activité et suivre la capacité.

Priorité : Must have.

Critères d'acceptation :

1. Le club voit le nombre d'inscrits, la capacité et les places restantes.
2. Le club voit uniquement le nom d'affichage et les informations de profil nécessaires à l'organisation.
3. Un club ne peut jamais consulter la liste privée d'un événement appartenant à un autre club.
4. La liste reflète immédiatement les inscriptions et désinscriptions confirmées.

## 7. Exigences non fonctionnelles

### Sécurité

La référence retenue est l'[OWASP Top 10:2025](https://owasp.org/Top10/), version publiée la plus récente au moment du cadrage.

Le prototype devra notamment assurer :

- le contrôle d'accès côté serveur pour chaque opération protégée ;
- la validation et la normalisation des entrées ;
- des requêtes paramétrées via l'ORM ;
- la protection des mots de passe et des secrets ;
- une configuration sûre des cookies et en-têtes HTTP ;
- la prévention des doublons et des transitions métier incohérentes par des contraintes de base de données ;
- une gestion contrôlée des erreurs sans fuite de données sensibles ;
- la surveillance des dépendances et de la chaîne de construction ;
- une journalisation exploitable des événements de sécurité sans journaliser de mot de passe ou de jeton.

Une matrice séparée reliera chacune des dix catégories OWASP 2025 aux mesures, tests et preuves de Spity.

### Accessibilité

La référence retenue est le [RGAA 4.1.2](https://accessibilite.numerique.gouv.fr/), version officielle en vigueur au moment du cadrage. Le RGAA 5 est annoncé pour fin 2026 ; son arrivée sera surveillée sans bloquer les travaux fondés sur la version 4.1.2.

Les parcours de l'échantillon d'audit devront au minimum garantir :

- une structure de titres et des régions cohérentes ;
- des libellés, instructions et erreurs de formulaire explicitement associés ;
- une navigation complète au clavier avec focus visible ;
- un ordre de tabulation logique ;
- des contrastes conformes ;
- des composants utilisables sans dépendre uniquement de la couleur ou du mouvement ;
- le respect de la préférence de réduction des animations ;
- des messages dynamiques annoncés aux technologies d'assistance ;
- un affichage utilisable avec zoom et sur petit écran.

### Qualité et tests

Les seuils initiaux du prototype sont :

- aucune erreur ESLint ;
- aucune erreur TypeScript ;
- build de production réussi ;
- tests unitaires et d'intégration réussis ;
- couverture globale minimale de 60 % pour les lignes et instructions, 55 % pour les fonctions et 75 % pour les branches ;
- aucune vulnérabilité de dépendance critique ou haute non justifiée ;
- chaque anomalie détectée liée à une entrée du plan de correction.

Les exclusions de couverture devront être rares, justifiées et documentées.

### Performance et compatibilité

- interface responsive de 360 à 1 440 pixels de largeur ;
- score Lighthouse cible d'au moins 85 en performance et 100 en accessibilité sur les pages principales ;
- temps de réponse cible inférieur à 500 ms au 95e percentile pour les routes API principales dans l'environnement de référence, hors latence réseau externe ;
- absence de requête non bornée sur les listes ;
- prise en charge des versions récentes de Chromium et Firefox ;
- états de chargement, vide, succès et erreur présents sur chaque parcours asynchrone.

## 8. Échantillon prévu pour l'audit et la recette

L'échantillon minimal comprend :

1. la landing page ;
2. l'inscription ;
3. la connexion ;
4. l'onboarding grimpeur ;
5. l'onboarding club ;
6. l'annuaire et les filtres de matching ;
7. le tableau de bord des demandes ;
8. la liste et la fiche d'un événement ;
9. la création/modification d'un événement ;
10. les inscriptions du grimpeur et le suivi des participants du club ;
11. les principaux cas d'erreur et d'accès interdit.

## 9. Traçabilité vers le BC02

| Élément du présent cadrage | Compétences alimentées | Preuve attendue ultérieurement |
| --- | --- | --- |
| Périmètre, acteurs et user stories | C2.2.1, C2.3.1 | Présentation du prototype et cahier de recettes. |
| Critères d'acceptation | C2.2.2, C2.3.1 | Tests automatisés et scénarios de recette. |
| Matrice des autorisations et exigences de sécurité | C2.2.3 | Matrice OWASP, tests d'autorisation et rapport de sécurité. |
| Exigences RGAA | C2.2.3 | Audit d'accessibilité, corrections et preuves visuelles. |
| Seuils qualité et performance | C2.1.1, C2.1.2 | Pipeline CI, rapports de couverture et Lighthouse. |
| Périmètre versionné et exclusions | C2.2.4, C2.4.1 | Historique des versions et documentation de maintenance. |

### Identifiants réservés pour le cahier de recettes

| Fonctionnalité | User stories | Préfixe des scénarios de recette |
| --- | --- | --- |
| F01 - Authentification | US-AUTH-01, US-AUTH-02 | REC-AUTH |
| F02 - Profils | US-PROFILE-01, US-PROFILE-02 | REC-PROFILE |
| F03 - Matching | US-MATCH-01 | REC-MATCH |
| F04 - Mise en relation | US-MATCH-02 | REC-PARTNER |
| F05 - Administration des événements | US-EVENT-01 | REC-EVENT-ADMIN |
| F06 - Découverte des événements | US-EVENT-02 | REC-EVENT-LIST |
| F07 - Inscriptions | US-EVENT-03 | REC-REGISTRATION |
| F08 - Suivi club | US-EVENT-04 | REC-EVENT-PARTICIPANTS |
| F09 - Sécurité | Exigence transverse | REC-SECURITY |
| F10 - Accessibilité | Exigence transverse | REC-A11Y |

Chaque critère d'acceptation recevra un identifiant numéroté lors de la rédaction du cahier de recettes, par exemple `REC-AUTH-001`.

## 10. Définition de terminé d'une fonctionnalité

Une fonctionnalité n'est terminée que si :

1. ses critères d'acceptation sont satisfaits ;
2. les contrôles d'autorisation sont réalisés côté serveur ;
3. les données sont protégées par les contraintes nécessaires ;
4. les tests automatisés pertinents sont présents et réussissent ;
5. le parcours clavier et les erreurs accessibles ont été vérifiés ;
6. le scénario correspondant du cahier de recettes est rédigé ;
7. les choix et limites sont documentés ;
8. la fonctionnalité est intégrée par le pipeline sans régression.

## 11. Décision de cadrage

Le présent périmètre constitue la version de référence du prototype BC02. Les fonctions F01 à F10 sont obligatoires. Les fonctions placées hors périmètre ne conditionnent pas la complétude du prototype, mais peuvent être présentées comme perspectives après validation des neuf compétences du bloc.
