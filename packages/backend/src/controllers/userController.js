const { sql, connectDB } = require("../config/db");

// Fetch jobs count of a freelancer
const fetchFreelancerJobsCount = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const query = `
            SELECT COUNT (*) AS jobsCount
            FROM Contracts 
            WHERE freelancer_id = @freelancerId AND status = 'Completed';
        `;

        const pool = await connectDB();
        const response = await pool.request()
                        .input("freelancerId", sql.Int, freelancerId)
                        .query(query);  

        res.status(200).json({
            jobsCount: response.recordset ?? 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Fetch jobs count of a client
const fetchClientJobsCount = async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        const query = `
            SELECT COUNT (*) AS jobsCount
            FROM Contracts 
            WHERE job_id IN (
                SELECT id 
                FROM Jobs
                WHERE client_id = @clientId
            )
        `;

        const pool = await connectDB();
        const response = await pool.request()
                        .input("clientId", sql.Int, clientId)
                        .query(query);  

        res.status(200).json({
            jobsCount: response.recordset ?? 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Fetch average rating of a freelancer using nested subqueries
const fetchAvgRating = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);

        const query = `
            SELECT AVG(CAST(rating AS FLOAT)) AS avgRating
            FROM Reviews
            WHERE contract_id IN (
                SELECT id
                FROM Contracts
                WHERE freelancer_id = @freelancerId
            );
        `;

        const pool = await connectDB();
        const result = await pool.request()
            .input("freelancerId", sql.Int, freelancerId)
            .query(query);

        const avgRating = result.recordset;

        res.status(200).json({
            avgRating: avgRating ?? 0 // Return 0 if no reviews found
        });
    } catch (err) {
        console.error("Error fetching average rating:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch all listed skills of a user by user ID
const fetchListedSkills = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const query = `
            SELECT name
            FROM Skills
            WHERE id IN (
                SELECT skill_id
                FROM User_Skills
                WHERE user_id = @userId
            );
        `;

        const pool = await connectDB();
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(query);

        const skills = result.recordset.map(row => row.name);

        res.status(200).json({
            listedSkills: skills
        });
    } catch (err) {
        console.error("Error fetching listed skills:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

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

// Fetch client details by the contract Id
const fetchClientByContractId = async (req, res) => {
    try {
        const contractId = parseInt(req.params.id);
        const query = `
            SELECT name, email, phone_number
            FROM users
            WHERE id = (
                SELECT client_id 
                FROM jobs
                WHERE id = (
                    SELECT job_id 
                    FROM contracts
                    WHERE id = @contractId
                )
            );
        `;

        const pool = await connectDB();
        const response = await pool.request()
                        .input("contractId", sql.Int, contractId)
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

module.exports = { fetchClientJobsCount, fetchFreelancerJobsCount, fetchAvgRating, fetchListedSkills, fetchClientByContractId, fetchAllUsers, fetchUser, updateUser, deleteUser }