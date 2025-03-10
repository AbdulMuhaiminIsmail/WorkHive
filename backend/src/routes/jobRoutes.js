const express = require("express");
const { fetchAllJobs, fetchJob, createJob, updateJob, deleteJob } = require("../controllers/jobController");

const router = express.Router();

router.get("/jobs", fetchAllJobs); // display all jobs
router.post("/jobs", createJob);
router.get("/jobs/:id", fetchJob); // to see full job info 
router.put("/jobs/:id", updateJob); // to update requirements
router.delete("/jobs/:id", deleteJob);

module.exports = router;