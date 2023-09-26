const Portfolio = require("../../models/addPortfolio");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dsv28ungz",
  api_key: "775634257667667",
  api_secret: "6jMBqRlVALHfbR8udrS3fUf4m1A",
});

exports.AddPortfolio = async (req, res) => {
  try {
    const file1 = req.files.file;
    let result1 = await cloudinary.uploader.upload(file1.tempFilePath);
    let fileUrl = req.files.portfolio_Document.tempFilePath
    // console.log(req.body, req.files.portfolio_Document.tempFilePath);
    const uploadResponse = await cloudinary.uploader.upload(fileUrl, { resource_type: 'raw' ,folder: 'documents' });

    // console.log(uploadResponse,"lllllllllllllllllllllll");
  
    const {Portfolio_title,Portfolio_Description,portfolio_Document,cover_image,skills} = req.body;
    console.log("body", req.body);

    // Check if the Job already exists
    const existingPortfolio = await Portfolio.findOne({ Portfolio_title });
    if (existingPortfolio) {
      return res.status(409).json({
        message: "Portfolio already exists",
      });
    }
    const newPortfolio = new Portfolio({
      Portfolio_title,
      Portfolio_Description,
      portfolio_Document:uploadResponse.secure_url ,
      cover_image:result1.url,
      skills,
    });

    await newPortfolio.save();

    return res.status(201).json({
      message: "newPortfolio created",
      data: newPortfolio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// get portfolio by portfolio id
exports.getPortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    console.log(portfolioId);
    const portfolio = await Portfolio.findById(portfolioId);
    console.log(portfolio);
    if (!portfolio) {
      return res.status(404).json({
        message: "portfolio not found",
      });
    } else {
      return res.status(200).json({
        message: "portfolio data",
        portfolio,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = await Portfolio.findByIdAndDelete(portfolioId);
   if (!portfolio) {
      return res.status(200).json({
        message: "portfolio doesn't exist",
      });
    } else {
      return res.status(200).json({
        message: "Deleted Succefully",
        
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
}

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const update = req.body;
    const options = { new: true }; // Return the updated record
  
    const updatePortfolio = await Portfolio.findOneAndUpdate({_id:portfolioId}, update, options);
    if (!updatePortfolio) {
      return res.status(404).json({
        message: "portfolio not found",
      });
    }
    return res.status(200).json({
      message: "portfolio updated",
      updatePortfolio,
    });
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};

