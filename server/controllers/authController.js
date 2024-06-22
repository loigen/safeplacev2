const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas/User");
const validator = require("validator");

const JWT_SECRET = process.env.JWT_SECRET;

const validateSignupData = (firstname, lastname, email, password, repeatPassword) => {
  if (!firstname || !lastname || !email || !password || !repeatPassword) {
    return "All fields are required";
  }
  if (password !== repeatPassword) {
    return "Passwords do not match";
  }
  if (!validator.isEmail(email)) {
    return "Invalid email";
  }
  return null;
};

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password, repeatPassword } = req.body;
  const errorMessage = validateSignupData(firstname, lastname, email, password, repeatPassword);

  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'jebBohol@gmail.com' ? 'admin' : 'user';
    const user = new User({ firstname, lastname, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    req.session.token = token; // Store token in session

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};
