import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { 
  Heart, 
  MapPin, 
  Clock, 
  Building, 
  Users, 
  Bell, 
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { Mosque } from '../../lib/icon'

export const metadata = {
  title: 'About Us | Salah Times',
  description: 'Learn about our mission to connect Muslims with their local mosque community',
}

const challenges = [
  {
    icon: Clock,
    title: "Missed Prayers",
    description: "Difficulty keeping track of accurate, location-specific prayer times"
  },
  {
    icon: Users,
    title: "Community Disconnect", 
    description: "Limited awareness of mosque activities, announcements, and community events"
  },
  {
    icon: MapPin,
    title: "Finding Mosques",
    description: "Struggling to locate nearby mosques when traveling or relocating"
  },
  {
    icon: Building,
    title: "Information Gap",
    description: "Lack of comprehensive details about mosque facilities, services, and amenities"
  },
  {
    icon: Bell,
    title: "Communication Barriers",
    description: "Missing important announcements from mosque management"
  }
]

const features = [
  {
    icon: Mosque,
    title: "Comprehensive Mosque Directory",
    description: "Discover detailed information about local mosques including high-quality images, complete facility listings, and essential contact information."
  },
  {
    icon: Clock,
    title: "Accurate Prayer Times",
    description: "Get precise, location-based prayer timings updated in real-time, ensuring you never miss a prayer regardless of where you are."
  },
  {
    icon: MapPin,
    title: "Smart Mosque Finder",
    description: "Instantly locate nearby mosques with our intelligent search feature, perfect for travelers, new residents, or anyone exploring their community."
  },
  {
    icon: Building,
    title: "Detailed Mosque Profiles",
    description: "Access comprehensive information for each mosque including current prayer schedules, available facilities, accessibility features, and community programs."
  },
  {
    icon: Bell,
    title: "Community Announcements",
    description: "Stay informed with real-time updates, announcements, and important communications directly from mosque management."
  },
  {
    icon: Target,
    title: "Location-Based Services",
    description: "Our smart location technology ensures you receive the most relevant and accurate information for your specific area."
  }
]

const profileFeatures = [
  "Current prayer schedules",
  "Available facilities (parking, women's prayer areas, libraries, community halls)",
  "Accessibility features",
  "Contact information and websites",
  "Community programs and services"
]

const visionPoints = [
  "Maintain their spiritual obligations with confidence and ease",
  "Stay connected with their local mosque community",
  "Discover and explore Islamic centers wherever they go",
  "Participate actively in community life through better access to information",
  "Strengthen their faith journey through consistent prayer and community engagement"
]

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <Mosque className="h-16 w-16 mx-auto text-primary mb-6" />
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">
            About Us
          </h1>
          <h2 className="font-amiri text-2xl md:text-3xl text-muted-foreground mb-6">
            Connecting Muslims with Their Local Mosque Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Strengthening the bond between believers and their houses of worship, one prayer at a time.
          </p>
        </div>

        <div className="space-y-16">
          {/* Mission Section */}
          <section>
            <Card className="border-border/40 pattern-bg">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-primary mr-3" />
                  <h2 className="font-amiri text-3xl font-bold">Our Mission</h2>
                </div>
                <div className="space-y-4 text-lg leading-relaxed">
                  <p>
                    In today's fast-paced world, staying connected with our local mosque community and maintaining regular prayer schedules can be challenging. Our platform was born from a simple yet profound belief: every Muslim deserves easy access to their local mosque community and the peace of mind that comes with never missing a prayer.
                  </p>
                  <p>
                    We are dedicated to bridging the gap between technology and faith, creating a comprehensive digital ecosystem that serves Muslims in their daily spiritual journey while fostering stronger connections with their local mosques.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Challenges Section */}
          <section>
            <h2 className="font-amiri text-3xl font-bold mb-8 text-center">
              The Challenge We Address
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Many Muslims face common challenges in their daily worship:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.title} className="h-full border-border/40 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <challenge.icon className="h-10 w-10 text-destructive mb-4" />
                    <h3 className="font-bold text-lg mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground">{challenge.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* What We Offer Section */}
          <section>
            <h2 className="font-amiri text-3xl font-bold mb-12 text-center">
              What We Offer
            </h2>
            <div className="space-y-8">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/40">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-full shrink-0">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                        {feature.title === "Detailed Mosque Profiles" && (
                          <div className="mt-4">
                            <p className="font-medium mb-2">Access comprehensive information for each mosque including:</p>
                            <ul className="space-y-1">
                              {profileFeatures.map((item, idx) => (
                                <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                  <CheckCircle className="h-4 w-4 text-primary mr-2 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section>
            <Card className="border-border/40 bg-accent/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center mb-6">
                  <Star className="h-8 w-8 text-accent mr-3" />
                  <h2 className="font-amiri text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg mb-6">
                  We envision a world where technology serves faith, where every Muslim can:
                </p>
                <ul className="space-y-3">
                  {visionPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Community Section */}
          <section>
            <Card className="border-border/40">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center mb-6">
                  <Globe className="h-8 w-8 text-secondary mr-3" />
                  <h2 className="font-amiri text-3xl font-bold">Built by the Community, for the Community</h2>
                </div>
                <div className="space-y-4 text-lg leading-relaxed">
                  <p>
                    This platform is more than just an app—it's a community-driven initiative designed by Muslims who understand the unique needs of our ummah. Every feature has been thoughtfully crafted based on real experiences and challenges faced by our community members.
                  </p>
                  <p>
                    We believe that when Muslims are connected to their mosques and maintain regular prayers, entire communities flourish. Our platform is our contribution to building stronger, more connected Muslim communities around the world.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Join Community Section */}
          <section>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="font-amiri text-3xl font-bold mb-4">
                  Join Our Growing Community
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Whether you're a daily mosque-goer, a traveling professional, a new Muslim, or someone looking to reconnect with your local Islamic community, our platform is designed to serve you.
                </p>
                <p className="text-xl font-medium mb-8">
                  Together, we're building bridges between hearts, communities, and the houses of Allah.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Button asChild size="lg">
                    <Link href="/#nearbymosque">
                      Find Mosques Near You
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/#prayer-times">
                      View Prayer Times
                    </Link>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/submit-mosque">
                      Submit Mosque Information
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quran Quote */}
          <section>
            <Card className="border-border/40 bg-muted/20">
              <CardContent className="p-8 text-center">
                <blockquote className="font-amiri text-xl md:text-2xl italic mb-4">
                  "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth."
                </blockquote>
                <cite className="text-muted-foreground">- Quran 6:73</cite>
              </CardContent>
            </Card>
          </section>

          {/* Contact Section */}
          <section>
            <div className="text-center">
              <p className="text-lg mb-6">
                Questions or suggestions? We'd love to hear from you.
              </p>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Share your feedback or learn more about how you can contribute to this community initiative.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
