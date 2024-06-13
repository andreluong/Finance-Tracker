require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const router = express.Router();
const clerkAuth = require("../middlewares/clerkAuthMiddleware");
const transactionsController = require("../controllers/transactionsController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
    "/api/transactions/create",
    clerkAuth,
    transactionsController.createTransaction
);

router.post(
    "/api/transactions/import",
    clerkAuth,
    upload.single("file"),
    transactionsController.importTransactions
);

router.get(
    "/api/transactions/recent",
    clerkAuth,
    transactionsController.getTenRecentTransactions
);

router.get(
    "/api/transactions/all",
    clerkAuth,
    transactionsController.getAllTransactions
);

router.patch(
    "/api/transactions/update/:id",
    clerkAuth,
    transactionsController.updateTransaction
);

router.get(
    "/api/transactions/category/stats",
    clerkAuth,
    transactionsController.getCategoryStats
);

router.get(
    "/api/transactions/years",
    clerkAuth,
    transactionsController.getYears
);

router.delete(
    "/api/transactions/:id",
    clerkAuth,
    transactionsController.deleteTransaction
);

router.post(
    "/api/transactions/process/receipt",
    clerkAuth,
    upload.single("image"),
    transactionsController.processReceipt
);

module.exports = router;
