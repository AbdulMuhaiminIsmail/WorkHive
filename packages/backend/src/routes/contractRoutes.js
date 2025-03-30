const express = require("express");
const { createContract, fetchContract, fetchAllContractsOfClient, fetchAllContractsOfFreelancer, updateContract } = require("../controllers/contractController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, createContract);
router.get("/:id", verifyToken, fetchContract); 
router.put("/:id", verifyToken, updateContract); // update the contract status (in progress, completed, cancelled)
router.get("/client/:id", verifyToken, fetchAllContractsOfClient);
router.get("/freelancer/:id", verifyToken, fetchAllContractsOfFreelancer);

module.exports = router;