require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const router = express.Router();
const clerkAuth = require("../middlewares/clerkAuthMiddleware");
const overviewController = require("../controllers/overviewController");

router.get(
    "/api/overview/monthly-transactions",
    clerkAuth,
    overviewController.getMonthlyTransactionData
);

router.get("/api/overview/summary", clerkAuth, overviewController.getSummary);

module.exports = router;
