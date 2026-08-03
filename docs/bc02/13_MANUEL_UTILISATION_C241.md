# Manuel d'utilisation de Spity - C2.4.1

## Identification du document

| Champ | Valeur |
| --- | --- |
| Produit | Spity |
| Version documentée | `0.1.0` |
| Public | Grimpeurs, responsables de club et évaluateurs |
| Périmètre | Prototype BC02, fonctions F01 à F10 |
| Recette associée | [Cahier de recettes](./10_CAHIER_RECETTES_C231.md) |
| Dernière vérification | 23 juillet 2026 |

## 1. Présentation

Spity rassemble dans une même application les profils d'escalade, la recherche de partenaires, les demandes de mise en relation, les événements communautaires et un répertoire de salles, falaises et clubs.

Deux rôles existent :

| Rôle | Fonctions principales |
| --- | --- |
| Grimpeur | Gérer son profil et son matériel, filtrer les partenaires, envoyer ou traiter des demandes, consulter les lieux, s'inscrire aux événements. |
| Club | Gérer sa fiche, consulter les lieux, créer et administrer ses événements, suivre les participants. |

Le rôle choisi à l'inscription détermine les fonctions accessibles. Il n'est pas modifiable depuis l'interface du prototype.

## 2. Accès et navigation

L'application nécessite un navigateur récent avec JavaScript et les cookies activés. Les parcours ont été vérifiés sur Chromium en affichage bureau et mobile.

Une fois connecté, la navigation principale contient :

- **Feed** : tableau de bord et synthèse du compte ;
- **Partenaires** : annuaire filtrable, réservé aux grimpeurs ;
- **Demandes** : invitations reçues et historique, réservé aux grimpeurs ;
- **Lieux** : salles, falaises, voies et clubs ;
- **Événements** : inscriptions grimpeur ou gestion club ;
- **Profil** : informations personnelles, pratique et matériel ;
- **Déconnexion** : fin de session.

Tous les liens, champs et boutons des parcours critiques sont utilisables au clavier avec `Tab`, `Maj+Tab`, `Entrée` et `Espace`. Le focus visible indique l'élément actif. Les messages de réussite ou d'erreur sont annoncés après les actions.

## 3. Comptes de démonstration jury et locaux

L'instance jury est accessible sur [https://spity.fr](https://spity.fr). Après chargement du jeu de démonstration sur une instance éphémère, les comptes suivants utilisent le mot de passe commun `SpityDemo2026!` :

| Compte | Rôle | Usage de démonstration |
| --- | --- | --- |
| `lina.demo@spity.local` | Grimpeur | Profil complet, matériel, événements et relation existante. |
| `nassim.demo@spity.local` | Grimpeur | Deuxième profil et relation avec Lina. |
| `camille.demo@spity.local` | Grimpeur | Profil supplémentaire pour les filtres de matching. |
| `club.demo@spity.local` | Club | Création et gestion d'événements. |

Ces identifiants sont publics et destinés exclusivement à une base de démonstration locale ou éphémère. L'instance `spity.fr` ne contient que des données fictives et peut être réinitialisée. Ces comptes ne doivent exister dans aucun environnement contenant de vraies données.

## 4. Créer un compte et se connecter

### 4.1 Inscription

1. Ouvrir `/register` ou sélectionner **Créer un compte** depuis la connexion.
2. Saisir une adresse e-mail valide.
3. Créer un mot de passe d'au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial. La limite technique est de 72 octets.
4. Choisir **Grimpeur** ou **Club**.
5. Sélectionner **Créer mon compte**.

Une adresse déjà utilisée est refusée. Après création, Spity ouvre automatiquement l'étape de profil.

### 4.2 Première configuration grimpeur

1. Choisir au moins une discipline : bloc, voie ou trad.
2. Indiquer le niveau correspondant, de `4a` à `8c+` selon les options proposées.
3. Sélectionner le matériel de base disponible.
4. Valider avec **Créer le profil**.
5. Utiliser **Entrer dans l'app**.

Les informations publiques et les préférences détaillées peuvent être complétées ensuite dans **Profil**.

### 4.3 Première configuration club

1. Saisir le nom du club.
2. Ajouter la localisation.
3. Ajouter, si disponible, le numéro d'affiliation FFME.
4. Rédiger une courte présentation.
5. Valider avec **Créer le profil**, puis **Entrer dans l'app**.

### 4.4 Connexion et déconnexion

Sur `/login`, saisir l'e-mail et le mot de passe puis sélectionner **Se connecter**. Une session valide redirige vers le tableau de bord. Le bouton **Déconnexion** supprime la session et renvoie à la page de connexion.

Le prototype ne fournit pas encore de parcours autonome « mot de passe oublié ». Un compte de démonstration peut être recréé en rechargeant le jeu local ; un vrai compte nécessite actuellement une intervention de maintenance.

## 5. Gérer un profil grimpeur

Ouvrir **Profil**. Quatre onglets sont proposés.

### 5.1 Aperçu

L'aperçu affiche la fiche publique, la progression du profil, les disponibilités, les objectifs et les préférences de partenaire.

Pour modifier la fiche :

1. saisir un nom affiché, une localisation et éventuellement l'URL HTTPS d'une photo ;
2. choisir l'environnement principal et rédiger une bio ;
3. cocher les disponibilités et objectifs ;
4. sélectionner **Mettre à jour la fiche publique**.

Dans **Préférences de matching**, activer ou désactiver la recherche, choisir le niveau recherché et le style de session, ajouter une note, puis sélectionner **Enregistrer les préférences**. Un profil dont la recherche est désactivée n'est pas proposé aux autres grimpeurs.

### 5.2 Pratique

1. Cocher les disciplines pratiquées.
2. Choisir un niveau pour chaque discipline.
3. Enregistrer les modifications.

Ces données alimentent les filtres de matching. Une cotation incohérente ou un formulaire incomplet est refusé avant enregistrement.

### 5.3 Matériel

L'inventaire détaillé est réservé aux grimpeurs.

**Saisie assistée :**

1. saisir une liste dans **Liste libre**, par exemple `2 dégaines Petzl; casque Mammut; corde 70 m 9.5 mm` ;
2. sélectionner **Analyser** ;
3. vérifier et corriger chaque proposition ;
4. sélectionner **Enregistrer** sur les éléments à conserver.

**Saisie manuelle :**

1. choisir la catégorie et la quantité ;
2. renseigner au minimum le modèle ou le nom ;
3. compléter marque, couleur, taille, longueur ou diamètre lorsque ces champs s'appliquent ;
4. choisir l'état et indiquer si l'objet est disponible pour un partenaire ;
5. enregistrer.

Les boutons **Modifier** et **Supprimer** de chaque ligne permettent ensuite d'entretenir l'inventaire. Vérifier physiquement le matériel avant une sortie : Spity consigne une déclaration, pas un contrôle de sécurité.

### 5.4 Compte

L'onglet récapitule l'adresse e-mail et le rôle. Le rôle ne peut pas être transformé depuis l'interface. La suppression et l'export autonome du compte ne sont pas encore disponibles dans ce MVP.

## 6. Trouver un partenaire

La rubrique **Partenaires** est réservée au rôle grimpeur.

1. Utiliser **Nom ou localisation** pour une recherche textuelle.
2. Combiner si nécessaire les filtres **Discipline**, **Niveau**, **Disponibilité** et **Environnement**.
3. Lire les informations du profil correspondant.
4. Sélectionner **Envoyer une demande** sur le profil souhaité.

Le bouton est remplacé par l'état de la relation lorsqu'une demande existe déjà. Si aucun résultat ne correspond, sélectionner **Réinitialiser les filtres** pour revenir à l'annuaire complet.

Spity exclut le compte connecté de ses propres résultats et n'affiche que les grimpeurs ayant activé leur recherche de partenaire.

## 7. Traiter les demandes

Ouvrir **Demandes**.

- Dans les demandes reçues, sélectionner **Accepter** pour créer la relation ou **Refuser** pour la clôturer.
- Les demandes envoyées restent visibles avec leur état : en attente, acceptée ou refusée.
- Une même paire de comptes ne peut pas créer plusieurs demandes actives concurrentes.

Le demandeur voit le nouvel état après actualisation de la page. Une demande refusée n'établira aucune relation.

## 8. Utiliser les événements

### 8.1 Parcours grimpeur

1. Ouvrir **Événements**.
2. Consulter le type, l'organisateur, la date, le lieu et le nombre de places.
3. Sélectionner **S'inscrire**.
4. Vérifier le message **Inscription confirmée** et le badge **Inscrit**.
5. Sélectionner **Annuler mon inscription** pour libérer la place.

Le bouton d'inscription est désactivé lorsque la capacité est atteinte. Un événement annulé reste identifiable mais n'accepte plus d'inscription.

### 8.2 Parcours club

1. Ouvrir **Événements**, puis **Nouvel événement**.
2. Renseigner titre, type, description, lieu, début, fin et capacité.
3. Sélectionner **Publier**.
4. Utiliser **Modifier** sur un événement appartenant au club pour ajuster ses informations.
5. Consulter la liste **Participants** sur la carte de l'événement.
6. Utiliser **Annuler l'événement** si nécessaire.

La date de fin doit être postérieure au début et la capacité doit être positive. Un club ne peut modifier ou annuler que ses propres événements.

## 9. Consulter les lieux

Ouvrir **Lieux**, puis :

1. filtrer par type de lieu, discipline et état ;
2. utiliser **Nom, ville, voie, service...** pour rechercher un contenu ;
3. ouvrir une fiche de salle ou de falaise pour consulter ses informations ;
4. consulter, pour une falaise, les secteurs, voies, cotations, hauteurs et états disponibles ;
5. consulter les fiches de clubs présentes dans le répertoire.

Le bloc **Carte à venir** est un emplacement visuel : aucune carte interactive ni géolocalisation n'est disponible dans la version `0.1.0`.

## 10. Tableau de bord et limites du prototype

Le **Feed** présente un tableau de bord avec des statistiques du compte, des aperçus de profil, de matériel et d'événements. Les publications de démonstration sont affichées pour illustrer le futur réseau social.

Dans la version `0.1.0` :

- la création de publication, les mentions « J'aime » et les commentaires du Feed ne sont pas persistants ;
- la carte des lieux n'est pas interactive ;
- l'export, la suppression autonome du compte et la réinitialisation du mot de passe ne sont pas exposés dans l'interface ;
- les topos collaboratifs, votes de cotation et signalements en temps réel restent hors du prototype démontrable ;
- les notifications externes par e-mail ou mobile ne sont pas envoyées.

Les parcours réellement couverts et automatisés sont listés dans le [cahier de recettes F01 à F10](./10_CAHIER_RECETTES_C231.md).

## 11. Messages et résolution des erreurs

| Message ou situation | Cause probable | Action utilisateur |
| --- | --- | --- |
| Identifiants invalides | E-mail ou mot de passe incorrect | Vérifier la saisie ; ne pas multiplier les essais rapides. |
| Formulaire refusé | Champ obligatoire ou format incorrect | Lire le message associé au champ et corriger sa valeur. |
| Accès renvoyé vers `/login` | Session absente ou expirée | Se reconnecter. |
| Accès renvoyé vers l'onboarding | Profil du rôle incomplet | Terminer la création du profil. |
| Fonction non autorisée | Rôle incompatible ou ressource appartenant à un autre compte | Utiliser le bon rôle ou revenir à son propre contenu. |
| Aucune place disponible | Capacité atteinte | Choisir un autre événement ou attendre une annulation. |
| Action sans confirmation | Réseau ou serveur indisponible | Ne pas répéter immédiatement ; actualiser et vérifier l'état avant de réessayer. |

Ne jamais communiquer son mot de passe ou son cookie de session dans une capture ou un ticket. Pour signaler un défaut, joindre l'heure, la page, le rôle, les étapes, le résultat observé et, si possible, une capture sans donnée sensible.

## 12. Parcours de démonstration jury

Le jeu disponible sur `spity.fr`, ou chargé localement avec `npm run db:seed`, permet un parcours court et reproductible :

1. se connecter avec Lina et présenter le profil, le matériel, les filtres de partenaires, les lieux et une inscription ;
2. se déconnecter puis ouvrir le compte club ;
3. créer un événement futur avec une capacité de `1` ;
4. revenir au compte Lina et s'inscrire ;
5. revenir au compte club, actualiser l'événement et afficher la participante ;
6. annuler l'événement et constater son état ;
7. présenter les limites connues plutôt que d'actionner les commandes statiques du Feed.

Les tests Playwright exécutent automatiquement les variantes complètes, dont l'acceptation et le refus d'une demande, la capacité d'événement, les contrôles de rôle et l'affichage mobile.
