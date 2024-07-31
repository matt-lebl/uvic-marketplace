import * as React from 'react'
import { LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'
import './MapStyle.css'

interface LocationProps {
    lat: number,
    long: number
}

const ListingMap: React.FC<LocationProps> = ({ lat, long }) => {
    const latitude = Math.round(lat * 1000) / 1000
    const longitude = Math.round(long * 1000) / 1000
    const position: LatLngTuple = [latitude, longitude]

    return (
        <MapContainer id='map' center={position} zoom={14} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={position} radius={600} />
        </MapContainer>
    )
}

export default ListingMap