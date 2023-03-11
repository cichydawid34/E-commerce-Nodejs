import express from "express";
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
import bcrypt from "bcrypt";
const { body, validationResult } = require("express-validator");
//POST Add User
router.post(
  "/register",
  body("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("must be an valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 7 })
    .withMessage("password must be at least 6 chars long")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("your password should have at least one special character"),
  async (req: any, res: any) => {
    var err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).send(err);
    //Add
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    //Check mail
    try {
      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist) return res.status(400).send("Email exist");
      //save

      const savedUser = await user.save();
      res.status(201).send(savedUser);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

//POST LOGIN
router.post("/login", async (req: any, res: any) => {
  //email validation
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Invalid account");

    //password validation
    const passVal = await bcrypt.compare(req.body.password, user.password);
    if (!passVal) return res.status(400).send("Invalid account");
    //create token and returnc cookie
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    console.log(token);
    res.cookie("token", token).send(token);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
