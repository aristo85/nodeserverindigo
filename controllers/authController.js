const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("../config");

exports.singup = async (req, res, next) => {
  console.log('first', req.body)
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