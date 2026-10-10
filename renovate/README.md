# Renovate pour l'org open-ent

Mises à jour de dépendances automatisées pour tous les dépôts de l'org, Dependabot n'étant pas disponible.

| Fichier | Rôle |
|---|---|
| `../renovate-config.json` | Preset partagé : `"extends": ["local>open-ent/.github:renovate-config"]` |
| `config.js` | Configuration du runner auto-hébergé |
| `repositories.json` | Dépôts traités et branche cible des PR (généré) |
| `../.github/workflows/renovate.yml` | Exécution le samedi à 04:00 UTC, ou à la demande |

## Fonctionnement

- **Forks `-patched`** : Renovate lit sa config sur la branche par défaut, celle de l'amont. La branche
  cible (`X.Y.Z-patched-dev`) est donc imposée par `repositories.json`, généré depuis les gitlinks
  d'open-ent-mods : `open-ent-mods/scripts/release/renovate-repos.sh`.
- **Dépôts maison** (open-ent, open-ent-mods, open-ent.github.io…) : un `renovate.json` à la racine
  étend le preset et ajoute les règles propres au dépôt.
- **Versions maison jamais touchées** : `org.entcore`, `fr.wseduc`, `io.edifice`, `fr.openent`,
  `@open-ent/*`, `@edifice.io/*`, Vert.x et Netty (fournis par le launcher).
- **Majeures** : approbation explicite depuis l'issue « Tableau de bord des dépendances » de chaque dépôt.
- **Sécurité** : alertes OSV (`osvVulnerabilityAlerts`), PR immédiates hors planning.
- **Rapport** : `renovate-report.json` allégé, publié sur open-ent.github.io (`data/`), lu par `security.html`.

## Secrets

| Secret | Usage |
|---|---|
| `RENOVATE_TOKEN` | PAT (`repo`, `workflow`, `read:packages`) : PR sur les dépôts, registres GitHub Packages |
| `NEXUS_USER` / `NEXUS_PASSWORD` | Lecture de rct-nexus.tech.fr (artefacts `-patched`, paquets `@openent`) |
| `OPEN_ENT_GITHUB_IO_TOKEN` | Publication du rapport sur open-ent.github.io |

## Premier lancement

Actions → Renovate → Run workflow, `dryRun = full` et `repositories = open-ent/blog,open-ent/wiki` :
rien n'est écrit, le journal liste les branches et PR qui seraient créées. Ensuite, un lancement sans
`dryRun` sur ces dépôts pilotes, puis le cron hebdomadaire prend le relais pour toute la liste.
