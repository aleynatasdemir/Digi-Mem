"use client"

import { Camera, Video, Mic, FileText, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddMemoryButtonsProps {
  onPhotoClick: () => void
  onVideoClick: () => void
  onVoiceClick: () => void
  onTextClick: () => void
  onSongClick: () => void
}

export function AddMemoryButtons({
  onPhotoClick,
  onVideoClick,
  onVoiceClick,
  onTextClick,
  onSongClick,
}: AddMemoryButtonsProps) {
  const buttons = [
    {
      icon: Camera,
      label: "Fotoğraf",
      onClick: onPhotoClick,
      className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    },
    {
      icon: Video,
      label: "Video",
      onClick: onVideoClick,
      className: "bg-purple-500 hover:bg-purple-600 text-white border-purple-600",
    },
    {
      icon: Mic,
      label: "Ses Kaydı",
      onClick: onVoiceClick,
      className: "bg-orange-500 hover:bg-orange-600 text-white border-orange-600",
    },
    {
      icon: FileText,
      label: "Metin Notu",
      onClick: onTextClick,
      className: "bg-green-500 hover:bg-green-600 text-white border-green-600",
    },
    {
      icon: Music,
      label: "Şarkı",
      onClick: onSongClick,
      className: "bg-pink-500 hover:bg-pink-600 text-white border-pink-600",
    },
  ]

  return (
    <div className="mb-8 rounded-lg border bg-card p-8 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-semibold">
        Fotoğraf, video, ses kaydı, metin notu veya şarkı ekleyebilirsiniz
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {buttons.map((button) => (
          <Button
            key={button.label}
            onClick={button.onClick}
            className={`h-24 flex-col gap-2 text-base font-medium shadow-md transition-all hover:scale-105 ${button.className}`}
            size="lg"
          >
            <button.icon className="size-8" />
            <span>{button.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
