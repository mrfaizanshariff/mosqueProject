import type {  LucideProps } from 'lucide-react'
import { LucideIcon } from 'lucide-react';
import { Info } from 'lucide-react';
import * as LucideIcons from 'lucide-react'
import type { FC } from 'react';

interface FacilityIconProps extends React.ComponentProps<typeof Info>  {
  name: string;
  className?: string
}

export function FacilityIcon({ name, ...props }: FacilityIconProps) {
  // Map facility icon names to Lucide icon components
  const iconMap: Record<string, keyof typeof LucideIcons> = {
    'droplets': 'Droplets',
    'users': 'Users',
    'book-open': 'BookOpen',
    'school': 'School',
    'parking': 'SquareParking',
    'wheelchair': 'Accessibility',
    'users-2': 'Users2',
    'book': 'Book',
    'baby': 'Baby',
    'utensils': 'Utensils',
    'heart-handshake': 'HeartHandshake',
    'heart': 'Heart',
    'shopping-basket': 'ShoppingBasket',
    'flower': 'Flower2',
    'stethoscope': 'Stethoscope',
    'dumbbell': 'Dumbbell',
  }
  
  // Default to Info icon if the specified icon is not found
  const IconComponent = LucideIcons[iconMap[name] || 'Info'] as typeof Info;
  
  return <IconComponent {...props} />
}