let currentPageIndex = 0;
const totalPages = 7;
let quizPassed = false;

function showPage(index) {
  if (index < 0 || index >= totalPages) return;

  // Lock: Cannot view gallery or scratch letter until quiz is done
  if (index >= 4 && !quizPassed) {
    alert("Renuka! ❤️ Complete the Love Quiz correctly to unlock the rest of the surprise!");
    return;
  }

  currentPageIndex = index;

  document.querySelectorAll(".app-page").forEach((page, idx) => {
    page.classList.toggle("active", idx === currentPageIndex);
  });

  document.querySelectorAll(".step-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentPageIndex);
  });

  if (currentPageIndex === 6) {
    initScratchCard();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextPage() {
  if (currentPageIndex === 3 && !quizPassed) return;
  if (currentPageIndex < totalPages - 1) showPage(currentPageIndex + 1);
}

function prevPage() {
  if (currentPageIndex > 0) showPage(currentPageIndex - 1);
}

function triggerGrandCelebration() {
  if (typeof confetti !== "function") return;
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 40 * (timeLeft / duration);
    confetti({ particleCount, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#38bdf8", "#c084fc", "#fde047"] });
    confetti({ particleCount, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#38bdf8", "#c084fc", "#fde047"] });
  }, 250);
}

window.showPage = showPage;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.triggerGrandCelebration = triggerGrandCelebration;

document.addEventListener("DOMContentLoaded", () => {

  // 1. Step Indicator Navigation
  document.querySelectorAll(".step-dot").forEach((dot) => {
    dot.addEventListener("click", () => showPage(parseInt(dot.dataset.step, 10)));
  });

  // 2. Interactive Constellation Canvas
  const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    });
  }

  window.addEventListener("mousemove", (e) => { mouse.x = e.x; mouse.y = e.y; });
  window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;
      if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
      if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(192, 132, 252, 0.7)";
      ctx.fill();

      if (mouse.x) {
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 120})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateStars);
  }
  animateStars();

  // 3. Audio Synthesis
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function playPopSound() {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.09);
      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch(e){}
  }

  function playSuccessChime() {
    try {
      initAudio();
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch(e){}
  }

  // 4. Live Countdown
  const targetDate = new Date("2026-08-24T00:00:00").getTime();
  function updateTimer() {
    const diff = targetDate - new Date().getTime();
    if (diff <= 0) return;
    document.getElementById("days").textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
    document.getElementById("hours").textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
    document.getElementById("minutes").textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    document.getElementById("seconds").textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
  }
  setInterval(updateTimer, 1000);
  updateTimer();

  // 5. Balloon Popping
  document.querySelectorAll(".balloon").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.classList.contains("popped")) return;
      playPopSound();
      b.classList.add("popped");
      setTimeout(() => {
        document.getElementById("modalYearTitle").textContent = b.dataset.year;
        document.getElementById("modalMessageText").textContent = b.dataset.message;
        document.getElementById("messageModal").classList.add("active");
      }, 250);
    });
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("messageModal").classList.remove("active");
  });

  // 6. Couple Quiz
  const quizQuestions = [
    { question: "1. What is my favourite food?", options: ["Cheesy Burst Pizza 🍕", "Hot & Spicy Biriyani 🍗✨", "Fried Chicken 🍗", "Paneer Butter Masala 🍛"], correctIndex: 1 },
    { question: "2. What is my favourite color in the world?", options: ["Royal Sky Blue 💙", "Midnight Black 🖤", "Crimson Red ❤️", "Lavender Purple 💜"], correctIndex: 0 },
    { question: "3. Who is the queen of my heart and life?", options: ["Angel Priya ✨", "My Beautiful V.Renuka 👑❤️", "Princess Sneha 🌸", "Cute Girl Ananya 💖"], correctIndex: 1 }
  ];

  let currentQuiz = 0;
  function loadQuiz() {
    const q = quizQuestions[currentQuiz];
    document.getElementById("questionCount").textContent = `Question ${currentQuiz + 1} of ${quizQuestions.length}`;
    document.getElementById("progressBar").style.width = `${((currentQuiz + 1) / quizQuestions.length) * 100}%`;
    document.getElementById("quizQuestion").textContent = q.question;
    const opts = document.getElementById("quizOptions");
    opts.innerHTML = "";

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-btn";
      btn.innerHTML = `<span>${opt}</span> <span>✨</span>`;
      btn.addEventListener("click", () => {
        opts.querySelectorAll(".quiz-btn").forEach(b => b.disabled = true);
        if (idx === q.correctIndex) {
          btn.classList.add("correct");
          playSuccessChime();
          setTimeout(() => {
            currentQuiz++;
            if (currentQuiz < quizQuestions.length) loadQuiz();
            else {
              quizPassed = true;
              document.getElementById("quizContent").style.display = "none";
              document.getElementById("quizResult").classList.remove("hidden");
              document.getElementById("quizNextBtn").style.display = "inline-block";
              triggerGrandCelebration();
            }
          }, 700);
        } else {
          btn.classList.add("incorrect");
          document.getElementById("quizAlert").classList.remove("hidden");
          setTimeout(() => { currentQuiz = 0; loadQuiz(); }, 1200);
        }
      });
      opts.appendChild(btn);
    });
  }
  loadQuiz();

  // 7. Reasons I Love You Jar
  const reasons = [
    "Your smile turns my hardest days completely upside down.",
    "You stayed by my side even when I made mistakes and had rough moments.",
    "The cute way you get possessive and show how much you care.",
    "All the delicious meals we shared together at Nemilichery.",
    "You believe in my dreams even more than I do sometimes.",
    "7 years later, my heart still skips a beat when you call my name."
  ];
  let reasonIdx = 0;
  document.getElementById("loveJar").addEventListener("click", () => {
    playSuccessChime();
    document.getElementById("reasonIndex").textContent = `Note #${reasonIdx + 1}`;
    document.getElementById("reasonText").textContent = `"${reasons[reasonIdx]}"`;
    reasonIdx = (reasonIdx + 1) % reasons.length;
  });

  // 8. Photo Lightbox
  document.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.getElementById("modalPreviewImage").src = card.querySelector("img").src;
      document.getElementById("modalPreviewCaption").textContent = card.querySelector(".photo-caption").textContent;
      document.getElementById("imageModal").classList.add("active");
    });
  });
  document.getElementById("closeImageModal").addEventListener("click", () => {
    document.getElementById("imageModal").classList.remove("active");
  });

  // 9. Floating Heart Shower
  document.getElementById("heart-shower-btn").addEventListener("click", () => {
    playSuccessChime();
    for (let i = 0; i < 25; i++) {
      const h = document.createElement("div");
      h.className = "floating-heart";
      h.textContent = ["💖", "💙", "💜", "✨", "🌸"][Math.floor(Math.random() * 5)];
      h.style.left = `${Math.random() * window.innerWidth}px`;
      h.style.top = `${window.innerHeight - 30}px`;
      h.style.setProperty("--duration", `${Math.random() * 2 + 2}s`);
      h.style.setProperty("--sway", `${(Math.random() - 0.5) * 150}px`);
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 4000);
    }
  });

  // 10. Mixtape Player Controller
  const playlist = [
    { title: "Special Anniversary Track", src: "vr.mpeg" }
  ];
  let currentTrack = 0;
  const audioEl = document.getElementById("bg-music");
  const playBtn = document.getElementById("playTrackBtn");

  function loadTrack(idx) {
    audioEl.src = playlist[idx].src;
    document.getElementById("trackTitle").textContent = playlist[idx].title;
    document.getElementById("trackArtist").textContent = `Track ${idx + 1} of ${playlist.length}`;
  }
  loadTrack(currentTrack);

  playBtn.addEventListener("click", () => {
    if (audioEl.paused) {
      audioEl.play().then(() => playBtn.textContent = "⏸️").catch(() => alert("Place 'vr.mpeg' in this folder!"));
    } else {
      audioEl.pause();
      playBtn.textContent = "▶️";
    }
  });

});

// 11. HTML5 Canvas Scratch Card
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Paint silver overlay
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#475569";
  ctx.font = "bold 20px Poppins";
  ctx.textAlign = "center";
  ctx.fillText("🪙 Scratch Here With Love ❤️", canvas.width / 2, canvas.height / 2);

  let isDrawing = false;
  function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener("mousedown", () => isDrawing = true);
  canvas.addEventListener("touchstart", () => isDrawing = true);
  window.addEventListener("mouseup", () => isDrawing = false);
  window.addEventListener("touchend", () => isDrawing = false);
  canvas.addEventListener("mousemove", scratch);
  canvas.addEventListener("touchmove", scratch);
}
