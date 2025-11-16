'use client'

import { useState, useEffect } from 'react'
import { Brain, Box, FileText, Settings, ChevronLeft, ChevronRight, X, ImageIcon, Video, Music, Mic, Type, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { apiService } from '@/lib/api'
import { Memory as MemoryType } from '@/lib/types'

interface MemoriesByDate {
  [key: string]: MemoryType[]
}

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export default function BoxPage() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState<{ memories: MemoryType[]; date: string } | null>(null)
  const [memories, setMemories] = useState<MemoriesByDate>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
      return
    }

    loadMemories()
  }, [router])

  const loadMemories = async () => {
    setIsLoading(true)
    try {
      const response = await apiService.getMemories()
      
      // Group memories by memoryDate (user-selected date)
      const grouped: MemoriesByDate = {}
      response.memories.forEach((memory) => {
        const date = memory.memoryDate.split('T')[0] // YYYY-MM-DD
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(memory)
      })
      
      setMemories(grouped)
    } catch (error) {
      console.error('Failed to load memories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderCalendar = (year: number, month: number) => {
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
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayMemories = memories[dateKey] || []
      const hasMemory = dayMemories.length > 0
      const primaryMemory = dayMemories[0]

      days.push(
        <button
          key={day}
          onClick={() => hasMemory && setSelectedDay({ memories: dayMemories, date: dateKey })}
          className={`
            group relative aspect-square overflow-hidden rounded-lg border-2 transition-all
            ${hasMemory 
              ? 'border-primary bg-primary/5 hover:border-primary hover:shadow-lg hover:shadow-primary/20 cursor-pointer' 
              : 'border-border bg-card/50 cursor-default'
            }
          `}
        >
          {/* Background Image for photo/video */}
          {primaryMemory && (primaryMemory.type === 'photo' || primaryMemory.type === 'video') && primaryMemory.filePath && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ backgroundImage: `url(${apiService.getFileUrl(primaryMemory.filePath)})` }}
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
          {primaryMemory && (
            <div className="absolute inset-0 flex items-center justify-center">
              {primaryMemory.type !== 'photo' && primaryMemory.type !== 'video' && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90">
                  {primaryMemory.type === 'text' && <Type className="h-5 w-5 text-primary" />}
                  {primaryMemory.type === 'audio' && <Mic className="h-5 w-5 text-primary" />}
                  {primaryMemory.type === 'music' && <Music className="h-5 w-5 text-primary" />}
                </div>
              )}
            </div>
          )}

          {/* Additional Media Indicators */}
          {dayMemories.length > 1 && (
            <div className="absolute bottom-1 right-1 flex gap-1">
              {dayMemories.slice(1, 4).map((mem, idx) => (
                <div key={idx} className="flex h-5 w-5 items-center justify-center rounded-full bg-background/90">
                  {mem.type === 'photo' && <ImageIcon className="h-3 w-3 text-primary" />}
                  {mem.type === 'video' && <Video className="h-3 w-3 text-primary" />}
                  {mem.type === 'text' && <Type className="h-3 w-3 text-primary" />}
                  {mem.type === 'audio' && <Mic className="h-3 w-3 text-primary" />}
                  {mem.type === 'music' && <Music className="h-3 w-3 text-primary" />}
                </div>
              ))}
              {dayMemories.length > 4 && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-[10px] font-bold text-primary">
                  +{dayMemories.length - 3}
                </div>
              )}
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Month */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{MONTHS[currentMonth - 1]} {currentYear}</h2>
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
                {renderCalendar(currentYear, currentMonth)}
              </div>
            </div>

            {/* Previous Month */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">
                  {MONTHS[currentMonth === 1 ? 11 : currentMonth - 2]} {currentMonth === 1 ? currentYear - 1 : currentYear}
                </h2>
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
                {renderCalendar(
                  currentMonth === 1 ? currentYear - 1 : currentYear, 
                  currentMonth === 1 ? 12 : currentMonth - 1
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Memory Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl">
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {new Date(selectedDay.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                {selectedDay.memories.map((memory) => (
                  <div key={memory.id} className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        {memory.type === 'photo' && <ImageIcon className="h-5 w-5 text-primary" />}
                        {memory.type === 'video' && <Video className="h-5 w-5 text-primary" />}
                        {memory.type === 'text' && <Type className="h-5 w-5 text-primary" />}
                        {memory.type === 'audio' && <Mic className="h-5 w-5 text-primary" />}
                        {memory.type === 'music' && <Music className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        {memory.title && (
                          <h3 className="font-semibold">{memory.title}</h3>
                        )}
                        {memory.type === 'text' && memory.content && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{memory.content}</p>
                        )}
                        {(memory.type === 'photo' || memory.type === 'video') && memory.filePath && (
                          <div className="rounded-lg overflow-hidden">
                            {memory.type === 'photo' ? (
                              <img 
                                src={apiService.getFileUrl(memory.filePath)} 
                                alt={memory.title || 'Memory'}
                                className="w-full h-auto"
                              />
                            ) : (
                              <video 
                                src={apiService.getFileUrl(memory.filePath)} 
                                controls
                                className="w-full h-auto"
                              />
                            )}
                          </div>
                        )}
                        {(memory.type === 'audio' || memory.type === 'music') && memory.filePath && (
                          <audio 
                            src={apiService.getFileUrl(memory.filePath)} 
                            controls
                            className="w-full"
                          />
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(memory.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
