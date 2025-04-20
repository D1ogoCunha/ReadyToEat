document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1; // Define o passo inicial como 1
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

  // Mostrar o primeiro passo ao carregar a página
  showStep(currentStep);

  // Image upload functionality
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("image");
  const previewImage = document.getElementById("previewImage");
  const previewText = document.getElementById("previewText");
  const browseButton = document.querySelector(".browse");

  // Handle drag-and-drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragging");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragging");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragging");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  // Handle file selection via browse
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });

  // Simulate click on file input when "browse" is clicked
  browseButton.addEventListener("click", () => {
    fileInput.click();
  });

  // Handle file and show preview
  function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.classList.remove("hidden");
        previewText.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (PNG or JPG).");
    }
  }
});
