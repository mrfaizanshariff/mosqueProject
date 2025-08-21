'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Separator } from '../../../components/ui/separator'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Heart,
  Globe,
  Users,
  HelpCircle,
  Bug,
  Lightbulb,
  Building
} from 'lucide-react'
import { motion } from 'framer-motion'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  mosque: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

const subjects = [
  { value: 'general', label: 'General Inquiry', icon: MessageSquare },
  { value: 'mosque-submission', label: 'Mosque Information Submission', icon: Building },
  { value: 'technical-support', label: 'Technical Support', icon: HelpCircle },
  { value: 'bug-report', label: 'Bug Report', icon: Bug },
  { value: 'feature-request', label: 'Feature Request', icon: Lightbulb },
  { value: 'community', label: 'Community Partnership', icon: Users },
  { value: 'feedback', label: 'Feedback & Suggestions', icon: Heart },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      mosque: '',
    },
  })

  const handleSubmit = async (event:any) => {
    setIsSubmitting(true)
    
          event.preventDefault();
          const formData = new FormData(event.target)

          formData.append("access_key", "0e3198d9-8a5c-4031-9955-f0674edfd3e3");

          const object = Object.fromEntries(formData);
          const json = JSON.stringify(object);

          const response = await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: json
          });
          const result = await response.json();
          if (result.success) {
            setIsSubmitting(false)
              console.log(result);
          }else {
            setIsSubmitting(false)
              console.error("Error submitting form:", result.message);
          }
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

  if (isSubmitted) {
    return (
      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
                >
                  <Send className="h-10 w-10 text-primary" />
                </motion.div>
                <h1 className="font-amiri text-3xl font-bold mb-4">
                  Message Sent Successfully!
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Thank you for reaching out to us. We've received your message and will get back to you within 24-48 hours.
                </p>
                <p className="text-sm text-muted-foreground">
                  May Allah bless you for helping us improve our community platform.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Mail className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Contact Information */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="border-border/40 h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">mohammed.faizan@xenolve.com</p>
                      <p className="text-sm text-muted-foreground">mohammed.maaz@xenolve.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        Mysuru<br />
                        Karnataka<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 24-48 hours
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Follow Us</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
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
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 123-4567-890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            {/* Custom Select for UI */}
                            <Select
                              onValueChange={(val) => field.onChange(val)}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    <div className="flex items-center">
                                      <subject.icon className="h-4 w-4 mr-2" />
                                      {subject.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {/* Hidden input for FormData compatibility */}
                            <input type="hidden" name="subject" value={field.value || ''} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="mosque"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Mosque (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="If your message is about a specific mosque" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide as much detail as possible about your inquiry..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-16"
        >
          <Card className="border-border/40 pattern-bg">
            <CardContent className="p-8">
              <h2 className="font-amiri text-3xl font-bold mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">How do I submit mosque information?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can submit mosque information through our dedicated submission form. Visit the "Submit Mosque" page and fill out the required details.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How accurate are the prayer times?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our local mosque prayer times are collected from public and are updated regularly to ensure accuracy.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I report incorrect information?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Yes, please contact us with any corrections or updates. We appreciate community feedback to maintain accurate information.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is this service free?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Yes, our platform is completely free to use. We're committed to serving the Muslim community without any charges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Islamic Quote */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-12"
        >
          <Card className="border-border/40 bg-muted/20">
            <CardContent className="p-8 text-center">
              <blockquote className="font-amiri text-xl md:text-2xl italic mb-4">
                "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
              </blockquote>
              <cite className="text-muted-foreground">- Quran 65:3</cite>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}