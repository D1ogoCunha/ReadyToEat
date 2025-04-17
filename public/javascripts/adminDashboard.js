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

document.addEventListener("DOMContentLoaded", () => {
  const analyticsLink = document.getElementById("analytics-link");
  const dynamicContent = document.getElementById("dynamic-content");

  analyticsLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/admin/analytics");
      if (response.ok) {
        const data = await response.json();

        dynamicContent.innerHTML = `
          <h2>Analytics</h2>
          <canvas id="ordersChart" width="400" height="200"></canvas>
          <canvas id="revenueChart" width="400" height="200"></canvas>
        `;

        const ordersCtx = document.getElementById("ordersChart").getContext("2d");
        new Chart(ordersCtx, {
          type: "bar",
          data: {
            labels: data.topRestaurants.map((r) => r.name),
            datasets: [
              {
                label: "Orders",
                data: data.topRestaurants.map((r) => r.orders),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        const revenueCtx = document.getElementById("revenueChart").getContext("2d");
        new Chart(revenueCtx, {
          type: "bar",
          data: {
            labels: data.revenueByRestaurant.map((r) => r.name),
            datasets: [
              {
                label: "Revenue (€)",
                data: data.revenueByRestaurant.map((r) => r.revenue),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        dynamicContent.innerHTML = "<p>Failed to load analytics. Please try again.</p>";
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      dynamicContent.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const analytics2Link = document.getElementById("analytics2-link");
  const dynamicContent = document.getElementById("dynamic-content");

  analytics2Link.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/admin/analytics2");
      if (response.ok) {
        const data = await response.json();

        dynamicContent.innerHTML = `
          <h2>Analytics 2: Orders Over Time</h2>
          <canvas id="ordersOverTimeChart" width="400" height="200"></canvas>
        `;

        const ctx = document.getElementById("ordersOverTimeChart").getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: data.labels, 
            datasets: [
              {
                label: "Orders",
                data: data.orders, 
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                fill: true,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        dynamicContent.innerHTML = "<p>Failed to load analytics 2. Please try again.</p>";
      }
    } catch (error) {
      console.error("Error loading Analytics 2:", error);
      dynamicContent.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
  });
});