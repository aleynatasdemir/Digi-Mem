"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TextModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => Promise<void>
}

export function TextModal({ open, onOpenChange, onSave }: TextModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ title?: string }>({})
  const { toast } = useToast()

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

    // Validation
    const newErrors: { title?: string } = {}
    if (!title.trim()) {
      newErrors.title = "Başlık zorunludur"
    } else if (title.length > 120) {
      newErrors.title = "Başlık maksimum 120 karakter olabilir"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const data = {
        type: "text",
        createdAt: new Date().toISOString(),
        title,
        content,
        tags: tags.length > 0 ? tags : undefined,
      }

      await onSave(data)

      // Reset form
      setTitle("")
      setContent("")
      setTags([])
      setErrors({})
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
          <DialogTitle>Metin Notu Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Not başlığı..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrors({})
              }}
              maxLength={120}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            <p className="text-xs text-muted-foreground">{title.length}/120 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Not</Label>
            <Textarea
              id="content"
              placeholder="Notunuzu buraya yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
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
      </DialogContent>
    </Dialog>
  )
}
