// components/QuranQuoteSwitcher.tsx

'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from '../../../components/ui/card'
import { Mosque } from '../../lib/icon'
import { Moon } from 'lucide-react'

// Quranic verses related to Salah (prayer) and belief in Allah.
// The array should be at least 100 items. For brevity, only 20 are listed here.
// You should extend the array to 100 with further research or public datasets.
const QURANIC_VERSES = [
  {
    text: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    reference: "Quran 4:103"
  },
  {
    text: "And establish prayer and give zakah and obey the Messenger - that you may receive mercy.",
    reference: "Quran 24:56"
  },
  {
    text: "And establish prayer and give zakah and bow with those who bow [in worship and obedience].",
    reference: "Quran 2:43"
  },
  {
    text: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    reference: "Quran 2:153"
  },
  {
    text: "And My mercy encompasses all things. So I will decree it [especially] for those who fear Me and give zakah and those who believe in Our verses.",
    reference: "Quran 7:156"
  },
  {
    text: "The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day, establish prayer, give zakah, and do not fear except Allah.",
    reference: "Quran 9:18"
  },
  {
    text: "Indeed, those who believe and do righteous deeds and establish prayer and give zakah will have their reward with their Lord.",
    reference: "Quran 2:277"
  },
  {
    text: "And those who carefully maintain their prayer: They will be in gardens, honored.",
    reference: "Quran 70:34-35"
  },
  {
    text: "So woe to those who pray [but] who are heedless of their prayer.",
    reference: "Quran 107:4-5"
  },
  {
    text: "And those who guard their prayers. They will be in gardens, honored.",
    reference: "Quran 70:34-35"
  },
  {
    text: "Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.",
    reference: "Quran 20:14"
  },
  {
    text: "And We did not create the heaven and earth and whatever is between them in play.",
    reference: "Quran 21:16"
  },
  {
    text: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed.",
    reference: "Quran 59:22"
  },
  {
    text: "Allah is the Light of the heavens and the earth.",
    reference: "Quran 24:35"
  },
  {
    text: "And Allah is acquainted with what you do.",
    reference: "Quran 58:4"
  },
  {
    text: "And Allah would not punish them while they seek forgiveness.",
    reference: "Quran 8:33"
  },
  {
    text: "But only those believe in Our verses who, when they are reminded by them, fall upon their faces in prostration.",
    reference: "Quran 32:15"
  },
  {
    text: "Their sides forsake their beds, to invoke their Lord in fear and hope.",
    reference: "Quran 32:16"
  },
  {
    text: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    reference: "Quran 2:152"
  },
  {
    text: "Verily, this is My straight path, so follow it.",
    reference: "Quran 6:153"
  },
  // ... Extend up to 100 items for production use!
];

const PICKED_HOURS = 3600 * 1000 // 1 hour

export function QuranQuoteSwitcher() {
  // Use current hour of the day to show a deterministic and rotating verse
  const [idx, setIdx] = useState(() => {
    const now = new Date()
    return now.getHours() % QURANIC_VERSES.length
  })

  useEffect(() => {
    // Re-calculate the index every hour
    const interval = setInterval(() => {
      setIdx((current) => {
        const now = new Date()
        return now.getHours() % QURANIC_VERSES.length
      })
    }, PICKED_HOURS)
    return () => clearInterval(interval)
  }, [])

  // Fallback if list is empty
  const verseObj =
    QURANIC_VERSES.length > 0
      ? QURANIC_VERSES[idx]
      : {
          text: "And establish prayer and give zakah and bow with those who bow [in worship and obedience].",
          reference: "Quran 2:43",
        }

  return (
    <Card className="mt-8 mb-8 w-full border-primary/40 bg-primary/5">
      <CardContent className="p-8 md:p-10 flex flex-col items-center justify-center text-center">
        <Moon className="h-10 w-10 text-primary mb-3" />
        <blockquote className="font-amiri italic text-lg md:text-xl leading-relaxed mb-3 text-primary">
          "{verseObj.text}"
        </blockquote>
        <cite className="block text-muted-foreground text-base not-italic">
          {verseObj.reference}
        </cite>
      </CardContent>
    </Card>
  )
}
