document.addEventListener("DOMContentLoaded", () => {
  const userContainer = document.getElementById("user-container");
  const editModal = document.getElementById("editModal");
  const editUserForm = document.getElementById("editUserForm");
  const addModal = document.getElementById("addModal");
  const addUserForm = document.getElementById("addUserForm");
  const openAddModalBtn = document.getElementById("openAddModalBtn");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentEditIndex = null;

  function saveToLocalStorage() {
      localStorage.setItem("users", JSON.stringify(users));
  }

  function displayUsers() {
      userContainer.innerHTML = "";
      users.forEach((user, index) => {
          const userCard = document.createElement("div");
          userCard.classList.add("user-card");
          userCard.innerHTML = `
              <img src="${user.image}" alt="User Image" class="user-image">
              <div class="content">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${user.password}</p>
                <div class="buttons">
                  <button class="edit-btn" data-index="${index}">Edit</button>
                  <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
              </div>
          `;
          userContainer.appendChild(userCard);
      });
  }

  userContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-btn")) {
          currentEditIndex = event.target.dataset.index;
          const user = users[currentEditIndex];
          document.getElementById("editName").value = user.name;
          document.getElementById("editEmail").value = user.email;
          document.getElementById("editPassword").value = user.password;
          editModal.style.display = "block";
      }
      
      if (event.target.classList.contains("delete-btn")) {
          const deleteIndex = event.target.dataset.index;
          users.splice(deleteIndex, 1);
          saveToLocalStorage();
          displayUsers();
      }
  });

  editUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fileInput = document.getElementById("editImage");
      const file = fileInput.files[0];
      users[currentEditIndex].name = document.getElementById("editName").value;
      users[currentEditIndex].email = document.getElementById("editEmail").value;
      users[currentEditIndex].password = document.getElementById("editPassword").value;
      
      if (file) {
          const reader = new FileReader();
          reader.onload = function () {
              users[currentEditIndex].image = reader.result;
              saveToLocalStorage();
              displayUsers();
              editModal.style.display = "none";
          };
          reader.readAsDataURL(file);
      } else {
          saveToLocalStorage();
          displayUsers();
          editModal.style.display = "none";
      }
  });

  document.getElementById("cancelEditBtn").addEventListener("click", function () {
    editModal.style.display = "none";
  });

  openAddModalBtn.addEventListener("click", () => {
    addModal.style.display = "block";
  });

  document.getElementById("cancelAddBtn").addEventListener("click", () => {
    addModal.style.display = "none";
  });

  addUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("addName").value;
      const email = document.getElementById("addEmail").value;
      const password = document.getElementById("addPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const fileInput = document.getElementById("addImage");
      const file = fileInput.files[0];
      if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
      }
      
      if (!file) {
          alert("Please select an image!");
          return;
      }
      
      const reader = new FileReader();
      reader.onload = function () {
          const newUser = { name, email, password, image: reader.result };
          users.push(newUser);
          saveToLocalStorage();
          displayUsers();
          addModal.style.display = "none";
      };
      reader.readAsDataURL(file);
  });

  displayUsers();
});
