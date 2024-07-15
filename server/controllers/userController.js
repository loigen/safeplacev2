const User = require("../schemas/User");
const { uploadProfilePicture } = require("../middlewares/multer");

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

exports.adminFunction = async (req, res) => {
  try {
    res.status(200).json({ message: "Admin function executed successfully" });
  } catch (error) {
    console.error("Error in adminFunction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, email, password } = req.body;

    let updatedUserData = { firstname, lastname, email, password };

    if (req.file) {
      updatedUserData.profilePicture = req.file.path; // Assuming the file path is saved in req.file.path
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
