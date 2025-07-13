'use client'

import { useState } from 'react'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent } from '../../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Clock } from 'lucide-react'
import { Prayer, PrayerTimes } from '../../lib/types'

interface PrayerTimePickerProps {
  value: PrayerTimes
  onChange: (prayerTimes: PrayerTimes) => void
  errors?: Partial<Record<Prayer, string>>
}

interface TimeState {
  hour: string
  minute: string
  period: 'AM' | 'PM'
}

const convertTo24Hour = (time12: TimeState): string => {
  let hour = parseInt(time12.hour)
  if (time12.period === 'AM' && hour === 12) {
    hour = 0
  } else if (time12.period === 'PM' && hour !== 12) {
    hour += 12
  }
  return `${hour.toString().padStart(2, '0')}:${time12.minute}`
}

const convertTo12Hour = (time24: string): TimeState => {
  if (!time24) return { hour: '12', minute: '00', period: 'AM' }
  
  const [hour24, minute] = time24.split(':')
  let hour = parseInt(hour24)
  let period: 'AM' | 'PM' = 'AM'
  
  if (hour === 0) {
    hour = 12
  } else if (hour === 12) {
    period = 'PM'
  } else if (hour > 12) {
    hour -= 12
    period = 'PM'
  }
  
  return {
    hour: hour.toString(),
    minute: minute || '00',
    period
  }
}

export function PrayerTimePicker({ value, onChange, errors }: PrayerTimePickerProps) {
  const [timeStates, setTimeStates] = useState<Record<Prayer, TimeState>>(() => {
    const initial: Record<Prayer, TimeState> = {} as Record<Prayer, TimeState>
    const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
    prayers.forEach(prayer => {
      initial[prayer] = convertTo12Hour(value[prayer])
    })
    return initial
  })

  const prayers: { name: Prayer; label: string; color: string }[] = [
    { name: 'Fajr', label: 'Fajr (Dawn)', color: 'border-blue-200 bg-blue-50 dark:bg-blue-950/30' },
    { name: 'Dhuhr', label: 'Dhuhr (Noon)', color: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30' },
    { name: 'Asr', label: 'Asr (Afternoon)', color: 'border-orange-200 bg-orange-50 dark:bg-orange-950/30' },
    { name: 'Maghrib', label: 'Maghrib (Sunset)', color: 'border-red-200 bg-red-50 dark:bg-red-950/30' },
    { name: 'Isha', label: 'Isha (Night)', color: 'border-purple-200 bg-purple-50 dark:bg-purple-950/30' },
  ]

  const handleTimeChange = (prayer: Prayer, field: 'hour' | 'minute' | 'period', newValue: string) => {
    const newTimeState = { ...timeStates[prayer], [field]: newValue }
    setTimeStates(prev => ({ ...prev, [prayer]: newTimeState }))
    
    const time24 = convertTo24Hour(newTimeState)
    onChange({
      ...value,
      [prayer]: time24,
    })
  }

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prayers.map((prayer) => (
        <Card key={prayer.name} className={`border-2 ${prayer.color}`}>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <Label htmlFor={prayer.name} className="font-medium">
                {prayer.label}
              </Label>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={timeStates[prayer.name].hour}
                onValueChange={(value) => handleTimeChange(prayer.name, 'hour', value)}
              >
                <SelectTrigger className={errors?.[prayer.name] ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeStates[prayer.name].minute}
                onValueChange={(value) => handleTimeChange(prayer.name, 'minute', value)}
              >
                <SelectTrigger className={errors?.[prayer.name] ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeStates[prayer.name].period}
                onValueChange={(value) => handleTimeChange(prayer.name, 'period', value as 'AM' | 'PM')}
              >
                <SelectTrigger className={errors?.[prayer.name] ? 'border-destructive' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {errors?.[prayer.name] && (
              <p className="text-sm text-destructive mt-1">{errors[prayer.name]}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}