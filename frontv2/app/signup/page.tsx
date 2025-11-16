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

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Şifreler eşleşmiyor',
        description: 'Lütfen şifrelerin aynı olduğundan emin olun.',
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Şifre çok kısa',
        description: 'Şifreniz en az 6 karakter olmalıdır.',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await apiService.register({
        email: formData.email,
        password: formData.password
      })
      
      toast({
        title: 'Kayıt başarılı',
        description: 'Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.',
      })

      // Token'ı sil çünkü kullanıcı login yapmalı
      localStorage.removeItem('token')
      
      router.push('/login')
    } catch (error) {
      console.error('Register error:', error)
      
      if (error instanceof ApiError) {
        toast({
          variant: 'destructive',
          title: 'Kayıt başarısız',
          description: error.status === 400 
            ? 'Bu e-posta adresi zaten kullanılıyor' 
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
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
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
                <h1 className="text-3xl font-bold tracking-tight">Hesap Oluşturun</h1>
                <p className="text-sm text-muted-foreground">
                  Anılarınızı saklamaya başlayın
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    className="h-11"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    className="h-11"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="En az 6 karakter"
                    className="h-11"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    className="h-11"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed">
                  Hesap oluşturarak{' '}
                  <Link href="/terms" className="underline hover:text-foreground">
                    Kullanım Şartları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/privacy" className="underline hover:text-foreground">
                    Gizlilik Politikası
                  </Link>
                  {''}'nı kabul etmiş olursunuz.
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    'Hesap Oluştur'
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
                <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
                <Link
                  href="/login"
                  className="font-medium text-foreground hover:underline"
                >
                  Giriş yapın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
