const { sql, connectDB } = require("../config/db")

const fetchSkills = async (req, res) => {
    try {
        const pool = await connectDB();
        const response = await pool.request()
            .query("EXEC sp_FetchSkills");

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const addUserSkills = async (req, res) => {
    const { userId, skillIds } = req.body;

    if (!userId || !skillIds || !Array.isArray(skillIds)) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        if (skillIds.length > 0) {
            const pool = await connectDB();

            for (const skillId of skillIds) {
                await pool.request()
                    .input("user_id", sql.Int, userId)
                    .input("skill_id", sql.Int, skillId)
                    .query("INSERT INTO User_Skills (user_id, skill_id) VALUES (@user_id, @skill_id)");
            }            

        }

        res.status(200).json({ message: 'Skills updated successfully' });
    } catch (error) {
        console.error('Error updating user skills:', error);
        res.status(500).json({ message: 'Failed to update skills' });
    }
};

module.exports = { fetchSkills, addUserSkills };