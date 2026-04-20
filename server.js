const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Read users
function getUsers() {
  const data = fs.readFileSync("users.json");
  return JSON.parse(data);
}

// Save users
function saveUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// REGISTER
app.post("/register", (req, res) => {
  const { name, email, password, blood } = req.body;

  const fs = require("fs");

  let users = [];

  if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
  }

  // check if user already exists
  const exists = users.find(user => user.email === email);
  if (exists) {
    return res.json({ message: "User already exists" });
  }

  // ✅ SAVE REAL DATA
  users.push({
    name: name,
    email: email,
    password: password,
    blood: blood
  });

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Registered successfully" });
});

// LOGIN
app.post("/login", (req, res) => {
  const users = getUsers();
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    res.json({ message: "Login success", user });
  } else {
    res.json({ message: "Invalid credentials" });
  }
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});