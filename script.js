// Sakura Falling Effect
function sakuraFall() {
  const canvas = document.getElementById("sakura-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let sakuraArray = [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  function Sakura() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 4 + 2;
    this.speed = Math.random() * 1 + 0.5;
    this.wind = Math.random() * 0.5 - 0.25;

    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 182, 193, 0.7)";
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };

    this.update = function () {
      this.y += this.speed;
      this.x += this.wind;

      if (this.y > canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }

      this.draw();
    };
  }

  function init() {
    sakuraArray = [];
    for (let i = 0; i < 50; i++) {
      sakuraArray.push(new Sakura());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sakuraArray.forEach(s => s.update());
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

sakuraFall();

// Fitur Auto-Scroll Lebih Cepat & Bisa Jeda lalu Lanjut Otomatis
let autoScrollInterval;
let resumeTimer;

function startAutoScroll() {
  // Mencegah interval berjalan ganda
  if (autoScrollInterval) return;

  autoScrollInterval = setInterval(() => {
    window.scrollBy({
      top: 1.5, // Kecepatan langkah (sedikit ditingkatkan agar lebih cepat)
      behavior: 'smooth'
    });

    // Jika sudah sampai paling bawah halaman, hentikan total
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
      stopAutoScrollCompletely();
    }
  }, 25); // Interval waktu dipercepat dari 35 menjadi 25 milidetik
}

function pauseAutoScroll() {
  // Hentikan sementara saat layar disentuh atau digulir
  clearInterval(autoScrollInterval);
  autoScrollInterval = null;

  // Bersihkan timer jeda sebelumnya
  clearTimeout(resumeTimer);

  // Otomatis lanjut jalan lagi setelah 2.5 detik pengguna selesai membaca/menggeser manual
  resumeTimer = setTimeout(() => {
    startAutoScroll();
  }, 2500); // 2500 milidetik = 2.5 detik tidak ada sentuhan, maka jalan lagi
}

function stopAutoScrollCompletely() {
  clearInterval(autoScrollInterval);
  autoScrollInterval = null;
  clearTimeout(resumeTimer);
}

// Deteksi interaksi sentuhan di HP (touchstart), scroll mouse (wheel), atau klik (mousedown)
window.addEventListener('touchstart', pauseAutoScroll, { passive: true });
window.addEventListener('wheel', pauseAutoScroll, { passive: true });
window.addEventListener('mousedown', pauseAutoScroll, { passive: true });
// Buka Undangan (Dioptimalkan untuk iPhone/iOS)
const bukaBtn = document.getElementById("buka-undangan");
if (bukaBtn) {
  bukaBtn.addEventListener("click", () => {
    document.getElementById("hero").classList.add("hidden");
    document.getElementById("konten-undangan").classList.remove("hidden");
    window.scrollTo(0, 0); // Kembali ke posisi paling atas
    
    // Nyalakan musik terlebih dahulu
    fadeAudioIn();         
    
    // Gunakan requestAnimationFrame atau penundaan sedikit lebih lama agar diizinkan oleh Safari iPhone
    setTimeout(() => {
      startAutoScroll();
    }, 800);
  });
}

// Countdown Timer
const targetDate = new Date("2026-11-23T08:00:00").getTime();
const countdownInterval = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(countdownInterval);
    const cdEl = document.getElementById("countdown");
    if (cdEl) cdEl.innerHTML = "Acara telah dimulai";
    return;
  }

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
  if (hoursEl) hoursEl.innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
  if (minutesEl) minutesEl.innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  if (secondsEl) secondsEl.innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
}, 1000);

// Copy Rekening & E-Wallet Dinamis
function copyTeks(elementId, label) {
  const elemen = document.getElementById(elementId);
  if (!elemen) return;

  // Mengambil teks dan menghapus tanda strip (-) jika ada, agar lebih mudah dipaste di m-banking
  const teksBersih = elemen.innerText.replace(/-/g, '').trim();

  navigator.clipboard.writeText(teksBersih).then(() => {
    alert(label + " berhasil disalin!");
  }).catch(() => {
    alert("Gagal menyalin " + label);
  });
}

// Pemutar Musik dengan Fade
const audio = document.getElementById("wedding-audio");
const toggleBtn = document.getElementById("toggle-audio");
let isPlaying = false;

function fadeAudioIn() {
  if (!audio) return;
  audio.volume = 0;
  audio.play().catch(() => {});
  isPlaying = true;
  if (toggleBtn) toggleBtn.innerText = "⏸️";
  let vol = 0;
  const fadeIn = setInterval(() => {
    if (vol < 1) {
      vol += 0.05;
      audio.volume = Math.min(vol, 1);
    } else {
      clearInterval(fadeIn);
    }
  }, 200);
}

function fadeAudioOut() {
  if (!audio) return;
  let vol = audio.volume;
  const fadeOut = setInterval(() => {
    if (vol > 0) {
      vol -= 0.05;
      audio.volume = Math.max(vol, 0);
    } else {
      clearInterval(fadeOut);
      audio.pause();
    }
  }, 200);
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      fadeAudioOut();
      if (toggleBtn) toggleBtn.innerText = "🔊";
    } else {
      fadeAudioIn();
      if (toggleBtn) toggleBtn.innerText = "⏸️";
    }
    isPlaying = !isPlaying;
  });
}

// Komentar Real-time dengan Firebase Realtime Database
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#comment-form");
  const container = document.getElementById("daftar-ucapan-container");

  // Menunggu koneksi Firebase siap
  const cekRtdb = setInterval(() => {
    if (window.rtdb && window.rtdbModules) {
      clearInterval(cekRtdb);
      muatUcapanRTDB();
    }
  }, 100);

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const namaInput = form.querySelector("input");
      const ucapanInput = form.querySelector("textarea");

      const nama = namaInput.value.trim();
      const ucapan = ucapanInput.value.trim();

      if (nama && ucapan && window.rtdb) {
        const { ref, push } = window.rtdbModules;
        const ucapanRef = ref(window.rtdb, "ucapan");

        // Kirim data ke database Firebase
        push(ucapanRef, {
          nama: nama,
          pesan: ucapan,
          waktu: Date.now()
        }).then(() => {
          form.reset();
        }).catch((err) => {
          console.error("Gagal mengirim:", err);
          alert("Gagal mengirim ucapan.");
        });
      }
    });
  }
});

function muatUcapanRTDB() {
  const { ref, onChildAdded } = window.rtdbModules;
  const container = document.getElementById("daftar-ucapan-container");
  if (!container) return;

  const ucapanRef = ref(window.rtdb, "ucapan");

  // Mendengarkan pesan baru yang masuk secara real-time
  onChildAdded(ucapanRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const escapeHTML = (str) =>
        str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const namaSafe = escapeHTML(data.nama);
      const ucapanSafe = escapeHTML(data.pesan);

      const commentDiv = document.createElement("div");
      commentDiv.style.cssText = "margin-top: 10px; padding: 10px; background: #fff; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: left; color: #333;";
      commentDiv.innerHTML = `<strong style="color: #d4af37;">${namaSafe}</strong>: <p style="margin: 5px 0 0 0;">${ucapanSafe}</p>`;
      commentDiv.classList.add("fade-in");

      // Masukkan ucapan baru ke bagian atas daftar
      container.prepend(commentDiv);
    }
  });
}
