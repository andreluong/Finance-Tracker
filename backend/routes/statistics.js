require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const router = express.Router();
const clerkAuth = require("../middlewares/clerkAuthMiddleware");
const statisticsController = require("../controllers/statisticsController");

router.get(
    "/api/statistics/income-expense-stats",
    clerkAuth,
    statisticsController.getIncomeAndExpenseStats
);

router.get(
    "/api/statistics/monthly-transactions",
    clerkAuth,
    statisticsController.getPerMonthData
);

router.get(
    "/api/statistics/categories",
    clerkAuth,
    statisticsController.getCategoryData
);

module.exports = router;
