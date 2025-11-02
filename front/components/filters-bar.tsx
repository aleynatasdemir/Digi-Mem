"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { MemoryType, ViewMode } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FiltersBarProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  selectedTypes: MemoryType[]
  onTypesChange: (types: MemoryType[]) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  search: string
  onSearchChange: (search: string) => void
  availableTags?: string[]
}

const memoryTypes: { value: MemoryType; label: string }[] = [
  { value: "photo", label: "Fotoğraf" },
  { value: "video", label: "Video" },
  { value: "voice", label: "Ses" },
  { value: "text", label: "Metin" },
  { value: "song", label: "Şarkı" },
]

export function FiltersBar({
  view,
  onViewChange,
  selectedTypes,
  onTypesChange,
  selectedTags,
  onTagsChange,
  search,
  onSearchChange,
  availableTags = [],
}: FiltersBarProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 400)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  const toggleType = (type: MemoryType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onTypesChange([])
    onTagsChange([])
    setLocalSearch("")
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedTags.length > 0 || search.length > 0

  return (
    <div className="sticky top-0 z-10 space-y-3 border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border bg-muted p-1">
          {(["day", "week", "month"] as ViewMode[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange(v)}
              className={cn("px-4", view === v && "bg-background shadow-sm")}
            >
              {v === "day" ? "Gün" : v === "week" ? "Hafta" : "Ay"}
            </Button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Tip {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              {memoryTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => toggleType(type.value)}
                  />
                  <Label htmlFor={`type-${type.value}`} className="flex-1 cursor-pointer text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {availableTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Etiket {selectedTags.length > 0 && `(${selectedTags.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="flex-1 cursor-pointer text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 size-4" />
            Temizle
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Anılarınızda arayın..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {(selectedTypes.length > 0 || selectedTags.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {memoryTypes.find((t) => t.value === type)?.label}
              <button onClick={() => toggleType(type)} className="ml-1 hover:text-destructive">
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button onClick={() => toggleTag(tag)} className="ml-1 hover:text-destructive">
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
