const Job = require("../../models/Job");
const ErrorHandling = require("../../utils/errorHandler.js");
const User = require("../../models/userModel"); 
const Country = require("../../models/country"); 
const Role = require("../../models/role");


exports.createJob = async (req, res, next) => {
  try {
    const {
      service_Title,
      minimum_budget,
      service_Description,
      requirements,
      category,
      min_projectLength,
      max_projectLength,
      Proposal,
    } = req.body;

    const userId = req.params.userId;

    const user = await User.findById(userId).populate("country");

    if (!user) {
      return next(new ErrorHandling("User not found", 404));
    }

    const role = await Role.findOne({ role: "buyer" });
    if (!role) {
      return next(new ErrorHandling("Role not found", 500));
    }

    if (user.role.toString() !== role._id.toString()) {
      return next(new ErrorHandling("Only Buyers Can Post a Job", 403));
    }

    if (!user.email_verification) {
      return next(
        new ErrorHandling(
          "Email not verified. Please verify your email to create a Job",
          403
        )
      );
    }

    if (user.thepa < 10) {
      return next(
        new ErrorHandling(
          "You do not have sufficient Thepa's to post a job. Please buy some to continue",
          403
        )
      );
    }

    const previousJob = await Job.findOne({
      User: userId,
      service_Titlee,
      minimum_budget,
      service_Description,
      requirements,
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }, // Check if created within the last 7 days
    });
    if (previousJob) {
      return next(
        new ErrorHandling(
          "User has already posted a similar job within the last 7 days",
          409
        )
      );
    }

    user.thepa -= 10;
    await user.save();

    const newJob = new Job({
      service_Title,
      minimum_budget,
      service_Description,
      requirements,
      category,
      country: user.country.country,
      User: userId,
      min_projectLength,
      max_projectLength,
      Proposal,
    });

    await newJob.save();
    return res.status(201).json({
      message: "New job created",
      data: newJob,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandling(error));
  }
};

exports.getAJob = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const job = await Job.find({ category: { $in: [categoryId] } })
      .populate("category")
      .populate("job_level");

    const count = job.length;
    if (count === 0) {
      return next(
        new ErrorHandling("No Jobs Of This Category Have Been Posted", 404)
      );
    }

    await Job.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    if (!job) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Job data",
        count,
        job,
      });
    }
  } catch (error) {
    return next(new ErrorHandling(" Internal Server Error", 500));
  }
};

exports.getAJobByID = async (req, res, next) => {
  try {
    const jobID = req.params.id;
    // console.log("🚀 ~ file: Job.js:134 ~ exports.getAJobByID= ~ jobID:", jobID)
    const job = await Job.findOne({ _id: jobID }).populate("category User");
    // console.log("🚀 ~ file: Job.js:137 ~ exports.getAJobByID= ~ job:", job)

    if (!job) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Job data",
        job,
      });
    }
  } catch (error) {
    return next(new ErrorHandling());
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const AllJobs = await Job.find()
      .sort({ updatedAt: -1 })
      .populate("category");

    if (!AllJobs) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Job data",
        count: AllJobs.length,
        AllJobs,
      });
    }
  } catch (error) {
    return next(new ErrorHandling());
  }
};

exports.deleteAJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return next(new ErrorHandling("Job Not Found", 404));
    } else {
      return res.status(200).json({
        message: "Deleted Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.updateAJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const update = req.body;
    const options = { new: true };

    const updateJob = await Job.findOneAndUpdate(
      { _id: jobId },
      update,
      options
    );
    if (!updateJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }
    return res.status(200).json({
      message: "Job updated",
      updateJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// exports.jobSearch = async (req, res) => {
//   try {
//     const { service_Title } = req.body;

//     let filteredjobs = await Job.find();

//     if (filteredjobs) {
//       filteredService_Title = filteredjobs.filter((job) =>
//         job .service_Title.toLowerCase().includes(service_Title.toLowerCase())
//       );
//     }
//     console.log("filtered jobs", filteredService_Title);

//     res.status(200).json(filteredService_Title);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).json({ error: "An error occurred while processing your request." });
//   }
// };

exports.jobSearch = async (req, res) => {
  try {
    const { service_Title } = req.body;

    const filteredjobs = await Job.find({
      service_Title: { $regex: new RegExp(service_Title, "i") },
    });

    // console.log("filtered jobs", filteredjobs);

    const jobCount = filteredjobs.length;

    res.status(200).json({
      count: jobCount,
      jobs: filteredjobs,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};
