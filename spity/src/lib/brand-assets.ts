export const brandAssets = {
  logo: '/images/brand/logo-spity.png',
  heroSunset: '/images/brand/escalade-falaise-coucher-soleil.jpeg',
  indoor: '/images/brand/escalade-salle.jpg',
  trad: '/images/brand/escalade-trad.jpg',
  crag: '/images/brand/escalade-falaise.jpeg',
  cragClose: '/images/brand/escalade-falaise-gros-plan.jpeg',
} as const

export const makeImmersiveBackground = (imageUrl: string) =>
  `linear-gradient(180deg, rgba(8, 12, 32, 0.22) 0%, rgba(8, 12, 32, 0.72) 56%, #050a2a 100%), linear-gradient(110deg, rgba(5, 10, 42, 0.92) 0%, rgba(5, 10, 42, 0.44) 48%, rgba(244, 162, 97, 0.26) 100%), url('${imageUrl}')`

export const makePanelBackground = (imageUrl: string) =>
  `linear-gradient(180deg, rgba(5, 10, 42, 0.08) 0%, rgba(5, 10, 42, 0.72) 100%), linear-gradient(110deg, rgba(5, 10, 42, 0.76), rgba(17, 26, 85, 0.38)), url('${imageUrl}')`
