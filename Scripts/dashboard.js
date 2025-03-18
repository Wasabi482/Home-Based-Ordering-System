document.addEventListener("DOMContentLoaded", function () {
    const totalOrdersEl = document.getElementById("total-orders");
    const pendingOrdersEl = document.getElementById("pending-orders");
    const completedOrdersEl = document.getElementById("completed-orders");
    const totalRevenueEl = document.getElementById("total-revenue");
    const recentOrdersTable = document.querySelector(".recent-orders tbody");
    const quickActionsContainer = document.querySelector(".quick-actions");

    let pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];
    let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];

    const today = new Date().toISOString().split("T")[0];
    const totalOrdersToday = completedOrders.filter(order => order.date === today).length;
    const totalPendingOrders = pendingOrders.length;
    const totalCompletedOrders = completedOrders.length;
    const totalRevenueToday = completedOrders.filter(order => order.date === today)
        .reduce((sum, order) => sum + order.total, 0);

    function updateDashboard() {
        totalOrdersEl.innerHTML = `Total Orders: <p>${totalOrdersToday}</p>`;
        pendingOrdersEl.innerHTML = `Pending Orders: <p>${totalPendingOrders}</p>`;
        completedOrdersEl.innerHTML = `Completed Orders: <p>${totalCompletedOrders}</p>`;
        totalRevenueEl.innerHTML = `Total Revenue: <p>$${totalRevenueToday.toFixed(2)}</p>`;

        recentOrdersTable.innerHTML = completedOrders.slice(-5).reverse().map(order => `
            <tr>
                <td>#${order.orderId}</td>
                <td>${order.customer}</td>
                <td class="completed">Completed</td>
                <td>$${order.total.toFixed(2)}</td>
            </tr>`).join("");
    }

    function generateSalesChart() {
        const dailySales = {};
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            let formattedDate = date.toISOString().split("T")[0];
            last7Days.push(formattedDate);
            dailySales[formattedDate] = 0;
        }

        completedOrders.forEach(order => {
            if (dailySales.hasOwnProperty(order.date)) {
                dailySales[order.date] += order.total;
            }
        });

        const ctx = document.getElementById("salesChart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: last7Days,
                datasets: [{
                    label: "Daily Sales ($)",
                    data: last7Days.map(date => dailySales[date] || 0),
                    backgroundColor: "rgba(108, 92, 231, 0.6)",
                    borderColor: "#6c5ce7",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateCardStyles() {
        totalOrdersEl.style.backgroundColor = "#5a3e36";
        pendingOrdersEl.style.backgroundColor = "#e67e22";
        completedOrdersEl.style.backgroundColor = "#27ae60";
        totalRevenueEl.style.backgroundColor = "#2c3e50";
    }

    quickActionsContainer.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
            const action = event.target.textContent;
            if (action.includes("Add New Product")) {
                console.log("🆕 Add New Product Clicked");
            } else if (action.includes("Manage Orders")) {
                console.log("📋 Manage Orders Clicked");
            }
        }
    });

    updateDashboard();
    generateSalesChart();
    updateCardStyles();
});
