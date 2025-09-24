const express = require("express");
const router = express.Router();
const { ccavenueResponse, holiydayPayment, getHolidayPaymentsByDate, dummyPaymentResponse } = require("../controller/Payment");

router.post("/response", ccavenueResponse);

// Dummy payment response for development/testing
router.post("/dummy-response", dummyPaymentResponse);

router.post("/response/holiydayPayment", holiydayPayment);


// New endpoint — POST with body { date, userId }
router.post("/holiday-payments", getHolidayPaymentsByDate);

module.exports = router;
