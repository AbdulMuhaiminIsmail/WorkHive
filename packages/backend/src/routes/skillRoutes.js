const express = require("express");
const { fetchSkills, addUserSkills } = require("../controllers/skillController");

const router = express.Router();

router.get("/", fetchSkills); 
router.post("/", addUserSkills); 

module.exports = router;