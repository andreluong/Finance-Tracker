require('dotenv').config({ path: ['.env.local', '.env'] })
const express = require('express');
const router = express.Router();
const clerkAuth = require('../middlewares/clerkAuthMiddleware');
const overviewController = require('../controllers/overviewController');

router.get('/api/overview/monthly-transactions', clerkAuth, overviewController.getMonthlyTransactionData);

router.get('/api/overview/monthly-top-spending-categories', clerkAuth, overviewController.getMonthlyTopSpendingCategories);

router.get('/api/overview/monthly-frequent-spending-categories', clerkAuth, overviewController.getMonthlyFrequentSpendingCategories);

router.get('/api/overview/monthly-finances', clerkAuth, overviewController.getMonthlyIncomeAndExpense);

module.exports = router;