# 05 — Preuves, reproductibilité et entretien

## 1. Une preuve est utile si elle est rejouable

Le dossier combine quatre niveaux complémentaires. Aucun niveau ne remplace les autres : un document explique, une source fait, un exercice vérifie le comportement et une capture datée atteste un état observé.

| Niveau | Rôle | Exemple |
| --- | --- | --- |
| Documentation | Expliquer la règle et les responsabilités. | `MAINTENANCE.md`, `SUPPORT.md`, `RELEASE_VERIFICATION.md`. |
| Source opérationnelle | Mettre en œuvre la règle. | Politique JSON, script Node.js, workflow GitHub Actions, registre. |
| Contrôle reproductible | Vérifier le comportement attendu et des échecs significatifs. | Exercices incidents, déploiement, release, support et amélioration. |
| Preuve datée | Conserver une sortie lisible liée à une date et à une révision. | Fichiers `B4-C…` dans `../preuves/`. |

## 2. Intégrité et cohérence globale

Le fichier `../preuves/MANIFEST.sha256` contient l'empreinte de chaque document important, politique, script, workflow, test et preuve stable. Toute modification d'un élément inscrit doit donc régénérer le manifeste ; une incohérence est détectée par le contrôle global. Après intégration de ces éléments et de l'audit transversal dans le PDF, `livrables/bloc-04/dossier-bloc-04-spity.pdf.sha256` protège séparément le livrable final.

La commande ci-dessous est la porte principale de cohérence :

```bash
cd spity
npm run bloc4:check
```

Elle contrôle les sept compétences, les statuts des documents, les sources opérationnelles, les assertions des JSON, les quatre registres vivants et les SHA-256 du manifeste. Elle ne contacte ni une base de données, ni la production, ni un service externe.

## 3. Commandes à connaître

| But | Commande |
| --- | --- |
| Contrôle global des 7 compétences | `npm run bloc4:check` |
| Capturer une nouvelle revue transversale | `npm run bloc4:final-audit` |
| Vérifier les dépendances et le SBOM | `npm run dependencies:check` |
| Vérifier la supervision ou le SLO | `npm run monitoring:probe` / `npm run monitoring:slo` |
| Rejouer les exercices de maintenance | `npm run bloc4:exercise`, `npm run bloc4:deployment-exercise` |
| Vérifier les registres | `npm run incidents:check`, `improvements:check`, `releases:check`, `support:check` |
| Lancer la qualité complète | `npm run quality` |
| Régénérer le manifeste | `npm run bloc4:manifest` |
| Régénérer l'export du dossier | `npm run bloc4:pdf` |
| Vérifier l'export PDF | `npm run bloc4:pdf:verify` |

Les exercices utilisent des données et serveurs locaux en mémoire. Ils sont conçus pour prouver les règles sans toucher une instance de production. Aucun LXC n'est utilisé dans ce parcours de vérification.

## 4. Déroulé suggéré pour présenter le Bloc 4

1. **Contexte (1 minute)** : présenter Spity, son architecture et l'objectif de maintenir un service fiable.
2. **Vision d'ensemble (1 minute)** : ouvrir la [revue finale](../REVUE_FINALE_BLOC_04.md) et montrer les sept lignes de correspondance.
3. **Prévention (2 minutes)** : expliquer la politique de dépendances puis la supervision et la distinction S1/S2/S3.
4. **Correction (2 minutes)** : partir de l'incident de dérive, montrer le registre, puis le contrat version/SHA de staging.
5. **Amélioration continue (2 minutes)** : présenter le backlog mesurable, les statuts de release et le protocole support/mainteneur.
6. **Contrôle (2 minutes)** : exécuter `npm run bloc4:check`, ouvrir le manifeste et rappeler les limites assumées.

## 5. Questions fréquentes du jury

### Pourquoi ne pas déclarer la production à jour après une CI verte ?

Parce qu'une CI valide un candidat et son environnement de staging. La production ne peut être déclarée promue qu'après une promotion autorisée et une observation de santé qui confirme la version et le SHA attendus.

### Comment éviter qu'une alerte de supervision soit trompeuse ?

La politique définit la cadence, les reprises et les seuils. Le calcul SLO n'utilise que les runs planifiés et exige une couverture minimale ; en dessous, le statut est `insufficient-data`, pas « incident ».

### Qu'est-ce qui garantit que les fichiers de preuve ne sont pas modifiés après coup ?

Le manifeste SHA-256 couvre les éléments de preuve et le contrôle Bloc 4 compare les empreintes calculées à celles qui sont versionnées.

### Quelle est la limite de la preuve de support ?

Elle est une simulation contrôlée, clairement indiquée. Elle démontre le format de collaboration, les critères fonctionnels et les contrôles de confidentialité, mais ne prétend pas représenter un échange avec un client réel.

## 6. Restitution finale

Le dossier détaillé, la revue finale et les preuves structurées sont intégrés dans le PDF disponible sous `livrables/bloc-04/dossier-bloc-04-spity.pdf`. Le manifeste protège les entrées stables et l'empreinte détachée protège le livrable ; les deux contrôles doivent être rejoués dès qu'une source évolue.
