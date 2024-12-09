// Define the preset password for authentication
const presetPassword = "elevetalent";

// Function to get the current date in a readable format
function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}

// Function to get the end date by adding six months to the current date
function getEndDate() {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 6);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}

// Function to extract the model's name from the URL slug
function getModelNameFromSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug"); // Assuming the model name is passed as a 'slug' query parameter
  if (slug) {
    const name = decodeURIComponent(slug).replace(/-/g, " ");
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  } else {
    return "Model's Full Name";
  }
}

// Function to show the contract content and hide the password form
function showContractContent() {
  // Hide the password form and show the contract content
  document.getElementById("password-form").style.display = "none";
  document.getElementById("contract-content").style.display = "block";

  // Update the contract details dynamically
  const modelName = getModelNameFromSlug();
  const currentDate = getCurrentDate();
  const endDate = getEndDate();

  document.getElementById(
    "contract-intro"
  ).textContent = `This Talent Agreement ("Agreement") is made and entered into on ${currentDate}, by and between Los Angels Entertainment, LLC, DBA PLUSH ("Agency") and ${modelName} ("Model"). This Agreement outlines the terms and conditions under which the Model will provide services to the Agency.`;
  document.getElementById(
    "contract-term"
  ).textContent = `The term of this Agreement will begin on ${currentDate} and will remain in effect until ${endDate} unless terminated earlier as per the terms provided in this Agreement.`;
}

// Event listener for password form submission
document
  .getElementById("passwordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const enteredPassword = document.getElementById("password").value.trim();

    if (enteredPassword === presetPassword) {
      // Show contract content if password is correct
      showContractContent();
    } else {
      // Show error message if password is incorrect
      document.getElementById("error-message").style.display = "block";
      document.getElementById("error-message").textContent =
        "Invalid password. Please try again.";
    }
  });

// Ensure that contract content is hidden until password is entered
document.getElementById("contract-content").style.display = "none";
