# Mesures de sécurité et matrice OWASP Top 10 - C2.2.3

## 1. Objectif et référence

Ce document présente les mesures de sécurité intégrées au prototype Spity pour la compétence C2.2.3. La référence retenue est l'[OWASP Top 10:2025](https://owasp.org/Top10/), version publiée la plus récente au 20 juillet 2026.

L'OWASP Top 10 est un document de sensibilisation aux risques, pas une certification de conformité. La méthode appliquée à Spity consiste donc à relier chaque catégorie à :

- une menace concrète du prototype ;
- une ou plusieurs mesures présentes dans le code ou l'infrastructure ;
- une preuve automatisée ou reproductible ;
- un risque résiduel assumé et une suite identifiée.

## 2. Périmètre audité

L'audit porte sur les parcours BC02 suivants :

- inscription, connexion, session et déconnexion ;
- création et modification des profils grimpeur et club ;
- annuaire de matching et demandes de partenariat ;
- création, modification et annulation d'événements ;
- inscription concurrente et désinscription à un événement ;
- chaîne npm, GitHub Actions, image Docker et configuration HTTP.

Les fonctions hors périmètre du prototype, par exemple paiement, upload média et messagerie temps réel, ne sont pas présentées comme sécurisées ou auditées.

## 3. Corrections issues de l'audit

| ID | Écart constaté | Correction mise en œuvre | Preuve |
| --- | --- | --- | --- |
| SEC-01 | Les en-têtes ne comportaient pas de CSP. | CSP centralisée, interdiction des objets et frames, restriction des sources, HSTS en production, politiques cross-origin et suppression de `X-Powered-By`. | `security-headers.ts`, tests unitaires et réponse HTTP de production. |
| SEC-02 | L'ancien `middleware.ts` de limitation n'était plus exécuté avec la convention Next.js 16. | Contrôle déplacé dans les Route Handlers d'authentification, au plus près de la ressource sensible. | Dix tentatives en `401`, onzième en `429` avec `Retry-After` dans le test HTTP/MariaDB. |
| SEC-03 | Le quota d'authentification était identique au quota API générique. | Fenêtre dédiée de 10 tentatives par client sur 15 minutes, en plus du verrouillage temporaire du compte après cinq échecs. | `rate-limit.test.ts` et cas d'intégration IT-SEC-02. |
| SEC-04 | Le contrôle CSRF reposait uniquement sur `Origin`. | Rejet supplémentaire des requêtes marquées `Sec-Fetch-Site: cross-site`. | `csrf.test.ts` et cas IT-SEC-01. |
| SEC-05 | Les événements de sécurité n'étaient pas structurés. | Logger JSON centralisé pour succès/échec de connexion, verrouillage, quota, inscription et origine rejetée, sans email, mot de passe ni jeton. | `logger.ts` et sorties serveur structurées. |
| SEC-06 | Aucun repli utilisateur dédié n'existait pour une erreur de rendu. | Error boundary avec message neutre, relance et retour à l'accueil. | `src/app/error.tsx`, build Next.js réussi. |
| SEC-07 | La surveillance des mises à jour était uniquement manuelle. | Configuration Dependabot hebdomadaire pour npm et GitHub Actions, ciblant `develop`. | `.github/dependabot.yml`. |

La migration de `middleware.ts` vers `proxy.ts` est documentée par [Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16). Le rate limiting ne repose pas sur Proxy, car la [documentation Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) déconseille explicitement de dépendre d'un état partagé à cette frontière réseau.

## 4. Matrice OWASP Top 10:2025

| Catégorie | Risque appliqué à Spity | Mesures et preuves | État |
| --- | --- | --- | :---: |
| **A01 Broken Access Control** | Lecture d'un profil privé, modification de l'événement d'un autre club, traitement d'une demande par l'émetteur, CSRF. | Session contrôlée côté serveur ; rôles `grimpeur`/`club` ; vérification du propriétaire ou destinataire ; réponses `401`/`403` ; cookie `SameSite=Lax` ; contrôle `Origin` et Fetch Metadata. Les tests refusent l'anonyme, l'émetteur non autorisé, le mauvais rôle et masquent les participants aux non-propriétaires. | Couvert |
| **A02 Security Misconfiguration** | Configuration par défaut trop permissive, fuite de technologie, clicjacking, chargement de ressources externes. | Variables validées par Zod ; secrets obligatoires ; CSP ; `frame-ancestors 'none'` ; `X-Frame-Options: DENY` ; HSTS en production ; `nosniff` ; Permissions Policy ; politiques cross-origin ; base de production non exposée ; `poweredByHeader: false`. | Couvert avec réserve CSP |
| **A03 Software Supply Chain Failures** | Dépendance compromise ou vulnérable, action CI obsolète, installation non reproductible. | `package-lock.json`, `npm ci`, audit de production bloquant sur sévérité haute, Dependabot npm/Actions, build et tests dans une CI en lecture seule. | Couvert avec dette modérée suivie |
| **A04 Cryptographic Failures** | Mot de passe lisible, secret faible, cookie intercepté ou jeton falsifié. | bcrypt avec facteur 12 et entrée bornée à 72 octets ; secret HMAC d'au moins 32 caractères ; comparaison de signature en temps constant ; expiration de sept jours ; cookie `HttpOnly`, `Secure` en production et `SameSite=Lax` ; HSTS. | Couvert pour le prototype |
| **A05 Injection** | Injection SQL, script utilisateur, paramètres ou JSON malformés. | Entrées validées et bornées par Zod ; paramètres dynamiques contrôlés ; Drizzle et requêtes paramétrées ; rendu React échappé ; absence de `dangerouslySetInnerHTML`, `eval` métier et SQL concaténé ; CSP en défense complémentaire. | Couvert |
| **A06 Insecure Design** | Contournement d'une transition métier, doublon ou dépassement de capacité. | User stories avec cas négatifs ; refus de l'auto-demande ; paire de partenariat unique ; statuts bornés ; transaction avec verrou `FOR UPDATE` sur la dernière place ; contraintes de base ; quota borné en mémoire. | Couvert pour le périmètre |
| **A07 Authentication Failures** | Brute force, énumération, session faible ou compte forcé. | Erreur de connexion générique ; comparaison bcrypt factice lorsqu'un compte est absent pour limiter l'écart temporel ; politique de mot de passe ; verrouillage temporaire après cinq échecs ; quota client 10/15 min ; session signée et expirante ; journalisation des échecs. Le test d'intégration observe réellement le `429`. | Couvert avec limite distribuée |
| **A08 Software or Data Integrity Failures** | Donnée ou artefact altéré, réponse incohérente, migration non maîtrisée. | Migrations additives versionnées ; lockfile ; réponses API parsées par Zod ; contraintes et transactions MariaDB ; branches `develop`/`main` contrôlées par CI ; image construite depuis les sources verrouillées. | Couvert avec réserve sur la signature des releases |
| **A09 Security Logging and Alerting Failures** | Échec d'authentification ou origine hostile invisible ; fuite de secret dans les logs. | Événements JSON horodatés et nommés ; identifiant interne seulement lorsqu'il existe ; aucun mot de passe, email ou jeton ; artefacts et résultats CI conservés 30 jours. | Partiel : collecte présente, alerting centralisé absent |
| **A10 Mishandling of Exceptional Conditions** | JSON invalide, erreur de base, état concurrent ou erreur de rendu provoquant une fuite ou une incohérence. | Lecture JSON protégée ; réponses typées `4xx`/`5xx` sans stack ; healthcheck neutre ; transactions ; error boundary accessible ; arrêt bloquant des scripts en cas d'échec. | Couvert pour les cas testés |

La liste et les intitulés sont ceux de l'[introduction officielle OWASP Top 10:2025](https://owasp.org/Top10/2025/0x00_2025-Introduction/).

## 5. En-têtes HTTP vérifiés

Après un build de production, `HEAD /login` retourne notamment :

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; ...
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

`X-Powered-By` est désactivé. HSTS n'est volontairement ajouté qu'en production. En développement, le CSP autorise `unsafe-eval` et les WebSockets nécessaires au rechargement Next.js ; ces permissions ne sont pas présentes dans la politique de production.

La politique statique suit l'option sans nonce décrite dans le [guide CSP officiel de Next.js](https://nextjs.org/docs/app/guides/content-security-policy). Elle conserve `unsafe-inline` pour les scripts et styles injectés par le rendu statique Next.js : cette limite est suivie dans les risques résiduels.

## 6. Résultats reproductibles

Commandes exécutées le 20 juillet 2026 :

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run test:integration
npm run security:audit
npm run build
```

Résultats :

- lint et TypeScript strict sans erreur ;
- 83 tests Jest réussis ; couverture de 96 % des lignes et instructions, 89,69 % des branches et 100 % des fonctions sur le périmètre déclaré ;
- 11 résultats TAP réussis, dont le contrôle de quota HTTP et la concurrence MariaDB ;
- aucune vulnérabilité de production critique ou haute signalée par `npm audit` ;
- build de production réussi ;
- en-têtes contrôlés sur le serveur standalone.

Le scénario de quota utilise une adresse réservée à la documentation, envoie onze connexions invalides avec la même identité réseau et vérifie :

```text
tentatives 1 à 10 : 401 Unauthorized
tentative 11      : 429 Too Many Requests
X-RateLimit-Remaining: 0
Retry-After: valeur strictement positive
```

La preuve distante est l'[exécution GitHub Actions no 29743712530](https://github.com/Dorianyloj/spity/actions/runs/29743712530), réussie sur le SHA `3779eee23e86f013c76e54f8f96a44a87a80b31c`. Les jobs `Quality gates`, `MariaDB integration tests` et `Lighthouse thresholds` sont tous réussis ; les rapports sont conservés jusqu'au 19 août 2026.

## 7. Risques résiduels et décisions

| Risque résiduel | Niveau | Décision pour le prototype | Action avant production multi-instance |
| --- | :---: | --- | --- |
| Deux alertes npm modérées concernent le PostCSS embarqué par Next.js. | Modéré | Accepté temporairement : aucune CSS n'est générée depuis une entrée utilisateur ; `npm audit fix --force` propose un downgrade majeur incohérent. | Mettre à jour Next.js dès la publication d'une version embarquant PostCSS corrigé et conserver la CI bloquante sur haut/critique. |
| Le CSP statique contient `unsafe-inline`. | Modéré | Accepté avec React échappé, absence d'HTML injecté et sources externes fortement restreintes. | Étudier des nonces avec rendu dynamique ou SRI lorsque l'option Turbopack sera stable, puis mesurer le coût de performance. |
| Le quota est stocké par processus. | Modéré | Suffisant pour la démonstration mono-instance et explicitement testé. | Utiliser Redis avec clé IP anonymisée, fenêtre atomique et quota partagé entre instances. |
| Un jeton signé reste valide jusqu'à expiration après compromission. | Modéré | Déconnexion côté navigateur et durée limitée à sept jours. | Ajouter identifiant de session, stockage serveur, révocation et rotation du secret. |
| L'inscription révèle qu'une adresse existe déjà. | Faible à modéré | Message utile pour le MVP ; la connexion reste générique. | Réponse neutre ou workflow de récupération de compte par email. |
| Les logs ne déclenchent pas d'alerte. | Modéré | Traces structurées disponibles dans le runtime et la CI. | Centraliser, définir une rétention, masquer les identifiants et alerter sur `rate_limit_exceeded`, verrouillages et pics de `403`. |
| Les actions GitHub utilisent des versions majeures, pas des SHA immuables. | Faible | Dependabot surveille leur mise à jour. | Épingler les actions à des SHA vérifiés dans le durcissement de production. |

L'alerte PostCSS est suivie par l'[avis GitHub GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93). Elle n'est ni masquée ni présentée comme corrigée.

## 8. Conclusion

Les dix catégories OWASP 2025 sont couvertes par au moins une mesure concrète et une preuve sur le périmètre BC02. A09 reste partiel faute de centralisation et d'alerting, et trois limites de production sont explicitement reportées : CSP stricte avec nonce, quota distribué et révocation serveur des sessions.

Cette conclusion vaut pour le prototype audité. Elle ne constitue pas un test d'intrusion ni une garantie absolue contre toute vulnérabilité.
