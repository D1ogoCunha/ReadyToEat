document.addEventListener("DOMContentLoaded", () => {
  const restaurantManagementLink = document.getElementById("restaurant-management-link");
  const dynamicContent = document.getElementById("dynamic-content");

  function initializeButtons() {
    const deleteButtons = document.querySelectorAll(".btn-delete");
    const modal = document.getElementById("delete-modal");
    const deleteMessage = document.getElementById("delete-message");
    const confirmDelete = document.getElementById("confirm-delete");
    const cancelDelete = document.getElementById("cancel-delete");

    let restaurantIdToDelete = null;

    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const restaurantRow = event.target.closest(".table-row");
        const restaurantName = restaurantRow.querySelector(".table-cell").textContent;
        restaurantIdToDelete = restaurantRow.dataset.id;

        deleteMessage.textContent = `Are you sure you want to delete the "${restaurantName}" restaurant?`;
        modal.classList.remove("hidden");
      });
    });

    cancelDelete.addEventListener("click", () => {
      modal.classList.add("hidden");
      restaurantIdToDelete = null;
    });

    confirmDelete.addEventListener("click", async () => {
      if (restaurantIdToDelete) {
        try {
          const response = await fetch(`/admin/restaurants/${restaurantIdToDelete}`, {
            method: "DELETE",
          });

          if (response.ok) {
            document.querySelector(`[data-id="${restaurantIdToDelete}"]`).remove();
            modal.classList.add("hidden");
          } else {
            alert("Failed to delete the restaurant. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting restaurant:", error);
          alert("An error occurred. Please try again.");
        }
      }
    });
  }

  restaurantManagementLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/admin/restaurantManagement");
      if (response.ok) {
        const html = await response.text();
        dynamicContent.innerHTML = html;
        initializeButtons();
      } else {
        dynamicContent.innerHTML = "<p>Failed to load content. Please try again.</p>";
      }
    } catch (error) {
      console.error("Error loading Restaurant Management view:", error);
      dynamicContent.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
  });

  initializeButtons();
});