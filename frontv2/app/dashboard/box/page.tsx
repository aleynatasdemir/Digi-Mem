'use client'

import { useState } from 'react'
import { Brain, Box, FileText, Settings, ChevronLeft, ChevronRight, X, ImageIcon, Video, Music, Mic, Type } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock data for demonstration
const mockMemories = {
  '2025-11': {
    1: { type: 'photo', image: '/autumn-nature.jpg' },
    3: { type: 'video', image: '/family-gathering.png' },
    5: { type: 'text' },
    7: { type: 'photo', image: '/sunset-beach-tranquil.png' },
    10: { type: 'music' },
    12: { type: 'photo', image: '/festive-birthday-cake.png', additional: ['video', 'text'] },
    15: { type: 'audio' },
    18: { type: 'photo', image: '/majestic-mountain-vista.png' },
    20: { type: 'video', image: '/vibrant-concert-night.png' },
    22: { type: 'text' },
    25: { type: 'photo', image: '/christmas-lights.png' },
    28: { type: 'music' },
  },
  '2025-10': {
    2: { type: 'photo', image: '/fall-leaves.jpg' },
    5: { type: 'video', image: '/winding-forest-trail.png' },
    8: { type: 'text' },
    12: { type: 'photo', image: '/coffee-morning.png' },
    15: { type: 'audio' },
    18: { type: 'photo', image: '/vibrant-city-skyline.png', additional: ['music'] },
    21: { type: 'music' },
    25: { type: 'photo', image: '/rainy-city-street.png' },
    29: { type: 'video', image: '/halloween-party.png' },
    31: { type: 'photo', image: '/creative-halloween-costume.png' },
  },
}

type MemoryType = 'photo' | 'video' | 'text' | 'audio' | 'music'

interface Memory {
  type: MemoryType
  image?: string
  additional?: MemoryType[]
}

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export default function BoxPage() {
  const [selectedDay, setSelectedDay] = useState<{ month: string; day: number } | null>(null)

  const renderCalendar = (year: number, month: number) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert to Mon=0, Sun=6

    const days = []
    
    // Empty cells before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const memory = mockMemories[monthKey]?.[day] as Memory | undefined
      const hasMemory = !!memory

      days.push(
        <button
          key={day}
          onClick={() => hasMemory && setSelectedDay({ month: monthKey, day })}
          className={`
            group relative aspect-square overflow-hidden rounded-lg border-2 transition-all
            ${hasMemory 
              ? 'border-primary bg-primary/5 hover:border-primary hover:shadow-lg hover:shadow-primary/20 cursor-pointer' 
              : 'border-border bg-card/50 cursor-default'
            }
          `}
        >
          {/* Background Image for photo/video */}
          {memory?.image && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ backgroundImage: `url(${memory.image})` }}
            />
          )}

          {/* Day Number */}
          <div className={`
            absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded text-xs font-bold
            ${hasMemory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {day}
          </div>

          {/* Media Type Icons */}
          {memory && (
            <div className="absolute inset-0 flex items-center justify-center">
              {!memory.image && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90">
                  {memory.type === 'text' && <Type className="h-5 w-5 text-primary" />}
                  {memory.type === 'audio' && <Mic className="h-5 w-5 text-primary" />}
                  {memory.type === 'music' && <Music className="h-5 w-5 text-primary" />}
                </div>
              )}
            </div>
          )}

          {/* Additional Media Indicators */}
          {memory?.additional && (
            <div className="absolute bottom-1 right-1 flex gap-1">
              {memory.additional.map((type, idx) => (
                <div key={idx} className="flex h-5 w-5 items-center justify-center rounded-full bg-background/90">
                  {type === 'video' && <Video className="h-3 w-3 text-primary" />}
                  {type === 'text' && <Type className="h-3 w-3 text-primary" />}
                  {type === 'music' && <Music className="h-3 w-3 text-primary" />}
                </div>
              ))}
            </div>
          )}
        </button>
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-foreground">Dijital Hafıza</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard/box">
              <Button variant="ghost" className="gap-2 bg-accent">
                <Box className="h-4 w-4" />
                Anı Kutusu
              </Button>
            </Link>
            <Link href="/dashboard/summaries">
              <Button variant="ghost" className="gap-2">
                <FileText className="h-4 w-4" />
                Özetler
              </Button>
            </Link>
          </nav>

          {/* Right: Settings & Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Calendar */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-8">
          {/* November 2025 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Kasım 2025</h2>
            </div>
            
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar(2025, 11)}
            </div>
          </div>

          {/* October 2025 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Ekim 2025</h2>
            </div>
            
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar(2025, 10)}
            </div>
          </div>
        </div>
      </main>

      {/* Memory Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl">
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedDay.day} {MONTHS[parseInt(selectedDay.month.split('-')[1]) - 1]} {selectedDay.month.split('-')[0]}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDay(null)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                  <p className="text-muted-foreground">Anı içeriği burada görüntülenecek</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tip: {mockMemories[selectedDay.month]?.[selectedDay.day]?.type}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
