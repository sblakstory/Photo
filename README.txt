SEBLAK STORY PHOTOBOOTH PRO — TAHAP 1
Versi paket: 1.1.0

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
