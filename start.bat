@echo off
echo ======================================
echo    Digi-Mem Baslatiiliyor...
echo ======================================
echo.

REM Docker kontrolu
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Docker yuklu degil. Lutfen Docker'i yukleyin: https://www.docker.com/get-started
    pause
    exit /b 1
)

echo [OK] Docker bulundu
echo.

REM Mevcut container'lari durdur
echo [BILGI] Eski container'lar temizleniyor...
docker compose down >nul 2>&1

REM Yeni container'lari baslat
echo [BILGI] Container'lar build ediliyor ve baslatiliyor...
echo        (Ilk calistirmada 2-3 dakika surebilir)
echo.

docker compose up -d --build

REM Container'larin baslamasini bekle
echo.
echo [BILGI] Servisler baslatiliyor...
timeout /t 5 /nobreak >nul

REM Container durumlari
echo.
echo ======================================
echo    Servis Durumlari:
echo ======================================
docker compose ps

echo.
echo ======================================
echo    Digi-Mem basariyla baslatildi!
echo ======================================
echo.
echo [ERISIM ADRESLERI]
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5299
echo   Swagger:   http://localhost:5299/swagger
echo   Database:  localhost:5433
echo.
echo [GIRIS BILGILERI]
echo   Email:     admin@local
echo   Sifre:     Admin!12345
echo.
echo [YARDIMCI KOMUTLAR]
echo   Loglari gormek icin:    docker compose logs -f
echo   Durdurmak icin:         docker compose down
echo.
pause
