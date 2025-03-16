const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN, algorithm: "HS256"}
    );
}

module.exports = { generateToken };