"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

interface PhotoVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "photo" | "video"
  onSave: (data: any) => Promise<void>
}

export function PhotoVideoModal({ open, onOpenChange, type, onSave }: PhotoVideoModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16))
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const maxSize = type === "photo" ? 15 : 100 // MB
  const acceptedTypes = type === "photo" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter((file) => {
      const sizeMB = file.size / 1024 / 1024
      if (sizeMB > maxSize) {
        toast({
          title: "Dosya çok büyük",
          description: `${file.name} dosyası ${maxSize}MB'dan büyük`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    if (type === "photo") {
      setFiles([...files, ...validFiles])
    } else {
      setFiles(validFiles.slice(0, 1))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
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
    if (files.length === 0) {
      toast({
        title: "Dosya seçilmedi",
        description: `Lütfen en az bir ${type === "photo" ? "fotoğraf" : "video"} seçin`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Mock: In real app, upload files first and get URLs
      const mockUrls = files.map((file) => URL.createObjectURL(file))

      const data = {
        type,
        createdAt: new Date(date).toISOString(),
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
        media: type === "photo" ? mockUrls.map((url) => ({ url })) : { url: mockUrls[0], thumbUrl: mockUrls[0] },
      }

      await onSave(data)

      // Reset form
      setFiles([])
      setDate(new Date().toISOString().slice(0, 16))
      setTags([])
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{type === "photo" ? "Fotoğraf Ekle" : "Video Ekle"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Dosyalar</Label>
            <div className="rounded-lg border-2 border-dashed p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept={acceptedTypes}
                multiple={type === "photo"}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <UploadIcon className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">{type === "photo" ? "Fotoğraf yükle" : "Video yükle"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Maksimum {maxSize}MB {type === "photo" && "/ öğe"}
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {files.map((file, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
                    {type === "photo" ? (
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <ImageIcon className="size-8 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XIcon className="size-3 text-destructive-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tarih</Label>
            <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
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

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama (opsiyonel)</Label>
            <Textarea
              id="description"
              placeholder="Bu anı hakkında bir şeyler yazın..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
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
