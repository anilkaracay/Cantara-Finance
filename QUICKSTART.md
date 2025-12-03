# Cantara Finance - Hızlı Başlangıç

Bu dokümantasyon, Cantara Finance projesini başlatmak için gereken adımları içerir.

## Otomatik Başlatma

### Tüm Servisleri Başlatma

```bash
./start_sequential.sh
```

Bu script otomatik olarak şunları yapar:
1. ✅ Mevcut süreçleri durdurur
2. ✅ DAML Sandbox'ı başlatır (Port 5011)
3. ✅ JSON API'yi başlatır (Port 7575)
4. ✅ Backend'i başlatır (Port 4000)
5. ✅ Oracle Bot'u başlatır
6. ✅ Frontend'i başlatır (Port 3000)

Her servis sırayla başlatılır ve bir önceki servisin hazır olması beklenir.

## Otomatik Yüklenen Veriler

Proje her başlatıldığında otomatik olarak şunlar yüklenir:

### 🏦 Lending Pools (4 Adet)
- **USDC Pool**: $1/token, ClassAA, LTV: 85%
- **BTC Pool**: $90,000/token, ClassA, LTV: 70%
- **ETH Pool**: $3,000/token, ClassA, LTV: 75%
- **CC Pool** (Canton Coin): $0.1/token, ClassB, LTV: 60%

Her pool şunları içerir:
- Gerçekçi total deposits ve borrows
- Faiz oranı eğrileri (base rate, slope1, slope2, kink)
- Risk parametreleri (LTV, liquidation threshold, bonus)
- Otomatik APY/APR hesaplamaları

### 💰 Cüzdan Bakiyeleri (Otomatik 1000'er Adet)
- **1000 USDC** ($1,000 değerinde)
- **1000 BTC** ($90,000,000 değerinde)
- **1000 ETH** ($3,000,000 değerinde)
- **1000 CC** ($100 değerinde)

**Toplam Başlangıç Bakiyesi: ~$93,001,100**

## Erişim Noktaları

Servisler başlatıldıktan sonra:

- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Pools Sayfası**: http://localhost:3000/pools
- **Backend API**: http://localhost:4000
- **DAML Sandbox**: localhost:5011
- **JSON API**: http://localhost:7575

## Servisleri Durdurma

Script çalışırken **Ctrl+C** tuşuna basın veya manuel olarak:

```bash
pkill -f "daml|canton|node.*backend|node.*oracle|node.*frontend"
```

## Log Dosyaları

Her servisin loglari ayrı dosyalarda:
- `sandbox.log` - DAML Sandbox
- `json-api.log` - JSON API
- `backend-sequential.log` - Backend
- `oracle-sequential.log` - Oracle Bot
- `frontend-sequential.log` - Frontend

## Mock Data Hakkında

> **Not**: Şu an için mock (sahte) data kullanılıyor. Bu, gerçek DAML ledger'dan veri çekmek yerine,
> ön tanımlı değerlerin kullanıldığı anlamına gelir.

### Neden Mock Data?

1. **Hızlı Başlangıç**: DAML setup script'i çalıştırmaya gerek yok
2. **Kararlılık**: Her zaman aynı verilerle başlanır
3. **Geliştirme Kolaylığı**: DAML authentication sorunlarından bağımsız

### Gerçek DAML'e Geçiş

Gerçek DAML entegrasyonu için:

1. **Admin Party Oluşturma**: Canton'da Admin party'si oluşturulmalı
2. **Setup Script**: `Cantara.Setup:completeSetup` çalıştırılmalı
3. **Oracle Konfigürasyonu**: Oracle bot'un fiyatları DAML'e yazması sağlanmalı
4. **Frontend Güncellemesi**: Mock data yerine API çağrıları kullanılmalı

Dosyalar:
- Pools: `apps/frontend/src/hooks/usePools.ts` (satır 63-147)
- Wallet: `apps/frontend/src/hooks/usePortfolio.ts` (satır 19-45)

## Özellikler

✅ **Otomatik Pool Yüklemesi**: Her başlangıçta 4 pool otomatik gelir  
✅ **Otomatik Cüzdan Bakiyesi**: 1000'er adet token otomatik yüklenir  
✅ **Sıralı Başlatma**: Servisler arası bağımlılık sorunları önlenmiştir  
✅ **Hata Toleransı**: Her servis için ayrı log dosyası  
✅ **Kolay Kullanım**: Tek komutla tüm sistem başlatılır

## Sorun Giderme

### Port Zaten Kullanımda

```bash
# İlgili portları temizle
lsof -ti:3000,4000,5011,7575 | xargs kill -9
```

### Serviler Başlamıyor

```bash
# Tüm süreçleri temizle ve yeniden başlat
pkill -f "daml|canton|node"
sleep 3
./start_sequential.sh
```

### Frontend Güncellenmiyor

Next.js hot reload otomatik çalışır. Eğer değişiklikler görünmüyorsa:

```bash
# Frontend'i yeniden başlat
cd apps/frontend
npm run dev
```

## Gelişmiş Kullanım

### Sadece Belirli Servisleri Başlatma

```bash
# Sadece Backend
cd apps/backend && npm start

# Sadece Frontend  
cd apps/frontend && npm run dev
```

### Environment Variables

Tüm environment değişkenleri `.env` dosyasında:

```bash
cat .env
```

Değişikliklerden sonra servisleri yeniden başlatın.

## Katkıda Bulunma

Bu proje geliştirme aşamasındadır. Mock data kullanımı geçicidir ve zaman içinde
gerçek DAML entegrasyonuna geçilecektir.
