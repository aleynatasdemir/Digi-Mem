'use client'

import { useState, useEffect } from 'react'
import { Brain, Box, FileText, Settings, Image, Music, Mic, Type, Video, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SettingsModal } from '@/components/settings-modal'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

type MediaType = 'photo' | 'audio' | 'text' | 'music' | 'video' | null

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedMedia, setSelectedMedia] = useState<MediaType>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleMediaClick = (type: MediaType) => {
    setSelectedMedia(type)
    setSelectedDate(new Date().toISOString().split('T')[0])
    setTitle('')
    setTextContent('')
    setSelectedFile(null)
  }

  const handleClose = () => {
    setSelectedMedia(null)
    setSelectedDate('')
    setTitle('')
    setTextContent('')
    setSelectedFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMedia) return

    setIsUploading(true)

    try {
      if (selectedMedia === 'text') {
        // Text memory
        if (!textContent.trim()) {
          toast({
            variant: 'destructive',
            title: 'Metin boş',
            description: 'Lütfen bir metin girin.',
          })
          return
        }

        await apiService.createMemory({
          type: selectedMedia,
          title: title || undefined,
          content: textContent,
          date: selectedDate,
        })
      } else {
        // File upload
        if (!selectedFile) {
          toast({
            variant: 'destructive',
            title: 'Dosya seçilmedi',
            description: 'Lütfen bir dosya seçin.',
          })
          return
        }

        const uploadRes = await apiService.uploadFile(selectedFile, selectedMedia, selectedDate, title || undefined)

        // Create memory record linking uploaded file
        await apiService.createMemory({
          type: selectedMedia,
          title: title || undefined,
          content: undefined,
          date: selectedDate,
          // backend expects FileUrl/MimeType fields; map using frontend keys
          fileUrl: uploadRes.fileUrl,
          thumbnailUrl: uploadRes.thumbnailUrl,
          mimeType: uploadRes.mimeType,
          fileSize: uploadRes.fileSize
        } as any)
      }

      toast({
        title: 'Anı eklendi!',
        description: 'Anınız başarıyla kaydedildi.',
      })

      handleClose()
      // Redirect to memory box to view the new memory
      router.push('/dashboard/box')
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        variant: 'destructive',
        title: 'Yükleme hatası',
        description: 'Anı eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
      })
    } finally {
      setIsUploading(false)
    }
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Anı Ekle!</h1>
            <p className="text-muted-foreground text-balance leading-relaxed">
              Anılarınızı fotoğraf, video, ses kaydı, metin veya şarkı olarak kaydedin
            </p>
          </div>

          {/* Media Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => handleMediaClick('photo')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Image className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-foreground">Fotoğraf</span>
              </div>
            </button>

            <button
              onClick={() => handleMediaClick('video')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Video className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-foreground">Video</span>
              </div>
            </button>

            <button
              onClick={() => handleMediaClick('audio')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Mic className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-foreground">Ses</span>
              </div>
            </button>

            <button
              onClick={() => handleMediaClick('text')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Type className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-foreground">Metin</span>
              </div>
            </button>

            <button
              onClick={() => handleMediaClick('music')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Music className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-foreground">Şarkı</span>
              </div>
            </button>
          </div>

          {/* Upload Modal */}
          {selectedMedia && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="relative w-full max-w-md mx-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {selectedMedia === 'photo' && 'Fotoğraf Yükle'}
                      {selectedMedia === 'video' && 'Video Yükle'}
                      {selectedMedia === 'audio' && 'Ses Kaydı Yükle'}
                      {selectedMedia === 'text' && 'Metin Ekle'}
                      {selectedMedia === 'music' && 'Şarkı Yükle'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="h-8 w-8"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File Upload */}
                    {selectedMedia !== 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor="file">
                          {selectedMedia === 'photo' && 'Fotoğraf Seç'}
                          {selectedMedia === 'video' && 'Video Dosyası Seç'}
                          {selectedMedia === 'audio' && 'Ses Dosyası Seç'}
                          {selectedMedia === 'music' && 'Şarkı Dosyası Seç'}
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          accept={
                            selectedMedia === 'photo'
                              ? 'image/*'
                              : selectedMedia === 'video'
                              ? 'video/*'
                              : selectedMedia === 'audio'
                              ? 'audio/*'
                              : selectedMedia === 'music'
                              ? 'audio/*'
                              : undefined
                          }
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="h-11"
                          disabled={isUploading}
                          required
                        />
                      </div>
                    )}

                    {/* Text Input */}
                    {selectedMedia === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor="text">Metniniz</Label>
                        <Textarea
                          id="text"
                          placeholder="Anınızı buraya yazın..."
                          className="min-h-[120px] resize-none"
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          disabled={isUploading}
                          required
                        />
                      </div>
                    )}

                    {/* Optional Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Başlık (İsteğe Bağlı)</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Anınıza bir başlık verin"
                        className="h-11"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isUploading}
                      />
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label htmlFor="date">Tarih</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-11"
                        disabled={isUploading}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-medium"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Ekleniyor...
                        </>
                      ) : (
                        'Anı Ekle'
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
