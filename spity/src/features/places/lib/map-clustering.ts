type MappablePlace = {
  id: string
  latitude: number
  longitude: number
}

type PixelPoint = {
  x: number
  y: number
}

export type MapCluster<T extends MappablePlace> = {
  id: string
  latitude: number
  longitude: number
  places: T[]
}

export const clusterMapPlaces = <T extends MappablePlace>(
  places: T[],
  project: (place: T) => PixelPoint,
  cellSize = 72
): MapCluster<T>[] => {
  const clusters = new Map<string, T[]>()

  for (const place of places) {
    const pixel = project(place)
    const key = `${Math.floor(pixel.x / cellSize)}:${Math.floor(pixel.y / cellSize)}`
    const current = clusters.get(key) ?? []
    current.push(place)
    clusters.set(key, current)
  }

  return Array.from(clusters.entries()).map(([key, groupedPlaces]) => ({
    id: key,
    latitude: groupedPlaces.reduce((total, place) => total + place.latitude, 0) / groupedPlaces.length,
    longitude: groupedPlaces.reduce((total, place) => total + place.longitude, 0) / groupedPlaces.length,
    places: groupedPlaces,
  }))
}
