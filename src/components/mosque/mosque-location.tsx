'use client'

import { useEffect, useRef } from 'react'

interface MosqueLocationProps {
  location: {
    lat: number
    lng: number
  }
  name: string
}

export function MosqueLocation({ location, name }: MosqueLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // This is a placeholder for an actual map integration
    // In a real application, you would use a library like Google Maps, Mapbox, or Leaflet
    if (mapRef.current) {
      const mapElement = mapRef.current
      
      // Style the map placeholder
      mapElement.style.backgroundImage = 'url("https://images.pexels.com/photos/4452332/pexels-photo-4452332.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")'
      mapElement.style.backgroundSize = 'cover'
      mapElement.style.backgroundPosition = 'center'
      
      // Add a marker element
      const marker = document.createElement('div')
      marker.className = 'absolute w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2'
      marker.style.top = '50%'
      marker.style.left = '50%'
      marker.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.3)'
      
      // Add pulse effect
      const pulse = document.createElement('div')
      pulse.className = 'absolute w-12 h-12 bg-primary/30 rounded-full animate-ping transform -translate-x-1/2 -translate-y-1/2'
      pulse.style.top = '50%'
      pulse.style.left = '50%'
      
      // Add the mosque name tooltip
      const tooltip = document.createElement('div')
      tooltip.className = 'absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-full bg-background text-foreground px-3 py-1 rounded shadow-md text-sm'
      tooltip.textContent = name
      
      // Append elements
      mapElement.appendChild(pulse)
      mapElement.appendChild(marker)
      mapElement.appendChild(tooltip)
      
      // Add coordinates text
      const coords = document.createElement('div')
      coords.className = 'absolute bottom-2 right-2 text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded'
      coords.textContent = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
      mapElement.appendChild(coords)
    }
  }, [location, name])

  return (
    <div 
      ref={mapRef} 
      className="relative w-full h-[200px] rounded-md overflow-hidden border border-border"
    ></div>
  )
}