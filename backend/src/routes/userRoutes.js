const express = require("express");
const { fetchUsers, fetchUser, registerUser, updateUser, deleteUser} = require("../controllers/userController");

const router = express.Router();

router.get("/users/all", fetchUsers);
router.get("/users/:id", fetchUser);
router.post("/users", registerUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;



