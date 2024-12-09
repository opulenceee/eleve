document.addEventListener("DOMContentLoaded", function () {
  // Get references to key elements
  const userTypeRadios = document.querySelectorAll('input[name="userType"]');
  const clientFields = document.getElementById("clientFields");
  const modelFields = document.getElementById("modelFields");
  const form = document.getElementById("contactForm");

  // Function to toggle field visibility
  function toggleUserFields() {
    const isClient =
      document.querySelector('input[name="userType"]:checked').value ===
      "Client";

    // Toggle visibility of specific field groups
    if (isClient) {
      clientFields.style.display = "block";
      modelFields.style.display = "none";

      // Make client-specific fields required
      document.getElementById("name").setAttribute("required", "required");
      document.getElementById("phone").setAttribute("required", "required");

      // Remove required attributes from model-specific fields
      document.getElementById("age").removeAttribute("required");
      document.getElementById("facebrowser").removeAttribute("required");
      document.getElementById("attachment").removeAttribute("required");
      document.getElementById("measurements").removeAttribute("required");
    } else {
      clientFields.style.display = "none";
      modelFields.style.display = "block";

      // Make model-specific fields required
      document.getElementById("name").setAttribute("required", "required");
      document.getElementById("phone").setAttribute("required", "required");
      document.getElementById("age").setAttribute("required", "required");
      document
        .getElementById("facebrowser")
        .setAttribute("required", "required");
      document
        .getElementById("attachment")
        .setAttribute("required", "required");
      document
        .getElementById("measurements")
        .setAttribute("required", "required");
    }
  }

  // Add event listeners to user type radio buttons
  userTypeRadios.forEach((radio) => {
    radio.addEventListener("change", toggleUserFields);
  });

  // Initial setup
  toggleUserFields();

  // Form submission handling
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Gather form data
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      // Send data to the Python backend
      const response = await fetch("http://127.0.0.1:5000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  });
});
