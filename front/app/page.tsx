"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { PhotoVideoModal } from "@/components/photo-video-modal"
import { VoiceModal } from "@/components/voice-modal"
import { TextModal } from "@/components/text-modal"
import { SongModal } from "@/components/song-modal"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [textModalOpen, setTextModalOpen] = useState(false)
  const [songModalOpen, setSongModalOpen] = useState(false)

  const { toast } = useToast()

  const handleSave = async (data: any) => {
    try {
      await api.createMemory(data)
      toast({
        title: "Başarılı",
        description: "Anı eklendi",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "İşlem başarısız",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Dijital Hafızanıza Hoş Geldiniz
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Özel anılarınızı dijital ortamda saklayın ve düzenleyin.
          </p>
        </div>

        <div className="mb-8 rounded-lg border bg-card p-8 shadow-sm">
          <h2 className="mb-6 text-center text-xl font-semibold">
            Fotoğraf, video, ses kaydı, metin notu veya şarkı ekleyebilirsiniz
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Photo Button */}
            <Button
              onClick={() => setPhotoModalOpen(true)}
              className="h-24 flex-col gap-2 bg-blue-500 text-base font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-blue-600"
              size="lg"
            >
              <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              <span>Fotoğraf</span>
            </Button>

            {/* Video Button */}
            <Button
              onClick={() => setVideoModalOpen(true)}
              className="h-24 flex-col gap-2 bg-purple-500 text-base font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-purple-600"
              size="lg"
            >
              <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Video</span>
            </Button>

            {/* Voice Button */}
            <Button
              onClick={() => setVoiceModalOpen(true)}
              className="h-24 flex-col gap-2 bg-orange-500 text-base font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-orange-600"
              size="lg"
            >
              <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span>Ses Kaydı</span>
            </Button>

            {/* Text Button */}
            <Button
              onClick={() => setTextModalOpen(true)}
              className="h-24 flex-col gap-2 bg-green-500 text-base font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-green-600"
              size="lg"
            >
              <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Metin Notu</span>
            </Button>

            {/* Song Button */}
            <Button
              onClick={() => setSongModalOpen(true)}
              className="h-24 flex-col gap-2 bg-pink-500 text-base font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-pink-600"
              size="lg"
            >
              <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span>Şarkı</span>
            </Button>
          </div>
        </div>
      </main>

      <PhotoVideoModal open={photoModalOpen} onOpenChange={setPhotoModalOpen} type="photo" onSave={handleSave} />
      <PhotoVideoModal open={videoModalOpen} onOpenChange={setVideoModalOpen} type="video" onSave={handleSave} />
      <VoiceModal open={voiceModalOpen} onOpenChange={setVoiceModalOpen} onSave={handleSave} />
      <TextModal open={textModalOpen} onOpenChange={setTextModalOpen} onSave={handleSave} />
      <SongModal open={songModalOpen} onOpenChange={setSongModalOpen} onSave={handleSave} />
    </div>
  )
}
