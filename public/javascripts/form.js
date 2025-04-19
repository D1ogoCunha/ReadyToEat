document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".form-step");
  const indicators = document.querySelectorAll(".step-indicator");
  const labels = document.querySelectorAll(".step-label");
  let currentStep = 0;

  // Verifica se estamos no modo de edição (se existe um prato carregado)
  const isEditMode = document.querySelector("#dishForm").action.includes("/dishes/") && !document.querySelector("#dishForm").action.includes("edit");

  function showStep(step) {
    steps.forEach((s, index) => {
      s.classList.toggle("hidden", index !== step);
      if (indicators[index]) {
        indicators[index].classList.toggle("active", index === step);
      }
      if (labels[index]) {
        labels[index].classList.toggle("active", index === step);
      }
    });
  }

  // Exibe todos os steps no modo de edição
  if (isEditMode) {
    steps.forEach((s) => s.classList.remove("hidden"));
    indicators.forEach((indicator) => indicator.classList.add("active"));
  } else {
    showStep(currentStep);
  }

  document.querySelectorAll(".next-button.next").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  document.querySelectorAll(".back-button.prev").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  document.querySelector("#dishForm").addEventListener("submit", (e) => {
    console.log("Form submitted");
  });

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
