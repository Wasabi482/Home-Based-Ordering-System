(() => {
    const pendingOrdersContainer = document.getElementById("pending-orders-grid");
    const completedOrdersTable = document.getElementById("completed-orders-table");
    const exportButton = document.getElementById("export-excel");
    const orderModal = document.getElementById("order-modal");
    const orderDetails = document.getElementById("order-details");
    const closeModal = document.querySelector(".close-modal");

    let pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];
    let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    function saveOrders() {
        localStorage.setItem("pendingOrders", JSON.stringify(pendingOrders));
        localStorage.setItem("completedOrders", JSON.stringify(completedOrders));
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function renderPendingOrders() {
        pendingOrdersContainer.innerHTML = pendingOrders.map((order, index) => `
          <div class="order-card">
              <div class="content">
                  <h3>${order.orderId}</h3>
                  <p><strong>Customer:</strong> ${order.customer}</p>
                  <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                  <p><strong>Items:</strong> ${order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}</p>
                  <div class="buttons">
                      <button class="done-btn" data-index="${index}">Done</button>
                      <button class="edit-btn" data-index="${index}">Edit</button>
                      <button class="void-btn" data-index="${index}">Void</button>
                  </div>
              </div>
          </div>`).join("");
    }

    function renderCompletedOrders() {
        completedOrdersTable.innerHTML = completedOrders.map((order, index) => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customer}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${order.date}</td>
                <td>
                  <div class="actions">
                    <button class="view-btn" data-index="${index}">View</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                  </div>
                </td>
            </tr>`).join("");
    }

    function deductInventory(order) {
        // First, check if all ingredients are available
        for (let item of order.items) {
            const recipe = recipes.drinks.find(r => r.name === item.name) || recipes.foods.find(r => r.name === item.name);
            if (recipe) {
                for (let [ingredient, quantity] of Object.entries(recipe.ingredients)) {
                    const invItem = inventory.find(i => i.name === ingredient);
                    if (!invItem || invItem.stock < quantity * item.quantity) {
                        alert(`Not enough stock for ${ingredient}. Cannot complete order.`);
                        return false; // Stop processing if any ingredient is insufficient
                    }
                }
            }
        }
    
        // If all ingredients are available, deduct inventory
        order.items.forEach(item => {
            const recipe = recipes.drinks.find(r => r.name === item.name) || recipes.foods.find(r => r.name === item.name);
            if (recipe) {
                Object.entries(recipe.ingredients).forEach(([ingredient, quantity]) => {
                    const invItem = inventory.find(i => i.name === ingredient);
                    if (invItem) {
                        invItem.stock = Math.max(0, invItem.stock - (quantity * item.quantity));
                    }
                });
            }
        });
    
        localStorage.setItem("inventory", JSON.stringify(inventory)); // Save updated inventory
        return true; // Allow order completion
    }

    pendingOrdersContainer.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("done-btn")) {
            if (deductInventory(pendingOrders[index])) { // Check stock before proceeding
                const completedOrder = { ...pendingOrders[index], date: new Date().toISOString().split("T")[0] };
                completedOrders.unshift(completedOrder);
                pendingOrders.splice(index, 1);
                saveOrders();
                renderPendingOrders();
                renderCompletedOrders();
            }
        } else if (e.target.classList.contains("void-btn")) {
            pendingOrders.splice(index, 1);
            saveOrders();
            renderPendingOrders();
            renderCompletedOrders();
        }
    });

    completedOrdersTable.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("view-btn")) {
            const order = completedOrders[index];
            orderDetails.innerHTML = `
                <h3>${order.orderId}</h3>
                <p><strong>Customer:</strong> ${order.customer}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}</p>
                <p><strong>Date:</strong> ${order.date}</p>
            `;
            orderModal.style.display = "block";
        } else if (e.target.classList.contains("delete-btn")) {
            completedOrders.splice(index, 1);
            saveOrders();
            renderCompletedOrders();
        }
    });

    closeModal.addEventListener("click", () => {
        orderModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = "none";
        }
    });

    exportButton.addEventListener("click", () => {
        const csvContent = "Order ID,Customer,Total,Date\n" + completedOrders.map(order => `${order.orderId},${order.customer},${order.total.toFixed(2)},${order.date}`).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "completed_orders.csv";
        link.click();
    });

    renderPendingOrders();
    renderCompletedOrders();
})();
