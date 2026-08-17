import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const defaultPdfPath = resolve(repositoryRoot, 'livrables/bloc-04/dossier-bloc-04-spity.pdf')
const defaultChecksumPath = resolve(repositoryRoot, 'livrables/bloc-04/dossier-bloc-04-spity.pdf.sha256')

export const verifyPdfChecksum = async ({
  checksumPath = defaultChecksumPath,
  pdfPath = defaultPdfPath,
} = {}) => {
  const errors = []
  let expectedHash = null
  let actualHash = null

  try {
    const checksum = (await readFile(checksumPath, 'utf8')).trim()
    const match = checksum.match(/^([a-f0-9]{64})  dossier-bloc-04-spity\.pdf$/)
    if (!match) {
      errors.push({ code: 'invalid-pdf-checksum', path: checksumPath, message: 'Le fichier SHA-256 du PDF est invalide.' })
    } else {
      expectedHash = match[1]
    }
  } catch {
    errors.push({ code: 'missing-pdf-checksum', path: checksumPath, message: 'Le fichier SHA-256 du PDF est introuvable.' })
  }

  try {
    const content = await readFile(pdfPath)
    actualHash = createHash('sha256').update(content).digest('hex')
  } catch {
    errors.push({ code: 'missing-pdf', path: pdfPath, message: 'Le PDF final est introuvable.' })
  }

  if (expectedHash && actualHash && expectedHash !== actualHash) {
    errors.push({ code: 'pdf-hash-mismatch', path: pdfPath, message: 'Le PDF ne correspond plus à son empreinte SHA-256.' })
  }

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    expectedHash,
    actualHash,
    errors,
  }
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const report = await verifyPdfChecksum()
  console.info(JSON.stringify(report, null, 2))
  if (!report.compliant) process.exitCode = 1
}
