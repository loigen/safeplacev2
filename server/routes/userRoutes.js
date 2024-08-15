const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const checkAdmin = require("../middlewares/checkAdmin");
const authenticateToken = require("../middlewares/authenticateToken");
const {
  uploadProfilePicture,
  uploadReceipt,
  uploadBlogPhoto,
} = require("../middlewares/multer");

router.get("/profile", authenticateToken, userController.getProfile);

router.put(
  "/updateprofile",
  [authenticateToken, uploadProfilePicture.single("profile_picture")],
  userController.updateProfile
);

router.post(
  "/uploadreceipt",
  [authenticateToken, uploadReceipt.single("receipt")],
  userController.uploadReceipt
);

router.post(
  "/uploadblogphoto",
  [authenticateToken, uploadBlogPhoto.single("blog_photo")],
  userController.uploadBlogPhoto
);

router.post(
  "/admin",
  [authenticateToken, checkAdmin],
  userController.adminFunction
);

router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
