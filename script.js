const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const contactForm = document.querySelector("[data-contact-form]");
const carousel = document.querySelector("[data-carousel]");
const whatsappWidget = document.querySelector("[data-whatsapp-widget]");
const whatsappPanel = document.querySelector("[data-whatsapp-panel]");
const whatsappForm = document.querySelector("[data-whatsapp-form]");
const whatsappOpenButtons = document.querySelectorAll("[data-whatsapp-open]");
const whatsappClose = document.querySelector("[data-whatsapp-close]");
const whatsappNumber = "5561996942531";
const whatsappOwner = "Fabiano Nery";
let setWhatsappOpen = () => {};

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

if (carousel) {
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let current = 0;
  let timerId;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === current;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const startCarousel = () => {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => showSlide(current + 1), 5200);
  };

  previous?.addEventListener("click", () => {
    showSlide(current - 1);
    startCarousel();
  });

  next?.addEventListener("click", () => {
    showSlide(current + 1);
    startCarousel();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startCarousel();
    });
  });

  startCarousel();
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    const text = [
      `Olá, ${whatsappOwner}.`,
      "Contato pelo site RAP NEWS DF.",
      `Meu nome é ${name}.`,
      `Assunto: ${subject}.`,
      "",
      message
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

if (whatsappWidget && whatsappPanel) {
  setWhatsappOpen = (isOpen) => {
    whatsappWidget.classList.toggle("is-open", isOpen);

    whatsappOpenButtons.forEach((button) => {
      button.setAttribute("aria-expanded", String(isOpen));
    });

    if (isOpen) {
      window.setTimeout(() => {
        whatsappPanel.querySelector("input")?.focus();
      }, 120);
    }
  };

  whatsappOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setWhatsappOpen(!whatsappWidget.classList.contains("is-open"));
    });
  });

  whatsappClose?.addEventListener("click", () => setWhatsappOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setWhatsappOpen(false);
    }
  });
}

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(whatsappForm);
    const lead = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      createdAt: new Date().toISOString()
    };

    const text = [
      `Olá, ${whatsappOwner}.`,
      "Recebi o contato pelo site RAP NEWS DF.",
      "",
      `Nome: ${lead.name}`,
      `Email: ${lead.email}`,
      `Zap: ${lead.phone}`,
      `Assunto: ${lead.subject}`
    ].join("\n");

    try {
      const savedLeads = JSON.parse(localStorage.getItem("rapnewsdf_whatsapp_leads") || "[]");
      savedLeads.push(lead);
      localStorage.setItem("rapnewsdf_whatsapp_leads", JSON.stringify(savedLeads.slice(-50)));
    } catch (error) {
      console.warn("Nao foi possivel salvar o cadastro local.", error);
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    whatsappForm.reset();
    setWhatsappOpen(false);
  });
}
