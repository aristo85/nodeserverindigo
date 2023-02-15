const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { sendPasswordResetEmail } = require("../utils/services/mailer");
const ResetUser = require("../models/resetPassModel");
const User = require("../models/userModel")
// const User = require("../models/userModel")

exports.singup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const isUser = await User.findOne({ email });

    if (isUser) {
      const error = new Error("This user already exist");
      error.statusCode = 422;
      throw error;
    }

    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPass });
    const result = await user.save();
    const token = jwt.sign(
      {
        email: result.email,
        userId: result._id.toString(),
      },
      config.jwtSecret,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User created", token });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isCorrectPass = await bcrypt.compare(password, foundUser.password);

    if (!isCorrectPass) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: foundUser.email,
        userId: foundUser._id.toString(),
      },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: foundUser._id.toString() });
  } catch (error) {
    error.statusCode = error.statusCode ?? 500;
    next(error);
  }
};

exports.createResetCode = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const randomstring = Math.floor(100000 + Math.random() * 900000);
    const resetUser = await ResetUser.findOneAndUpdate(
      { email: foundUser.email },
      {
        code: randomstring,
      },
      { upsert: true, useFindAndModify: false, new: true }
    );

    await sendPasswordResetEmail(resetUser.email, resetUser.code);

    res.status(200).json({
      message: "Please check your email for reset code",
      success: true,
    });
  } catch (error) {
    error.statusCode = error.statusCode ?? 500;
    next(error);
  }
};

exports.passwordReset = async (req, res, next) => {
  const { email, newPassword, code } = req.body;

  try {
    const findResetcodeByEmail = await ResetUser.findOne({ email });

    if (+findResetcodeByEmail?.code !== +code) {
      const error = new Error("Invalid reset code");
      error.statusCode = 401;
      throw error;
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    const hashedPass = await bcrypt.hash(newPassword, 12);
    foundUser.password = hashedPass;

    const updatedUser = await foundUser.save();
    await ResetUser.findOneAndRemove({ email, code });

    res.status(200).json({
      message: "password updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    error.statusCode = error.statusCode ?? 500;
    next(error);
  }
};
