# Annexe — Glossaire

| Terme | Définition dans le contexte Spity |
| --- | --- |
| **Audit de dépendances** | Analyse des vulnérabilités et des versions disponibles, encadrée par une politique d'exception. |
| **CI** | Intégration continue : contrôles automatiques lancés à chaque changement concerné. |
| **Candidat de release** | Artefact validé en CI ou staging mais non encore affirmé comme déployé en production. |
| **Dérive de déploiement** | Écart entre l'identité attendue d'un logiciel et la version/révision réellement observée. |
| **Image immuable** | Image identifiée par un SHA, donc non modifiée après sa construction. |
| **Manifeste SHA-256** | Liste des empreintes cryptographiques permettant de détecter la modification d'un fichier couvert. |
| **Observation de production** | Vérification de santé qui renvoie le statut, la version et la révision réelles d'une instance publique. |
| **Rollback** | Retour contrôlé vers une image ou une version antérieure, documenté comme une nouvelle décision. |
| **SBOM** | Inventaire des composants logiciels utilisé pour connaître les dépendances d'un artefact. |
| **SLO** | Objectif de niveau de service : ici, disponibilité mesurée sur une fenêtre de 30 jours. |
| **Staging** | Environnement éphémère de préproduction utilisé pour valider un candidat sans déclarer une promotion de production. |
| **Support niveau 1 / mainteneur niveau 2** | Séparation entre le contexte fonctionnel et l'analyse/correction technique. |
