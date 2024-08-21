const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: { type: String, default: "active" }, // New field
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  birthdate: { type: Date, required: true }, // Set required to true
});

userSchema.methods.getGravatarUrl = function () {
  return `https://res.cloudinary.com/dovlzzudf/image/upload/v1723710022/profile_pictures/66a367e4a828e02e834561e0_profile.jpg`;
};

userSchema.pre("save", function (next) {
  if (!this.profilePicture) {
    this.profilePicture = this.getGravatarUrl();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
