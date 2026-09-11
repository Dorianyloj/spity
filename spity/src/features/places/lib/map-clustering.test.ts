import { clusterMapPlaces } from './map-clustering'

const places = [
  { id: 'lyon-1', latitude: 45.76, longitude: 4.84 },
  { id: 'lyon-2', latitude: 45.77, longitude: 4.85 },
  { id: 'marseille-1', latitude: 43.3, longitude: 5.37 },
]

describe('clusterMapPlaces', () => {
  it('groups nearby points into a countable cluster when zoomed out', () => {
    const clusters = clusterMapPlaces(places, (place) => ({
      x: place.id.startsWith('lyon') ? 20 : 220,
      y: place.id.startsWith('lyon') ? 20 : 220,
    }))

    expect(clusters).toHaveLength(2)
    expect(clusters.find((cluster) => cluster.places.length === 2)?.places.map((place) => place.id)).toEqual(['lyon-1', 'lyon-2'])
  })

  it('keeps points separate once projection puts them in different cells', () => {
    const clusters = clusterMapPlaces(places.slice(0, 2), (place) => ({
      x: place.id === 'lyon-1' ? 0 : 100,
      y: 0,
    }))

    expect(clusters).toHaveLength(2)
    expect(clusters.every((cluster) => cluster.places.length === 1)).toBe(true)
  })
})
