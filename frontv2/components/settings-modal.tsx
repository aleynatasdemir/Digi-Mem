"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, LogOut, Edit2, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { apiService } from '@/lib/api'
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299'

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    memberSince: "",
    avatarUrl: ""
  })
  const [editData, setEditData] = useState(userData)
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0
  })

  useEffect(() => {
    if (open) {
      loadUserData()
      loadStats()
    }
  }, [open])

  const loadUserData = async () => {
    try {
      const user = await apiService.getCurrentUser()
      const userData = {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        memberSince: user.createdAt,
        avatarUrl: user.profilePhotoUrl || ""
      }
      setUserData(userData)
      setEditData(userData)
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const stats = await apiService.getStats()
      setStats({
        total: stats.total,
        thisMonth: stats.thisMonth,
        thisWeek: stats.thisWeek
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(userData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(userData)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log('Updating profile with:', { name: editData.name, email: editData.email })
      
      const response = await apiService.updateProfile({
        name: editData.name,
        email: editData.email
      })
      
      console.log('Profile update response:', response)
      
      const updatedUserData = {
        id: response.id,
        name: response.name,
        email: response.email,
        memberSince: userData.memberSince,
        avatarUrl: userData.avatarUrl
      }
      
      setUserData(updatedUserData)
      setEditData(updatedUserData)
      setIsEditing(false)
      
      toast({
        title: 'Başarılı',
        description: 'Profil bilgileriniz güncellendi.',
      })
      
      await loadUserData()
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Profil güncellenirken bir hata oluştu.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/api/user/profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      
      // Kullanıcı bilgilerini yeniden çek
      const updatedUser = await apiService.getCurrentUser()
      setUserData({
        ...userData,
        name: updatedUser.name,
        email: updatedUser.email,
        memberSince: updatedUser.createdAt,
        avatarUrl: updatedUser.profilePhotoUrl || ""
      })
      setEditData({
        ...editData,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.profilePhotoUrl || ""
      })
      
      toast({
        title: 'Başarılı',
        description: 'Profil fotoğrafınız güncellendi.',
      })
    } catch (error) {
      console.error('Failed to upload photo:', error)
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Fotoğraf yüklenirken bir hata oluştu.',
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </DialogContent>
      </Dialog>
    )
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
                        onChange={handlePhotoUpload}
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
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 flex-1">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Kaydet
                        </>
                      )}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={isSaving} className="gap-2 flex-1">
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
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Bu Ay</p>
                    <p className="text-3xl font-bold">{stats.thisMonth}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Bu Hafta</p>
                    <p className="text-3xl font-bold">{stats.thisWeek}</p>
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
