const User = require("../schemas/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id contains the logged-in user's ID
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
      res.status(200).json({ message: 'Admin function executed successfully' });
  } catch (error) {
      console.error('Error in adminFunction:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
