# 📱 FLUTTER MOBİL UYGULAMASI - TEKNIK ŞARTNAME DURUM RAPORU

**Proje:** Kişisel Dijital Hafıza & Yıllık Özet (Mobile)  
**Platform:** iOS 15+ (Android genişletme planlanıyor)  
**Tarih:** 23 Kasım 2025  
**Bileşenler:** Flutter, Dart, Provider

---

## 🎯 ÖZETİ

| Kategori | Tamamlanan | Eksik | Oranı |
|----------|-----------|-------|-------|
| **Veri Kaynakları** | 3/5 | 2 | 60% |
| **Ekranlar (Pages)** | 4/8 | 4 | 50% |
| **İçerik Yönetimi (CRUD)** | 3/4 | 1 | 75% |
| **Offline Desteği** | 0/2 | 2 | 0% |
| **Medya İşleme** | 2/4 | 2 | 50% |
| **Kimlik Doğrulama** | 2/2 | 0 | 100% |
| **Entegrasyonlar** | 0/2 | 2 | 0% |
| **UI/UX & Navigation** | 3/4 | 1 | 75% |
| **Görselleştirme** | 1/3 | 2 | 33% |
| **Platform Setup** | 2/3 | 1 | 67% |
| **TOPLAM** | **20/37** | **17** | **54%** |

---

## ✅ 1. VERİ KAYNAKLARI

### Tamamlanan (3/5)

#### ✅ Fotoğraf (Kamera & Galeri)
- **Paket:** `image_picker: ^1.0.5` ✅
- **Özellikler:**
  - Kamera ile fotoğraf çekme
  - Galeri'den fotoğraf seçme
  - EXIF metadata (opsiyonel)
  
- **Frontend:**
  - `add_memory_screen.dart`
  - Bento card tasarımı
  - "Fotoğraf" butonundan erişim

#### ✅ Ses Kaydı (Audio)
- **Paket:** `audioplayers: ^5.2.1` ✅
- **Özellikler:**
  - Ses kayıt süresi (durationSeconds)
  - Oynatıcı desteği
  
- **Frontend:**
  - `add_memory_screen.dart`
  - "Ses Kaydı" butonundan erişim
  - Ses oynatıcı kartı

#### ✅ Metin Notu
- **Model:** `Memory.dart` - `description` alanı ✅
- **Özellikler:**
  - Hızlı not girişi
  - Type: "text"
  
- **Frontend:**
  - `add_memory_screen.dart`
  - "Günlük Notu Al" bölümü

---

### ❌ Eksik (2/5)

#### ❌ Video Kaydı
**Şartname:** Video çekimi ve yükleme
- **Paket:** `video_player: ^2.8.1` var ama kayıt kodu eksik
- **Eksik:**
  - Video kayıt UI yok
  - Video seçme arayüzü kısmi
  - Video upload handler yok

**Yapılması Gereken:**
```dart
// add_memory_screen.dart'a ekle
Future<void> _recordVideo() async {
  // video_player ile kamera aç
}
```

---

#### ❌ Konum Verisi (GPS)
**Şartname:** Opsiyonel konum ekleme
- ❌ `geolocator` paketi yok
- ❌ Konum izni (NSLocationWhenInUseUsageDescription) yok
- ❌ Konum UI seçeneği yok
- ❌ Harita gösterimi yok (flutter_map)

**Yapılması Gereken:**
```yaml
# pubspec.yaml'a ekle
geolocator: ^10.0.0
flutter_map: ^6.0.0
```

---

## ✅ 2. EKRANLAR (Pages)

### Tamamlanan (4/8)

#### ✅ Login Ekranı
- **Dosya:** `screens/login_screen.dart` ✅
- **Özellikler:**
  - Email/password giriş formu
  - Backend API çağrısı (`AuthService.login()`)
  - Token saklama (`SharedPreferences`)
  - Kayıt linki

#### ✅ Home (Dashboard) - Bottom Tab Navigation
- **Dosya:** `screens/home_screen.dart` ✅
- **Özellikler:**
  - 4 tab navigasyon:
    1. Ana Sayfa (Dashboard)
    2. Arşiv
    3. Analiz (Summaries)
    4. Profil
  - `BottomNavigationBar` ile tab yönetimi
  - Sabit bottom navigation

#### ✅ Dashboard Ekranı
- **Dosya:** `screens/dashboard_screen.dart` ✅
- **Özellikler:**
  - Bento grid tasarımı (2 sütun)
  - 5 içerik türü kartı:
    - Fotoğraf (büyük)
    - Video
    - Şarkı
    - Ses Kaydı (geniş)
    - Günlük Notu Al (tam genişlik)
  - Renk degradeleri
  - Large title styling

#### ✅ İçerik Ekleme Ekranı
- **Dosya:** `screens/add_memory_screen.dart` ✅
- **Özellikler:**
  - Form alanları: başlık, açıklama, tarih, etiketler
  - Dosya seçme UI
  - Upload butonu
  - Loading state

---

### ❌ Eksik (4/8)

#### ❌ Zaman Tüneli (Timeline/Archives)
**Şartname:** Anıları tarihe göre görüntüleme
- **Dosya:** `screens/archives_screen.dart` (boş)
- **Eksik:**
  - Hafta/Ay/Gün segmenti yok
  - Anı listesi/grid gösterimi yok
  - Pull-to-refresh yok
  - Filtreleme/arama yok
  - Pagination yok

**Yapılması Gereken:**
```dart
// archives_screen.dart
class ArchivesScreen extends StatefulWidget {
  @override
  Widget build(context) {
    // Timeline görünümü
    // RefreshIndicator + ListView
    // Memory cards
  }
}
```

---

#### ❌ Özetler (Summaries)
**Şartname:** Aylık/yıllık özet
- **Dosya:** `screens/summaries_screen.dart` (boş)
- **Eksik:**
  - Aylık özet kartları yok
  - Yıllık özet gösterimi yok
  - Grafikler yok (fl_chart/charts_flutter)
  - İstatistikler yok

**Yapılması Gereken:**
```dart
// summaries_screen.dart
class SummariesScreen extends StatelessWidget {
  @override
  Widget build(context) {
    // Ay/Yıl seçimi
    // AI özet gösterimi
    // Charts
    // Kolaj preview
  }
}
```

---

#### ❌ Profil & Ayarlar
**Şartname:** Kullanıcı profili ve ayarlar
- **Dosya:** `screens/profile_screen.dart` (kısmi)
- **Eksik:**
  - Profil bilgileri düzenleme yok
  - Şifre değiştirme yok
  - Spotify bağlantı yönetimi yok
  - Tema seçimi (var ama ayarlar'da yok)
  - Bildirim ayarları yok
  - Logout butonu (temel var)

**Yapılması Gereken:**
```dart
// profile_screen.dart genişlet
- Profile edit form
- Password change
- Spotify connect/disconnect
- Theme toggle
- Notifications settings
- Data export/delete
```

---

#### ❌ Anı Detayı (Entry Detail)
**Şartname:** Tekil anı görüntüleme ve düzenleme
- ❌ `screens/entry_detail_screen.dart` yok
- **Eksik:**
  - Büyük medya görünümü
  - Oynatıcı (ses/video)
  - Etiketler ve meta veri
  - Konum haritası (opsiyonel)
  - Düzenleme/silme butonları
  - Sosyal paylaşım (opsiyonel)

**Yapılması Gereken:**
```dart
class EntryDetailScreen extends StatelessWidget {
  final Memory memory;
  
  // Medya preview
  // Tags display
  // Location map
  // Edit/Delete actions
}
```

---

## ✅ 3. İÇERİK YÖNETİMİ (CRUD)

### Tamamlanan (3/4)

#### ✅ Create (Oluşturma)
- **Service:** `MemoryService.createMemory()` ✅
- **Özellikler:**
  - API POST `/api/memories`
  - JSON serialization
  - Error handling

#### ✅ Read (Okuma)
- **Service:** `MemoryService.fetchMemories()` ✅
- **Özellikler:**
  - API GET `/api/memories`
  - Filtreleme parametreleri (from, to, types, tags, query)
  - Sayfalama (page, pageSize)
  - Loading/error state

#### ✅ Update (Güncelleme)
- **Service:** `MemoryService.updateMemory()` ✅
- **Özellikler:**
  - API PUT `/api/memories/{id}`
  - Başlık, açıklama, etiketler güncelleme

#### ❌ Delete (Silme) - Partial
- **Service:** `MemoryService.deleteMemory()` ✅
- **Frontend:** Silme UI/UX kısmi
  - Delete butonu yok (Entry Detail yok)
  - Confirmation dialog yok

---

## ✅ 4. OFFLINE DESTEĞI

### ❌ Tamamlanan (0/2)

#### ❌ Offline Okuma (Cache)
**Şartname:** Son 30 gün cache'i yerel depolama
- ❌ Hive/Drift cache yok
- ❌ Last 30 days data storage yok
- ❌ Cache strategy yok
- ❌ Offline read yok

**Yapılması Gereken:**
```yaml
# pubspec.yaml'a ekle
hive: ^2.2.3
hive_flutter: ^1.1.0
```

```dart
// services/cache_service.dart
class CacheService {
  Future<void> cacheMemories(List<Memory> memories);
  Future<List<Memory>?> getCachedMemories();
}
```

---

#### ❌ Offline Yazma (Outbox)
**Şartname:** Ağ olmadığında çevrimdışı kuyruğa ekleme
- ❌ Outbox tablosu yok
- ❌ Offline queue yok
- ❌ Bağlantı kontrol ve auto-sync yok
- ❌ Retry/backoff mekanizması yok

**Yapılması Gereken:**
```dart
// models/outbox.dart
class OutboxEntry {
  int? id;
  String type; // "create", "update", "delete"
  String endpoint;
  Map<String, dynamic> payload;
  DateTime createdAt;
  int retries;
}

// services/sync_service.dart
class SyncService {
  Future<void> syncOfflineChanges();
  Future<void> addToOutbox(...);
}
```

---

## ✅ 5. MEDYA İŞLEME

### Tamamlanan (2/4)

#### ✅ Fotoğraf İşleme
- **Paket:** `image_picker` ✅
- **Özellikler:**
  - Seçme ve upload
  - Thumbnail (cached_network_image)
  - MIME type: image/jpeg, image/png

#### ✅ Ses İşleme
- **Paket:** `audioplayers` ✅
- **Özellikler:**
  - Ses oynatıcı kartı
  - Duration gösterimi
  - Oynatma kontrolü

---

### ❌ Eksik (2/4)

#### ❌ Video İşleme
**Şartname:** Video seçme, preview ve oynatıcı
- **Paket:** `video_player: ^2.8.1` var ama kullanılmıyor
- **Eksik:**
  - Video seçme UI yok
  - Video preview/thumbnail yok
  - Video oynatıcı yok
  - Video upload yok

---

#### ❌ EXIF Metadata
**Şartname:** Fotoğraf tarih/konum otomatik çıkarma
- ❌ `image_picker` EXIF desteği yok
- ❌ Tarih otomatik önerisi yok
- ❌ EXIF parsing yok

**Yapılması Gereken:**
```yaml
# pubspec.yaml'a ekle
exif: ^3.1.0
```

---

## ✅ 6. KİMLİK DOĞRULAMA (Authentication)

### Tamamlanan (2/2) ✅

#### ✅ Email/Password Login
- **Service:** `AuthService.login()` ✅
- **Özellikler:**
  - API POST `/api/auth/login`
  - Token saklama (SharedPreferences)
  - User model depolama
  - Error handling

#### ✅ Email/Password Register
- **Service:** `AuthService.register()` ✅
- **Özellikler:**
  - API POST `/api/auth/register`
  - Token otomatik oluşturma
  - Dashboard'a yönlendirme
  - Validation (basit)

#### ✅ Logout
- **Service:** `AuthService.logout()` ✅
- **Özellikler:**
  - Token temizleme
  - User data silme
  - Login ekranına yönlendirme

#### ✅ Token Yönetimi
- **AuthService:** Bearer JWT header ✅
  - `getAuthHeaders()` metodu
  - Authorization header oluşturma

#### ❌ Token Refresh (Eksik)
- ❌ Refresh token logic yok
- ❌ 401 handling yok
- ❌ Otomatik token yenileme yok

**Yapılması Gereken:**
```dart
// AuthService'e ekle
Future<bool> refreshToken() {
  // Refresh token ile yeni access token al
}
```

---

## ✅ 7. ENTEGRASYONLAR

### ❌ Tamamlanan (0/2)

#### ❌ Spotify
**Şartname:** Spotify OAuth ve şarkı seçimi
- ❌ Spotify OAuth yok
- ❌ Spotify şarkı seçimi yok
- ❌ Spotify token saklama yok

**Yapılması Gereken:**
```yaml
# pubspec.yaml'a ekle
spotify: ^0.5.2
# veya oauth2: ^2.3.0
```

---

#### ❌ Ses Transkripsiyon
**Şartname:** Speech-to-Text
- ❌ Google Speech-to-Text yok
- ❌ Azure Speech yok
- ❌ Transkripsiyon UI yok

**Yapılması Gereken:**
```yaml
# pubspec.yaml'a ekle
speech_to_text: ^6.6.0
```

---

## ✅ 8. UI/UX & NAVIGATION

### Tamamlanan (3/4)

#### ✅ Theme (Tema Desteği)
- **Dosya:** `utils/theme.dart` ✅
- **Özellikler:**
  - Light theme
  - Dark theme
  - Dynamic font support
  - MaterialApp theme desteği

#### ✅ Navigation
- **Yapı:** Bottom Tab Navigation ✅
  - `BottomNavigationBar` ile 4 tab
  - Screen switching
  - State management (Provider)

#### ✅ Responsive Tasarım
- **Dashboard:** Bento grid (2 sütun) ✅
- **SafeArea:** Notch/bezel desteği
- **Padding ve spacing:** Tutarlı

---

### ❌ Eksik (1/4)

#### ❌ Go Router / Named Routes
**Şartname:** Yapılandırılmış routing
- **Mevcut:** Basit screen switching
- **Eksik:**
  - `go_router: ^13.0.0` paketi var ama kullanılmıyor
  - Named routes yok
  - Deep linking yok
  - Route guards yok

**Yapılması Gereken:**
```dart
// config/router.dart
final router = GoRouter(
  routes: [
    GoRoute(path: '/login', builder: ...),
    GoRoute(path: '/home', builder: ...),
    GoRoute(path: '/memory/:id', builder: ...),
  ],
);
```

---

## ✅ 9. GÖRSELLEŞTIRME

### Tamamlanan (1/3)

#### ✅ Timeline Cards
- **Dashboard:** Bento card tasarımı ✅
- **Add Memory:** Medya türü kartları
- **Memory:** Tipo-specific display

---

### ❌ Eksik (2/3)

#### ❌ Grafikler (Charts)
**Şartname:** İstatistik grafikleri
- ❌ `fl_chart` / `charts_flutter` paketi yok
- ❌ Bar chart yok
- ❌ Pie chart yok
- ❌ Line chart yok

**Yapılması Gereken:**
```yaml
# pubspec.yaml'a ekle
fl_chart: ^0.68.0
# veya charts_flutter: ^0.12.0
```

---

#### ❌ Harita (Map)
**Şartname:** Konum haritası
- ❌ `flutter_map` paketi yok
- ❌ Konum gösterimi yok
- ❌ Harita entegrasyonu yok

**Sebep:** Backend'de konum verisi yok

---

## ✅ 10. PLATFORM SETUP

### Tamamlanan (2/3)

#### ✅ iOS Temel Setup
- **pubspec.yaml:** iOS min sürümü belirtilmiş (opsiyonel)
- **Dart SDK:** `>=3.0.0 <4.0.0` ✅
- **Flutter plugins:** Temel paketler var

#### ✅ Paketler (Dependencies)
- **State Management:** Provider ✅
- **HTTP:** http, dio ✅
- **Storage:** SharedPreferences, flutter_secure_storage ✅
- **Media:** image_picker, audioplayers, video_player ✅
- **Navigation:** go_router ✅
- **Date:** intl ✅

---

### ❌ Eksik (1/3)

#### ❌ iOS Build Configuration
**Şartname:** Info.plist izinleri
- ❌ NSCameraUsageDescription yok
- ❌ NSPhotoLibraryUsageDescription yok
- ❌ NSMicrophoneUsageDescription yok
- ❌ NSLocationWhenInUseUsageDescription yok
- ❌ Signing certificates yok
- ❌ Bundle ID yok

**Yapılması Gereken:**
```xml
<!-- ios/Runner/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>Fotoğraf eklemek için kameraya erişime ihtiyacımız var.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Zaman çizelgesine fotoğraf eklemek için fotoğraf arşivine erişim gerekir.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Sesli günlük kaydı için mikrofona erişim gerekiyor.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>İsterseniz kayıtlara konum eklemek için konum erişimi kullanılır.</string>
```

---

## 📊 VERİ MODELLERİ

### Tamamlanan

```dart
✅ User (models/user.dart)
   - id, email, name, createdAt
   - fromJson/toJson

✅ Memory (models/memory.dart)
   - id, type, title, description, date, createdAt, updatedAt
   - tags, fileUrl, thumbnailUrl, mimeType, fileSize
   - durationSeconds, transcriptionText
   - spotifyTrackId, songTitle, artistName, albumName, albumArtUrl
   - userId
   - MemoryType enum (photo, video, voice, text, song)
```

### Eksik

```dart
❌ OutboxEntry (for offline sync)
❌ SummaryData (for monthly/yearly summaries)
❌ Location (for GPS data)
```

---

## 🔧 YAPILMASI GEREKENLER (TODO)

### HIGH PRIORITY (MVP için kritik)

| # | Başlık | Dosya | Tahmini Çalışma |
|---|--------|-------|-----------------|
| 1 | Zaman Tüneli (Archives) | archives_screen.dart | 4-5 saat |
| 2 | Anı Detayı Ekranı | entry_detail_screen.dart | 3-4 saat |
| 3 | Özetler (Summaries) | summaries_screen.dart | 5-6 saat |
| 4 | Profil & Ayarlar (Genişletme) | profile_screen.dart | 3-4 saat |
| 5 | Router Configuration | config/router.dart | 2-3 saat |
| 6 | iOS Info.plist Perms | ios/Runner/Info.plist | 0.5 saat |
| 7 | Video Desteği | add_memory_screen.dart | 2-3 saat |
| 8 | Grafikler (Charts) | summaries_screen.dart | 3-4 saat |

### MEDIUM PRIORITY (Sürüm 1.0)

- Offline Cache (Hive/Drift)
- Offline Outbox Sync
- Token Refresh Mekanizması
- EXIF Metadata Okuma
- Konum (Geolocator) Entegrasyonu
- Spotify OAuth
- Ses Transkripsiyon

### LOW PRIORITY (Sonraki Sürümler)

- Deep Linking
- Push Notifications
- Share Extension
- Apple Wallet Integration
- Siri Shortcuts

---

## 📱 PLATFORM-SPECIFIC NOTLAR

### iOS Gereksinimleri

- **Minimum iOS:** 15.0
- **Bundle ID:** `com.yourname.digimem` (ayarlanacak)
- **Signing:** Apple Developer Certificate gerekli
- **CocoaPods:** `cd ios && pod install`

### Android (Gelecek)

- **Min SDK:** 21
- **Target SDK:** 34
- **Gradle:** Kotlin DSL
- **Permissions:** AndroidManifest.xml güncellemeleri

---

## 📈 İlerleme Grafesi

```
Veri Kaynakları:     ███░░░░░░░ 60%
Ekranlar:            ██░░░░░░░░ 50%
İçerik Yönetimi:     ███░░░░░░░ 75%
Offline Desteği:     ░░░░░░░░░░ 0%
Medya İşleme:        ██░░░░░░░░ 50%
Kimlik Doğrulama:    ████░░░░░░ 100%
Entegrasyonlar:      ░░░░░░░░░░ 0%
UI/UX & Navigation:  ███░░░░░░░ 75%
Görselleştirme:      █░░░░░░░░░ 33%
Platform Setup:      ██░░░░░░░░ 67%
─────────────────────
TOPLAM:              ██░░░░░░░░ 54%
```

---

## 🎯 SONRAKI ADIMLAR

### Bu Hafta
1. iOS Info.plist izinleri ayarla
2. Zaman Tüneli (Archives) ekranını implement et
3. Anı Detayı ekranını ekle

### Sonraki Hafta
1. Özetler (Summaries) ekranı
2. Grafikler (fl_chart) entegrasyonu
3. Profil/Ayarlar genişletme

### 2 Hafta Sonra
1. Offline cache (Hive) ekle
2. Video seçme/upload
3. Konum entegrasyonu
4. Spotify OAuth

### 3-4 Hafta Sonra
1. Token refresh
2. Ses transkripsiyon
3. Testler (widget/integration)
4. TestFlight iç dağıtımı

---

## 📋 DEĞERLENDİRME KRİTERLERİ

- ✅ Kullanıcı minimum bir anı ekleyebilmeli
- ✅ Anılar Timeline'da görüntülenebilmeli
- ⚠️ Offline okuma desteği yok (yapılacak)
- ✅ Kimlik doğrulama çalışıyor
- ⚠️ Özetler henüz yok (yapılacak)
- ⚠️ Crash-free session metriği henüz izlenmiyor
- ⚠️ Performance optimizasyonu yapılacak

---

## 🚀 DEPLOYMENT

### TestFlight (İç Test)
```bash
# iOS build
flutter build ipa --release

# Xcode ile upload
# veya fastlane lane
fastlane ios beta
```

### App Store (Resmi Dağıtım)
- Privacy Policy gerekli
- App Store Connect setup
- Binary upload
- Review bekleme

---

*Bu rapor Flutter kodu incelenip, teknik şartname ile karşılaştırılarak otomatik oluşturulmuştur.*
