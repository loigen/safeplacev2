const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const checkAdmin = require("../middlewares/checkAdmin");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/profile", authenticateToken, userController.getProfile);

router.put("/updateprofile", authenticateToken, userController.updateProfile); // New route for updating profile

router.post(
  "/admin",
  [authenticateToken, checkAdmin],
  userController.adminFunction
);

router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
