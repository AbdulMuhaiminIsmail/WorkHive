const express = require("express");
const { postReview, fetchAllReviewsForFreelancer } = require("../controllers/reviewController");

const router = express.Router();

router.post("/reviews", postReview);
router.get("/reviews/:id", fetchAllReviewsForFreelancer); 

module.exports = router;