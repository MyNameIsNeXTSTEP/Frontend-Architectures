/**
 * Main Application Script
 * Entry point that initializes the application and coordinates all components
 */

class App {
  constructor() {
    this.isInitialized = false;
    this.observers = new Map();
    this.utils = this.getUtilities();

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        await new Promise((resolve) => {
          document.addEventListener("DOMContentLoaded", resolve);
        });
      }

      // Initialize core features
      this.initializeIntersectionObservers();
      this.initializeAnimations();
      this.initializeLazyLoading();
      this.initializeStatsCounter();
      this.initializeScrollEffects();
      this.initializeKeyboardShortcuts();

      // Initialize application state
      this.initializeAppState();

      this.isInitialized = true;
      console.log("Application initialized successfully");

       // Show welcome notification
       setTimeout(() => {
         showSuccess("Welcome to the Monolithic Frontend Template!");
         
         // Debug: Check if forms are properly registered
         if (window.formManager) {
           console.log("Form manager initialized. Registered forms:", window.formManager.forms.size);
           window.formManager.forms.forEach((config, formId) => {
             console.log(`Form ${formId}: ${config.fields.size} fields`);
           });
         }
       }, 500);
    } catch (error) {
      console.error("Failed to initialize application:", error);
      showError("Failed to initialize application. Please refresh the page.");
    }
  }

  /**
   * Initialize intersection observers for animations
   */
  initializeIntersectionObservers() {
    // Animate elements when they come into view
    const animateObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            animateObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe elements for animation
    document
      .querySelectorAll(".feature-card, .service-item, .stat-item")
      .forEach((el) => {
        animateObserver.observe(el);
      });

    this.observers.set("animate", animateObserver);
  }

  /**
   * Initialize animations
   */
  initializeAnimations() {
    // Add CSS animation classes
    const style = document.createElement("style");
    style.textContent = `
            .fade-in {
                animation: fadeIn 0.6s ease forwards;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * Initialize lazy loading for images
   */
  initializeLazyLoading() {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove("lazy");
              img.classList.add("loaded");
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });

    this.observers.set("images", imageObserver);
  }

  /**
   * Initialize statistics counter animation
   */
  initializeStatsCounter() {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector(".stats");
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    this.observers.set("stats", statsObserver);
  }

  /**
   * Animate statistics numbers
   */
  animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number");

    statNumbers.forEach((element) => {
      const target = parseInt(element.dataset.target) || 0;
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 16);
    });

    // Update state
    if (window.appState) {
      window.appState.updateStats({
        projects: 100,
        components: 50,
        satisfaction: 99,
      });
    }
  }

  /**
   * Initialize scroll effects
   */
  initializeScrollEffects() {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Parallax effect for hero section
      const hero = document.querySelector(".hero");
      if (hero) {
        const heroTop = hero.offsetTop;
        const heroHeight = hero.offsetHeight;
        const parallaxOffset = (scrollTop - heroTop) * 0.5;

        if (
          scrollTop > heroTop - windowHeight &&
          scrollTop < heroTop + heroHeight
        ) {
          hero.style.transform = `translateY(${parallaxOffset}px)`;
        }
      }

      // Header background on scroll
      const header = document.querySelector(".header");
      if (header) {
        if (scrollTop > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Add scrolled class styles
    const style = document.createElement("style");
    style.textContent = `
            .header.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * Initialize keyboard shortcuts
   */
  initializeKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ignore if user is typing in an input
      if (e.target.matches("input, textarea")) return;

      switch (e.key) {
        case "1":
        case "h":
          if (e.altKey) {
            e.preventDefault();
            window.navigation?.navigateToSection("home");
          }
          break;
        case "2":
        case "a":
          if (e.altKey) {
            e.preventDefault();
            window.navigation?.navigateToSection("about");
          }
          break;
        case "3":
        case "s":
          if (e.altKey) {
            e.preventDefault();
            window.navigation?.navigateToSection("services");
          }
          break;
        case "4":
        case "c":
          if (e.altKey) {
            e.preventDefault();
            window.navigation?.navigateToSection("contact");
          }
          break;
      }
    });
  }

  /**
   * Initialize application state
   */
  initializeAppState() {
    if (window.appState) {
      // Set initial stats
      window.appState.updateStats({
        projects: 0,
        components: 0,
        satisfaction: 0,
      });

      // Subscribe to loading state changes
      window.appState.subscribe((state, prevState) => {
        if (state.loading !== prevState.loading) {
          this.updateLoadingState(state.loading);
        }
      });
    }
  }

  /**
   * Update global loading state
   * @param {boolean} loading - Loading state
   */
  updateLoadingState(loading) {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      if (loading) {
        loadingElement.classList.remove("hidden");
      } else {
        loadingElement.classList.add("hidden");
      }
    }
  }

  /**
   * Get utility functions
   * @returns {Object} Utility functions
   */
  getUtilities() {
    return {
      // Debounce function
      debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },

      // Throttle function
      throttle: (func, limit) => {
        let inThrottle;
        return function () {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
          }
        };
      },

      // Format date
      formatDate: (date) => {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(date));
      },

      // Generate random ID
      generateId: () => {
        return Math.random().toString(36).substr(2, 9);
      },

      // Validate email
      isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },

      // Get viewport dimensions
      getViewport: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },

      // Check if element is in viewport
      isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );
      },
    };
  }

  /**
   * Get application status
   * @returns {Object} Application status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      components: {
        navigation: !!window.navigation,
        notificationManager: !!window.notificationManager,
        formManager: !!window.formManager,
        appState: !!window.appState,
      },
      observers: Array.from(this.observers.keys()),
    };
  }

  /**
   * Destroy application
   */
  destroy() {
    // Cleanup observers
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();

    // Cleanup components
    window.navigation?.destroy();
    window.notificationManager?.destroy();
    window.formManager?.destroy();

    this.isInitialized = false;
    console.log("Application destroyed");
  }
}

// Initialize application
window.app = new App();

// Expose utilities globally
window.utils = window.app.utils;

// Development helpers
if (window.appState?.isDevelopment()) {
  window.dev = {
    app: window.app,
    state: window.appState,
    navigation: () => window.navigation,
    forms: () => window.formManager,
    notifications: () => window.notificationManager,
    status: () => window.app.getStatus(),
  };

  console.log("Development helpers available at window.dev");
}

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = App;
}
