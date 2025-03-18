// listen for registration form submission

document.addEventListener("DOMContentLoaded", () =>{

  let users = JSON.parse(localStorage.getItem("users")) || [];  // Load users from storage

  console.log("Users after refresh:", users);  // ✅ This proves users are still there after refresh
  
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if(registerForm){
    registerForm.addEventListener("submit", (event) =>{
      event.preventDefault();//prevent page refresh

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword){
        alert("Passwords do not match!")
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const existingUser = users.find(user => user.email===email);

      if(existingUser) {
        alert("Email is already registered. Try logging in.");
        return;
      }

      const newUser = {
        name: name,
        email: email,
        password: password
      };

      users.push(newUser);

      localStorage.setItem("users", JSON.stringify(users));

      console.log("Users List:", users);

      alert("Account created successfully!");
      window.location.href = "login.html";
    });
  }

  if(loginForm){
    loginForm.addEventListener("submit", (event) =>{
      event.preventDefault();

      const loginEmail = document.getElementById("loginEmail").value;
      const loginPassword = document.getElementById("loginPassword").value;

      //Retrieve Stored user
      let users = JSON.parse(localStorage.getItem("users")) || [];

      const foundUser = users.find(user => user.email === loginEmail && user.password === loginPassword);

      if(foundUser){
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        console.log("User Logged In:", foundUser)
        alert("Login successful!");
        window.location.href = "../sections/dashboard.html";//redirect to dashboard
      }else {
        alert("Invalid email or password");
      }
    });
  }
});