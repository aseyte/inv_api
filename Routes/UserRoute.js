const router = require("express").Router();
const User = require("../Models/User");
const brcypt = require("bcrypt");
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const hash = await brcypt.hash(req.body.password, saltRounds);

    const userbyname = await User.findOne({ username: req.body.username });


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
          res.send({ ok: result });
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

module.exports = router;
