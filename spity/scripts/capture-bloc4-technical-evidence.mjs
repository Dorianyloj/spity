import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { chromium } from '@playwright/test'

const executeFile = promisify(execFile)
const repositoryRoot = resolve('..')
const outputDirectory = resolve('../docs/rncp/bloc-04/preuves/captures')
const repositoryUrl = 'https://github.com/Dorianyloj/spity'

const webCaptures = [
  {
    id: 'B4-TECH-02',
    label: 'Historique Git sur main',
    purpose: 'Traçabilité des changements, des commits et de la branche de référence.',
    url: `${repositoryUrl}/commits/main`,
    expectedText: 'fix(bloc4): stabilize competency PDF headings',
    file: 'B4-TECH-02-historique-git-github-2026-08-17.png',
  },
  {
    id: 'B4-TECH-03',
    label: 'GitHub Actions - CI main validée',
    purpose: 'Validation automatisée du commit sur la branche principale.',
    url: `${repositoryUrl}/actions/runs/31778632975`,
    expectedText: 'Success',
    file: 'B4-TECH-03-ci-main-github-2026-08-17.png',
  },
  {
    id: 'B4-TECH-04',
    label: 'GitHub Actions - CI develop et staging validés',
    purpose: 'Validation CI/CD de develop, incluant le déploiement de staging vérifié.',
    url: `${repositoryUrl}/actions/runs/31778635277`,
    expectedText: 'Success',
    file: 'B4-TECH-04-ci-develop-staging-github-2026-08-17.png',
  },
]

const redact = (value) => value
  .replace(/(ghp_|github_pat_)[A-Za-z0-9_]+/g, '[REDACTED_GITHUB_TOKEN]')
  .replace(/https:\/\/[^\s/@]+@/g, 'https://[REDACTED]@')
  .trim()

const run = async (command, args) => {
  const { stdout, stderr } = await executeFile(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    windowsHide: true,
  })
  return redact(`${stdout}${stderr}`)
}

const htmlEscape = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const terminalPage = (title, command, output, caption) => `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: #101c1e; color: #eff6ef; font-family: Arial, sans-serif; }
      main { width: 1440px; min-height: 1000px; padding: 74px 94px; background: radial-gradient(circle at top right, #264b45, #101c1e 52%); }
      .eyebrow { color: #a9d576; font-size: 19px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
      h1 { margin: 14px 0 12px; font-size: 48px; line-height: 1.1; }
      p { margin: 0 0 28px; color: #d3ddd5; font-size: 23px; line-height: 1.45; max-width: 1050px; }
      .terminal { border: 1px solid #678275; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34); }
      .bar { display: flex; gap: 10px; align-items: center; padding: 17px 22px; background: #1a3030; border-bottom: 1px solid #678275; }
      .dot { width: 13px; height: 13px; border-radius: 50%; background: #8bb957; }
      .bar span { margin-left: 8px; color: #d3ddd5; font-family: ui-monospace, Consolas, monospace; font-size: 17px; }
      pre { margin: 0; padding: 34px; min-height: 570px; background: #0b1214; color: #eaf5e7; font: 20px/1.52 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
      .command { color: #a9d576; }
      .footer { margin-top: 22px; color: #bdcbbf; font-size: 16px; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Preuve technique reproductible</div>
      <h1>${htmlEscape(title)}</h1>
      <p>${htmlEscape(caption)}</p>
      <section class="terminal" aria-label="Sortie terminal réelle">
        <div class="bar"><i class="dot"></i><span>capture en lecture seule</span></div>
        <pre><span class="command">$ ${htmlEscape(command)}</span>\n\n${htmlEscape(output)}</pre>
      </section>
      <div class="footer">Source : commandes locales Git et Bloc 4 exécutées au moment de la capture. Les sorties sensibles sont masquées.</div>
    </main>
  </body>
</html>`

const captureRenderedTerminal = async (page, capture, command, output, caption) => {
  await page.setContent(terminalPage(capture.label, command, output, caption), { waitUntil: 'networkidle' })
  await page.screenshot({
    path: resolve(outputDirectory, capture.file),
    fullPage: false,
    animations: 'disabled',
  })
  const image = await stat(resolve(outputDirectory, capture.file))
  assert.ok(image.size > 0, `Capture vide : ${capture.file}`)
  return image.size
}

await mkdir(outputDirectory, { recursive: true })

const gitSnapshot = [
  `$ git remote get-url origin\n${await run('git', ['remote', 'get-url', 'origin'])}`,
  `$ git branch -vv\n${await run('git', ['branch', '-vv'])}`,
  `$ git log --decorate --oneline -4\n${await run('git', ['log', '--decorate', '--oneline', '-4'])}`,
].join('\n\n')

const auditRaw = await run(process.execPath, ['spity/scripts/check-bloc4-completeness.mjs'])
const auditJson = auditRaw.match(/\{[\s\S]+\}\s*$/)?.[0]
assert.ok(auditJson, 'Rapport Bloc 4 JSON introuvable.')
const audit = JSON.parse(auditJson)
assert.equal(audit.compliant, true, 'Le contrôle Bloc 4 doit être conforme avant capture.')
const auditSnapshot = [
  `Conforme : ${audit.compliant ? 'oui' : 'non'}`,
  `Compétences : ${audit.compliantCompetencyCount}/${audit.competencyCount}`,
  `Manifeste : ${audit.manifest.entryCount} fichiers, ${audit.manifest.compliant ? 'valide' : 'invalide'}`,
  '',
  ...audit.competencies.map((competency) => `${competency.id} - ${competency.compliant ? 'conforme' : 'non conforme'} - ${competency.title}`),
].join('\n')

const localCaptures = [
  {
    id: 'B4-TECH-01',
    label: 'État Git du dépôt',
    purpose: 'Branches, dépôt distant SSH et historique de commits lus directement depuis Git.',
    file: 'B4-TECH-01-etat-git-local-2026-08-17.png',
    command: 'git remote get-url origin ; git branch -vv ; git log --decorate --oneline -4',
    output: gitSnapshot,
  },
  {
    id: 'B4-TECH-05',
    label: 'Audit transversal des sept compétences',
    purpose: 'Résultat réel de la commande de contrôle Bloc 4 et des sept compétences.',
    file: 'B4-TECH-05-audit-bloc4-local-2026-08-17.png',
    command: 'node spity/scripts/check-bloc4-completeness.mjs',
    output: auditSnapshot,
  },
]

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? chromium.executablePath(),
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  const results = []
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
  })
  const page = await context.newPage()

  for (const capture of localCaptures) {
    const byteSize = await captureRenderedTerminal(page, capture, capture.command, capture.output, capture.purpose)
    results.push({
      id: capture.id,
      label: capture.label,
      source: 'commandes-locales',
      command: capture.command,
      file: capture.file,
      viewport: { width: 1440, height: 1000 },
      byteSize,
    })
  }

  for (const capture of webCaptures) {
    await page.goto(capture.url, { waitUntil: 'domcontentloaded' })
    await page.locator('main').waitFor({ state: 'visible' })
    const visibleText = await page.locator('body').innerText()
    assert.ok(visibleText.includes(capture.expectedText), `Preuve GitHub introuvable : ${capture.expectedText}`)
    await page.screenshot({
      path: resolve(outputDirectory, capture.file),
      fullPage: false,
      animations: 'disabled',
    })
    const image = await stat(resolve(outputDirectory, capture.file))
    assert.ok(image.size > 0, `Capture vide : ${capture.file}`)
    results.push({
      id: capture.id,
      label: capture.label,
      source: 'github-public',
      url: capture.url,
      expectedText: capture.expectedText,
      file: capture.file,
      viewport: { width: 1440, height: 1000 },
      byteSize: image.size,
    })
  }

  await context.close()
  await writeFile(
    resolve(outputDirectory, 'manifest-technique.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      capturedAt: new Date().toISOString(),
      source: 'git-local-et-github-public',
      sensitiveData: 'Aucun secret, cookie ou jeton n’est inclus. Les captures GitHub peuvent afficher les métadonnées publiques du dépôt nécessaires à la traçabilité.',
      captures: results,
    }, null, 2)}\n`,
  )
  process.stdout.write(`${JSON.stringify({ captures: results.length, outputDirectory })}\n`)
} finally {
  await browser.close()
}
