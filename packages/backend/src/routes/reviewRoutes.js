const express = require("express");
const { postReview, fetchAllReviewsForFreelancer } = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, postReview);
router.get("/:id", verifyToken, fetchAllReviewsForFreelancer); 

module.exports = router;