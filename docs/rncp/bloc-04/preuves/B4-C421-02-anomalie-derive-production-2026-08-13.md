# B4-C421-02 - Anomalie opérationnelle : dérive de révision en production

## Constat réel

Le 13 août 2026, `https://spity.fr/api/health` répond `ok`, avec la version `0.1.0-jury` et la révision `49c4ea0ffa34b35e9ad5bc2e1a838eb82eb0b8ef`. La branche `main` de référence était alors `e3784b7e6a1b3be4b7c6cb46938701bb4449027b`, soit 19 commits plus loin.

## Qualification

- sévérité : S3, service disponible mais traçabilité et correctifs récents non promus ;
- impact : les corrections d'accessibilité, de CI et de maintenance sont validées mais absentes de la production ;
- risque : confusion lors d'un diagnostic et exposition prolongée à des défauts déjà corrigés ;
- absence d'impact immédiat : la route de santé et MariaDB répondent correctement.

## Reproduction

```bash
curl --fail --silent https://spity.fr/api/health
git rev-parse main
git rev-list --count 49c4ea0..main
```

## Décision

Ne pas déployer uniquement pour fermer l'écart documentaire. La promotion doit suivre une release versionnée, une sauvegarde, les migrations, la CI complète, la validation des images candidates et le contrôle post-déploiement décrit dans `spity/DEPLOYMENT.md`.

## Action proposée

Préparer une release `v0.1.1`, vérifier sa révision et ses digests, la promouvoir avec le workflow `Release`, puis confirmer que `/api/health` expose exactement la version et le SHA attendus. Le présent travail n'a déclenché aucun déploiement de production.
