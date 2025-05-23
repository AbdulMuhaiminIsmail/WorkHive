const express = require("express");
const { fetchJobsByIds, fetchAllJobsByClient, fetchAllJobs, fetchJob, createJob, updateJob, deleteJob } = require("../controllers/jobController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/jobsByClient/:id", verifyToken, fetchAllJobsByClient); // display all jobs by client
router.get("/", verifyToken, fetchAllJobs); // display all jobs
router.post("/byids", verifyToken, fetchJobsByIds); // display all jobs by id
router.post("/", verifyToken, createJob);
router.get("/:id", verifyToken, fetchJob); // to see full job info 
router.put("/:id", verifyToken, updateJob); // to update requirements
router.delete("/:id", verifyToken, deleteJob);

module.exports = router;