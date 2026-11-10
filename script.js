/**
 * ECOPOWER — Interactive Sustainable Energy Web Application
 * Core Frontend Controller: Particles, Calculator, Validation, Modals, Counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Preloader Removal
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 650);
    }
  });

  /* Fallback in case window load triggers late */
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => { preloader.style.display = 'none'; }, 650);
    }
  }, 2500);

  /* ==========================================================================
     2. Sticky Navigation Bar & Mobile Drawer
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  hamburgerBtn.addEventListener('click', () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    hamburgerBtn.classList.toggle('is-active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile drawer on link click & highlight active
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* Active Navigation Spy based on Scroll Position */
  const sections = document.querySelectorAll('section[id]');
  const navObserverOptions = { root: null, rootMargin: '-25% 0px -65% 0px', threshold: 0 };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(sec => navObserver.observe(sec));

  /* ==========================================================================
     3. Hero Particle Canvas Animation
     ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particlesArray = [];
    const particleCount = window.innerWidth < 768 ? 32 : 65;

    class EnergyParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = -Math.random() * 0.5 - 0.2; // Gentle upward thermal float
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.4 ? '#C5F36B' : '#0B8F64';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new EnergyParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     4. Metric Counter Animation
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const increment = target / 70;

      const updateCounter = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
    });
  };

  const statsSection = document.querySelector('.hero-stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     5. Scroll Reveal Intersection Observers
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.reveal-fade, .source-card, .benefit-card, .tip-card, .calc-wrapper, .about-split-layout, .contact-grid'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('reveal-fade');
    revealObserver.observe(el);
  });

  /* ==========================================================================
     6. Interactive Energy Savings Calculator
     ========================================================================== */
  const monthlyKwhInput = document.getElementById('monthlyKwh');
  const monthlyKwhRange = document.getElementById('monthlyKwhRange');
  const costPerKwhInput = document.getElementById('costPerKwh');
  const costPerKwhRange = document.getElementById('costPerKwhRange');
  const reductionTarget = document.getElementById('reductionTarget');
  const targetValueText = document.getElementById('targetValueText');
  const recalculateBtn = document.getElementById('recalculateBtn');

  // Result display nodes
  const resCurrentBill = document.getElementById('resCurrentBill');
  const resMonthlySavings = document.getElementById('resMonthlySavings');
  const resYearlySavings = document.getElementById('resYearlySavings');
  const resCo2Offset = document.getElementById('resCo2Offset');
  const resProjectedBill = document.getElementById('resProjectedBill');
  const progressFill = document.getElementById('progressFill');

  // Synchronize inputs & range sliders
  const syncValues = (src, dest) => {
    dest.value = src.value;
  };

  monthlyKwhInput.addEventListener('input', () => {
    syncValues(monthlyKwhInput, monthlyKwhRange);
    runSavingsCalculation();
  });
  monthlyKwhRange.addEventListener('input', () => {
    syncValues(monthlyKwhRange, monthlyKwhInput);
    runSavingsCalculation();
  });

  costPerKwhInput.addEventListener('input', () => {
    syncValues(costPerKwhInput, costPerKwhRange);
    runSavingsCalculation();
  });
  costPerKwhRange.addEventListener('input', () => {
    syncValues(costPerKwhRange, costPerKwhInput);
    runSavingsCalculation();
  });

  reductionTarget.addEventListener('input', () => {
    targetValueText.innerText = `${reductionTarget.value}%`;
    runSavingsCalculation();
  });

  if (recalculateBtn) {
    recalculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      runSavingsCalculation();
      recalculateBtn.style.transform = 'scale(0.96)';
      setTimeout(() => { recalculateBtn.style.transform = ''; }, 150);
    });
  }

  function runSavingsCalculation() {
    const kwh = parseFloat(monthlyKwhInput.value) || 0;
    const cost = parseFloat(costPerKwhInput.value) || 0;
    const percent = parseFloat(reductionTarget.value) || 0;

    // Mathematical formula models
    const currentMonthlySpend = kwh * cost;
    const savedRatio = percent / 100;
    const monthlySavingsVal = currentMonthlySpend * savedRatio;
    const yearlySavingsVal = monthlySavingsVal * 12;
    const newMonthlySpend = currentMonthlySpend - monthlySavingsVal;

    // Carbon reduction metric: ~0.392 kg CO2 per kWh avoided (average clean energy displacement)
    const annualKwhAvoided = (kwh * savedRatio) * 12;
    const kgCo2Saved = Math.round(annualKwhAvoided * 0.392);

    // Format currencies
    resCurrentBill.innerText = `$${currentMonthlySpend.toFixed(2)}`;
    resMonthlySavings.innerText = `$${monthlySavingsVal.toFixed(2)}`;
    resYearlySavings.innerText = `$${yearlySavingsVal.toFixed(2)}`;
    resProjectedBill.innerText = `$${newMonthlySpend.toFixed(2)} / mo`;
    resCo2Offset.innerText = `${kgCo2Saved.toLocaleString()} kg`;

    // Update graphical track fill (shows percentage remaining after savings)
    const remainingRatio = Math.max(10, 100 - percent);
    progressFill.style.width = `${remainingRatio}%`;
  }

  // Initial calculation trigger
  runSavingsCalculation();

  /* ==========================================================================
     7. Information Modals for Energy Sources
     ========================================================================== */
  const sourceModalData = {
    solar: {
      title: "Solar Photovoltaic & Concentrated Thermal",
      badge: "Inexhaustible Radiant Power",
      description: "Harnessing photon interaction within silicon semiconducting crystalline lattices, modern multi-junction photovoltaic arrays achieve unprecedented efficiency even in overcast atmospheres. Integrated with solid-state inverters, solar forms the distributed cornerstone of decentralized decarbonization.",
      specs: [
        { label: "Levelized Cost of Energy", val: "$0.033 / kWh" },
        { label: "Payback Horizon", val: "3 – 5 Years" },
        { label: "Typical Lifespan", val: "25 – 30 Years" },
        { label: "Operational Emissions", val: "0 g CO₂ / kWh" }
      ]
    },
    wind: {
      title: "Aerodynamic Kinetic Wind Power",
      badge: "Atmospheric Pressure Harvesting",
      description: "Direct-drive offshore and onshore turbines harness atmospheric velocity with minimal friction losses. By positioning blades in steady laminar airflows, modern turbines feed clean megawatt capacity directly into synchronized regional distribution links.",
      specs: [
        { label: "Capacity Factor", val: "Up to 52%" },
        { label: "Baseline Hub Height", val: "110 – 160 meters" },
        { label: "Energy Return on Invest", val: "24 : 1 Ratio" },
        { label: "Turbine Recyclability", val: "88% – 95%" }
      ]
    },
    hydro: {
      title: "Hydroelectric & Closed-Loop Pumped Storage",
      badge: "Gravity-Driven Baseline Energy",
      description: "Hydroelectric systems convert natural hydraulic potential through high-flow Francis and Pelton turbines. In addition to high-efficiency baseload power generation, pumped storage acts as a giant ecological gravity battery, absorbing excess solar during midday and releasing it at dusk.",
      specs: [
        { label: "Mechanical Efficiency", val: "90% – 95%" },
        { label: "Storage Duration", val: "Hours to Weeks" },
        { label: "System Operational Life", val: "60 – 100+ Years" },
        { label: "Dispatch Response Time", val: "< 90 Seconds" }
      ]
    },
    biomass: {
      title: "Advanced Biomass & Anaerobic Circular Biogas",
      badge: "Circular Carbon Neutrality",
      description: "Organic residues from agriculture and forestry are processed inside closed-loop anaerobic digesters and clean thermochemical gasifiers. This intercepts methane that would otherwise escape from open decomposing landfills while generating dispatchable high-heat thermal energy.",
      specs: [
        { label: "Waste Valorization", val: "100% Organic Inflow" },
        { label: "Co-Product Output", val: "Bio-fertilizer Compost" },
        { label: "Lifecycle Carbon Cycle", val: "Closed / Net-Zero" },
        { label: "Thermal Cogeneration", val: "Combined Heat & Power" }
      ]
    }
  };

  const modalOverlay = document.getElementById('infoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDynamicContent = document.getElementById('modalDynamicContent');
  const openModalButtons = document.querySelectorAll('.open-modal');

  const openSourceModal = (sourceKey) => {
    const data = sourceModalData[sourceKey];
    if (!data) return;

    modalDynamicContent.innerHTML = `
      <span class="modal-badge">${data.badge}</span>
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <div class="modal-spec-grid">
        ${data.specs.map(s => `
          <div class="modal-spec-item">
            <strong>${s.label}</strong>
            <span>${s.val}</span>
          </div>
        `).join('')}
      </div>
    `;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeSourceModal = () => {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalKey = btn.getAttribute('data-modal');
      openSourceModal(modalKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSourceModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeSourceModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeSourceModal();
    }
  });

  /* ==========================================================================
     8. Contact Form Frontend Validation & Simulation
     ========================================================================== */
  const enquiryForm = document.getElementById('enquiryForm');
  const formSuccessModal = document.getElementById('formSuccessModal');
  const submittedSummary = document.getElementById('submittedSummary');
  const resetFormBtn = document.getElementById('resetFormBtn');

  const fullName = document.getElementById('fullName');
  const emailAddress = document.getElementById('emailAddress');
  const phoneNumber = document.getElementById('phoneNumber');
  const energySource = document.getElementById('energySource');
  const messageText = document.getElementById('messageText');

  // Regular expressions
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const validateField = (input, isValid, container) => {
    if (isValid) {
      container.classList.remove('invalid');
    } else {
      container.classList.add('invalid');
    }
    return isValid;
  };

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(
      fullName,
      fullName.value.trim().length >= 2,
      fullName.parentElement
    );

    const isEmailValid = validateField(
      emailAddress,
      emailRegex.test(emailAddress.value.trim()),
      emailAddress.parentElement
    );

    const isPhoneValid = validateField(
      phoneNumber,
      phoneRegex.test(phoneNumber.value.trim()),
      phoneNumber.parentElement
    );

    const isSourceValid = validateField(
      energySource,
      energySource.value !== '',
      energySource.parentElement
    );

    const isMessageValid = validateField(
      messageText,
      messageText.value.trim().length >= 10,
      messageText.parentElement
    );

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isSourceValid && isMessageValid;

    if (isFormValid) {
      // Form simulation response
      submittedSummary.innerHTML = `
        <strong>Client Name:</strong> ${fullName.value.trim()}<br />
        <strong>Contact:</strong> ${emailAddress.value.trim()} | ${phoneNumber.value.trim()}<br />
        <strong>Target Energy Source:</strong> ${energySource.value}<br />
        <strong>Inquiry Excerpt:</strong> “${messageText.value.trim().slice(0, 75)}...”
      `;

      enquiryForm.style.display = 'none';
      formSuccessModal.style.display = 'block';
    }
  });

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      enquiryForm.reset();
      formSuccessModal.style.display = 'none';
      enquiryForm.style.display = 'block';
      document.querySelectorAll('.form-field').forEach(f => f.classList.remove('invalid'));
    });
  }

  /* Clear validation error style on user typing */
  [fullName, emailAddress, phoneNumber, energySource, messageText].forEach(field => {
    field.addEventListener('input', () => {
      field.parentElement.classList.remove('invalid');
    });
  });

  /* ==========================================================================
     9. Back to Top Smooth Scroll
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});