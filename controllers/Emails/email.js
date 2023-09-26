const nodemailer = require("nodemailer");
const validator = require('validator');
const ErrorHandler = require("../../utils/errorHandler");
const User = require("../../models/userModel");

exports.forUserEmail = async function (first_name, last_name, email, userId) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });

    let mailOptions = {
      to: email,
      subject: "New User Registration",
      html: `<h1>Hello</h1>
            <p>A new user has registered on the freelancing site.</p>
            <p>Name: ${first_name} ${last_name}</p>
            <p>Email: ${email}</p>
            <p>Please take necessary actions.</p>
            <p>Click the following link to see the user details:</p>
            <p><a href="http://localhost:3001/#/loading/${userId}">Move to Website</a></p>
            <h2>Thank and Regards</h2>
            <h2>ZNZ Communication</h2>`,
    };

    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};

// Any User Email Confirmation //
exports.forUserConfirmationEmail = async function (req, res, next) {
  try {
    const email = req.params.userEmail;
    // console.log(email);

    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Invalid email address", 400));
    }

    const Email = await User.findOne({ email: email });

    if (!Email) {
      return next(new ErrorHandler("Email Not Exist", 404));
    }

    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });

    let mailOptions = {
      to: email,
      subject: "Registration Confirmation",
      html: `<h1>Hello</h1>
            <p>Please confirm your registration on the freelancing site.</p>
            <p>Name: ${Email.first_name} ${Email.last_name}</p>
            <p>Please take necessary actions.</p>
            <p>Click the following link to confirm Email</p>
            <p><a href="http://localhost:3001/#/loading/${Email._id}">Move to Website</a></p>
            <h2>Thanks and Regards</h2>
            <h2>ZNZ Communication</h2>`,
    };

    // send email with defined transport object
    await transport.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Email Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Failed to send email", 500));
  }
};

// userEmailVerification
exports.userEmailVerification = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      user.email_verification = true; // Update the email verification status to true
      await user.save(); // Save the updated user object

      return res.status(200).json({
        message: "Email verification successful",
      });
    }
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Contact any person//
exports.forContactUs = async function (
  name,
  email,
  subject,
  phone_no,
  description
) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });

    let mailOptions = {
      to: "sherazabbas669@gmail.com",
      subject: `${subject}`,
      html: `<h1> ${name} ,welcome to this freelancing site</h1>
            <h2>Your Login Credentials for our portal are given below: (Please do not share with anyone!!)</h2>
            <h3> Email: ${email} </h3>
            <h3> description: ${description} </h3> 
            <h4>Phone no: ${phone_no} </h4>`,
    };

    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);

    console.log("Email sent successfully", info);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};

///forget Password///

exports.EmailForForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const checkEmail = await User.findOne({ email: email });
    // console.log(
    //   "🚀 ~ file: email.js:169 ~ exports.ForgetEmail= ~ checkEmail:",
    //   checkEmail._id
    // );
    if (!checkEmail) {
      return res.status(404).json({
        message: "Email not found",
      });
    }
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });

    let mailOptions = {
      from: '"sherazabbas669@gmail.com"', // sender address
      to: checkEmail.email,
      subject: "To Reset Password Click On The Link below",
      html: `<h1> Forgot Password </h1><br>
    <p><a href="http://localhost:3001/#/reset-password?id=/${checkEmail._id}">Click Here to change password</a></p>`,
    };

    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    return res.status(200).json({
      message: "Email Sent",
    });
  } catch (error) {
    return res.status(500).send("Some error occurred");
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      user.password = newPassword;
      await user.save();
      return res.status(200).json({
        message: "Password updated successfully",
      });
    }
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
