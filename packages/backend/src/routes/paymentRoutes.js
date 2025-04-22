const express = require("express");
const { initiatePayment, fetchAllPaymentsOfFreelancer, updatePayment, fetchAllPaymentsOfClient } = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, initiatePayment);
router.get("/client/:id", verifyToken, fetchAllPaymentsOfClient); 
router.get("/freelancer/:id", verifyToken, fetchAllPaymentsOfFreelancer);
router.put("/:id", verifyToken, updatePayment); // update the payment status (pending, paid)

module.exports = router;