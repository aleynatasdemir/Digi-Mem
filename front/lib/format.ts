// Utility functions for formatting dates and other data

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "Az önce"
  if (diffMin < 60) return `${diffMin} dk önce`
  if (diffHour < 24) return `${diffHour} saat önce`
  if (diffDay < 7) return `${diffDay} gün önce`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} hafta önce`
  if (diffDay < 365) return `${Math.floor(diffDay / 30)} ay önce`
  return `${Math.floor(diffDay / 365)} yıl önce`
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    month: "short",
    day: "numeric",
  })
}
