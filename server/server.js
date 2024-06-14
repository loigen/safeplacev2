const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const validator = require("validator");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./schemas/User");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const PORT = 5000;
const DB_URI = "mongodb+srv://lariosaloigen5:loigenarnado123@tmsdb.gspnrds.mongodb.net/";
const JWT_SECRET = "NegioLasoiral01014001";

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

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

const sessionStore = MongoStore.create({
  mongoUrl: DB_URI,
  collectionName: 'sessions',
  ttl: 7 * 24 * 60 * 60, // Session TTL in seconds (optional)
});

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie TTL (optional)
    secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    sameSite: 'none', // Set to 'none' if using CORS from different domains
  },
}));

app.post("/signup", async (req, res) => {
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
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/login", async (req, res) => {
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
});

const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    console.log('Session token:', token); // Check if session token is received
  
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Token verification failed:', err);
        return res.sendStatus(403); // Forbidden
      }
      console.log('User authenticated:', user);
      req.user = user;
      next();
    });
  };
  


app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // Retrieve user info without password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user }); // Return user info
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
