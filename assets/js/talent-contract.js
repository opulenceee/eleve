// Define the preset password for authentication
const presetPassword = "elevetalent";

// Function to get the current date in a readable format
function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}

// Function to extract the model's name from the username
function getModelNameFromUsername(username) {
  const parts = username.split("_");
  if (parts.length === 2) {
    const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return firstName + " " + lastName;
  }
  return "Model's Full Name"; // Default if the format is incorrect
}

// Function to clear form fields
function clearContractForm() {
  document.getElementById("name").value = "";
  document.getElementById("usernameForm").value = "";
  document.getElementById("passwordForm").value = "";
  document.getElementById("privacy-policy").checked = false;
}

// Function to show the contract content and hide the password form
function showContractContent() {
  // Hide the password form and show the contract content
  document.getElementById("content-talent").style.display = "none";
  document.getElementById("contractContent").style.display = "block";

  // Update the contract details dynamically
  const modelName = getModelNameFromUsername(
    document.getElementById("usernameForm").value
  );
  const currentDate = getCurrentDate();

  document.getElementById("currentDate").textContent = currentDate;
  document.getElementById("modelName").textContent = modelName;
}

// Function to validate the contract form before submission
function validateContractForm() {
  const signature = document.getElementById("name").value.trim();
  const username = document.getElementById("usernameForm").value.trim();
  const checkbox = document.getElementById("privacy-policy").checked;

  // Extract the model name from the username
  const expectedName = getModelNameFromUsername(username);

  if (signature !== expectedName) {
    alert("Your signature does not match the name you entered.");
    return false;
  }

  if (!checkbox) {
    alert("You must agree to the privacy policy.");
    return false;
  }

  // If everything is valid, proceed to submit the form
  return true;
}

// Function to handle the login (username and password)
function handleLogin() {
  const enteredUsername = document.getElementById("usernameForm").value.trim();
  const enteredPassword = document.getElementById("passwordForm").value.trim();

  // Check if the username follows the "firstName_lastName" format
  const usernameParts = enteredUsername.split("_");
  if (
    usernameParts.length !== 2 ||
    usernameParts[0].charAt(0) !== usernameParts[0].charAt(0).toUpperCase() ||
    usernameParts[1].charAt(0) !== usernameParts[1].charAt(0).toUpperCase()
  ) {
    alert(
      "Username must be in the format FirstName_LastName, with both names capitalized."
    );
    return;
  }

  // Check if the password matches the preset password
  if (enteredPassword === presetPassword) {
    console.log("Login successful.");
    showContractContent();
  } else {
    console.log("Incorrect password.");
    alert("Incorrect password, please try again.");
  }
}

// Event listener for login form submission
document.getElementById("accessForm").addEventListener("submit", function (e) {
  e.preventDefault();
  handleLogin();
});

// Event listener for contract form submission
document
  .getElementById("talentContract")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate the contract form before proceeding
    if (validateContractForm()) {
      const signature = document.getElementById("name").value.trim();
      const username = document.getElementById("usernameForm").value.trim();
      const currentDate = getCurrentDate();

      // Structured submission matching backend expectations
      fetch("https://eleve.space/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionType: "Contract",
          name: getModelNameFromUsername(username),
          signature: signature,
          dateSigned: currentDate,
          username: username,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          clearContractForm(); // Clear the form
          window.location.href = "/"; // Redirect to home page
        })
        .catch((error) => {
          console.error("Submission error:", error);
          alert("Contract submission failed.");
        });
    }
  });
