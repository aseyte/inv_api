const router = require("express").Router();
const User = require("../Models/User");
const brcypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ajlao.zcmc@gmail.com",
    pass: "frrfgzfptluztdzy",
  },
});

let randomString = randomstring.generate({
  length: 48,
  charset: "alphabetic",
});

router.post("/register", async (req, res) => {
  try {
    const hash = await brcypt.hash(req.body.password, saltRounds);

    const user = {
      username: req.body.username,
      password: hash,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    User.create(user, (err, result) => {
      if (err) {
        err.message.includes("email")
          ? res.send({ emailErr: "Email is already in use" })
          : res.send({ usernameErr: "Username is already in use" });
      } else {
        const mailOptions = {
          from: "ajlao.zcmc@gmail.com",
          to: req.body.email,
          subject: "Account verification",
          html:
            '<p>Click the link below to activate your account: <br /> <a href="https://zcmc.vercel.app/account/verification/' +
            randomString +
            "/" +
            '">Verify Account.</a></p>',
        };

        transporter.sendMail(mailOptions).then((dataEmail) => {
          if (dataEmail) {
            res.send({ ok: "Successfully registered" });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username });

  try {
    if (!user) {
      res.send({
        error: "There's no such account",
      });
    } else {
      brcypt.compare(password, user.password, (err, result) => {
        if (result) {
          req.session.user = {
            loggedIn: true,
            _id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            verified: user.verified,
            userType: user.userType,
          };

          res.send(req.session.user);
        } else {
          res.send({
            error: "Incorrect password",
          });
        }
      });
    }
  } catch (error) {
    res.send({
      err: "An error occured",
    });
    console.log(error);
  }
});

router.get("/login/", (req, res) => {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.send({ loggedIn: false });
  }
});

router.get("/logout/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("userId").send("cleared cookie");
    }
  });
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await User.findById({ _id: id });

    if (result) {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/activate/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await User.findByIdAndUpdate(
      { _id: id },
      { verified: true }
    );

    if (result) {
      req.session.user = {
        loggedIn: true,
        _id: result._id,
        username: result.username,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        verified: true,
        otp: result.otp,
      };

      res.send(req.session.user);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
