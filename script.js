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

// Fitur Auto-Scroll ke Bawah Otomatis
let autoScrollInterval;

function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    window.scrollBy({
      top: 1,
      behavior: 'smooth'
    });

    // Berhenti otomatis jika sudah di paling bawah halaman
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      stopAutoScroll();
    }
  }, 35); // Kecepatan scroll (semakin besar angka, semakin lambat)
}

function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

// Hentikan auto-scroll jika pengguna menyentuh layar / scroll manual
window.addEventListener('wheel', stopAutoScroll);
window.addEventListener('touchstart', stopAutoScroll);

// Buka Undangan
const bukaBtn = document.getElementById("buka-undangan");
if (bukaBtn) {
  bukaBtn.addEventListener("click", () => {
    document.getElementById("hero").classList.add("hidden");
    document.getElementById("konten-undangan").classList.remove("hidden");
    window.scrollTo(0, 0); // Kembali ke posisi paling atas
    fadeAudioIn();         // Nyalakan musik
    
    // Mulai auto-scroll setelah 1 detik undangan dibuka
    setTimeout(startAutoScroll, 1000);
  });
}

// Countdown Timer
const targetDate = new Date("2025-08-01T08:00:00").getTime();
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

// Copy Rekening
function copyRekening() {
  const rekening = document.getElementById("rekening").innerText;
  navigator.clipboard.writeText(rekening).then(() => {
    alert("Nomor rekening berhasil disalin!");
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

// Komentar Real-time Dummy
const form = document.querySelector("#comment-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const namaInput = form.querySelector("input");
    const ucapanInput = form.querySelector("textarea");

    const nama = namaInput.value;
    const ucapan = ucapanInput.value;

    if (nama && ucapan) {
      const escapeHTML = (str) =>
        str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const namaSafe = escapeHTML(nama);
      const ucapanSafe = escapeHTML(ucapan);

      const commentSection = document.createElement("div");
      commentSection.innerHTML = `<p style="margin-top: 10px; padding: 10px; background: #fff; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><strong>${namaSafe}</strong>: ${ucapanSafe}</p>`;
      commentSection.classList.add("fade-in");
      
      form.insertAdjacentElement("beforebegin", commentSection);
      form.reset();
    }
  });
}
