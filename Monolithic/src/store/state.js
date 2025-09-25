/**
 * Simple State Management for Monolithic Frontend
 * A lightweight state management solution for small to medium applications
 */

class AppState {
  constructor() {
    this.state = {
      currentSection: "home",
      user: null,
      notifications: [],
      loading: false,
      formData: {},
      stats: {
        projects: 0,
        components: 0,
        satisfaction: 0,
      },
    };

    this.subscribers = [];
    this.middlewares = [];
  }

  /**
   * Subscribe to state changes
   * @param {Function} callback - Function to call when state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  /**
   * Add middleware for state updates
   * @param {Function} middleware - Middleware function
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state and notify subscribers
   * @param {Object} updates - Partial state updates
   */
  setState(updates) {
    const prevState = { ...this.state };

    // Apply middlewares
    let processedUpdates = updates;
    this.middlewares.forEach((middleware) => {
      processedUpdates =
        middleware(prevState, processedUpdates) || processedUpdates;
    });

    // Update state
    this.state = { ...this.state, ...processedUpdates };

    // Notify subscribers
    this.subscribers.forEach((callback) => {
      callback(this.state, prevState);
    });

    // Log state changes in development
    if (this.isDevelopment()) {
      console.log("State updated:", {
        previous: prevState,
        current: this.state,
        updates: processedUpdates,
      });
    }
  }

  /**
   * Navigate to a section
   * @param {string} section - Section to navigate to
   */
  navigate(section) {
    this.setState({ currentSection: section });
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.setState({ loading });
  }

  /**
   * Add notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  addNotification(message, type = "info", duration = 3000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      duration,
      timestamp: new Date(),
    };

    const notifications = [...this.state.notifications, notification];
    this.setState({ notifications });

    // Auto remove notification
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);
  }

  /**
   * Remove notification
   * @param {number} id - Notification ID
   */
  removeNotification(id) {
    const notifications = this.state.notifications.filter((n) => n.id !== id);
    this.setState({ notifications });
  }

  /**
   * Update form data
   * @param {string} formId - Form identifier
   * @param {Object} data - Form data
   */
  updateFormData(formId, data) {
    const formData = {
      ...this.state.formData,
      [formId]: { ...this.state.formData[formId], ...data },
    };
    this.setState({ formData });
  }

  /**
   * Clear form data
   * @param {string} formId - Form identifier
   */
  clearFormData(formId) {
    const formData = { ...this.state.formData };
    delete formData[formId];
    this.setState({ formData });
  }

  /**
   * Update stats with animation
   * @param {Object} stats - Stats to update
   */
  updateStats(stats) {
    this.setState({ stats: { ...this.state.stats, ...stats } });
  }

  /**
   * Check if in development mode
   * @returns {boolean}
   */
  isDevelopment() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === ""
    );
  }

  /**
   * Persist state to localStorage
   * @param {Array} keys - Keys to persist
   */
  persist(keys = ["user", "formData"]) {
    const stateToPersist = {};
    keys.forEach((key) => {
      if (this.state[key] !== undefined) {
        stateToPersist[key] = this.state[key];
      }
    });

    try {
      localStorage.setItem("appState", JSON.stringify(stateToPersist));
    } catch (error) {
      console.warn("Failed to persist state:", error);
    }
  }

  /**
   * Restore state from localStorage
   * @param {Array} keys - Keys to restore
   */
  restore(keys = ["user", "formData"]) {
    try {
      const persistedState = localStorage.getItem("appState");
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        const stateToRestore = {};

        keys.forEach((key) => {
          if (parsedState[key] !== undefined) {
            stateToRestore[key] = parsedState[key];
          }
        });

        this.setState(stateToRestore);
      }
    } catch (error) {
      console.warn("Failed to restore state:", error);
    }
  }

  /**
   * Reset state to initial values
   */
  reset() {
    this.state = {
      currentSection: "home",
      user: null,
      notifications: [],
      loading: false,
      formData: {},
      stats: {
        projects: 0,
        components: 0,
        satisfaction: 0,
      },
    };

    this.subscribers.forEach((callback) => {
      callback(this.state, {});
    });
  }
}

// Middleware examples
const loggingMiddleware = (prevState, updates) => {
  console.log("State change:", updates);
  return updates;
};

const validationMiddleware = (prevState, updates) => {
  // Add validation logic here
  if (updates.currentSection && typeof updates.currentSection !== "string") {
    console.warn("currentSection must be a string");
    delete updates.currentSection;
  }
  return updates;
};

// Create global state instance
window.appState = new AppState();

// Add middlewares in development
if (window.appState.isDevelopment()) {
  window.appState.use(loggingMiddleware);
  window.appState.use(validationMiddleware);
}

// Restore persisted state on load
window.appState.restore();

// Persist state before page unload
window.addEventListener("beforeunload", () => {
  window.appState.persist();
});

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = AppState;
}
