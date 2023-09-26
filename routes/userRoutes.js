const express=require("express");
const userRoutes=require("../controllers/Users/userController");
const mailConfirmation=require("../controllers/Emails/email");
const protect=require("../middleware/authMiddleware");
const router = express.Router();

/// User///
router.post("/uploadImage",userRoutes.uploadImage);
router.post("/UserRegister",userRoutes.userRegister);
router.get("/getUser/:id",protect.verifyToken,userRoutes.getUser);
router.get("/getAllUser",userRoutes.getAllUser);
router.delete("/deleteUser/:id",protect.verifyToken,userRoutes.deleteUser);
router.put("/UserUpdate/:id",protect.verifyToken,userRoutes.userUpdate);
router.get("/getTopSeller",userRoutes.getTopSeller);
router.get("/userSearch",userRoutes.userSearch);
//Auth//
router.post("/UserLogin",userRoutes.userLogin);

// mail

router.get("/forUserEmail",mailConfirmation.forUserEmail);
router.get("/userEmailVerification/:id",mailConfirmation.userEmailVerification);
router.get("/forUserConfirmationEmail/:userEmail",mailConfirmation.forUserConfirmationEmail);
router.post("/EmailForForgetPassword",mailConfirmation.EmailForForgetPassword);
router.post("/forgetPassword/:id",mailConfirmation.forgetPassword);
module.exports = router;