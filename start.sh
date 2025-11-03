#!/bin/bash

echo "🚀 Digi-Mem Başlatılıyor..."
echo ""

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo "❌ Docker yüklü değil. Lütfen Docker'ı yükleyin: https://www.docker.com/get-started"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose yüklü değil. Lütfen Docker Compose'u yükleyin."
    exit 1
fi

echo "✅ Docker bulundu"
echo ""

# Mevcut container'ları durdur
echo "🧹 Eski container'lar temizleniyor..."
docker compose down 2>/dev/null

# Yeni container'ları başlat
echo "🏗️  Container'lar build ediliyor ve başlatılıyor..."
echo "   (İlk çalıştırmada 2-3 dakika sürebilir)"
echo ""

docker compose up -d --build

# Container'ların başlamasını bekle
echo ""
echo "⏳ Servisler başlatılıyor..."
sleep 5

# Container durumlarını kontrol et
echo ""
echo "📊 Servis Durumları:"
docker compose ps

echo ""
echo "✨ Digi-Mem başarıyla başlatıldı!"
echo ""
echo "🌐 Erişim Adresleri:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5299"
echo "   Swagger:   http://localhost:5299/swagger"
echo "   Database:  localhost:5433"
echo ""
echo "🔑 Giriş Bilgileri:"
echo "   Email:     admin@local"
echo "   Şifre:     Admin!12345"
echo ""
echo "📝 Logları görüntülemek için:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Durdurmak için:"
echo "   docker compose down"
echo ""
