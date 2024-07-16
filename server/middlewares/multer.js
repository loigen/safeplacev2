const multer = require("multer");
const path = require("path");

// Multer configuration for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/profile-pictures"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${req.user.id}_${Date.now()}${ext}`; // Unique file name
    cb(null, fileName);
  },
});

const uploadProfilePicture = multer({ storage: profilePictureStorage });

module.exports = {
  uploadProfilePicture,
};
