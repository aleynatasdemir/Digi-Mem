# 📚 Digi-Mem - Dijital Hafıza Uygulaması

> **Proje Özeti:** Kişisel anılarınızı (fotoğraf, video, ses, metin, müzik) dijital ortamda saklayan, düzenleyen ve analiz eden modern bir web/mobil uygulaması. Spotify entegrasyonu ile müzik tarihinizi de kayıt altına alın.

**Dil:** 🇹🇷 Türkçe

![GitHub Stars](https://img.shields.io/github/stars/aleynatasdemir/Digi-Mem?style=social)
![GitHub Forks](https://img.shields.io/github/forks/aleynatasdemir/Digi-Mem?style=social)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 İçindekiler

- [Proje Özeti](#proje-özeti)
- [Teknolojiler](#️-teknolojiler)
- [Özellikler](#-özellikler)
- [Gereksinimler](#-gereksinimler)
- [Hızlı Başlangıç](#-en-hızlı-başlangıç)
- [Kurulum](#️-kurulum-talimatları)
- [Proje Yapısı](#-proje-yapısı)
- [Backend API](#-backend-api)
- [Frontend](#-frontend)
- [Mobile App](#-mobile-app)
- [Spotify Entegrasyonu](#-spotify-entegrasyonu)
- [Veritabanı](#-veritabanı)
- [Sorun Giderme](#-sorun-giderme)

---

## 📚 Proje Özeti

### Amaç
Kullanıcılara hayatlarının önemli anlarını dijital olarak saklama, düzenleme ve analiz etme imkanı sunan modern bir platform oluşturmak.

### Kullanım Senaryoları
- 📷 Özel fotoğraflar ve videolar saklama
- 🎙️ Sesli notlar ve hafızalar kaydetme
- 📝 Günlük girdileri ve anıları yazma
- 🎵 Spotify ile müzik dinleme geçmişi senkronizasyonu
- 📊 Anılarınız hakkında istatistikler ve özet oluşturma
- 🔍 Anıları tarih, etiket, içerik vb. ile arama ve filtreleme

### Hedef Kullanıcılar
- 🎓 Öğrenciler (üniversite anıları, arkadaş grubu aktiviteleri)
- 👨‍👩‍👧‍👦 Aileler (aile anıları, çocuğun gelişimi)
- 👤 Müzik Severler (dinleme geçmişi, favori şarkılar)
- 📖 Blogger/İçerik Üreticileri (hafıza desteği, nostalji)

---

## 🛠️ Teknolojiler

### Backend (ASP.NET Core)
| Teknoloji | Versiyon | Amaç |
|-----------|---------|------|
| **ASP.NET Core** | 9.0 | Web API Framework |
| **C#** | 12 | Programlama Dili |
| **Entity Framework Core** | 9.0 | ORM (Veritabanı Erişimi) |
| **PostgreSQL** | 16 | Veritabanı |
| **JWT** | - | Token Based Authentication |
| **ASP.NET Identity** | 9.0 | Kullanıcı Yönetimi |
| **Swagger/OpenAPI** | 9.0 | API Dokümantasyonu |
| **Spotify Web API** | v1 | Müzik Entegrasyonu |
| **Polly** | 8.6 | Retry Policy & Resilience |

### Frontend (Web)
| Teknoloji | Versiyon | Amaç |
|-----------|---------|------|
| **Next.js** | 16.0 | React Framework |
| **React** | 19.2 | UI Library |
| **TypeScript** | 5 | Type Safety |
| **Tailwind CSS** | 4.1 | CSS Framework |
| **shadcn/ui** | - | UI Components |
| **Axios** | - | HTTP Client |
| **React Context** | - | State Management |

### Mobile (Flutter)
| Teknoloji | Versiyon | Amaç |
|-----------|---------|------|
| **Flutter** | 3.x | Mobile Framework |
| **Dart** | 3.x | Programlama Dili |
| **Provider** | - | State Management |
| **GetStorage** | - | Local Storage |

### DevOps
| Teknoloji | Amaç |
|-----------|------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container Orchestration |
| **Git** | Version Control |

---

## ✨ Özellikler

### ✅ Tamamlanan Özellikler
- [x] Kullanıcı Kimlik Doğrulama (Register/Login/Logout)
- [x] JWT Token Based Authentication
- [x] Anı Yönetimi (CRUD - Create, Read, Update, Delete)
- [x] Dosya Yükleme (Fotoğraf, Video, Ses)
- [x] Spotify OAuth2 Entegrasyonu
- [x] Spotify Dinleme Geçmişi Senkronizasyonu
- [x] Admin Paneli
- [x] Responsive Web Design
- [x] PostgreSQL Veritabanı
- [x] API Swagger Dokümantasyonu
- [x] Docker Deployment

### 🔄 Geliştirme Aşamasında
- [ ] Flutter Mobile App (90% tamamlandı)
- [ ] Advanced Search & Filtering
- [ ] Dark Mode
- [ ] Offline Mode
- [ ] Social Sharing
- [ ] Export/Backup Features

### 🎯 Planlanan Özellikler
- [ ] AI-Powered Memory Suggestions
- [ ] Image Recognition & Tagging
- [ ] Collaboration Features
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Progressive Web App (PWA)

---

## 📋 Gereksinimler

### Minimum System Requirements
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 5 GB
- **OS:** Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Yazılım Gereksinimleri

| Teknoloji | Versiyon | Zorunlu | İndirme |
|-----------|---------|---------|---------|
| **.NET SDK** | 9.0+ | ✅ | [link](https://dotnet.microsoft.com/download) |
| **Node.js** | 18+, 20+ (LTS) | ✅ | [link](https://nodejs.org/) |
| **PostgreSQL** | 14+ | ⚠️ (Docker varsa isteğe bağlı) | [link](https://www.postgresql.org/download/) |
| **Docker Desktop** | 24.0+ | ✅ (Önerilen) | [link](https://www.docker.com/get-started) |
| **Git** | 2.30+ | ✅ | [link](https://git-scm.com/) |
| **Flutter SDK** | 3.x+ | ⚠️ (Mobile için) | [link](https://flutter.dev/docs/get-started/install) |

---

## 🚀 En Hızlı Başlangıç (Docker ile)

### Adım 1: Repository'yi Klonlayın
```bash
git clone https://github.com/aleynatasdemir/Digi-Mem.git
cd Digi-Mem
```

### Adım 2: Uygulamayı Başlatın

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Adım 3: Tarayıcıda Açın
```
http://localhost:3000
```

### Adım 4: Giriş Yapın
```
📧 Email: admin@local
🔐 Şifre: Admin!12345
```

### ✅ Hazır!
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5299
- 📚 Swagger: http://localhost:5299/swagger
- 🗄️ PostgreSQL: localhost:5433

---

## 🛠️ Kurulum Talimatları

### A. Docker ile Kurulum (Önerilen - En Kolay)

#### 1. Tüm Servisleri Başlatın
```bash
# Repository'yi klonlayın
git clone https://github.com/aleynatasdemir/Digi-Mem.git
cd Digi-Mem

# Docker Compose ile başlat
docker compose up -d

# Logları kontrol et
docker compose logs -f
```

#### 2. Servislerin Durumunu Kontrol Et
```bash
docker compose ps
```

#### 3. Uygulamaya Erişin
| Hizmet | URL | Açıklama |
|--------|-----|----------|
| **Frontend** | http://localhost:3000 | Web Uygulaması |
| **Backend** | http://localhost:5299 | REST API |
| **Swagger** | http://localhost:5299/swagger | API Dokümantasyonu |
| **Database** | localhost:5433 | PostgreSQL |

#### 4. Servisleri Yönetin
```bash
# Servisleri durdur
docker compose down

# Servisleri sil (veri dahil)
docker compose down -v

# Tüm servisleri yeniden build et ve başlat
docker compose up -d --build

# Belirli bir servisin loglarını göster
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

---

### B. Manuel Kurulum (Docker Olmadan)

#### 1. PostgreSQL Veritabanını Kurma

**Option A: Yerel PostgreSQL**
```sql
-- PostgreSQL CLI açın
CREATE DATABASE digimem;
CREATE USER app WITH PASSWORD 'app_pass';
GRANT ALL PRIVILEGES ON DATABASE digimem TO app;
```

**Option B: Docker ile PostgreSQL**
```bash
docker run -d \
  --name postgres_digi \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app_pass \
  -e POSTGRES_DB=digimem \
  -p 5433:5432 \
  postgres:16
```

#### 2. Backend'i Kurma ve Çalıştırma

```bash
# Backend klasörüne git
cd backend

# NuGet paketlerini yükle
dotnet restore

# Veritabanı migration'larını uygula
dotnet ef database update

# Backend'i başlat
dotnet run
```

**Kontrol et:** http://localhost:5299/swagger

#### 3. Frontend'i Kurma ve Çalıştırma

Yeni terminal açın:
```bash
# Frontend klasörüne git
cd frontv2

# Node paketlerini yükle
npm install
# veya pnpm:
pnpm install

# Frontend'i başlat
npm run dev
```

**Kontrol et:** http://localhost:3000

#### 4. Giriş Yapın
```
📧 Email: admin@local
🔐 Şifre: Admin!12345
```

---

## 📁 Proje Yapısı

```
Digi-Mem/
│
├── 📂 backend/                          # ASP.NET Core REST API
│   ├── Controllers/
│   │   ├── AuthController.cs            # 🔐 Giriş/Kayıt (JWT)
│   │   ├── MemoriesController.cs        # 💾 Anı CRUD İşlemleri
│   │   ├── UploadController.cs          # 📤 Dosya Yükleme
│   │   ├── SpotifyAuthController.cs     # 🎵 Spotify OAuth
│   │   ├── SpotifyController.cs         # 🎵 Spotify API
│   │   ├── UserController.cs            # 👤 Kullanıcı Profili
│   │   └── AdminController.cs           # 👨‍💼 Yönetici Paneli
│   │
│   ├── Data/
│   │   ├── AppDbContext.cs              # 🗄️ EF Core DbContext
│   │   ├── Seed.cs                      # 🌱 İlk Veriler
│   │   └── Migrations/                  # 📝 DB Şema Değişiklikleri
│   │
│   ├── Models/
│   │   ├── Memory.cs                    # 💾 Anı Modeli
│   │   └── UserIntegration.cs           # 🔗 Spotify Token Saklama
│   │
│   ├── Services/
│   │   ├── EncryptionService.cs         # 🔒 Şifreleme
│   │   └── Spotify/
│   │       ├── SpotifyOAuthService.cs   # 🔑 OAuth2 + PKCE
│   │       ├── SpotifyApiService.cs     # 🌐 API Çağrıları
│   │       └── SpotifySyncService.cs    # 🔄 Senkronizasyon
│   │
│   ├── Properties/
│   │   └── launchSettings.json          # ⚙️ Launch Ayarları
│   │
│   ├── Program.cs                       # 🚀 Uygulama Başlangıcı
│   ├── DigiMem.csproj                   # 📦 NuGet Dependencies
│   ├── appsettings.json                 # ⚙️ Production Ayarları
│   ├── appsettings.Development.json     # ⚙️ Development Ayarları
│   ├── Dockerfile                       # 🐳 Docker Image
│   └── wwwroot/uploads/                 # 📂 Yüklenen Dosyalar
│
├── 📂 frontv2/                          # Next.js Web Frontend (Güncel)
│   ├── app/
│   │   ├── (auth)/                      # 🔐 Auth Pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/                 # 📊 Dashboard Pages
│   │   │   ├── memories/
│   │   │   ├── entries/
│   │   │   └── profile/
│   │   ├── admin/                       # 👨‍💼 Admin Pages
│   │   └── page.tsx                     # 🏠 Home Page
│   │
│   ├── components/                      # 🎨 React Components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── common/
│   │   └── ui/
│   │
│   ├── Services/                        # 🔌 API Client'ları
│   │   ├── api.ts                       # 📡 API Requests
│   │   └── auth-service.ts              # 🔐 Auth Service
│   │
│   ├── lib/                             # 🛠️ Utility Fonksiyonları
│   │   ├── auth-context.tsx             # 🔐 Auth Context
│   │   └── utils.ts
│   │
│   ├── styles/                          # 🎨 Global Stiller
│   ├── public/                          # 📂 Statik Dosyalar
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .env.example
│   ├── .env.local                       # ⚙️ Environment Variables
│   └── next.config.mjs
│
├── 📂 front/                            # Next.js Frontend (Eski Versiyon)
│
├── 📂 mobile_app/                       # Flutter Mobile App
│   ├── lib/
│   │   ├── screens/                     # 📱 Sayfalar
│   │   ├── widgets/                     # 🎨 Widgets
│   │   ├── models/                      # 📦 Veri Modelleri
│   │   ├── services/                    # 🔌 API & Services
│   │   └── main.dart                    # 🚀 Uygulama Giriş Noktası
│   │
│   ├── android/                         # 🤖 Android Ayarları
│   ├── ios/                             # 🍎 iOS Ayatları
│   ├── pubspec.yaml                     # 📦 Dart Dependencies
│   └── README_FLUTTER.md
│
├── 📂 flutter/                          # Eski Flutter Proje
│
├── docker-compose.yml                   # 🐳 Multi-Container Setup
├── Dockerfile                           # 🐳 Backend Image
├── Dockerfile.frontend                  # 🐳 Frontend Image
│
├── start.bat                            # 🪟 Windows Başlangıç Script'i
├── start.sh                             # 🐧 Linux/Mac Başlangıç Script'i
│
├── BACKEND_DETAYLI_DOKUMANTASYON.md    # 📚 Backend Dokümantasyonu
├── SPOTIFY_INTEGRATION.md               # 🎵 Spotify Entegrasyonu
├── MOCK_MODE.md                         # 🧪 Mock Mode Dokümantasyonu
├── web_sartname.md                      # 📋 Web Teknik Şartname
├── flutter_sartname.md                  # 📋 Flutter Teknik Şartname
│
└── README.md                            # 📖 Bu Dosya
```

---

## 🔌 Backend API

### API Mimarisi
- **Stil:** RESTful API
- **Kimlik Doğrulama:** JWT Tokens
- **Rate Limiting:** Spotify API (429 handling)
- **Şifreleme:** AES-256 (Spotify tokens)
- **CORS:** Frontend origin'e yapılandırılmış

### Core Endpoints

#### 🔐 Authentication
```bash
POST   /api/auth/register              # Yeni kullanıcı kaydı
POST   /api/auth/login                 # Kullanıcı girişi (JWT token döner)
POST   /api/auth/refresh               # Token yenileme
POST   /api/auth/logout                # Çıkış (token revoke)
```

#### 💾 Memories (Anılar)
```bash
GET    /api/memories                   # Tüm anıları listele (paginated)
GET    /api/memories/{id}              # Tek anı detayı
POST   /api/memories                   # Yeni anı ekle
PUT    /api/memories/{id}              # Anı güncelle
DELETE /api/memories/{id}              # Anı sil
GET    /api/memories/search?q=keyword  # Anı arama
GET    /api/memories/timeline          # Zaman çizelgesi
```

#### 📤 Upload (Dosya Yükleme)
```bash
POST   /api/upload/image                # Fotoğraf yükle
POST   /api/upload/video                # Video yükle
POST   /api/upload/audio                # Ses yükle
DELETE /api/upload/{fileId}             # Dosya sil
```

#### 🎵 Spotify Integration
```bash
GET    /oauth/spotify/connect           # Spotify OAuth başla (yönlendir)
GET    /oauth/spotify/callback          # OAuth callback (token exchange)
POST   /oauth/spotify/disconnect        # Bağlantıyı kes

GET    /api/spotify/status              # Bağlantı durumu
POST   /api/spotify/sync                # Son dinlemeleri senkronize et
GET    /api/spotify/top-tracks          # En çok dinlenen şarkılar
GET    /api/spotify/top-artists         # En çok dinlenen sanatçılar
GET    /api/spotify/summary             # Ay/Yıl özeti
```

#### 👤 User (Kullanıcı)
```bash
GET    /api/user/profile                # Profil bilgisi
PUT    /api/user/profile                # Profil güncelle
POST   /api/user/change-password        # Şifre değiştir
DELETE /api/user/account                # Hesap sil
```

#### 👨‍💼 Admin
```bash
GET    /api/admin/users                 # Tüm kullanıcıları listele
GET    /api/admin/users/{id}            # Kullanıcı detayı
PUT    /api/admin/users/{id}            # Kullanıcı güncelle
DELETE /api/admin/users/{id}            # Kullanıcı sil
GET    /api/admin/statistics            # Sistem istatistikleri
```

### API Swagger Dokümantasyonu
Backend çalışıyorken şu adrese gidin:
```
http://localhost:5299/swagger
```

### JWT Token Kullanımı

**1. Login Yap ve Token Al:**
```bash
curl -X POST http://localhost:5299/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"Admin!12345"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

**2. Token ile API Çağrısı Yap:**
```bash
curl -X GET http://localhost:5299/api/memories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**3. Swagger'da Token Kullan:**
- Swagger UI'de "Authorize" butonuna tıklayın
- Token'ı `Bearer <token>` formatında yapıştırın
- API endpoints'leri test edin

---

## 🌐 Frontend

### Teknolojiler
- **Framework:** Next.js 16 (React 19 + App Router)
- **Dil:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form (kullanılan)

### Sayfalar

#### 🔐 Authentication Pages
```
/login                  # Giriş sayfası
/signup                 # Kayıt sayfası
```

#### 📊 Dashboard Pages
```
/dashboard/memories     # Anılar listesi
/dashboard/memories/:id # Anı detayı
/dashboard/entries      # Günlük girdileri
/dashboard/profile      # Profil sayfası
```

#### 🎵 Spotify Pages
```
/dashboard/spotify      # Spotify bağlantısı & özeti
/dashboard/spotify/connect  # OAuth callback
```

#### 👨‍💼 Admin Pages
```
/admin/dashboard        # Admin dashboard
/admin/users           # Kullanıcı yönetimi
/admin/statistics      # İstatistikler
```

### Bileşenler (Components)

#### 🔐 Auth Components
- `LoginForm` - Giriş formu
- `SignupForm` - Kayıt formu
- `ProtectedRoute` - Korumalı route
- `AuthContext` - Kimlik doğrulama state

#### 📊 Dashboard Components
- `MemoryCard` - Anı kartı
- `MemoryForm` - Anı ekleme/düzenleme formu
- `MemoryList` - Anılar listesi
- `TimelineView` - Zaman çizelgesi
- `SearchBar` - Arama çubuğu

#### 🎵 Spotify Components
- `SpotifyConnect` - Spotify bağlantısı
- `TopTracks` - En çok dinlenen şarkılar
- `RecentlyPlayed` - Son dinlenenler
- `SpotifySummary` - Ay/Yıl özeti

### Environment Variables (`.env.local`)

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5299
NEXT_PUBLIC_API_BASE_URL=http://localhost:5299/api

# Spotify
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### Deployment

#### Development
```bash
cd frontv2
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

#### Docker Build
```bash
docker build -f Dockerfile.frontend -t digi-mem-frontend .
docker run -p 3000:3000 digi-mem-frontend
```

---

## 📱 Mobile App

### Flutter Uygulaması

**Durum:** 90% Tamamlandı ✅

**Özellikler:**
- ✅ Kullanıcı Kimlik Doğrulama
- ✅ Anı Görüntüleme
- ✅ Dosya Yükleme (Kamera, Galeri)
- ✅ Offline Mode
- 🔄 Spotify Entegrasyonu (Devam ediyor)

### Kurulum

#### 1. Flutter SDK Kurun
```bash
# https://flutter.dev/docs/get-started/install adresini ziyaret edin
flutter --version  # Kurulumu kontrol et
```

#### 2. Android Emülatörü Başlat
```bash
flutter emulators --launch Pixel_5_API_30
# veya AVD Manager'dan başlat
```

#### 3. Uygulamayı Çalıştır
```bash
cd mobile_app
flutter pub get
flutter run
```

#### 4. iOS'ta (Mac gerekli)
```bash
flutter run -d iPhone
```

### Proje Yapısı
```
mobile_app/
├── lib/
│   ├── screens/         # 📱 Sayfalar
│   ├── widgets/         # 🎨 Custom Widgets
│   ├── models/          # 📦 Veri Modelleri
│   ├── services/        # 🔌 API & Services
│   ├── providers/       # 📊 State Management
│   └── main.dart        # 🚀 Giriş Noktası
├── android/             # 🤖 Android Config
├── ios/                 # 🍎 iOS Config
└── pubspec.yaml         # 📦 Dependencies
```

### Belgeler
- Detaylı Setup: [ANDROID_SETUP.md](./mobile_app/ANDROID_SETUP.md)
- Backend Entegrasyonu: [BACKEND_SETUP.md](./mobile_app/BACKEND_SETUP.md)
- Emülatör Dosya Yükleme: [EMULATOR_FILE_UPLOAD.md](./mobile_app/EMULATOR_FILE_UPLOAD.md)

---

## 🎵 Spotify Entegrasyonu

### Özellikler
✅ **OAuth2 + PKCE** - Güvenli kimlik doğrulama
✅ **Refresh Token Encryption** - AES-256 ile şifreli saklama
✅ **Automatic Token Refresh** - 401 durumunda otomatik yenileme
✅ **Rate Limit Handling** - Polly ile retry + exponential backoff
✅ **Recently Played Sync** - Son 50 şarkı senkronizasyonu
✅ **Top Tracks/Artists** - İstatistikler ve özet

### Kurulum

#### 1. Spotify Developer Account
1. https://developer.spotify.com adresine gidin
2. Yeni bir application oluşturun
3. Client ID ve Client Secret'i kopyalayın

#### 2. Backend Yapılandırması
`appsettings.Development.json`:
```json
{
  "Spotify": {
    "ClientId": "YOUR_CLIENT_ID",
    "ClientSecret": "YOUR_CLIENT_SECRET",
    "RedirectUri": "http://localhost:5299/oauth/spotify/callback"
  },
  "Encryption": {
    "Key": "your-32-character-encryption-key!"
  }
}
```

#### 3. Frontend Yapılandırması
`.env.local`:
```bash
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/oauth/spotify/callback
```

### Spotify OAuth Flow
```
1. Kullanıcı "Spotify ile Bağlan" butonuna tıklar
   ↓
2. /oauth/spotify/connect'e yönlendirilir
   ↓
3. Spotify login sayfasına yönlendirilir
   ↓
4. Kullanıcı izin verir
   ↓
5. /oauth/spotify/callback'e dönülür
   ↓
6. Backend token exchange yapar ve DB'ye kaydeder
   ↓
7. Frontend dashboard'a yönlendirilir
```

### API Endpoints
```bash
GET  /oauth/spotify/connect          # OAuth başlat
GET  /oauth/spotify/callback         # Callback
POST /oauth/spotify/disconnect       # Bağlantıyı kes

GET  /api/spotify/status             # Bağlantı durumu
POST /api/spotify/sync               # Senkronize et
GET  /api/spotify/top-tracks         # Top şarkılar
GET  /api/spotify/top-artists        # Top sanatçılar
GET  /api/spotify/summary            # Ay/Yıl özeti
```

### Detaylı Belgeler
[SPOTIFY_INTEGRATION.md](./SPOTIFY_INTEGRATION.md)

---

## 🗄️ Veritabanı

### PostgreSQL Şeması

#### Tabloları Görüntüleme
```powershell
# Docker ile
docker compose exec postgres psql -U app -d digimem -c "\dt"
```

#### Tablolar

| Tablo | Açıklama |
|-------|----------|
| **AspNetUsers** | Kullanıcı hesapları |
| **AspNetRoles** | Kullanıcı rolleri (Admin, User) |
| **AspNetUserRoles** | Kullanıcı-rol ilişkisi |
| **AspNetUserClaims** | Kullanıcı yetkileri |
| **Memories** | Anılar (fotoğraf, video, ses, metin) |
| **UserIntegrations** | Spotify token saklama |
| **SpotifyTracks** | Senkronize edilen Spotify şarkıları |
| **__EFMigrationsHistory** | Migration geçmişi |

#### Memory Tablosu Şeması
```sql
CREATE TABLE "Memories" (
    "Id" UUID PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "Title" VARCHAR(255),
    "Description" TEXT,
    "Type" VARCHAR(50),  -- 'photo', 'video', 'audio', 'text'
    "FileUrl" VARCHAR(500),
    "Latitude" DECIMAL,
    "Longitude" DECIMAL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id")
);
```

#### UserIntegration Tablosu Şeması
```sql
CREATE TABLE "UserIntegrations" (
    "Id" UUID PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "Provider" VARCHAR(50),  -- 'spotify'
    "AccessToken" TEXT,  -- Encrypted
    "RefreshToken" TEXT,  -- Encrypted
    "ExpiresAt" TIMESTAMP,
    "ConnectedAt" TIMESTAMP,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id")
);
```

### Migration Komutları

```bash
cd backend

# Yeni migration oluştur
dotnet ef migrations add MigrationName

# Migration'ı veritabanına uygula
dotnet ef database update

# Son migration'ı geri al
dotnet ef migrations remove

# Veritabanını sıfırla (tüm veriler silinir)
dotnet ef database drop
```

---

## 🐛 Sorun Giderme

### Port Sorunları

**Port 3000 (Frontend) zaten kullanımda**
```powershell
# Windows - Hangi işlem kullanıyor bul
netstat -ano | findstr :3000

# İşlemi sonlandır
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Port 5299 (Backend) zaten kullanımda**
```powershell
netstat -ano | findstr :5299
taskkill /PID <PID> /F
```

**Port 5433 (PostgreSQL) zaten kullanımda**
```powershell
netstat -ano | findstr :5433
taskkill /PID <PID> /F
```

### PostgreSQL Bağlantı Hatası

```
"Host=localhost;Port=5433" ile bağlantı başarısız
```

**Çözüm:**
```bash
# Container'ının çalışıp çalışmadığını kontrol et
docker compose ps

# Eğer çalışmıyorsa
docker compose restart postgres

# Logs'u kontrol et
docker compose logs postgres
```

### Frontend API Bağlantı Hatası

```
CORS error veya "Cannot connect to API"
```

**Çözüm:**
1. Backend çalışıp çalışmadığını kontrol et:
```bash
curl http://localhost:5299/swagger
```

2. `.env.local` dosyasını kontrol et:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5299/api
```

3. Frontend'i yeniden başlat:
```bash
npm run dev
```

### Migration Sorunları

**"Pending migrations" hatası**
```bash
cd backend
dotnet ef database update
```

**Tüm migration'ları sıfırla (uyarı: veri silinir)**
```bash
cd backend
dotnet ef database drop
dotnet ef migrations remove  # Tüm migration'ları kaldır
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Frontend Node Paket Sorunları

```bash
cd frontv2

# node_modules'ü sil
rm -r node_modules

# package-lock.json'ı sil
rm package-lock.json

# Yeniden yükle
npm install

# Başlat
npm run dev
```

### Docker Container Sorunları

**Container'ı force yeniden başlat**
```bash
docker compose down -v
docker compose up -d --build
```

**Container'ın loglarını göster**
```bash
docker compose logs <service_name> --tail 100
docker compose logs backend --tail 100
docker compose logs frontend --tail 100
```

### Swagger Açılamıyor

```
http://localhost:5299/swagger erişilemiyor
```

**Çözüm:**
```bash
cd backend

# Backend'in çalıştığını kontrol et
dotnet run

# Program.cs'de Swagger konfigürasyonunu kontrol et
# public void Configure(IApplicationBuilder app) {
#     app.UseSwagger();
#     app.UseSwaggerUI();
# }
```

---

## 🔐 Güvenlik

### Şifre Politikası
- Minimum 8 karakter
- Büyük harf, küçük harf, sayı ve özel karakter gerekli
- Şifreler BCrypt ile hash'lenmiş

### JWT Token
- **Algoritma:** HS256
- **Secret:** Minimum 32 karakter
- **Süre:** 7 gün
- **Refresh:** Otomatik

### Spotify Token Şifreleme
- **Algoritma:** AES-256
- **Saklama:** Veritabanında şifreli
- **Otomatik Yenileme:** 401 durumunda

### CORS Configuration
```csharp
// Frontend origin'i authorized list'e eklendi
builder.WithOrigins("http://localhost:3000")
```

### HTTPS
- **Development:** Self-signed sertifika (otomatik)
- **Production:** Geçerli SSL sertifikası zorunlu

---

## 📊 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
├──────────────────┬──────────────────┬──────────────────────┤
│  Web Frontend    │  Mobile App      │  Admin Dashboard     │
│  (Next.js)       │  (Flutter)       │  (Next.js)           │
│  http:3000       │  Android/iOS     │  http:3000/admin     │
└────────┬─────────┴────────┬─────────┴──────────┬───────────┘
         │                  │                    │
         └──────────────────┼────────────────────┘
                            │ HTTPS/REST
                            ▼
        ┌───────────────────────────────────────┐
        │     BACKEND API LAYER                 │
        │  (ASP.NET Core 9.0)                   │
        │  http://localhost:5299                │
        ├───────────────────────────────────────┤
        │  ✅ Authentication (JWT)              │
        │  ✅ API Controllers                   │
        │  ✅ Spotify Integration               │
        │  ✅ File Upload                       │
        │  ✅ Rate Limiting & Caching           │
        └───────────┬──────────┬────────────────┘
                    │          │
        ┌───────────▼─┐  ┌─────▼──────────────┐
        │ PostgreSQL  │  │ File Storage       │
        │ Database    │  │ (wwwroot/uploads)  │
        │ Port: 5433  │  │                    │
        └─────────────┘  └────────────────────┘
```

---

## 📈 Performance

### Optimizations
- ✅ Database Query Caching
- ✅ Image Compression
- ✅ Lazy Loading (Frontend)
- ✅ Database Indexing
- ✅ Rate Limiting (Spotify API)
- ✅ Connection Pooling

### Monitoring
- 🔍 Backend Logging
- 🔍 Error Tracking
- 🔍 API Response Times
- 🔍 Database Performance

---

## 📚 Belgeler

### Teknik Dokümantasyon
- 📖 [Backend Detaylı Dokümantasyon](./BACKEND_DETAYLI_DOKUMANTASYON.md)
- 🎵 [Spotify Entegrasyonu](./SPOTIFY_INTEGRATION.md)
- 🧪 [Mock Mode](./MOCK_MODE.md)
- 🔧 [Web Teknik Şartname](./web_sartname.md)
- 📱 [Flutter Teknik Şartname](./flutter_sartname.md)

### Geliştirici Kaynakları
- [ASP.NET Core Docs](https://docs.microsoft.com/dotnet/core/)
- [Next.js Docs](https://nextjs.org/docs)
- [Flutter Docs](https://flutter.dev/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 🚀 Deployment

### Docker Deployment
```bash
# Production build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Logs kontrol et
docker compose logs -f
```

### Manual Deployment

#### Backend
```bash
cd backend
dotnet publish -c Release -o ./publish
cd ./publish
dotnet DigiMem.dll
```

#### Frontend
```bash
cd frontv2
npm run build
npm start
```

---

## 📝 Changelog

### v1.0.0 (2025-11-25)
- ✅ Temel anı yönetimi (CRUD)
- ✅ Kullanıcı kimlik doğrulması (JWT)
- ✅ Spotify OAuth2 entegrasyonu
- ✅ Dosya yükleme sistemi
- ✅ Admin paneli
- ✅ REST API (Swagger dokümantasyonu)
- ✅ Next.js web frontend
- ✅ Docker deployment
- 🔄 Flutter mobile app (90% tamamlandı)

---

## 👥 İşbirliği ve Katkı

### Katkı Sağlama
1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

### Kodlama Standartları
- C#: [Microsoft C# Coding Conventions](https://docs.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- TypeScript: [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Dart: [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style)

### Rapor Etme
Bir bug bulduysanız [Issue](https://github.com/aleynatasdemir/Digi-Mem/issues) açın ve şu bilgileri paylaşın:
- Sistem (Windows/Mac/Linux)
- .NET/Node/Flutter versiyonu
- Hata mesajı
- Adımları tekrar et

---

## 📞 İletişim & Destek

| Kanal | Bilgi |
|-------|-------|
| **Email** | aleyna.tasdemir@example.com |
| **GitHub** | [@aleynatasdemir](https://github.com/aleynatasdemir) |
| **Repository** | [Digi-Mem](https://github.com/aleynatasdemir/Digi-Mem) |
| **Issues** | [GitHub Issues](https://github.com/aleynatasdemir/Digi-Mem/issues) |

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.

```
Copyright (c) 2025 Aleyna Taşdemir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

Lisans detayları için [LICENSE](./LICENSE) dosyasını okuyun.

---

## 🎯 Roadmap

### Q1 2026
- [ ] Flutter Mobile App'ı tamamla
- [ ] Push Notifications
- [ ] Offline Mode Improvements
- [ ] Dark Mode

### Q2 2026
- [ ] Advanced Search & Filtering
- [ ] Social Sharing Features
- [ ] Export/Backup Functionality
- [ ] Performance Optimization

### Q3 2026
- [ ] AI-Powered Memory Suggestions
- [ ] Image Recognition & Auto-tagging
- [ ] Multi-user Collaboration
- [ ] Cloud Sync

### Q4 2026
- [ ] Progressive Web App (PWA)
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Monitoring & Analytics
- [ ] Mobile App Store Release

---

## 🙏 Teşekkürler

Bu projeyi geliştirmekte katkısı olan herkese teşekkür ederim:
- ✨ Tüm katkı yapanlara
- 🐞 Bug report'a yardımcı olanlara
- 💡 Önerilerde bulunanlara

---

## 📊 Proje İstatistikleri

```
Total Lines of Code:    ~15,000+
Backend (C#):          ~5,000+
Frontend (TypeScript):  ~6,000+
Mobile (Dart):         ~4,000+

Technologies:          10+
Frameworks:            4 (ASP.NET Core, Next.js, Flutter, Express)
Databases:             1 (PostgreSQL)
API Integrations:      1 (Spotify)
```

---

<div align="center">

**Made with ❤️ by Aleyna Taşdemir**

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/aleynatasdemir/Digi-Mem)
![Last commit](https://img.shields.io/github/last-commit/aleynatasdemir/Digi-Mem)
![Repository size](https://img.shields.io/github/repo-size/aleynatasdemir/Digi-Mem)

</div>
