export const brandAssets = {
  logo: '/images/brand/logo-spity.png',
  logoTransparent: '/images/brand/logo-spity-transparent.png',
  logoWhite: '/images/brand/logo-spity-white.png',
  heroSunset: '/images/brand/escalade-falaise-coucher-soleil.jpeg',
  indoor: '/images/brand/escalade-salle.jpg',
  trad: '/images/brand/escalade-trad.jpg',
  crag: '/images/brand/escalade-falaise.jpeg',
  cragClose: '/images/brand/escalade-falaise-gros-plan.jpeg',
} as const

export const demoClimbingAssets = {
  indoorGym: '/images/demo/climbing/indoor-gym-overview.jpg',
  indoorCrack: '/images/demo/climbing/indoor-crack-training.jpg',
  indoorWall: '/images/demo/climbing/indoor-climbing-wall.jpg',
  indoorWallArea: '/images/demo/climbing/indoor-wall-area.jpg',
  bouldering: '/images/demo/climbing/bouldering-dead-bug.jpg',
  joshuaBouldering: '/images/demo/climbing/bouldering-joshua-tree.jpg',
  fontainebleau: '/images/demo/climbing/fontainebleau-bouldering.jpg',
  fontainebleauBoulders: '/images/demo/climbing/fontainebleau-boulders.jpg',
  verdonRoute: '/images/demo/climbing/verdon-climber-route.jpg',
  verdonWall: '/images/demo/climbing/verdon-wall-climber.jpg',
  verdonClimbers: '/images/demo/climbing/verdon-climbers.jpg',
  verdonCliff: '/images/demo/climbing/verdon-cliff.jpg',
  calanques: '/images/demo/climbing/calanques-landscape.jpg',
  rockWall: '/images/demo/climbing/rock-climber-wall.jpg',
} as const

export const makeImmersiveBackground = (imageUrl: string) =>
  `linear-gradient(180deg, rgba(23, 50, 54, 0.08) 0%, rgba(23, 50, 54, 0.62) 58%, #173236 100%), linear-gradient(110deg, rgba(23, 50, 54, 0.78) 0%, rgba(47, 111, 78, 0.2) 48%, rgba(239, 246, 239, 0.16) 100%), url('${imageUrl}')`

export const makePanelBackground = (imageUrl: string) =>
  `linear-gradient(180deg, rgba(23, 50, 54, 0.08) 0%, rgba(23, 50, 54, 0.58) 100%), linear-gradient(110deg, rgba(23, 50, 54, 0.56), rgba(223, 238, 207, 0.18)), url('${imageUrl}')`

export const makeDarkPanelBackground = (imageUrl: string) =>
  `linear-gradient(180deg, rgba(23, 50, 54, 0.2) 0%, rgba(23, 50, 54, 0.76) 100%), linear-gradient(110deg, rgba(23, 50, 54, 0.76), rgba(47, 111, 78, 0.28)), url('${imageUrl}')`
