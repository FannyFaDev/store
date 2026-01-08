# NodeJS CRUD Web

Project sederhana CRUD web dengan MySQL.

Persiapan untuk upload ke GitHub dan deploy:

1. Pastikan punya akun GitHub dan buat repository baru (empty, tanpa README).
2. Di folder proyek jalankan:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

3. Untuk deploy cepat (contoh Heroku):
- Buat Procfile: `web: node index.js`
- `heroku create` lalu `git push heroku main`

Atau gunakan Render/Railway: hubungkan repo GitHub dan deploy.

Catatan: simpan konfigurasi sensitif di file `.env` dan jangan di-commit.
