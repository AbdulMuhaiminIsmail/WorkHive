const { sql, connectDB } = require("../config/db")

const fetchAllReviewsForFreelancer = async (req, res) => {
    const transaction = new sql.Transaction();
    try {
        const freelancerId = parseInt(req.params.id);
        const pool = await connectDB();
        
        await transaction.begin(pool);
        
        const response = await transaction.request()
            .input("id", sql.Int, freelancerId)
            .execute("sp_FetchReviewsForFreelancer");

        await transaction.commit();
        res.status(200).json(response.recordset);
    } catch (err) {
        if (transaction._activeRequest) {
            await transaction.rollback();
        }
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const postReview = async (req, res) => {
    const transaction = new sql.Transaction();
    try {
        const reviewData = req.body;
        const pool = await connectDB();
        
        await transaction.begin(pool);
        
        await transaction.request()
            .input("contractId", sql.Int, reviewData.contractId)
            .input("rating", sql.Int, reviewData.rating)
            .input("feedback", sql.NVarChar(sql.MAX), reviewData.feedback)
            .execute("sp_PostReview");

        await transaction.commit();
        res.status(200).json({message: "Review posted successfully!"});
    } catch (err) {
        if (transaction._activeRequest) {
            await transaction.rollback();
        }
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { postReview, fetchAllReviewsForFreelancer };