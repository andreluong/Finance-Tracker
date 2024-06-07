require('dotenv').config({ path: ['.env.local', '.env'] })
const express = require('express');
const router = express.Router();
const clerkAuth = require('../middlewares/clerkAuthMiddleware');
const statisticsController = require('../controllers/statisticsController');

router.get('/api/statistics/income-expense-stats', clerkAuth, statisticsController.getIncomeAndExpenseStats);

module.exports = router;