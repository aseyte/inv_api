const router = require("express").Router();
const User = require("../Models/User");
const brcypt = require("bcrypt");
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const hash = await brcypt.hash(req.body.password, saltRounds);

    if (hash) {
      const user = {
        username: req.body.username,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      };
      User.create(user, (err, result) => {
        if (err) {
          res.send({ error: "Username is already in use" });
        } else {
          res.send({ ok: result });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/login", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
