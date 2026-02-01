// app/namaz-timings/[city]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug, getAllCitySlugs } from '@/lib/prayer-times/cities';
import { getPrayerTimesByCity, formatPrayerTime } from '@/lib/prayer-times/aladhan';
import { Clock, MapPin, Calendar, Info } from 'lucide-react';

interface PageProps {
    params: Promise<{ city: string }>;
}

export const dynamicParams = true; // Allow dynamic generation for non-prerendered cities

export async function generateStaticParams() {
    // Only pre-render the most popular cities to avoid rate limiting
    // Other cities will be generated on-demand (ISR)
    const popularCities = ['delhi', 'mumbai', 'bangalore', 'hyderabad', 'kolkata'];
    return popularCities.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);

    if (!city) {
        return {
            title: 'City Not Found | Mosque of India',
        };
    }

    return {
        title: `Namaz Timings in ${city.name} Today | Prayer Times ${city.state}`,
        description: `Accurate Namaz (Salah) timings for ${city.name}, ${city.state}. Get today's prayer times including Fajr, Zuhr, Asr, Maghrib, and Isha. Updated daily with Hanafi calculation method.`,
        openGraph: {
            title: `Namaz Timings in ${city.name} Today`,
            description: `Get accurate prayer times for ${city.name}. Fajr, Zuhr, Asr, Maghrib, Isha timings updated daily.`,
            type: 'website',
        },
        alternates: {
            canonical: `https://mosqueofindia.com/namaz-timings/${citySlug}`,
        },
    };
}

export const revalidate = 3600; // Revalidate every hour

export default async function NamazTimingsPage({ params }: PageProps) {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);

    if (!city) {
        notFound();
    }

    const prayerTimes = await getPrayerTimesByCity(city);

    const prayers = [
        { name: 'Fajr', time: prayerTimes.fajr, icon: '🌅', description: 'Dawn prayer' },
        { name: 'Sunrise', time: prayerTimes.sunrise, icon: '☀️', description: 'Sun rises' },
        { name: 'Zuhr', time: prayerTimes.zuhr, icon: '🌤️', description: 'Noon prayer' },
        { name: 'Asr', time: prayerTimes.asr, icon: '🌆', description: 'Afternoon prayer' },
        { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌇', description: 'Sunset prayer' },
        { name: 'Isha', time: prayerTimes.isha, icon: '🌙', description: 'Night prayer' },
    ];

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `What time is Fajr in ${city.name} today?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Fajr prayer time in ${city.name} today is ${formatPrayerTime(prayerTimes.fajr)}.`,
                },
            },
            {
                '@type': 'Question',
                name: `What are the prayer times in ${city.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Today's prayer times in ${city.name}: Fajr ${formatPrayerTime(prayerTimes.fajr)}, Zuhr ${formatPrayerTime(prayerTimes.zuhr)}, Asr ${formatPrayerTime(prayerTimes.asr)}, Maghrib ${formatPrayerTime(prayerTimes.maghrib)}, Isha ${formatPrayerTime(prayerTimes.isha)}.`,
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                            <MapPin className="w-4 h-4" />
                            {city.name}, {city.state}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold">
                            Namaz Timings in {city.name}
                        </h1>

                        <div className="flex items-center justify-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{prayerTimes.date}</span>
                            </div>
                            {prayerTimes.hijriDate && (
                                <div className="flex items-center gap-2">
                                    <span>•</span>
                                    <span>{prayerTimes.hijriDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prayer Times Table */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                        <div className="bg-primary text-primary-foreground p-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Clock className="w-6 h-6" />
                                Today's Prayer Times
                            </h2>
                        </div>

                        <div className="divide-y divide-border">
                            {prayers.map((prayer) => (
                                <div
                                    key={prayer.name}
                                    className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{prayer.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold">{prayer.name}</h3>
                                            <p className="text-sm text-muted-foreground">{prayer.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-primary">
                                        {formatPrayerTime(prayer.time)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calculation Method Info */}
                    <div className="bg-muted/50 border border-border rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary mt-0.5" />
                            <div className="space-y-2">
                                <h3 className="font-semibold">Calculation Method</h3>
                                <p className="text-sm text-muted-foreground">
                                    Prayer times are calculated using the <strong>Hanafi</strong> method (University of Islamic Sciences, Karachi),
                                    which is commonly followed in India. Times are based on the geographical coordinates of {city.name}.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    What time is Fajr in {city.name} today?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Fajr prayer time in {city.name} today is <strong>{formatPrayerTime(prayerTimes.fajr)}</strong>.
                                    Fajr is the first prayer of the day, performed before sunrise.
                                </p>
                            </details>
                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    What time is Zuhar in {city.name} today?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Zuhar prayer time in {city.name} today is <strong>{formatPrayerTime(prayerTimes.zuhr)}</strong>.
                                    Zuhar is the second prayer of the day, zuhar end time is before Asr prayer time.
                                </p>
                            </details>
                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    What time is Asr in {city.name} today?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Asr prayer time in {city.name} today is <strong>{formatPrayerTime(prayerTimes.asr)}</strong>.
                                    Asr is the third prayer of the day, Asr end time is before Maghrib prayer time.
                                </p>
                            </details>
                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    What time is Maghrib in {city.name} today?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Maghrib prayer time in {city.name} today is <strong>{formatPrayerTime(prayerTimes.maghrib)}</strong>.
                                    Maghrib is the fourth prayer of the day, Maghrib end time is before Sunset.
                                </p>
                            </details>
                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    What time is Isha in {city.name} today?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Isha prayer time in {city.name} today is <strong>{formatPrayerTime(prayerTimes.isha)}</strong>.
                                    Isha is the fifth prayer of the day.
                                </p>
                            </details>


                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    How accurate are these prayer times?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Our prayer times are calculated using the Aladhan API with precise geographical coordinates
                                    for {city.name}. They follow the Hanafi calculation method and are updated daily.
                                </p>
                            </details>

                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    What is the difference between Asr timings in Hanafi and Shafi methods?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    The Hanafi method calculates Asr when the shadow of an object is twice its length plus the
                                    noon shadow, while the Shafi method uses once its length. This typically makes Hanafi Asr
                                    time slightly later than Shafi.
                                </p>
                            </details>

                            <details className="bg-card border border-border rounded-lg p-6 group">
                                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                    Do prayer times change daily?
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-muted-foreground">
                                    Yes, prayer times change slightly each day based on the sun's position. Our page is updated
                                    hourly to ensure you always have the most accurate timings for {city.name}.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
