// Simple MPA JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Handle contact form submission
  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");
      // Simple validation
      if (name && email && message) {
        alert(
          `Thank you, ${name}! Your message has been received. We'll get back to you at ${email}.`
        );
        this.reset();
      } else {
        alert("Please fill in all fields.");
      }
    });
  }

  // Add smooth scroll behavior for better UX
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Simple page transition effect
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease-in-out";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);

  console.log("Simple MPA loaded successfully!");
});
