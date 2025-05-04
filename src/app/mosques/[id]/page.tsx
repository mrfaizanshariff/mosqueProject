import { getMosqueById, mosques } from '../../../lib/data'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Separator } from '../../../../components/ui/separator'
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { Prayer } from '../../../lib/types'
import { FacilityIcon } from '../../../components/mosque/facility-icon'
import { PrayerTimeCard } from '../../../components/mosque/prayer-time-card'
import { MosqueImageGallery } from '../../../components/mosque/mosque-image-gallery'
import { MosqueAnnouncementBanner } from '../../../components/mosque/mosque-announcement-banner'
import { MosqueLocation } from '../../../components/mosque/mosque-location'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const mosque:any = getMosqueById(params.id)
  
  if (!mosque) {
    return {
      title: 'Mosque Not Found',
      description: 'The requested mosque could not be found',
    }
  }
  
  return {
    title: `${mosque.name} | Prayer Times & Information`,
    description: `View prayer times and information for ${mosque.name} including facilities, announcements, and location`,
  }
}


export async function generateStaticParams() {
  const mosquesData = mosques
  return mosquesData.map((mosque) => ({
    id: mosque.id,
  }))
}

export default function MosqueDetailPage({ params }: { params: { id: string } }) {
   
  
  const mosque = getMosqueById(params.id)
  
  if (!mosque) {
    notFound()
  }
  
  const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const importantAnnouncement = mosque.announcements.find(a => a.isImportant)

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mb-6"
        >
          <Link href="/mosques">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Mosques
          </Link>
        </Button>
        
        {importantAnnouncement && (
          <MosqueAnnouncementBanner announcement={importantAnnouncement} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden mb-6">
              <Image
                src={mosque.images[0].url}
                alt={mosque.images[0].alt}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="mb-8">
              <h1 className="font-amiri text-3xl md:text-4xl font-bold mb-2">
                {mosque.name}
              </h1>
              
              <div className="flex flex-wrap gap-2 items-center text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{mosque.address}, {mosque.city}, {mosque.state} {mosque.zipCode}</span>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="prayer-times" className="mb-10">
              <TabsList className="mb-4 w-full md:w-auto">
                <TabsTrigger value="prayer-times">Prayer Times</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prayer-times" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prayers.map((prayer) => (
                    <PrayerTimeCard
                      key={prayer}
                      prayer={prayer}
                      time={mosque.prayerTimes[prayer]}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="facilities">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {mosque.facilities.map((facility) => (
                    <Card key={facility.id} className="border-border/40">
                      <CardContent className="p-4 flex items-center gap-3">
                        <FacilityIcon name={facility.icon} className="h-8 w-8 text-primary" />
                        <span>{facility.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="gallery">
                <MosqueImageGallery images={mosque.images} />
              </TabsContent>
              
              <TabsContent value="about">
                <Card className="border-border/40">
                  <CardContent className="p-6">
                    <p className="text-lg mb-6">{mosque.description}</p>
                    
                    <h3 className="font-bold text-lg mb-3">Announcements</h3>
                    {mosque.announcements.length > 0 ? (
                      <div className="space-y-4">
                        {mosque.announcements.map((announcement) => (
                          <Card key={announcement.id} className="border-border/40">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{announcement.title}</CardTitle>
                                <Badge variant={announcement.isImportant ? "destructive" : "secondary"}>
                                  {announcement.isImportant ? "Important" : "Announcement"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 inline-block mr-1" />
                                {new Date(announcement.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <p>{announcement.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No announcements at this time.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-3" />
                  <span>{mosque.address}, {mosque.city}, {mosque.state} {mosque.zipCode}</span>
                </div>
                
                {mosque.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <a 
                      href={`tel:${mosque.phone}`} 
                      className="hover:text-primary transition-colors"
                    >
                      {mosque.phone}
                    </a>
                  </div>
                )}
                
                {mosque.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <a 
                      href={`mailto:${mosque.email}`} 
                      className="hover:text-primary transition-colors"
                    >
                      {mosque.email}
                    </a>
                  </div>
                )}
                
                {mosque.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-primary mr-3" />
                    <a 
                      href={mosque.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <MosqueLocation location={mosque.location} name={mosque.name} /> */}
                
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  asChild
                >
                  <a 
                    href={mosque.locationURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Prayer Times for Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prayers.map((prayer) => (
                    <div key={prayer} className="flex justify-between">
                      <span className="font-medium">{prayer}</span>
                      <span>{mosque.prayerTimes[prayer]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}