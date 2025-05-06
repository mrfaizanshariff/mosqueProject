'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Slider } from '../../../components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { MosqueCard } from '../../components/ui/mosque-card'
import { Mosque } from '../../lib/types'
import { MapPin, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface NearbyMosquesProps {
  mosques: Mosque[]
}

export function NearbyMosques({ mosques }: NearbyMosquesProps) {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null)
  const [radius, setRadius] = useState([2]) // in kilometers
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  const getNearbyMosques = () => {
    if (!userLocation) return []
    
    return mosques.filter(mosque => {
        if(mosque.location?.lat && mosque.location.lng){
            const distance = getDistance(
              userLocation.latitude,
              userLocation.longitude,
              +mosque?.location.lat,
              +mosque?.location.lng
            )
            return distance <= radius[0]
        }
    })
  }
  
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180)
  }
  
  const handleGetLocation = () => {
    setLoading(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords)
        setLoading(false)
      },
      (error) => {
        setError('Unable to retrieve your location')
        setLoading(false)
      }
    )
  }
  
  const nearbyMosques = userLocation ? getNearbyMosques() : []

  return (
    <section className="py-12 my-4 bg-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-amiri text-3xl font-bold mb-4">Find Mosques Nearby</h2>
          <p className="text-muted-foreground mb-6">
            Discover mosques in your area and get prayer times instantly
          </p>
          
          <Button
            onClick={handleGetLocation}
            disabled={loading}
            size="lg"
            className="mb-4"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {userLocation ? 'Update Location' : 'Get My Location'}
          </Button>
          
          {error && (
            <p className="text-destructive mt-2">{error}</p>
          )}
        </motion.div>
        
        {userLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Search Radius: {radius[0]} km</CardTitle>
              </CardHeader>
              <CardContent>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  max={10}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">
              {nearbyMosques.length > 0 
                ? `Found ${nearbyMosques.length} mosque${nearbyMosques.length === 1 ? '' : 's'} within ${radius[0]}km`
                : 'No mosques found in this area'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nearbyMosques.map((mosque) => (
                <MosqueCard key={mosque.id} mosque={mosque} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}