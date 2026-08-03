import { readFile } from 'node:fs/promises'

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME

if (!tag) {
  throw new Error('Un tag de version est requis, par exemple v0.1.0.')
}

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
)
const version = packageJson.version

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`La version package.json n'est pas une version SemVer stable : ${version}`)
}

if (tag !== `v${version}`) {
  throw new Error(`Le tag ${tag} ne correspond pas à package.json (${version}).`)
}

const changelog = await readFile(new URL('../../CHANGELOG.md', import.meta.url), 'utf8')

if (!changelog.includes(`## [${version}] - `)) {
  throw new Error(`CHANGELOG.md ne contient aucune entrée datée pour ${version}.`)
}

process.stdout.write(`${JSON.stringify({ tag, version })}\n`)
