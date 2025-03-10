const express = require("express");
const { fetchBid, createBid, deleteBid, fetchAllBidsOnJob, fetchAllBidsByFreelancer } = require("../controllers/bidController");

const router = express.Router();

router.post("/bids", createBid);
router.get("/bids/:id", fetchBid); // see cover letter and full application freelancer sent
router.delete("/bids/:id", deleteBid);
router.get("/bids/job/:id", fetchAllBidsOnJob); // client can see all applications on a job
router.get("/bids/freelancer/:id", fetchAllBidsByFreelancer); // freelancer can see all applied jobs

module.exports = router;