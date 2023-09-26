const express=require("express");
const contact=require("../controllers/ContactUs/contactUs");
const router = express.Router();

/// contact us ///
router.post("/contactUserInfo",contact.contactUs);



module.exports = router;