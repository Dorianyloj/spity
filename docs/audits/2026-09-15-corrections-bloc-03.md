# Corrections du Bloc 3 après la revue de compétences

Révision du 15 septembre 2026. Cette note répond à l'[audit de couverture](2026-09-15-couverture-competences-bloc-03.md), qui conserve ses constats sur l'ancien support. Le [kit corrigé](../rncp/bloc-03/README.md) contient le PowerPoint visuel v10, le dossier PDF, le guide oral et les annexes cohérentes.

| Compétence | Correction concrète dans le support | Pièce détaillée |
| --- | --- | --- |
| C.3.1 | Slides 3 à 6 : planning global des cinq jalons B1, zoom sur quinze jours, justification Kanban et planning à barres, phase Mesure visible, responsabilités et aménagements. | A01, A02 ; 79 j-h / 5 j-h par semaine = 15,8 semaines sous hypothèse séquentielle explicite. |
| C3.2.1 | Slides 7 à 10 : écart de charge distinct des retards T06/T07 d'un jour, coûts, capacité et risques. Alerte CP à 96,7 % pour un seuil de 90 %. | A03, A09 et classeur de pilotage. |
| C3.2.2 | Slides 11 et 12 : problème, options, limites et décision ; l'option standalone choisie est mise en évidence. | A04, historique Git et distinction entre analyse rétrospective et arbitrage fictif. |
| C3.3.1 | Slides 13 et 14 : quatre styles, analyse critique dans les notes, ressources communes, Camille et cas international Paris/Montréal. La recette était déjà attribuée à QA. | A05 : liens vers CR02, critères, planning et procédure ; avis écrit et reformulation. |
| C3.3.2 | Slides 15 et 16 : grille de six compétences, niveaux actuels et cibles, formation des trois rôles avec échéances ; annexe 25 : besoin RH conditionnel chiffré. | A06 et consolidation.json ; 6 h de formation déjà incluses ; variante de renfort à +202,50 EUR non activée. |
| C3.4.1 | Slides 17 et 18 : extrait de CR02, décisions, responsables et échéances ; protocole de satisfaction avec méthodes, seuils et actions. | A07 ; session pilote prévue à J15, résultats réels non mesurés. |
| C3.4.2 | Slides 19 à 22 : captures actuelles, parcours grimpeur/club, grille finale et décision attendue avant transmission au Bloc 4. | A08 et nouvelle vérification technique du 15 septembre. |

Les 22 diapositives principales conservent une répartition de 30 minutes, dont six minutes de démonstration. Les trois annexes servent aux questions : RACI, sensibilité budgétaire et besoin RH. Le texte oral et les transitions restent dans les notes natives du PowerPoint et dans GUIDE_ORAL.md. La durée réelle doit encore être réglée avec le candidat pendant une répétition chronométrée.

## Vérifications réellement exécutées

Les contrôles applicatifs portent sur la révision 9d166c02c94f39578061bad97fab85f0004a58c0, arbre spity 9109ce976825a6536fa1c7219a2b5ef5e8c3b64c. Lint, TypeScript, build Next.js 16.3.4, 389 tests unitaires dans 72 suites et six scénarios navigateur ont réussi le 15 septembre. Aucun échec, scénario ignoré ou flaky dans cette recette. Les trois captures ont été refaites après la recette. La base locale dédiée a été réutilisée sans réinitialisation.

Node.js 24.14.0 a été utilisé localement ; Node.js 22 reste la référence déclarée par le projet. La recette utilise next dev et MariaDB dédiée, sans nouvelle validation d'un déploiement distant. Les anciennes preuves du 14 septembre sont archivées séparément. Les résultats exacts et leur portée figurent dans [VERIFICATION.md](../rncp/bloc-03/VERIFICATION.md).

Le PowerPoint a été réimporté et rendu : 25 diapositives, 25 notes, sept graphiques natifs avec sept classeurs intégrés, dix diapositives contenant des tableaux natifs. Chaque diapositive a été inspectée à sa taille de rendu ; la séquence a aussi été revue en planches de contact. Le PDF de 29 pages a été rendu et relu, avec vérification détaillée des pages modifiées. Le classeur de base conserve ses cinq feuilles et 175 formules ; ses montants n'ont pas changé. Le validateur documentaire contrôle les totaux, la durée, les références, les parties du PowerPoint, l'archive et la correspondance entre l'arbre applicatif courant et la preuve datée.

## Points qui demandent encore le candidat

La préparation couvre les sept compétences sans présumer de leur acquisition par le jury. Le rôle personnel exact, les interlocuteurs réels, les consignes et dates du campus ainsi que la répétition chronométrée restent dans la checklist. Les données pédagogiques sont identifiées comme telles ; aucune mesure client ni embauche réelle n'est inventée. Linear conserve l'observation du 14 septembre, sans modification de tickets pour représenter l'équipe fictive.

La divergence des anciens diaporamas B1 avec C1.4.1/C1.4.2 reste documentée dans la revue inter-blocs. Le Bloc 3 cite les fiches détaillées ; une remise commune des anciens supports B1 demande leur harmonisation. Aucun dépôt sur DigiformaCertif n'a été effectué.
