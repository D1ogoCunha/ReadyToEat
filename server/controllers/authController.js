const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../jwt_secret/config");
const bcrypt = require("bcryptjs");

let authController = {};

authController.login = function (req, res, next) {
  res.render("login");
};

authController.submittedLogin = function (req, res, next) {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;
  const fromRest = req.body.rest ? req.body.rest : undefined;

  User.findOne({ email: emailInput })
    .then(function (user) {
      if (!user) {
        console.log("User not found:", emailInput);
        if (fromRest) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        return res.render("login", {
          errorMessage: "Invalid email or password.",
        });
      }

      bcrypt.compare(passwordInput, user.password).then(function (result) {
        if (!result) {
          console.log("Wrong password:", emailInput);
          if (fromRest) {
            return res
              .status(401)
              .json({ error: "Invalid email or password." });
          }
          return res.render("login", {
            errorMessage: "Invalid email or password.",
          });
        }

        if (user.role === "restaurant" && user.status === "in validation") {
          console.log("Restaurant not validated:", emailInput);
          if (fromRest) {
            return res.status(403).json({
              error:
                "Your account is under validation. Please wait for approval.",
            });
          }
          return res.render("login", {
            errorMessage:
              "Your account is under validation. Please wait for approval.",
          });
        }

        const authToken = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          config.secret,
          { expiresIn: 86400 }
        );
        console.log("Generated Token:", authToken);
        res.cookie("auth-token", authToken, {
          maxAge: 86400000,
          httpOnly: true,
        });

        if (fromRest) {
          return res.json({
            token: authToken,
            role: user.role,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              _id: user._id,
            },
          });
        }

        if (user.role === "restaurant") {
          res.redirect("/index");
        } else if (user.role === "customer") {
          res.redirect("/index");
        } else {
          res.redirect("/admin");
        }
      });
    })
    .catch(function (err) {
      if (fromRest) {
        return res.status(500).json({ error: "Internal server error." });
      }
      next(err);
    });
};

authController.createLogin = function (req, res, next) {
  res.render("register");
};

authController.createLoginSubmitted = function (req, res, next) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hashedPassword;

  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    nif: req.body.nif,
    password: hashedPassword,
    role: req.body.role,
  };

  if (req.body.role === "restaurant") {
    userData.restaurantName = req.body.restaurantName;
    userData.address = req.body.address;
    userData.phone = req.body.phone;
    userData.pricePerPerson = req.body.pricePerPerson;
    userData.image = req.file ? `/uploads/${req.file.filename}` : null;
  }

  User.create(userData)
    .then(function () {
      res.redirect("/login");
    })
    .catch(function (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        return res.render("register", {
          errorMessage:
            "This email is already in use. Please use a different email.",
        });
      }
      next(err);
    });
};

authController.verifyLoginUser = function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies["auth-token"]) {
    token = req.cookies["auth-token"];
  }

  const handleUnauthorized = (message = "Unauthorized. Please log in.") => {
    if (req.accepts("html") && !req.xhr) {
      return res.redirect("/login");
    } else {
      return res.status(401).json({ message });
    }
  };

  if (token) {
    jwt.verify(token, config.secret, async function (err, decoded) {
      if (err) {
        console.log("Error verifying token:", err);
        return handleUnauthorized("Invalid or expired token.");
      }
      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return handleUnauthorized("User not found for the provided token.");
        }
        req.user = user;
        next();
      } catch (error) {
        console.error("Server error during token verification:", error);
        if (req.accepts("html") && !req.xhr) {
          return res.redirect("/login");
        } else {
          return res
            .status(500)
            .json({ message: "Internal server error during authentication." });
        }
      }
    });
  } else {
    return handleUnauthorized("No authentication token provided.");
  }
};

authController.logout = function (req, res, next) {
  // res.clearCookie("auth-token"); // No longer using cookies for auth token
  // For stateless JWTs, server-side logout mainly means the client discards the token.
  // If you had a token blacklist, you'd add the token to it here.

  // If the request is from an API client, just send a success response.
  // If it's a browser navigating, then redirect.
  if (req.accepts("html") && !req.xhr) {
    res.redirect("/login");
  } else {
    res.status(200).json({ message: "Logged out successfully." });
  }
};

authController.verifyAdmin = function (req, res, next) {
  authController.verifyLoginUser(req, res, function () {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    console.log("Access denied. User is not an admin:", req.user.email);
    res.status(403).render("error", {
      message: "Access denied. Admins only.",
      error: { status: 403, stack: "" },
    });
  });
};
module.exports = authController;
