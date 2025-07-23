'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '../../../components/ui/card'
import { Prayer } from '../../lib/types'
import { Clock } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { getCurrentPrayer } from '../../lib/data'

interface PrayerTimeCardProps {
  prayer: Prayer
  time: string
}

export function PrayerTimeCard({ prayer, time }: PrayerTimeCardProps) {
  const [isCurrentPrayer, setIsCurrentPrayer] = useState(false)
  
  useEffect(() => {
    const checkCurrentPrayer = () => {
      const current = getCurrentPrayer() as Prayer
      setIsCurrentPrayer(current === prayer)
    }
    
    checkCurrentPrayer()
    const interval = setInterval(checkCurrentPrayer, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [prayer])
  
  // Prayer time background colors
  const bgColors = {
    Fajr: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    Zuhar: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    Asr: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    Maghrib: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    Isha: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    Jummah: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
  }
  
  // Prayer time text colors
  const textColors = {
    Fajr: 'text-blue-700 dark:text-blue-300',
    Zuhar: 'text-yellow-700 dark:text-yellow-300',
    Asr: 'text-orange-700 dark:text-orange-300',
    Maghrib: 'text-red-700 dark:text-red-300',
    Isha: 'text-purple-700 dark:text-purple-300',
    Jummah: 'text-green-700 dark:text-green-300',
  }

  return (
    <Card 
      className={cn(
        'border-2',
        bgColors[prayer],
        isCurrentPrayer && 'prayer-time-active'
      )}
    >
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <Clock className={cn('h-8 w-8 mb-2', textColors[prayer])} />
          <h3 className={cn('text-xl font-bold mb-1', textColors[prayer])}>
            {prayer}
          </h3>
          <p className="text-2xl font-amiri font-bold">{time}</p>
          {isCurrentPrayer && (
            <span className="text-xs mt-2 px-2 py-1 rounded-full bg-primary/10 text-primary">
              Current Prayer
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}