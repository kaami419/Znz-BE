const ErrorHandling = require("../../utils/errorHandler.js")
const User = require('../../models/userModel'); // Import the User model
const Role = require('../../models/role')


exports.getUsersWithSellerRole = async (req, res, next) => {
    try {
      const role = await Role.findOne({ role: 'seller' }); 
      if (!role) {
        return next(new ErrorHandling("Role not found", 500));
      }
  
      const users = await User.find({ role: role._id });
  
      return res.status(200).json({
        message: "All sellers retrieved succussfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      return next(new ErrorHandling());
    }
  };

  