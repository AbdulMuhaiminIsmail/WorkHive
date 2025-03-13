const { NVarChar } = require("mssql");
const { sql, connectDB } = require("../config/db")

const fetchPayment = async (req, res) => {
    try {
        const paymentId = parseInt(req.params.id);
        const query = "SELECT * FROM Payments WHERE id = @id";

        const pool = await connectDB();
        const response = await pool.request()
                        .input("id", sql.Int, paymentId)
                        .query(query);

        res.status(200).json(response.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const initiatePayment = async (req, res) => {
    try {
        const query = `
            INSERT INTO Payments (contract_id, amount) 
            VALUES (@contractId, @amount);
        `;

        const paymentData = req.body;
        
        const pool = await connectDB();
        const { contractId, amount } = paymentData;

        await pool.request()
            .input("contractId", sql.Int, contractId)
            .input("amount", sql.Decimal(10, 2), amount)
            .query(query);

        res.status(200).json({message: "Payment created successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const updatePayment = async (req, res) => {
    try {
        const paymentId = parseInt(req.params.id);
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({message: "No data given for updating"});
        }
        
        const pool = await connectDB();
        let query = "UPDATE Payments SET ";
        let params = [];

        // Creating dynamic query for any number of params with different data types
        Object.keys(updates).forEach((key, index) => {
            query += `${key} = @param${index}, `;
            let type;
            if (key == "status") {
                type = NVarChar(8);
            }
            params.push({name: `param${index}`, type: type, value: updates[key]});
        });

        // Remove the trailing comma and space
        query = query.slice(0, -2)

        query += " WHERE id = @id;";

        const request = pool.request();
        params.forEach(param => request.input(param.name, param.type, param.value));
        request.input("id", sql.Int, paymentId);
        await request.query(query);

        res.status(200).json({message: "Payment updated successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = { initiatePayment, fetchPayment, updatePayment };