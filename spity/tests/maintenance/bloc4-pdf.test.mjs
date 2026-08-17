import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { verifyPdfChecksum } from '../../scripts/verify-bloc4-pdf.mjs'

test('accepts the generated Bloc 4 PDF and its detached checksum', async () => {
  const report = await verifyPdfChecksum()

  assert.equal(report.compliant, true)
  assert.equal(report.actualHash, report.expectedHash)
})

test('rejects a PDF modified after checksum generation', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'spity-bloc4-pdf-'))
  const pdfPath = join(directory, 'dossier-bloc-04-spity.pdf')
  const checksumPath = `${pdfPath}.sha256`
  const original = Buffer.from('pdf-original')
  const hash = createHash('sha256').update(original).digest('hex')
  await writeFile(pdfPath, Buffer.from('pdf-modified'))
  await writeFile(checksumPath, `${hash}  dossier-bloc-04-spity.pdf\n`, 'utf8')

  const report = await verifyPdfChecksum({ checksumPath, pdfPath })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'pdf-hash-mismatch'))
})
