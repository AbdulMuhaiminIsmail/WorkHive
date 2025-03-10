const express = require("express");
const { fetchAllUsers, fetchUser, registerUser, updateUser, deleteUser} = require("../controllers/userController");

const router = express.Router();

router.get("/users/all", fetchAllUsers);
router.get("/users/:id", fetchUser); // to display UI for Account INFO
router.post("/users", registerUser);
router.put("/users/:id", updateUser); // Update user info
router.delete("/users/:id", deleteUser);

module.exports = router;
