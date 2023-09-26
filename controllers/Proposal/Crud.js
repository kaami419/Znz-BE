const Proposal = require("../../models/proposalSchema");
const ErrorHandling = require("../../utils/errorHandler.js");
const User = require("../../models/userModel");
const Role = require("../../models/role");
const Job = require("../../models/Job");
const cloudinary = require("cloudinary").v2;
const ProposalSchema = require('../../models/proposalSchema')




cloudinary.config({
  cloud_name: "dsv28ungz",
  api_key: "775634257667667",
  api_secret: "6jMBqRlVALHfbR8udrS3fUf4m1A",
});


exports.uploadImage = async (req, res) => {
  try {
    const file = req.files.file;
    const result = await cloudinary.uploader.upload(file.tempFilePath);

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: result.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.createProposal = async (req, res, next) => {
  try {
    const {
      coverLetter,  
      description,
      bidAmount,
      deliveryTime,
      githubLink,
      duration,
      payment,
      serviceCharges,
      websiteLink,
      imagesUrl,
    } = req.body;

    const userId = req.params.userId;
    const jobId = req.params.jobId;

    // Get the user from the User collection
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandling("User not found", 404));
    }

    // Check if the user's role is 'seller'
    const role = await Role.findOne({ role: "seller" });
    if (!role) {
      return next(new ErrorHandling("Role not found", 500));
    }

    if (user.role.toString() !== role._id.toString()) {
      return next(new ErrorHandling("Only Sellers Can Send A Proposal", 403));
    }

    // Check if the user's email has been verified
    if (!user.email_verification) {
      return next(
        new ErrorHandling(
          "Email not verified. Please verify your email to send a proposal",
          403
        )
      );
    }

    // Check if the user has sufficient "thepa" value to post a job
    if (user.thepa < 10) {
      return next(
        new ErrorHandling(
          "You do not have sufficient thepa to post a job. Please buy some to continue",
          403
        )
      );
    }

    // Check if the user has already sent a proposal for the specified job
    const existingProposal = await ProposalSchema.findOne({
      user: userId,
      job: jobId,
    });
    if (existingProposal) {
      return next(
        new ErrorHandling("You have already sent a proposal for this job", 400)
      );
    }

    // Get the job from the Job collection
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandling("Job not found", 404));
    }

    user.thepa -= 10;
    await user.save(); // Save the updated user object

    const newProposal = new ProposalSchema({
      file: req.body.file, // Image URL from the request body
      user: userId,
      job: jobId,
      coverLetter,
      description,
      bidAmount,
      deliveryTime,
      githubLink,
      duration,
      payment,
      serviceCharges,
      websiteLink,
      imagesUrl,
    });

    job.proposal += 1
    await job.save();



    // Save the proposal to the database
    await newProposal.save();

    return res.status(201).json({
      message: "New proposal created",
      data: newProposal,
    });
  } catch (error) {
    console.log(error);
    return (error);

  }
};

exports.deleteProposal = async (req, res, next) => {
  try {
    const proposalId = req.params.proposalId;
    const userId = req.params.userId;
    const jobId = req.params.jobId;

    console.log(req.params.userId);

    // Get the user from the User collection
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandling("User not found", 404));
    }
   

    // Check if the user's role is 'seller'
    const role = await Role.findOne({ role: "seller" });
    if (!role) {
      return next(new ErrorHandling("Role not found", 500));
    }

    if (user.role.toString() !== role._id.toString()) {
      return next(new ErrorHandling("Only seller Can Delete a Proposal", 403));
    }

    // Find the proposal by ID
    const proposal = await ProposalSchema.findById(proposalId);
    if (!proposal) {
      return next(new ErrorHandling("Proposal not found", 404));
    }

     const job = await Job.findById(jobId);
     if(!job){
      return next(new ErrorHandling("Job Does not exist, It might have been removed by its creator", 404));
     }     

     job.proposal -= 1
     job.save()

    // Delete the proposal
    await proposal.deleteOne();

    return res.status(200).json({
      message: "Proposal deleted",
      data: proposal,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandling(error));
  }
};

exports.getAllProposal = async (req, res, next) => {
  try {
    const proposal = await ProposalSchema.find();

    if (!proposal) {
      return next(new ErrorHandling("Proposal not found", 404));
    }

    const count = proposal.length

    return res.status(200).json({
      message: "Proposal retrieved successfully",
      count: count,
      data: proposal,

    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandling(error));
  }
};

exports.updateProposal = async (req, res, next) => {
  try {
    const proposalId = req.params.proposalId;
    const update = req.body;
    const options = { new: true }; // Return the updated record

    const updatePropoasal = await ProposalSchema.findOneAndUpdate(
      { _id: proposalId },
      update,
      options
    );
    if (!updatePropoasal) {
      return next(new ErrorHandling("Proposal not found", 404));
    }
    return res.status(200).json({
      message: "Propoasal updated",
      updatePropoasal,
    });
  } catch (error) {
    return next(new ErrorHandling());
  }
};

exports.getAProposalById = async (req, res, next) => {
  try {
    const proposalId = req.params.proposalId;

    // Find the proposal by ID
    const proposal = await Proposal.findOne(proposalId);
    // console.log("I am here ===>", proposal);
    if (!proposal) {
      return next(new ErrorHandling("Proposal not found", 404));
    }

    return res.status(200).json({
      message: "Proposal retrieved successfully",
      data: proposal,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandling(error));
  }
};


  
exports.getProposalsByJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const jobIdtoString = jobId.toString();

    const proposals = await ProposalSchema.find({ job: jobIdtoString });
    if (proposals.length === 0) {
      return res.status(200).json({
        message: "No proposal found against this job",
      });
    }

    const count = proposals.length

    return res.status(200).json({
      message: "Proposals retrieved successfully",
      count: count,
      data: proposals,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandling(error));
  }
};
