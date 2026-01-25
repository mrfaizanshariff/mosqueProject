'use client'


import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { motion } from 'framer-motion'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import { Separator } from '../../../components/ui/separator'
import Link from 'next/link'
import { usePrayerTimings } from '../../context/PrayerTimingsContext'
import { useCity } from '../../context/CityContext'
import Image from 'next/image'

export function convert24To12Hour(time24: string): string {
  if (!/^\d{1,2}:\d{2}$/.test(time24)) return time24; // Return as is if format is invalid
  let [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export function HeroSection() {
  const { timings, currentPrayer, nextPrayer, loading, error } = usePrayerTimings();
  const { city } = useCity() // Assuming useCity is defined in your context
  const [currentTime, setCurrentTime] = useState<string>('')
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }))
    }
    updateTimes()
    const interval = setInterval(updateTimes, 60000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (

    <div className="relative w-full min-h-[80vh] pattern-bg flex items-center">
      <div className="container mx-auto px-4 py-24 md:py-32">

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="font-amiri text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Prayer Times <br />for Local Mosques
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-8">
              Stay connected with your local mosques and never miss a prayer with our comprehensive directory of prayer times.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/mosques">
                  Browse Mosques
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="#prayer-times">
                  View Prayer Times
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#nearbymosque">
                  Find Near By Mosue
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/40"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image src="/android-chrome-512x512.png" alt="Logo" className='m-auto' width={80} height={80} />

              </motion.div>
              <h2 className="font-amiri text-2xl font-bold">Prayer Times - {city ? city : 'India'}</h2>
              <p className="text-muted-foreground">Current time: {currentTime}</p>
            </div>

            <div className="space-y-6">
              <motion.div
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Fajr Prayer Time Start</h3>
                    <p className="text-2xl font-bold text-primary">{timings && timings['Fajr'] ? convert24To12Hour(timings?.["Fajr"]) : ''}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <motion.div
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Zuhar Prayer Time Start</h3>
                    <p className="text-2xl font-bold text-primary">{timings && timings['Dhuhr'] ? convert24To12Hour(timings?.["Dhuhr"]) : ''}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <motion.div
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Asr Prayer Time Start</h3>
                    <p className="text-2xl font-bold text-primary">{timings && timings['Asr'] ? convert24To12Hour(timings?.["Asr"]) : ''}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <motion.div
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Maghrib Prayer Time Start</h3>
                    <p className="text-2xl font-bold text-primary">{timings && timings['Maghrib'] ? convert24To12Hour(timings?.["Maghrib"]) : ''}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <motion.div
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Isha Prayer Time Start</h3>
                    <p className="text-2xl font-bold text-primary">{timings && timings['Isha'] ? convert24To12Hour(timings?.["Isha"]) : ''}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </motion.div>

              <Separator />

              <motion.div
                className="bg-accent/10 border border-accent/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Nearest Prayer</h3>
                    <p className="text-2xl font-bold text-accent">{currentPrayer}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-accent" />
                </div>
              </motion.div>
              <motion.div
                className="bg-accent/10 border border-accent/20 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Next Prayer</h3>
                    <p className="text-2xl font-bold text-accent">{nextPrayer}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-accent" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}