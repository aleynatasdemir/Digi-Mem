"use client"

import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { formatRelativeTime, formatISODate } from "@/lib/date-utils"
import type { Entry } from "@/lib/api"

interface EntriesTableProps {
  entries: Entry[]
  onView: (entry: Entry) => void
  onEdit: (entry: Entry) => void
  onDelete: (entry: Entry) => void
}

export function EntriesTable({ entries, onView, onEdit, onDelete }: EntriesTableProps) {
  return (
    <div className="hidden rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>Oluşturulma</TableHead>
            <TableHead className="w-[80px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.title}</TableCell>
              <TableCell className="text-muted-foreground" title={formatISODate(entry.createdAt)}>
                {formatRelativeTime(entry.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
