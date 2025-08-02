const express = require("express");
const router = express.Router();
const { getCustomerHome } = require("../../controller/mobileController/customerHome");
const { isAuth } = require("../../config/auth");

router.get("/home", isAuth, getCustomerHome);

module.exports = router;
