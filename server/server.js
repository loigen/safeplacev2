require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://safeplacev2-1tge.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  return next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

connectDB();

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URI,
  collectionName: "sessions",
  ttl: 7 * 24 * 60 * 60, // Session TTL in seconds (optional)
});

app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie TTL (optional)
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust 'sameSite' based on environment
    },
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
