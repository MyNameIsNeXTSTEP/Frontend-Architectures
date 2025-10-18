/**
 * Notification Component
 * Handles displaying notifications to users
 */

class NotificationManager {
  constructor() {
    this.container = document.getElementById("notification");
    this.activeNotifications = new Set();
    this.defaultDuration = 3000;

    // Subscribe to state changes
    if (window.appState) {
      this.unsubscribe = window.appState.subscribe((state, prevState) => {
        this.handleNotifications(state.notifications, prevState.notifications);
      });
    }
  }

  /**
   * Handle notifications from state
   * @param {Array} notifications - Current notifications
   * @param {Array} prevNotifications - Previous notifications
   */
  handleNotifications(notifications, prevNotifications) {
    const prevIds = new Set((prevNotifications || []).map((n) => n.id));
    const currentIds = new Set(notifications.map((n) => n.id));

    // Show new notifications
    notifications.forEach((notification) => {
      if (
        !prevIds.has(notification.id) &&
        !this.activeNotifications.has(notification.id)
      ) {
        this.show(
          notification.message,
          notification.type,
          notification.duration
        );
        this.activeNotifications.add(notification.id);
      }
    });

    // Remove old notifications
    prevIds.forEach((id) => {
      if (!currentIds.has(id)) {
        this.activeNotifications.delete(id);
      }
    });
  }

  /**
   * Show a notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  show(message, type = "info", duration = this.defaultDuration) {
    if (!this.container) {
      console.warn("Notification container not found");
      return;
    }

    // Clear existing notification
    this.clear();

    // Set message and type
    this.container.textContent = message;
    this.container.className = `notification ${type}`;

    // Show notification
    setTimeout(() => {
      this.container.classList.add("show");
    }, 10);

    // Auto hide
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  /**
   * Hide the current notification
   */
  hide() {
    if (this.container) {
      this.container.classList.remove("show");
    }
  }

  /**
   * Clear the notification
   */
  clear() {
    if (this.container) {
      this.container.classList.remove(
        "show",
        "success",
        "error",
        "warning",
        "info"
      );
      this.container.textContent = "";
    }
  }

  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {number} duration - Duration in milliseconds
   */
  success(message, duration) {
    this.show(message, "success", duration);
  }

  /**
   * Show error notification
   * @param {string} message - Error message
   * @param {number} duration - Duration in milliseconds
   */
  error(message, duration = 5000) {
    this.show(message, "error", duration);
  }

  /**
   * Show warning notification
   * @param {string} message - Warning message
   * @param {number} duration - Duration in milliseconds
   */
  warning(message, duration) {
    this.show(message, "warning", duration);
  }

  /**
   * Show info notification
   * @param {string} message - Info message
   * @param {number} duration - Duration in milliseconds
   */
  info(message, duration) {
    this.show(message, "info", duration);
  }

  /**
   * Destroy the notification manager
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.clear();
    this.activeNotifications.clear();
  }
}

// Global notification functions for easy access
function showNotification(message, type = "info", duration = 3000) {
  if (window.appState) {
    window.appState.addNotification(message, type, duration);
  } else if (window.notificationManager) {
    window.notificationManager.show(message, type, duration);
  } else {
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}

function showSuccess(message, duration) {
  showNotification(message, "success", duration);
}

function showError(message, duration) {
  showNotification(message, "error", duration || 5000);
}

function showWarning(message, duration) {
  showNotification(message, "warning", duration);
}

function showInfo(message, duration) {
  showNotification(message, "info", duration);
}

function navigateTo(url = "/") {
  // Handle internal navigation (sections) vs external URLs
  if (url.startsWith("#") || url.startsWith("/#")) {
    // Internal section navigation
    const section = url.replace(/^\/?(#)?/, "") || "home";
    if (window.navigation) {
      window.navigation.navigateToSection(section);
    } else {
      // Fallback: scroll to section directly
      const targetSection = document.getElementById(section);
      if (targetSection) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    }
  } else if (url === "/" || url === "") {
    // Navigate to home section
    if (window.navigation) {
      window.navigation.navigateToSection("home");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else if (url.startsWith("/")) {
    // Handle other internal routes - for now, treat as sections
    const section = url.replace("/", "") || "home";
    const sectionMap = {
      "contact": "contact",
      "about": "about", 
      "services": "services",
      "home": "home"
    };
    
    const targetSection = sectionMap[section] || "home";
    if (window.navigation) {
      window.navigation.navigateToSection(targetSection);
    }
  } else {
    // External URL - open in new tab or same window
    window.location.href = url;
  }
}

// Initialize notification manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.notificationManager = new NotificationManager();
});

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NotificationManager,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    navigateTo,
  };
}
