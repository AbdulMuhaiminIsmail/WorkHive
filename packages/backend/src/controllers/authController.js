const bcryptjs = require("bcryptjs");
const { sql, connectDB } = require("../config/db");
const { generateToken } = require("../utils/jwtUtils");

// Login the user
const loginUser = async (req, res) => {
    try {
        const query = `SELECT * FROM Users WHERE email = @email`;
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({message: "Both email and password are required!"});
        }
    
        const pool = await connectDB();
        const result = await pool.request()
                        .input("email", sql.NVarChar(100), email)
                        .query(query);
                     
        if (result.recordset.length === 0) {
            return res.status(401).json({error: "Email or password is incorrect!"});
        }
                        
        const user = result.recordset[0];
        const isMatch = await bcryptjs.compare(password, user.pass_hash);
    
        if (!isMatch) {
            return res.status(401).json({error: "Email or password is incorrect!"});
        }
    
        const token = generateToken(user.id);
        
        return res.status(200).json({
            message: "Login successful!",
            user: {
                "id": user.id,
                "name": user.name, 
                "title": user.title, 
                "cnic": user.cnic, 
                "email": user.email,
                "phone_number": user.phone_number,
                "biography": user.biography,
                "profile_picture_url": user.profile_picture_url,
                "user_type": user.user_type,
                "created_at": user.created_at
            },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: "Internal server error!"});
    }
}

// Register a new user
const registerUser = async (req, res) => {
    try {
        const query = `
            INSERT INTO Users (name, title, email, pass_hash, cnic, phone_number, biography, profile_picture_url, user_type)
            VALUES (@name, @title, @email, @pass_hash, @cnic, @phone_number, @biography, @profile_picture_url, @user_type)
        `;

        const { name, title, email, password, cnic, phoneNumber, biography, profile_picture_url, userType } = req.body;

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const pool = await connectDB();
        await pool.request()
            .input("name", sql.NVarChar(100), name)
            .input("title", sql.NVarChar(100), title)
            .input("email", sql.NVarChar(100), email)
            .input("pass_hash", sql.NVarChar(255), hashedPassword)
            .input("cnic", sql.VarChar(15), cnic)
            .input("phone_number", sql.VarChar(13), phoneNumber)
            .input("biography", sql.NVarChar(sql.MAX), biography)
            .input("profile_picture_url", sql.NVarChar(sql.MAX), profile_picture_url)
            .input("user_type", sql.NVarChar(10), userType)
            .query(query);

        res.status(200).json({message: "User registered successfully!"});
        console.log("User registered successfully!");
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: "Error registering user!"});
    }
}

module.exports = { registerUser, loginUser };