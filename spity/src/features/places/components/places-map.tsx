'use client'

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/class-names'
import { clusterMapPlaces } from '../lib/map-clustering'

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
  className?: string
  expanded?: boolean
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

function ClusteredMarkers({ onSelect, places, selectedPlaceId }: Omit<PlacesMapProps, 'className'>) {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  })

  const clusters = useMemo(
    () => clusterMapPlaces(places, (place) => map.project([place.latitude, place.longitude], zoom)),
    [map, places, zoom]
  )

  return clusters.map((cluster) => {
    if (cluster.places.length === 1) {
      const [place] = cluster.places
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
    }

    const includesSelectedPlace = cluster.places.some((place) => place.id === selectedPlaceId)

    return (
      <CircleMarker
        key={cluster.id}
        center={[cluster.latitude, cluster.longitude]}
        eventHandlers={{ click: () => map.fitBounds(cluster.places.map((place) => [place.latitude, place.longitude] as [number, number]), { maxZoom: 14, padding: [36, 36] }) }}
        pathOptions={{
          color: '#ffffff',
          fillColor: includesSelectedPlace ? '#d6ff52' : '#173236',
          fillOpacity: 1,
          weight: 3,
        }}
        radius={Math.min(24, 12 + Math.log2(cluster.places.length) * 5)}
      >
        <Tooltip className="places-cluster-count" direction="center" permanent>{cluster.places.length}</Tooltip>
      </CircleMarker>
    )
  })
}

function MapSizeInvalidator({ expanded }: Pick<PlacesMapProps, 'expanded'>) {
  const map = useMap()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => map.invalidateSize({ animate: false }))
    return () => window.cancelAnimationFrame(frame)
  }, [expanded, map])

  return null
}

export default function PlacesMap({ className, expanded = false, onSelect, places, selectedPlaceId }: PlacesMapProps) {
  return (
    <MapContainer
      aria-label="Carte des lieux correspondant à la recherche"
      center={[46.7, 2.4]}
      className={cn('h-80 w-full', className)}
      scrollWheelZoom
      zoom={6}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitPlaces places={places} />
      <MapSizeInvalidator expanded={expanded} />
      <ClusteredMarkers onSelect={onSelect} places={places} selectedPlaceId={selectedPlaceId} />
    </MapContainer>
  )
}
