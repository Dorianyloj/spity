/** @jest-environment node */
import { MAX_TOPO_PDF_BYTES, readTopoPdfUpload } from './topo-upload'

const falaiseId = 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e'
const pdf = (data = '%PDF-1.7\n') => new File([Buffer.from(data)], '../../topo.exe', { type: 'application/pdf' })
const requestFrom = (form: FormData) => new Request('http://localhost/api/places/topos', { method: 'POST', body: form })

describe('topo PDF upload validation', () => {
  it('accepts a bounded PDF independently of its filename', async () => {
    const form = new FormData()
    form.set('falaiseId', falaiseId)
    form.set('title', 'Topo du grand mur')
    form.set('type', 'pdf')
    form.set('file', pdf())

    const upload = await readTopoPdfUpload(requestFrom(form))
    expect(upload).toMatchObject({ falaiseId, title: 'Topo du grand mur' })
    expect(upload.file.name).toBe('../../topo.exe')
  })

  it.each([
    ['wrong type', new File([Buffer.from('%PDF-1.7')], 'topo.pdf', { type: 'text/plain' })],
    ['wrong signature', pdf('not a PDF')],
    ['empty file', pdf('')],
    ['oversized file', pdf('%PDF-' + 'x'.repeat(MAX_TOPO_PDF_BYTES))],
  ])('rejects a %s', async (_label, file) => {
    const form = new FormData()
    form.set('falaiseId', falaiseId)
    form.set('title', 'Topo du grand mur')
    form.set('type', 'pdf')
    form.set('file', file)
    await expect(readTopoPdfUpload(requestFrom(form))).rejects.toMatchObject({ status: expect.any(Number) })
  })

  it('rejects unexpected fields and non-multipart bodies', async () => {
    const form = new FormData()
    form.set('falaiseId', falaiseId)
    form.set('title', 'Topo du grand mur')
    form.set('type', 'pdf')
    form.set('file', pdf())
    form.set('ownerId', 'nope')
    await expect(readTopoPdfUpload(requestFrom(form))).rejects.toMatchObject({ status: 422 })
    await expect(readTopoPdfUpload(new Request('http://localhost', { method: 'POST', body: '{}' }))).rejects.toMatchObject({ status: 415 })
  })
})
