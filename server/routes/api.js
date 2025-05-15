const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const config = require("../jwt_secret/config"); 

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    if (user.role === "restaurant" && user.status === "in validation") {
      return res.status(403).json({
        error: "Your account is under validation. Please wait for approval.",
      });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.secret,
      { expiresIn: 86400 }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
