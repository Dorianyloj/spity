# Vérifications et portée des preuves

## Recette historique conservée

preuves/verification.json décrit la révision 9d166c0 et l’arbre applicatif 9109ce976825a6536fa1c7219a2b5ef5e8c3b64c : lint, types, build, 389 tests Jest et six scénarios navigateur. Les résultats du 14 septembre sont conservés séparément. Ces contrôles **ne certifient pas la version courante** si son arbre diffère. La révision récente ajoute des changements applicatifs.

## Correction de navigation du 15 septembre

Le rapport docs/audits/2026-09-15-navigation-performances.md consigne lint, types, build, 404 tests Jest et sept scénarios Playwright réussis sur une compilation de production locale avec MariaDB isolée. Les chiffres avant/après proviennent d’un passage par parcours avec CPU ×4, latence 100 ms et débit 1 000 000 octets/s. Ce rapport est une preuve historique consignée, pas une nouvelle exécution lors de la révision documentaire.

## Livraison distante datée

La PR 35 est fusionnée le 15 septembre à 872db19. Le déploiement GitHub Actions 35026306103 termine avec succès. preuves/production-2026-09-15.json conserve la sonde réalisée à 21:39 UTC : santé OK, version 0.1.0 et SHA attendu. Ce fichier est conservé depuis le contrôle réellement exécuté ; sa copie dans le kit ne constitue pas une nouvelle sonde.

## Captures

Les trois captures du 15 septembre représentent la base locale de démonstration. Leur manifeste est inchangé. Elles ne prouvent ni une utilisation par de vrais clients ni le résultat de la prochaine démonstration.

## Livrables v19

La validation documentaire contrôle données sources, formules et valeurs du classeur, chiffres des graphiques, couverture de tous les critères, notes, liens locaux, intégrité PDF/PPTX/ZIP et empreintes. Les rendus sont inspectés avec LibreOffice, sans contrôle revendiqué dans Microsoft PowerPoint. Le résultat détaillé figure dans preuves/controle-kit.json et la portée visuelle dans preuves/controle-visuel.json.

Cette révision ne rejoue pas la recette complète du logiciel. Le lint et le typage requis avant push sont distingués des résultats historiques. La démonstration sur la version choisie et la répétition orale restent à faire avant le passage.

La v19 retire des pages projetées les durées de présentation et les consignes de répétition. Les 26 notes natives sont identiques au texte oral à la première personne. Le guide personnel conserve les repères horaires et les variantes de manipulation. Le contrôle documentaire vérifie cette séparation sur le PDF exporté.

La v19 actualise la diapositive 7 et ses notes à partir de la revue fonctionnelle du 16 septembre : authentification livrée, fonctionnalités disponibles et suites à compléter. Le relevé Linear et ses totaux restent archivés dans A09 et le classeur, sans modification du service externe.
