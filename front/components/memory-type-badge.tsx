import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, Mic, FileText, Music } from "lucide-react"
import type { MemoryType } from "@/lib/types"

interface MemoryTypeBadgeProps {
  type: MemoryType
}

const typeConfig: Record<MemoryType, { label: string; icon: React.ReactNode; className: string }> = {
  photo: {
    label: "Fotoğraf",
    icon: <Camera className="size-3" />,
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  video: {
    label: "Video",
    icon: <Video className="size-3" />,
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  voice: {
    label: "Ses",
    icon: <Mic className="size-3" />,
    className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
  text: {
    label: "Metin",
    icon: <FileText className="size-3" />,
    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  song: {
    label: "Şarkı",
    icon: <Music className="size-3" />,
    className: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
  },
}

export function MemoryTypeBadge({ type }: MemoryTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
}
