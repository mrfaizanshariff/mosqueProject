'use client'
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card'
import { Mosque } from '../../lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { AspectRatio } from '../../../components/ui/aspect-ratio'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { getCurrentPrayer } from '../../lib/data'
import { motion } from 'framer-motion'

interface MosqueCardProps {
  mosque: Mosque
  distance?:number
}

export function MosqueCard({ mosque,distance }: MosqueCardProps) {
  const currentPrayer = getCurrentPrayer() as keyof typeof mosque.prayerTimes
  const featuredImage = mosque.images[0]
  
  return (
    
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden h-full mosque-card border-border/40">
        <Link href={`/mosques/${mosque.id}`}>
          <CardHeader className="p-0">
            <AspectRatio ratio={16/9}>
              <div className="relative w-full h-full">
                <Image 
                  src={featuredImage.url}
                  alt={featuredImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {mosque.announcements.some(a => a.isImportant) && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-3 right-3 animate-pulse"
                  >
                    Important Announcement
                  </Badge>
                )}
              </div>
            </AspectRatio>
          </CardHeader>

         </Link> 
          <CardContent className="pt-4">
          <Link href={`/mosques/${mosque.id}`}>
            <h3 className="font-bold text-xl mb-2 font-amiri">{mosque.name}

           
            </h3></Link>
            {distance && <div
                    className=" flex justify-between items-center my-1 ">
                     <span className='animate-pulse text-red-500 font-semibold  '>
                     {distance.toFixed(2)} KM 
                     </span>
                     <Button variant={"default"} className='z-30'>
                      <Link href={mosque.locationURL || ""} target='_blank'>
                        Directions 
                      </Link>
                        <ExternalLink className="h-4 w-4 ml-2" />
                     </Button>
            </div>}
            <Link href={`/mosques/${mosque.id}`}>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{mosque.address}, {mosque.city}</span>
            </div>
            
            {mosque.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-1" />
                <span>{mosque.phone}</span>
              </div>
            )}
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Current Prayer ({currentPrayer}):</span>
                <span className="text-primary font-semibold">{mosque.prayerTimes[currentPrayer]}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-1 mt-3">
                {mosque.facilities.slice(0, 4).map((facility) => (
                  <Badge 
                    key={facility.id} 
                    variant="outline" 
                    className="text-xs justify-center"
                  >
                    {facility.name}
                  </Badge>
                ))}
              </div>
            </div>
            </Link>
          </CardContent>
          <Link href={`/mosques/${mosque.id}`}>
          <CardFooter className="pb-4 pt-0">
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          
          </CardFooter>
          </Link>
        </Card>
      </motion.div>
    
  )
}