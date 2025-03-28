document.addEventListener("DOMContentLoaded", function () {
    const totalOrdersEl = document.getElementById("total-orders");
    const pendingOrdersEl = document.getElementById("pending-orders");
    const completedOrdersEl = document.getElementById("completed-orders");
    const totalRevenueEl = document.getElementById("total-revenue");
    const recentOrdersTable = document.querySelector(".recent-orders tbody");

    let pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];
    let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];

    const today = new Date().toISOString().split("T")[0];
    const totalOrdersToday = completedOrders.filter(order => order.date === today).length;
    const totalPendingOrders = pendingOrders.length;
    const totalCompletedOrders = completedOrders.length;
    const totalRevenueToday = completedOrders.filter(order => order.date === today)
        .reduce((sum, order) => sum + order.total, 0);

    let promotions = JSON.parse(localStorage.getItem("promos")) || [];

    const promoList = document.getElementById("promo-list");
    const promoTitleInput = document.getElementById("promo-title");
    const promoDescriptionInput = document.getElementById("promo-description");
    const addPromoButton = document.getElementById("add-promo");

    function updateDashboard() {
      console.log(completedOrders);
      totalOrdersEl.innerHTML = `Total Orders: <p>${totalOrdersToday}</p>`;
      pendingOrdersEl.innerHTML = `Pending Orders: <p>${totalPendingOrders}</p>`;
      completedOrdersEl.innerHTML = `Completed Orders: <p>${totalCompletedOrders}</p>`;
      totalRevenueEl.innerHTML = `Total Revenue: <p>$${totalRevenueToday.toFixed(2)}</p>`;
  
      const latestFive = completedOrders.slice(0, 5); // gets first 5 (most recent)
      recentOrdersTable.innerHTML = latestFive.map(order => `
          <tr>
              <td>#${order.orderId}</td>
              <td>${order.customer}</td>
              <td class="completed">Completed</td>
              <td>$${order.total.toFixed(2)}</td>
          </tr>`).join("");
  }

    function fetchSalesData(from, to) {
        const startDate = new Date(from);
        const endDate = new Date(to);
        const salesData = {};
        let timeUnit = "day";
    
        if (startDate.getFullYear() !== endDate.getFullYear()) {
          timeUnit = "year";
        } else if (startDate.getMonth() !== endDate.getMonth()) {
          timeUnit = "month";
        }
    
        let labels = [];
        if (timeUnit === "year") {
          for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
            labels.push(year.toString());
            salesData[year] = 0;
          }
        } else if (timeUnit === "month") {
          let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          while (current <= endDate) {
            let key = `${current.getFullYear()}-${current.getMonth() + 1}`;
            labels.push(key);
            salesData[key] = 0;
            current.setMonth(current.getMonth() + 1);
          }
        } else {
          for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
            labels.push(day.toString());
            salesData[day] = 0;
          }
        }
    
        completedOrders.forEach(order => {
          const orderDate = new Date(order.date);
          if (orderDate >= startDate && orderDate <= endDate) {
            let key;
            if (timeUnit === "year") {
              key = orderDate.getFullYear();
            } else if (timeUnit === "month") {
              key = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
            } else {
              key = orderDate.getDate();
            }
            salesData[key] = (salesData[key] || 0) + order.total;
          }
        });
    
        const data = labels.map(label => salesData[label] || 0);
    
        return { labels, data, timeUnit };
      }
    
      function updateSalesChart(from, to) {
        const { labels, data, timeUnit } = fetchSalesData(from, to);
        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = data;
        salesChart.options.scales.x.title.text = timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1);
        salesChart.options.scales.y.suggestedMax = Math.max(...data) + 2;
        salesChart.update();
      }
    
      const salesChart = new Chart(document.getElementById("salesChart"), {
        type: "line",
        data: { labels: [], datasets: [{ label: "Sales", data: [], backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1 }] },
        options: { responsive: true, scales: { x: { title: { display: true, text: "Day" } }, y: { title: { display: true, text: "Sales (₱)" }, suggestedMax: 10 } } },
      });
    
      document.getElementById("generate-sales").addEventListener("click", function () {
        const from = document.getElementById("from-date").value;
        const to = document.getElementById("to-date").value;
        if (from && to) updateSalesChart(from, to);
      });

    function updateCardStyles() {
        totalOrdersEl.style.backgroundColor = "#5a3e36";
        pendingOrdersEl.style.backgroundColor = "#e67e22";
        completedOrdersEl.style.backgroundColor = "#27ae60";
        totalRevenueEl.style.backgroundColor = "#2c3e50";
    }

    function updatePromoList() {
      promoList.innerHTML = promotions.map((promo, index) => 
          `<li class="input-promo">
              <button class="delete-promo" data-index="${index}">❌</button>
              <strong>${promo.title}</strong> - ${promo.description} 
          </li>`
      ).join("");

      // Attach event listeners to delete buttons
      document.querySelectorAll(".delete-promo").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.dataset.index;
              promotions.splice(index, 1);
              localStorage.setItem("promos", JSON.stringify(promotions));
              updatePromoList();
          });
      });
    }
    addPromoButton.addEventListener("click", function () {
      const title = promoTitleInput.value.trim();
      const description = promoDescriptionInput.value.trim();

      if (title && description) {
          promotions.push({ title, description });
          localStorage.setItem("promos", JSON.stringify(promotions));
          updatePromoList();
          promoTitleInput.value = "";
          promoDescriptionInput.value = "";
      }
    });
    updatePromoList();
    updateDashboard();
    updateSalesChart();
    updateCardStyles();
});

