"use client"

import { useState } from "react"
import { User, Mail, Calendar, LogOut, Edit2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [userData, setUserData] = useState({
    name: "Kullanıcı Adı",
    email: "kullanici@example.com",
    memberSince: "2025-01-15",
    avatarUrl: ""
  })
  const [editData, setEditData] = useState(userData)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(userData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(userData)
  }

  const handleSave = () => {
    setUserData(editData)
    setIsEditing(false)
    // API call buraya gelecek
  }

  const handleLogout = () => {
    // Logout logic buraya gelecek
    console.log('Çıkış yapılıyor...')
    setShowLogoutDialog(false)
    onOpenChange(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Ayarlar</DialogTitle>
            <DialogDescription>
              Profil bilgilerinizi yönetin ve hesap ayarlarınızı düzenleyin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profil Bilgileri</CardTitle>
                    <CardDescription>Kişisel bilgilerinizi görüntüleyin ve düzenleyin</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
                      <Edit2 className="h-4 w-4" />
                      Düzenle
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatarUrl} />
                    <AvatarFallback className="text-2xl">{getInitials(userData.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="text-sm font-medium">
                        Profil Fotoğrafı
                      </Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="w-64"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* User Info */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Ad Soyad
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="h-11"
                      />
                    ) : (
                      <div className="h-11 px-3 py-2 rounded-md border bg-muted/50 flex items-center">
                        {userData.name}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-posta
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="h-11"
                      />
                    ) : (
                      <div className="h-11 px-3 py-2 rounded-md border bg-muted/50 flex items-center">
                        {userData.email}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Üyelik Tarihi
                    </Label>
                    <div className="h-11 px-3 py-2 rounded-md border bg-muted/50 flex items-center">
                      {new Date(userData.memberSince).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="gap-2 flex-1">
                      <Save className="h-4 w-4" />
                      Kaydet
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="gap-2 flex-1">
                      <X className="h-4 w-4" />
                      İptal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>İstatistikler</CardTitle>
                <CardDescription>Hesap aktivite özeti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Toplam Anı</p>
                    <p className="text-3xl font-bold">127</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Bu Ay</p>
                    <p className="text-3xl font-bold">23</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Bu Hafta</p>
                    <p className="text-3xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="destructive"
              className="w-full gap-2"
              size="lg"
            >
              <LogOut className="h-5 w-5" />
              Çıkış Yap
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Çıkış yapmak istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Oturumunuz sonlandırılacak ve giriş sayfasına yönlendirileceksiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Çıkış Yap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
