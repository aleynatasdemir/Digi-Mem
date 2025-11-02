// TypeScript types for Personal Digital Memory app

export type MemoryType = "photo" | "video" | "voice" | "text" | "song"

export type MemoryBase = {
  id: string
  type: MemoryType
  createdAt: string // ISO
  title?: string
  description?: string
  tags?: string[]
  isPublic?: boolean
}

export type PhotoMemory = MemoryBase & {
  type: "photo"
  media: { url: string; width?: number; height?: number }[]
}

export type VideoMemory = MemoryBase & {
  type: "video"
  media: { url: string; durationSec?: number; thumbUrl?: string }
}

export type VoiceMemory = MemoryBase & {
  type: "voice"
  media: { url: string; durationSec?: number }
  transcript?: string
  sentiment?: "pos" | "neu" | "neg"
}

export type TextMemory = MemoryBase & {
  type: "text"
  content: string
}

export type SongMemory = MemoryBase & {
  type: "song"
  song: {
    title: string
    artist: string
    spotifyUrl?: string
    albumCoverUrl?: string
  }
}

export type MemoryItem = PhotoMemory | VideoMemory | VoiceMemory | TextMemory | SongMemory

export type ViewMode = "day" | "week" | "month"

export type SummaryGranularity = "week" | "month"

export interface MemoriesResponse {
  items: MemoryItem[]
  page: number
  pageSize: number
  total: number
}

export interface SummaryBucket {
  date: string
  counts: Partial<Record<MemoryType, number>>
}

export interface SummaryResponse {
  buckets: SummaryBucket[]
  topTags: { tag: string; count: number }[]
  topTypes: { type: MemoryType; count: number }[]
  mostActiveDay: string
}

export interface SpotifyStatus {
  connected: boolean
}
