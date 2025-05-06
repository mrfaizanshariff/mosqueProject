'use client'
import { mosques } from '../../lib/data'
import { MosqueCard } from '../../components/ui/mosque-card'
import { Separator } from '../../../components/ui/separator'
import { Mosque } from '../../lib/icon'
import { Info } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button'

// export const metadata = {
//   title: 'Mosques Directory | Mosques of India',
//   description: 'Browse all mosques in the directory and find their prayer times',
// }


export default function MosquesPage() {
  const rowsPerPage =10;
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
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Mosque className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">
            Mosques Directory
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive directory of mosques and find prayer times, facilities, 
            and other important information about each mosque.
          </p>

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
        </div>
        
        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 h-[70%] overflow-auto lg:grid-cols-3 gap-8">
          {paginatedData.map((mosque) => (
            <MosqueCard key={mosque.id} mosque={mosque} />
          ))}
        </div>
          <div className="flex justify-around items-center pt-2">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} variant="default" >
          Previous
            </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="default" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}