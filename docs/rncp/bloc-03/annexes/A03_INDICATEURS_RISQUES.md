# A03 - Indicateurs, coûts et risques

Nature : données simulées à J10. Les taux servent à valoriser le travail dans le cas ; aucune dépense réelle n’est attestée.

| Rôle | Prévu h | À terminaison h | Capacité h | Occupation | EUR/h |
| --- | --- | --- | --- | --- | --- |
| CP | 28 | 29 | 30 | 96.7% | 45 |
| DEV | 62 | 64 | 72 | 88.9% | 35 |
| QA | 22 | 24 | 30 | 80.0% | 30 |

Les trois rôles représentent 112 h prévues, 77 h consommées et 40 h restantes. La prévision de 117 h est supérieure de 5 h au plan. La somme des capacités vaut 132 h, mais cette capacité ne se substitue pas librement entre métiers : DEV ne peut pas absorber du travail QA sans vérifier ses compétences et la séparation réalisation/validation.

Coût initial : 28 x 45 + 62 x 35 + 22 x 30 = 4 090 EUR de travail, plus 180 EUR de frais, soit 4 270 EUR. Prévision : 29 x 45 + 64 x 35 + 24 x 30 = 4 265 EUR, plus 200 EUR de frais, soit 4 465 EUR. Le dépassement de 195 EUR vaut 4,6 % de la référence. La réserve de 427 EUR porte le plafond à 4 697 EUR, avec 232 EUR de marge prévisionnelle.

Le consommé économique du cas vaut 2 945 EUR, dont 2 825 EUR de travail et 120 EUR de frais. Il ne s'agit pas d'un relevé bancaire. Les variations sont calculées à périmètre et taux constants.

## Registre des risques

Échelle proposée : probabilité et impact de 1 (faible) à 3 (fort). Priorité = produit des deux. Un score de 6 ou 9 déclenche une revue avant engagement du jalon. Ce score aide à ordonner l'analyse, sans remplacer la décision.

| ID | Risque | P | I | Score | Responsable |
| --- | --- | --- | --- | --- | --- |
| R01 | Environnement de démonstration indisponible | 3 | 3 | 9 | CP |
| R02 | Surcharge du chef de projet | 2 | 3 | 6 | CP |
| R03 | Ajout tardif de contributions aux topos | 2 | 3 | 6 | CP |
| R04 | Défaut de capacité des événements | 2 | 3 | 6 | DEV |
| R05 | Consignes de dépôt non confirmées | 2 | 3 | 6 | CP |

**R01** - Déclencheur : Sonde de santé indisponible ou base inaccessible. Réponse : Tester l'installation à J12, répéter à J14 et conserver des captures datées de secours.

**R02** - Déclencheur : Prévision de charge supérieure à 90 % de la capacité. Réponse : Limiter le travail simultané et faire préparer la grille de recette par QA.

**R03** - Déclencheur : Nouvelle demande sans capacité ni recette disponible. Réponse : Reporter ce lot après la démonstration et consigner la décision client simulée.

**R04** - Déclencheur : Deux inscriptions acceptées sur la dernière place. Réponse : Vérifier l'inscription concurrente et les refus d'accès.

**R05** - Déclencheur : Date limite ou livrable demandé non identifié. Réponse : Consulter la convocation et le règlement spécial avant le dépôt.

## Règles de suivi

Chaque rôle actualise son consommé et son reste à faire. CP vérifie deux fois par semaine l'écart, les dates et la capacité. Une variation de budget dépassant la réserve, une charge supérieure à la capacité ou un critère critique non vérifié déclenche un arbitrage documenté. Les indicateurs de qualité s'appuient sur les résultats réellement exécutés dans VERIFICATION.md.

Linear a été relu directement le 14 septembre : 12 Done, 4 Todo, 1 In Progress, 7 Backlog et 1 Canceled. Le taux de tickets Done est de 12 / 24 = 50 % hors annulé. Il ne mesure pas la part de produit livrée. A09 conserve le relevé, les dépendances lues, les 30 activités estimées et les tests de sensibilité. La feuille Linear reste distincte du scénario.

## Écarts de dates et décision de suivi

| Tâche | Fin initiale | Fin revue à J10 | Retard prévisionnel | Conséquence |
| --- | --- | --- | --- | --- |
| T06 - Événements | J11 | J12 | 1 jour | Préserver les critères de capacité et préparer les corrections. |
| T07 - Recette | J13 | J14 | 1 jour | Clôturer après T06 et T10, avant la démonstration J15. |

Le retard se calcule par fin revue moins fin initiale. Ces deux écarts ne s'additionnent pas pour annoncer deux jours de retard de la démonstration : celle-ci reste prévue à J15. Les +5 h de charge ne sont pas cinq jours de retard. Exemple de mise à jour : renseigner le reste à faire T06 et sa nouvelle fin, relire charge/coût, vérifier la dépendance de T07 puis consigner l'effet dans CR02.

CP atteint 96,7 % de sa capacité, au-dessus de l'alerte de 90 %. Le scénario limite les demandes nouvelles et protège ses créneaux d'arbitrage. La recette est déjà confiée à QA ; ce n'est pas une nouvelle réaffectation faisant gagner des heures à CP. Tout ajout mobilisant plus que sa marge d'une heure nécessite un arbitrage. La capacité restante des autres rôles ne prouve pas qu'ils disposent de la compétence requise pour reprendre une tâche.
