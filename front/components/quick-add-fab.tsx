"use client"

import { useState } from "react"
import { Plus, Camera, Video, Mic, FileText, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuickAddFabProps {
  onPhotoClick: () => void
  onVideoClick: () => void
  onVoiceClick: () => void
  onTextClick: () => void
  onSongClick: () => void
}

export function QuickAddFab({ onPhotoClick, onVideoClick, onVoiceClick, onTextClick, onSongClick }: QuickAddFabProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: Camera, label: "Fotoğraf", onClick: onPhotoClick, color: "bg-blue-500 hover:bg-blue-600" },
    { icon: Video, label: "Video", onClick: onVideoClick, color: "bg-purple-500 hover:bg-purple-600" },
    { icon: Mic, label: "Ses", onClick: onVoiceClick, color: "bg-orange-500 hover:bg-orange-600" },
    { icon: FileText, label: "Metin", onClick: onTextClick, color: "bg-green-500 hover:bg-green-600" },
    { icon: Music, label: "Şarkı", onClick: onSongClick, color: "bg-pink-500 hover:bg-pink-600" },
  ]

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col items-end gap-3">
        {isOpen &&
          actions.map((action, idx) => (
            <div
              key={idx}
              className="flex animate-in fade-in slide-in-from-bottom-2 items-center gap-3"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span className="rounded-md bg-popover px-3 py-1.5 text-sm font-medium text-popover-foreground shadow-md">
                {action.label}
              </span>
              <Button
                size="icon"
                className={cn("size-12 rounded-full shadow-lg", action.color)}
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
              >
                <action.icon className="size-5" />
              </Button>
            </div>
          ))}

        <Button
          size="icon"
          className={cn(
            "size-14 rounded-full shadow-lg transition-transform",
            isOpen ? "rotate-45 bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className="size-6" />
        </Button>
      </div>
    </div>
  )
}
