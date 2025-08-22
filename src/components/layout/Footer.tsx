import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-accent/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-end">
                          <Image src="/android-chrome-512x512.png" alt="Mosque of India Logo" width={60} height={60}/> 
              
              <span className="font-amiri text-2xl font-bold">Mosques of India</span>
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
            <h3 className="font-bold text-lg mb-4">Upcoming Products</h3>
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
              <li className="text-sm">Email: <a href="mailto:mosqueofIndia@gmail.com">mosqueofIndia@gmail.com</a></li>
              <li className="text-sm">Email: <a href="mailto:mohammed.faizan@xenolve.com">mohammed.faizan@xenolve.com</a></li>
              <li className="text-sm">Email: <a href="mailto:mohammed.maaz@xenolve.com">mohammed.maaz@xenolve.com</a></li>
              <li className="text-sm">Address: Mysore,Karnataka</li>
            </ul>
          </div>
        </div>
        
        <div className="islamic-divider my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Mosques of India. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            Made with <Heart className="h-4 w-4 text-destructive mx-1" /> for the Muslim community
            by 
            <span className="text-primary text-xl bold">
            <Link href="https://www.xenolve.com" target='_blank' rel='noopener noreferrer'>&#8209; Xenolve</Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer