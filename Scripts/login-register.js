// listen for registration form submission

document.addEventListener("DOMContentLoaded", () => {


  let users = JSON.parse(localStorage.getItem("users")) || [];
  console.log("Users after refresh:", users);
  
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  function saveUsersToStorage() {
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const termsChecked = document.getElementById("terms").checked;

      if (!termsChecked) {
        alert("You must agree to the terms and conditions.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const existingUser = users.find(user => user.email === email);

      if (existingUser) {
        alert("Email is already registered. Try logging in.");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      saveUsersToStorage();

      console.log("Users List:", users);

      alert("Account created successfully!");
      window.location.href = "login.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const loginEmail = document.getElementById("loginEmail").value;
      const loginPassword = document.getElementById("loginPassword").value;

      const foundUser = users.find(user => user.email === loginEmail && user.password === loginPassword);

      if (foundUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        console.log("User Logged In:", foundUser);
        alert("Login successful!");
        window.location.href = "../sections/dashboard.html";
      } else {
        alert("Invalid email or password");
      }
    });
  }
});
