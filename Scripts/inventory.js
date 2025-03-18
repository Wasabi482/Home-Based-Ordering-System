document.addEventListener("DOMContentLoaded", function () {
    const inventoryTableBody = document.getElementById("inventory-body");
    const editModal = document.getElementById("editModal");
    const editForm = document.getElementById("edit-form");
    const stockInput = document.getElementById("edit-stock");
    const closeButton = document.querySelector(".close");
    const addItemButton = document.getElementById("addItem");
    const addModal = document.getElementById("addModal");
    const addButton = document.querySelector(".add-btn");
    const cancelButton = document.querySelector(".cancel-btn");
    const addName = document.getElementById("addName");
    const addQuantity = document.getElementById("addQuantity");
    const addUnit = document.getElementById("addUnit");
    let currentItemIndex = null;
  
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  
    function saveToLocalStorage() {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }
  
    function renderInventoryTable() {
        inventoryTableBody.innerHTML = inventory.map((item, index) => `
            <tr>
                <td>${item.name}</td>
                <td class="${item.stock <= 500 ? 'low-stock' : ''}">${item.stock} ${item.unit}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            </tr>`).join("");
    }
  
    inventoryTableBody.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-btn")) {
            currentItemIndex = index;
            const item = inventory[index];
            document.getElementById("edit-item-name").textContent = `Edit ${item.name}`;
            stockInput.value = item.stock;
            editModal.style.display = "block";
        } else if (e.target.classList.contains("delete-btn")) {
            inventory.splice(index, 1);
            saveToLocalStorage();
            renderInventoryTable();
        }
    });
  
    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (currentItemIndex !== null) {
            inventory[currentItemIndex].stock = parseInt(stockInput.value, 10);
            saveToLocalStorage();
            renderInventoryTable();
            editModal.style.display = "none";
        }
    });
  
    addItemButton.addEventListener("click", () => {
        addModal.style.display = "flex";
    });
  
    function addItemToInventory() {
        const name = addName.value.trim();
        const quantity = parseInt(addQuantity.value, 10);
        const unit = addUnit.value.trim();
  
        if (name && !isNaN(quantity) && unit) {
            inventory.push({ name, stock: quantity, unit });
            saveToLocalStorage();
            renderInventoryTable();
            closeModal();
        } else {
            alert("Please enter valid item details.");
        }
    }
  
    function closeModal() {
        addModal.style.display = "none";
        editModal.style.display = "none";
        addName.value = "";
        addQuantity.value = "";
        addUnit.value = "";
    }
  
    addButton.addEventListener("click", addItemToInventory);
    cancelButton.addEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);
  
    renderInventoryTable();
});
