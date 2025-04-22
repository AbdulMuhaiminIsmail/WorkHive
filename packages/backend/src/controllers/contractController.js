const { sql, connectDB } = require('../config/db');

const fetchAllContractsOfFreelancer = async (req, res) => {
    try {
        const freelancerId = req.params.id;
        const query = `SELECT * FROM Contracts 
                       WHERE freelancer_id = @freelancerId`;

        const pool = await connectDB();
        const response = await pool.request()
                            .input("freelancerId", sql.Int, freelancerId)
                            .query(query);

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
        const query = `SELECT * FROM Contracts
                       WHERE job_id IN (
                            SELECT id FROM Jobs
                            WHERE client_id = @clientId
                       )`;

        const pool = await connectDB();
        const response = await pool.request()
                            .input("clientId", sql.Int, clientId)
                            .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchContract = async (req, res) => {
    try {
        const contractId = req.params.id;
        const query = "SELECT * FROM Contracts WHERE id = @id";

        const pool = await connectDB();
        const response = await pool.request()
                            .input("id", sql.Int, contractId)
                            .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const createContract = async (req, res) => {
    try {
        const query = `
            INSERT INTO Contracts (job_id, freelancer_id, agreed_amount)
            OUTPUT INSERTED.id
            VALUES (@jobId, @freelancerId, @agreedAmount);
        `;

        const contractData = req.body;
        const { jobId, freelancerId, agreedAmount } = contractData;

        const pool = await connectDB();
        const response = await pool.request()
            .input("jobId", sql.Int, jobId)
            .input("freelancerId", sql.Int, freelancerId)
            .input("agreedAmount", sql.Decimal(10, 2), agreedAmount)
            .query(query);
        
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
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({message: "No data given for updating"});
        }
        
        const pool = await connectDB();
        let query = "UPDATE Contracts SET ";
        let params = [];

        // Creating dynamic query for any number of params
        Object.keys(updates).forEach((key, index) => {
            query += `${key} = @param${index}, `;
            params.push({name: `param${index}`, type: sql.NVarChar(10), value: updates[key]});
        });

        // Remove the trailing comma and space
        query = query.slice(0, -2)

        query += " WHERE id = @id;";

        const request = pool.request();
        params.forEach(param => request.input(param.name, param.type, param.value));
        request.input("id", sql.Int, contractId);
        await request.query(query);

        res.status(200).json({message: "Contract updated successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { fetchContract, fetchAllContractsOfClient, fetchAllContractsOfFreelancer, createContract, updateContract };