/**
 * Navigation Component
 * Handles navigation between sections and responsive menu
 */

class Navigation {
  constructor() {
    this.hamburger = document.querySelector(".hamburger");
    this.navMenu = document.querySelector(".nav-menu");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.sections = document.querySelectorAll(".section");

    this.currentSection = "home";
    this.isMenuOpen = false;

    this.init();
    this.bindEvents();
    this.subscribeToState();
    this.initScrollSpy();
  }

  /**
   * Initialize navigation
   */
  init() {
    // Set initial active section
    this.showSection("home");
    this.setActiveNavLink("home");
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Mobile menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    // Navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.getAttribute("href").replace("#", "");
        this.navigateToSection(section);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isMenuOpen &&
        !this.navMenu.contains(e.target) &&
        !this.hamburger.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener("popstate", (e) => {
      const section = e.state?.section || "home";
      this.navigateToSection(section, false);
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Subscribe to state changes
   */
  subscribeToState() {
    if (window.appState) {
      this.unsubscribe = window.appState.subscribe((state, prevState) => {
        if (state.currentSection !== prevState.currentSection) {
          this.handleSectionChange(state.currentSection);
        }
      });
    }
  }

  /**
   * Handle section change from state
   * @param {string} section - Section to navigate to
   */
  handleSectionChange(section) {
    if (section !== this.currentSection) {
      this.showSection(section);
      this.setActiveNavLink(section);
      this.currentSection = section;
      this.closeMobileMenu();
    }
  }

  /**
   * Navigate to a section
   * @param {string} section - Section to navigate to
   * @param {boolean} updateHistory - Whether to update browser history
   */
  navigateToSection(section, updateHistory = true) {
    if (window.appState) {
      window.appState.navigate(section);
    } else {
      this.handleSectionChange(section);
    }

    // Update browser history
    if (updateHistory) {
      const url = section === "home" ? "/" : `/#${section}`;
      history.pushState({ section }, "", url);
    }

    // Scroll to the section
    this.scrollToSection(section);
  }

/**
   * Scroll to a specific section
   * @param {string} sectionId - Section ID to scroll to
   */
  scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    } else {
      // Fallback: scroll to top if section not found
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /**
   * Show a specific section (legacy method for compatibility)
   * @param {string} sectionId - Section ID to show
   */
  showSection(sectionId) {
    // Update active states for visual indicators
    this.sections.forEach((section) => {
      if (section.id === sectionId) {
        section.classList.add("active");
        // Add animation class if needed
        section.classList.add("fade-in");
      } else {
        section.classList.remove("active", "fade-in");
      }
    });
  }

  /**
   * Set active navigation link
   * @param {string} sectionId - Section ID
   */
  setActiveNavLink(sectionId) {
    this.navLinks.forEach((link) => {
      const linkSection = link.getAttribute("href").replace("#", "");
      if (linkSection === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.hamburger?.classList.add("active");
    this.navMenu?.classList.add("active");
    this.isMenuOpen = true;

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.hamburger?.classList.remove("active");
    this.navMenu?.classList.remove("active");
    this.isMenuOpen = false;

    // Restore body scroll
    document.body.style.overflow = "";
  }

  /**
   * Get current section
   * @returns {string} Current section ID
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Check if a section exists
   * @param {string} sectionId - Section ID to check
   * @returns {boolean} Whether section exists
   */
  sectionExists(sectionId) {
    return Array.from(this.sections).some(
      (section) => section.id === sectionId
    );
  }

  /**
   * Add navigation item programmatically
   * @param {string} sectionId - Section ID
   * @param {string} label - Navigation label
   * @param {number} position - Position in menu (optional)
   */
  addNavItem(sectionId, label, position) {
    const navItem = document.createElement("li");
    navItem.className = "nav-item";

    const navLink = document.createElement("a");
    navLink.href = `#${sectionId}`;
    navLink.className = "nav-link";
    navLink.textContent = label;

    navItem.appendChild(navLink);

    if (position !== undefined && position < this.navMenu.children.length) {
      this.navMenu.insertBefore(navItem, this.navMenu.children[position]);
    } else {
      this.navMenu.appendChild(navItem);
    }

    // Rebind events
    navLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateToSection(sectionId);
    });

    // Update navLinks collection
    this.navLinks = document.querySelectorAll(".nav-link");
  }

  /**
   * Remove navigation item
   * @param {string} sectionId - Section ID to remove
   */
  removeNavItem(sectionId) {
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (navLink && navLink.parentElement) {
      navLink.parentElement.remove();
      this.navLinks = document.querySelectorAll(".nav-link");
    }
  }

  /**
   * Initialize scroll spy functionality
   */
  initScrollSpy() {
    let ticking = false;
    
    const updateActiveSection = () => {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const scrollTop = window.pageYOffset + headerHeight + 100; // Add some offset
      
      let activeSection = 'home'; // Default to home
      
      // Find which section is currently in view
      this.sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
          activeSection = section.id;
        }
      });
      
      // Update navigation if section changed
      if (activeSection !== this.currentSection) {
        this.currentSection = activeSection;
        this.setActiveNavLink(activeSection);
        
        // Update state if available
        if (window.appState) {
          window.appState.setState({ currentSection: activeSection });
        }
        
        // Update URL without triggering navigation
        const url = activeSection === 'home' ? '/' : `/#${activeSection}`;
        history.replaceState({ section: activeSection }, '', url);
      }
      
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };
    
    // Store the scroll handler for cleanup
    this.scrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Destroy navigation component
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // Remove scroll spy
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }

    // Remove event listeners
    this.hamburger?.removeEventListener("click", this.toggleMobileMenu);
    this.navLinks.forEach((link) => {
      link.removeEventListener("click", this.navigateToSection);
    });

    // Restore body scroll
    document.body.style.overflow = "";
  }
}

// Initialize navigation when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.navigation = new Navigation();

  // Handle initial navigation from URL hash
  const hash = window.location.hash.replace("#", "");
  if (hash && window.navigation.sectionExists(hash)) {
    window.navigation.navigateToSection(hash, false);
  }
});

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = Navigation;
}
