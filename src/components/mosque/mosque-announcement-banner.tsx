'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Announcement } from '../../lib/types'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface MosqueAnnouncementBannerProps {
  announcement: Announcement
}

export function MosqueAnnouncementBanner({ announcement }: MosqueAnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  if (!isVisible) return null
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive mb-0.5">{announcement.title}</h3>
                  <p className="text-sm">{announcement.content}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}