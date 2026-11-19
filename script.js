document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const updateNavbar = () => navbar?.classList.toggle("scrolled", window.scrollY > 50);
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  // Reveal content only as it enters the viewport instead of measuring on every scroll.
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -100px 0px" });
    reveals.forEach((element) => revealObserver.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("active"));
  }

  // Animate the homepage fleet counts once when that section becomes visible.
  const fleetSection = document.querySelector("#fleet");
  const counters = document.querySelectorAll(".fleet-counter h3");
  if (fleetSection && counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      counters.forEach((counter) => {
        const target = Number.parseInt(counter.textContent, 10);
        if (!Number.isFinite(target)) return;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const tick = () => {
          current = Math.min(target, current + step);
          counter.textContent = String(current).padStart(2, "0");
          if (current < target) window.setTimeout(tick, 35);
        };
        tick();
      });
      observer.disconnect();
    }, { threshold: 0.25 });
    counterObserver.observe(fleetSection);
  }

  // Keep the copyright current on pages using this shared script.
  const year = new Date().getFullYear();
  document.querySelectorAll("footer").forEach((footer) => {
    const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(/©\s*\d{4}|&copy;\s*\d{4}/gi, `© ${year}`);
    });
  });

  // Add a direct WhatsApp enquiry option on pages that load the shared script.
  if (!document.querySelector(".whatsapp-float")) {
    const whatsapp = document.createElement("a");
    whatsapp.className = "whatsapp-float";
    whatsapp.href = "https://wa.me/919660088167?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20project.";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.setAttribute("aria-label", "Chat with Shree Govind Borewell Company on WhatsApp");
    whatsapp.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span>';
    document.body.appendChild(whatsapp);
  }
});
