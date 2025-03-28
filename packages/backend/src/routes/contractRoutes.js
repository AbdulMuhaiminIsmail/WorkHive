const express = require("express");
const { createContract, fetchContract, updateContract } = require("../controllers/ContractController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, createContract);
router.get("/:id", verifyToken, fetchContract); 
router.put("/:id", verifyToken, updateContract); // update the contract status (in progress, completed, cancelled)

module.exports = router;