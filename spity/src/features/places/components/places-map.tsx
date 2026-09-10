'use client'

import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'

export type PlaceMapPoint = {
  id: string
  kind: 'salle' | 'falaise'
  latitude: number
  longitude: number
  name: string
  location: string
  href: string
}

type PlacesMapProps = {
  onSelect: (placeId: string) => void
  places: PlaceMapPoint[]
  selectedPlaceId: string | null
}

function FitPlaces({ places }: Pick<PlacesMapProps, 'places'>) {
  const map = useMap()

  useEffect(() => {
    if (places.length === 0) {
      return
    }

    if (places.length === 1) {
      map.setView([places[0].latitude, places[0].longitude], 12, { animate: false })
      return
    }

    map.fitBounds(places.map((place) => [place.latitude, place.longitude] as [number, number]), {
      maxZoom: 11,
      padding: [28, 28],
      animate: false,
    })
  }, [map, places])

  return null
}

export default function PlacesMap({ onSelect, places, selectedPlaceId }: PlacesMapProps) {
  return (
    <MapContainer
      aria-label="Carte des lieux correspondant à la recherche"
      center={[46.7, 2.4]}
      className="h-80 w-full"
      scrollWheelZoom
      zoom={6}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitPlaces places={places} />
      {places.map((place) => {
        const isSelected = place.id === selectedPlaceId
        const isCrag = place.kind === 'falaise'

        return (
          <CircleMarker
            key={place.id}
            center={[place.latitude, place.longitude]}
            eventHandlers={{ click: () => onSelect(place.id) }}
            pathOptions={{
              color: isSelected ? '#173236' : '#ffffff',
              fillColor: isCrag ? '#d6ff52' : '#173236',
              fillOpacity: 1,
              weight: isSelected ? 4 : 2,
            }}
            radius={isSelected ? 10 : 7}
          >
            <Popup>
              <a className="font-semibold text-slate-900 underline" href={place.href}>
                {place.name}
              </a>
              <p className="mt-1 text-sm text-slate-700">{place.location}</p>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
