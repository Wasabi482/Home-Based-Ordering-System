console.log("ham.js is running");

// Function to initialize the sidebar logic
function initializeSidebar() {
  console.log("Initializing sidebar");

  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById("toggleSidebar");
  const menuItems = document.querySelectorAll(".menu-item");

  console.log("Sidebar element:", sidebar);
  console.log("Toggle button element:", toggleButton);
  console.log("Menu items:", menuItems);

  if (!sidebar || !toggleButton || menuItems.length === 0) {
    console.error("❌ Required elements not found in the DOM");
    return;
  }

  // Function to toggle the sidebar
  function toggleSidebar() {
    const isExpanded = sidebar.classList.contains("expanded");

    if (isExpanded) {
      sidebar.classList.remove("expanded");
    } else {
      sidebar.classList.add("expanded");
    }
  }

  // Function to handle menu item clicks (does NOT collapse sidebar)
  function handleMenuItemClick(event) {
    // Remove active class from all menu items
    menuItems.forEach((item) => item.classList.remove("active"));

    // Add active class to the clicked menu item
    event.currentTarget.classList.add("active");

    // Get the section/page to load
    const section = event.currentTarget.getAttribute("data-section");

    if (section === "logout") {
      window.location.href = "../index.html"; // Redirect to login page
    } else {
      window.location.href = `../sections/${section}.html`;
    }

    toggleSidebar();
  }

  // **Set sidebar state on load based on localStorage**


  // Set active class based on the current page
  const currentPage = window.location.pathname.split("/").pop();
  menuItems.forEach((item) => {
    item.classList.remove("active");
    const itemSection = item.getAttribute("data-section");
    if (currentPage.includes(itemSection)) {
      item.classList.add("active");
    }
  });

  // Add event listeners
  toggleButton.addEventListener("click", toggleSidebar);
  menuItems.forEach((item) => item.addEventListener("click", handleMenuItemClick));

  console.log("Event listeners attached successfully");
}

// Call the initialize function
initializeSidebar();
