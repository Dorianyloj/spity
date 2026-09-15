# A02 - Responsabilités et ressources

Nature : simulation pédagogique. CP = chef de projet ; DEV = développeur fictif ; QA = Camille, testeuse QA fictive ; CL = client fictif. R réalise, A décide et répond du résultat, C est consulté, I est informé. Une seule autorité A par ligne.

CL reprend Claire Martin, présidente fictive du Collectif Altitude Grimpe, commanditaire défini dans C1.1.1 du Bloc 1. CP/DEV/QA sont des rôles du scénario et ne prouvent pas l'existence de trois collaborateurs réels.

| Activité | CP | DEV | QA | CL |
| --- | --- | --- | --- | --- |
| Fixer périmètre et critères | R | C | C | A |
| Planifier et affecter | A/R | C | C | I |
| Réaliser les fonctions | A | R | C | I |
| Recetter les parcours | A | C | R | C |
| Traiter les corrections | A | R | C | I |
| Arbitrer délai, coût, périmètre | R | C | C | A |
| Accepter la démonstration | R | C | C | A |

| Ressource du cas | Disponibilité et usage |
| --- | --- |
| CP | 30 h sur quinze jours ouvrés ; organisation, décisions, suivi et présentation. |
| DEV | 72 h sur le même horizon ; réalisation et corrections. |
| QA : Camille | 30 h disponibles, 24 h prévues à terminaison ; critères T02, recette et accessibilité T07. |
| CL | Trois points de validation ; disponibilité à convenir dans une réalisation réelle. |
| Matériel | Machine et navigateur disponibles ; aucune acquisition matérielle imputée au cas. |
| Logiciels | Git, Linear, environnement Node.js/MariaDB, documents partagés et visioconférence. |

Le rôle réel de chaque personne doit être distingué de cette organisation type. L'attribution des tickets à Dorian dans l'archive Linear n'établit pas, à elle seule, la composition d'une équipe réelle.

<!-- pagebreak -->

## Cas concret : Camille, testeuse QA malentendante

Camille est un personnage entièrement fictif ajouté au scénario pédagogique le 15 septembre 2026. Son besoin retenu est d'accéder aux informations orales et de participer aux décisions. L'affectation de T02 et T07 repose sur les compétences du rôle QA ; sa situation ne détermine pas son niveau technique. Le cas est centralisé dans [les données d'inclusion](../donnees/inclusion.json).

| Besoin du scénario | Modalité convenue avec Camille | Responsable |
| --- | --- | --- |
| Comprendre les consignes et préparer son intervention | Ordre du jour et consignes écrites avant les points. | CP |
| Suivre une réunion | Sous-titres testés, une seule personne parle à la fois, reprise écrite si nécessaire. | CP et participants |
| Retrouver une décision | Synthèse avec action, responsable et échéance dans l'espace partagé. | CP |
| Se former et réaliser la recette | Consignes écrites et démonstration sous-titrée ; mise en pratique autonome. | CP pour le support, Camille pour l'exercice |

La préparation mobilise 0,5 h CP dans T03.3 « Affecter les responsabilités » et 0,5 h CP dans T08.2 « Préparer la revue et arbitrer », incluses dans les charges existantes. Les 3 h QA de formation restent dans T07. L'outil de visioconférence existant est supposé fournir un sous-titrage adapté dans ce scénario ; aucun achat supplémentaire n'est compté. Si ces hypothèses ne suffisent pas, la charge et le budget sont réestimés avant engagement.

Les contrôles prévus à J3, J10 et J14 sont détaillés dans A05. Ce sont des résultats attendus, sans observation réelle annoncée. Le cas n'attribue aucune situation de santé à une personne réelle. Les horaires restent explicites et les ressources accessibles de façon asynchrone.
