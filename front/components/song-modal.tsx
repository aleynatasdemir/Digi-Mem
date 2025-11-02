"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music, Search, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface SongModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => Promise<void>
}

export function SongModal({ open, onOpenChange, onSave }: SongModalProps) {
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [url, setUrl] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSpotify, setIsCheckingSpotify] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      checkSpotifyStatus()
    }
  }, [open])

  const checkSpotifyStatus = async () => {
    setIsCheckingSpotify(true)
    try {
      const status = await api.getSpotifyStatus()
      setSpotifyConnected(status.connected)
    } catch (error) {
      console.error("Failed to check Spotify status:", error)
    } finally {
      setIsCheckingSpotify(false)
    }
  }

  const handleSpotifyConnect = () => {
    api.authorizeSpotify()
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!songTitle.trim() || !artist.trim()) {
      toast({
        title: "Eksik bilgi",
        description: "Şarkı adı ve sanatçı zorunludur",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const data = {
        type: "song",
        createdAt: new Date().toISOString(),
        tags: tags.length > 0 ? tags : undefined,
        song: {
          title: songTitle,
          artist,
          spotifyUrl: url || undefined,
          albumCoverUrl: "/abstract-soundscape.png",
        },
      }

      await onSave(data)

      // Reset form
      setSearchQuery("")
      setSongTitle("")
      setArtist("")
      setUrl("")
      setTags([])
      onOpenChange(false)
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSpotify) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">Kontrol ediliyor...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Şarkı Ekle</DialogTitle>
        </DialogHeader>

        {!spotifyConnected ? (
          <div className="space-y-4 py-4">
            <Alert>
              <Music className="size-4" />
              <AlertDescription>Spotify'dan şarkı eklemek için hesabınızı bağlamanız gerekiyor.</AlertDescription>
            </Alert>
            <Button onClick={handleSpotifyConnect} className="w-full">
              <Music className="mr-2 size-4" />
              Spotify'a Bağlan
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Spotify'da Ara</Label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Şarkı veya sanatçı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">Arama sonuçları yakında gelecek (mock)</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">veya manuel ekle</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="songTitle">
                Şarkı Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="songTitle"
                placeholder="Şarkı adı..."
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">
                Sanatçı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="artist"
                placeholder="Sanatçı adı..."
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL (opsiyonel)</Label>
              <Input
                id="url"
                placeholder="https://open.spotify.com/track/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiketler</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Etiket ekle..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Ekle
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
