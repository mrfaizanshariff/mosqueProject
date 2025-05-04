'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Card, CardContent } from '../../../components/ui/card'
import { Mosque, Prayer } from '../../lib/types'
import { getCurrentPrayer } from '../../lib/data'
import { cn } from '../../../lib/utils'
import Link from 'next/link'

interface PrayerTimesTableProps {
  mosques: Mosque[];
  rowsPerPage?: number; 
}

export function PrayerTimesTable({ mosques,rowsPerPage = 10  }: PrayerTimesTableProps) {
  const [currentPrayer, setCurrentPrayer] = useState<Prayer | null>(null)

  useEffect(() => {
    setCurrentPrayer(getCurrentPrayer() as Prayer)
    
    const interval = setInterval(() => {
      setCurrentPrayer(getCurrentPrayer() as Prayer)
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>('All')
  const uniqueCities = Array.from(new Set(mosques.map(m => m.city))).sort()
  const filteredData = mosques.filter((row) => {
    const matchesCity = selectedCity === 'All' || row.city === selectedCity
    const matchesSearch = Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    return matchesCity && matchesSearch
  })
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />

            <select
              className="p-2 border rounded h-full w-full sm:w-1/2"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="All">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
              </div>
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
              {paginatedData.map((mosque) => (
                <TableRow 
                  key={mosque.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <Link 
                      href={`/mosques/${mosque.id}`}
                      className="hover:text-primary text-blue-400 transition-colors hover:underline"
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

          <div className="flex justify-between items-center pt-2">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
          Next
        </button>
      </div>
        </div>
      </CardContent>
    </Card>
  )
}