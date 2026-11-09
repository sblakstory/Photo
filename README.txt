SEBLAK STORY PHOTOBOOTH PRO — TAHAP 1
Versi paket: 1.1.3

SPESIFIKASI YANG DITETAPKAN
- Kamera: kamera tablet (Samsung Tab A9)
- Output: simpan digital PNG (tanpa integrasi printer pada tahap ini)
- Alur: pelanggan bebas memilih template dan fitur
- Kualitas: target HD
- Orientasi: landscape

FITUR TAHAP 1
- PWA installable dan bisa di-host di GitHub Pages
- Halaman awal
- Pemilihan 6 template
- Preview template sebelum dipakai
- Template disimpan di localStorage
- Template berbasis konfigurasi JSON di templates.js
- Layout responsif untuk tablet landscape dan layar kecil
- Service worker dengan cache versi baru

BATAS TAHAP 1
Kamera, countdown, capture, filter, sticker editor, teks nama, export HD belum diaktifkan. Tombol LANJUT FOTO hanya menampilkan halaman penghubung untuk Tahap 2. Tahap berikutnya akan menghubungkan template yang dipilih dengan mesin kamera dan editor.

CARA DEPLOY GITHUB PAGES
1. Ekstrak ZIP.
2. Upload SEMUA file dan folder dari ZIP ke root repository Photobooth.
3. Commit perubahan.
4. Pastikan Settings > Pages mengarah ke branch dan folder root yang benar.
5. Buka URL GitHub Pages. Refresh; bila PWA lama masih tersimpan, tutup aplikasi/tab lalu buka ulang.

FILE
- index.html       UI
- app.js           Navigasi dan preview template
- templates.js     Konfigurasi 6 template
- manifest.webmanifest
- sw.js
- icon.svg

Catatan: Paket ini merupakan implementasi Tahap 1, bukan aplikasi photobooth lengkap final.

FITUR PEMBARUAN v1.1.1
- Nomor versi tampil di footer aplikasi.
- Status update tampil di bawah versi.
- Tombol CEK UPDATE untuk pemeriksaan manual.
- Service worker memakai cache name baru sesuai versi.
- Setelah service worker baru berhasil aktif, cache lama dengan prefix ss-photobooth- dihapus.
- Jika instalasi/update gagal, status menampilkan pesan gagal.
- Navigasi mengambil versi jaringan terlebih dahulu (no-store) agar index terbaru tidak tertahan cache browser.

PENTING:
- Cache aplikasi lama yang memiliki prefix ss-photobooth- akan dibersihkan setelah aktivasi SW baru sukses.
- Cache milik situs/aplikasi lain tidak disentuh.
- Pastikan semua file paket diunggah dan di-commit bersama.

PERUBAHAN v1.1.2
- Tombol CEK UPDATE dihapus.
- Status update tidak ditampilkan.
- Footer hanya menampilkan nomor versi dan © Seblak Story 2026.
- Pembersihan cache lama setelah service worker baru aktif tetap berjalan otomatis.

PERUBAHAN v1.1.3
- Nomor versi dan copyright dipindahkan ke footer paling bawah.
- Ukuran teks kecil dan warna lebih lembut agar tidak mengganggu tampilan.
