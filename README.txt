SEBLAK STORY PHOTOBOOTH PRO
Versi 1.2.0 — Integrasi kamera dan pengambilan foto

FITUR
- Kamera tablet melalui browser getUserMedia (wajib HTTPS dan izin kamera).
- Pilih kamera yang tersedia dan tombol ganti kamera depan/belakang.
- Countdown 3 detik sebelum setiap jepretan.
- Pengambilan foto berurutan sesuai jumlah slot template (3 atau 4 foto).
- Ulangi seluruh sesi foto.
- Foto otomatis disusun ke template pilihan.
- Simpan hasil akhir sebagai PNG ke perangkat.
- Tidak ada integrasi printer.

PENGUJIAN YANG DILAKUKAN
- app.js, templates.js, dan sw.js diperiksa dengan Node.js --check.
- Pemeriksaan struktur HTML dan ID elemen dilakukan secara statis.
- Alur kamera membutuhkan izin dan perangkat kamera sungguhan; belum dapat diuji secara fisik di Samsung Tab A9 dari lingkungan build ini.

CARA UPDATE
1. Ekstrak ZIP.
2. Upload dan timpa seluruh file di root repository GitHub Photobooth.
3. Commit dan tunggu GitHub Pages selesai deploy.
4. Tutup PWA lama sepenuhnya lalu buka ulang situs.
5. Saat masuk kamera, tekan AKTIFKAN KAMERA dan pilih Izinkan.
6. Jika izin pernah ditolak: Chrome > ikon pengaturan situs > Izin > Kamera > Izinkan, lalu muat ulang.

CATATAN
Akses kamera hanya berjalan di secure context (HTTPS atau localhost). Kamera tidak akan menyala otomatis sebelum pengguna menekan tombol AKTIFKAN KAMERA.
