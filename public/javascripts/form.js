document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".form-step");
  const indicators = document.querySelectorAll(".step");
  let currentStep = 0;

  function showStep(step) {
    steps.forEach((s, index) => {
      s.classList.toggle("hidden", index !== step);
      indicators[index].classList.toggle("active", index === step);
    });
  }

  document.querySelectorAll(".next").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  document.querySelectorAll(".prev").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

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