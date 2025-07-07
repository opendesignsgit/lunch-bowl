const express = require("express");
const router = express.Router();
const { ccavenueResponse } = require("../controller/Payment");

router.post("/response", ccavenueResponse);

module.exports = router;
