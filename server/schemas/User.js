const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
});

// Method to generate Gravatar URL
userSchema.methods.getGravatarUrl = function () {
  const hash = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

// Pre-save hook to set the avatar if not provided
userSchema.pre("save", function (next) {
  if (!this.avatar) {
    this.avatar = this.getGravatarUrl();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
