# CADRAGE PROJET SPITY
**Réseau Social Complet pour la Communauté d'Escalade**

---

## 1. CONTEXTE ET OPPORTUNITÉ

### État du Marché Escalade
L'escalade connaît une croissance exponentielle en France :
- **+300 000 licenciés FFME** (Fédération Française de la Montagne et de l'Escalade)
- **1 200+ clubs affiliés FFME** répartis nationalement
- **800+ salles d'escalade indoor** (croissance +15% par an)
- **Milliers de falaises naturelles populaires** (Verdon, Calanques, Céüse, Pierre-sur-Haute, etc.)

### Comportements Utilisateurs
Les pratiquants modernes alternent entre :
- Salles d'escalade indoor (régularité)
- Falaises naturelles (week-ends, défis, période printemps-été)
- Clubs FFME (structure, événements, coachs)

Ils recherchent :
- Partenaires adaptés à leur niveau et discipline
- Topos à jour pour falaises (cotations réelles, état équipement)
- Événements structurés via clubs
- Partage social d'exploits (photos, vidéos)

### Gap Marché Actuel

| Besoin | Solution Actuelle | Limite |
|--------|-------------------|--------|
| Matching partenaires | Facebook (groupes désorganisés) | Filtrage impossible, spam |
| Topos falaises | Camptocamp, papier | Statiques, pas de social |
| Infos salles | Sites web disparates | Hors-ligne rapidement |
| Événements clubs | Sites clubs FFME | Décentralisés, peu visibles |
| Partage exploits | Instagram | Sans contexte technique |

**Conclusion** : Aucune plateforme n'unifie salle + falaise + clubs + social dans un seul écosystème.

---

## 2. PROBLÉMATIQUE

### Énoncé Principal
**Les grimpeurs jonglent entre 5 applications/sources différentes pour une seule activité, perdent du temps et manquent d'informations fiables et en temps réel.**

### Problèmes Spécifiques

#### 2.1 Matching Inefficace
Les grimpeurs cherchent leurs partenaires dans des groupes Facebook chaotiques sans aucun filtrage par niveau, discipline ou matériel. Aucun système ne vérifie l'identité ni la réalité des niveaux annoncés, créant un risque de sécurité majeur.

#### 2.2 Topos Falaises Figés
Camptocamp reste une archive statique avec des topos souvent datés de 2015, sans signalements temps réel comme "spit HS" ou "accès interdit". Aucune beta vidéo partagée ni crowdsourcing n'existe pour des informations vivantes et actualisées.

#### 2.3 Clubs Invisibles
Les sites des clubs sont souvent obsolètes, créés en 2010 et jamais mis à jour, tandis que les événements sont éparpillés sur Facebook, Instagram et emails. Les grimpeurs ne savent pas quel club se trouve près d'eux et les clubs perdent des membres potentiels par manque de visibilité.

#### 2.4 Salles Déconnectées
Chaque salle possède son propre site avec des APIs disparates tandis que les plannings de créneaux restent hors ligne. Aucune intégration avec le matching n'existe pour recommander les salles adaptées aux grimpeurs.

#### 2.5 Pas de Contexte Social
Instagram permet de partager des photos sans aucune information sur la cotation, la salle ou le matériel utilisé. Aucun fil social local filtré par discipline n'existe pour découvrir du contenu pertinent géographiquement et techniquement.

---

## 3. OBJECTIFS DU MVP

### Vision Globale
**Spity est la plateforme sociale complète pour l'escalade qui combine matching intelligent entre grimpeurs, topos collaboratifs pour falaises, répertoire des salles d'escalade, clubs structurés et partage social contextualisé.**

### MVP v1 - Périmètre Minimal Viable

#### 3.1 Authentification & Profils
Spity propose une inscription et connexion sécurisées avec email/password et OTP ainsi que deux types de profils :
- **Profil grimpeur** : disciplines pratiquées (bloc, voie, trad en multi-sélection), niveaux cotés de 4a à 8c+, matériel déclaré (chaussons, baudrier, corde, crashpad), avatar et bio
- **Profil club validé** : nom, localisation GPS, bio, logo, photo de couverture et listing des coachs

#### 3.2 Contenu Social
Les utilisateurs créent des posts riches combinant texte et 1-3 images/vidéos avec tags salle/falaise/club, cotation réalisée, matériel utilisé, likes et commentaires tandis que les stories 24h permettent de partager les sessions du jour de manière éphémère.

#### 3.3 Salles + Falaises + Clubs (Répertoire)
Spity affiche un répertoire géolocalisé des salles, falaises et clubs avec vue carte/liste, fiches détaillées par lieu et filtres par discipline, niveau et type d'équipement ainsi que des photos et informations de base.

#### 3.4 Topos Collaboratifs (Falaises)
Les falaises disposent d'une vue détaillée des voies avec cotation par consensus crowd, état (sec/humide, équipé, calme), photos des secteurs et bêta vidéo, possibilité d'ajouter ou modifier des voies sous modération/karma ainsi que des commentaires sécurité signalant spits HS ou accès fermés.

#### 3.5 Calendrier Clubs
Les clubs créent des événements avec titre, date, localisation, capacité et inscriptions pour sorties falaise, contests, initiations ou coaching tandis que les grimpeurs visualisent ces événements, s'inscrivent et reçoivent des notifications push pour les événements proches.

#### 3.6 Fil Intelligent
Le fil personnel agrège les posts des amis, clubs suivis et salles locales tandis que la section découverte propose un matching par niveau/discipline via un algorithme de recommandation simple.

---

## 4. PARTIES PRENANTES

### Matrice RACI (Responsible, Accountable, Consulted, Informed)

| Acteur | Rôle | Responsabilité | Impact sur MVP |
|--------|------|----------------|----------------|
| Grimpeurs (utilisateurs) | Utilisateurs finaux | R : content, posts, profil | Cœur de l'app, UX prioritaire |
| Clubs FFME | Partenaires actifs | A : création events, gestion coachs | 20% des features |
| Salles d'escalade | Partenaires passifs | C : validation infos salles | 10% des features |
| Équipeurs falaises | Contributeurs voluntaires | R : ajout voies, sécurité | Topos collaboratifs |
| FFME (fédération) | Supervison/validation | I : stats nationales, agrégation | Optionnel V1 |
| Développeur | Réalisation technique | A : build, deploy, doc | Démo RNCP complète |

### Niveaux d'Implication Initialement
- **Très actif** : Grimpeurs (utilisateurs principaux)
- **Actif** : Clubs (création events, modération)
- **Passif** : Salles (listing passif, peut devenir actif V2)
- **Optionnel** : FFME (agrégation V2)

---

## 5. FONCTIONNALITÉS CŒUR

### 5.1 Système de Profils

#### Profil Grimpeur
```typescript
{
  id: string
  username: string
  avatar: string
  bio: string
  disciplines: ['bloc', 'voie', 'trad'] // multi-select
  levels: {
    bloc: '7a',
    voie: '6c',
    trad: '5c'
  }
  gear: ['chaussons', 'baudrier', 'corde', 'crashpad']
  location: { lat, lng }
  clubs: [clubId1, clubId2] // clubs suivis
}
```

#### Profil Club
```typescript
{
  id: string
  name: string
  logo: string
  cover: string
  bio: string
  location: { lat, lng }
  coachs: [userId1, userId2]
  verified: boolean
  ffmeAffiliation: string
}
```

### 5.2 Posts Sociaux Contextualisés

#### Structure Post Grimpeur
```typescript
{
  id: string
  userId: string
  content: string
  media: [image1, image2, video] // max 3
  tags: {
    type: 'gym' | 'crag' | 'club'
    placeId: string
    grade: '7a'
    gear: ['chaussons', 'crashpad']
  }
  likes: number
  comments: Comment[]
  createdAt: Date
}
```

**Avantages du Contexte** :
- Grimpeur A cherche partenaire 7a voie → trouve Jean
- Base d'infos pour topos colaboratifs ("cotation confirmée 7a")
- Filtrer fil : "posts voie seulement"

### 5.3 Répertoire Géolocalisé (Salles + Falaises + Clubs)

#### Vue Map
- Carte interactive avec pins colorés par type (salle, falaise, club)
- Filtres : discipline, niveau, distance

#### Fiche Salle
```typescript
{
  id: string
  name: string
  location: { lat, lng }
  photos: string[]
  disciplines: ['bloc', 'voie']
  amenities: ['parking', 'douche', 'shop']
  schedule: {}
  pricing: {}
}
```

#### Fiche Falaise
```typescript
{
  id: string
  name: string
  location: { lat, lng }
  photos: string[]
  routes: Route[] // voir topos
  access: string
  parking: { lat, lng }
  orientation: 'sud' | 'nord' | 'est' | 'ouest'
  season: ['printemps', 'été', 'automne']
}
```

#### Fiche Club
```typescript
{
  id: string
  name: string
  location: { lat, lng }
  logo: string
  bio: string
  events: Event[]
  coachs: User[]
  ffmeLink: string
}
```

### 5.4 Topos Collaboratifs (Falaises)

#### Structure Topo
```typescript
{
  id: string
  cragId: string
  name: string
  grade: '7a'
  consensusGrade: '7a+' // vote crowd
  sector: string
  length: '25m'
  bolts: 8
  type: 'sport' | 'trad' | 'boulder'
  photos: string[]
  betaVideos: string[]
  status: {
    condition: 'sec' | 'humide' | 'équipé' | 'dégradé'
    lastUpdate: Date
    reports: SecurityReport[]
  }
  createdBy: userId
  karma: number
}
```

#### Interactions Topos
- **Grimpeur** : peut voter état, ajouter photos/commentaires
- **Équipeur validé** : peut modifier cotations, signaler équipement dégradé
- **Admin** : modération, épinglage alertes importantes

### 5.5 Calendrier & Événements Clubs

#### Création Événement (Club)
```typescript
{
  id: string
  clubId: string
  title: string
  description: string
  type: 'outing' | 'contest' | 'coaching' | 'initiation'
  date: Date
  location: { lat, lng, name }
  capacity: number
  attendees: [userId1, userId2]
  requiredLevel: '6a'
  gear: ['baudrier', 'corde']
}
```

#### Vue Événement (Grimpeur)
- Liste événements proches (filtre distance, date, niveau)
- Inscription en 1 clic
- Notifications push avant événement

#### Dashboard Club (Événements)
- Créer/éditer/annuler événements
- Voir inscrits
- Analytics (taux remplissage, niveaux participants)

### 5.6 Fil Intelligent & Découverte

#### Fil Perso (Feed)
```typescript
// Agrégation
- Posts amis
- Posts clubs suivis
- Posts salles locales (rayon 20km)
- Events proches
```

#### Découverte Matching
```typescript
// Algorithme simple V1
function matchUsers(currentUser) {
  return users.filter(u =>
    u.disciplines.some(d => currentUser.disciplines.includes(d)) &&
    Math.abs(u.levels[d] - currentUser.levels[d]) <= 1 &&
    distance(u.location, currentUser.location) < 50km
  )
}
```

---

## 6. BÉNÉFICES

### 6.1 Pour Grimpeurs

| Bénéfice | Impact |
|----------|--------|
| 1 app tout-en-un | Salles + falaises + clubs centralisés |
| Topos vivants | Cotations réelles vs guide 2008, état temps réel |
| Matching intelligent | Trouver partenaires 20x plus vite |
| Événements faciles | Découvrir sorties/contests locaux |
| Sécurité | Alertes équipement dégradé, accès fermés |
| Partage contextualisé | Posts avec cotation/salle/matos = utiles pour community |

### 6.2 Pour Clubs FFME

| Bénéfice | Impact Chiffré |
|----------|----------------|
| Visibilité accrée | Découverte club par grimpeurs locaux |
| +35% inscriptions events | Via push notifications ciblées |
| Fidélisation | Dashboard + offres exclusives |
| Recrute de talents | Voir niveaux grimpeurs locaux, matcher coachs |
| Stats actionables | Analytics events (ROI, pic fréquentation) |
| 0 coût tech | Pas de site club à maintenir |

### 6.3 Pour Salles d'Escalade

| Bénéfice | Impact |
|----------|--------|
| Visibilité centrale | Annuaire geo-localisé |
| Recommandations algo | "BlocLyon adaptée pour toi" |
| Calendrier intégré | Planning créneaux à jour |
| Offres dynamiques | Pass/tarifs visibles, acquis clients |

### 6.4 Pour Équipeurs Falaises

- Signalements crowdsourcés (sécurité)
- Visibilité entretien falaises
- Collaboration mainteneurs officiels

### 6.5 Pour FFME (Perspective Fédération)

| Bénéfice | V2+ |
|----------|-----|
| Annuaire clubs moderne | vs site 2010 statique |
| Stats nationales temps réel | Niveaux, disciplines, démographie |
| Plateforme commune clubs | Visibilité événements FFME |

---

## 7. PÉRIMÈTRE & CIBLES MVP

### Périmètre Géographique v1
- **Zone pilote** : Rhône-Alpes (Lyon, Grenoble)
- **Justification** :
  - Haute densité grimpeurs
  - 150+ salles région
  - Falaises iconiques (Verdon accessible)
  - Clubs FFME actifs

### Segments Cibles Prioritaires
1. Grimpeurs urbains (25-45 ans, cadres/indépendants, Lyon/Grenoble)
2. Clubs FFME locaux (premiers à onboard)
3. Salles indoor proches (BlocLyon, Montagn'Club prioritaires)

---

## 8. KPIs SUCCÈS MVP

### Objectifs 3 Mois

#### Acquisition
| KPI | Cible | Raison |
|-----|-------|--------|
| Utilisateurs grimpeurs | 150 | Taille critique pour feed social |
| Clubs onboardés | 15 | Coverage Rhône-Alpes |
| Salles | 30 | Répertoire complet région |
| Falaises | 20 | Topos utiles |

#### Engagement
| KPI | Cible | Raison |
|-----|-------|--------|
| Posts/jour | 10 | Fil vivant |
| Événements créés | 30 | Clubs actifs |
| Inscriptions events | 150 | Clubs utilisent vraiment |
| Commentaires topos | 50 | Community contribue |

#### Rétention
| KPI | Cible | Raison |
|-----|-------|--------|
| DAU (Daily Active Users) | 30 | Vraie utilisation |
| Rétention D7 | 60% | Habituation |
| Rétention D30 | 40% | Loyal user base |
| Session moyenne | 12 min | Intérêt engagement |

#### Satisfaction
| KPI | Cible | Raison |
|-----|-------|--------|
| NPS (Net Promoter Score) | +30 | Word-of-mouth |
| Appstore Rating | 4.2/5 | Quality/feedback positif |

---

## 9. PROCHAINES ÉTAPES

### Semaine 1-2 : Design & Architecture
- Diagrammes UML (Users, Posts, Clubs, Events, Topos)
- User stories détaillées
- Wireframes pages clés
- Architecture technique (Next.js + Drizzle + MariaDB)

### Semaine 3-4 : Setup Technique
- Repository GitHub + branches
- Docker Compose (Next, MariaDB, phpMyAdmin)
- Base de données (schémas Drizzle)
- CI/CD pipeline

### Semaine 5-8 : Développement MVP
- Auth + Profils (grimpeur + club)
- Posts & Feed
- Répertoire Salles/Falaises/Clubs
- Topos collaboratifs
- Calendrier events

### Semaine 9-10 : Tests & Polish
- Tests unitaires
- Sécurité OWASP / RGAA accessibilité
- Recette (cahier des tests)
- Documentation technique

### Semaine 11-12 : Soutenance
- Présentation cadrage complet
- Live demo MVP
- Portfolio pour jury RNCP

---

## STACK TECHNIQUE

### Frontend
- **Framework** : Next.js 15 (App Router)
- **UI** : Tailwind CSS + Design System custom (@spity/src/components/ui/)
- **State** : React Context / Zustand
- **Forms** : React Hook Form + Zod

### Backend
- **API** : Next.js API Routes
- **ORM** : Drizzle ORM
- **Database** : MariaDB
- **Auth** : NextAuth.js / Lucia Auth

### Infrastructure
- **Container** : Docker + Docker Compose
- **Storage** : Cloudinary / S3 pour images
- **Maps** : Mapbox / Leaflet
- **CI/CD** : GitHub Actions

### Tools
- **Version Control** : Git + GitHub
- **Package Manager** : npm
- **Code Quality** : ESLint + Prettier
- **Testing** : Jest + React Testing Library

---

## NOTES IMPORTANTES

- **Contexte RNCP** : Ce projet est développé dans le cadre d'une certification RNCP
- **Démonstration** : Le MVP doit être fonctionnel pour la soutenance
- **Sécurité** : Priorité sur OWASP Top 10 et RGPD
- **Accessibilité** : Respect des normes RGAA
- **Documentation** : Complète pour le jury technique
