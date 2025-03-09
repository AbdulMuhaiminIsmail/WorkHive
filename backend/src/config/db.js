require("dotenv").config({path: __dirname + "/../../.env"});
const sql = require("mssql");

let poolPromise;

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true 
    }
};

async function connectDB() {
    try {
        if (!poolPromise) {
            poolPromise = await sql.connect(config);
            console.log("✅ Connected to MSSQL successfully!");
        }
        return poolPromise;
    } catch (err) {
        console.error("❌ Database connection failed:", err);
    }
}

module.exports = { sql, connectDB };

