// =========================================================================
// 1. GLOBAL MULTI-PAGE CONTROLLER
// =========================================================================
let currentPageIndex = 0;
const totalPages = 5;
let quizPassed = false; // Progress to Gallery is locked until quiz is 100% correct

function showPage(index) {
  if (index < 0 || index >= totalPages) return;

  // Lock: Cannot go to Gallery or Love Letter until Quiz is completed correctly
  if (index >= 3 && !quizPassed) {
    alert("Renuka! ❤️ You have to answer all 3 quiz questions correctly to unlock our memories!");
    return;
  }

  currentPageIndex = index;

  const pages = document.querySelectorAll(".app-page");
  pages.forEach((page, idx) => {
    page.classList.toggle("active", idx === currentPageIndex);
  });

  const dots = document.querySelectorAll(".step-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentPageIndex);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextPage() {
  if (currentPageIndex === 2 && !quizPassed) {
    return;
  }
  if (currentPageIndex < totalPages - 1) {
    showPage(currentPageIndex + 1);
  }
}

function prevPage() {
  if (currentPageIndex > 0) {
    showPage(currentPageIndex - 1);
  }
}

// =========================================================================
// 2. GRAND CELEBRATION CONFETTI SHOWER
// =========================================================================
function triggerGrandCelebration() {
  if (typeof confetti !== "function") return;
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#38bdf8", "#c084fc", "#fde047"],
    });
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#38bdf8", "#c084fc", "#fde047"],
    });
  }, 250);
}

// Expose navigation functions to window
window.showPage = showPage;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.triggerGrandCelebration = triggerGrandCelebration;

// =========================================================================
// 3. DOM EVENT LISTENERS & INTERACTION LOGIC
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  
  // Bind step indicator dots
  const dots = document.querySelectorAll(".step-dot");
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const step = parseInt(dot.dataset.step, 10);
      showPage(step);
    });
  });

  // -----------------------------------------------------------------------
  // A. LIVE COUNTDOWN TO AUGUST 24, 2026
  // -----------------------------------------------------------------------
  function startAnniversaryCountdown() {
    const targetDate = new Date("2026-08-24T00:00:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const container = document.getElementById("countdownTimer");

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        if (container) {
          container.innerHTML = "<div class='celebrate-text'>🎉 Happy 7th Love Anniversary, VR Renuka! ❤️ 🎉</div>";
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  startAnniversaryCountdown();

  // -----------------------------------------------------------------------
  // B. SYNTHESIZED SOUND EFFECTS (Web Audio API)
  // -----------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
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
    } catch (e) {}
  }

  function playSuccessChime() {
    try {
      initAudio();
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  function playWrongSound() {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  // -----------------------------------------------------------------------
  // C. 7 BALLOONS POPPING & MODAL REVEAL
  // -----------------------------------------------------------------------
  const balloons = document.querySelectorAll(".balloon");
  const modal = document.getElementById("messageModal");
  const modalYearTitle = document.getElementById("modalYearTitle");
  const modalMessageText = document.getElementById("modalMessageText");
  const closeModal = document.getElementById("closeModal");

  let poppedCount = 0;

  balloons.forEach((balloon) => {
    balloon.addEventListener("click", () => {
      if (balloon.classList.contains("popped")) return;

      playPopSound();

      const rect = balloon.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      if (typeof confetti === "function") {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: originX, y: originY },
          colors: ["#38bdf8", "#c084fc", "#bae6fd", "#f3e8ff", "#fde047"],
        });
      }

      balloon.classList.add("popped");
      poppedCount++;

      setTimeout(() => {
        if (modalYearTitle) modalYearTitle.textContent = balloon.dataset.year;
        if (modalMessageText) modalMessageText.textContent = balloon.dataset.message;
        if (modal) modal.classList.add("active");

        if (poppedCount === balloons.length) {
          triggerGrandCelebration();
        }
      }, 250);
    });
  });

  function hideModal() {
    if (modal) modal.classList.remove("active");
  }

  if (closeModal) closeModal.addEventListener("click", hideModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      hideModal();
    }
  });

  // -----------------------------------------------------------------------
  // D. COUPLE QUIZ
  // -----------------------------------------------------------------------
  const quizQuestions = [
    {
      question: "1. What is my favourite food?",
      options: [
        "Cheesy Burst Pizza 🍕",
        "Hot & Spicy Biriyani 🍗✨",
        "Crispy Fried Chicken 🍗",
        "Paneer Butter Masala 🍛"
      ],
      correctIndex: 1 // Biriyani
    },
    {
      question: "2. What is my favourite color in the world?",
      options: [
        "Royal Sky Blue 💙",
        "Pitch Midnight Black 🖤",
        "Crimson Red ❤️",
        "Lavender Purple 💜"
      ],
      correctIndex: 0 // Blue
    },
    {
      question: "3. Who is the queen of my heart and the love of my life?",
      options: [
        "My Sweet Angel Priya ✨",
        "My Beautiful V.Renuka 👑❤️",
        "Princess Sneha 🌸",
        "Cute Girl Ananya 💖"
      ],
      correctIndex: 1 // Renuka
    }
  ];

  let currentQuizIndex = 0;
  const quizBox = document.getElementById("quizBox");
  const quizAlert = document.getElementById("quizAlert");
  const quizQuestionEl = document.getElementById("quizQuestion");
  const quizOptionsEl = document.getElementById("quizOptions");
  const questionCountEl = document.getElementById("questionCount");
  const progressBarEl = document.getElementById("progressBar");
  const quizContentEl = document.getElementById("quizContent");
  const quizResultEl = document.getElementById("quizResult");
  const quizNextBtn = document.getElementById("quizNextBtn");

  function loadQuizQuestion() {
    const currentQ = quizQuestions[currentQuizIndex];
    if (!currentQ) return;

    questionCountEl.textContent = `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`;
    progressBarEl.style.width = `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%`;
    quizQuestionEl.textContent = currentQ.question;
    quizOptionsEl.innerHTML = "";

    currentQ.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-btn";
      btn.innerHTML = `<span>${opt}</span> <span>✨</span>`;
      btn.addEventListener("click", () => handleAnswerSelect(idx, btn));
      quizOptionsEl.appendChild(btn);
    });
  }

  function handleAnswerSelect(selectedIndex, selectedBtn) {
    const currentQ = quizQuestions[currentQuizIndex];
    const allButtons = quizOptionsEl.querySelectorAll(".quiz-btn");
    allButtons.forEach((b) => (b.disabled = true));

    if (selectedIndex === currentQ.correctIndex) {
      selectedBtn.classList.add("correct");
      playSuccessChime();
      
      if (typeof confetti === "function") {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#4ade80", "#38bdf8", "#c084fc"]
        });
      }

      setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < quizQuestions.length) {
          loadQuizQuestion();
        } else {
          quizPassed = true;
          quizContentEl.style.display = "none";
          if (quizAlert) quizAlert.classList.add("hidden");
          quizResultEl.classList.remove("hidden");
          if (quizNextBtn) quizNextBtn.style.display = "inline-block";
          triggerGrandCelebration();
        }
      }, 900);

    } else {
      selectedBtn.classList.add("incorrect");
      allButtons[currentQ.correctIndex].classList.add("correct");
      playWrongSound();

      if (quizBox) {
        quizBox.classList.add("shake");
        setTimeout(() => quizBox.classList.remove("shake"), 500);
      }

      if (quizAlert) quizAlert.classList.remove("hidden");

      setTimeout(() => {
        currentQuizIndex = 0;
        loadQuizQuestion();
      }, 1400);
    }
  }

  loadQuizQuestion();

  // -----------------------------------------------------------------------
  // E. PHOTO GALLERY ZOOM LIGHTBOX
  // -----------------------------------------------------------------------
  const photoCards = document.querySelectorAll(".photo-card");
  const imageModal = document.getElementById("imageModal");
  const modalPreviewImage = document.getElementById("modalPreviewImage");
  const modalPreviewCaption = document.getElementById("modalPreviewCaption");
  const closeImageModal = document.getElementById("closeImageModal");

  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const caption = card.querySelector(".photo-caption");

      if (img && modalPreviewImage) {
        modalPreviewImage.src = img.src;
        if (modalPreviewCaption && caption) {
          modalPreviewCaption.textContent = caption.textContent;
        }
        if (imageModal) imageModal.classList.add("active");
      }
    });
  });

  function hideImageModal() {
    if (imageModal) imageModal.classList.remove("active");
  }

  if (closeImageModal) closeImageModal.addEventListener("click", hideImageModal);
  window.addEventListener("click", (e) => {
    if (e.target === imageModal) hideImageModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageModal && imageModal.classList.contains("active")) {
      hideImageModal();
    }
  });

  // -----------------------------------------------------------------------
  // F. FLOATING HEART SHOWER
  // -----------------------------------------------------------------------
  const heartShowerBtn = document.getElementById("heart-shower-btn");
  const heartIcons = ["💖", "💙", "💜", "❤️", "💕", "✨", "🌸", "💍"];

  function createHeartShower() {
    playSuccessChime();

    if (typeof confetti === "function") {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.9, y: 0.9 },
        colors: ["#38bdf8", "#c084fc", "#f43f5e", "#fde047"]
      });
    }

    const heartCount = 30;
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight - (Math.random() * 60);
        const duration = Math.random() * 2 + 2.5;
        const sway = (Math.random() - 0.5) * 160 + "px";
        const rotation = (Math.random() - 0.5) * 90 + "deg";
        const fontSize = Math.random() * 18 + 20 + "px";

        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        heart.style.fontSize = fontSize;
        heart.style.setProperty("--duration", `${duration}s`);
        heart.style.setProperty("--sway", sway);
        heart.style.setProperty("--rot", rotation);

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), duration * 1000);
      }, i * 40);
    }
  }

  if (heartShowerBtn) {
    heartShowerBtn.addEventListener("click", createHeartShower);
  }

  // -----------------------------------------------------------------------
  // G. PERSONAL LOVE LETTER MODAL REVEAL (CLEAN POPUP)
  // -----------------------------------------------------------------------
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const personalLetterModal = document.getElementById("personalLetterModal");
  const closeLetterModal = document.getElementById("closeLetterModal");

  if (envelopeWrapper && personalLetterModal) {
    envelopeWrapper.addEventListener("click", () => {
      // 1. Animate envelope open
      envelopeWrapper.classList.add("open");
      playSuccessChime();

      if (typeof confetti === "function") {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#c084fc", "#38bdf8", "#f43f5e"],
        });
      }

      // 2. Open dedicated personal letter modal smoothly after flap opens
      setTimeout(() => {
        personalLetterModal.classList.add("active");
      }, 450);
    });
  }

  function hidePersonalLetterModal() {
    if (personalLetterModal) {
      personalLetterModal.classList.remove("active");
      if (envelopeWrapper) envelopeWrapper.classList.remove("open");
    }
  }

  if (closeLetterModal) closeLetterModal.addEventListener("click", hidePersonalLetterModal);
  window.addEventListener("click", (e) => {
    if (e.target === personalLetterModal) hidePersonalLetterModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && personalLetterModal && personalLetterModal.classList.contains("active")) {
      hidePersonalLetterModal();
    }
  });

  // -----------------------------------------------------------------------
  // H. BACKGROUND MUSIC CONTROLLER
  // -----------------------------------------------------------------------
  const musicBtn = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicBtn.innerHTML = "⏸️ Pause Song";
          musicBtn.style.background = "var(--light-purple)";
          musicBtn.style.color = "#070712";
        }).catch(() => {
          alert("Add 'vr.mpeg' in this folder to play music!");
        });
      } else {
        bgMusic.pause();
        musicBtn.innerHTML = "🎵 Play Song";
        musicBtn.style.background = "var(--bg-surface)";
        musicBtn.style.color = "var(--sky-blue)";
      }
    });
  }
});