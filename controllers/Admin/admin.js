const Admin = require("../../models/adminModel");

exports.adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Access the role value from the request object
    const selectedRole = req.role;

    // Create a new user
    const admin = new Admin({
      email,
      password,
      role: selectedRole._id, // Assign the role ID to the user
    });

    // Save the user to the database
    await admin.save();

    res.status(201).json({ message: 'admin created successfully', admin });
  } catch (error) {
    console.error('Error during seller registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};