"use client"

import { formatRelativeDate, formatDuration } from "@/lib/format"
import { MemoryTypeBadge } from "@/components/memory-type-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical, Play, Pause } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { MemoryItem } from "@/lib/types"
import { useState } from "react"

interface MemoryCardProps {
  memory: MemoryItem
  onView: (memory: MemoryItem) => void
  onEdit: (memory: MemoryItem) => void
  onDelete: (memory: MemoryItem) => void
}

export function MemoryCard({ memory, onView, onEdit, onDelete }: MemoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <MemoryTypeBadge type={memory.type} />
            {memory.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(memory)}>Görüntüle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(memory)}>Düzenle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(memory)} className="text-destructive">
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {memory.type === "photo" && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            {memory.media.slice(0, 4).map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-md bg-muted"
                onClick={() => onView(memory)}
              >
                <img src={photo.url || "/placeholder.svg"} alt="" className="size-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {memory.type === "video" && (
          <div
            className="relative mb-3 aspect-video cursor-pointer overflow-hidden rounded-md bg-muted"
            onClick={() => onView(memory)}
          >
            {memory.media.thumbUrl ? (
              <img src={memory.media.thumbUrl || "/placeholder.svg"} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Play className="size-12 text-muted-foreground" />
              </div>
            )}
            {memory.media.durationSec && (
              <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                {formatDuration(memory.media.durationSec)}
              </div>
            )}
          </div>
        )}

        {memory.type === "voice" && (
          <div className="mb-3 flex items-center gap-3 rounded-md bg-muted p-3">
            <Button variant="ghost" size="icon" className="size-10 shrink-0" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
            <div className="min-w-0 flex-1">
              <div className="h-1 rounded-full bg-primary/20">
                <div className="h-full w-1/3 rounded-full bg-primary" />
              </div>
              {memory.media.durationSec && (
                <p className="mt-1 text-xs text-muted-foreground">{formatDuration(memory.media.durationSec)}</p>
              )}
            </div>
            {memory.sentiment && (
              <Badge
                variant="outline"
                className={
                  memory.sentiment === "pos"
                    ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                    : memory.sentiment === "neg"
                      ? "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
                      : "border-gray-500/20 bg-gray-500/10 text-gray-700 dark:text-gray-400"
                }
              >
                {memory.sentiment === "pos" ? "Pozitif" : memory.sentiment === "neg" ? "Negatif" : "Nötr"}
              </Badge>
            )}
          </div>
        )}

        {memory.type === "song" && (
          <div className="mb-3 flex items-center gap-3 rounded-md bg-muted p-3">
            {memory.song.albumCoverUrl ? (
              <img
                src={memory.song.albumCoverUrl || "/placeholder.svg"}
                alt=""
                className="size-12 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded bg-primary/10">
                <Play className="size-6 text-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{memory.song.title}</p>
              <p className="truncate text-sm text-muted-foreground">{memory.song.artist}</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {memory.title && <h3 className="font-medium text-balance">{memory.title}</h3>}
          {memory.description && <p className="line-clamp-2 text-sm text-muted-foreground">{memory.description}</p>}
          {memory.type === "text" && <p className="line-clamp-3 text-sm">{memory.content}</p>}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="mt-3 text-xs text-muted-foreground">{formatRelativeDate(memory.createdAt)}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{new Date(memory.createdAt).toLocaleString("tr-TR")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
