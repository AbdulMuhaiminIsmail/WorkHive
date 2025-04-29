const { sql, connectDB } = require("../config/db");

const fetchJobsByIds = async (req, res) => {
    try {
        let { jobIds } = req.body;

        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
            return res.status(400).json({ error: "No job IDs provided." });
        }

        const pool = await connectDB();
        const request = pool.request();
        
        // Pass the array as a JSON string
        await request.input("jobIds", sql.NVarChar(sql.MAX), JSON.stringify(jobIds));
        
        const response = await request.query("EXEC sp_GetJobsByIds @jobIds");
        res.status(200).json(response.recordset);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const fetchAllJobsByClient = async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        const pool = await connectDB();
        const response = await pool.request()
                        .input("client_id", sql.Int, clientId)
                        .query("EXEC sp_GetJobsByClient @client_id");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllJobs = async (req, res) => {
    try {
        const pool = await connectDB();
        const response = await pool.request().query("EXEC sp_GetAllJobs");
        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, jobId)
                        .query("EXEC sp_GetJobById @id");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const createJob = async (req, res) => {
    try {
        const jobData = req.body;
        const pool = await connectDB();
        const { title, description, clientId, budget, deadline } = jobData;

        await pool.request()
            .input("title", sql.NVarChar(100), title)
            .input("description", sql.NVarChar(sql.MAX), description)
            .input("client_id", sql.Int, clientId)
            .input("budget", sql.Decimal(10, 2), budget)
            .input("deadline", sql.Date, deadline)
            .query("EXEC sp_CreateJob @title, @description, @client_id, @budget, @deadline");

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
        const request = pool.request();
        
        // Build dynamic parameters
        let params = [];
        Object.keys(updates).forEach((key, index) => {
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
            request.input(`param${index}`, type, updates[key]);
            params.push(`${key} = @param${index}`);
        });

        const paramString = params.join(', ');
        await request
            .input("id", sql.Int, jobId)
            .query(`EXEC sp_UpdateJob @id, @updates='${paramString}'`);

        res.status(200).json({message: "Job updated successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, jobId)
            .query("EXEC sp_DeleteJob @id");

        res.status(200).json({message: "Job deleted successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { fetchJobsByIds, fetchAllJobsByClient, fetchAllJobs, fetchJob, createJob, updateJob, deleteJob };