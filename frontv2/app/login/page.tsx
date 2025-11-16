'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiService, ApiError } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiService.login({ email, password })
      
      // Admin kontrolü - aleyna@admin veya admin@local ise admin paneline yönlendir
      const isAdmin = email === 'aleyna@admin' || email === 'admin@local'
      
      if (isAdmin) {
        toast({
          title: 'Admin girişi başarılı',
          description: `Hoş geldiniz, ${response.user.name}!`,
        })
        
        router.push('/admin/dashboard')
      } else {
        toast({
          title: 'Giriş başarılı',
          description: `Hoş geldiniz, ${response.user.name}!`,
        })

        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (error instanceof ApiError) {
        toast({
          variant: 'destructive',
          title: 'Giriş başarısız',
          description: error.status === 401 
            ? 'E-posta veya şifre hatalı' 
            : 'Bir hata oluştu. Lütfen tekrar deneyin.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Bağlantı hatası',
          description: 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Brain className="h-6 w-6 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <span className="text-2xl font-bold">Dijital Hafıza</span>
          </Link>

          {/* Form Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
                <p className="text-sm text-muted-foreground">
                  Hesabınıza giriş yapın
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@local"
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Şifre</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Şifremi unuttum?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    veya
                  </span>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Hesabınız yok mu? </span>
                <Link
                  href="/signup"
                  className="font-medium text-foreground hover:underline"
                >
                  Hesap oluşturun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
