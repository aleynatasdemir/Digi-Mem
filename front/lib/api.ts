// API utility for communicating with ASP.NET Core backend

import type {
  MemoriesResponse,
  MemoryItem,
  SummaryResponse,
  SpotifyStatus,
  MemoryType,
  ViewMode,
  SummaryGranularity,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export interface ApiError {
  error: string
  details?: Record<string, string>
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include", // Cookie-based auth
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Oturum gerekli. Lütfen giriş yapın.")
      }

      const errorData: ApiError = await response.json().catch(() => ({
        error: "Bir hata oluştu",
      }))

      throw new Error(errorData.error || "Bir hata oluştu")
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Memories
  async getMemories(params: {
    view?: ViewMode
    from?: string
    to?: string
    types?: MemoryType[]
    tags?: string[]
    q?: string
    page?: number
    pageSize?: number
  }): Promise<MemoriesResponse> {
    const searchParams = new URLSearchParams()
    if (params.view) searchParams.set("view", params.view)
    if (params.from) searchParams.set("from", params.from)
    if (params.to) searchParams.set("to", params.to)
    if (params.types?.length) searchParams.set("types", params.types.join(","))
    if (params.tags?.length) searchParams.set("tags", params.tags.join(","))
    if (params.q) searchParams.set("q", params.q)
    if (params.page) searchParams.set("page", params.page.toString())
    if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString())

    return this.request<MemoriesResponse>(`/memories?${searchParams.toString()}`)
  }

  async createMemory(data: Partial<MemoryItem>): Promise<MemoryItem> {
    return this.request<MemoryItem>("/memories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateMemory(id: string, data: Partial<MemoryItem>): Promise<MemoryItem> {
    return this.request<MemoryItem>(`/memories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteMemory(id: string): Promise<void> {
    return this.request<void>(`/memories/${id}`, {
      method: "DELETE",
    })
  }

  // Summaries
  async getSummaries(params: {
    granularity?: SummaryGranularity
    from?: string
    to?: string
    types?: MemoryType[]
    tags?: string[]
  }): Promise<SummaryResponse> {
    const searchParams = new URLSearchParams()
    if (params.granularity) searchParams.set("granularity", params.granularity)
    if (params.from) searchParams.set("from", params.from)
    if (params.to) searchParams.set("to", params.to)
    if (params.types?.length) searchParams.set("types", params.types.join(","))
    if (params.tags?.length) searchParams.set("tags", params.tags.join(","))

    return this.request<SummaryResponse>(`/summaries?${searchParams.toString()}`)
  }

  // Spotify Integration
  async getSpotifyStatus(): Promise<SpotifyStatus> {
    return this.request<SpotifyStatus>("/integrations/spotify/status")
  }

  async authorizeSpotify(): Promise<void> {
    window.location.href = `${API_BASE_URL}/integrations/spotify/authorize`
  }

  async disconnectSpotify(): Promise<void> {
    return this.request<void>("/integrations/spotify/disconnect", {
      method: "POST",
    })
  }
}

export const api = new ApiClient()
