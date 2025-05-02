function updateDishesByMenu(menuId) {
  const dishesContainer = document.getElementById("dishes-container");
  const allDishes = dishesByMenuData; 

  dishesContainer.innerHTML = "";

  if (menuId && allDishes[menuId]) {
    const group = allDishes[menuId];
    if (group.dishes.length > 0) {
      group.dishes.forEach((dish) => {
        const dishElement = document.createElement("div");
        dishElement.classList.add("form-check");
        dishElement.innerHTML = `
          <input
            class="form-check-input"
            type="checkbox"
            id="dish-${dish._id}"
            name="selectedDishes"
            value="${dish._id}"
          />
          <label class="form-check-label" for="dish-${dish._id}">
            ${dish.nome} - €${dish.preco ? dish.preco.toFixed(2) : "0.00"}
          </label>
        `;
        dishesContainer.appendChild(dishElement);
      });
    } else {
      dishesContainer.innerHTML = `<p class="text-muted">No dishes in this menu.</p>`;
    }
  } else {
    dishesContainer.innerHTML = `<p class="text-muted">Please select a menu to see the dishes.</p>`;
  }
}