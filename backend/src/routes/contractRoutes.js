const express = require("express");
const { createContract, fetchContract, updateContract } = require("../controllers/ContractController");

const router = express.Router();

router.post("/contracts", createContract);
router.get("/contracts/:id", fetchContract); 
router.put("/contracts/:id", updateContract); // update the contract status (in progress, completed, cancelled)

module.exports = router;