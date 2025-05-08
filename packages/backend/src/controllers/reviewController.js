const { sql, connectDB } = require("../config/db")

const fetchAllReviewsForFreelancer = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const pool = await connectDB();
        
        const response = await pool.request()
            .input("id", sql.Int, freelancerId)
            .execute("sp_FetchReviewsForFreelancer");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const postReview = async (req, res) => {
    try {
        const reviewData = req.body;
        const pool = await connectDB();
        
        await pool.request()
            .input("contractId", sql.Int, reviewData.contractId)
            .input("rating", sql.Int, reviewData.rating)
            .input("feedback", sql.NVarChar(sql.MAX), reviewData.feedback)
            .execute("sp_PostReview");

        res.status(200).json({message: "Review posted successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { postReview, fetchAllReviewsForFreelancer };