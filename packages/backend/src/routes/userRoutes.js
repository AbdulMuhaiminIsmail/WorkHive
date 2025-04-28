const express = require("express");
const { fetchClientByContractId, fetchAllUsers, fetchUser, updateUser, deleteUser, fetchFreelancerJobsCount, fetchClientJobsCount, fetchAvgRating, fetchListedSkills } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", verifyToken, fetchUser); // to display UI for Account INFO
router.put("/:id", verifyToken, updateUser); // Update user info
router.delete("/:id", verifyToken, deleteUser);
router.get("/all", verifyToken, fetchAllUsers);
router.get("/freelancerJobsCount/:id", verifyToken, fetchFreelancerJobsCount);
router.get("/clientJobsCount/:id", verifyToken, fetchClientJobsCount);
router.get("/avgRating/:id", verifyToken, fetchAvgRating);
router.get("/listedSkills/:id", verifyToken, fetchListedSkills);
router.get("/fetchClientByContractId/:id", verifyToken, fetchClientByContractId)

module.exports = router;
