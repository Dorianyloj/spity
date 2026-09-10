'use client'

import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'

type Coordinates = { latitude: number; longitude: number }

type PlaceMapProps = Coordinates & {
  parkingLatitude?: number | null
  parkingLongitude?: number | null
  onChange: (coordinates: Coordinates) => void
}

function MapInteraction(props: PlaceMapProps) {
  const { latitude, longitude, onChange } = props
  const map = useMap()

  useEffect(() => {
    map.setView([latitude, longitude], Math.max(map.getZoom(), 12), { animate: false })
  }, [latitude, longitude, map])

  useMapEvents({
    click(event) {
      onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })

  return (
    <>
      <CircleMarker
        center={[latitude, longitude]}
        pathOptions={{ color: '#173236', fillColor: '#d6ff52', fillOpacity: 1, weight: 3 }}
        radius={9}
      >
        <Tooltip direction="top" permanent>Lieu</Tooltip>
      </CircleMarker>
      {props.parkingLatitude !== null && props.parkingLatitude !== undefined && props.parkingLongitude !== null && props.parkingLongitude !== undefined && (
        <CircleMarker
          center={[props.parkingLatitude, props.parkingLongitude]}
          pathOptions={{ color: '#ffffff', fillColor: '#173236', fillOpacity: 1, weight: 3 }}
          radius={9}
        >
          <Tooltip direction="top" permanent>Parking</Tooltip>
        </CircleMarker>
      )}
    </>
  )
}

export default function PlaceMap(props: PlaceMapProps) {
  return (
    <MapContainer
      center={[props.latitude, props.longitude]}
      aria-label="Carte pour placer le lieu et son parking"
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
