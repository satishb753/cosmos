const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const { verify } = require("crypto");
const { fileURLToPath } = require("url");
const cookieSession = require("cookie-session");
const mysql = require("mysql2")

const { check, body } = require("express-validator");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const certificate = fs.readFileSync("./cert.pem");
const privateKey = fs.readFileSync("./key.pem");
const PORT = 8443;
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Load the session from the cookie
passport.deserializeUser((id, done) => {
  // User.findById(id).then( user => {
  //   done((null, user));
  // })
  done(null, id);
});

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

function checkLoggedIn(req, res, next) {
  console.log("Current user is: ", req.user);
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }
  next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google Profile", profile);
  done(null, profile);
}

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google called back!");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.status(200).json({
    message: "You are past the Oauth client! Congrats!",
  });
});

app.get("/failure", (req, res) => {
  return res.send("Failed to log in!");
});

app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  // res.send(`Performance example: ${process.pid}`);
  res.sendFile("/public/index.html", options, (err) => {
    if (err) next(err);
    else console.log("Sent: index.html");
  });
});

app.post(
  "/validate",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid string")
      .custom((value, { req }) => {
        if (value === "test@test.com") {
          console.log(req.body);
          throw new Error("This value if forbidden");
        }
        // console.log(req);
        return true;
      }),
    body("password").isLength({ min: 5 }).isAlphanumeric(),
  ],
  (req, res) => {
    console.log(req.body.password);
    console.log("It is a valid email");
    res.status(200).json({ message: "You have recieved the data." });
  }
);

app.get("/git", (req, res) => {
  res.json({ message: "This is coming from Main branch" });
});

app.use("/api/auth/", authRoutes);

https
  .createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app
  )
  .listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
  });
