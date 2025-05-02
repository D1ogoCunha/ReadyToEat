document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/users/profile/chart", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
  
        if (data.length === 0) {
          console.error("No data available for the chart.");
          return;
        }
  
        new Chart(document.getElementById("mostOrderedDishesChart"), {
          type: "bar",
          data: {
            labels: data.map((dish) => dish.name), 
            datasets: [
              {
                label: "Orders",
                data: data.map((dish) => dish.count), 
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
      } else {
        console.error("Failed to load chart data.");
      }
    } catch (error) {
      console.error("Error loading chart:", error);
    }
  });