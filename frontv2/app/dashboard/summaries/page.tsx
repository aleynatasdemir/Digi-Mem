"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Calendar, Image, Music, FileText, Video, Sparkles, Brain, Box, Settings } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { SettingsModal } from '@/components/settings-modal'

// Mock data - haftalık yükleme verileri
const weeklyData = [
  { day: "Pzt", uploads: 3 },
  { day: "Sal", uploads: 5 },
  { day: "Çar", uploads: 2 },
  { day: "Per", uploads: 4 },
  { day: "Cum", uploads: 7 },
  { day: "Cmt", uploads: 6 },
  { day: "Paz", uploads: 3 },
]

// Aylık trend verileri
const monthlyTrendData = [
  { week: "1. Hafta", uploads: 15 },
  { week: "2. Hafta", uploads: 22 },
  { week: "3. Hafta", uploads: 18 },
  { week: "4. Hafta", uploads: 30 },
]

// Format dağılımı verileri
const formatData = {
  photo: 45,
  video: 12,
  audio: 8,
  text: 23,
  music: 7,
}

export default function SummariesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly" | null>(null)
  const [selectedType, setSelectedType] = useState<"collage" | "stats" | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const totalWeeklyUploads = weeklyData.reduce((acc, day) => acc + day.uploads, 0)
  const weeklyAverage = (totalWeeklyUploads / 7).toFixed(1)
  const monthlyAverage = ((totalWeeklyUploads / 7) * 30).toFixed(0)

  const handlePeriodClick = (period: "weekly" | "monthly" | "yearly") => {
    setSelectedPeriod(period)
    setSelectedType(null)
  }

  const handleTypeClick = (type: "collage" | "stats") => {
    setSelectedType(type)
    // Burada gerçek özet oluşturma işlemi yapılacak
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
              <Button variant="ghost" className="gap-2">
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
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />

      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-balance">İstatistikler</h1>
          <p className="text-muted-foreground">Anılarınızın özeti ve istatistikleri</p>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Günlük Ortalama</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyAverage}</div>
              <p className="text-xs text-muted-foreground">anı / gün</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Haftalık Ortalama</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeeklyUploads}</div>
              <p className="text-xs text-muted-foreground">anı / hafta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aylık Ortalama</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyAverage}</div>
              <p className="text-xs text-muted-foreground">anı / ay</p>
            </CardContent>
          </Card>
        </div>

        {/* Haftalık Yükleme Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Yüklemeler</CardTitle>
            <CardDescription>Son 7 günün anı yükleme aktivitesi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="uploads" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aylık Trend Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Trend</CardTitle>
            <CardDescription>Haftalık bazda yükleme trendi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="uploads" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Format Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle>Format Dağılımı</CardTitle>
            <CardDescription>Yüklenen anıların format bazında dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-chart-1" />
                    <span>Fotoğraf</span>
                  </div>
                  <span className="font-medium">{formatData.photo}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-chart-1 rounded-full transition-all" 
                    style={{ width: `${(formatData.photo / 95) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-chart-2" />
                    <span>Video</span>
                  </div>
                  <span className="font-medium">{formatData.video}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-chart-2 rounded-full transition-all" 
                    style={{ width: `${(formatData.video / 95) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-chart-3" />
                    <span>Metin</span>
                  </div>
                  <span className="font-medium">{formatData.text}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-chart-3 rounded-full transition-all" 
                    style={{ width: `${(formatData.text / 95) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-chart-4" />
                    <span>Ses</span>
                  </div>
                  <span className="font-medium">{formatData.audio}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-chart-4 rounded-full transition-all" 
                    style={{ width: `${(formatData.audio / 95) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-chart-5" />
                    <span>Şarkı</span>
                  </div>
                  <span className="font-medium">{formatData.music}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-chart-5 rounded-full transition-all" 
                    style={{ width: `${(formatData.music / 95) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Özet Oluştur Bölümü */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Özet Oluştur</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              size="lg"
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handlePeriodClick("weekly")}
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-semibold">Haftalık Özet</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handlePeriodClick("monthly")}
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-semibold">Aylık Özet</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handlePeriodClick("yearly")}
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-semibold">Yıllık Özet</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Özet Tipi Seçim Modal */}
      <Dialog open={selectedPeriod !== null} onOpenChange={(open) => !open && setSelectedPeriod(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPeriod === "weekly" && "Haftalık Özet"}
              {selectedPeriod === "monthly" && "Aylık Özet"}
              {selectedPeriod === "yearly" && "Yıllık Özet"}
            </DialogTitle>
            <DialogDescription>
              Hangi tür özet oluşturmak istersiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              size="lg"
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handleTypeClick("collage")}
            >
              <Image className="h-6 w-6" />
              <span className="font-semibold">Kolaj Oluştur</span>
              <span className="text-xs text-muted-foreground">Anılarınızdan görsel kolaj</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handleTypeClick("stats")}
            >
              <BarChart className="h-6 w-6" />
              <span className="font-semibold">İstatistik Özeti</span>
              <span className="text-xs text-muted-foreground">Detaylı istatistik raporu</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Özet Oluşturma Onay Modal */}
      <Dialog open={selectedType !== null} onOpenChange={(open) => !open && setSelectedType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Özet Oluşturuluyor</DialogTitle>
            <DialogDescription>
              {selectedType === "collage" 
                ? "Anılarınızdan kolaj oluşturuluyor..." 
                : "İstatistik özeti hazırlanıyor..."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Volume2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}
