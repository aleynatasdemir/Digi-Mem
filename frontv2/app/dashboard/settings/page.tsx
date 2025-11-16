"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, Box, FileText, Settings, User, Mail, Calendar, LogOut, Edit2, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { apiService } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299'

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
    loadUserData()
    loadStats()
  }, [])

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
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Kullanıcı bilgileri yüklenemedi.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const stats = await apiService.getStats()
      setStats({
        total: stats.totalMemories,
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
      
      // Backend'den gelen güncel bilgileri kullan
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
      
      // Sayfayı yenile ki güncel bilgiler yüklensin
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
      
      setUserData({ ...userData, avatarUrl: data.profilePhotoUrl })
      setEditData({ ...editData, avatarUrl: data.profilePhotoUrl })
      
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-foreground">Dijital Hafıza</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard/box">
              <Button variant="ghost" className="gap-2">
                <Box className="h-4 w-4" />
                Anı Kutusu
              </Button>
            </Link>
            <Link href="/dashboard/summaries">
              <Button variant="ghost" className="gap-2">
                <FileText className="h-4 w-4" />
                Özetler
              </Button>
            </Link>
          </nav>

          {/* Right: Settings & Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Ayarlar</h1>
            <p className="text-muted-foreground">Profil bilgilerinizi yönetin ve hesap ayarlarınızı düzenleyin</p>
          </div>

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
                  <AvatarImage src={userData.avatarUrl ? `${API_URL}${userData.avatarUrl}` : undefined} />
                  <AvatarFallback className="text-2xl">{getInitials(userData.name || 'U')}</AvatarFallback>
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
                      onChange={handlePhotoUpload}
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
                  <Button onClick={handleSave} className="gap-2 flex-1" disabled={isSaving}>
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
                  <Button onClick={handleCancel} variant="outline" className="gap-2 flex-1" disabled={isSaving}>
                    <X className="h-4 w-4" />
                    İptal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hesap İşlemleri</CardTitle>
              <CardDescription>Hesabınızla ilgili işlemler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/login'
                }}
                variant="destructive"
                className="w-full gap-2"
                size="lg"
              >
                <LogOut className="h-5 w-5" />
                Çıkış Yap
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>İstatistikler</CardTitle>
              <CardDescription>Hesap aktivite özeti</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
