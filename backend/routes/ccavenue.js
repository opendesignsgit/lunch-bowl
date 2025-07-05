const express = require("express");
const router = express.Router();
const { ccavenueResponse } = require("../controller/Payment");

router.post("/ccavenue/response", ccavenueResponse);

module.exports = router;
