const { sql, connectDB } = require("../config/db")

const fetchJobsByIds = async (req, res) => {
    try {
        let { jobIds } = req.body;

        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
            return res.status(400).json({ error: "No job IDs provided." });
        }

        // Create parameter placeholders (@id0, @id1, ...)
        const paramPlaceholders = jobIds.map((_, index) => `@id${index}`).join(", ");
        const query = `SELECT * FROM Jobs WHERE id IN (${paramPlaceholders}) ORDER BY id ASC`;

        const pool = await connectDB();
        const request = pool.request();

        jobIds.forEach((id, index) => {
            request.input(`id${index}`, sql.Int, id);
        });

        const response = await request.query(query);
        res.status(200).json(response.recordset);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const fetchAllJobsByClient = async (req, res) => {
    try {
        const query = "SELECT * FROM Jobs WHERE client_id = @client_id";
        const clientId = parseInt(req.params.id)

        const pool = await connectDB();
        const response = await pool.request()
                        .input("client_id", sql.Int, clientId)
                        .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllJobs = async (req, res) => {
    try {
        const query = "SELECT * FROM Jobs";

        const pool = await connectDB();
        const response = await pool.request()
                        .query(query);

        res.status(200).json(response.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const query = "SELECT * FROM Jobs WHERE id = @id";

        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, jobId)
                        .query(query);

        res.status(200).json(response.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const createJob = async (req, res) => {
    try {
        const query = `
        INSERT INTO Jobs (title, description, client_id, budget, deadline) 
        VALUES (@title, @description, @client_id, @budget, @deadline);
        `;

        const jobData = req.body;
        
        const pool = await connectDB();
        const { title, description, clientId, budget, deadline } = jobData;

        await pool.request()
            .input("title", sql.NVarChar(100), title)
            .input("description", sql.NVarChar(sql.MAX), description)
            .input("client_id", sql.Int, clientId)
            .input("budget", sql.Decimal(10, 2), budget)
            .input("deadline", sql.Date, deadline)
            .query(query);

        res.status(200).json({message: "Job created successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const updateJob = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({message: "No data given for updating"});
        }
        
        const pool = await connectDB();
        let query = "UPDATE Jobs SET ";
        let params = [];

        // Creating dynamic query for any number of params with different data types
        Object.keys(updates).forEach((key, index) => {
            query += `${key} = @param${index}, `;
            let type;
            switch (key) {
            case 'title':
            case 'description':
            case 'status':
                type = sql.NVarChar(sql.MAX);
                break;
            case 'client_id':
                type = sql.Int;
                break;
            case 'budget':
                type = sql.Decimal(10, 2);
                break;
            case 'deadline':
            case 'posted_at':
                type = sql.DateTime2;
                break;
            default:
                type = sql.NVarChar(sql.MAX);
            }
            params.push({name: `param${index}`, type: type, value: updates[key]});
        });

        // Remove the trailing comma and space
        query = query.slice(0, -2)

        query += " WHERE id = @id;";

        const request = pool.request();
        params.forEach(param => request.input(param.name, param.type, param.value));
        request.input("id", sql.Int, jobId);
        await request.query(query);

        res.status(200).json({message: "Job updated successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const query = `
            DELETE FROM Contracts WHERE job_id = @id
            DELETE FROM Jobs WHERE id = @id
        `;

        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, jobId)
            .query(query);

        res.status(200).json({message: "Job deleted successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { fetchJobsByIds, fetchAllJobsByClient, fetchAllJobs, fetchJob, createJob, updateJob, deleteJob };