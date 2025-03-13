const { sql, connectDB } = require('../config/db');

const placeBid = async (req, res) => {
    try {
        const query = `
            INSERT INTO Bids (job_id, freelancer_id, bid_amount, cover_letter)
            VALUES (@jobId, @freelancerId, @bidAmount, @coverLetter);
        `;

        const bidData = req.body;
        const { jobId, freelancerId, bidAmount, coverLetter } = bidData;

        const pool = await connectDB();
        await pool.request()
            .input("jobId", sql.Int, jobId)
            .input("freelancerId", sql.Int, freelancerId)
            .input("bidAmount", sql.Decimal(10, 2), bidAmount)
            .input("coverLetter", sql.NVarChar(sql.MAX), coverLetter)
            .query(query);

        res.status(200).json({message: "Bid placed successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchBid = async (req, res) => {
    try {
        const bidId = req.params.id;
        const query = "SELECT * FROM Bids WHERE id = @id";

        const pool = await connectDB();
        const response = await pool.request()
                            .input("id", sql.Int, bidId)
                            .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deleteBid = async (req, res) => {
    try {
        const bidId = req.params.id;
        const query = "DELETE FROM Bids WHERE id = @id";

        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, bidId)
            .query(query);

        res.status(200).json({message: "Bid deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllBidsByFreelancer = async (req, res) => {
    try {
        const freelancerId = req.params.id;
        const query = "SELECT * FROM Bids WHERE freelancer_id = @freelancerId";

        const pool = await connectDB();
        const response = await pool.request()
                            .input("freelancerId", sql.Int, freelancerId)
                            .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllBidsOnJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const query = "SELECT * FROM Bids WHERE job_id = @jobId";

        const pool = await connectDB();
        const response = await pool.request()
                            .input("jobId", sql.Int, jobId)
                            .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { placeBid, fetchBid, deleteBid, fetchAllBidsByFreelancer, fetchAllBidsOnJob };