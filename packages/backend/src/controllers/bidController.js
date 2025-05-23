const { sql, connectDB } = require('../config/db');

const placeBid = async (req, res) => {
    try {
        const bidData = req.body;
        const { jobId, freelancerId, bidAmount, coverLetter } = bidData;

        const pool = await connectDB();
        await pool.request()
            .input("jobId", sql.Int, jobId)
            .input("freelancerId", sql.Int, freelancerId)
            .input("bidAmount", sql.Decimal(10, 2), bidAmount)
            .input("coverLetter", sql.NVarChar(sql.MAX), coverLetter)
            .query("EXEC sp_PlaceBid @jobId, @freelancerId, @bidAmount, @coverLetter");

        res.status(200).json({message: "Bid placed successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchBid = async (req, res) => {
    try {
        const bidId = parseInt(req.params.id);

        const pool = await connectDB();
        const response = await pool.request()
                            .input("id", sql.Int, bidId)
                            .query("EXEC sp_GetBidById @id");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deleteBid = async (req, res) => {
    try {
        const bidId = parseInt(req.params.id);

        const pool = await connectDB();
        await pool.request()
            .input("id", sql.Int, bidId)
            .query("EXEC sp_DeleteBid @id");

        res.status(200).json({message: "Bid deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllBidsByFreelancer = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);

        const pool = await connectDB();
        const response = await pool.request()
                            .input("freelancerId", sql.Int, freelancerId)
                            .query("EXEC sp_GetBidsByFreelancer @freelancerId");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const fetchAllBidsOnJob = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);

        const pool = await connectDB();
        const response = await pool.request()
                            .input("jobId", sql.Int, jobId)
                            .query("EXEC sp_GetBidsByJob @jobId");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { placeBid, fetchBid, deleteBid, fetchAllBidsByFreelancer, fetchAllBidsOnJob };