require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const authRoutes = require("./src/routes/authRoutes");
const bidRoutes = require("./src/routes/bidRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const contractRoutes = require("./src/routes/contractRoutes");
const skillRoutes = require("./src/routes/skillRoutes");

const app = express();
app.use(express.json()); 
app.use(cors());

app.use("/users", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/auth", authRoutes);
app.use("/bids", bidRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payments", paymentRoutes);
app.use("/contracts", contractRoutes);
app.use("/skills", skillRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});