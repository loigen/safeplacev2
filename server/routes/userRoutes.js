const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const checkAdmin = require("../middlewares/checkAdmin");
const authenticateToken = require("../middlewares/authenticateToken");
const {
  uploadProfilePicture,
  uploadBlogPhoto,
} = require("../middlewares/multer");

// User profile routes
router.get("/profile", authenticateToken, userController.getProfile);

router.put(
  "/updateprofile",
  [authenticateToken, uploadProfilePicture.single("profile_picture")],
  userController.updateProfile
);

router.post(
  "/uploadblogphoto",
  [authenticateToken, uploadBlogPhoto.single("blog_photo")],
  userController.uploadBlogPhoto
);

// Admin routes
router.post(
  "/admin",
  [authenticateToken, checkAdmin],
  userController.adminFunction
);

router.get("/countNonAdminUsers", userController.countNonAdminUsers);

// Password management routes
router.post(
  "/changepassword",
  authenticateToken,
  userController.changePassword
);

// New routes
router.get("/users", [authenticateToken], userController.getAllUsers); // Fetch all users
router.patch("/users/:id/block", [authenticateToken], userController.blockUser); // Block user
router.patch(
  "/users/:id/unblock",
  [authenticateToken],
  userController.unblockUser
); // Unblock user

// Logout route
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
