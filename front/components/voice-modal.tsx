"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface VoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => Promise<void>
}

export function VoiceModal({ open, onOpenChange, onSave }: VoiceModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
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
    if (!file) {
      toast({
        title: "Dosya seçilmedi",
        description: "Lütfen bir ses dosyası seçin",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const mockUrl = URL.createObjectURL(file)

      const data = {
        type: "voice",
        createdAt: new Date().toISOString(),
        title: title || undefined,
        tags: tags.length > 0 ? tags : undefined,
        media: { url: mockUrl, durationSec: 120 }, // Mock duration
      }

      await onSave(data)

      // Reset form
      setFile(null)
      setTitle("")
      setTags([])
      onOpenChange(false)
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sesli Günlük Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Ses Dosyası</Label>
            <div className="rounded-lg border-2 border-dashed p-6 text-center">
              <input type="file" id="voice-upload" className="hidden" accept="audio/*" onChange={handleFileChange} />
              <label htmlFor="voice-upload" className="cursor-pointer">
                <MicIcon className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Ses dosyası yükle</p>
                <p className="mt-1 text-xs text-muted-foreground">veya tarayıcıdan kaydet (yakında)</p>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Başlık (opsiyonel)</Label>
            <Input
              id="title"
              placeholder="Ses kaydı başlığı..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                      <XIcon className="size-3" />
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
      </DialogContent>
    </Dialog>
  )
}
