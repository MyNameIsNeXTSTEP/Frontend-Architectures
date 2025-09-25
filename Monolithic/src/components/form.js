/**
 * Form Component
 * Handles form validation, submission, and data management
 */

class FormManager {
  constructor() {
    this.forms = new Map();
    this.validators = new Map();
    this.defaultValidators = this.getDefaultValidators();

    this.init();
  }

   /**
    * Initialize form manager
    */
   init() {
     // Auto-discover forms
     document.querySelectorAll("form").forEach((form) => {
       if (form.id) {
         console.log(`Registering form: ${form.id}`);
         this.registerForm(form);
       } else {
         console.warn("Form found without ID, skipping registration:", form);
       }
     });
   }

  /**
   * Register a form for management
   * @param {HTMLFormElement} form - Form element
   * @param {Object} options - Form options
   */
  registerForm(form, options = {}) {
    if (!form || !form.id) {
      console.warn("Form must have an ID to be registered");
      return;
    }

    const formConfig = {
      element: form,
      fields: new Map(),
      validators: new Map(),
      onSubmit: options.onSubmit || this.defaultSubmitHandler.bind(this),
      onValidate: options.onValidate || null,
      validateOnChange: options.validateOnChange !== false,
      validateOnBlur: options.validateOnBlur !== false,
      ...options,
    };

    this.forms.set(form.id, formConfig);
    this.bindFormEvents(form.id);
    this.discoverFields(form.id);
  }

  /**
   * Bind events to a form
   * @param {string} formId - Form ID
   */
  bindFormEvents(formId) {
    const config = this.forms.get(formId);
    if (!config) return;

    const form = config.element;

    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(formId);
    });

    // Handle field changes
    form.addEventListener("input", (e) => {
      if (
        config.validateOnChange &&
        e.target.matches("input, textarea, select")
      ) {
        this.validateField(formId, e.target.name);
      }
    });

    // Handle field blur
    form.addEventListener(
      "blur",
      (e) => {
        if (
          config.validateOnBlur &&
          e.target.matches("input, textarea, select")
        ) {
          this.validateField(formId, e.target.name);
        }
      },
      true
    );
  }

  /**
   * Discover form fields and set up validation
   * @param {string} formId - Form ID
   */
  discoverFields(formId) {
    const config = this.forms.get(formId);
    if (!config) return;

    const form = config.element;
    const fields = form.querySelectorAll("input, textarea, select");

    fields.forEach((field) => {
      if (field.name) {
        this.addField(formId, field.name, {
          element: field,
          validators: this.getFieldValidators(field),
        });
      }
    });
  }

  /**
   * Get validators for a field based on attributes
   * @param {HTMLElement} field - Field element
   * @returns {Array} Array of validator functions
   */
  getFieldValidators(field) {
    const validators = [];

    if (field.required) {
      validators.push(this.defaultValidators.required);
    }

    if (field.type === "email") {
      validators.push(this.defaultValidators.email);
    }

    // if (field.minLength) {
    //   validators.push(this.defaultValidators.minLength(field.minLength));
    // }

    // if (field.maxLength) {
    //   validators.push(this.defaultValidators.maxLength(field.maxLength));
    // }

    if (field.pattern) {
      validators.push(this.defaultValidators.pattern(field.pattern));
    }

    return validators;
  }

  /**
   * Add a field to a form
   * @param {string} formId - Form ID
   * @param {string} fieldName - Field name
   * @param {Object} fieldConfig - Field configuration
   */
  addField(formId, fieldName, fieldConfig) {
    const config = this.forms.get(formId);
    if (!config) return;

    config.fields.set(fieldName, {
      element: fieldConfig.element,
      validators: fieldConfig.validators || [],
      isValid: true,
      errors: [],
      ...fieldConfig,
    });
  }

  /**
   * Add validator to a field
   * @param {string} formId - Form ID
   * @param {string} fieldName - Field name
   * @param {Function} validator - Validator function
   */
  addValidator(formId, fieldName, validator) {
    const config = this.forms.get(formId);
    if (!config || !config.fields.has(fieldName)) return;

    const field = config.fields.get(fieldName);
    field.validators.push(validator);
  }

  /**
   * Validate a specific field
   * @param {string} formId - Form ID
   * @param {string} fieldName - Field name
   * @returns {boolean} Whether field is valid
   */
  validateField(formId, fieldName) {
    const config = this.forms.get(formId);
    if (!config || !config.fields.has(fieldName)) return true;

    const field = config.fields.get(fieldName);
    const value = field.element.value;
    const errors = [];

    // Run validators
    field.validators.forEach((validator) => {
      const result = validator(value, field.element);
      if (result !== true) {
        errors.push(result);
      }
    });

    // Update field state
    field.isValid = errors.length === 0;
    field.errors = errors;

    // Update UI
    this.updateFieldUI(field.element, field.isValid, errors);

    return field.isValid;
  }

   /**
    * Validate entire form
    * @param {string} formId - Form ID
    * @returns {boolean} Whether form is valid
    */
   validateForm(formId) {
     const config = this.forms.get(formId);
     if (!config) {
       console.error(`Form config not found for: ${formId}`);
       return false;
     }

     let isValid = true;
     const errors = [];

     config.fields.forEach((field, fieldName) => {
       const fieldValid = this.validateField(formId, fieldName);
       if (!fieldValid) {
         isValid = false;
         errors.push(`${fieldName}: ${field.errors.join(', ')}`);
       }
     });

     if (!isValid) {
       console.log(`Form validation failed for ${formId}:`, errors);
     } else {
       console.log(`Form validation passed for ${formId}`);
     }

     return isValid;
   }

   /**
    * Handle form submission
    * @param {string} formId - Form ID
    */
   async handleSubmit(formId) {
     const config = this.forms.get(formId);
     if (!config) return;

     // Show loading state
     this.setFormLoading(formId, true);

     try {
       // Validate form
       if (!this.validateForm(formId)) {
         showError("Please fix the errors in the form");
         return;
       }

       // Get form data
       const formData = this.getFormData(formId);

       // Call custom submit handler
       await config.onSubmit(formData, formId);

       // Success notification (only if no error was thrown)
       showSuccess("Form submitted successfully!");

       // Reset form if configured
       if (config.resetOnSubmit !== false) {
         this.resetForm(formId);
       }
     } catch (error) {
       console.error("Form submission error:", error);
       showError(error.message || "An error occurred while submitting the form");
     } finally {
       // Always reset loading state
       this.setFormLoading(formId, false);
     }
   }

   /**
    * Default submit handler
    * @param {Object} formData - Form data
    * @param {string} formId - Form ID
    */
   async defaultSubmitHandler(formData, formId) {
     try {
       // Simulate API call
       await new Promise((resolve) => setTimeout(resolve, 1000));

       console.log("Form submitted:", { formId, data: formData });

       // Store in state if available
       if (window.appState) {
         window.appState.updateFormData(formId, formData);
       }

       // Success - no error thrown
       return { success: true, message: "Form submitted successfully" };
     } catch (error) {
       console.error("Default submit handler error:", error);
       throw new Error("Failed to submit form. Please try again.");
     }
   }

  /**
   * Get form data
   * @param {string} formId - Form ID
   * @returns {Object} Form data
   */
  getFormData(formId) {
    const config = this.forms.get(formId);
    if (!config) return {};

    const formData = {};

    config.fields.forEach((field, fieldName) => {
      formData[fieldName] = field.element.value;
    });

    return formData;
  }

  /**
   * Set form data
   * @param {string} formId - Form ID
   * @param {Object} data - Data to set
   */
  setFormData(formId, data) {
    const config = this.forms.get(formId);
    if (!config) return;

    Object.entries(data).forEach(([fieldName, value]) => {
      const field = config.fields.get(fieldName);
      if (field) {
        field.element.value = value;
      }
    });
  }

  /**
   * Reset form
   * @param {string} formId - Form ID
   */
  resetForm(formId) {
    const config = this.forms.get(formId);
    if (!config) return;

    config.element.reset();

    // Clear validation states
    config.fields.forEach((field) => {
      field.isValid = true;
      field.errors = [];
      this.updateFieldUI(field.element, true, []);
    });

    // Clear from state
    if (window.appState) {
      window.appState.clearFormData(formId);
    }
  }

  /**
   * Set form loading state
   * @param {string} formId - Form ID
   * @param {boolean} loading - Loading state
   */
  setFormLoading(formId, loading) {
    const config = this.forms.get(formId);
    if (!config) return;

    const submitBtn = config.element.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading
        ? "Submitting..."
        : submitBtn.dataset.originalText || "Submit";

      if (!submitBtn.dataset.originalText) {
        submitBtn.dataset.originalText = submitBtn.textContent;
      }
    }

    // Update global loading state
    if (window.appState) {
      window.appState.setLoading(loading);
    }
  }

   /**
    * Update field UI based on validation
    * @param {HTMLElement} element - Field element
    * @param {boolean} isValid - Whether field is valid
    * @param {Array} errors - Validation errors
    */
   updateFieldUI(element, isValid, errors) {
     // Remove existing error classes
     element.classList.remove("error", "valid");

     // Add appropriate class
     element.classList.add(isValid ? "valid" : "error");

     // Handle error message display
     let errorElement = element.parentElement.querySelector(".error-message");

     if (errors.length > 0) {
       if (!errorElement) {
         errorElement = document.createElement("div");
         errorElement.className = "error-message";
         errorElement.style.color = "#dc3545";
         errorElement.style.fontSize = "0.875rem";
         errorElement.style.marginTop = "0.25rem";
         element.parentElement.appendChild(errorElement);
       }
       errorElement.textContent = errors[0]; // Show first error
       console.log(`Validation error for ${element.name}: ${errors[0]}`);
     } else if (errorElement) {
       errorElement.remove();
     }
   }

  /**
   * Get default validators
   * @returns {Object} Default validator functions
   */
  getDefaultValidators() {
    return {
       required: (value) => {
         return (value && value.trim() !== "") || "This field is required";
       },

      email: (value) => {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || "Please enter a valid email address";
      },

      minLength: (min) => (value) => {
        return value.length >= min || `Minimum length is ${min} characters`;
      },

      maxLength: (max) => (value) => {
        return value.length <= max || `Maximum length is ${max} characters`;
      },

      pattern: (pattern) => (value) => {
        if (!value) return true;
        const regex = new RegExp(pattern);
        return regex.test(value) || "Please enter a valid value";
      },

      url: (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return "Please enter a valid URL";
        }
      },

      phone: (value) => {
        if (!value) return true;
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(value) || "Please enter a valid phone number";
      },
    };
  }

  /**
   * Destroy form manager
   */
  destroy() {
    this.forms.clear();
    this.validators.clear();
  }
}

// Initialize form manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.formManager = new FormManager();
});

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = FormManager;
}
