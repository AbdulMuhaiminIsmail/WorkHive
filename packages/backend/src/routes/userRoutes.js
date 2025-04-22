const express = require("express");
const { fetchClientByContractId, fetchAllUsers, fetchUser, updateUser, deleteUser} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/all", verifyToken, fetchAllUsers);
router.get("/fetchClientByContractId/:id", verifyToken, fetchClientByContractId)
router.get("/:id", verifyToken, fetchUser); // to display UI for Account INFO
router.put("/:id", verifyToken, updateUser); // Update user info
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
