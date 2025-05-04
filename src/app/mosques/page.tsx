import { mosques } from '../../lib/data'
import { MosqueCard } from '../../components/ui/mosque-card'
import { Separator } from '../../../components/ui/separator'
import { Mosque } from '../../lib/icon'

export const metadata = {
  title: 'Mosques Directory | Salah Times',
  description: 'Browse all mosques in the directory and find their prayer times',
}

export default function MosquesPage() {
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
        </div>
        
        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mosques.map((mosque) => (
            <MosqueCard key={mosque.id} mosque={mosque} />
          ))}
        </div>
      </div>
    </div>
  )
}