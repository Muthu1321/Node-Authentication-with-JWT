const bcrypt = require("bcryptjs");

const User = require("./user.model");
const generateToken = require("../utils/generateToken");

exports.authUser = async (req, res, next) => {
  try {
    const { email, password } = await req.body;

    const user = await User.findOne({ email });

    const comparePassword = await bcrypt.compare(password, user.password);

    if (user && comparePassword) {
      generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = await req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(404);
      throw new Error("User already Exists");
    }

    const hastPassword = await bcrypt.hash(password, 12);

    const userData = new User({
      name: name,
      email: email,
      password: hastPassword,
    });

    const user = await userData.save();

    generateToken(res, user._id);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    if (req.user) {
      res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updateUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
  }
};
