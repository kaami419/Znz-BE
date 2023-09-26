const User = require("../../models/userModel");
const Role = require("../../models/role");
const validateRegisterInput = require("../../Validation/userRegisterValidation");
const validateLoginInput = require("../../Validation/userLoginValidation");
const ErrorHandler = require("../../utils/errorHandler.js");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { forUserEmail } = require("../Emails/email");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.ClOUDINARY_NAME,
  api_key: process.env.ClOUDINARY_API_KEY,
  api_secret: process.env.ClOUDINARY_SECREAT_KEY,
});
const cloud_name=process.env.ClOUDINARY_NAME
console.log(
  
  "---",cloud_name
);
//Upload image controllers
exports.uploadImage = async (req, res) => {
  try {
    const file1 = req.files.file;
    const result1 = await cloudinary.uploader.upload(file1.tempFilePath);

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: result1.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
// User signup controller

exports.userRegister = async (req, res, next) => {
  try {
    // Validate user input
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const {
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      phone_no,
      service_Description,
      date_of_birth,
      address,
      account_status,
      email_verification,
      language,
      role,
      country,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already Exist", 400));
    }

    // Create a new user
    const newUser = new User({
      image: req.body.image, // Image URL from the request body
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      role,
      country,
      phone_no,
      service_Description,
      date_of_birth,
      address,
      account_status,
      email_verification,
      language,
    });

    // Save the user to the database
    const userSave = await newUser.save();
    if (!userSave) {
      return next(new ErrorHandler("User registration failed", 404));
    }

    // const userId = usersave._id;
    await forUserEmail(first_name, last_name, email, userSave._id);

    return res.status(201).json({
      message: "User created and email sent successfully",
      data: newUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error));
  }
};

// User login controller
exports.userLogin = async (req, res, next) => {
  try {
    // Validate user input
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role", "-_id");

    if (!user) {
      return next(
        new ErrorHandler("User Email and Password doesn't exist", 401)
      );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorHandler("Incorrect email and Password", 404));
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1w" });

    return res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          // Include any other relevant user data you want to return
        },
        token,
      },
    });
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Get all users controller
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password").populate("country");

    if (users.length === 0) {
      return next(new ErrorHandler("No User Found", 404));
    } else {
      return res.status(200).json({
        message: "All user data",
        count: users.length,
        users,
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Get single user controller
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("country", "country");

    if (!user) {
      return next(new ErrorHandler("No Such User Found", 404));
    } else {
      return res.status(200).json({
        message: "User data",
        user,
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Delete user controller
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return next(new ErrorHandler("User not Found", 404));
    } else {
      return res.status(200).json({
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Update user controller
exports.userUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bodyData = req.body;
    if (bodyData.password) {
      bodyData.password = await bcrypt.hash(bodyData.password, 10);
    }
    const userUpdate = await User.findByIdAndUpdate(id, bodyData, {
      new: true,
    });

    if (!userUpdate) {
      return next(new ErrorHandler("User not Found", 404));
    }

    return res.status(200).json({
      message: "User updated",
      user: userUpdate,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};
// Get TopSeller
exports.getTopSeller = async (req, res, next) => {
  try {
    const role = await Role.findOne({ role: "seller" });
    if (!role) {
      return next(new ErrorHandler("Role not found", 500));
    }

    const users = await User.find({ role: role._id })
      .limit(5)
      .populate({
        path: "country",
        select: "country",
      })
      .populate({
        path: "role",
        select: "role",
      });

    if (!users || users.length === 0) {
      return next(new ErrorHandler("No Users Found", 404));
    }

    return res.status(200).json({
      message: "User data",
      count: users.length,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

exports.userSearch = async (req, res) => {
  try {
    const { fullName } = req.body;
    let filteredUser = await User.find();

    if (fullName) {
      filteredfullName = filteredUser.filter((user) => {
        let fullname = `${user.first_name} ${user.last_name}`;
        return fullname.toLowerCase().includes(fullName.toLowerCase());
      });
    }
    res.status(200).json(filteredfullName);
  } catch (error) {}
};
