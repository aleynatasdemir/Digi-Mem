"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { formatRelativeTime, formatISODate } from "@/lib/date-utils"
import type { Entry } from "@/lib/api"

interface EntrySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: Entry | null
  onEdit: () => void
}

export function EntrySheet({ open, onOpenChange, entry, onEdit }: EntrySheetProps) {
  if (!entry) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-balance">{entry.title}</SheetTitle>
          <SheetDescription title={formatISODate(entry.createdAt)}>
            {formatRelativeTime(entry.createdAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {entry.note ? (
            <div className="rounded-lg bg-muted p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.note}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not eklenmemiş.</p>
          )}

          <Button onClick={onEdit} className="w-full">
            <Pencil className="mr-2 size-4" />
            Düzenle
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
