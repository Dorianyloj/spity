/** @jest-environment node */
import sharp from 'sharp'
import { MAX_IMAGE_BYTES, MAX_REQUEST_BYTES, normalizeImage, readImageUpload } from './image-upload'

const makeImage = (format: 'png' | 'jpeg' | 'webp' = 'png') => sharp({
  create: { width: 12, height: 8, channels: 3, background: '#224466' },
}).toFormat(format).toBuffer()
const fileFrom = (data: Uint8Array, type = 'image/png') => new File([new Uint8Array(data)], '../../photo.exe', { type })
const requestFrom = (form: FormData) => new Request('http://localhost/api/media', { method: 'POST', body: form })

describe('image validation and normalization', () => {
  it.each(['png', 'jpeg', 'webp'] as const)('decodes real %s images and produces WebP independently of the filename', async (format) => {
    const result = await normalizeImage(fileFrom(await makeImage(format), `image/${format}`))
    expect(result).toMatchObject({ width: 12, height: 8 })
    expect((await sharp(result.data).metadata()).format).toBe('webp')
  })

  it('applies orientation, strips EXIF/GPS metadata and downsizes large images', async () => {
    const data = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#ffffff' } })
      .withMetadata({ orientation: 6 }).jpeg().toBuffer()
    const result = await normalizeImage(fileFrom(data, 'image/jpeg'))
    expect(result).toMatchObject({ width: 1024, height: 2048 })
    const metadata = await sharp(result.data).metadata()
    expect(metadata.exif).toBeUndefined()
    expect(metadata.orientation).toBeUndefined()
    expect(metadata.icc).toBeUndefined()
  })

  it('rejects an empty file and a file larger than 5 MiB', async () => {
    await expect(normalizeImage(fileFrom(new Uint8Array()))).rejects.toMatchObject({ status: 422 })
    await expect(normalizeImage(fileFrom(new Uint8Array(MAX_IMAGE_BYTES + 1)))).rejects.toMatchObject({ status: 413 })
  })

  it.each(['image/svg+xml', 'image/gif', 'text/html', 'application/octet-stream'])('rejects unsupported MIME %s', async (type) => {
    await expect(normalizeImage(fileFrom(await makeImage(), type))).rejects.toMatchObject({ status: 415 })
  })

  it('rejects SVG disguised as PNG and mismatched JPEG/PNG', async () => {
    await expect(normalizeImage(fileFrom(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'))))
      .rejects.toMatchObject({ status: 415 })
    await expect(normalizeImage(fileFrom(await makeImage('jpeg')))).rejects.toMatchObject({ status: 415 })
  })

  it('rejects a truncated file even when its signature is valid', async () => {
    const data = await makeImage()
    await expect(normalizeImage(fileFrom(data.subarray(0, 40)))).rejects.toMatchObject({ status: 422 })
  })

  it('rejects animated WebP files', async () => {
    const pixels = Buffer.concat([Buffer.alloc(12 * 8 * 3, 255), Buffer.alloc(12 * 8 * 3, 0)])
    const data = await sharp(pixels, { raw: {
      width: 12, height: 16, pageHeight: 8, channels: 3,
    } }).webp({ delay: [100, 100] }).toBuffer()
    expect((await sharp(data).metadata()).pages).toBe(2)
    await expect(normalizeImage(fileFrom(data, 'image/webp'))).rejects.toMatchObject({ status: 415 })
  })

  it('rejects PNG animation-control chunks before decoding the first frame', async () => {
    const png = await makeImage()
    const animationControl = Buffer.alloc(20)
    animationControl.writeUInt32BE(8, 0)
    animationControl.write('acTL', 4, 'ascii')
    animationControl.writeUInt32BE(2, 8)
    const data = Buffer.concat([png.subarray(0, 33), animationControl, png.subarray(33)])
    await expect(normalizeImage(fileFrom(data))).rejects.toMatchObject({ status: 415 })
  })

  it('rejects oversized decoded dimensions', async () => {
    const data = await sharp({ create: { width: 6000, height: 4200, channels: 3, background: 'white' } }).png().toBuffer()
    await expect(normalizeImage(fileFrom(data))).rejects.toMatchObject({ status: 422 })
  })
})

describe('bounded multipart parsing', () => {
  it('reads exactly one file', async () => {
    const form = new FormData()
    form.append('file', fileFrom(await makeImage()))
    expect((await readImageUpload(requestFrom(form))).type).toBe('image/png')
  })

  it.each(['missing', 'text', 'duplicate', 'extra'])('rejects %s fields', async (scenario) => {
    const form = new FormData()
    if (scenario === 'text') form.append('file', 'not a file')
    if (scenario === 'duplicate' || scenario === 'extra') {
      form.append('file', fileFrom(await makeImage()))
      form.append(scenario === 'extra' ? 'ownerId' : 'file', fileFrom(await makeImage()))
    }
    await expect(readImageUpload(requestFrom(form))).rejects.toMatchObject({ status: 422 })
  })

  it('rejects non-multipart, missing body and broken multipart', async () => {
    await expect(readImageUpload(new Request('http://localhost', { method: 'POST', body: '{}' })))
      .rejects.toMatchObject({ status: 415 })
    const headers = { 'Content-Type': 'multipart/form-data; boundary=test' }
    await expect(readImageUpload(new Request('http://localhost', { method: 'POST', headers })))
      .rejects.toMatchObject({ status: 422 })
    await expect(readImageUpload(new Request('http://localhost', { method: 'POST', headers, body: 'broken' })))
      .rejects.toMatchObject({ status: 400 })
  })

  it('rejects a declared oversized request before reading it', async () => {
    await expect(readImageUpload(new Request('http://localhost', { method: 'POST', body: 'x', headers: {
      'Content-Type': 'multipart/form-data; boundary=test', 'Content-Length': String(MAX_REQUEST_BYTES + 1),
    } }))).rejects.toMatchObject({ status: 413 })
  })

  it.each([undefined, '1'])('caps actual streamed bytes with Content-Length=%s', async (length) => {
    const form = new FormData()
    form.append('file', fileFrom(new Uint8Array(MAX_REQUEST_BYTES + 1)))
    const request = requestFrom(form)
    if (length) request.headers.set('content-length', length)
    await expect(readImageUpload(request)).rejects.toMatchObject({ status: 413 })
  })
})
