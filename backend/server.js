require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const jobRoutes = require("./src/routes/jobRoutes");

const app = express();
app.use(express.json()); 
app.use(cors());

app.use("/", userRoutes);
app.use("/", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});