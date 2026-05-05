import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const outputDir = join(process.cwd(), 'public', 'images', 'demo', 'climbing')
const commonsApiUrl = 'https://commons.wikimedia.org/w/api.php'
const thumbnailWidth = '1280'

const assets = [
  {
    slug: 'indoor-gym-overview',
    file: 'Gorliz sports center climbing gym.jpg',
    category: 'Salle indoor',
  },
  {
    slug: 'indoor-crack-training',
    file: 'Crack Climbing Indoor.jpg',
    category: 'Salle indoor',
  },
  {
    slug: 'indoor-climbing-wall',
    file: 'REI rock climbing wall.jpg',
    category: 'Salle indoor',
  },
  {
    slug: 'indoor-wall-area',
    file: 'REI rock climbing wall area.jpg',
    category: 'Salle indoor',
  },
  {
    slug: 'bouldering-dead-bug',
    file: 'Bouldering.jpg',
    category: 'Bloc outdoor',
  },
  {
    slug: 'bouldering-joshua-tree',
    file: 'Bouldering (53483096154).jpg',
    category: 'Bloc outdoor',
  },
  {
    slug: 'fontainebleau-bouldering',
    file: 'Forest of Fontainebleau, Bouldering.jpg',
    category: 'Bloc outdoor',
  },
  {
    slug: 'fontainebleau-boulders',
    file: 'Fontainebleau Boulders -001.jpg',
    category: 'Paysage falaise',
  },
  {
    slug: 'verdon-climber-route',
    file: 'Rock Climbing Verdon.jpg',
    category: 'Falaise',
  },
  {
    slug: 'verdon-wall-climber',
    file: 'Escalade Verdon.jpg',
    category: 'Falaise',
  },
  {
    slug: 'verdon-climbers',
    file: 'Climbers verdon gorge.jpg',
    category: 'Falaise',
  },
  {
    slug: 'verdon-cliff',
    file: 'Verdon-cliff-eperon-Sublime-vude-Trescaire.jpg',
    category: 'Paysage falaise',
  },
  {
    slug: 'calanques-landscape',
    file: 'Les calanques.jpg',
    category: 'Paysage falaise',
  },
  {
    slug: 'rock-climber-wall',
    file: 'Rock climber on the wall.jpg',
    category: 'Falaise',
  },
]

const stripHtml = (value) => {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
}

const sleep = (duration) => new Promise((resolve) => {
  setTimeout(resolve, duration)
})

const fileExists = async (fileName) => {
  try {
    const fileStat = await stat(join(outputDir, fileName))

    return fileStat.size > 0
  } catch {
    return false
  }
}

const getMetadataValue = (metadata, key) => stripHtml(metadata[key]?.value)

const readExistingAttributions = async () => {
  try {
    const content = await readFile(join(outputDir, 'attributions.json'), 'utf8')
    const parsedContent = JSON.parse(content)

    if (!Array.isArray(parsedContent)) {
      return new Map()
    }

    return new Map(
      parsedContent
        .filter((item) => item && typeof item === 'object' && typeof item.localFile === 'string')
        .map((item) => [item.localFile, item])
    )
  } catch {
    return new Map()
  }
}

const getImageInfo = async (file) => {
  const url = new URL(commonsApiUrl)
  url.searchParams.set('action', 'query')
  url.searchParams.set('format', 'json')
  url.searchParams.set('prop', 'imageinfo')
  url.searchParams.set('titles', `File:${file}`)
  url.searchParams.set('iiprop', 'url|extmetadata')
  url.searchParams.set('iiurlwidth', thumbnailWidth)
  url.searchParams.set('origin', '*')

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SpityDemoImageSeeder/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Unable to fetch metadata for ${file}: ${response.status}`)
  }

  const payload = await response.json()
  const pages = payload.query?.pages
  const page = pages ? Object.values(pages)[0] : null
  const imageInfo = page?.imageinfo?.[0]

  if (!imageInfo) {
    throw new Error(`No Wikimedia image info found for ${file}`)
  }

  return imageInfo
}

const fetchImage = async (url) => {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpityDemoImageSeeder/1.0',
      },
    })

    if (response.ok) {
      return response
    }

    if (response.status !== 429 || attempt === 5) {
      throw new Error(`Unable to download ${url}: ${response.status}`)
    }

    await sleep(attempt * 5000)
  }
}

const withoutTrackingParams = (url) => {
  const parsedUrl = new URL(url)
  parsedUrl.search = ''

  return parsedUrl.toString()
}

const downloadImage = async (downloadUrl, fallbackUrl, fileName) => {
  const candidates = Array.from(new Set([downloadUrl, withoutTrackingParams(downloadUrl), fallbackUrl]))
  let response

  for (const candidate of candidates) {
    try {
      response = await fetchImage(candidate)
      break
    } catch {
      if (candidate === candidates.at(-1)) {
        throw new Error(`Unable to download ${candidate}`)
      }
    }
  }

  if (!response) {
    throw new Error(`Unable to download ${downloadUrl}`)
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('image/')) {
    throw new Error(`Unexpected content-type for ${url}: ${contentType}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(join(outputDir, fileName), buffer)
}

const makeAttributionMarkdown = (items) => {
  const lines = [
    '# Demo climbing image bank',
    '',
    'Images downloaded from Wikimedia Commons for local demo content. Keep this attribution file with the downloaded assets.',
    '',
    '| Local file | Source | Author | License | Category |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const item of items) {
    lines.push(
      `| \`${item.localFile}\` | [${item.file}](${item.descriptionUrl}) | ${item.author || 'Unknown'} | ${item.license || 'See source'} | ${item.category} |`
    )
  }

  lines.push('')

  return lines.join('\n')
}

const main = async () => {
  await mkdir(outputDir, { recursive: true })

  const attributionItems = []
  const existingAttributions = await readExistingAttributions()

  for (const asset of assets) {
    const localFile = `${asset.slug}.jpg`
    const existingAttribution = existingAttributions.get(localFile)

    if ((await fileExists(localFile)) && existingAttribution) {
      attributionItems.push(existingAttribution)
      console.log(`Skipped ${localFile}`)
      continue
    }

    const imageInfo = await getImageInfo(asset.file)
    const metadata = imageInfo.extmetadata ?? {}
    const downloadUrl = imageInfo.thumburl ?? imageInfo.url

    if (await fileExists(localFile)) {
      console.log(`Skipped ${localFile}`)
    } else {
      await downloadImage(downloadUrl, imageInfo.url, localFile)
      console.log(`Downloaded ${localFile}`)
      await sleep(2000)
    }

    attributionItems.push({
      localFile,
      file: asset.file,
      category: asset.category,
      descriptionUrl: imageInfo.descriptionurl,
      author: getMetadataValue(metadata, 'Artist'),
      license: getMetadataValue(metadata, 'LicenseShortName'),
      licenseUrl: getMetadataValue(metadata, 'LicenseUrl'),
    })

    await sleep(750)
  }

  await writeFile(join(outputDir, 'ATTRIBUTIONS.md'), makeAttributionMarkdown(attributionItems))
  await writeFile(join(outputDir, 'attributions.json'), `${JSON.stringify(attributionItems, null, 2)}\n`)

  console.log(`Demo image bank ready in ${outputDir}`)
}

void main()
