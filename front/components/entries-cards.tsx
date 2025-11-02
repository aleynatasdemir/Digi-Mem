"use client"

import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { formatRelativeTime, formatISODate } from "@/lib/date-utils"
import type { Entry } from "@/lib/api"

interface EntriesCardsProps {
  entries: Entry[]
  onView: (entry: Entry) => void
  onEdit: (entry: Entry) => void
  onDelete: (entry: Entry) => void
}

export function EntriesCards({ entries, onView, onEdit, onDelete }: EntriesCardsProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-balance">{entry.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                  <span className="sr-only">İşlemler</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(entry)}>
                  <Eye className="mr-2 size-4" />
                  Görüntüle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(entry)}>
                  <Pencil className="mr-2 size-4" />
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(entry)} className="text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {entry.note && <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{entry.note}</p>}
            <p className="text-xs text-muted-foreground" title={formatISODate(entry.createdAt)}>
              {formatRelativeTime(entry.createdAt)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
