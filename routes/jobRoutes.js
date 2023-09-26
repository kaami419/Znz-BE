const express = require("express");
const job = require("../controllers/Users/Job");
const protect = require("../middleware/authMiddleware");
const jobLevels = require("../controllers/Seeder/joblevelseeder");

const router = express.Router();

// Job routes
router.post("/PostAJob/:userId", protect.verifyToken, job.createJob);
router.get("/getAJob/:id", job.getAJob);
router.get("/getAllJobs", job.getAllJobs);
router.get("/getAJobByID/:id", job.getAJobByID);
router.delete("/deleteAJob/:id", protect.verifyToken, job.deleteAJob);
router.put("/updateAJob/:id", protect.verifyToken, job.updateAJob);
router.get("/jobSearch", job.jobSearch);

// /levels
router.get("/jobLevelSeeder", jobLevels.jobLevelSeeder);

module.exports = router;
