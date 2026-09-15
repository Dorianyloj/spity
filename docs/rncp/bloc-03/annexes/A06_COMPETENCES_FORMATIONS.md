# A06 - Compétences et plan de développement

Nature : grille et plan fictifs appliqués aux rôles du cas. Les niveaux ne sont pas des évaluations réelles de personnes. Échelle : 0 non abordé ; 1 accompagné ; 2 autonome sur un cas courant ; 3 capable de traiter des cas complexes et d'accompagner.

| Rôle | Compétence mobilisée | Niveau du cas | Cible | Justification |
| --- | --- | --- | --- | --- |
| CP | Planning et suivi des écarts | 1 | 2 | Actualiser charge, coût et reste à faire sans assimiler temps et avancement. |
| CP | Animation et arbitrage | 2 | 2 | Faire expliciter les options et consigner la décision. |
| DEV | Développement typé et validation | 2 | 2 | Réaliser des parcours contrôlés côté serveur. |
| DEV | Transactions et concurrence | 1 | 2 | Garantir une seule inscription sur la dernière place. |
| QA | Tests navigateur reproductibles | 1 | 2 | Exécuter et expliquer un parcours complet. |
| QA | Accessibilité clavier et formulaires | 1 | 2 | Détecter un blocage utilisateur et le décrire précisément. |

| Action prévue | Public | Charge et moment | Modalité | Critère de réussite |
| --- | --- | --- | --- | --- |
| Lire un tableau de bord et arbitrer | CP | 1 h à J3 dans T03 | Exercice sur le classeur | Modifier le reste à faire et expliquer l'écart recalculé. |
| Tester une inscription concurrente | DEV | 2 h à J9-J12 dans T06 | Lecture du test puis pratique accompagnée | Expliquer pourquoi une seule demande doit être acceptée. |
| Recette navigateur | Camille, QA | 2 h à J10-J14 dans T07 | Consignes écrites, démonstration sous-titrée, pratique guidée puis autonome | Rejouer un cas et identifier preuve, précondition et résultat. |
| Parcours clavier | Camille, QA | 1 h à J10-J14 dans T07 | Atelier avec critères écrits et échanges disponibles par écrit | Décrire un défaut et proposer un contrôle de non-régression. |

Ces six heures sont incluses dans les tâches du planning ; elles ne sont pas ajoutées une seconde fois. Le budget de ressources complémentaires est de 60 EUR dans le cas, sans achat effectué. Les supports initiaux sont les tests et guides du dépôt ; une formation externe reste une proposition si l'exercice pratique révèle un besoin supplémentaire.

<!-- pagebreak -->

## Formation adaptée à Camille

Camille est la testeuse QA malentendante fictive d'A02. Ses écarts techniques sont des hypothèses du rôle QA, indépendantes de sa situation de handicap. Les 3 h de formation sont conservées : 2 h de recette navigateur et 1 h de parcours clavier. Les consignes sont disponibles avant l'atelier, la démonstration est sous-titrée et les échanges peuvent se poursuivre par écrit. Le scénario prévoit un accord sur ces modalités avec Camille, puis une vérification de leur utilité.

L'exercice conserve le même objectif technique : réaliser un cas de recette sans aide, expliquer les préconditions et le résultat, retrouver la preuve. À J14, ce contrôle reste à effectuer dans le scénario ; il n'est pas présenté comme réussi. Si la consigne est inaccessible, CP adapte le support. Si une difficulté technique persiste malgré un support accessible, il prévoit une pratique accompagnée supplémentaire et réestime la charge avant de l'engager. Le temps ou le matériel supplémentaire dépend donc d'un besoin constaté, sans être considéré automatiquement nécessaire.

Le contrôle après formation porte sur un résultat observable, puis sur la réalisation autonome d'un second cas. En cas d'écart persistant, prévoir un accompagnement ciblé et actualiser la charge. Une formation suivie n'est pas automatiquement une compétence acquise.

## Fiche de besoin RH préparée

Statut : fiche pédagogique conditionnelle, non envoyée et non activée dans le classeur de base. Un recrutement permanent n'est pas retenu pour ce lot. La difficulté technique doit être constatée malgré un support accessible et une pratique accompagnée ; elle n'est jamais présumée à partir du handicap de Camille.

| Champ transmis aux RH dans le scénario | Besoin préparé |
| --- | --- |
| Demandeur et destinataire | CP vers le service RH fictif ; arbitrage du client avant engagement. |
| Déclencheur | À J12, compétence critique de recette encore indisponible et jalon J14 menacé. |
| Mission | Accompagner la recette navigateur et les contrôles de capacité ; transmettre un cas reproductible à Camille. |
| Compétences et sélection | Playwright, formulaires, capacité ; exercice pratique accessible et critères identiques pour les candidats. |
| Disponibilité | Quatre heures de spécialiste à J12-J13 pour préserver la recette J14 ; disponibilité à confirmer. |
| Accueil et résultat | CP prépare le contexte pendant 0,5 h ; QA reçoit un cas documenté avec préconditions, exécution et preuve. |
| Coût additionnel simulé | Renfort : 4 h à 45 EUR = 180 EUR ; CP : 0,5 h à 45 EUR = 22,50 EUR ; total 202,50 EUR. |
| Effet de la variante | 4 465 + 202,50 = 4 667,50 EUR ; marge 29,50 EUR sous 4 697 EUR ; CP passe à 29,5/30 h. |

Le spécialiste est une ressource distincte : ses quatre heures ne sont pas ajoutées à la capacité de Camille. Devis, disponibilité et arbitrage restent à confirmer avant engagement. La faible marge de 29,50 EUR nécessite un suivi quotidien. Si le renfort n'est pas disponible, le CP propose de réduire le périmètre ou de revoir le jalon ; il ne déclare pas la compétence acquise. Cette variante indépendante n'est pas cumulée automatiquement avec les scénarios de sensibilité d'A09. Les valeurs sources figurent dans donnees/consolidation.json.
