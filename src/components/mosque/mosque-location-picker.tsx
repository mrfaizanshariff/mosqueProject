'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Navigation, Loader2 } from 'lucide-react'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-md border border-border flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

interface MosqueLocationPickerProps {
  value: {
    lat: number
    lng: number
  }
  onChange: (location: { lat: number; lng: number }) => void
}

export function MosqueLocationPicker({ value, onChange }: MosqueLocationPickerProps) {
  const [coordinates, setCoordinates] = useState({
    lat: value.lat.toString(),
    lng: value.lng.toString(),
  })
  const [isGettingLocation, setIsGettingLocation] = useState(false)


  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    const newCoordinates = { ...coordinates, [field]: value }
    setCoordinates(newCoordinates)
    
    const lat = parseFloat(newCoordinates.lat)
    const lng = parseFloat(newCoordinates.lng)
    
    if (!isNaN(lat) && !isNaN(lng)) {
      onChange({ lat, lng })
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    const newCoords = {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    }
    
    setCoordinates({
      lat: newCoords.lat.toString(),
      lng: newCoords.lng.toString(),
    })
    onChange(newCoords)
  }
  const getCurrentLocation = async () => {
    setIsGettingLocation(true)

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      setIsGettingLocation(false)
      return
    }

    // Check for Permissions API support
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' })
        if (status.state === 'denied') {
          alert(
            'Location access is denied. Please enable location permissions in your browser settings.'
          )
          setIsGettingLocation(false)
          return
        }
      } catch (e) {
        // Permissions API not available or failed, continue
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCoordinates({
          lat: newLocation.lat.toString(),
          lng: newLocation.lng.toString(),
        })
        onChange(newLocation)
        setIsGettingLocation(false)
      },
      (error) => {
        let message = 'Unable to retrieve your location.'
        if (
          error.code === error.PERMISSION_DENIED &&
          /iPad|iPhone|iPod/.test(navigator.userAgent)
        ) {
          message =
            'Location access is denied on your iOS device. Please go to Settings > Safari > Location and allow access.'
        } else if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied. Please enable it in your browser settings.'
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information is unavailable.'
        } else if (error.code === error.TIMEOUT) {
          message = 'The request to get your location timed out.'
        }
        alert(message)
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div >
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="40.7128"
            value={coordinates.lat}
            onChange={(e) => handleCoordinateChange('lat', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-74.0060"
            value={coordinates.lng}
            onChange={(e) => handleCoordinateChange('lng', e.target.value)}
          />
        </div > */}
        
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
              </>
            )}
            {isGettingLocation ? 'Getting...' : 'Use My Location'}
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Click on the map to select location</Label>
        <MapComponent
          center={[value.lat, value.lng]}
          zoom={13}
          onLocationSelect={handleMapClick}
        />
      </div>
    </div>
  )
}