SITTA UT 3.0 - Tugas Praktik 3 Pemrograman Berbasis Web

Cara menjalankan:
1. Buka folder tugas3-vue-ut menggunakan Visual Studio Code.
2. Pastikan ekstensi Live Server sudah tersedia.
3. Klik kanan file login.html.
4. Pilih Open with Live Server.
5. Login menggunakan akun demo, lalu sistem akan masuk ke dashboard index.html.

Catatan:
- Project harus dijalankan melalui Live Server karena data dan template dibaca menggunakan fetch().
- Logo pada assets/img/Logo UT.png adalah placeholder. Ganti dengan logo UT resmi dengan nama file yang sama bila diperlukan.
- Data JSON sumber dosen tetap dipertahankan pada data/dataBahanAjar.json.
- Data tracking JSON yang duplikat dinormalisasi oleh js/services/api.js agar tidak tampil berulang.

Fitur yang diimplementasikan:
- Root index.html dengan tab state: dashboard, stok, tracking, order.
- Custom elements dan Vue Component.
- Property template eksternal dengan id konsisten tpl-*.
- v-for zero-based index dan name-based index.
- Mustache, v-text, v-html, v-bind, v-model.
- v-if, v-else, v-show.
- Computed property, methods, dan watcher.
- Filter format rupiah, buah, tanggal Indonesia, dan tanggal-jam Indonesia.
- Tooltip catatan HTML ketika mouse hover pada status stok.
- Create, update, delete stok dengan konfirmasi hapus.
- Simpan stok menggunakan event keyboard Enter.
- Tracking pencarian nomor DO atau NIM menggunakan Enter.
- Reset pencarian tracking menggunakan tombol Esc.
- Nomor DO otomatis DO+tahun+sequence.
- Tambah progress perjalanan dengan waktu local time.


Akun demo:
- admin@ut.ac.id / admin123
- ryan@ut.ac.id / ryan123

Alur aplikasi:
login.html -> index.html (dashboard) -> tab stok / tracking / pemesanan
