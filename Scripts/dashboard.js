document.addEventListener("DOMContentLoaded", function () {
  // Fetch order data
  let pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];
  let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];

  console.log(pendingOrders);
  console.log(completedOrders);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Calculate Total Orders (Completed Today)
  const totalOrdersToday = completedOrders.filter(order => order.date === today).length;

  // Calculate Pending Orders
  const totalPendingOrders = pendingOrders.length;

  // Calculate Completed Orders (Completed Today)
  const totalCompletedOrders = completedOrders.length;

  // Calculate Total Revenue (Sum of completed orders for today)
  const totalRevenueToday = completedOrders
      .filter(order => order.date === today)
      .reduce((sum, order) => sum + order.total, 0);

  // Display Dashboard Data
  document.getElementById("total-orders").innerHTML = `Total Orders: <p>${totalOrdersToday}</p>`;
  document.getElementById("pending-orders").innerHTML = `Pending Orders: <p>${totalPendingOrders}</p>`;
  document.getElementById("completed-orders").innerHTML = `Completed Orders: <p>${totalCompletedOrders}</p>`;
  document.getElementById("total-revenue").innerHTML = `Total Revenue: <p>$${totalRevenueToday.toFixed(2)}</p>`;

  // Display Recent Orders (Last 5 completed orders)
  const recentOrdersTable = document.querySelector(".recent-orders tbody");
  recentOrdersTable.innerHTML = ""; // Clear existing rows
  completedOrders.slice(-5).reverse().forEach(order => {
      const row = `<tr>
          <td>#${order.orderId}</td>
          <td>${order.customer}</td>
          <td class="completed">Completed</td>
          <td>$${order.total.toFixed(2)}</td>
      </tr>`;
      recentOrdersTable.innerHTML += row;
  });

  // Generate Daily Sales Data for Chart.js (Last 7 Days)
  const dailySales = {};
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      let formattedDate = date.toISOString().split("T")[0];
      last7Days.push(formattedDate);
      dailySales[formattedDate] = 0; // Initialize to 0
  }

  completedOrders.forEach(order => {
      if (dailySales.hasOwnProperty(order.date)) {
          dailySales[order.date] += order.total;
      }
  });

  // Update Sales Chart
  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
      type: "bar", // Use bar chart for better readability
      data: {
          labels: last7Days,
          datasets: [{
              label: "Daily Sales ($)",
              data: last7Days.map(date => dailySales[date] || 0), // Ensure every day has a value
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

  function updateCardStyles() {
      console.log("✅ Updating overview card colors...");

      document.getElementById("total-orders").style.backgroundColor = "#5a3e36";
      document.getElementById("pending-orders").style.backgroundColor = "#e67e22";
      document.getElementById("completed-orders").style.backgroundColor = "#27ae60";
      document.getElementById("total-revenue").style.backgroundColor = "#2c3e50";
  }

  updateCardStyles();
});
