function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const anim = el.dataset.anim || "fade";
        el.classList.add(`animate-${anim}`);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll("[data-anim]").forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
});
