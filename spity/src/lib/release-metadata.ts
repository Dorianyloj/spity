import packageJson from '../../package.json'

const localRevision = process.env.NODE_ENV === 'production' ? 'unknown' : 'development'

export const releaseMetadata = Object.freeze({
  version: process.env.APP_VERSION ?? packageJson.version,
  revision: process.env.APP_REVISION ?? localRevision,
})
