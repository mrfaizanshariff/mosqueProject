import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Mosque } from '../lib/icon'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <Mosque className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="font-amiri text-4xl font-bold mb-2">404 - Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">
          Return to Home
        </Link>
      </Button>
    </div>
  )
}