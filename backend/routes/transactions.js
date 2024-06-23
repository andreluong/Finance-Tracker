require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const router = express.Router();
const clerkAuth = require("../middlewares/clerkAuthMiddleware");
const transactionsController = require("../controllers/transactionsController");
const path = require('path');

const multer = require("multer");
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.csv', '.jpg', '.jpeg', '.png'];
        const extname = path.extname(file.originalname); // Get file extension

        if (!allowedExtensions.includes(extname)) {
            cb(new Error('Invalid file type'));
        } else {
            cb(null, true);
        }
    }
});

router.post(
    "/api/transactions/create",
    clerkAuth,
    transactionsController.createTransaction
);

router.post(
    "/api/transactions/process/csv",
    clerkAuth,
    upload.single("file"),
    transactionsController.processCsv
);

router.get(
    "/api/transactions/recent",
    clerkAuth,
    transactionsController.getRecentTransactions
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
