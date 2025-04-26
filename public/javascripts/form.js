document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const steps = document.querySelectorAll(".form-step");
  const indicators = document.querySelectorAll(".step-indicator");

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

  window.nextStep = function () {
    if (currentStep < steps.length) {
      currentStep++;
      showStep(currentStep);
    }
  };

  window.previousStep = function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  };

  showStep(currentStep);
});

function toggleNewCategoryInput() {
  const categorySelect = document.getElementById("category");
  const newCategoryGroup = document.getElementById("newCategoryGroup");
  if (categorySelect.value === "new") {
    newCategoryGroup.classList.remove("hidden");
    document.getElementById("newCategory").setAttribute("required", "required");
  } else {
    newCategoryGroup.classList.add("hidden");
    document.getElementById("newCategory").removeAttribute("required");
  }
}
