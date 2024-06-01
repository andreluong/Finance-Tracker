require('dotenv').config({ path: ['.env.local', '.env'] })
const express = require('express');
const router = express.Router();
const database = require('../database/db');
const clerkAuth = require('../middleware/clerkAuth');

router.get('/api/overview/monthly-transactions', clerkAuth, async (req, res) => {
    const data = await database.overview.getMonthlyTransactionData(req.auth.userId);
    res.status(200).json(data);
});

router.get('/api/overview/monthly-top-spending-categories', clerkAuth, async (req, res) => {
    const data = await database.overview.getMonthlyTopSpendingCategories(req.auth.userId);
    res.status(200).json(data);
});

router.get('/api/overview/monthly-frequent-spending-categories', clerkAuth, async (req, res) => {
    const data = await database.overview.getMonthlyFrequentSpendingCategories(req.auth.userId);
    res.status(200).json(data);
});

router.get('/api/overview/monthly-finances', clerkAuth, async (req, res) => {
    const data = await database.overview.getMonthlyIncomeAndExpense(req.auth.userId);
    
    let income = data.find((item) => item.type === 'income')?.total || 0;
    let expense = data.find((item) => item.type === 'expense')?.total || 0;
    income = Number(income).toFixed(2);
    expense = Number(expense).toFixed(2);
    const netIncome = (income - expense).toFixed(2);

    res.status(200).json({income, expense, netIncome});
});

module.exports = router;