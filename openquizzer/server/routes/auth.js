const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

router.post(
  "/signup",
  //parsing the req body from the frontend 
  [
    body("firstName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters"),
    body("lastName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const checkUserQuery = "SELECT id FROM users WHERE email = $1";
      const existingUser = await db.query(checkUserQuery, [email]);

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const createUserQuery = `
      INSERT INTO users (first_name, last_name, email, hash_password, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, first_name, last_name, email, created_at
    `;
      const newUser = await db.query(createUserQuery, [
        firstName,
        lastName,
        email,
        hashedPassword,
      ]);

      const token = jwt.sign(
        { userId: newUser.rows[0].id, email: newUser.rows[0].email },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: newUser.rows[0].id,
            firstName: newUser.rows[0].first_name,
            lastName: newUser.rows[0].last_name,
            email: newUser.rows[0].email,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during signup",
      });
    }
  },
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const getUserQuery = "SELECT * FROM users WHERE email = $1";
      const user = await db.query(getUserQuery, [email]);

      if (user.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const userData = user.rows[0];

      const isPasswordValid = await bcrypt.compare(
        password,
        userData.hash_password,
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
          },
          token,
        },
      });
    } 
    catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  },
);

router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const getUserQuery =
      "SELECT id, first_name, last_name, email FROM users WHERE id = $1";
    const user = await db.query(getUserQuery, [decoded.userId]);

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.rows[0].id,
          firstName: user.rows[0].first_name,
          lastName: user.rows[0].last_name,
          email: user.rows[0].email,
        },
      },
    });
  } 
  catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
