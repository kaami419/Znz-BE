const roleModel = require("../models/role");

exports.Middleware = async function (req, res, next) {
  try {
    const roleid = req.headers.role;
    console.log(roleid);
    // Find the role based on the roleName
    const Role = await roleModel.findOne({_id:roleid});
console.log(Role);
    if (!Role) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    req.role = Role; // Add the role to the request object
    
    next();
  } catch (error) {
    return res.status(401).json({
      message: "You are not active",
    });
  }
};