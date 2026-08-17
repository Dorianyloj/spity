# Preuves du Bloc 4

J'ai regroupé ici les fichiers utilisés comme preuves dans le dossier. Ils sont datés, anonymisés et reliés à une compétence. Les données publiques peuvent être recapturées avec `npm run bloc4:capture` et l'exercice local avec `npm run bloc4:exercise`.

## Captures visuelles de l'application

Le sous-répertoire [`captures/`](captures/) contient les écrans réels de démonstration produits par `npm run bloc4:visuals`, leur manifeste daté et leur protocole de reproduction. Ces images complètent les preuves structurées ; elles ne remplacent pas les contrôles automatisés.

## Inventaire

| Préfixe | Critère | Preuve |
| --- | --- | --- |
| C411 | C4.1.1 | Audit, décision de maintenance, politique exécutable et métadonnées SBOM. |
| C412 | C4.1.2 | Historique de supervision, santé publique, calcul SLO/couverture, exercice d’alerte et validation syntaxique des scripts GitHub Actions. |
| C421 | C4.2.1 | Registre d’anomalies validé, fiches reproductibles, audit, exercice de cycle de vie et confidentialité. |
| C422 | C4.2.2 | Traitement du correctif, contrôle version/révision, CI/CD et exercice local de promotion. |
| C431 | C4.3.1 | Backlog d'améliorations mesurable, décision, indicateurs, revue et exercice de confidentialité. |
| C432 | C4.3.2 | Journal versionné des publications, déploiements observés, candidats exclus et correctifs documentés. |
| C433 | C4.3.3 | Collaboration support contrôlée : fiche source, registre validé et exercice de rejet. |
| B4-REVUE-FINALE | Transversal | Politique de complétude, audit des sept compétences et cohérence du manifeste. |

`MANIFEST.sha256` permet de détecter toute modification ultérieure des sources et preuves stables. Le PDF final, qui intègre les pièces P1 à P8 et l'audit transversal, est protégé séparément par `livrables/bloc-04/dossier-bloc-04-spity.pdf.sha256`.

## Règles

- ne jamais ajouter de secret, mot de passe, token, IP privée ou donnée personnelle ;
- conserver la date, la source publique, le SHA Git et le critère ;
- annoncer clairement une simulation ou une mise en situation fictive ;
- ne pas figer une capture redondante quand un JSON ou une URL publique apporte une preuve plus vérifiable ;
- mettre à jour le journal uniquement après un déploiement réellement observé ;
- exécuter `npm run bloc4:check` avant toute livraison du dossier ou du PDF ;
- exécuter `npm run bloc4:pdf:verify` pour vérifier l'intégrité du PDF remis.
