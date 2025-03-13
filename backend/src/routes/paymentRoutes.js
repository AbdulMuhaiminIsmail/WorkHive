const express = require("express");
const { initiatePayment, fetchPayment, updatePayment } = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, initiatePayment);
router.get("/:id", verifyToken, fetchPayment); 
router.put("/:id", verifyToken, updatePayment); // update the payment status (pending, paid)

module.exports = router;