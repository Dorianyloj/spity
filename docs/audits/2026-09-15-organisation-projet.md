# Rangement du dépôt — 15 septembre 2026

## Organisation retenue

| Contenu | Emplacement |
| --- | --- |
| Application et configuration technique | `spity/` |
| Guides d'exploitation | `spity/docs/operations/` |
| Sources et preuves RNCP | `docs/rncp/bloc-01/` à `bloc-04/` |
| Exports des Blocs 2, 3 et 4 | `output/bloc-02/`, `output/bloc-03/`, `output/bloc-04/` |
| Anciennes présentations | `output/bloc-03/archives/` |
| Générateurs de soutenance | `tools/bloc3/` |
| Fichiers de travail et secrets locaux | `tmp/`, ignoré par Git |

63 fichiers ont été déplacés. Le répertoire `outputs/` a été absorbé dans `output/`. Le Bloc 2 rejoint les autres blocs dans `docs/rncp/` et ses exports sont séparés des sources. Huit guides auparavant à la racine applicative sont regroupés avec le guide d'administration. Des index expliquent où lire, modifier ou générer chaque document.

Les scripts de génération, liens Markdown, références des registres, politiques de contrôle et chemins des workflows GitHub ont été adaptés. Les bundles de release conservent leurs noms de fichiers usuels. Les dates, statuts et résultats historiques des preuves ne sont pas requalifiés : seules leurs références de fichiers ont été déplacées.

## Vérifications

- Aucun lien Markdown local manquant dans les documents suivis vérifiés, y compris les fichiers déplacés.
- Identité SHA-256 conservée pour les 25 présentations, classeurs, PDF de diaporama et captures déplacés.
- Dossier Bloc 2 HTML/PDF et manifeste régénérés avec le générateur existant ; navigation interne et chargement des images contrôlés par ce générateur.
- Dossiers PDF Blocs 3 et 4 régénérés : pagination conservée (30 et 36 pages). Seuls les textes de la page 8 du Bloc 3 et des pages 7, 25 et 26 du Bloc 4 changent. Ces pages ont été rendues et inspectées ; les chemins restent lisibles.
- Kit Bloc 3 et manifeste reconstruits ; 26 diapositives, 7 graphiques natifs, 5 feuilles de classeur et 175 formules validés. La preuve historique de recette conserve sa portée, distincte de cette vérification documentaire.
- Manifeste Bloc 4 reconstruit et contrôle de complétude réussi pour les 7 compétences et les 124 pièces.
- ESLint, TypeScript et les 55 tests de maintenance réussis. Le premier contrôle de maintenance signalait le manifeste encore non régénéré ; le contrôle final passe avec les empreintes mises à jour.

Les sources applicatives, migrations et données locales n'ont pas été déplacées. Le PowerPoint v16 ouvert dans LibreOffice conserve provisoirement son fichier de verrouillage à l'ancien emplacement ; ce fichier local est désormais ignoré. Pour reprendre l'édition, ouvrir la présentation depuis `output/bloc-03/`.
