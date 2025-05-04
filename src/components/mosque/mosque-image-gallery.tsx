'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '../../../components/ui/dialog'
import { MosqueImage } from '../../lib/types'
import { AspectRatio } from '../../../components/ui/aspect-ratio'
import { Button } from '../../../components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MosqueImageGalleryProps {
  images: MosqueImage[]
}

export function MosqueImageGallery({ images }: MosqueImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  const handleOpenImage = (index: number) => {
    setSelectedImageIndex(index)
    setIsOpen(true)
  }
  
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }
  
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="gallery-image rounded-xl overflow-hidden cursor-pointer"
            onClick={() => handleOpenImage(index)}
          >
            <AspectRatio ratio={4/3}>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </AspectRatio>
          </motion.div>
        ))}
      </motion.div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="relative h-[300px] md:h-[500px] w-full">
                {images[selectedImageIndex] && (
                  <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].alt || 'Mosque image'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                )}
              </div>
              
              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-background/20 hover:bg-background/40 backdrop-blur-sm h-12 w-12"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-background/20 hover:bg-background/40 backdrop-blur-sm h-12 w-12"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              
              <motion.div 
                className="absolute bottom-4 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm px-4 py-2 bg-background/80 backdrop-blur-sm max-w-max mx-auto rounded-full">
                  {selectedImageIndex + 1} of {images.length}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}