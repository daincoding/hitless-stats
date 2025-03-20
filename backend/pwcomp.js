const bcrypt = require("bcryptjs");

const inputPassword = "test"; // Replace with the password you're entering in login
const storedHash = "$2b$10$6ZhVat3VeTYohDUnDi8Y7u4azH/yYkRvn9hWp4TM0.LfcC6YEhbJe"; // Replace with the stored password hash

bcrypt.compare(inputPassword, storedHash, (err, result) => {
    console.log("Password match?", result);
});