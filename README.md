# Digi-Mem - Dijital Hafıza Uygulaması

Özel anılarınızı (fotoğraf, video, ses kaydı, metin notu, şarkı) dijital ortamda saklayın ve düzenleyin.

## 🛠️ Teknolojiler

### Backend
- **ASP.NET Core 9.0** - Web API
- **Entity Framework Core 9.0** - ORM
- **PostgreSQL 16** - Veritabanı
- **JWT Authentication** - Güvenlik
- **Swagger/OpenAPI** - API Dokümantasyonu

### Frontend
- **Next.js 16.0** - React Framework
- **React 19.2** - UI Library
- **TypeScript 5** - Type Safety
- **Tailwind CSS 4.1** - Styling
- **shadcn/ui** - UI Components

## 📋 Gereksinimler

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/download/) (veya Docker)
- [Docker](https://www.docker.com/get-started) (opsiyonel)

## 🚀 Hızlı Başlangıç (Docker ile - Önerilen)

En kolay yol! Tek komutla tüm uygulamayı ayağa kaldırın:

### Yöntem 1: Script ile (En Kolay)

**Windows:**
```bash
git clone https://github.com/aleynatasdemir/Digi-Mem.git
cd Digi-Mem
start.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/aleynatasdemir/Digi-Mem.git
cd Digi-Mem
chmod +x start.sh
./start.sh
```

### Yöntem 2: Manuel Docker Compose

```bash
# Repository'yi klonlayın
git clone https://github.com/aleynatasdemir/Digi-Mem.git
cd Digi-Mem

# Tek komutla her şeyi başlatın
docker compose up -d

# 2-3 dakika bekleyin (ilk çalıştırmada build işlemi var)
# Tarayıcınızda açın: http://localhost:3000
```

**Giriş bilgileri:**
- Email: `admin@local`
- Şifre: `Admin!12345`

---

## 🛠️ Manuel Kurulum (Docker olmadan)

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/aleynatasdemir/Digi-Mem.git
cd Digi-Mem
```

### 2. PostgreSQL Veritabanını Başlatın

#### Seçenek A: Docker ile (Önerilen)

```bash
docker compose up -d postgres
```

PostgreSQL şu adreste çalışacak: `localhost:5433`

#### Seçenek B: Yerel PostgreSQL

Yerel PostgreSQL'inizde `digimem` veritabanını oluşturun.

### 3. Backend'i Ayağa Kaldırın

```bash
# Root dizinde (backend)
dotnet restore

# Veritabanı migration'larını uygulayın
dotnet ef database update

# Backend'i başlatın
dotnet run
```

Backend şu adreste çalışacak: **http://localhost:5299**

Swagger UI: **http://localhost:5299/swagger**

### 4. Frontend'i Ayağa Kaldırın

Yeni bir terminal açın:

```bash
cd front

# Bağımlılıkları yükleyin
npm install --legacy-peer-deps

# Frontend'i başlatın
npm run dev
```

Frontend şu adreste çalışacak: **http://localhost:3000**

## 🔑 Varsayılan Kullanıcı

Sistem otomatik olarak bir admin kullanıcısı oluşturur:

- **Email:** admin@local
- **Şifre:** Admin!12345

## 📁 Proje Yapısı

```
Digi-Mem/
├── Controllers/           # API Controller'lar
│   ├── AuthController.cs      # Giriş/Kayıt API
│   ├── MemoriesController.cs  # Anılar CRUD API
│   └── EntriesController.cs   # Günlük Girişleri API
├── Data/                  # Veritabanı Context
│   ├── AppDbContext.cs        # EF Core DbContext
│   └── Seed.cs                # Admin kullanıcı seed
├── Models/                # Veri Modelleri
│   ├── Memory.cs              # Anı modeli
│   └── Entry.cs               # Giriş modeli
├── Migrations/            # EF Core Migrations
├── front/                 # Next.js Frontend
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Dashboard route group
│   │   ├── login/             # Login sayfası
│   │   ├── register/          # Kayıt sayfası
│   │   └── page.tsx           # Ana sayfa
│   ├── components/            # React Components
│   ├── lib/                   # Utility fonksiyonlar
│   │   ├── api.ts             # API client
│   │   ├── api-client.ts      # Auth API client
│   │   └── auth-context.tsx   # Auth context
│   └── public/                # Statik dosyalar
├── docker-compose.yml     # Docker Compose config
├── appsettings.json       # Uygulama ayarları
└── Program.cs             # ASP.NET Core giriş noktası
```

## 🔧 Yapılandırma

### Backend (appsettings.Development.json)

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5433;Database=digimem;Username=app;Password=app_pass"
  },
  "Jwt": {
    "Secret": "your-super-secret-jwt-key-min-32-characters-long-12345",
    "Issuer": "DigiMem",
    "Audience": "DigiMemUsers"
  }
}
```

### Frontend (front/.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5299
NEXT_PUBLIC_API_BASE_URL=http://localhost:5299/api
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Memories (Anılar)
- `GET /api/memories` - Tüm anıları listele
- `GET /api/memories/{id}` - Tek anı detayı
- `POST /api/memories` - Yeni anı ekle
- `PUT /api/memories/{id}` - Anı güncelle
- `DELETE /api/memories/{id}` - Anı sil

### Entries (Günlük Girişleri)
- `GET /api/entries` - Tüm girişleri listele
- `GET /api/entries/{id}` - Tek giriş detayı
- `POST /api/entries` - Yeni giriş ekle
- `PUT /api/entries/{id}` - Giriş güncelle
- `DELETE /api/entries/{id}` - Giriş sil
- `GET /api/entries/stats` - İstatistikler

## 🐳 Docker ile Tek Komutta Çalıştırma (Önerilen)

Tüm uygulamayı (PostgreSQL + Backend + Frontend) Docker ile tek komutta çalıştırın:

```bash
# Tüm servisleri ayağa kaldır (ilk çalıştırmada build işlemi yapılır)
docker compose up -d

# Logları canlı takip et
docker compose logs -f

# Sadece backend loglarını göster
docker compose logs -f backend

# Sadece frontend loglarını göster
docker compose logs -f frontend

# Servislerin durumunu kontrol et
docker compose ps

# Tüm servisleri durdur
docker compose down

# Servisleri durdur ve volume'ları da sil (veritabanı sıfırlanır)
docker compose down -v
```

### Docker ile Çalışan Servisler:
- **PostgreSQL**: `localhost:5433`
- **Backend API**: `http://localhost:5299`
- **Frontend**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:5299/swagger`

### İlk Çalıştırma
İlk kez çalıştırdığınızda:
1. Docker image'ları build edilecek (birkaç dakika sürer)
2. PostgreSQL container'ı başlayacak
3. Backend otomatik olarak migration'ları çalıştıracak
4. Admin kullanıcısı otomatik oluşturulacak
5. Frontend container'ı başlayacak

Ardından `http://localhost:3000` adresinden uygulamaya erişebilirsiniz!

## 🧪 Test

### Backend Test
```bash
dotnet test
```

### Frontend Test
```bash
cd front
npm run test
```

## 📦 Production Build

### Backend
```bash
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd front
npm run build
npm start
```

## 🔐 Güvenlik

- JWT token süresi: 7 gün
- Şifreler BCrypt ile hashlenmiş
- CORS: Frontend origin'e izin verilmiş
- HTTPS Production'da zorunlu

## 🐛 Sorun Giderme

### Port 5433 zaten kullanımda
```bash
# Windows
netstat -ano | findstr :5433
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5433
kill -9 <PID>
```

### Migration hataları
```bash
# Tüm migration'ları sıfırla
dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Frontend bağlantı hatası
- `.env.local` dosyasının `front/` klasöründe olduğundan emin olun
- Backend'in çalıştığını kontrol edin: `curl http://localhost:5299/swagger`

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📧 İletişim

Aleyna Taşdemir - [@aleynatasdemir](https://github.com/aleynatasdemir)

Proje Linki: [https://github.com/aleynatasdemir/Digi-Mem](https://github.com/aleynatasdemir/Digi-Mem)
