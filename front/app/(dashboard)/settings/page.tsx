"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Upload, Music, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("Ahmet")
  const [lastName, setLastName] = useState("Yılmaz")
  const [email, setEmail] = useState("ahmet@example.com")
  const [profileImage, setProfileImage] = useState<string>("")
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [lastfmConnected, setLastfmConnected] = useState(false)

  const { toast } = useToast()

  const handleProfileUpdate = () => {
    toast({
      title: "Başarılı",
      description: "Profil bilgileriniz güncellendi",
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        toast({
          title: "Başarılı",
          description: "Profil resmi güncellendi",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    toast({
      title: "Çıkış yapılıyor",
      description: "Hesabınızdan çıkış yapılıyor...",
    })
    // Implement logout logic here
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Ayarlar</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profil Ayarları</CardTitle>
              <CardDescription>Profil bilgilerinizi ve resminizi düzenleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="size-24">
                  {profileImage ? (
                    <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profil resmi" />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      <User className="size-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                      <Upload className="size-4" />
                      Profil Resmini Değiştir
                    </div>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                  <p className="mt-2 text-xs text-muted-foreground">JPG, PNG veya GIF (maks. 5MB)</p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <Button onClick={handleProfileUpdate}>Değişiklikleri Kaydet</Button>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Entegrasyonlar</CardTitle>
              <CardDescription>Müzik servislerinizi bağlayın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Music className="size-5 text-green-500" />
                  <div>
                    <p className="font-medium">Spotify</p>
                    <p className="text-sm text-muted-foreground">{spotifyConnected ? "Bağlı" : "Bağlı değil"}</p>
                  </div>
                </div>
                <Button
                  variant={spotifyConnected ? "outline" : "default"}
                  onClick={() => setSpotifyConnected(!spotifyConnected)}
                >
                  {spotifyConnected ? "Bağlantıyı Kes" : "Bağlan"}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Music className="size-5 text-red-500" />
                  <div>
                    <p className="font-medium">Last.fm</p>
                    <p className="text-sm text-muted-foreground">{lastfmConnected ? "Bağlı" : "Bağlı değil"}</p>
                  </div>
                </div>
                <Button
                  variant={lastfmConnected ? "outline" : "default"}
                  onClick={() => setLastfmConnected(!lastfmConnected)}
                >
                  {lastfmConnected ? "Bağlantıyı Kes" : "Bağlan"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardHeader>
              <CardTitle>Hesap</CardTitle>
              <CardDescription>Hesap yönetimi ve çıkış işlemleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                <LogOut className="mr-2 size-4" />
                Çıkış Yap
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
