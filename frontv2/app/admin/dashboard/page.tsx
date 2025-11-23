'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Brain, Users, ImageIcon, Ban, CheckCircle, TrendingUp,
  Search, Eye, Ban as BanIcon, CheckCircle2, User, Calendar, Mail, Phone, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299'

interface User {
  id: string
  email: string
  userName: string
  profilePhotoUrl?: string
  isBanned: boolean
  createdAt: string
  emailConfirmed: boolean
  phoneNumber?: string
}

interface UserStats {
  user: User
  statistics: {
    totalMemories: number
    todayMemories: number
    weekMemories: number
    monthMemories: number
    memoriesByType: Array<{ type: string; count: number }>
    last30Days: Array<{ date: string; count: number }>
  }
}

interface GlobalStats {
  users: {
    total: number
    banned: number
    active: number
    newToday: number
    newWeek: number
    newMonth: number
  }
  memories: {
    total: number
    today: number
    week: number
    month: number
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Debug: decode JWT token to check roles
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('JWT Token Payload:', payload)
      console.log('User roles:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
    } catch (e) {
      console.error('Failed to decode token:', e)
    }

    loadUsers()
    loadGlobalStats()
  }, [currentPage, searchTerm])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/admin/users?page=${currentPage}&pageSize=10${searchTerm ? `&search=${searchTerm}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('Admin users API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Admin users API error:', errorText)
        throw new Error('Failed to load users')
      }

      const data = await response.json()
      console.log('Loaded users:', data) // Debug log
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Kullanıcılar yüklenirken hata oluştu',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadGlobalStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to load stats')

      const data = await response.json()
      setGlobalStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadUserDetails = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to load user details')

      const data = await response.json()
      setSelectedUser(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Kullanıcı detayları yüklenirken hata oluştu',
      })
    }
  }

  const toggleBanUser = async (userId: string, currentBanStatus: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const endpoint = currentBanStatus ? 'unban' : 'ban'
      
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'İşlem başarısız')
      }

      toast({
        title: 'Başarılı',
        description: currentBanStatus ? 'Kullanıcının banı kaldırıldı' : 'Kullanıcı banlandı',
      })

      loadUsers()
      if (selectedUser && selectedUser.user.id === userId) {
        setSelectedUser(null)
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-foreground">Admin Paneli</span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                loadUsers()
                loadGlobalStats()
                toast({
                  title: 'Yenilendi',
                  description: 'Veriler güncellendi.',
                })
              }}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Global Stats */}
        {globalStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold">{globalStats.users.total}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Aktif: {globalStats.users.active} | Yasaklı: {globalStats.users.banned}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yeni Kullanıcı (Bu Ay)</p>
                  <p className="text-2xl font-bold">{globalStats.users.newMonth}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Bu hafta: {globalStats.users.newWeek} | Bugün: {globalStats.users.newToday}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Anı</p>
                  <p className="text-2xl font-bold">{globalStats.memories.total}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Bu ay: {globalStats.memories.month}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bugünkü Anılar</p>
                  <p className="text-2xl font-bold">{globalStats.memories.today}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Bu hafta: {globalStats.memories.week}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted overflow-hidden">
                              {user.profilePhotoUrl ? (
                                <img 
                                  src={`${API_URL}${user.profilePhotoUrl}`} 
                                  alt={user.email}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.email}</p>
                              {user.userName && user.userName !== user.email && (
                                <p className="text-sm text-muted-foreground">{user.userName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.isBanned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                              <BanIcon className="h-3 w-3" />
                              Yasaklı
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => loadUserDetails(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={user.isBanned ? "default" : "destructive"}
                              onClick={() => toggleBanUser(user.id, user.isBanned)}
                            >
                              {user.isBanned ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aktif Et
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4 mr-1" />
                                  Yasak Çıkar
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Sayfa {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User Details Sidebar */}
          <div className="space-y-4">
            {selectedUser ? (
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">Kullanıcı Detayı</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedUser(null)}
                  >
                    ✕
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted overflow-hidden">
                    {selectedUser.user.profilePhotoUrl ? (
                      <img 
                        src={`${API_URL}${selectedUser.user.profilePhotoUrl}`} 
                        alt={selectedUser.user.email}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{selectedUser.user.email}</p>
                    {selectedUser.user.userName && selectedUser.user.userName !== selectedUser.user.email && (
                      <p className="text-sm text-muted-foreground">{selectedUser.user.userName}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Toplam Anı</span>
                    <span className="font-semibold">{selectedUser.statistics.totalMemories}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Bu Ay</span>
                    <span className="font-semibold">{selectedUser.statistics.monthMemories}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Bu Hafta</span>
                    <span className="font-semibold">{selectedUser.statistics.weekMemories}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Bugün</span>
                    <span className="font-semibold">{selectedUser.statistics.todayMemories}</span>
                  </div>
                </div>

                {/* Memory Types */}
                {selectedUser.statistics.memoriesByType.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Anı Türleri</h4>
                    <div className="space-y-2">
                      {selectedUser.statistics.memoriesByType.map((item) => (
                        <div key={item.type} className="flex items-center justify-between py-1">
                          <span className="text-sm text-muted-foreground capitalize">{item.type}</span>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Kullanıcı detaylarını görmek için listedeki göz ikonuna tıklayın
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
