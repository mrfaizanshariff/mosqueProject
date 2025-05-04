'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Card, CardContent } from '../../../components/ui/card'
import { Mosque, Prayer } from '../../lib/types'
import { getCurrentPrayer } from '../../lib/data'
import { cn } from '../../../lib/utils'
import Link from 'next/link'

interface PrayerTimesTableProps {
  mosques: Mosque[]
}

export function PrayerTimesTable({ mosques }: PrayerTimesTableProps) {
  const [currentPrayer, setCurrentPrayer] = useState<Prayer | null>(null)

  useEffect(() => {
    setCurrentPrayer(getCurrentPrayer() as Prayer)
    
    const interval = setInterval(() => {
      setCurrentPrayer(getCurrentPrayer() as Prayer)
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-medium">Mosque</TableHead>
                {prayers.map((prayer) => (
                  <TableHead 
                    key={prayer} 
                    className={cn(
                      "text-center min-w-[100px]",
                      currentPrayer === prayer && "text-primary font-semibold"
                    )}
                  >
                    {prayer}
                    {currentPrayer === prayer && (
                      <span className="block text-xs text-primary/70 font-normal">
                        Current
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mosques.map((mosque) => (
                <TableRow 
                  key={mosque.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <Link 
                      href={`/mosques/${mosque.id}`}
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {mosque.name}
                    </Link>
                  </TableCell>
                  {prayers.map((prayer) => (
                    <TableCell 
                      key={`${mosque.id}-${prayer}`} 
                      className={cn(
                        "text-center",
                        currentPrayer === prayer && "prayer-time-active rounded"
                      )}
                    >
                      {mosque.prayerTimes[prayer]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}