import React from 'react'
import Link from 'next/link'
import { Clock, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-accent/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-primary mr-2" />
              <span className="font-amiri text-2xl font-bold">Salah Times</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Helping Muslims find prayer times at local mosques. Always stay connected with your community.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/mosques" className="text-sm hover:text-primary transition-colors">Mosques</Link></li>
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/prayer-guide" className="text-sm hover:text-primary transition-colors">Prayer Guide</Link></li>
              <li><Link href="/qibla-finder" className="text-sm hover:text-primary transition-colors">Qibla Finder</Link></li>
              <li><Link href="/ramadan" className="text-sm hover:text-primary transition-colors">Ramadan Calendar</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm">Email: contact@salahtimes.com</li>
              <li className="text-sm">Phone: +1 (555) 123-4567</li>
              <li className="text-sm">Address: 123 Islamic Center Dr, City, State</li>
            </ul>
          </div>
        </div>
        
        <div className="islamic-divider my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Salah Times. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            Made with <Heart className="h-4 w-4 text-destructive mx-1" /> for the Muslim community
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer