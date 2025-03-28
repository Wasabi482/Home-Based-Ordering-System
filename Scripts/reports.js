document.addEventListener("DOMContentLoaded", function () {
  console.log("report.js is running");

  function setMaxDate(inputId) {
    document.getElementById(inputId).max = new Date().toISOString().split("T")[0];
  }
  ["from-date", "to-date", "trend-from-date", "trend-to-date", "revenue-from-date", "revenue-to-date"].forEach(setMaxDate);


  function checkInventoryLevels() {
    const warnings = [];
    inventory.forEach(item => {
      const percentage = (item.stock / item.maxStock) * 100;
      if (percentage < 30 && percentage > 0) {
        warnings.push(`${item.name} is running low, please restock soon.`);
      } else if (percentage === 0) {
        warnings.push(`${item.name} is out of stock, please restock now.`);
      }
    });
    displayInventoryWarnings(warnings);
  }

  function displayInventoryWarnings(warnings) {
    const inventoryCard = document.querySelector(".card.warning");
    inventoryCard.innerHTML = "<h3>Inventory Reports</h3>";
    
    if (warnings.length > 0) {
      const warningList = document.createElement("ul");
      warnings.forEach(warning => {
        const li = document.createElement("li");
        li.textContent = warning;
        warningList.appendChild(li);
      });
      inventoryCard.appendChild(warningList);
    } else {
      inventoryCard.innerHTML += "<p>All inventory levels are sufficient.</p>";
    }
    inventoryCard.style.display = "block";
  }
  checkInventoryLevels();
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

  function fetchTrendingProducts(from, to) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const productCounts = {};

    completedOrders.forEach(order => {
      const orderDate = new Date(order.date);
      if (orderDate >= startDate && orderDate <= endDate) {
        order.items.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
      }
    });

    const labels = Object.keys(productCounts);
    const data = labels.map(label => productCounts[label] || 0);

    return { labels, data };
  }

  function updateTrendingChart(from, to) {
    const { labels, data } = fetchTrendingProducts(from, to);
    trendChart.data.labels = labels;
    trendChart.data.datasets[0].data = data;
    trendChart.options.scales.y.title.text = "Quantity Ordered";
    trendChart.options.scales.y.suggestedMax = Math.max(...data) + 2;
    trendChart.update();
  }

  const trendChart = new Chart(document.getElementById("trendChart"), {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Quantity Ordered", data: [], backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }] },
    options: { responsive: true, scales: { y: { title: { display: true, text: "Quantity Ordered" }, suggestedMax: 10 } } },
  });

  document.getElementById("generate-trend").addEventListener("click", function () {
    const from = document.getElementById("trend-from-date").value;
    const to = document.getElementById("trend-to-date").value;
    if (from && to) updateTrendingChart(from, to);
  });

  function fetchTotalRevenue(from, to) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // include the full end day
  
    // Get completed orders from localStorage
    const completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];
  
    console.log("All completed orders:", completedOrders);
  
    // Filter orders within date range
    const filteredOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
  
    console.log("Filtered orders:", filteredOrders);
  
    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      return sum + parseFloat(order.total);
    }, 0);
  
    // Display result
    const revenueText = document.getElementById("total-revenue");
    revenueText.textContent = `₱${totalRevenue.toFixed(2)}`;
  }

  document.getElementById("generate-revenue").addEventListener("click", () => {
    const from = document.getElementById("revenue-from-date").value;
    const to = document.getElementById("revenue-to-date").value;
  
    if (from && to) {
      fetchTotalRevenue(from, to);
    } else {
      alert("Please select both From and To dates.");
    }
  });
});
