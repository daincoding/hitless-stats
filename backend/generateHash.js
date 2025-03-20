const bcrypt = require('bcryptjs');

const password = "test"; // Replace with your actual password

bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("Hashed password:", hash);
    }
});