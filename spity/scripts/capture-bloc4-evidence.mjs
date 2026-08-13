import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(applicationRoot, '..')
const evidenceDirectory = resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves')
const capturedAt = new Date().toISOString()
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'spity-bloc4-evidence/1.0',
  'X-GitHub-Api-Version': '2022-11-28',
}

const fetchJson = async (url) => {
  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`La source ${url} répond avec le statut ${response.status}`)
  }

  return response.json()
}

const writeJson = async (filename, value) => {
  await mkdir(evidenceDirectory, { recursive: true })
  await writeFile(resolve(evidenceDirectory, filename), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

const runNpmJson = (args) => {
  const npmCli = process.env.npm_execpath

  if (!npmCli) {
    throw new Error('Le chemin du CLI npm est indisponible ; lancer la capture avec npm run bloc4:capture')
  }

  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd: applicationRoot, encoding: 'utf8' })

  if (result.error) {
    throw result.error
  }

  if (!result.stdout?.trim()) {
    throw new Error(result.stderr || `npm ${args.join(' ')} n'a produit aucun rapport`)
  }

  return JSON.parse(result.stdout)
}

const repositoryRevision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim()
const packageJson = JSON.parse(await readFile(resolve(applicationRoot, 'package.json'), 'utf8'))
const packageLock = await readFile(resolve(applicationRoot, 'package-lock.json'))
const productionAudit = runNpmJson(['audit', '--omit=dev', '--json'])
const completeAudit = runNpmJson(['audit', '--json'])
const outdated = runNpmJson(['outdated', '--json'])
const health = await fetchJson('https://spity.fr/api/health')
const monitoring = await fetchJson('https://api.github.com/repos/Dorianyloj/spity/actions/workflows/production-monitoring.yml/runs?per_page=30')
const ciRunId = process.env.BLOC4_CI_RUN_ID ?? '31604246584'
const ciRun = await fetchJson(`https://api.github.com/repos/Dorianyloj/spity/actions/runs/${ciRunId}`)
const release = await fetchJson('https://api.github.com/repos/Dorianyloj/spity/releases/tags/v0.1.0')
const deployedSecurityCommit = await fetchJson('https://api.github.com/repos/Dorianyloj/spity/commits/49c4ea0ffa34b35e9ad5bc2e1a838eb82eb0b8ef')
const completedRuns = monitoring.workflow_runs.filter((run) => run.status === 'completed')
const successfulRuns = completedRuns.filter((run) => run.conclusion === 'success')

await writeJson('B4-C411-01-audit-dependances-2026-08-13.json', {
  schemaVersion: 1,
  capturedAt,
  criterion: 'C4.1.1',
  repositoryRevision,
  lockfileSha256: createHash('sha256').update(packageLock).digest('hex'),
  runtime: packageJson.engines,
  controlledVersions: Object.fromEntries([
    'next',
    'react',
    'react-dom',
    'eslint-config-next',
    'lighthouse',
    'puppeteer-core',
    '@playwright/test',
    'drizzle-kit',
  ].map((name) => [name, packageJson.dependencies?.[name] ?? packageJson.devDependencies?.[name]])),
  productionAudit: productionAudit.metadata.vulnerabilities,
  completeAudit: completeAudit.metadata.vulnerabilities,
  outdatedPackages: Object.entries(outdated).map(([name, value]) => ({ name, current: value.current, wanted: value.wanted, latest: value.latest })),
  decisions: [
    'No high or critical production vulnerability is accepted.',
    'Lighthouse and Puppeteer were upgraded to remove the remediable high development-tooling advisories.',
    'The remaining moderate Drizzle/esbuild advisories are development-only; npm proposes a breaking downgrade, so they are tracked instead of force-fixed.',
    'Major upgrades are isolated and validated through lint, type checking, tests, audits, build, browser acceptance and accessibility gates.',
  ],
})

await writeJson('B4-C412-01-historique-supervision-2026-08-13.json', {
  schemaVersion: 1,
  capturedAt,
  criterion: 'C4.1.2',
  source: 'https://api.github.com/repos/Dorianyloj/spity/actions/workflows/production-monitoring.yml/runs?per_page=30',
  repositoryRevision,
  totalRuns: monitoring.total_count,
  sampleSize: completedRuns.length,
  successfulRuns: successfulRuns.length,
  successRatePercent: completedRuns.length === 0 ? null : Number((successfulRuns.length * 100 / completedRuns.length).toFixed(2)),
  latestRuns: monitoring.workflow_runs.slice(0, 10).map((run) => ({
    id: run.id,
    status: run.status,
    conclusion: run.conclusion,
    event: run.event,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    revision: run.head_sha,
    url: run.html_url,
  })),
})

await writeJson('B4-C412-02-sante-production-2026-08-13.json', {
  schemaVersion: 1,
  capturedAt,
  criterion: 'C4.1.2',
  source: 'https://spity.fr/api/health',
  response: health,
})

await writeJson('B4-C422-01-correctif-et-ci-2026-08-13.json', {
  schemaVersion: 1,
  capturedAt,
  criteria: ['C4.2.2', 'C4.3.2'],
  greenCiBaseline: {
    id: ciRun.id,
    status: ciRun.status,
    conclusion: ciRun.conclusion,
    revision: ciRun.head_sha,
    createdAt: ciRun.created_at,
    updatedAt: ciRun.updated_at,
    url: ciRun.html_url,
  },
  deployedSecurityCorrection: {
    revision: deployedSecurityCommit.sha,
    message: deployedSecurityCommit.commit.message,
    committedAt: deployedSecurityCommit.commit.committer.date,
    url: deployedSecurityCommit.html_url,
    observedProductionVersion: health.version,
    observedProductionRevision: health.revision,
  },
  publishedRelease: {
    tag: release.tag_name,
    name: release.name,
    publishedAt: release.published_at,
    url: release.html_url,
    prerelease: release.prerelease,
  },
})

console.info(`Preuves Bloc 4 mises à jour dans ${evidenceDirectory}`)
