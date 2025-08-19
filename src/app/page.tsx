import { HeroSection } from '../components/sections/hero-section'
import { PrayerTimesTable } from '../components/ui/prayer-times-table'
import { MosqueCard } from '../components/ui/mosque-card'
import { mosques } from '../lib/data'
import { Button } from '../../components/ui/button'
import { Search, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { NearbyMosques } from '../components/mosque/nearby-mosques'
import { QuranQuoteSwitcher } from '../components/features/quran-verse'
import { PrayerTimingsProvider } from '../context/PrayerTimingsContext'
import { CityProvider } from '../context/CityContext'
import CitySelection from '../components/features/city-selection'

export default function Home() {
  // Only show 3 mosques on the homepage
  const featuredMosques = mosques.slice(0, 3)

  return (
     
    <div>
      <div className=' pattern-bg '>
       
          <CitySelection />
        
      </div>
        <HeroSection />
      <div className='mx-4'>
      <QuranQuoteSwitcher />
      </div>
          <NearbyMosques mosques={mosques} />
      <section id="prayer-times" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-amiri text-3xl md:text-4xl font-bold mb-4">
              Today's Prayer Times
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the up-to-date prayer times for mosques in your area. Stay connected with your local community.
            </p>
          </div>
          <PrayerTimesTable mosques={mosques} />          
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/mosques">
                View All Mosques
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
         
        </div>
      </section>
      
      <section className="py-20 pattern-bg">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-amiri text-3xl md:text-4xl font-bold mb-4">
              Featured Mosques
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore some of the most prominent mosques in our community. Click on any mosque to view detailed information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMosques.map((mosque) => (
             
              <MosqueCard key={mosque.id} mosque={mosque} />
              
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/mosques">
                View All Mosques
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-amiri text-3xl md:text-4xl font-bold mb-4">
              Features & Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our website provides various features to help you stay connected with your local mosques.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl shadow-sm border border-border/40 text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prayer Times</h3>
              <p className="text-muted-foreground">
                Get accurate prayer times for all local mosques, updated daily.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-xl shadow-sm border border-border/40 text-center">
              <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mosque Locator</h3>
              <p className="text-muted-foreground">
                Find mosques near you with detailed information and directions.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-xl shadow-sm border border-border/40 text-center">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Event Calendar</h3>
              <p className="text-muted-foreground">
                Stay updated on community events, lectures, and special prayers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    
  )
}