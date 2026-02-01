'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '../../../components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '../../../components/ui/sheet'
import { cn } from '../../../lib/utils'
import Image from 'next/image'

interface DropdownItem {
  href: string
  label: string
}

interface NavItem {
  label: string
  href?: string
  dropdown?: DropdownItem[]
}

const Header = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Quran Gpt', href: '/quran-gpt' },
    {
      label: 'Quran',
      dropdown: [
        { href: '/quranPlayer', label: 'Quran Player' },
        { href: '/quran', label: 'Quran Reader' },
      ],
    },
    {
      label: 'Ramadan',
      dropdown: [
        { href: '/ramadan', label: 'Ramadan Companion' },
      ],
    },
    {
      label: 'Mosque',
      dropdown: [
        { href: '/submit-mosque', label: 'Add Mosque' },
        { href: '/mosques', label: 'Mosques' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-end space-x-2">
            <Image src="/android-chrome-512x512.png" alt="Logo" width={40} height={40} />
            <span className="font-amiri text-xl md:text-2xl font-bold">Mosques of India</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform',
                      openDropdown === item.label && 'rotate-180'
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      'absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-200',
                      openDropdown === item.label
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    )}
                  >
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="block px-4 py-3 text-sm hover:bg-muted transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col space-y-2 mt-8">
                  {navItems.map((item) => (
                    item.dropdown ? (
                      <div key={item.label} className="space-y-1">
                        <button
                          onClick={() => setMobileOpenDropdown(
                            mobileOpenDropdown === item.label ? null : item.label
                          )}
                          className="flex items-center justify-between w-full text-lg font-medium py-2 hover:text-primary transition-colors"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform',
                              mobileOpenDropdown === item.label && 'rotate-180'
                            )}
                          />
                        </button>
                        {mobileOpenDropdown === item.label && (
                          <div className="pl-4 space-y-1">
                            {item.dropdown.map((dropdownItem) => (
                              <SheetClose asChild key={dropdownItem.href}>
                                <Link
                                  href={dropdownItem.href}
                                  className="block text-base py-2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {dropdownItem.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href!}
                          className="text-lg font-medium py-2 hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    )
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header