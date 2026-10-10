// Configuration du Renovate auto-hébergé de l'org open-ent (workflow renovate.yml).
//
// - Le preset partagé (renovate-config.json, à la racine de ce dépôt) s'applique
//   à TOUS les dépôts via globalExtends, qu'ils aient un renovate.json ou non.
// - La liste des dépôts et leur branche de base viennent de repositories.json,
//   généré par open-ent-mods/scripts/release/renovate-repos.sh : Renovate lit sa
//   config sur la branche par défaut, qui pour un fork est celle de l'amont, alors
//   que le travail se fait sur « X.Y.Z-patched-dev ».
const fs = require('fs');
const path = require('path');

// Dans le conteneur de renovatebot/github-action, ce fichier est monté seul sous
// /github-action/ : repositories.json est alors lu depuis /tmp/renovate (copié par
// le workflow, /tmp étant monté). En local, il est lu à côté de ce fichier.
const reposFile = [path.join(__dirname, 'repositories.json'), '/tmp/renovate/repositories.json']
  .find((f) => fs.existsSync(f));

module.exports = {
  platform: 'github',
  gitAuthor: 'Renovate Bot <renovate@open-ent.github.io>',
  onboarding: false,
  requireConfig: 'optional',
  forkProcessing: 'enabled',
  globalExtends: ['local>open-ent/.github:renovate-config'],
  repositories: JSON.parse(fs.readFileSync(reposFile, 'utf8')),

  // Rapport JSON (dépendances détectées + mises à jour en attente, par dépôt),
  // publié sur open-ent.github.io pour la page security.html. Le workflow
  // surcharge le chemin par RENOVATE_REPORT_PATH.
  reportType: 'file',
  reportPath: 'renovate-report.json',

  hostRules: [
    {
      // Registres GitHub Packages de l'org (Maven entcore-v2, npm @open-ent).
      matchHost: 'maven.pkg.github.com',
      hostType: 'maven',
      token: process.env.RENOVATE_TOKEN,
    },
    {
      matchHost: 'npm.pkg.github.com',
      hostType: 'npm',
      token: process.env.RENOVATE_TOKEN,
    },
    // Nexus PASS-TECH : artefacts -patched (Maven) et paquets @openent/@passtech (npm).
    // Règle omise sans identifiants (lancement local) : le Nexus répond alors 401
    // et seuls les artefacts maison, déjà exclus par le preset, en dépendent.
    ...(process.env.NEXUS_USER
      ? [{ matchHost: 'rct-nexus.tech.fr', username: process.env.NEXUS_USER, password: process.env.NEXUS_PASSWORD }]
      : []),
  ],
};
