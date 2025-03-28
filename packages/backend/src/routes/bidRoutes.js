const express = require("express");
const { fetchBid, placeBid, deleteBid, fetchAllBidsOnJob, fetchAllBidsByFreelancer } = require("../controllers/bidController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, placeBid);
router.get("/:id", verifyToken, fetchBid); // client can see cover letter and full application freelancer sent
router.delete("/:id", verifyToken, deleteBid);
router.get("/job/:id", verifyToken, fetchAllBidsOnJob); // client can see all applications on a job
router.get("/freelancer/:id", verifyToken, fetchAllBidsByFreelancer); // freelancer can see all applied jobs

module.exports = router;