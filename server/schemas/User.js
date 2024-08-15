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
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
});

userSchema.methods.getGravatarUrl = function () {
  return `https://res.cloudinary.com/dovlzzudf/image/upload/v1723689322/profile_pictures/66a1b5181567b42d75cc816b_profile.jpg`;
};

userSchema.pre("save", function (next) {
  if (!this.profilePicture) {
    this.profilePicture = this.getGravatarUrl();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
