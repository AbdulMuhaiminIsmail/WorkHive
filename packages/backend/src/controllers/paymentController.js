const { NVarChar } = require("mssql");
const { sql, connectDB } = require("../config/db");

const fetchAllPaymentsOfFreelancer = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const pool = await connectDB();
        const response = await pool.request()
                        .input("freelancerId", sql.Int, freelancerId)
                        .query("EXEC sp_GetPaymentsByFreelancer @freelancerId");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllPaymentsOfClient = async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        const pool = await connectDB();
        const response = await pool.request()
                        .input("clientId", sql.Int, clientId)
                        .query("EXEC sp_GetPaymentsByClient @clientId");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const initiatePayment = async (req, res) => {
    try {
        const paymentData = req.body;
        const pool = await connectDB();
        const { contractId, amount } = paymentData;

        await pool.request()
            .input("contractId", sql.Int, contractId)
            .input("amount", sql.Decimal(10, 2), amount)
            .query("EXEC sp_CreatePayment @contractId, @amount");

        res.status(200).json({message: "Payment created successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const updatePayment = async (req, res) => {
    try {
        const contractId = parseInt(req.params.id);
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({message: "No data given for updating"});
        }
        
        const pool = await connectDB();
        const request = pool.request();

        await request
            .input("id", sql.Int, contractId)
            .input("status", sql.NVarChar, status)
            .query("UPDATE Payments SET status = @status WHERE id = @id");

        res.status(200).json({message: "Payment updated successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { initiatePayment, fetchAllPaymentsOfClient, fetchAllPaymentsOfFreelancer, updatePayment };