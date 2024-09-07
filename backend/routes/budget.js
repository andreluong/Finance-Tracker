require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const router = express.Router();
const clerkAuth = require("../middlewares/clerkAuthMiddleware");
const budgetController = require("../controllers/budgetController");

router.get(
    "/api/budget/totals",
    clerkAuth,
    budgetController.getBudgetTotals
);

router.get(
    "/api/budget/targets",
    clerkAuth,
    budgetController.getBudgetTargets
);

router.post(
    "/api/budget/modify",
    clerkAuth,
    budgetController.modifyBudgetData
);

module.exports = router;
