const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const year = document.getElementById("year");
const siteHeader = document.getElementById("siteHeader");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener("scroll", () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}


const params = new URLSearchParams(window.location.search);
const formSuccess = document.getElementById("formSuccess");

if (params.get("sendt") === "1" && formSuccess) {
  formSuccess.hidden = false;
}

const projectImages = Array.from(document.querySelectorAll(".project-gallery img"));

if (projectImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Stort prosjektbilde");
  lightbox.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Lukk bilde">×</button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Forrige bilde">‹</button>
    <figure class="lightbox__figure">
      <img class="lightbox__image" src="" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Neste bilde">›</button>
  `;
  document.body.appendChild(lightbox);

  const largeImage = lightbox.querySelector(".lightbox__image");
  const caption = lightbox.querySelector(".lightbox__caption");
  const closeButton = lightbox.querySelector(".lightbox__close");
  const previousButton = lightbox.querySelector(".lightbox__nav--prev");
  const nextButton = lightbox.querySelector(".lightbox__nav--next");
  let currentImageIndex = 0;

  function showImage(index) {
    currentImageIndex = (index + projectImages.length) % projectImages.length;
    const selectedImage = projectImages[currentImageIndex];
    largeImage.src = selectedImage.src;
    largeImage.alt = selectedImage.alt;
    caption.textContent = selectedImage.alt;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    projectImages[currentImageIndex].focus();
  }

  projectImages.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Åpne stort bilde: ${image.alt}`);
    image.addEventListener("click", () => openLightbox(index));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
    if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
  });
}
