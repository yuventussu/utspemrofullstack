# Eco-Share Backend API

Backend API untuk platform penyewaan alat elektronik bekas Eco-Share.

## Fitur Utama

- Autentikasi stateless JWT
- Otorisasi peran `owner` dan `renter`
- Middleware guard untuk melindungi rute API
- Lapisan service untuk logika bisnis dan perhitungan biaya
- Transaksi database MySQL agar proses pinjaman konsisten
- Global error handler untuk reliabilitas

## Persiapan

1. Salin `.env.example` menjadi `.env`.
2. Isi variabel environment dengan data MySQL dan JWT. Pastikan `MYSQL_USER` dan `MYSQL_PASSWORD` benar untuk server MySQL Anda.
3. Jika database belum ada, aplikasi akan membuat `MYSQL_DATABASE` secara otomatis selama kredensial benar.
4. Jalankan:
   ```bash
   npm install
   npm run dev
   ```

## Endpoint Utama

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/items`
- `POST /api/items` (owner)
- `POST /api/loans` (renter)
- `POST /api/loans/:id/return` (renter)
- `GET /api/loans` (user-specific)

## Struktur Database

- `users`
- `items`
- `loans`
- `loan_history`

## Testing

```
npm test
```
