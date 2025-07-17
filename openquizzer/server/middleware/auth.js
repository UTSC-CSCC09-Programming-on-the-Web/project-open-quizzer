const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const getUserQuery =
      "SELECT id, first_name, last_name, email FROM users WHERE id = $1";
    const user = await db.query(getUserQuery, [decoded.userId]);

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = {
      id: user.rows[0].id,
      firstName: user.rows[0].first_name,
      lastName: user.rows[0].last_name,
      email: user.rows[0].email,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

const checkSubscription = async (req, res, next) => {
  try {
    const subscriptionQuery = `
      SELECT status FROM subscriptions 
      WHERE user_id = $1 AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const subscription = await db.query(subscriptionQuery, [req.user.id]);

    if (subscription.rows.length === 0) {
      return res.status(402).json({
        success: false,
        message: "Payment required. Please subscribe to access this feature.",
        requiresPayment: true,
      });
    }

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking subscription status.",
    });
  }
};

module.exports = {
  authenticateToken,
  checkSubscription,
};
