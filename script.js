let currentPageIndex = 0;
const totalPages = 7;
let quizPassed = false;
let scratchInitialized = false;

// 1. Navigation Flow
function showPage(index) {
  if (index < 0 || index >= totalPages) return;

  // Progression Gate
  if (index >= 4 && !quizPassed) {
    alert("Renuka! ❤️ Complete the Love Quiz correctly to unlock our memory vault!");
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

// 2. Synthesized Sound Effects (Zero External Asset Dependency)
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

document.addEventListener("DOMContentLoaded", () => {

  // Step Indicators
  document.querySelectorAll(".step-dot").forEach((dot) => {
    dot.addEventListener("click", () => showPage(parseInt(dot.dataset.step, 10)));
  });

  // Cursor Sparkle Trail (Desktop & Touch)
  function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle-particle";
    const size = Math.random() * 6 + 4;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }

  let sparkleThrottle = 0;
  window.addEventListener("mousemove", (e) => {
    sparkleThrottle++;
    if (sparkleThrottle % 3 === 0) createSparkle(e.clientX, e.clientY);
  });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // 3D Parallax Tilt on Cards (Desktop)
  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y / 28}deg) rotateY(${x / 28}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });

  // Constellation Background Canvas
  const canvas = document.getElementById("starsCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
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
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 110})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animateStars);
    }
    animateStars();
  }

  // Live Countdown to August 24, 2026
  const targetDate = new Date("2026-08-24T00:00:00").getTime();
  function updateTimer() {
    const diff = targetDate - new Date().getTime();
    if (diff <= 0) return;
    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");
    if (d) d.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
    if (h) h.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
    if (m) m.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    if (s) s.textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
  }
  setInterval(updateTimer, 1000);
  updateTimer();

  // Balloon Popping
  document.querySelectorAll(".balloon").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.classList.contains("popped")) return;
      playPopSound();
      b.classList.add("popped");
      setTimeout(() => {
        const title = document.getElementById("modalYearTitle");
        const msg = document.getElementById("modalMessageText");
        const modal = document.getElementById("messageModal");
        if (title) title.textContent = b.dataset.year;
        if (msg) msg.textContent = b.dataset.message;
        if (modal) modal.classList.add("active");
      }, 250);
    });
  });

  const closeModalBtn = document.getElementById("closeModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      document.getElementById("messageModal").classList.remove("active");
    });
  }

  // Couple Quiz Logic
  const quizQuestions = [
    { question: "1. What is my favourite food?", options: ["Cheesy Burst Pizza 🍕", "Hot & Spicy Biriyani 🍗✨", "Fried Chicken 🍗", "Paneer Butter Masala 🍛"], correctIndex: 1 },
    { question: "2. What is my favourite color in the world?", options: ["Royal Sky Blue 💙", "Midnight Black 🖤", "Crimson Red ❤️", "Lavender Purple 💜"], correctIndex: 0 },
    { question: "3. Who is the queen of my heart and life?", options: ["Angel Priya ✨", "My Beautiful V.Renuka 👑❤️", "Princess Sneha 🌸", "Cute Girl Ananya 💖"], correctIndex: 1 }
  ];

  let currentQuiz = 0;
  function loadQuiz() {
    const q = quizQuestions[currentQuiz];
    const qCount = document.getElementById("questionCount");
    const pBar = document.getElementById("progressBar");
    const qTitle = document.getElementById("quizQuestion");
    const opts = document.getElementById("quizOptions");

    if (qCount) qCount.textContent = `Question ${currentQuiz + 1} of ${quizQuestions.length}`;
    if (pBar) pBar.style.width = `${((currentQuiz + 1) / quizQuestions.length) * 100}%`;
    if (qTitle) qTitle.textContent = q.question;
    if (!opts) return;

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
            if (currentQuiz < quizQuestions.length) {
              loadQuiz();
            } else {
              quizPassed = true;
              document.getElementById("quizContent").style.display = "none";
              document.getElementById("quizResult").classList.remove("hidden");
              document.getElementById("quizNextBtn").style.display = "inline-block";
              triggerGrandCelebration();
            }
          }, 700);
        } else {
          btn.classList.add("incorrect");
          const alertEl = document.getElementById("quizAlert");
          if (alertEl) alertEl.classList.remove("hidden");
          setTimeout(() => { currentQuiz = 0; loadQuiz(); }, 1200);
        }
      });
      opts.appendChild(btn);
    });
  }
  loadQuiz();

  // Reasons Jar
  const reasons = [
    "Your smile turns my hardest days completely upside down.",
    "You stayed by my side even when I made mistakes and had rough moments.",
    "The cute way you get possessive and show how much you care.",
    "All the delicious meals we shared together at Nemilichery.",
    "You believe in my dreams even more than I do sometimes.",
    "7 years later, my heart still skips a beat when you call my name."
  ];
  let reasonIdx = 0;
  const jarEl = document.getElementById("loveJar");
  if (jarEl) {
    jarEl.addEventListener("click", () => {
      playSuccessChime();
      document.getElementById("reasonIndex").textContent = `Note #${reasonIdx + 1}`;
      document.getElementById("reasonText").textContent = `"${reasons[reasonIdx]}"`;
      reasonIdx = (reasonIdx + 1) % reasons.length;
    });
  }

  // Polaroid Flip & Lightbox
  document.querySelectorAll(".polaroid-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("zoom-btn")) return;
      card.classList.toggle("flipped");
    });
  });

  document.querySelectorAll(".zoom-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("modalPreviewImage").src = btn.dataset.img;
      document.getElementById("modalPreviewCaption").textContent = btn.dataset.cap;
      document.getElementById("imageModal").classList.add("active");
    });
  });

  const closeImageBtn = document.getElementById("closeImageModal");
  if (closeImageBtn) {
    closeImageBtn.addEventListener("click", () => {
      document.getElementById("imageModal").classList.remove("active");
    });
  }

  // Floating Heart Shower Button
  const heartBtn = document.getElementById("heart-shower-btn");
  if (heartBtn) {
    heartBtn.addEventListener("click", () => {
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
  }

  // Mixtape Audio Controller
  const audioEl = document.getElementById("bg-music");
  const playBtn = document.getElementById("playTrackBtn");

  if (playBtn && audioEl) {
    playBtn.addEventListener("click", () => {
      if (audioEl.paused) {
        audioEl.play().then(() => {
          playBtn.textContent = "⏸️";
        }).catch(() => {
          alert("Place 'vr.mpeg' in the root project folder to play music!");
        });
      } else {
        audioEl.pause();
        playBtn.textContent = "▶️";
      }
    });
  }
});

// 3. Scratch Card: Auto-Clearing at $\ge$ 50% & Scroll Restoration
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas || scratchInitialized) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  scratchInitialized = true;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width || 480;
  canvas.height = rect.height || 400;

  // Silver scratch surface
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#475569";
  ctx.font = "bold 16px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🪙 Scratch 50% to Reveal Letter ❤️", canvas.width / 2, canvas.height / 2);

  let isDrawing = false;
  let isCompleted = false;
  let throttleCount = 0;

  function checkScratchPercentage() {
    if (isCompleted) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const totalSampled = pixels.length / 64;

    for (let i = 3; i < pixels.length; i += 64) {
      if (pixels[i] === 0) transparentCount++;
    }

    const percentage = (transparentCount / totalSampled) * 100;

    if (percentage >= 50) {
      isCompleted = true;
      autoClearCanvas();
    }
  }

  function autoClearCanvas() {
    canvas.style.transition = "opacity 0.6s ease";
    canvas.style.opacity = "0";

    playSuccessChime();
    triggerGrandCelebration();

    setTimeout(() => {
      canvas.style.display = "none";
      canvas.style.pointerEvents = "none"; // Unlocks smooth touch/mouse scrolling on letter text
    }, 600);
  }

  function scratch(e) {
    if (!isDrawing || isCompleted) return;

    const bRect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - bRect.left;
    const y = clientY - bRect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    throttleCount++;
    if (throttleCount % 6 === 0) {
      checkScratchPercentage();
    }
  }

  canvas.addEventListener("mousedown", (e) => { isDrawing = true; scratch(e); });
  window.addEventListener("mouseup", () => { isDrawing = false; checkScratchPercentage(); });
  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", (e) => { isDrawing = true; scratch(e); }, { passive: true });
  window.addEventListener("touchend", () => { isDrawing = false; checkScratchPercentage(); });
  canvas.addEventListener("touchmove", (e) => { scratch(e); }, { passive: true });
}
