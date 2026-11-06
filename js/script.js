/* ==========================================================================
   VELLORE ONE WAY CABS — Site interactions & Booking System
   Vanilla JavaScript. No dependencies.
   ========================================================================== */

const BUSINESS = {
  name: "Vellore One Way Cabs",
  domain: "https://velloreonewaycabs.com",
  whatsappNumber: "919042209448",
  phoneNumber: "+91 90422 09448",
  email: "dispatch@velloreonewaycabs.com",
  address: "474/1, Kazhani Kaatu Street, Karugambathur, Vellore - 632013, Tamil Nadu"
};

/* Centralized Tariff Rates & Vehicle Specifications (Indicative Estimates) */
const TARIFF_CONFIG = {
  currency: "₹",
  sedan: {
    name: "Sedan (Swift Dzire, Toyota Etios)",
    oneWayRate: "₹14 – ₹15 / km",
    roundTripRate: "₹13 – ₹14 / km",
    driverBata: "₹300 – ₹400 / day",
    capacity: "4 Passengers",
    luggage: "2 Bags",
    minOneWayKm: 130,
    minRoundTripKmPerDay: 250
  },
  suv: {
    name: "SUV (Toyota Innova, Maruti Ertiga)",
    oneWayRate: "₹19 – ₹20 / km",
    roundTripRate: "₹18 – ₹19 / km",
    driverBata: "₹300 – ₹400 / day",
    capacity: "6 – 7 Passengers",
    luggage: "3 – 4 Bags",
    minOneWayKm: 130,
    minRoundTripKmPerDay: 250
  },
  premium: {
    name: "Premium / Prime SUV (Innova Crysta)",
    oneWayRate: "₹20 – ₹21 / km",
    roundTripRate: "₹18 – ₹19 / km",
    driverBata: "₹400 / day",
    capacity: "6 – 7 Passengers",
    luggage: "4+ Bags",
    minOneWayKm: 130,
    minRoundTripKmPerDay: 250
  },
  note: "Tolls, parking and interstate permits are extra as per actual highway receipts."
};

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* 1. Sticky navigation                                                */
  /* ------------------------------------------------------------------ */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 24);
      lastY = y;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Mobile navigation                                                */
  /* ------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = $(".nav__toggle");
    const drawer = $(".nav__drawer");
    if (!toggle || !drawer) return;

    const close = () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
    };
    const open = () => {
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      const first = $("a", drawer);
      if (first) first.focus({ preventScroll: true });
    };

    toggle.addEventListener("click", () => {
      document.body.classList.contains("nav-open") ? close() : open();
    });
    $$("a", drawer).forEach((a) => a.addEventListener("click", close));
    const closeBtn = $(".nav__drawer-close", drawer);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        close();
        toggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) close();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. Scroll reveals                                                   */
  /* ------------------------------------------------------------------ */
  function initReveals() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = el.dataset.delay;
          if (delay) el.style.setProperty("--d", delay + "ms");
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* 4. Hero word stagger                                                */
  /* ------------------------------------------------------------------ */
  function initHeroWords() {
    $$("[data-split]").forEach((heading) => {
      const words = heading.textContent.trim().split(/\s+/);
      heading.innerHTML = words
        .map((word, i) => `<span class="word"><span style="--i:${i}">${word}</span></span>`)
        .join(" ");
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Subtle parallax                                                  */
  /* ------------------------------------------------------------------ */
  function initParallax() {
    const layers = $$("[data-parallax]");
    if (!layers.length || prefersReducedMotion) return;
    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(layer.dataset.parallax) || 0.08;
        const offset = (rect.top - vh / 2) * speed;
        layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* ------------------------------------------------------------------ */
  /* 6. FAQ accordion                                                    */
  /* ------------------------------------------------------------------ */
  function initAccordions() {
    $$(".faq").forEach((faq) => {
      const items = $$(".faq__item", faq);
      items.forEach((item) => {
        const button = $(".faq__q", item);
        const panel = $(".faq__a", item);
        if (!button || !panel) return;

        button.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");
          items.forEach((other) => {
            other.classList.remove("is-open");
            const b = $(".faq__q", other);
            const p = $(".faq__a", other);
            if (b) b.setAttribute("aria-expanded", "false");
            if (p) p.style.height = "0px";
          });
          if (!isOpen) {
            item.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
            panel.style.height = panel.scrollHeight + "px";
          }
        });
      });
      window.addEventListener("resize", () => {
        const open = $(".faq__item.is-open .faq__a", faq);
        if (open) open.style.height = open.scrollHeight + "px";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. Helpers: validation, messaging, clipboard                        */
  /* ------------------------------------------------------------------ */
  const mobilePattern = /^[6-9]\d{9}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function setFieldError(field, message) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.add("has-error");
    const error = $(".field__error", wrapper);
    if (error) error.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(field) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }

  function validateField(field) {
    const value = (field.value || "").trim();
    const type = field.dataset.validate;
    if (field.required && !value) {
      setFieldError(field, field.dataset.requiredMessage || "This field is required.");
      return false;
    }
    if (value && type === "mobile" && !mobilePattern.test(value.replace(/[\s-]/g, ""))) {
      setFieldError(field, "Enter a valid 10-digit Indian mobile number.");
      return false;
    }
    if (value && type === "email" && !emailPattern.test(value) && field.required) {
      setFieldError(field, "Enter a valid email address.");
      return false;
    }
    if (value && type === "past-date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) {
        setFieldError(field, "Please choose today or a future date.");
        return false;
      }
    }
    clearFieldError(field);
    return true;
  }

  function showStatus(el, html, isWarning) {
    if (!el) return;
    el.innerHTML = html;
    el.classList.add("is-visible");
    if (isWarning) el.classList.add("form-status--warn");
    else el.classList.remove("form-status--warn");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(area);
      return ok;
    }
  }

  function makeCopyRow(text) {
    const row = document.createElement("div");
    row.className = "copy-row";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--outline btn--sm";
    btn.textContent = "Copy enquiry details";
    btn.addEventListener("click", async () => {
      const ok = await copyText(text);
      btn.textContent = ok ? "Copied to clipboard" : "Press Ctrl / Cmd + C to copy";
      setTimeout(() => (btn.textContent = "Copy enquiry details"), 3200);
    });
    row.appendChild(btn);
    return row;
  }

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------------ */
  /* 8. Booking widget                                                   */
  /* ------------------------------------------------------------------ */
  function initBookingForm() {
    const form = $("#bookingForm");
    if (!form) return;
    const status = $("#bookingStatus");
    const fields = $$("[data-validate], [required]", form);

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.closest(".field")?.classList.contains("has-error")) validateField(field);
      });
      field.addEventListener("blur", () => {
        if ((field.value || "").trim()) validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = fields.map((f) => validateField(f)).every(Boolean);

      if (!valid) {
        const firstError = $(".has-error input, .has-error select, .has-error textarea", form);
        if (firstError) firstError.focus();
        showStatus(status, "<strong>Please check the highlighted fields.</strong> A few details still need your attention before we can prepare the enquiry.", true);
        return;
      }

      const data = new FormData(form);
      const get = (key) => (data.get(key) || "").toString().trim();

      const lines = [
        `NEW BOOKING ENQUIRY — ${BUSINESS.name}`,
        "",
        `Name: ${get("name")}`,
        `Mobile: ${get("mobile")}`,
        "",
        `Journey type: ${get("journeyType")}`,
        `Pickup location: ${get("pickup")}`,
        `Drop location: ${get("drop")}`,
        `Pickup date: ${get("date")}`,
        `Pickup time: ${get("time")}`,
        `Passengers: ${get("passengers")}`,
        `Preferred vehicle: ${get("vehicle")}`,
        "",
        `Website: ${BUSINESS.domain}`
      ];
      const message = lines.join("\n");
      const encoded = encodeURIComponent(message);

      if (!BUSINESS.whatsappNumber) {
        showStatus(
          status,
          `<strong>Thank you for preparing your enquiry.</strong> Direct online WhatsApp dispatch is currently being linked to our local desk. We have compiled your journey summary below — you can copy it to share directly with our team for immediate booking confirmation.`,
          true
        );
        const existing = $(".copy-row", status);
        if (existing) existing.remove();
        status.appendChild(makeCopyRow(message));
        return;
      }

      const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encoded}`;
      showStatus(
        status,
        `<strong>Opening WhatsApp with your enquiry.</strong> Review the message and press send to reach ${escapeHtml(BUSINESS.name)}. If WhatsApp does not open automatically, use the button below.`
      );
      const row = document.createElement("div");
      row.className = "copy-row";
      const link = document.createElement("a");
      link.className = "btn btn--sm";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Open WhatsApp";
      row.appendChild(link);
      const copyRow = makeCopyRow(message);
      status.appendChild(row);
      status.appendChild(copyRow);
      window.location.href = url;
    });
  }

  /* ------------------------------------------------------------------ */
  /* 9. Prefill enquiry from route / vehicle buttons                     */
  /* ------------------------------------------------------------------ */
  function initEnquiryPrefill() {
    $$("[data-prefill-drop]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const form = $("#bookingForm");
        if (!form) return;
        const drop = form.querySelector('[name="drop"]');
        const pickup = form.querySelector('[name="pickup"]');
        const vehicle = form.querySelector('[name="vehicle"]');
        if (drop && btn.dataset.prefillDrop) drop.value = btn.dataset.prefillDrop;
        if (pickup && !pickup.value) pickup.value = "Vellore";
        if (vehicle && btn.dataset.prefillVehicle) vehicle.value = btn.dataset.prefillVehicle;
        const target = $("#booking") || form;
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        setTimeout(() => {
          const focusField = form.querySelector('[name="name"]');
          if (focusField) focusField.focus({ preventScroll: true });
        }, prefersReducedMotion ? 0 : 700);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 10. Contact form                                                    */
  /* ------------------------------------------------------------------ */
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const status = $("#contactStatus");
    const fields = $$("[data-validate], [required]", form);

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.closest(".field")?.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = fields.map((f) => validateField(f)).every(Boolean);
      if (!valid) {
        showStatus(status, "<strong>Please complete the highlighted fields.</strong> Check the mobile number and journey date, then try again.", true);
        const firstError = $(".has-error input, .has-error textarea", form);
        if (firstError) firstError.focus();
        return;
      }

      const data = new FormData(form);
      const get = (key) => (data.get(key) || "").toString().trim();
      const summary = [
        `ENQUIRY — ${BUSINESS.name}`,
        "",
        `Name: ${get("cname")}`,
        `Mobile: ${get("cmobile")}`,
        `Email: ${get("cemail") || "Not provided"}`,
        `Pickup: ${get("cpickup")}`,
        `Destination: ${get("cdestination")}`,
        `Journey date: ${get("cdate")}`,
        `Message: ${get("cmessage") || "—"}`
      ].join("\n");

      if (BUSINESS.whatsappNumber) {
        const encoded = encodeURIComponent(summary);
        const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encoded}`;
        showStatus(
          status,
          `<strong>Opening WhatsApp with your enquiry.</strong> Review the message and press send to reach ${escapeHtml(BUSINESS.name)}. If WhatsApp does not open automatically, use the button below.`
        );
        const row = document.createElement("div");
        row.className = "copy-row";
        const link = document.createElement("a");
        link.className = "btn btn--sm";
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Open WhatsApp";
        row.appendChild(link);
        const copyRow = makeCopyRow(summary);
        status.appendChild(row);
        status.appendChild(copyRow);
        window.location.href = url;
        return;
      }

      showStatus(
        status,
        `<strong>Thank you for contacting us.</strong> Our direct online inbox is currently being connected to our dispatch desk. We have prepared your enquiry summary below — copy it to share directly with our team for immediate booking assistance.`,
        true
      );
      const existing = $(".copy-row", status);
      if (existing) existing.remove();
      status.appendChild(makeCopyRow(summary));
    });
  }

  /* ------------------------------------------------------------------ */
  /* 11. Misc                                                            */
  /* ------------------------------------------------------------------ */
  function initFloatCall() {
    if (!BUSINESS.whatsappNumber) return;
    $$(".float-call").forEach((el) => {
      el.href = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent("Hello Vellore One Way Cabs, I would like to book a cab.")}`;
      el.target = "_blank";
      el.rel = "noopener";
      el.setAttribute("aria-label", "Contact Vellore One Way Cabs on WhatsApp");
    });
  }

  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  function initDateMin() {
    const today = new Date().toISOString().split("T")[0];
    $$('input[type="date"]').forEach((input) => {
      input.min = today;
    });
  }

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach((link) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 12. Direct WhatsApp booking navigation                              */
  /* ------------------------------------------------------------------ */
  function initBookingLinks() {
    if (!BUSINESS.whatsappNumber) return;
    const baseWa = `https://wa.me/${BUSINESS.whatsappNumber}`;
    $$('a[href*="#booking"], a[href*="index.html#booking"]').forEach((a) => {
      if (
        a.classList.contains("btn") ||
        a.classList.contains("nav__drawer-link") ||
        a.classList.contains("nav__cta") ||
        a.classList.contains("float-call") ||
        a.classList.contains("link-arrow")
      ) {
        const text = (a.textContent || "").trim();
        let msg = `Hello ${BUSINESS.name}, I would like to book a cab.`;
        if (/sedan/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book a Sedan cab.`;
        else if (/suv/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book an SUV cab.`;
        else if (/premium/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book a Premium cab.`;
        else if (/one\s*way/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to enquire about a One Way Drop taxi.`;
        else if (/round\s*trip/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to enquire about a Round Trip taxi.`;
        else if (/local/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book a Local cab service in Vellore.`;
        else if (/outstation/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book an Outstation cab from Vellore.`;
        else if (/airport/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book an Airport Transfer cab.`;
        else if (/family|group/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to enquire about Family and Group travel.`;
        else if (/ride/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to book a cab ride.`;
        else if (/quote|fare/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to get a fare quote.`;
        else if (/plan/i.test(text)) msg = `Hello ${BUSINESS.name}, I would like to plan a cab journey.`;

        const targetUrl = `${baseWa}?text=${encodeURIComponent(msg)}`;
        a.href = targetUrl;
        a.target = "_blank";
        a.rel = "noopener";
        a.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      }
    });

    $$("[data-prefill-vehicle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const vehicle = btn.dataset.prefillVehicle || "Cab";
        const drop = btn.dataset.prefillDrop || "";
        let msg = `Hello ${BUSINESS.name}, I would like to enquire about booking a ${vehicle}.`;
        if (drop) {
          msg = `Hello ${BUSINESS.name}, I would like to enquire about booking a ${vehicle} from Vellore to ${drop}.`;
        }
        const url = `${baseWa}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank", "noopener");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileNav();
    initHeroWords();
    initReveals();
    initParallax();
    initAccordions();
    initBookingForm();
    initEnquiryPrefill();
    initContactForm();
    initFloatCall();
    initYear();
    initDateMin();
    initSmoothAnchors();
    initBookingLinks();
  });
})();
