const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {exp: process.env.JWT_EXPIRES_IN}
    );
}

module.exports = { generateToken };