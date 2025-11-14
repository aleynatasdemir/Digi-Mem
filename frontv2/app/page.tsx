import Link from 'next/link'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                <Brain className="h-10 w-10 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <h1 className="font-sans text-5xl font-bold tracking-tight text-balance">
              Dijital Hafıza
            </h1>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Anılarınızı dijital ortamda güvenle saklayın ve düzenleyin. Her anınız değerli, onları asla kaybetmeyin.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button asChild size="lg" className="w-full text-base font-medium">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full text-base font-medium">
              <Link href="/signup">Hesap Oluştur</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8 text-sm">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground">Güvenli Saklama</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground">Kolay Düzenleme</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground">Hızlı Erişim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
