const express=require("express");
const roleRoutes=require("../controllers/Seeder/roleSeeder");
const seeder=require("../controllers/Seeder/countryseeder");
const router = express.Router();
//role

router.get("/roleSeeder",roleRoutes.roleSeeder);

/// country seeder//
router.get("/countrySeeder",seeder.countrySeeder);

module.exports = router;