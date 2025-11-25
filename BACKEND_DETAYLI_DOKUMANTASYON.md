# 🔧 BACKEND DETAYLI DOKÜMANTASYON

## 📚 İçindekiler
1. [Proje Özeti](#proje-özeti)
2. [Klasör Yapısı](#klasör-yapısı)
3. [Veritabanı (Database)](#veritabanı-database)
4. [API Endpoints](#api-endpoints)
5. [Kimlik Doğrulama (Authentication)](#kimlik-doğrulama)
6. [Spotify Entegrasyonu](#spotify-entegrasyonu)
7. [Güvenlik & Şifreleme](#güvenlik--şifreleme)
8. [Dosya Yönetimi](#dosya-yönetimi)
9. [Admin Paneli](#admin-paneli)

---

## 🎯 Proje Özeti

### Proje: Digi-Mem Backend (Dijital Anı Defteri)

Backend, kullanıcıların anılarını (fotoğraf, ses, metin, şarkı) saklayabileceği, organize edebileceği ve özet oluşturabileceği **REST API** uygulamasıdır.

**Teknoloji Stack:**
- **Dil:** C# (.NET 9)
- **Framework:** ASP.NET Core Web API
- **Veritabanı:** PostgreSQL
- **ORM:** Entity Framework Core 9
- **Kimlik Yönetimi:** ASP.NET Core Identity
- **Güvenlik:** JWT Tokens, Encryption
- **API Dokümentasyonu:** Swagger/OpenAPI
- **Dış Hizmet:** Spotify API

---

## 📁 Klasör Yapısı

```
backend/
├── Properties/              # Visual Studio project properties
│   └── launchSettings.json  # Development settings (ports, env vars)
├── Controllers/             # API Endpoints (İçerik yönetimi)
│   ├── AuthController.cs    # Giriş/Kayıt
│   ├── MemoriesController.cs # Anı CRUD işlemleri
│   ├── UploadController.cs  # Dosya yükleme
│   ├── SpotifyController.cs # Spotify operasyonları
│   ├── SpotifyAuthController.cs # Spotify OAuth
│   ├── UserController.cs    # Kullanıcı profili
│   └── AdminController.cs   # Yönetici paneli
│
├── Data/                    # Veritabanı & Entity Framework
│   ├── AppDbContext.cs      # Database bağlantısı ve tablolar
│   ├── Seed.cs              # Başlangıç verisi (örnek kullanıcılar)
│   └── Migrations/          # Veritabanı şema değişiklikleri
│       ├── 20251102181558_IdentityInit.cs
│       ├── 20251102200617_AddIdentityRoles.cs
│       ├── 20251102202555_AddEntries.cs
│       ├── 20251102223210_AddMemories.cs
│       ├── 20251102234133_AddSpotifyIntegration.cs
│       └── AppDbContextModelSnapshot.cs
│
├── Models/                  # Veri Modelleri (Tablolar)
│   ├── Memory.cs            # Anı verisi (Fotoğraf, Ses, Metin, Şarkı)
│   └── UserIntegration.cs   # Spotify bağlantısı & token saklama
│
├── Services/                # İş Mantığı (Business Logic)
│   ├── EncryptionService.cs # Şifreleme/Şifre çözme
│   └── Spotify/
│       ├── SpotifyOAuthService.cs   # Spotify OAuth akışı
│       ├── SpotifyApiService.cs     # Spotify API çağrıları
│       └── SpotifySyncService.cs    # Spotify şarkı senkronizasyonu
│
├── Program.cs               # Uygulama başlangıç noktası
├── DigiMem.csproj          # Proje dosyası (dependencies)
├── Dockerfile              # Docker container tanımı
├── appsettings.json        # Ayarlar (prod)
├── appsettings.Development.json # Ayarlar (dev)
└── wwwroot/                # Statik dosyalar (yüklenen resimler, vb)
    └── uploads/            # Kullanıcı tarafından yüklenen dosyalar
        ├── profiles/       # Profil fotoğrafları
        └── {userId}/       # Kullanıcıya özgü dosyalar
```

---

## 🗄️ Veritabanı (Database)

### Veritabanı Türü: PostgreSQL

PostgreSQL, open-source, güçlü ve ölçeklenebilir bir SQL veritabanıdır.

### Tablolar

#### 1. **AspNetUsers** (Kimlik Doğrulama - Built-in)
```
Kullanıcı bilgilerini ve şifrelerini saklayan tablo
─────────────────────────────────────────────
│ Sütun           │ Tip         │ Açıklama
─────────────────────────────────────────────
│ Id              │ string      │ Benzersiz kullanıcı ID
│ UserName        │ string      │ Kullanıcı adı (email genelde)
│ Email           │ string      │ E-posta
│ PasswordHash    │ string      │ Şifre (hash'lenmiş - şifreli)
│ EmailConfirmed  │ boolean     │ E-posta doğrulandı mı?
│ PhoneNumber     │ string      │ Telefon (opsiyonel)
│ CreatedAt       │ datetime    │ Oluşturma tarihi
│ ProfilePhotoUrl │ string      │ Profil fotoğrafı URL'i
│ IsBanned        │ boolean     │ Kullanıcı banlandı mı?
─────────────────────────────────────────────
```

**Örnek:**
```
Id: user123
Email: aleyna@example.com
UserName: aleyna
PasswordHash: AQAAAAEAAYagAAAAEO5wVcnT7...  (hash'lenmiş)
CreatedAt: 2025-11-01 10:30:00
ProfilePhotoUrl: /uploads/profiles/user123/profile.jpg
```

---

#### 2. **Memories** (Anılar)
```
Kullanıcıların anılarını (fotoğraf, ses, metin, şarkı) saklayan tablo
─────────────────────────────────────────────────────────
│ Sütun              │ Tip         │ Açıklama
─────────────────────────────────────────────────────────
│ Id                 │ int         │ Benzersiz anı ID
│ Type               │ string      │ Tür: photo, video, audio, text, music
│ Title              │ string      │ Başlık (opsiyonel)
│ Description        │ string      │ Açıklama/İçerik
│ MemoryDate         │ datetime    │ Anının tarihi (kullanıcı tarafından seçilir)
│ CreatedAt          │ datetime    │ Kaydedilme tarihi
│ UpdatedAt          │ datetime    │ Güncellenme tarihi (opsiyonel)
│ Tags               │ json array  │ Etiketler: ["tatil", "aile", vb]
│ FileUrl            │ string      │ Dosya URL'i (/uploads/...)
│ ThumbnailUrl       │ string      │ Küçük görüntü URL'i
│ MimeType           │ string      │ Dosya türü: image/jpeg, audio/mp3
│ FileSize           │ long        │ Dosya boyutu (byte)
│ DurationSeconds    │ int         │ Ses/video süresi (saniye)
│ TranscriptionText  │ string      │ Sesli anı yazılı versiyonu
│ SpotifyTrackId     │ string      │ Spotify şarkı ID'si
│ SongTitle          │ string      │ Şarkı adı
│ ArtistName         │ string      │ Sanatçı adı
│ AlbumName          │ string      │ Albüm adı
│ AlbumArtUrl        │ string      │ Albüm kapağı resmi URL'i
│ UserId             │ string (FK) │ Anıyı kimin oluşturduğu
─────────────────────────────────────────────────────────
```

**Örnek:**
```
Id: 1
Type: photo
Title: Bodrum Tatili
Description: Bodrum'da çekilmiş güzel bir anı
MemoryDate: 2025-07-15
FileUrl: /uploads/user123/photo1.jpg
Tags: ["tatil", "aile", "plaj"]
UserId: user123
```

---

#### 3. **UserIntegrations** (Dış Servis Bağlantıları - Spotify)
```
Kullanıcıların Spotify gibi dış hizmetlere bağlı olmasını saklayan tablo
─────────────────────────────────────────────────────────
│ Sütun                  │ Tip       │ Açıklama
─────────────────────────────────────────────────────────
│ Id                     │ int       │ Benzersiz bağlantı ID
│ UserId                 │ string    │ Kullanıcı ID (FK)
│ Provider               │ string    │ Hizmet adı: "Spotify"
│ EncryptedRefreshToken  │ string    │ Spotify refresh token (şifreli)
│ Scopes                 │ string    │ İzinler: "user-read-recently-played"
│ LastSyncedAt           │ datetime  │ Son senkronizasyon tarihi
│ CreatedAt              │ datetime  │ Bağlantı oluşturma tarihi
│ UpdatedAt              │ datetime  │ Güncellenme tarihi
│ IsActive               │ boolean   │ Bağlantı aktif mi?
─────────────────────────────────────────────────────────
```

**Örnek:**
```
Id: 5
UserId: user123
Provider: Spotify
EncryptedRefreshToken: AQC7Ov8J3kL... (şifreli)
LastSyncedAt: 2025-11-23 10:30:00
IsActive: true
```

---

#### 4. **SpotifyTracks** (Spotify Şarkıları)
```
Senkronize edilen Spotify şarkılarını saklayan tablo
─────────────────────────────────────────────────────────
│ Sütun             │ Tip        │ Açıklama
─────────────────────────────────────────────────────────
│ Id                │ int        │ Benzersiz kayıt ID
│ UserId            │ string     │ Kullanıcı ID (FK)
│ SpotifyTrackId    │ string     │ Spotify'daki şarkı ID'si
│ TrackName         │ string     │ Şarkı adı
│ ArtistName        │ string     │ Sanatçı adı
│ AlbumName         │ string     │ Albüm adı
│ AlbumArtUrl       │ string     │ Albüm kapağı resmi URL'i
│ SpotifyUri        │ string     │ Spotify linki
│ PlayedAt          │ datetime   │ Çalınma tarihi/saati
│ CreatedAt         │ datetime   │ Kayıt oluşturma tarihi
─────────────────────────────────────────────────────────
```

**Örnek:**
```
Id: 42
UserId: user123
SpotifyTrackId: 7qiZfU4dY1lhL7qm9xX3xQ
TrackName: Blinding Lights
ArtistName: The Weeknd
PlayedAt: 2025-11-23 15:45:00
```

---

#### 5. **AspNetRoles & AspNetUserRoles** (Yetki Sistemi - Built-in)
```
Kullanıcılara rol ve izin vermek için (Admin, User, vb.)
─────────────────────────────
│ AspNetRoles  │ Rol adları
├──────────────┼───────────────
│ Id           │ Admin
│ Name         │ User (varsayılan)
─────────────────────────────
```

---

### Veritabanı Ilişkileri (Relationships)

```
┌─────────────────────┐
│   AspNetUsers       │
│   (Kullanıcılar)    │
├─────────────────────┤
│ Id (PK)             │
│ Email               │
│ PasswordHash        │
│ CreatedAt           │
│ ProfilePhotoUrl     │
│ IsBanned            │
└────────┬────────────┘
         │
         │ 1:N (Bir kullanıcı birçok anı)
         │
┌────────▼────────────┐
│     Memories        │
│   (Anılar)          │
├─────────────────────┤
│ Id (PK)             │
│ UserId (FK) ────────┼─── AspNetUsers
│ Type                │
│ Title               │
│ FileUrl             │
│ SpotifyTrackId      │
└─────────────────────┘

         │
         │ 1:1 (Her şarkı bir SpotifyTrack)
         │
┌────────▼──────────────────────┐
│     SpotifyTracks             │
│   (Spotify Şarkıları)         │
├──────────────────────────────┤
│ Id (PK)                      │
│ UserId (FK) ────────┬────────┼─── AspNetUsers
│ SpotifyTrackId      │        │
│ TrackName           │        │
│ PlayedAt            │        │
└─────────────────────┘        │
                               │
         ┌─────────────────────┘
         │ 1:N (Bir kullanıcı
         │      birçok entegrasyon)
         │
┌────────▼──────────────────┐
│  UserIntegrations         │
│  (Dış Hizmetler)          │
├───────────────────────────┤
│ Id (PK)                   │
│ UserId (FK)               │
│ Provider (Spotify)        │
│ EncryptedRefreshToken     │
│ LastSyncedAt              │
└───────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. Authentication (Kimlik Doğrulama)
Kullanıcıları sisteme kayıt etmek ve giriş yapmak için.

#### Kayıt (Register)
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "kullanici@example.com",
  "password": "Sifre123!"
}

Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "kullanici@example.com",
    "name": "kullanici@example.com",
    "createdAt": "2025-11-23T10:30:00Z"
  }
}
```

**Ne yapıyor?**
- Yeni kullanıcı oluşturur
- Şifreyi hash'leyip veritabanına kaydeder
- JWT token oluşturur
- Token ve kullanıcı bilgisi döndürür

---

#### Giriş (Login)
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "kullanici@example.com",
  "password": "Sifre123!"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "kullanici@example.com",
    "name": "kullanici@example.com",
    "createdAt": "2025-11-23T10:30:00Z"
  }
}
```

**Ne yapıyor?**
- E-posta ve şifreyi kontrol eder
- Kullanıcıyı bulur
- Şifreyi doğrular
- JWT token oluşturur
- Yanıtta token geri döndürür

---

### 2. Memories (Anı Yönetimi)
Kullanıcıların anılarını eklemek, görmek, düzenlemek ve silmek için.

#### Anı Listesi Getir
```
GET /api/memories?page=1&pageSize=20&from=2025-01-01&to=2025-12-31&types=photo,video&tags=tatil&q=bodrum
Authorization: Bearer {token}

Response (200 OK):
{
  "items": [
    {
      "id": 1,
      "type": "photo",
      "title": "Bodrum Tatili",
      "description": "Güzel bir anı",
      "memoryDate": "2025-07-15T00:00:00Z",
      "fileUrl": "/uploads/user123/photo1.jpg",
      "tags": ["tatil", "aile"],
      "createdAt": "2025-11-23T10:30:00Z"
    },
    { ... }
  ],
  "total": 45,        // Toplam anı sayısı
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

**Parametreler:**
- `page`: Kaçıncı sayfa (1'den başlayan)
- `pageSize`: Her sayfada kaç anı göster
- `from`: Başlangıç tarihi (YYYY-MM-DD)
- `to`: Bitiş tarihi
- `types`: Tür filtresi (photo, video, audio, text, music)
- `tags`: Etiket filtresi
- `q`: Başlık/açıklamada arama

---

#### Tek Anı Getir
```
GET /api/memories/1
Authorization: Bearer {token}

Response (200 OK):
{
  "id": 1,
  "type": "photo",
  "title": "Bodrum Tatili",
  "description": "Güzel bir anı",
  "fileUrl": "/uploads/user123/photo1.jpg",
  "tags": ["tatil"],
  "createdAt": "2025-11-23T10:30:00Z"
}
```

---

#### Anı Oluştur (Ekle)
```
POST /api/memories
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "type": "photo",
  "title": "Yeni Fotoğraf",
  "description": "Açıklama",
  "date": "2025-11-23",
  "tags": ["tatil", "aile"],
  "fileUrl": "/uploads/user123/photo1.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 2048576
}

Response (201 Created):
{
  "id": 1,
  "type": "photo",
  "title": "Yeni Fotoğraf",
  ...
}
```

**Ne yapıyor?**
- Yeni anı kaydını oluşturur
- Dosya bilgilerini kaydeder
- Etiketleri kaydeder
- Anı ID'sini döndürür

---

#### Anı Güncelle (Düzenle)
```
PUT /api/memories/1
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "Güncellenmiş Başlık",
  "description": "Yeni açıklama",
  "tags": ["yeni_etiket"]
}

Response (200 OK):
{
  "id": 1,
  "title": "Güncellenmiş Başlık",
  ...
}
```

---

#### Anı Sil
```
DELETE /api/memories/1
Authorization: Bearer {token}

Response (204 No Content)
```

---

#### İstatistik Getir
```
GET /api/memories/stats
Authorization: Bearer {token}

Response (200 OK):
{
  "total": 45,        // Toplam anı sayısı
  "totalMemories": 45,
  "thisWeek": 5,      // Bu hafta eklenen
  "thisMonth": 12,    // Bu ay eklenen
  "byType": {
    "photo": 20,
    "video": 5,
    "audio": 10,
    "text": 8,
    "music": 2
  }
}
```

---

### 3. Upload (Dosya Yükleme)
Fotoğraf, video, ses dosyalarını sunucuya yüklemek için.

#### Dosya Yükle
```
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
File: [Binary Data]
Filename: photo.jpg (100MB limit)

Response (200 OK):
{
  "fileUrl": "/uploads/user123/uuid.jpg",
  "thumbnailUrl": "/uploads/user123/uuid.jpg",
  "fileName": "photo.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 2048576
}
```

**Ne yapıyor?**
- Dosyayı `wwwroot/uploads/{userId}/` klasörüne kaydeder
- URL oluşturur
- Dosya bilgilerini döndürür

---

#### Dosya Sil
```
DELETE /api/upload?fileUrl=/uploads/user123/uuid.jpg
Authorization: Bearer {token}

Response (204 No Content)
```

---

### 4. Spotify Entegrasyonu
Spotify hesabını bağlamak ve şarkı senkronizasyonu.

#### Spotify Bağlantısını Başlat
```
GET /oauth/spotify/connect
Authorization: Bearer {token}

Redirects to:
https://accounts.spotify.com/authorize?...
(Spotify giriş ekranı açılır)
```

---

#### Spotify Callback
```
GET /oauth/spotify/callback?code=ABC123&state=STATE123

(Otomatik işlenir)
Redirects back to:
/dashboard/settings?spotify_connected=true
```

**Ne yapıyor?**
- Spotify'dan code alır
- Token'ı alır
- UserIntegrations tablosuna kaydeder (şifreli)
- Dashboard'a yönlendirir

---

#### Spotify Senkronizasyon
```
POST /api/spotify/sync
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "tracksAdded": 15,
  "message": "Recently played tracks synced",
  "lastSyncedAt": "2025-11-23T10:30:00Z"
}
```

**Ne yapıyor?**
- Spotify'dan yakın tarihte çalınan şarkıları getirir
- SpotifyTracks tablosuna kaydeder
- Her anı olarak da kaydedebilir

---

#### En Çok Çalınan Şarkıları Getir
```
GET /api/spotify/top-tracks?limit=20
Authorization: Bearer {token}

Response (200 OK):
{
  "tracks": [
    {
      "id": "track1",
      "spotifyTrackId": "7qiZfU4dY1lhL7qm9xX3xQ",
      "trackName": "Blinding Lights",
      "artistName": "The Weeknd",
      "albumName": "After Hours",
      "playedAt": "2025-11-23T15:45:00Z"
    },
    { ... }
  ]
}
```

---

#### Spotify Özeti Getir
```
GET /api/spotify/summary
Authorization: Bearer {token}

Response (200 OK):
{
  "period": "Bu Ay",
  "totalPlays": 45,
  "topArtists": [
    { "artist": "The Weeknd", "playCount": 12 },
    { "artist": "Dua Lipa", "playCount": 8 }
  ],
  "topTracks": [
    { "trackName": "Blinding Lights", "playCount": 5 }
  ]
}
```

---

### 5. User (Kullanıcı Profili)
Kullanıcı bilgilerini yönetmek için.

#### Profil Getir
```
GET /api/user/profile
Authorization: Bearer {token}

Response (200 OK):
{
  "id": "user123",
  "email": "kullanici@example.com",
  "userName": "kullanici",
  "profilePhotoUrl": "/uploads/profiles/user123/profile.jpg",
  "emailConfirmed": true,
  "memberSince": "2025-11-01T10:30:00Z"
}
```

---

#### Profil Fotoğrafı Yükle
```
POST /api/user/profile-photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
File: [Image File - max 5MB]

Response (200 OK):
{
  "profilePhotoUrl": "/uploads/profiles/user123/profile_abc123.jpg",
  "message": "Profil fotoğrafı güncellendi."
}
```

---

#### Profil Güncelle
```
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "userName": "yeni_isim",
  "email": "yeni@example.com"
}

Response (200 OK):
{
  "id": "user123",
  "userName": "yeni_isim",
  "email": "yeni@example.com"
}
```

---

#### Şifre Değiştir
```
PUT /api/user/password
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "currentPassword": "EskiSifre123!",
  "newPassword": "YeniSifre123!"
}

Response (200 OK):
{
  "message": "Password changed successfully"
}
```

---

### 6. Admin (Yönetici Paneli)
Yöneticilerin kullanıcıları yönetmesi için. (`Authorization: Bearer {admin_token}`)

#### Kullanıcı Listesi
```
GET /api/admin/users?page=1&pageSize=20&search=john&isBanned=false
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "users": [
    {
      "id": "user123",
      "email": "john@example.com",
      "userName": "john",
      "isBanned": false,
      "createdAt": "2025-11-01T10:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

---

#### Kullanıcı Detayı
```
GET /api/admin/users/user123
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "user": { ... },
  "statistics": {
    "totalMemories": 45,
    "todayMemories": 2,
    "weekMemories": 5,
    "monthMemories": 12,
    "memoriesByType": {
      "photo": 20,
      "video": 5
    },
    "last30Days": [
      { "date": "2025-11-23", "count": 2 },
      { ... }
    ]
  }
}
```

---

#### Kullanıcıyı Banla
```
POST /api/admin/users/user123/ban
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "message": "Kullanıcı banlandı.",
  "user": {
    "id": "user123",
    "email": "john@example.com",
    "isBanned": true
  }
}
```

**Ne olur?**
- `IsBanned` alanı `true` olur
- Kullanıcı giriş yapamaz
- Login sırasında hata alır

---

#### Kullanıcının Banını Kaldır
```
POST /api/admin/users/user123/unban
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "message": "Kullanıcının banı kaldırıldı.",
  "user": {
    "id": "user123",
    "isBanned": false
  }
}
```

---

#### Global İstatistikler
```
GET /api/admin/stats
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "users": {
    "total": 100,
    "banned": 5,
    "active": 95,
    "newToday": 2,
    "newWeek": 8,
    "newMonth": 25
  },
  "memories": {
    "total": 5000,
    "today": 45,
    "week": 250,
    "month": 1200
  }
}
```

---

## 🔐 Kimlik Doğrulama (Authentication)

### JWT Token Nedir?

JWT (**JSON Web Token**) bir güvenlik protokolüdür. Kullanıcı giriş yaptığında:

```
1. Giriş (Login)
   ├─ E-posta & Şifre gönder
   └─ Sunucu JWT token oluşturur

2. Token Yapısı
   ├─ Header: {alg: "HS256", typ: "JWT"}
   ├─ Payload: {userId: "123", email: "user@...", exp: 1234567890}
   └─ Signature: Hash(Header + Payload + Secret)

3. Token Döndürülür
   └─ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQ...

4. Her İstekte Token Gönder
   └─ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

5. Sunucu Token Doğrular
   ├─ Signature kontrol et
   ├─ Süresi dolmadı mı kontrol et
   └─ İstemi işle veya reddet
```

### Token Özellikleri

```csharp
// Program.cs'de tanımlanmıştır
var tokenDescriptor = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(claims),
    Expires = DateTime.UtcNow.AddDays(7),  // 7 gün geçerli
    SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha256Signature)
};
```

- **Geçerlilik:** 7 gün
- **Algoritma:** HMAC-SHA256
- **İçerik:** Kullanıcı ID, Email, Roller

### Kullanım Örneği

Frontend'de:
```javascript
// 1. Login yapıp token al
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({email, password})
});
const {token} = await response.json();

// 2. LocalStorage'a kaydet
localStorage.setItem('token', token);

// 3. Her istekte gönder
fetch('/api/memories', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎵 Spotify Entegrasyonu

### Spotify OAuth Akışı

```
┌──────────────┐
│   Kullanıcı  │
└──────┬───────┘
       │ "Spotify Bağla" tıkla
       ▼
┌────────────────────────────────────────────┐
│ 1. Backend /oauth/spotify/connect oluştur  │
│    - state = unique ID                     │
│    - codeVerifier = security key           │
│    - Spotify auth URL'i oluştur            │
└────────┬─────────────────────────────────┘
         │ Redirect
         ▼
   ┌──────────────────┐
   │ Spotify Giriş    │
   │ (Tarayıcı)       │
   └────────┬─────────┘
            │ "Onayla"
            ▼
   ┌──────────────────────────────────────┐
   │ Spotify: Authorization Code verir    │
   └────────┬─────────────────────────────┘
            │ callback?code=ABC123&state=XYZ
            ▼
┌────────────────────────────────────────────────────┐
│ 2. Backend /oauth/spotify/callback                 │
│    - State doğrula                                 │
│    - Code ve CodeVerifier ile Token al             │
│    - RefreshToken şifrele ve kaydet               │
│    - Dashboard'a redirect                          │
└────────────────────────────────────────────────────┘
         │ Redirect
         ▼
   ┌──────────────────┐
   │ Dashboard        │
   │ (Spotify Bağlı!) │
   └──────────────────┘
```

### Spotify Services

#### 1. **SpotifyOAuthService** - OAuth Yönetimi

```csharp
public interface ISpotifyOAuthService
{
    // Spotify giriş URL'sini oluştur
    string GenerateAuthorizeUrl(string state, string codeVerifier);
    
    // Authorization code'ı token'a çevir
    Task<(string AccessToken, string RefreshToken, int ExpiresIn)?> 
        ExchangeCodeForTokenAsync(string code, string codeVerifier);
    
    // Eski refresh token ile yeni access token al
    Task<string?> RefreshAccessTokenAsync(string refreshToken);
    
    // PKCE güvenliği için kod oluştur
    string GenerateCodeVerifier();
    string GenerateCodeChallenge(string codeVerifier);
}
```

**Örnek Kullanım:**
```csharp
var spotifyAuth = serviceProvider.GetService<ISpotifyOAuthService>();

// 1. Giriş URL'si oluştur
var state = Guid.NewGuid().ToString();
var codeVerifier = spotifyAuth.GenerateCodeVerifier();
var authUrl = spotifyAuth.GenerateAuthorizeUrl(state, codeVerifier);
// authUrl → https://accounts.spotify.com/authorize?...

// 2. Callback'te code'u token'a çevir
var result = await spotifyAuth.ExchangeCodeForTokenAsync(code, codeVerifier);
// result = (accessToken, refreshToken, 3600)

// 3. Token süresi dolunca refresh et
var newAccessToken = await spotifyAuth.RefreshAccessTokenAsync(refreshToken);
// newAccessToken = "BQC7Ov8J3kL..."
```

---

#### 2. **SpotifyApiService** - API Çağrıları

```csharp
public interface ISpotifyApiService
{
    Task<List<PlayHistory>> GetRecentlyPlayedAsync(string accessToken);
    Task<PlayHistory?> GetCurrentPlayingAsync(string accessToken);
    Task<List<PlayHistory>> GetTopTracksAsync(string accessToken, TimeRange timeRange);
}
```

**Ne yapıyor?**
- `GetRecentlyPlayedAsync`: Yakın zamanda çalınan şarkıları getirir
- `GetCurrentPlayingAsync`: Şu an çalınan şarkıyı getirir
- `GetTopTracksAsync`: En çok çalınan şarkıları getirir

---

#### 3. **SpotifySyncService** - Senkronizasyon

```csharp
public interface ISpotifySyncService
{
    Task<SyncResult> SyncRecentlyPlayedAsync(string userId, string accessToken);
    Task<List<SpotifyTrack>> GetUserTopTracksAsync(string userId, int limit);
}
```

**SyncResult:**
```csharp
public class SyncResult
{
    public bool Success { get; set; }
    public int TracksAdded { get; set; }
    public string Message { get; set; }
}
```

**Örnek:**
```csharp
var syncService = serviceProvider.GetService<ISpotifySyncService>();

// Spotify şarkılarını veritabanına senkronize et
var result = await syncService.SyncRecentlyPlayedAsync("user123", accessToken);

// result.Success = true
// result.TracksAdded = 15
// result.Message = "Recently played tracks synced"
```

---

## 🔒 Güvenlik & Şifreleme

### EncryptionService - Sensitive Veri Şifrelemesi

Spotify refresh token'ı veritabanında şifreli olarak saklanır.

```csharp
public class EncryptionService : IEncryptionService
{
    public string Encrypt(string plainText)
    {
        // AES-256 ile şifrele
        // Sonuç: Base64 string
    }
    
    public string Decrypt(string cipherText)
    {
        // Şifreli metni çöz
        // Sonuç: Orijinal metin
    }
}
```

**Örnek:**
```csharp
var encryptionService = serviceProvider.GetService<IEncryptionService>();

// Refresh token'ı şifrele
var plainToken = "BQDT2V...";
var encrypted = encryptionService.Encrypt(plainToken);
// encrypted = "AQC7Ov8J3kL..."

// Veritabanından oku ve şifreyi çöz
var stored = userIntegration.EncryptedRefreshToken; // "AQC7Ov8J3kL..."
var decrypted = encryptionService.Decrypt(stored);  // "BQDT2V..."
```

### Şifreleme Algoritması

```
AES-256-CBC
├─ IV (Initialization Vector): Random 16 byte
├─ Key: 32 byte (ilk 32 karakter dari Encryption:Key)
└─ Mode: CBC (Cipher Block Chaining)

Şifreleme adımları:
1. IV oluştur
2. Plain text'i AES-256 ile şifrele
3. IV + Encrypted data birleştir
4. Base64 encode et
5. Veritabanına kaydet

Şifre çözme adımları:
1. Base64 decode et
2. IV ve encrypted data ayır
3. AES-256 ile şifresi çöz
4. Orijinal metni döndür
```

---

## 📁 Dosya Yönetimi

### Dosya Upload Akışı

```
┌─────────────┐
│ Kullanıcı   │
│ Dosya Seç   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ Frontend                     │
│ FormData + File + Token      │
│ POST /api/upload             │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Backend Upload Controller            │
│ 1. Token doğrula                     │
│ 2. Dosya türü kontrol                │
│ 3. Dosya boyutu kontrol (100 MB)     │
│ 4. Unique filename oluştur (UUID)    │
│ 5. Klasör oluştur: wwwroot/uploads/{userId}/
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Disk (Sunucu)                      │
│ /uploads/user123/uuid.jpg          │
│ /uploads/user123/uuid.mp4          │
└────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Response                             │
│ {                                    │
│   "fileUrl": "/uploads/user123/...", │
│   "mimeType": "image/jpeg",          │
│   "fileSize": 2048576               │
│ }                                    │
└──────────────────────────────────────┘
```

### Klasör Yapısı

```
wwwroot/
├── uploads/
│   ├── profiles/
│   │   └── user123/
│   │       ├── profile_abc123.jpg
│   │       └── profile_def456.jpg
│   │
│   └── user123/
│       ├── photo1-uuid.jpg
│       ├── photo2-uuid.jpg
│       ├── video1-uuid.mp4
│       ├── audio1-uuid.m4a
│       └── ...
```

### Upload Sınırları

```
Maksimum dosya boyutu: 100 MB
İzin verilen MIME types:
- image/jpeg
- image/png
- image/gif
- video/mp4
- audio/mpeg
- audio/mp4
```

---

## 👨‍💼 Admin Paneli

### Admin Yetkileri

Sadece `Admin` rol'üne sahip kullanıcılar erişebilir.

```csharp
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    // Admin fonksiyonları
}
```

### Test Admin Hesapları

Backend başladığında otomatik oluşturulur (`Seed.cs`):

```
Admin 1:
Email: admin@local
Password: Admin!12345

Admin 2:
Email: aleyna@admin
Password: aley12345

Regular Users (Test):
Email: user@local
Password: User123!

Email: test@local
Password: Test123!

Email: demo@user.com
Password: Demo123!
```

### Admin Özellikleri

1. **Kullanıcı Yönetimi**
   - Tüm kullanıcıları görüntüle
   - Kullanıcıyı banla
   - Kullanıcıyı unban yap

2. **Global İstatistikler**
   - Toplam kullanıcı
   - Toplam anı
   - Son 30 gün aktivitesi

---

## 🚀 Başlangıç & Konfigürasyon

### appsettings.Development.json

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Database=digimem;Username=postgres;Password=password"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-min-32-characters-long!"
  },
  "Spotify": {
    "ClientId": "your_spotify_client_id",
    "ClientSecret": "your_spotify_client_secret",
    "RedirectUri": "http://localhost:5000/oauth/spotify/callback"
  },
  "Encryption": {
    "Key": "your-encryption-key-min-32-characters-long!"
  }
}
```

### Program.cs Başlangıç Akışı

```csharp
var app = builder.Build();

// 1. Migration çalıştır
// 2. Admin seed et
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();  // Tüm migration'ları çalıştır
    await Seed.EnsureAdmin(scope.ServiceProvider);  // Admin oluştur
}

// 3. Swagger aç (development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();  // http://localhost:5000/swagger/ui/
}

// 4. CORS ayarla (web, mobil)
app.UseCors("AllowMobile");

// 5. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// 6. API endpoints'leri map et
app.MapControllers();

// 7. Uygulama başla
app.Run();  // http://localhost:5000
```

---

## 🔄 Veritabanı Migration'ları

Migration'lar, veritabanı şemasının zaman içinde nasıl değiştiğini izlemek için kullanılır.

```
Migrations/
├── 20251102181558_IdentityInit.cs
│   └─ AspNetUsers, AspNetRoles tablolarını oluştur
│
├── 20251102200617_AddIdentityRoles.cs
│   └─ "Admin" rolü oluştur
│
├── 20251102202555_AddEntries.cs
│   └─ Memories tablosu oluştur
│
├── 20251102223210_AddMemories.cs
│   └─ Memories tabloya Spotify alanları ekle
│
├── 20251102234133_AddSpotifyIntegration.cs
│   └─ UserIntegrations, SpotifyTracks tabloları oluştur
│
└── AppDbContextModelSnapshot.cs
    └─ Güncel şema snapshot'ı
```

### Migration Çalıştırma

```bash
# Tüm pending migration'ları çalıştır
dotnet ef database update

# Belirli migration'a git
dotnet ef database update 20251102200617_AddIdentityRoles

# Migration oluştur (model değiştirdikten sonra)
dotnet ef migrations add AddNewColumn

# Migration kodunu incele
dotnet ef migrations script
```

---

## 📊 Entity-Relationship Diagram (ERD)

```
┌──────────────────────────────────────────────────────────────────┐
│                     VERITABANI ŞEMASI                             │
└──────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐
│       AspNetUsers (Kullanıcılar)   │
├────────────────────────────────────┤
│ PK: Id (string)                    │
│ Email                              │
│ PasswordHash (şifreli)             │
│ EmailConfirmed                     │
│ CreatedAt                          │
│ ProfilePhotoUrl                    │
│ IsBanned                           │
└────────────────┬───────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        │ 1:N             │ 1:N
        ▼                 ▼
┌──────────────────┐  ┌──────────────────────┐
│ Memories         │  │ UserIntegrations     │
├──────────────────┤  ├──────────────────────┤
│ PK: Id           │  │ PK: Id               │
│ FK: UserId       │  │ FK: UserId           │
│ Type             │  │ Provider (Spotify)   │
│ Title            │  │ EncryptedRefreshToken
│ Description      │  │ LastSyncedAt         │
│ FileUrl          │  │ IsActive             │
│ Tags (json)      │  └──────────────────────┘
│ SpotifyTrackId   │
│ CreatedAt        │
└──────────────────┘

        │
        │ 1:N
        ▼
┌──────────────────────────┐
│ SpotifyTracks            │
├──────────────────────────┤
│ PK: Id                   │
│ FK: UserId               │
│ SpotifyTrackId           │
│ TrackName                │
│ ArtistName               │
│ AlbumName                │
│ PlayedAt                 │
└──────────────────────────┘
```

---

## ✅ Özet: Backend'de Ne Oluyor?

```
1. KULLANICI KAYDETMESİ
   ├─ Email + Şifre gönder
   ├─ Şifre hash'leme ve kaydetme
   ├─ JWT token oluşturma
   └─ Token döndürme

2. ANILARIN YÖNETİMİ
   ├─ Yeni anı ekle (fotoğraf, ses, metin, şarkı)
   ├─ Anıları listele (filtreleme, sayfalama)
   ├─ Tek anı getir
   ├─ Anı düzenle
   ├─ Anı sil
   └─ İstatistikler

3. DOSYA YÖNETIMI
   ├─ Dosya upload
   ├─ Klasör oluşturma
   ├─ Unique filename
   └─ Dosya silme

4. SPOTIFY ENTEGRASYONU
   ├─ OAuth bağlantısı
   ├─ Refresh token şifreleme
   ├─ Şarkıları senkronize etme
   ├─ En çok çalınan şarkıları getirme
   └─ Spotify özeti

5. KULLANICI PROFİLİ
   ├─ Profil bilgileri
   ├─ Profil fotoğrafı yükleme
   ├─ Profil güncelleme
   └─ Şifre değiştirme

6. YÖNETİCİ PANELİ
   ├─ Kullanıcı yönetimi
   ├─ Ban/Unban işlemleri
   ├─ Global istatistikler
   └─ Kullanıcı ayrıntıları
```

---

## 🎓 Öğrenmeyi Kolaylaştıran İpuçları

### Swagger UI ile Test Etme

Tarayıcıda `http://localhost:5000/swagger/ui/` açarsanız tüm API'leri test edebilirsiniz.

```
1. Giriş yap (/api/auth/login)
   ├─ Email: admin@local
   ├─ Password: Admin!12345
   └─ Token kopyala

2. Swagger UI sağ üstte "Authorize" butonuna tıkla
   └─ Token'ı yapıştır

3. Şimdi herhangi bir endpoint'i test edebilirsin
   ├─ /api/memories
   ├─ /api/upload
   ├─ /api/user/profile
   └─ vb.
```

### Logs İnceleme

`Program.cs`'de logging aktif olduğu için konsol çıktısında logs görebilirsin.

```
[AuthController] User login_successful for email: admin@local
[MemoriesController] GetMemories for user: user123, count: 10
[UploadController] File uploaded: uuid.jpg by user user123
[SpotifyController] spotify_sync_started for user: user123
```

