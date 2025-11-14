import Link from 'next/link'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
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

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    className="h-11"
                    required
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
                    required
                  />
                </div>

                <Button asChild className="w-full h-11 text-base font-medium">
                  <Link href="/dashboard">Giriş Yap</Link>
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
