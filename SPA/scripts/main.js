// SPA Main JavaScript - JSON Placeholder API Integration
class SPAApp {
  constructor() {
    this.apiBaseUrl = "https://jsonplaceholder.typicode.com";
    this.currentDataType = null;
    this.currentData = null;

    // DOM elements
    this.form = document.getElementById("api-form");
    this.submitBtn = document.querySelector(".submit-btn");
    this.btnText = document.querySelector(".btn-text");
    this.loadingSpinner = document.querySelector(".loading-spinner");
    this.resultsContainer = document.getElementById("results-container");
    this.resultsTitle = document.getElementById("results-title");
    this.resultsGrid = document.getElementById("results-grid");
    this.clearBtn = document.getElementById("clear-results");
    this.loadingState = document.getElementById("loading-state"); // { isPending: boolean, isDone: boolean, isError: boolean, username: 'Islam' } // -> changed Model!
    this.errorState = document.getElementById("error-state");
    this.errorMessage = document.getElementById("error-message");
    this.retryBtn = document.getElementById("retry-btn");

    this.init();
  }

  init() {
    this.bindEvents();
    console.log("SPA App initialized");
  }

  bindEvents() {
    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });

    // Clear results
    this.clearBtn.addEventListener("click", () => {
      this.clearResults();
    });

    // Retry on error
    this.retryBtn.addEventListener("click", () => {
      this.handleFormSubmission();
    });

    // Radio button changes
    const radioButtons = this.form.querySelectorAll('input[name="dataType"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.currentDataType = e.target.value;
      });
    });

    // Set initial data type
    const checkedRadio = this.form.querySelector(
      'input[name="dataType"]:checked'
    );
    if (checkedRadio) {
      this.currentDataType = checkedRadio.value;
    }
  }

  async handleFormSubmission() {
    const selectedDataType = this.form.querySelector(
      'input[name="dataType"]:checked'
    );

    if (!selectedDataType) {
      this.showError("Please select a data type");
      return;
    }

    this.currentDataType = selectedDataType.value;
    this.showLoading();

    try {
      const data = await this.fetchData(this.currentDataType);
      this.currentData = data;
      this.displayResults(data, this.currentDataType);
    } catch (error) {
      console.error("Error fetching data:", error);
      this.showError(
        `Failed to fetch ${this.currentDataType}. Please check your internet connection and try again.`
      );
    }
  }

  async fetchData(dataType) {
    const url = `${this.apiBaseUrl}/${dataType}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Limit results to first 20 items for better performance
    return data.slice(0, 20);
  }

  showLoading() {
    this.hideAllStates();
    this.setButtonLoading(true);
    this.loadingState.style.display = "block";
  }

  hideLoading() {
    this.loadingState.style.display = "none";
    this.setButtonLoading(false);
  }

  setButtonLoading(isLoading) {
    if (isLoading) {
      this.submitBtn.classList.add("loading");
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove("loading");
      this.submitBtn.disabled = false;
    }
  }

  showError(message) {
    this.hideAllStates();
    this.errorMessage.textContent = message;
    this.errorState.style.display = "block";
  }

  hideAllStates() {
    this.hideLoading();
    this.resultsContainer.style.display = "none";
    this.errorState.style.display = "none";
  }

  displayResults(data, dataType) {
    this.hideAllStates();
    if (!data || data.length === 0) {
      this.showError(`No ${dataType} found`);
      return;
    }
    // Update results title
    const capitalizedType =
      dataType.charAt(0).toUpperCase() + dataType.slice(1);
    this.resultsTitle.textContent = `${capitalizedType} (${data.length} items)`;
    // Clear previous results
    this.resultsGrid.innerHTML = "";
    // Generate result items based on data type
    data.forEach((item, index) => {
      const resultItem = this.createResultItem(item, dataType, index);
      this.resultsGrid.appendChild(resultItem);
    });
    // Show results container
    this.resultsContainer.style.display = "block";
    // Smooth scroll to results
    setTimeout(() => {
      this.resultsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  createResultItem(item, dataType, index) {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.style.animationDelay = `${index * 0.1}s`;

    let content = "";

    switch (dataType) {
      case "posts":
        content = `
          <h3>${this.truncateText(item.title, 60)}</h3>
          <p>${this.truncateText(item.body, 120)}</p>
          <div class="result-meta">
              <span>Post ID: ${item.id}</span>
              <span>User ID: ${item.userId}</span>
          </div>
        `;
        break;

      case "comments":
        content = `
          <h3>${this.truncateText(item.name, 60)}</h3>
          <p><strong>Email:</strong> ${item.email}</p>
          <p>${this.truncateText(item.body, 100)}</p>
          <div class="result-meta">
              <span>Comment ID: ${item.id}</span>
              <span>Post ID: ${item.postId}</span>
          </div>
        `;
        break;

      case "albums":
        content = `
          <h3>${this.truncateText(item.title, 60)}</h3>
          <p>A photo album collection</p>
          <div class="result-meta">
              <span>Album ID: ${item.id}</span>
              <span>User ID: ${item.userId}</span>
          </div>
        `;
        break;

      case "photos":
        content = `
          <img src="${item.thumbnailUrl}" alt="${
          item.title
        }" loading="lazy">
            <h3>${this.truncateText(item.title, 50)}</h3>
            <div class="result-meta">
                <span>Photo ID: ${item.id}</span>
                <span>Album ID: ${item.albumId}</span>
            </div>
        `;
        break;

      default:
        content = `
          <h3>Item ${item.id}</h3>
          <pre>${JSON.stringify(item, null, 2)}</pre>
        `;
    }

    resultItem.innerHTML = content;
    return resultItem;
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + "...";
  }

  clearResults() {
    this.hideAllStates();
    this.currentData = null;

    // Reset form to default state
    const firstRadio = this.form.querySelector('input[name="dataType"]');
    if (firstRadio) {
      firstRadio.checked = true;
      this.currentDataType = firstRadio.value;
    }

    // Add fade out effect
    this.resultsContainer.style.opacity = "0";
    setTimeout(() => {
      this.resultsContainer.style.display = "none";
      this.resultsContainer.style.opacity = "1";
    }, 300);
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SPAApp();
});

// Service worker registration (optional - for offline functionality)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Global error handling
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

// Export for potential testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = SPAApp;
}
