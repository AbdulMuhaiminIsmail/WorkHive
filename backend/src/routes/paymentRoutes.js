const express = require("express");
const { initiatePayment, fetchPayment, updatePayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/payments", initiatePayment);
router.get("/payments/:id", fetchPayment); 
router.put("/payments/:id", updatePayment); // update the payment status (pending, paid)

module.exports = router;