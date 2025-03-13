const { sql, connectDB } = require("../config/db");

// Fetch all users
const fetchAllUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM Users";

        const pool = await connectDB();
        const response = await pool.request()
                        .query(query);  

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Fetch a user by ID
const fetchUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const query = "SELECT * FROM Users WHERE id = @id";

        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, userId)
                        .query(query);  

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Update a user
const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({message: "No data given for updating"});
        }
        
        const pool = await connectDB();
        let query = "UPDATE Users SET ";
        let params = [];

        // Creating dynamic query for any number of params
        Object.keys(updates).forEach((key, index) => {
            query += `${key} = @param${index}, `;
            params.push({name: `param${index}`, type: sql.NVarChar, value: updates[key]});
        });

        // Remove the trailing comma and space
        query = query.slice(0, -2)

        query += " WHERE id = @id;";

        const request = pool.request();
        params.forEach(param => request.input(param.name, param.type, param.value));
        request.input("id", sql.Int, userId);
        await request.query(query);

        res.status(200).json({message: "User updated successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const query = "DELETE FROM Users WHERE id = @id"

        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, userId)
            .query(query)

        res.status(200).json({message: "User deleted successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { fetchAllUsers, fetchUser, updateUser, deleteUser}