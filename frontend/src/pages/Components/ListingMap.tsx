import * as React from 'react'
import { LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'
import './MapStyle.css'

interface LocationProps {
    latlong: [number, number]
}

const ListingMap: React.FC<LocationProps> = ({latlong}) => {
    const position: LatLngTuple = latlong

    return (
        
            <MapContainer id='map' center={position} zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={position} radius={600}/>
            </MapContainer>
        
    )
}

export default ListingMap