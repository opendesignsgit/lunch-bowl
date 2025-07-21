const express = require("express");
const router = express.Router();
const { ccavenueResponse, holiydayPayment } = require("../controller/Payment");

router.post("/response", ccavenueResponse);

router.post("/response/holiydayPayment", holiydayPayment);


module.exports = router;
