# Phase 6 — Polish & Deploy

404, Error page, Security headers, Vercel deploy, CI/CD

---

## File yang Disalin ke Project

```
src/app/not-found.tsx        ← Halaman 404 custom
src/app/error.tsx            ← Halaman error global
next.config.ts               ← TIMPA yang lama
vercel.json                  ← Buat di root project
.github/workflows/deploy.yml ← Buat folder .github/workflows
```

---

## Checklist Sebelum Deploy

Pastikan semua ini sudah beres:

- [ ] Semua halaman Phase 1–5 sudah berjalan di localhost
- [ ] Login, register, checkout, payment bisa digunakan
- [ ] Admin panel bisa diakses
- [ ] Tidak ada error merah di terminal
- [ ] `npm run build` berhasil tanpa error

Test build lokal dulu:
```bash
npm run build
npm run start
```

---

## Step 1 — Push ke GitHub

```bash
# Init git (kalau belum)
git init
git add .
git commit -m "Initial commit - GaoGameShop"

# Buat repo di github.com, lalu:
git remote add origin https://github.com/username/gaogameshop.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy ke Vercel

### Cara A — Via Dashboard (Mudah)

1. Buka [vercel.com](https://vercel.com) → Sign up dengan GitHub
2. Klik **Add New Project**
3. Import repo `gaogameshop` dari GitHub
4. Framework: **Next.js** (auto detect)
5. Klik **Environment Variables** → tambahkan semua variabel:

```
NEXT_PUBLIC_SUPABASE_URL         = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    = eyJxxx...
SUPABASE_SERVICE_ROLE_KEY        = eyJxxx...
MIDTRANS_SERVER_KEY              = Mid-server-xxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY  = Mid-client-xxx
MIDTRANS_IS_PRODUCTION           = false
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION = false
NEXT_PUBLIC_BASE_URL             = https://gaogameshop.id
```

6. Klik **Deploy** → tunggu ~2 menit

### Cara B — Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 3 — Hubungkan Domain gaogameshop.id

Setelah deploy berhasil dan kamu sudah beli domain:

1. Vercel Dashboard → Project → **Settings → Domains**
2. Klik **Add Domain** → ketik `gaogameshop.id`
3. Vercel akan kasih 2 DNS record:
   - **A record:** `@` → IP Vercel
   - **CNAME:** `www` → `cname.vercel-dns.com`
4. Login ke tempat beli domain (Niagahoster/Rumahweb/dll)
5. Buka **DNS Management** → tambahkan kedua record di atas
6. Tunggu propagasi DNS ~5–30 menit
7. SSL otomatis aktif dari Vercel ✅

---

## Step 4 — Update Midtrans ke Production

Saat sudah siap go-live:

1. Buka dashboard.midtrans.com → switch ke **Production**
2. Ambil Production Server Key & Client Key
3. Update di Vercel → Environment Variables:
   ```
   MIDTRANS_SERVER_KEY              = Mid-server-xxx (Production)
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY  = Mid-client-xxx (Production)
   MIDTRANS_IS_PRODUCTION           = true
   NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION = true
   ```
4. Update Notification URL di Midtrans Production:
   ```
   https://gaogameshop.id/api/payment/notification
   ```
5. Redeploy: `vercel --prod`

---

## Step 5 — Update Supabase Production Settings

1. Supabase Dashboard → **Authentication → URL Configuration**
2. **Site URL:** `https://gaogameshop.id`
3. **Redirect URLs:** tambahkan:
   ```
   https://gaogameshop.id/**
   https://gaogameshop.id/api/auth/callback
   ```

---

## Step 6 — CI/CD (Opsional)

Kalau mau auto-deploy setiap push ke `main`:

1. Buka GitHub repo → **Settings → Secrets → Actions**
2. Tambahkan secrets:
   ```
   VERCEL_TOKEN       = token dari vercel.com/account/tokens
   VERCEL_ORG_ID      = dari .vercel/project.json setelah vercel link
   VERCEL_PROJECT_ID  = dari .vercel/project.json
   + semua env variables lainnya
   ```
3. Salin file `.github/workflows/deploy.yml` ke project
4. Setiap push ke `main` → auto build + deploy ✅

---

## Post-Deploy Checklist

- [ ] Homepage terbuka di gaogameshop.id
- [ ] Login & register berfungsi
- [ ] Top up via Midtrans Production berhasil
- [ ] Admin panel bisa diakses
- [ ] Webhook Midtrans sudah didaftarkan ke URL production
- [ ] SSL aktif (gembok hijau di browser)

---

## 🎉 Selamat!

GaoGameShop sudah live di **gaogameshop.id**

```
Phase 1 ✅ Foundation & Database
Phase 2 ✅ Homepage & Product Listing
Phase 3 ✅ Payment & Saldo
Phase 4 ✅ User Dashboard
Phase 5 ✅ Admin Dashboard
Phase 6 ✅ Deploy & Production
```

---

*gaogameshop.id · Phase 6 of 6 — COMPLETE*
