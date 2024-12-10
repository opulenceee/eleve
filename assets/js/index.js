document.addEventListener("DOMContentLoaded", function () {
  // Get references to key elements
  const userTypeRadios = document.querySelectorAll('input[name="userType"]');
  const clientFields = document.getElementById("clientFields");
  const modelFields = document.getElementById("modelFields");
  const form = document.getElementById("contactForm");

  // Function to toggle field visibility
  function toggleFields() {
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

  // Function to clear form fields
  function clearForm() {
    // Clear all text, email, and number inputs
    form
      .querySelectorAll(
        'input[type="text"], input[type="email"], input[type="number"], input[type="tel"]'
      )
      .forEach((input) => {
        input.value = "";
      });

    // Clear textareas if any
    form.querySelectorAll("textarea").forEach((textarea) => {
      textarea.value = "";
    });

    // Clear file inputs if any
    form.querySelectorAll('input[type="file"]').forEach((fileInput) => {
      fileInput.value = "";
    });

    document.getElementById("facebrowser").value = "";
  }

  // Add event listeners to user type radio buttons
  userTypeRadios.forEach((radio) => {
    radio.addEventListener("change", toggleFields);
  });

  // Initial setup
  toggleFields();

  // Form submission handling
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData(form);
    const formObject = {};

    formData.forEach((value, key) => {
      // Convert form data to a regular object
      if (value instanceof File) {
        formObject[key] = value; // Handle file uploads as well
      } else {
        formObject[key] = value;
      }
    });

    try {
      // Send data to the Python backend
      const response = await fetch("https://eleve.space/submit-form", {
        method: "POST",
        body: formData, // Send FormData to handle file uploads
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        clearForm(); // Clear the form after successful submission
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  });
});
