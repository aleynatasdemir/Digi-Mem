"use client"

import { Camera, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
        <Camera className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Henüz anı yok</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground text-balance">
        İlk anınızı ekleyerek başlayın. Fotoğraf, video, ses kaydı, metin notu veya şarkı ekleyebilirsiniz.
      </p>
      <Button onClick={onCreateNew} className="mt-6">
        <Plus className="mr-2 size-4" />
        Anı Ekle
      </Button>
    </div>
  )
}
