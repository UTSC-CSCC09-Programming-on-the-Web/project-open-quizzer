const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.get("/google", async (req, res) => {
  
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code provided");
  }
   try {
    //Exchange authorization code for tokens
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", `${environment.apiBaseUrl}/auth/google`);
    params.append("grant_type", "authorization_code");

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token } = tokenResponse.data;
    //Verify the id_token and get user profile
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user_data = ticket.getPayload();
    const {given_name,family_name, email} = user_data;

    //Check if user exists in our db
    const userQuery = "SELECT * FROM users WHERE email = $1";
    let user = await db.query(userQuery, [email]);
    if (user.rows.length === 0) {
      const insertUserQuery = `
        INSERT INTO users (first_name, last_name, email, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, token_version
      `;
      user = await db.query(insertUserQuery, [given_name, family_name, email]);
    }

    const userData = user.rows[0];

    //Create JWT token for the app
    const appToken = jwt.sign(
      {
        userId: userData.id,
        email,
        tokenVersion: userData.token_version,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    //Redirect back to Angular app with token as query param
    res.redirect(`${environment.frontendBaseUrl}/login?token=${appToken}`);
  } 
  catch (error) {
    console.error("Google OAuth error:", error.response?.data || error.message);
    res.status(500).send("Google authentication failed");
  }
});

module.exports = router;