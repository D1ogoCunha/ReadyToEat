document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const menuId = event.target.dataset.id;
      try {
        const response = await fetch(`/menus/${menuId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          event.target.closest(".menu-card-container").remove();
        } else {
          alert("Failed to delete the menu. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting menu:", error);
        alert("An error occurred. Please try again.");
      }
    });
  });
});
