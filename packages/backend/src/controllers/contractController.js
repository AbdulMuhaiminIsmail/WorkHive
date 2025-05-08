const { sql, connectDB } = require('../config/db');

const fetchAllContractsOfFreelancer = async (req, res) => {
    try {
        const freelancerId = req.params.id;
        const pool = await connectDB();
        const response = await pool.request()
                            .input("freelancerId", sql.Int, freelancerId)
                            .query("EXEC sp_GetContractsByFreelancer @freelancerId");

        res.status(200).json(response.recordset);
        console.log(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllContractsOfClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const pool = await connectDB();
        const response = await pool.request()
                            .input("clientId", sql.Int, clientId)
                            .query("EXEC sp_GetContractsByClient @clientId");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchContract = async (req, res) => {
    try {
        const contractId = req.params.id;
        const pool = await connectDB();
        const response = await pool.request()
                            .input("id", sql.Int, contractId)
                            .query("EXEC sp_GetContractById @id");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const createContract = async (req, res) => {
    try {
        const contractData = req.body;
        const { jobId, freelancerId, agreedAmount } = contractData;

        const pool = await connectDB();
        const response = await pool.request()
            .input("jobId", sql.Int, jobId)
            .input("freelancerId", sql.Int, freelancerId)
            .input("agreedAmount", sql.Decimal(10, 2), agreedAmount)
            .query("EXEC sp_CreateContract @jobId, @freelancerId, @agreedAmount");
        
        const id = response.recordset[0].id;

        res.status(200).json({
                message: "Contract created successfully",
                contractId: id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const updateContract = async (req, res) => {
    try {
        
        const contractId = parseInt(req.params.id);
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "No data given for updating" });
        }

        const pool = await connectDB();
        const request = pool.request();

        // Build the complete query
        const query = `UPDATE Contracts SET status = @status WHERE id = @id`;
        request.input('status', sql.NVarChar, status);
        request.input('id', sql.Int, contractId);

        // Execute the query
        await request.query(query);

        res.status(200).json({ message: "Contract updated successfully!" });
    } catch (err) {
        console.error("Error updating contract:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { fetchContract, fetchAllContractsOfClient, fetchAllContractsOfFreelancer, createContract, updateContract };