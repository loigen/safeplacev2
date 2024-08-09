const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);

module.exports = router;
