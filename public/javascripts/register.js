let currentStep = 1; // Define o passo inicial como 1
const steps = document.querySelectorAll(".form-step");
const indicators = document.querySelectorAll(".step-indicator");

function selectUserType(type) {
  document.getElementById("user-type-selection").classList.add("hidden");

  if (type === "restaurant") {
    document.getElementById("restaurant-form").classList.remove("hidden");
    document.getElementById("customer-form").classList.add("hidden");

    showStep(currentStep);
  } else if (type === "customer") {
    document.getElementById("customer-form").classList.remove("hidden");
    document.getElementById("restaurant-form").classList.add("hidden");
  }
}

function showStep(step) {
  steps.forEach((stepElement, index) => {
    if (index + 1 === step) {
      stepElement.classList.remove("hidden");
    } else {
      stepElement.classList.add("hidden");
    }
  });

  indicators.forEach((indicator, index) => {
    if (index + 1 === step) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

function nextStep() {
  if (currentStep < steps.length) {
    currentStep++;
    showStep(currentStep);
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function updatePriceDisplay(value) {
  const priceDisplay = document.getElementById("price-display");
  priceDisplay.textContent = `Selected Price: €${value}`;
}
