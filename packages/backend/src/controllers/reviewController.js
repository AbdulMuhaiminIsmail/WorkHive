const { sql, connectDB } = require("../config/db")

const fetchAllReviewsForFreelancer = async (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const query = `
            SELECT * FROM Reviews WHERE contract_id IN (
                SELECT id FROM Contracts WHERE freelancer_id = @id AND status = 'Completed'
            );
        `;

        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, freelancerId)
                        .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const postReview = async (req, res) => {
    try {
        const query = `
            INSERT INTO Reviews (contract_id, rating, feedback) 
            VALUES (@contractId, @rating, @feedback);
        `;

        const reviewData = req.body;
        
        const pool = await connectDB();
        const { contractId, rating, feedback } = reviewData;

        await pool.request()
            .input("contractId", sql.Int, contractId)
            .input("rating", sql.Int, rating)
            .input("feedback", sql.NVarChar(sql.MAX), feedback)
            .query(query);

        res.status(200).json({message: "Review posted successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { postReview, fetchAllReviewsForFreelancer };