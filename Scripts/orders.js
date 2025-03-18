(() => {
    const pendingOrdersContainer = document.getElementById("pending-orders-grid");
    const completedOrdersTable = document.getElementById("completed-orders-table");
    const exportButton = document.getElementById("export-excel");
    const orderModal = document.getElementById("order-modal");
    const orderDetails = document.getElementById("order-details");
    const closeModal = document.querySelector(".close-modal");

    let pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];
    let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];

    function saveOrders() {
    
        localStorage.setItem("pendingOrders", JSON.stringify(pendingOrders));
        localStorage.setItem("completedOrders", JSON.stringify(completedOrders));

    }

    function renderPendingOrders() {
        pendingOrdersContainer.innerHTML = "";
        pendingOrders.forEach((order, index) => {
            const orderCard = document.createElement("div");
            orderCard.classList.add("order-card");
            orderCard.innerHTML = `
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
            `;
            pendingOrdersContainer.appendChild(orderCard);
        });
    }

    function renderCompletedOrders() {
        completedOrdersTable.innerHTML = "";
        completedOrders.forEach((order, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
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
            `;
            completedOrdersTable.appendChild(row);
        });
    }

    pendingOrdersContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("done-btn")) {
            const index = e.target.dataset.index;
            const completedOrder = { ...pendingOrders[index], date: new Date().toISOString().split("T")[0] };

            completedOrders.unshift(completedOrder);
            pendingOrders.splice(index, 1);

            saveOrders();
            renderPendingOrders();
            renderCompletedOrders();
        } else if (e.target.classList.contains("void-btn")) {
            const index = e.target.dataset.index;
            pendingOrders.splice(index, 1);
            saveOrders();
            renderPendingOrders();
        }
    });

    completedOrdersTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("view-btn")) {
            const index = e.target.dataset.index;
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
            const index = e.target.dataset.index;
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
        let csvContent = "Order ID,Customer,Total,Date\n" + completedOrders.map(order => `${order.orderId},${order.customer},${order.total.toFixed(2)},${order.date}`).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "completed_orders.csv";
        link.click();
    });

    renderPendingOrders();
    renderCompletedOrders();
})();
