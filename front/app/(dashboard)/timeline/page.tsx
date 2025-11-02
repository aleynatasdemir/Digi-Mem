"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { FiltersBar } from "@/components/filters-bar"
import { MemoryCard } from "@/components/memory-card"
import { EmptyState } from "@/components/empty-state"
import { PhotoVideoModal } from "@/components/photo-video-modal"
import { VoiceModal } from "@/components/voice-modal"
import { TextModal } from "@/components/text-modal"
import { SongModal } from "@/components/song-modal"
import { formatDate, formatDateShort } from "@/lib/format"
import type { MemoryItem, MemoryType, ViewMode } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function TimelinePage() {
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [view, setView] = useState<ViewMode>("day")
  const [selectedTypes, setSelectedTypes] = useState<MemoryType[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [textModalOpen, setTextModalOpen] = useState(false)
  const [songModalOpen, setSongModalOpen] = useState(false)

  const { toast } = useToast()

  const fetchMemories = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.getMemories({
        view,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        q: search || undefined,
        page,
        pageSize,
      })
      setMemories(response.items)
      setTotal(response.total)
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Veriler yüklenemedi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [view, selectedTypes, selectedTags, search, page, pageSize, toast])

  useEffect(() => {
    fetchMemories()
  }, [fetchMemories])

  const handleSave = async (data: any) => {
    try {
      await api.createMemory(data)
      toast({
        title: "Başarılı",
        description: "Anı eklendi",
      })
      fetchMemories()
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "İşlem başarısız",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDelete = async (memory: MemoryItem) => {
    if (!confirm("Bu anıyı silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      await api.deleteMemory(memory.id)
      toast({
        title: "Başarılı",
        description: "Anı silindi",
      })
      fetchMemories()
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Silme başarısız",
        variant: "destructive",
      })
    }
  }

  // Group memories by date based on view mode
  const groupedMemories = memories.reduce(
    (acc, memory) => {
      const date = new Date(memory.createdAt)
      let key: string

      if (view === "day") {
        key = date.toISOString().split("T")[0]
      } else if (view === "week") {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split("T")[0]
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      }

      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(memory)
      return acc
    },
    {} as Record<string, MemoryItem[]>,
  )

  const sortedGroups = Object.entries(groupedMemories).sort(([a], [b]) => b.localeCompare(a))

  // Get all unique tags for filter
  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags || [])))

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <FiltersBar
        view={view}
        onViewChange={setView}
        selectedTypes={selectedTypes}
        onTypesChange={setSelectedTypes}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        search={search}
        onSearchChange={setSearch}
        availableTags={allTags}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        ) : memories.length === 0 ? (
          <EmptyState onCreateNew={() => setPhotoModalOpen(true)} />
        ) : (
          <>
            <div className="space-y-8">
              {sortedGroups.map(([dateKey, items]) => (
                <div key={dateKey}>
                  <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                    {view === "day" && formatDate(dateKey)}
                    {view === "week" && `${formatDateShort(dateKey)} haftası`}
                    {view === "month" &&
                      new Date(dateKey).toLocaleDateString("tr-TR", { year: "numeric", month: "long" })}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {items.map((memory) => (
                      <MemoryCard
                        key={memory.id}
                        memory={memory}
                        onView={() => {}}
                        onEdit={() => {}}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Sayfa {page} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <PhotoVideoModal open={photoModalOpen} onOpenChange={setPhotoModalOpen} type="photo" onSave={handleSave} />
      <PhotoVideoModal open={videoModalOpen} onOpenChange={setVideoModalOpen} type="video" onSave={handleSave} />
      <VoiceModal open={voiceModalOpen} onOpenChange={setVoiceModalOpen} onSave={handleSave} />
      <TextModal open={textModalOpen} onOpenChange={setTextModalOpen} onSave={handleSave} />
      <SongModal open={songModalOpen} onOpenChange={setSongModalOpen} onSave={handleSave} />
    </div>
  )
}
