# Spotify Entegrasyonu

## ✅ Backend - TAMAMLANDI

### Oluşturulan Dosyalar:

1. **Models/UserIntegration.cs** - Kullanıcı entegrasyonları (Spotify refresh token vb.)
2. **Models/UserIntegration.cs** - SpotifyTrack modeli (dinlenen şarkılar)
3. **Services/EncryptionService.cs** - Refresh token şifreleme
4. **Services/Spotify/SpotifyOAuthService.cs** - OAuth2 + PKCE flow
5. **Services/Spotify/SpotifyApiService.cs** - Spotify API calls with retry (429 handling)
6. **Services/Spotify/SpotifySyncService.cs** - Recently played sync
7. **Controllers/SpotifyAuthController.cs** - OAuth endpoints
8. **Controllers/SpotifyController.cs** - Spotify API endpoints

### API Endpoints:

#### OAuth Flow:
- `GET /oauth/spotify/connect` - Spotify authorize'a yönlendir (PKCE ile)
- `GET /oauth/spotify/callback` - Token exchange ve DB'ye kaydet
- `POST /oauth/spotify/disconnect` - Bağlantıyı kes

#### Spotify API:
- `GET /api/spotify/status` - Bağlantı durumu
- `POST /api/spotify/sync` - Son 50 dinlemeyi senkronize et
- `GET /api/spotify/top-tracks` - En çok dinlenen şarkılar
- `GET /api/spotify/summary` - Bu ay özeti (top artists, top tracks)

### Özellikler:

✅ **Authorization Code + PKCE** - Güvenli OAuth2 flow
✅ **Refresh Token Encryption** - AES ile şifrelenmiş saklama
✅ **Automatic Token Refresh** - 401 durumunda otomatik yenileme
✅ **429 Rate Limit Handling** - Polly ile retry + exponential backoff
✅ **Session Management** - OAuth state güvenliği için
✅ **Telemetry/Logging** - spotify_connect_started/succeeded/failed vb.

### Konfigürasyon:

`appsettings.Development.json`:
```json
{
  "Spotify": {
    "ClientId": "YOUR_SPOTIFY_CLIENT_ID",
    "ClientSecret": "YOUR_SPOTIFY_CLIENT_SECRET",
    "RedirectUri": "http://localhost:5299/oauth/spotify/callback"
  },
  "Encryption": {
    "Key": "encryption-key-must-be-32-chars-long-at-least!"
  }
}
```

### Spotify Developer Setup:

1. https://developer.spotify.com/dashboard adresine gidin
2. "Create an App" tıklayın
3. App adı: "Digi-Mem"
4. Redirect URI ekleyin: `http://localhost:5299/oauth/spotify/callback`
5. Client ID ve Client Secret'ı kopyalayın
6. `appsettings.Development.json`'a yapıştırın

### Database:

**UserIntegrations Tablosu:**
- UserId, Provider, EncryptedRefreshToken, Scopes, LastSyncedAt, IsActive

**SpotifyTracks Tablosu:**
- UserId, SpotifyTrackId, TrackName, ArtistName, AlbumName, AlbumArtUrl, SpotifyUri, PlayedAt

Migration oluşturuldu ve uygulandı: `AddSpotifyIntegration`

---

## 📱 Frontend - YAPILACAK

### Gerekli Dosyalar:

#### 1. Spotify API Service (front/lib/spotify-api.ts)
```typescript
export const spotifyApi = {
  getStatus: () => fetch('/api/spotify/status'),
  sync: () => fetch('/api/spotify/sync', { method: 'POST' }),
  disconnect: () => fetch('/oauth/spotify/disconnect', { method: 'POST' }),
  getTopTracks: () => fetch('/api/spotify/top-tracks'),
  getSummary: () => fetch('/api/spotify/summary'),
};
```

#### 2. Ayarlar Sayfası (front/app/settings/page.tsx)
Kart ekle:
- Spotify bağlantı durumu
- "Hesabı Bağla" butonu → `/oauth/spotify/connect`'e window.location
- "Bağlantıyı Kaldır" butonu
- "Şimdi Senkronize Et" butonu
- Son senkron zamanı

#### 3. Ana Sayfa "Şarkı Ekle" Akışı
Modal içinde:
- Eğer Spotify bağlı değilse: "Spotify hesabını bağla" önerisi
- Bağla butonu → OAuth flow başlat

#### 4. Spotify Özeti Component (front/components/spotify/summary.tsx)
- Bu ay en çok dinlenenler listesi
- Top 5 artist
- Top 10 track

### Callback Handling:

Ayarlar sayfasında URL parametrelerini kontrol et:
```typescript
const searchParams = useSearchParams();
const spotifyConnected = searchParams.get('spotify_connected');
const spotifyError = searchParams.get('spotify_error');

useEffect(() => {
  if (spotifyConnected) {
    toast.success("Spotify bağlandı 🎧");
  }
  if (spotifyError) {
    toast.error(`Spotify bağlantı hatası: ${spotifyError}`);
  }
}, [spotifyConnected, spotifyError]);
```

---

## 🧪 Test Senaryosu:

### Manuel Test:

1. **Backend'i başlatın:**
   ```bash
   dotnet run
   ```

2. **Swagger'da test:**
   - http://localhost:5299/swagger
   - Önce `/api/auth/login` ile JWT token alın
   - "Authorize" butonuna token'ı yapıştırın
   - `/oauth/spotify/connect` endpoint'ine GET request gönderin
   - Spotify login ekranına yönlendirileceksiniz

3. **OAuth Flow:**
   - Spotify'da izin verin
   - Callback'e yönlendirileceksiniz
   - Database'de `UserIntegrations` tablosunu kontrol edin

4. **Sync Test:**
   - `/api/spotify/sync` POST request gönderin
   - `SpotifyTracks` tablosunda veriler göreceksiniz

5. **Summary:**
   - `/api/spotify/summary` GET request
   - Bu ay en çok dinlenenlerinizi göreceksiniz

---

## 📊 Loglama:

Backend logları izleyin:
```
spotify_connect_started for user xxx
spotify_connect_succeeded for user xxx
spotify_sync_started for user xxx
Retrieved 50 recently played tracks from Spotify
spotify_sync_succeeded for user xxx. Added 50 tracks
```

---

## 🚀 Prodüksiyon Notları:

1. **Redirect URI'yi güncelleyin:**
   ```json
   "RedirectUri": "https://yourdomain.com/oauth/spotify/callback"
   ```

2. **HTTPS zorunlu** (OAuth için)

3. **State store'u Redis'e taşıyın** (şu an memory'de)

4. **Rate limit monitoring** ekleyin

5. **Access token cache** için Redis kullanın

---

## ✅ Acceptance Criteria - Backend:

- [x] OAuth2 + PKCE flow çalışıyor
- [x] Refresh token şifreli saklanıyor
- [x] 401 otomatik refresh
- [x] 429 rate limit handling
- [x] Recently played sync çalışıyor
- [x] Top tracks/artists endpoint'leri hazır
- [x] Disconnect işlevi çalışıyor
- [x] Telemetry/logging eklenmiş
- [ ] Frontend entegrasyonu
- [ ] E2E test

Backend kısmı **TAMAMLANDI** ✅
Frontend implementasyonu için yukarıdaki örnekleri takip edebilirsiniz!
