const express=require("express");
const seeder=require("../controllers/Seeder/categoryseeder");
const portfolio=require("../controllers/Users/addPortfolio");
const protect=require("../middleware/authMiddleware");

const router = express.Router();


router.get("/categorySeeder",seeder.categorySeeder);

// Portfolio Routes
router.post("/AddPortfolio",protect.verifyToken,portfolio.AddPortfolio);
router.get("/getPortfolio/:id",protect.verifyToken,portfolio.getPortfolio);
router.delete("/deletePortfolio/:id",protect.verifyToken,portfolio.deletePortfolio);
router.put("/updatePortfolio/:id",protect.verifyToken,portfolio.updatePortfolio);




module.exports = router;

