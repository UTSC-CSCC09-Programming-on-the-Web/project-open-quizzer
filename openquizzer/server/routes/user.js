const express = require("express");
const router = express.Router();
const { authenticateToken, checkSubscription } = require("../middleware/auth");
const db = require("../config/db");

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const updateQuery = `
      UPDATE users 
      SET first_name = $1, last_name = $2 
      WHERE id = $3 
      RETURNING id, first_name, last_name, email
    `;
    const updatedUser = await db.query(updateQuery, [
      firstName,
      lastName,
      req.user.id,
    ]);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.rows[0].id,
          firstName: updatedUser.rows[0].first_name,
          lastName: updatedUser.rows[0].last_name,
          email: updatedUser.rows[0].email,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during profile update",
    });
  }
});

router.get("/subscription", authenticateToken, async (req, res) => {
  try {
    const subscriptionQuery = `
      SELECT * FROM subscriptions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const subscription = await db.query(subscriptionQuery, [req.user.id]);

    res.json({
      success: true,
      data: {
        subscription: subscription.rows[0] || null,
      },
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
