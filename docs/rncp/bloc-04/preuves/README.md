# Preuves du Bloc 4

Les fichiers de ce répertoire sont datés, anonymisés et reliés à un critère. Les fichiers JSON issus de sources publiques sont régénérés par `npm run bloc4:capture`. L'exercice local est régénéré par `npm run bloc4:exercise`.

## Captures visuelles de l'application

Le sous-répertoire [`captures/`](captures/) contient les écrans réels de démonstration produits par `npm run bloc4:visuals`, leur manifeste daté et leur protocole de reproduction. Ces images complètent les preuves structurées ; elles ne remplacent pas les contrôles automatisés.

## Inventaire

| Préfixe | Critère | Preuve |
| --- | --- | --- |
| C411 | C4.1.1 | Audit, décision de maintenance, politique exécutable et métadonnées SBOM. |
| C412 | C4.1.2 | Historique de supervision, santé publique, calcul SLO/couverture et exercice d’alerte. |
| C421 | C4.2.1 | Registre d’anomalies validé, fiches reproductibles, audit, exercice de cycle de vie et confidentialité. |
| C422 | C4.2.2 | Traitement du correctif, contrôle version/révision, CI/CD et exercice local de promotion. |
| C431 | C4.3.1 | Backlog d'améliorations mesurable, décision, indicateurs, revue et exercice de confidentialité. |
| C432 | C4.3.2 | Journal versionné des publications, déploiements observés, candidats exclus et correctifs documentés. |
| C433 | C4.3.3 | Collaboration support contrôlée : fiche source, registre validé et exercice de rejet. |
| B4-REVUE-FINALE | Transversal | Politique de complétude, audit des sept compétences et cohérence du manifeste. |

`MANIFEST.sha256` permet de détecter toute modification ultérieure des preuves et du PDF final.

## Règles

- ne jamais ajouter de secret, mot de passe, token, IP privée ou donnée personnelle ;
- conserver la date, la source publique, le SHA Git et le critère ;
- annoncer clairement une simulation ou une mise en situation fictive ;
- ne pas figer une capture redondante quand un JSON ou une URL publique apporte une preuve plus vérifiable ;
- mettre à jour le journal uniquement après un déploiement réellement observé.
- exécuter `npm run bloc4:check` avant toute livraison du dossier ou du PDF.
