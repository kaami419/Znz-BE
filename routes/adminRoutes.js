const express=require("express");
const admin=require("../controllers/Admin/admin");
const role=require("../middleware/addRole");
const router = express.Router();

/// admin ///
router.post("/adminRegister",role.Middleware,admin.adminRegister);



module.exports = router;