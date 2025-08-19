'use client'

import { useState, useCallback, useMemo, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import dynamic from 'next/dynamic'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { MapPin, Clock, Building, CheckSquare, FileText, Plus } from 'lucide-react'
import { Mosque } from '../../lib/types'
import { Autocomplete } from '../../../components/ui/auto-complete'
// Dynamic imports for heavy components
const MosqueLocationPicker = dynamic(
  () => import('../../components/mosque/mosque-location-picker').then(mod => ({ 
    default: mod.MosqueLocationPicker 
  })),
  { 
    loading: () => <div className="h-64 bg-muted rounded-lg flex items-center justify-center">Loading map...</div>,
    ssr: false 
  }
)

const PrayerTimePicker = dynamic(
  () => import('../../components/mosque/prayer-time-picker').then(mod => ({ 
    default: mod.PrayerTimePicker 
  })),
  { 
    loading: () => <div className="h-32 bg-muted rounded-lg flex items-center justify-center">Loading prayer times...</div>
  }
)

// Lazy load mosques data

const useMosquesData = () => {
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [loading, setLoading] = useState(false)
  const [city, setSelectedCity] = useState("")

  const setCity = useCallback((city: string) => {
    setSelectedCity(city)
    setMosques([]) // Reset mosques when city changes
  }, [])
  const loadMosques = useCallback(async () => {
    if (mosques.length > 0) return // Already loaded

    setLoading(true)
    try {
      const { mosques: mosquesData } = await import('../../lib/data')
      const filteredMosques = mosquesData.filter(mosque => mosque.city === city)
      setMosques(filteredMosques)
    } catch (error) {
      console.error('Failed to load mosques:', error)
    } finally {
      setLoading(false)
    }
  }, [mosques.length, city])

  return { mosques, loading, loadMosques,setCity }
}

const formSchema = z.object({
  city : z.string().min(1, 'City is required'),
  mosqueName: z.string(),
  otherMosqueName: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  prayerTimes: z.object({
    Fajr: z.string().min(1, 'Fajr time is required'),
    Zuhar: z.string().min(1, 'Zuhar time is required'),
    Asr: z.string().min(1, 'Asr time is required'),
    Maghrib: z.string().min(1, 'Maghrib time is required'),
    Isha: z.string().min(1, 'Isha time is required'),
    Jummah: z.string().min(1, 'Jummah time is required'),
  }),
  facilities: z.array(z.string()),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

// Memoized facilities data
const availableFacilities = [
  { id: 'wudu', name: 'Wudu Area' },
  { id: 'women-prayer', name: "Women's Prayer Space" },
  { id: 'library', name: 'Library' },
  { id: 'c-school', name: 'Children Deen School' },
  { id: 'dd-school', name: 'Adult Deen School' },
  { id: 'two-parking', name: 'Two Wheeler Parking' },
  { id: 'car-parking', name: 'Car Parking' },
  { id: 'wheelchair', name: 'Wheelchair Access' },
  { id: 'community-hall', name: 'Community Hall' },
  { id: 'funeral', name: 'Funeral Services' },
  { id: 'sports', name: 'Sports Facilities' },
] as const

// Memoized components for better performance
type MosqueSelectionCardProps = {
  useOtherMosque: boolean
  setUseOtherMosque: (checked: boolean) => void
  form: ReturnType<typeof useForm<FormData>>
  mosques: any[]
  loadMosques: () => void
  setCity: (city: string) => void
  loading: boolean,
  cities: any,
}
const handleChekboxChange = (setUseOtherMosque: any, form: any) => async (checked: boolean) => {
  setUseOtherMosque(checked);
  if (checked) {
    // Switch to 'otherMosqueName' mode
    form.setValue('mosqueName', '');
    form.clearErrors('mosqueName');
    form.setValue('otherMosqueName', '');
    form.clearErrors('otherMosqueName');
    await form.trigger('otherMosqueName');
  } else {
    // Switch to 'mosqueName' mode
    form.setValue('otherMosqueName', '');
    form.clearErrors('otherMosqueName');
    form.setValue('mosqueName', '');
    form.clearErrors('mosqueName');
    await form.trigger('mosqueName');
  }
}
const MosqueSelectionCard = ({ useOtherMosque, setUseOtherMosque, form, mosques, loadMosques, loading,cities,setCity }: MosqueSelectionCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Building className="h-5 w-5 mr-2 text-primary" />
        Mosque Selection
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      
       <div>
          <FormField
        control={form.control}
        name="city"
        render={({ field }) => {
          // field has: value, onChange, onBlur, name, ref
          return (
            <FormItem>
              <FormLabel>Search For your city</FormLabel>
              <FormControl>
                <div className="relative">
                  <Autocomplete
                    // ensure Autocomplete works as a controlled input for react-hook-form
                    value={field.value ?? ''}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}

                    // data and filtering
                    options={cities.map((city:any) => ({ label: city,id: city }))}
                    placeholder={loading ? 'Loading cities...' : 'Select the city'}
                    // Optionally customize filtering to be more city-friendly:
                    // filterOptions={(opts, input) => opts.filter(o => o.label.toLowerCase().startsWith(input.toLowerCase()))}

                    // When user selects from dropdown, commit value to form
                    onSelect={(opt) => {
                      // set form value to the option label (or opt.value if you prefer)
                      form.setValue('city', opt.label, { shouldValidate: true, shouldDirty: true });
                       setCity(opt.label)
                    }}

                    // Optional: load data when input gains focus
                    // onFocus={(e) => {
                    //   loadCities();
                    // }}
                  />
                  {/* Optional helper row: a tiny loading hint under the field */}
                  {loading && (
                    <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                      Loading…
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
       </div>
       {form.getValues('city').length>0 && (

      <div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="use-other"
          checked={useOtherMosque}
          onCheckedChange={handleChekboxChange(setUseOtherMosque,form)}
        />
        <Label htmlFor="use-other">
          Select this if your mosque is not listed, and you want to enter its details manually.
        </Label>
      </div>
        { !useOtherMosque ? (
                <FormField
          control={form.control}
          name="mosqueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Mosque</FormLabel>
              <FormControl>
                <div className="relative">
                  <Autocomplete
                    // react-hook-form wiring
                    value={field.value ?? ''}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}

                    // data
                    options={mosques.map((m) => ({
                      id: String(m.id ?? m.name ?? Math.random()),
                      label: String(m.name ?? ''),
                      value: String(m.id ?? ''), // optional separate value if needed
                      // You can carry extra fields if your render needs them
                    
                      city: String(m.city ?? ''),
                    
                      state: String(m.state ?? ''),
                    }))}

                    // open and load on focus (equivalent to onOpenChange={open && loadMosques()})
                    onFocus={() => {
                      if (!loading) loadMosques();
                    }}

                    placeholder={loading ? 'Loading mosques...' : 'Search and select a mosque'}

                    // how each option is displayed in the popup
                    getOptionLabel={(opt) => opt.label}

                    renderOption={(opt, active) => (
                      <div className="flex flex-col">
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {/* @ts-expect-error extra fields carried above */}
                          {opt.city}, {/* @ts-expect-error */}
                          {opt.state}
                        </span>
                      </div>
                    )}

                    // customize filtering: match on name, city, or state
                    filterOptions={(opts, input) => {
                      const q = input.trim().toLowerCase();
                      if (!q) return opts;
                      return opts.filter((o) => {
                        const name = o.label.toLowerCase();
                        const city = (o as any).city?.toLowerCase?.() ?? '';
                        const state = (o as any).state?.toLowerCase?.() ?? '';
                        return (
                          name.includes(q) ||
                          city.includes(q) ||
                          state.includes(q)
                        );
                      });
                    }}

                    // when user selects an option, commit to the form field
                    onSelect={(opt) => {
                      // Store the mosque name in the form field (same as your SelectItem value).
                      field.onChange(opt.label);

                      // If you prefer to store mosque ID instead, use:
                      // field.onChange(opt.value);

                      // If you also track selected mosque locally, set state here:
                      // setMosqueName(opt.label);
                    }}

                    // style matches your Input classes
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                              placeholder:text-muted-foreground
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                              disabled:cursor-not-allowed disabled:opacity-50"
                    popperClassName="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-popover text-popover-foreground shadow-md"
                    optionClassName="cursor-pointer select-none px-3 py-2 text-sm"
                    emptyText={
                      loading
                        ? 'Loading mosques...'
                        : mosques.length === 0
                          ? 'No mosques found in this city. Please select "Other" to add a new mosque.'
                          : 'No results'
                    }
                  />

                  {/* Inline loading hint (optional) */}
                  {loading && (
                    <div className="pointer-events-none absolute right-2 top-2 text-xs text-muted-foreground">
                      Loading…
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

              ) : (

              <div>
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
                  
                    <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Location on Map or If you are at the mosque select your current location</FormLabel>
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
              </div>
              )}
      </div>
       )
       }

      
    </CardContent>
  </Card>
)

const ContactInfoCard = ({ form }: { form: ReturnType<typeof useForm<FormData>> }) => (
  <Card>
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Concerned personnel's number" {...field} />
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
                <Input placeholder="Concerned Personnel's email" {...field} />
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
)



type FacilitiesCardProps = {
  form: ReturnType<typeof useForm<FormData>>
}

const FacilitiesCard = ({ form }: FacilitiesCardProps) => (
  <Card>
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
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(facility.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, facility.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== facility.id
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {facility.name}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
)

export default function SubmitMosquePage() {
  const [useOtherMosque, setUseOtherMosque] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mosques, loading, loadMosques, setCity } = useMosquesData()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur', // Less frequent validation
    defaultValues: {
      city:'',
      mosqueName: '',
      otherMosqueName: '',
      phone: '',
      email: '',
      website: '',
      location: {
        lat: 12.3267616,
        lng: 76.6686926,
      },
      prayerTimes: {
        Fajr: '',
        Zuhar: '',
        Asr: '',
        Maghrib: '',
        Isha: '',
        Jummah: '',
      },
      facilities: [],
      description: '',
    },
  })

  const onSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/sent-to-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.detail || result.error || 'Failed to submit')
      }

      alert('Mosque data submitted successfully!')
      form.reset()
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [form])

  // Memoize form sections to prevent unnecessary re-renders
  const mosqueSelectionCard = useMemo(() => (
    <MosqueSelectionCard
      useOtherMosque={useOtherMosque}
      setUseOtherMosque={setUseOtherMosque}
      form={form}
      mosques={mosques}
      loadMosques={loadMosques}
      setCity={setCity}
      loading={loading}
      cities={['Mysuru', 'Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai']} // Example cities, replace with actual data
    />
  ), [useOtherMosque, form, mosques, loadMosques, loading,setCity])

  const contactInfoCard = useMemo(() => (
    <ContactInfoCard form={form} />
  ), [form])

  const facilitiesCard = useMemo(() => (
    <FacilitiesCard form={form} />
  ), [form])

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Simple header without animations */}
        <div className="text-center mb-12">
          <Building className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">
            Submit Mosque Information
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us expand our mosque directory by submitting information about mosques in your area. 
            Your contribution helps the community stay connected.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Mosque Selection */}
            {mosqueSelectionCard}

            {/* Contact Information */}
            {contactInfoCard}

            

            {/* Prayer Times */}
            <Card>
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
                    Zuhar: form.formState.errors.prayerTimes?.Zuhar?.message,
                    Asr: form.formState.errors.prayerTimes?.Asr?.message,
                    Maghrib: form.formState.errors.prayerTimes?.Maghrib?.message,
                    Isha: form.formState.errors.prayerTimes?.Isha?.message,
                    Jummah: form.formState.errors.prayerTimes?.Jummah?.message,
                  }}
                />
              </CardContent>
            </Card>

            {/* Facilities */}
            {facilitiesCard}

            {/* Description */}
            <Card>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide additional information about the mosque, its history, special programs, or any other relevant details or any other feedback you want to provide"
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
{Object.keys(form.formState.errors).length > 0 && (
  <Card className="border-destructive/50 bg-destructive/5">
    <CardContent className="pt-6">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-destructive"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-destructive">
            Please fill the required fields before submitting:
          </h3>
          <div className="mt-2 text-sm text-destructive">
            <ul className="list-disc space-y-1 pl-5">
              {/* Basic field errors */}
              {form.formState.errors.mosqueName && (
                <li>Please select or enter a mosque name</li>
              )}
              {form.formState.errors.otherMosqueName && (
                <li>Please enter the mosque name</li>
              )}
              {form.formState.errors.email && (
                <li>Please enter a valid email address</li>
              )}
              {form.formState.errors.website && (
                <li>Please enter a valid website URL</li>
              )}
              {form.formState.errors.location && (
                <li>Please select a location on the map</li>
              )}
              
              {/* Prayer times errors */}
              {form.formState.errors.prayerTimes && (
                <>
                  {form.formState.errors.prayerTimes.Fajr && <li>Fajr time is required</li>}
                  {form.formState.errors.prayerTimes.Zuhar && <li>Zuhar time is required</li>}
                  {form.formState.errors.prayerTimes.Asr && <li>Asr time is required</li>}
                  {form.formState.errors.prayerTimes.Maghrib && <li>Maghrib time is required</li>}
                  {form.formState.errors.prayerTimes.Isha && <li>Isha time is required</li>}
                  {form.formState.errors.prayerTimes.Jummah && <li>Jummah time is required</li>}
                </>
              )}
              
              {form.formState.errors.facilities && (
                <li>Please select at least one facility</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)}
            {/* Submit Button */}
            <div className="flex justify-center pt-6">
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}


