# État des lieux du projet Spity

**Date de contrôle :** 12 août 2026

**Branche auditée :** `main`

**Révision de départ :** `25cc574`

**Périmètre :** dépôt Git, structure documentaire, dépendances, qualité locale et disponibilité publique.

## Synthèse

L'application est fonctionnelle, structurée par domaines métier et publiquement disponible. Le dépôt possède déjà une chaîne CI/CD, des tests, une route de santé, Dependabot et un journal des versions. Ces éléments constituent une base solide pour le bloc 4.

Trois écarts restent prioritaires :

1. la production expose une révision située 15 commits derrière `main` au moment de l'audit ;
2. aucune exécution historique d'une supervision planifiée ni alerte réelle n'est encore disponible comme preuve ;
3. aucun cas réel de collaboration avec un support client n'est consigné.

L'écart de couverture découvert pendant l'audit a été corrigé par des tests ciblés, sans abaisser les seuils.

## État Git

- `origin` utilise déjà SSH : `git@github.com:Dorianyloj/spity.git` ;
- `main` suit `origin/main` ;
- `develop` est entièrement fusionnée dans `main` et reste conservée comme branche d'intégration ;
- la branche distante `feat/profile-equipment-inventory`, déjà fusionnée, a été supprimée ;
- cinq branches Dependabot avec des pull requests ou commits uniques sont conservées ;
- l'élagage automatique des références distantes est activé avec `fetch.prune=true` ;
- le dépôt était propre au début de l'audit.

## Organisation du dépôt

La séparation retenue est désormais la suivante :

- `spity/` contient uniquement l'application et son exploitation ;
- `docs/bc02/` conserve le dossier bloc 2 et ses chemins historiques ;
- `docs/rncp/bloc-01/` regroupe les anciens fichiers RNCP dispersés sous l'application ;
- `docs/rncp/bloc-04/` accueille le nouveau dossier bloc 4 ;
- `docs/rncp/referentiel/` contient la source officielle de contrôle ;
- les cinq SVG de démonstration Next.js non utilisés sont retirés.

## Contrôles techniques

| Contrôle | Résultat | Observation |
| --- | --- | --- |
| ESLint | Réussi | Aucun échec. |
| TypeScript | Réussi | `tsc --noEmit` passe. |
| Tests Jest | 152/152 réussis | 33 suites réussies. |
| Couverture | Réussi | 60,16 % lignes/instructions, 59,07 % fonctions et 77,56 % branches. |
| Audit production | Réussi après correction | 0 vulnérabilité avec `npm audit --omit=dev --audit-level=high`. |
| Audit complet | À suivre | 4 alertes modérées dans l'outillage Drizzle/esbuild ; la correction forcée proposée serait cassante. |
| Build Next.js | Réussi | Build de production validé avec Next.js 16.3.0, 28 pages statiques générées et routes dynamiques compilées. |

La machine d'audit utilise Node.js 24 alors que le dépôt impose Node.js 22. Les contrôles passent, mais les validations de référence doivent continuer à utiliser `.nvmrc` et Node.js 22 en CI.

## Production

Le 12 août 2026, `https://spity.fr/api/health` répond :

```json
{
  "status": "ok",
  "version": "0.1.0-jury",
  "revision": "49c4ea0ffa34b35e9ad5bc2e1a838eb82eb0b8ef"
}
```

La disponibilité et la connexion à MariaDB sont donc confirmées par la sonde applicative. La révision déployée reste toutefois 15 commits derrière la révision de départ de `main`. Une nouvelle release ne doit être promue qu'après validation complète de la CI.

## Décisions de nettoyage

- ne supprimer aucune branche contenant un commit unique ;
- conserver `main` et `develop` tant que Dependabot et la CI ciblent `develop` ;
- ne pas exécuter `npm audit fix --force`, qui imposerait une modification cassante de Drizzle Kit ;
- conserver `.env.local` et `node_modules`, qui sont locaux et ignorés ;
- exclure `tmp/` du suivi Git et supprimer les rendus PDF temporaires après analyse ;
- maintenir les anciens chemins BC02 afin de préserver les liens du livrable déjà remis.

## Priorités suivantes

1. laisser la supervision planifiée produire un historique et tester une alerte contrôlée ;
2. traiter un incident réel ou un exercice documenté de bout en bout ;
3. déployer une révision récente après validation ;
4. consigner un échange réel avec le support ou un utilisateur pilote ;
5. assembler les preuves et rédiger le dossier final du bloc 4.
