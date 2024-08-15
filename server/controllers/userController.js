const User = require("../schemas/User");
const cloudinary = require("../config/cloudinary");

// Method to get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

// Method for admin function
exports.adminFunction = async (req, res) => {
  try {
    res.status(200).json({ message: "Admin function executed successfully" });
  } catch (error) {
    console.error("Error in adminFunction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Method to update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, email, password } = req.body;

    let updatedUserData = { firstname, lastname, email };

    if (password) {
      updatedUserData.password = password;
    }

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pictures",
          public_id: `${userId}_profile`,
        });

        updatedUserData.profilePicture = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading file to Cloudinary:", uploadError);
        return res.status(500).json({ error: "Error uploading file" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Error updating user profile" });
  }
};

// Method to handle receipt upload
exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "receipts",
      public_id: `${Date.now()}_${req.file.originalname}`,
    });

    res.status(200).json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error uploading receipt to Cloudinary:", error);
    res.status(500).json({ error: "Error uploading receipt" });
  }
};

// Method to handle blog photo upload
exports.uploadBlogPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_photos",
      public_id: `${Date.now()}_${req.file.originalname}`,
    });

    res.status(200).json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error uploading blog photo to Cloudinary:", error);
    res.status(500).json({ error: "Error uploading blog photo" });
  }
};
