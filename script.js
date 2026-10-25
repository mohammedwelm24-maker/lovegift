/* ============ إعدادات سهلة التعديل ============ */
const PASSWORD = "love";        // ← غيّر كلمة السر من هنا
const ALT_PASSWORDS = ["لوف"];  // كلمات بديلة (لو الكيبورد عربي). اتركها [] لو مش عايزها
const MAIN_MESSAGE = "انتي اه اكتر واحده بارده و مستفزه 😂 بس في نفس الوقت انتي احلي حاجة حصلت و عارف انك علطول متوتره بس انا جنبك و بموت فيكي ❤❤😍";
const SECOND_MESSAGE = "مهما كنتي مستفزه، هتفضلي غالية عندي أوي ❤️🥹";
const ERROR_TEXT = "اوب! كلمة السر غلط يا قمر 🙈 جرّبي تاني ❤️";
const TYPING_SPEED = 55;        // بالملي ثانية لكل حرف
/* ============================================== */


/* ---------- أدوات مساعدة ---------- */

// توحيد النص: إزالة المسافات + تحويل الأرقام العربية + تجاهل حالة الحروف
function normalize(s) {
    return String(s)
    .trim()
    .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632)
    .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776)
    .toLowerCase();
}

function isCorrect(value) {
    const v = normalize(value);
    return [PASSWORD, ...ALT_PASSWORDS].some((p) => normalize(p) === v);
}

const $ = (id) => document.getElementById(id);


/* ---------- العناصر ---------- */

const lockScreen = $("lock-screen");
const surpriseScreen = $("surprise-screen");
const form = $("lock-form");
const input = $("password");
const errorEl = $("error");
const bigEnv = $("big-env");
const stage = $("env-stage");
const card = $("card");
const messageEl = $("message");
const secondEl = $("second");
const music = $("music");
const musicBtn = $("btn-music");

let typingTimer = null;
let timers = [];


/* ---------- القلوب واللمعان (عدد قليل لتخفيف الحمل على الموبايل) ---------- */

function createHearts(n) {
    const box = $("hearts");
    const icons = ["❤️", "💖", "💗", "💕", "💜"];

    for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = icons[i % icons.length];
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 14 + Math.random() * 22 + "px";
    h.style.animationDuration = 9 + Math.random() * 9 + "s";
    h.style.animationDelay = -Math.random() * 15 + "s";
    box.appendChild(h);
    }
}

function createSparkles(n) {
    const box = $("sparkles");

    for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = "✦";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = 8 + Math.random() * 10 + "px";
    s.style.animationDuration = 2 + Math.random() * 3 + "s";
    s.style.animationDelay = Math.random() * 4 + "s";
    box.appendChild(s);
    }
}

createHearts(14);
createSparkles(14);


/* ---------- التحقق من كلمة السر ---------- */

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (isCorrect(input.value)) {
    errorEl.classList.remove("show");
    lockScreen.classList.add("leaving");

    setTimeout(() => {
        lockScreen.classList.remove("active", "leaving");
        surpriseScreen.classList.add("active");
        playSequence();
    }, 600);
    } else {
    errorEl.textContent = ERROR_TEXT;
    errorEl.classList.add("show");

    form.classList.remove("shake");
    void form.offsetWidth; // لإعادة تشغيل الحركة
    form.classList.add("shake");

    input.select();
    }
});


/* ---------- تسلسل الحركة: فتح المظروف ثم ظهور الرسالة ---------- */

function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
}

function playSequence() {
    timers.forEach(clearTimeout);
    timers = [];
    clearInterval(typingTimer);

    messageEl.textContent = "";
    messageEl.classList.remove("typing");
    secondEl.textContent = "";
    secondEl.classList.remove("show");
    $("btn-surprise").disabled = false;

    card.classList.remove("show", "visible");
    stage.classList.remove("gone");
    bigEnv.classList.remove("open");

    later(() => bigEnv.classList.add("open"), 500);
    later(() => stage.classList.add("gone"), 2200);
    later(() => {
    card.classList.add("show");
    requestAnimationFrame(() => card.classList.add("visible"));
    }, 2500);
    later(typeMessage, 3200);
}

function typeMessage() {
  const chars = Array.from(MAIN_MESSAGE); // يدعم الإيموجي بشكل صحيح
    let i = 0;

    messageEl.classList.add("typing");

    typingTimer = setInterval(() => {
    messageEl.textContent += chars[i++];

    if (i >= chars.length) {
        clearInterval(typingTimer);
        messageEl.classList.remove("typing");
    }
    }, TYPING_SPEED);
}


/* ---------- زر المفاجأة الثانية ---------- */

$("btn-surprise").addEventListener("click", () => {
    secondEl.textContent = SECOND_MESSAGE;
    secondEl.classList.add("show");
    burst();
});


/* ---------- زر إعادة الحركة ---------- */

$("btn-replay").addEventListener("click", playSequence);


/* ---------- انفجار قلوب صغير عند الضغط ---------- */

function burst() {
    const box = $("hearts");

    for (let i = 0; i < 10; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = "💖";
    h.style.left = 30 + Math.random() * 40 + "%";
    h.style.fontSize = 18 + Math.random() * 18 + "px";
    h.style.animationDuration = 3 + Math.random() * 2 + "s";
    h.style.animationIterationCount = "1";
    box.appendChild(h);

    setTimeout(() => h.remove(), 5500);
    }
}


/* ---------- الموسيقى (لا تعمل تلقائياً) ---------- */

musicBtn.addEventListener("click", () => {
    if (music.paused) {
    music
        .play()
        .then(() => {
        musicBtn.textContent = "⏸️ أوقفي الموسيقى";
        })
        .catch(() => {
        musicBtn.textContent = "🎵 ملف الموسيقى غير موجود";
        });
    } else {
    music.pause();
    musicBtn.textContent = "🎵 شغّلي الموسيقى";
    }
});

music.addEventListener("error", () => {
    musicBtn.textContent = "🎵 ملف الموسيقى غير موجود";
});