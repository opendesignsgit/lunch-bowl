const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../../controller/mobileController/dashboard.controller");

router.get("/", getDashboardStats);

module.exports = router;
