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
| Lire un tableau de bord et arbitrer | CP | 1 h dans T03 | Exercice sur le classeur | Modifier le reste à faire et expliquer l'écart recalculé. |
| Tester une inscription concurrente | DEV | 2 h dans T06 | Lecture du test puis pratique accompagnée | Expliquer pourquoi une seule demande doit être acceptée. |
| Recette navigateur | Camille, QA | 2 h dans T07 | Consignes écrites, démonstration sous-titrée, pratique guidée puis autonome | Rejouer un cas et identifier preuve, précondition et résultat. |
| Parcours clavier | Camille, QA | 1 h dans T07 | Atelier avec critères écrits et échanges disponibles par écrit | Décrire un défaut et proposer un contrôle de non-régression. |

Ces six heures sont incluses dans les tâches du planning ; elles ne sont pas ajoutées une seconde fois. Le budget de ressources complémentaires est de 60 EUR dans le cas, sans achat effectué. Les supports initiaux sont les tests et guides du dépôt ; une formation externe reste une proposition si l'exercice pratique révèle un besoin supplémentaire.

<!-- pagebreak -->

## Formation adaptée à Camille

Camille est la testeuse QA malentendante fictive d'A02. Ses écarts techniques sont des hypothèses du rôle QA, indépendantes de sa situation de handicap. Les 3 h de formation sont conservées : 2 h de recette navigateur et 1 h de parcours clavier. Les consignes sont disponibles avant l'atelier, la démonstration est sous-titrée et les échanges peuvent se poursuivre par écrit. Le scénario prévoit un accord sur ces modalités avec Camille, puis une vérification de leur utilité.

L'exercice conserve le même objectif technique : réaliser un cas de recette sans aide, expliquer les préconditions et le résultat, retrouver la preuve. À J14, ce contrôle reste à effectuer dans le scénario ; il n'est pas présenté comme réussi. Si la consigne est inaccessible, CP adapte le support. Si une difficulté technique persiste malgré un support accessible, il prévoit une pratique accompagnée supplémentaire et réestime la charge avant de l'engager. Le temps ou le matériel supplémentaire dépend donc d'un besoin constaté, sans être considéré automatiquement nécessaire.

Le contrôle après formation porte sur un résultat observable, puis sur la réalisation autonome d'un second cas. En cas d'écart persistant, prévoir un accompagnement ciblé et actualiser la charge. Une formation suivie n'est pas automatiquement une compétence acquise.

## Fiche de besoin RH préparée

Statut : proposition fictive, non envoyée. Le recrutement permanent n'est pas nécessaire dans le cas de base. Si une compétence critique reste indisponible : demander un renfort ponctuel en recette web, capable d'utiliser Playwright et de documenter l'accessibilité ; préciser le lot, la disponibilité, le nombre d'heures, le budget restant, le responsable d'accueil et le résultat attendu. La sélection repose sur un exercice pratique accessible et des critères identiques pour les candidats.
