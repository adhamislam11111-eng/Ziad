/**
 * ══════════════════════════════════════════════════════════════════════
 * PORTFOLIO WEBSITE — ZIAD MOHAMED
 * Artificial Intelligence Student & Flutter Developer
 * File: js/script.js
 * ══════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* =====================================================================
     1. THEME MANAGER (DARK / LIGHT MODE WITH LOCALSTORAGE)
     ===================================================================== */
  const ThemeManager = {
    html: document.documentElement,
    toggleBtn: document.getElementById('theme-toggle'),
    storageKey: 'zm_theme_preference',

    init() {
      // Default to dark mode as requested, unless previously saved as light
      const savedTheme = localStorage.getItem(this.storageKey);
      const initialTheme = savedTheme ? savedTheme : 'dark';
      this.applyTheme(initialTheme);

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => {
          const currentTheme = this.html.getAttribute('data-theme') || 'dark';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          this.applyTheme(newTheme);
          localStorage.setItem(this.storageKey, newTheme);
          
          ToastManager.show(
            `Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`,
            'info'
          );
        });
      }
    },

    applyTheme(theme) {
      this.html.setAttribute('data-theme', theme);
      if (this.toggleBtn) {
        this.toggleBtn.setAttribute(
          'aria-label',
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
      }
    }
  };

  /* =====================================================================
     2. NAVIGATION & MOBILE MENU MANAGER
     ===================================================================== */
  const NavigationManager = {
    header: document.getElementById('header'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navOverlay: document.getElementById('nav-overlay'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section[id]'),

    init() {
      // Sticky header scroll listener
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      this.handleScroll();

      // Mobile Menu Toggle
      if (this.navToggle) {
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
      }

      // Close mobile menu on overlay click
      if (this.navOverlay) {
        this.navOverlay.addEventListener('click', () => this.closeMobileMenu());
      }

      // Close mobile menu on nav link click
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });

      // Escape key closes mobile menu
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navMenu && this.navMenu.classList.contains('open')) {
          this.closeMobileMenu();
        }
      });

      // Active Section Scroll Spy
      this.initScrollSpy();
    },

    handleScroll() {
      if (!this.header) return;
      if (window.scrollY > 40) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    },

    toggleMobileMenu() {
      const isOpen = this.navMenu.classList.toggle('open');
      this.navToggle.classList.toggle('open', isOpen);
      this.navOverlay.classList.toggle('active', isOpen);
      this.navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    },

    closeMobileMenu() {
      if (this.navMenu && this.navMenu.classList.contains('open')) {
        this.navMenu.classList.remove('open');
        this.navToggle.classList.remove('open');
        this.navOverlay.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    },

    initScrollSpy() {
      if (!('IntersectionObserver' in window)) return;

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            this.navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      this.sections.forEach(section => spyObserver.observe(section));
    }
  };

  /* =====================================================================
     3. INTERACTIVE HERO CANVAS (AI NEURAL NETWORK & PARTICLES)
     ===================================================================== */
  const HeroCanvas = {
    canvas: document.getElementById('hero-canvas'),
    ctx: null,
    particles: [],
    numParticles: 42,
    maxDistance: 130,
    animationFrameId: null,
    mouse: { x: null, y: null, radius: 120 },

    init() {
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;

      // Handle reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Mouse tracking on canvas
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });

      this.createParticles();
      this.animate();
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.parentElement.offsetWidth;
      this.canvas.height = this.canvas.parentElement.offsetHeight;
      if (this.canvas.width < 768) {
        this.numParticles = 22;
        this.maxDistance = 90;
      } else {
        this.numParticles = 45;
        this.maxDistance = 140;
      }
      this.createParticles();
    },

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.numParticles; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1.2,
          color: Math.random() > 0.5 ? '6, 182, 212' : '139, 92, 246'
        });
      }
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const baseOpacity = isLight ? 0.35 : 0.6;
      const lineBaseAlpha = isLight ? 0.08 : 0.14;

      // Update and draw particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        // Mouse interaction (soft repel)
        if (this.mouse.x !== null && this.mouse.y !== null) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < this.mouse.radius) {
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Draw dot
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color}, ${baseOpacity})`;
        this.ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < this.maxDistance) {
            const alpha = (1 - dist / this.maxDistance) * lineBaseAlpha;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = isLight 
              ? `rgba(59, 130, 246, ${alpha})` 
              : `rgba(6, 182, 212, ${alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  };

  /* =====================================================================
     4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ===================================================================== */
  const ScrollReveal = {
    init() {
      const elements = document.querySelectorAll('.fade-in, .skill-category-card, .project-card, .timeline-item, .service-card');

      if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(el => {
        if (!el.classList.contains('fade-in')) {
          el.classList.add('fade-in');
        }
        observer.observe(el);
      });
    }
  };

  /* =====================================================================
     5. STATS ANIMATED COUNTERS
     ===================================================================== */
  const CounterManager = {
    init() {
      const counters = document.querySelectorAll('.counter');
      if (!counters.length) return;

      let started = false;

      const runCounters = () => {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target') || 0;
          const duration = 1800; // ms
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easedProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = Math.floor(easedProgress * target);

            counter.innerText = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target;
            }
          };

          requestAnimationFrame(updateCounter);
        });
      };

      if (!('IntersectionObserver' in window)) {
        runCounters();
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !started) {
            started = true;
            runCounters();
            obs.disconnect();
          }
        });
      }, { threshold: 0.35 });

      const achievementsSection = document.getElementById('achievements');
      if (achievementsSection) {
        observer.observe(achievementsSection);
      }
    }
  };

  /* =====================================================================
     6. SKILLS CATEGORY FILTER
     ===================================================================== */
  const SkillsFilter = {
    init() {
      const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
      const cards = document.querySelectorAll('.skill-category-card');

      if (!filterBtns.length || !cards.length) return;

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active button
          filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          const filter = btn.getAttribute('data-filter');

          // Filter cards
          cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.classList.remove('hidden');
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 20);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(15px)';
              setTimeout(() => {
                card.classList.add('hidden');
              }, 250);
            }
          });
        });
      });
    }
  };

  /* =====================================================================
     7. PROJECT DETAILS MODAL
     ===================================================================== */
  const ProjectModal = {
    modal: document.getElementById('project-modal'),
    backdrop: document.getElementById('modal-backdrop'),
    closeBtn: document.getElementById('modal-close'),
    dismissBtn: document.getElementById('modal-dismiss-btn'),
    titleElem: document.getElementById('modal-title'),
    catElem: document.getElementById('modal-category'),
    bodyElem: document.getElementById('modal-body'),

    // Verified data per prompt specifications
    projectsData: {
      1: {
        category: 'Mobile Application',
        title: 'Project 01 \u2014 Flutter Mobile Application',
        description: 'A mobile application developed using Flutter and Dart, focusing on modern UI design, functionality, and user experience.',
        highlights: [
          'Cross-platform mobile implementation for iOS and Android.',
          'Built with responsive layouts adapting seamlessly to various screen densities.',
          'Fluid micro-interactions and smooth 60fps animations.',
          'Separation of concerns using modern Dart state management.'
        ],
        technologies: ['Flutter', 'Dart', 'Responsive UI', 'REST API Integration', 'State Management']
      },
      2: {
        category: 'Cloud Integrated Application',
        title: 'Project 02 \u2014 Firebase Integrated Application',
        description: 'A Flutter application demonstrating Firebase integration and cloud-based application functionality.',
        highlights: [
          'Secure user authentication supporting email/password and token management.',
          'Real-time data synchronization with Cloud Firestore.',
          'Decoupled cloud media storage management with Firebase Storage.',
          'Robust offline caching and automatic reconnect handling.'
        ],
        technologies: ['Flutter', 'Dart', 'Firebase Authentication', 'Cloud Firestore', 'Firebase Storage']
      },
      3: {
        category: 'Artificial Intelligence',
        title: 'Project 03 \u2014 AI-Based Application',
        description: 'An application concept exploring the integration of Artificial Intelligence into practical digital solutions.',
        highlights: [
          'Explores bridging machine learning models with accessible mobile frontends.',
          'Evaluates intelligent model outputs for Computer Vision and Natural Language processing.',
          'Optimized client-to-model inference pipelines to ensure quick response times.',
          'Focus on user-centric presentation of intelligent prediction results.'
        ],
        technologies: ['Artificial Intelligence', 'Machine Learning', 'Python', 'TensorFlow / PyTorch Concept', 'Flutter']
      },
      4: {
        category: 'Software Architecture',
        title: 'Project 04 \u2014 Clean Architecture Project',
        description: 'A Flutter application structured around Clean Architecture principles to improve code organization, maintainability, and scalability.',
        highlights: [
          'Distinct architectural boundaries: Domain (Entities, Use Cases), Data (Repositories, Data Sources), and Presentation.',
          'High testability through dependency inversion and loose coupling.',
          'Streamlined debugging, maintainability, and long-term codebase longevity.',
          'Scalable codebase layout ready for collaborative team scaling.'
        ],
        technologies: ['Clean Architecture', 'Flutter', 'Dart', 'OOP Principles', 'Error Handling']
      }
    },

    init() {
      if (!this.modal) return;

      // Modal Triggers
      const triggers = document.querySelectorAll('.project-modal-trigger');
      triggers.forEach(btn => {
        btn.addEventListener('click', () => {
          const projectId = btn.getAttribute('data-project');
          this.open(projectId);
        });
      });

      // Close handlers
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.dismissBtn) this.dismissBtn.addEventListener('click', () => this.close());
      if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
    },

    open(projectId) {
      const data = this.projectsData[projectId];
      if (!data) return;

      this.catElem.innerText = data.category;
      this.titleElem.innerText = data.title;

      let techPills = data.technologies.map(t => `<span class="tag">${t}</span>`).join(' ');
      let listItems = data.highlights.map(h => `<li>${h}</li>`).join('');

      this.bodyElem.innerHTML = `
        <p>${data.description}</p>
        <h4>Key Engineering Highlights</h4>
        <ul>${listItems}</ul>
        <h4>Core Technologies</h4>
        <div class="project-tags" style="margin-bottom:0;">${techPills}</div>
      `;

      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  /* =====================================================================
     8. CONTACT FORM VALIDATION & INTERACTION
     ===================================================================== */
  const ContactFormManager = {
    form: document.getElementById('contact-form'),
    nameInput: document.getElementById('contact-name'),
    emailInput: document.getElementById('contact-email'),
    subjectInput: document.getElementById('contact-subject'),
    messageInput: document.getElementById('contact-message'),
    submitBtn: document.getElementById('submit-btn'),

    nameError: document.getElementById('name-error'),
    emailError: document.getElementById('email-error'),
    subjectError: document.getElementById('subject-error'),
    messageError: document.getElementById('message-error'),

    init() {
      if (!this.form) return;

      // Real-time input validation on blur / input
      this.nameInput.addEventListener('input', () => this.validateName());
      this.emailInput.addEventListener('input', () => this.validateEmail());
      this.subjectInput.addEventListener('input', () => this.validateSubject());
      this.messageInput.addEventListener('input', () => this.validateMessage());

      // Form Submit
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Hook up service "Inquire" buttons to auto-populate subject
      const serviceLinks = document.querySelectorAll('.service-cta-link');
      serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const serviceName = link.getAttribute('data-service');
          if (serviceName && this.subjectInput) {
            this.subjectInput.value = `Inquiry: ${serviceName}`;
            setTimeout(() => {
              this.subjectInput.focus();
            }, 500);
          }
        });
      });
    },

    validateName() {
      const val = this.nameInput.value.trim();
      if (!val) {
        this.setError(this.nameInput, this.nameError, 'Please enter your full name.');
        return false;
      }
      if (val.length < 2) {
        this.setError(this.nameInput, this.nameError, 'Name must be at least 2 characters.');
        return false;
      }
      this.clearError(this.nameInput, this.nameError);
      return true;
    },

    validateEmail() {
      const val = this.emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        this.setError(this.emailInput, this.emailError, 'Please enter your email address.');
        return false;
      }
      if (!emailRegex.test(val)) {
        this.setError(this.emailInput, this.emailError, 'Please enter a valid email address.');
        return false;
      }
      this.clearError(this.emailInput, this.emailError);
      return true;
    },

    validateSubject() {
      const val = this.subjectInput.value.trim();
      if (!val) {
        this.setError(this.subjectInput, this.subjectError, 'Please enter a subject.');
        return false;
      }
      if (val.length < 3) {
        this.setError(this.subjectInput, this.subjectError, 'Subject must be at least 3 characters.');
        return false;
      }
      this.clearError(this.subjectInput, this.subjectError);
      return true;
    },

    validateMessage() {
      const val = this.messageInput.value.trim();
      if (!val) {
        this.setError(this.messageInput, this.messageError, 'Please enter your message.');
        return false;
      }
      if (val.length < 10) {
        this.setError(this.messageInput, this.messageError, 'Message must be at least 10 characters.');
        return false;
      }
      this.clearError(this.messageInput, this.messageError);
      return true;
    },

    setError(input, errorElem, message) {
      input.classList.add('is-invalid');
      if (errorElem) errorElem.textContent = message;
    },

    clearError(input, errorElem) {
      input.classList.remove('is-invalid');
      if (errorElem) errorElem.textContent = '';
    },

    handleSubmit(e) {
      e.preventDefault();

      const isNameValid = this.validateName();
      const isEmailValid = this.validateEmail();
      const isSubjectValid = this.validateSubject();
      const isMessageValid = this.validateMessage();

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        ToastManager.show('Please complete all required fields correctly.', 'info');
        return;
      }

      // Simulate sending via client-side UX
      this.submitBtn.classList.add('loading');
      this.submitBtn.disabled = true;

      setTimeout(() => {
        this.submitBtn.classList.remove('loading');
        this.submitBtn.disabled = false;
        this.form.reset();

        ToastManager.show(
          'Thank you, Ziad has received your message! He will respond shortly.',
          'success'
        );
      }, 1200);
    }
  };

  /* =====================================================================
     9. TOAST NOTIFICATION MANAGER
     ===================================================================== */
  const ToastManager = {
    container: document.getElementById('toast-container'),

    show(message, type = 'info', duration = 4000) {
      if (!this.container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const iconClass = type === 'success' 
        ? 'fa-solid fa-circle-check' 
        : 'fa-solid fa-circle-info';

      toast.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
      `;

      this.container.appendChild(toast);

      // Trigger animation
      setTimeout(() => toast.classList.add('show'), 20);

      // Remove after duration
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, duration);
    }
  };

  /* =====================================================================
     10. PLACEHOLDER & CLIPBOARD HELPERS
     ===================================================================== */
  const PlaceholderHelper = {
    init() {
      // Notify when clicking placeholder links
      const placeholderLinks = document.querySelectorAll('.placeholder-link');
      placeholderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const type = link.getAttribute('data-type') || 'External link';
          ToastManager.show(
            `"${type}" is an editable placeholder. You can update the live URL in index.html!`,
            'info'
          );
        });
      });

      // Click-to-copy email placeholder
      const emailLink = document.getElementById('contact-email-link');
      if (emailLink) {
        emailLink.addEventListener('click', (e) => {
          e.preventDefault();
          const email = emailLink.innerText.trim();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
              ToastManager.show('Email placeholder copied to clipboard!', 'success');
            }).catch(() => {
              window.location.href = `mailto:${email}`;
            });
          } else {
            window.location.href = `mailto:${email}`;
          }
        });
      }
    }
  };

  /* =====================================================================
     INITIALIZATION ON DOM CONTENT LOADED
     ===================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    NavigationManager.init();
    HeroCanvas.init();
    ScrollReveal.init();
    CounterManager.init();
    SkillsFilter.init();
    ProjectModal.init();
    ContactFormManager.init();
    PlaceholderHelper.init();
  });

})();
