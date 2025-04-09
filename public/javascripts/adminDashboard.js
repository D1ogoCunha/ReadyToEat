document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");
  const modal = document.getElementById("delete-modal");
  const deleteMessage = document.getElementById("delete-message");
  const confirmDelete = document.getElementById("confirm-delete");
  const cancelDelete = document.getElementById("cancel-delete");

  let restaurantIdToDelete = null;

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log("Delete button clicked");
      const restaurantRow = event.target.closest(".table-row");
      const restaurantName = restaurantRow.querySelector(".table-cell").textContent;
      restaurantIdToDelete = restaurantRow.dataset.id;

      deleteMessage.textContent = `Are you sure you want to delete the restaurant "${restaurantName}"?`;
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
        const response = await fetch(`/restaurants/${restaurantIdToDelete}`, {
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
});