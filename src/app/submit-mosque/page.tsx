'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Separator } from '../../../components/ui/separator'
import { MapPin, Clock, Building, CheckSquare, FileText, Plus } from 'lucide-react'
import { mosques } from '../../lib/data'
import { motion } from 'framer-motion'
import { MosqueLocationPicker } from '../../components/mosque/mosque-location-picker'
import { PrayerTimePicker } from '../../components/mosque/prayer-time-picker'

const formSchema = z.object({
  mosqueName: z.string().optional(),
  otherMosqueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  prayerTimes: z.object({
    Fajr: z.string().min(1, 'Fajr time is required'),
    Dhuhr: z.string().min(1, 'Dhuhr time is required'),
    Asr: z.string().min(1, 'Asr time is required'),
    Maghrib: z.string().min(1, 'Maghrib time is required'),
    Isha: z.string().min(1, 'Isha time is required'),
  }),
  facilities: z.array(z.string()),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const availableFacilities = [
  { id: 'wudu', name: 'Wudu Area', icon: 'droplets' },
  { id: 'women-prayer', name: "Women's Prayer Space", icon: 'users' },
  { id: 'library', name: 'Library', icon: 'book-open' },
  { id: 'school', name: 'Weekend School', icon: 'school' },
  { id: 'parking', name: 'Parking', icon: 'parking' },
  { id: 'wheelchair', name: 'Wheelchair Access', icon: 'wheelchair' },
  { id: 'community-hall', name: 'Community Hall', icon: 'users-2' },
  { id: 'bookstore', name: 'Bookstore', icon: 'book' },
  { id: 'childcare', name: 'Childcare', icon: 'baby' },
  { id: 'kitchen', name: 'Community Kitchen', icon: 'utensils' },
  { id: 'funeral', name: 'Funeral Services', icon: 'heart-handshake' },
  { id: 'youth-center', name: 'Youth Center', icon: 'users-2' },
  { id: 'counseling', name: 'Counseling Services', icon: 'heart' },
  { id: 'food-pantry', name: 'Halal Food Pantry', icon: 'shopping-basket' },
  { id: 'garden', name: 'Community Garden', icon: 'flower' },
  { id: 'health-clinic', name: 'Health Clinic', icon: 'stethoscope' },
  { id: 'sports', name: 'Sports Facilities', icon: 'dumbbell' },
]

export default function SubmitMosquePage() {
  const [useOtherMosque, setUseOtherMosque] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mosqueName: '',
      otherMosqueName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      website: '',
      location: {
        lat: 12.3267616,
        lng: 76.6686926,
      },
      prayerTimes: {
        Fajr: '',
        Dhuhr: '',
        Asr: '',
        Maghrib: '',
        Isha: '',
      },
      facilities: [],
      description: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Form submitted:', data)
    alert('Mosque data submitted successfully!')
    
    setIsSubmitting(false)
    form.reset()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Building className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">
            Submit Mosque Information
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us expand our mosque directory by submitting information about mosques in your area. 
            Your contribution helps the community stay connected.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Mosque Selection */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      Mosque Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-other"
                        checked={useOtherMosque}
                        onCheckedChange={checked => setUseOtherMosque(checked === true)}
                      />
                      <Label htmlFor="use-other">
                        This mosque is not in the existing list
                      </Label>
                    </div>

                    {!useOtherMosque ? (
                      <FormField
                        control={form.control}
                        name="mosqueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Mosque</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Search and select a mosque" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mosques.map((mosque) => (
                                  <SelectItem key={mosque.id} value={mosque.name}>
                                    {mosque.name} - {mosque.city}, {mosque.state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="otherMosqueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mosque Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter mosque name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Contact & Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@mosque.org" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.mosque.org" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location Picker */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Location on Map</FormLabel>
                          <FormControl>
                            <MosqueLocationPicker
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Prayer Times */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Prayer Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PrayerTimePicker
                      value={form.watch('prayerTimes')}
                      onChange={(prayerTimes) => form.setValue('prayerTimes', prayerTimes)}
                      errors={{
                        Fajr: form.formState.errors.prayerTimes?.Fajr?.message,
                        Dhuhr: form.formState.errors.prayerTimes?.Dhuhr?.message,
                        Asr: form.formState.errors.prayerTimes?.Asr?.message,
                        Maghrib: form.formState.errors.prayerTimes?.Maghrib?.message,
                        Isha: form.formState.errors.prayerTimes?.Isha?.message,
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Facilities */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                      Facilities & Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="facilities"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select available facilities</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {availableFacilities.map((facility) => (
                              <FormField
                                key={facility.id}
                                control={form.control}
                                name="facilities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={facility.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(facility.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, facility.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== facility.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {facility.name}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide additional information about the mosque, its history, special programs, or any other relevant details..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center pt-6"
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Mosque Information
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  )
}