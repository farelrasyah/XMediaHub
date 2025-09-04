# 📥 XMediaHub

✨ **XMediaHub** adalah sebuah API sederhana dan cepat untuk mengunduh **video** maupun **foto** dari platform **Twitter/X**.
Didesain agar mudah digunakan oleh developer yang ingin mengintegrasikan fitur download media ke dalam aplikasi, bot, atau layanan lainnya.

---

## 🚀 Fitur Utama

* 🎬 **Download Video Twitter/X** – Mendukung berbagai kualitas video.
* 🖼️ **Download Gambar/Foto** – Ambil media resolusi terbaik secara instan.
* ⚡ **API Cepat & Ringan** – Dibangun dengan fokus pada performa dan efisiensi.
* 🔑 **Mudah Digunakan** – Endpoint yang simpel dan respons JSON yang bersih.
* 🌍 **Open Source** – Gratis digunakan dan bisa Anda kembangkan sesuai kebutuhan.

---

## 📡 Endpoint API

### 🔹 Ambil Video atau Foto

**Request:**

```
GET /api/download?url=<link_twitter>
```

**Response (contoh):**

```json
{
  "status": "success",
  "type": "video",
  "url": "https://video-cdn.twitter.com/abc123.mp4",
  "quality": "720p"
}
```

---

## 💡 Contoh Penggunaan

### 🔸 Dengan `curl`

```bash
curl "http://localhost:3000/api/download?url=https://x.com/user/status/123456"
```

### 🔸 Dengan JavaScript (fetch)

```javascript
const res = await fetch("http://localhost:3000/api/download?url=https://x.com/user/status/123456");
const data = await res.json();
console.log(data.url);
```

---

## 🛠️ Teknologi yang Digunakan

* ⚙️ **Node.js** – Backend utama.
* 🌐 **Express.js** – Framework REST API.
* 📡 **Axios/Cheerio** – Untuk parsing dan request data dari Twitter/X.

---

## 🤝 Kontribusi

💡 Ingin menambahkan fitur baru atau memperbaiki bug?
Silakan buat **Pull Request** atau laporkan masalah di tab **Issues**.

---

## 📜 Lisensi

XMediaHub dilisensikan di bawah **MIT License** – bebas digunakan untuk project pribadi maupun komersial.

---

✨ Dengan **XMediaHub**, Anda tidak perlu repot mencari cara manual untuk unduh media dari Twitter/X. Cukup sekali request → media langsung siap! 🚀

---