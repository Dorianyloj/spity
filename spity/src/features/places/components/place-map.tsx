'use client'

import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'

type Coordinates = { latitude: number; longitude: number }

type PlaceMapProps = Coordinates & {
  onChange: (coordinates: Coordinates) => void
}

function MapInteraction({ latitude, longitude, onChange }: PlaceMapProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 12), { duration: 0.25 })
  }, [latitude, longitude, map])

  useMapEvents({
    click(event) {
      onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })

  return (
    <CircleMarker
      center={[latitude, longitude]}
      pathOptions={{ color: '#d6ff52', fillColor: '#d6ff52', fillOpacity: 0.9, weight: 3 }}
      radius={9}
    />
  )
}

export default function PlaceMap(props: PlaceMapProps) {
  return (
    <MapContainer
      center={[props.latitude, props.longitude]}
      className="h-[320px] w-full rounded-lg"
      scrollWheelZoom
      zoom={12}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInteraction {...props} />
    </MapContainer>
  )
}
