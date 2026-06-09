// ===== Year in footer =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Header shadow on scroll & back-to-top =====
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");
const onScroll = () => {
  const y = window.scrollY;
  if (header) header.classList.toggle("scrolled", y > 10);
  if (toTop) toTop.classList.toggle("show", y > 600);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Mobile nav toggle =====
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
if (hamburger && nav) {
  const toggleNav = (open) => {
    const isOpen = open ?? !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  };
  hamburger.addEventListener("click", () => toggleNav());
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggleNav(false))
  );
}

// ===== Hero slideshow (auto fade) =====
const slidesWrap = document.getElementById("slides");
const dotsWrap = document.getElementById("slideDots");
if (slidesWrap) {
  const slides = Array.from(slidesWrap.querySelectorAll(".slide"));
  let current = 0;
  let timer = null;
  const INTERVAL = 1800;

  // build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `${i + 1}枚目を表示`);
    if (dotsWrap) dotsWrap.appendChild(b);
    b.addEventListener("click", () => {
      go(i);
      restart();
    });
    return b;
  });

  const go = (n) => {
    slides[current].classList.remove("is-active");
    dots[current]?.classList.remove("is-active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current]?.classList.add("is-active");
  };
  dots[0]?.classList.add("is-active");

  const next = () => go(current + 1);
  const start = () => { timer = setInterval(next, INTERVAL); };
  const restart = () => { clearInterval(timer); start(); };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && slides.length > 1) start();

  // pause on hover / when tab hidden
  slidesWrap.addEventListener("mouseenter", () => clearInterval(timer));
  slidesWrap.addEventListener("mouseleave", () => { if (!reduceMotion && slides.length > 1) restart(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer);
    else if (!reduceMotion && slides.length > 1) restart();
  });
}

// ===== Reveal on scroll =====
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// ===== Contact form (front-end only / no backend connected) =====
const form = document.getElementById("contactForm");
const result = document.getElementById("formResult");
if (form && result) {
form.addEventListener("submit", (e) => {
  e.preventDefault();
  result.className = "form__result";
  result.textContent = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk || !message) {
    result.classList.add("err");
    result.textContent = !name
      ? "お名前をご入力ください。"
      : !emailOk
      ? "メールアドレスの形式をご確認ください。"
      : "お問い合わせ内容をご入力ください。";
    return;
  }

  // TODO: 送信先を設定（Formspree / Google Forms / 自前API / mailto など）
  result.classList.add("ok");
  result.textContent = "入力チェックOK。送信先の設定後に実送信できます。";
  form.reset();
});
}
