import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const workflowsDirectory = resolve(repositoryRoot, '.github/workflows')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

const issue = (code, path, message) => ({ code, path, message })

export const auditGithubScriptSources = (sources) => {
  const errors = []
  const scripts = []

  for (const source of sources) {
    let workflow

    try {
      workflow = yaml.load(source.content)
    } catch (error) {
      errors.push(issue('invalid-workflow-yaml', source.path, error instanceof Error ? error.message : String(error)))
      continue
    }

    for (const [jobName, job] of Object.entries(workflow?.jobs ?? {})) {
      for (const [stepIndex, step] of (job.steps ?? []).entries()) {
        if (!String(step.uses ?? '').startsWith('actions/github-script@')) continue

        const path = `${source.path}#${jobName}:step-${stepIndex + 1}`
        const script = step.with?.script
        scripts.push({ path, name: step.name ?? null })

        if (typeof script !== 'string' || script.trim() === '') {
          errors.push(issue('missing-github-script', path, 'Le bloc actions/github-script doit contenir un script non vide.'))
          continue
        }

        try {
          new AsyncFunction('github', 'context', 'require', 'core', script)
        } catch (error) {
          errors.push(issue('invalid-github-script-syntax', path, error instanceof Error ? error.message : String(error)))
        }
      }
    }
  }

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    workflowCount: sources.length,
    scriptCount: scripts.length,
    scripts,
    errors,
  }
}

export const auditGithubScriptWorkflows = async ({ directory = workflowsDirectory } = {}) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const workflowFiles = entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => resolve(directory, entry.name))
    .sort((left, right) => left.localeCompare(right, 'fr'))
  const sources = await Promise.all(workflowFiles.map(async (path) => ({
    path: relative(repositoryRoot, path).replaceAll('\\', '/'),
    content: await readFile(path, 'utf8'),
  })))

  return auditGithubScriptSources(sources)
}

export const writeWorkflowScriptReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return absolutePath
}

const outputArgument = process.argv.find((argument) => argument.startsWith('--output='))
const outputPath = outputArgument?.slice('--output='.length)
const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const report = await auditGithubScriptWorkflows()
  if (outputPath) await writeWorkflowScriptReport(outputPath, report)
  console.info(JSON.stringify(report, null, 2))
  if (!report.compliant) process.exitCode = 1
}
