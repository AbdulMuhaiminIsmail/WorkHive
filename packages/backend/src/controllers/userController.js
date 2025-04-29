const { sql, connectDB } = require("../config/db");

// Fetch user credits
const fetchCredits = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, userId)
                        .query("EXEC sp_GetUserCredits @id");

        res.status(200).json({
            credits: response.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"})
    }
}

// Fetch jobs count of a freelancer
const fetchFreelancerJobsCount = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const pool = await connectDB();
        const response = await pool.request()
                        .input("freelancerId", sql.Int, freelancerId)
                        .query("EXEC sp_GetFreelancerJobsCount @freelancerId");  

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
        const pool = await connectDB();
        const response = await pool.request()
                        .input("clientId", sql.Int, clientId)
                        .query("EXEC sp_GetClientJobsCount @clientId");  

        res.status(200).json({
            jobsCount: response.recordset ?? 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Fetch average rating of a freelancer
const fetchAvgRating = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const pool = await connectDB();
        const result = await pool.request()
            .input("freelancerId", sql.Int, freelancerId)
            .query("EXEC sp_GetFreelancerAvgRating @freelancerId");

        const avgRating = result.recordset;

        res.status(200).json({
            avgRating: avgRating ?? 0
        });
    } catch (err) {
        console.error("Error fetching average rating:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch all listed skills of a user
const fetchListedSkills = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const pool = await connectDB();
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query("EXEC sp_GetUserSkills @userId");

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
        const pool = await connectDB();
        const response = await pool.request()
                        .query("EXEC sp_GetAllUsers");  

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Fetch client details by contract Id
const fetchClientByContractId = async (req, res) => {
    try {
        const contractId = parseInt(req.params.id);
        const pool = await connectDB();
        const response = await pool.request()
                        .input("contractId", sql.Int, contractId)
                        .query("EXEC sp_GetClientByContractId @contractId");  

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
        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, userId)
                        .query("EXEC sp_GetUserById @id");  

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
        const request = pool.request();

        if (updates.creditsAdd || updates.creditsSub) {
            const value = updates.creditsAdd || updates.creditsSub;
            const isAdd = updates.creditsAdd ? 1 : 0;
            
            await request
                .input("userId", sql.Int, userId)
                .input("value", sql.Int, value)
                .input("isAdd", sql.Bit, isAdd)
                .query("EXEC sp_UpdateUserCredits @userId, @value, @isAdd");
                
            return res.status(200).json({message: "User credits updated successfully!"});
        }

        // For other updates
        let params = [];
        Object.keys(updates).forEach((key, index) => {
            request.input(`param${index}`, sql.NVarChar(sql.MAX), updates[key]);
            params.push(`${key} = @param${index}`);
        });

        const paramString = params.join(', ');
        await request
            .input("id", sql.Int, userId)
            .query(`EXEC sp_UpdateUser @id, @updates='${paramString}'`);

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
        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, userId)
            .query("EXEC sp_DeleteUser @id");

        res.status(200).json({message: "User deleted with his jobs, contracts, bids, payments and reviews successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { fetchCredits, fetchClientJobsCount, fetchFreelancerJobsCount, fetchAvgRating, fetchListedSkills, fetchClientByContractId, fetchAllUsers, fetchUser, updateUser, deleteUser };