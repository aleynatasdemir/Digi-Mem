"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Entry } from "@/lib/api"

interface EntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: Entry | null
  onSave: (data: { title: string; note: string | null }) => Promise<void>
}

export function EntryDialog({ open, onOpenChange, entry, onSave }: EntryDialogProps) {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ title?: string }>({})

  useEffect(() => {
    if (entry) {
      setTitle(entry.title)
      setNote(entry.note || "")
    } else {
      setTitle("")
      setNote("")
    }
    setErrors({})
  }, [entry, open])

  const validate = () => {
    const newErrors: { title?: string } = {}

    if (!title.trim()) {
      newErrors.title = "Başlık zorunludur"
    } else if (title.length > 120) {
      newErrors.title = "Başlık en fazla 120 karakter olabilir"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsLoading(true)
    try {
      await onSave({
        title: title.trim(),
        note: note.trim() || null,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error saving entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Entry Düzenle" : "Yeni Entry"}</DialogTitle>
          <DialogDescription>
            {entry ? "Entry bilgilerini güncelleyin." : "Yeni bir entry oluşturun."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry başlığı"
              maxLength={120}
              disabled={isLoading}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            <p className="text-xs text-muted-foreground">{title.length}/120 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Not</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notlarınızı buraya yazın..."
              rows={5}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
