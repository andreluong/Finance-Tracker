require('dotenv').config({ path: ['.env.local', '.env'] })
const express = require('express');
const router = express.Router();
const database = require('../database/db');
const clerkAuth = require('../middleware/clerkAuth');

// Create a transaction for a user
router.post('/api/transactions/create', clerkAuth, async (req, res) => {
    try {
        const {name, amount, description, type, category, date} = req.body;

        const categoryId = await database.category.getIdByValue(category);

        console.log("Creating transaction", categoryId)

        await database.transaction.create({
            name,
            amount,
            description,
            type,
            category: categoryId,
            date,
            user_id: req.auth.userId
        });
        console.log("Transaction created")
        res.status(201).json({message: "Transaction created"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction creation"});
    }
});

// Get a transaction by id for a user
router.get('/api/transactions/view/:id', clerkAuth, async (req, res) => {
    try {
        const id = req.params.id;
        // const user_id = req.query.user_id; // TODO:
        const user_id = "test_user" // TODO:

        const transaction = await database.transaction.getById(id, user_id);
        res.status(200).json(transaction);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction retrieval"});
    }
});

// Get last 10 transactions for a user
router.get('/api/transactions/recent', clerkAuth, async (req, res) => {
    try {
        const transactions = await database.transaction.getRecent(req.auth.userId);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction retrieval"});
    }
});

// Get all transactions for a user
router.get('/api/transactions/all', clerkAuth, async (req, res) => {
    try {
        const type = req.query.type;
        const category = req.query.category;
        const period = req.query.period;

        const transactions = await database.transaction.getAllDynamically(req.auth.userId, type, category, period);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction retrieval"});
    }
});

// Update a transaction by id for a user
router.put('/api/transactions/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {name, amount, description, type, date, user_id} = req.body;
        await database.transaction.updateById(id, {
            name,
            amount,
            description,
            type,
            date,
            user_id
        });
        res.status(200).json({message: "Transaction updated"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction update"});
    }
});

// Get category stats for all transactions for a user
router.get('/api/transactions/category/stats', clerkAuth, async (req, res) => {
    try {
        const type = req.query.type;
        const period = req.query.period;
        const user_id = req.auth.userId;

        let incomeTotal = 0;
        let expenseTotal = 0;
        
        // Get total income and expense amounts for the user
        if (type === 'all') {
            incomeTotal = await database.transaction.getSumOfAmountsDynamically(user_id, 'income', period);
            expenseTotal = await database.transaction.getSumOfAmountsDynamically(user_id, 'expense', period);
        } else {
            if (type === 'income') {
                incomeTotal = await database.transaction.getSumOfAmountsDynamically(user_id, 'income', period); 
            } else {
                expenseTotal = await database.transaction.getSumOfAmountsDynamically(user_id, 'expense', period); 
            }
        }

        const categoryStats = await database.category.getTotalAmountPerCategoryDynamically(user_id, type, period);
        const total = Number(incomeTotal) + Number(expenseTotal);

        // Calculate percentage of transaction amounts for each category
        const stats = categoryStats.map(category => {
            let percentage = (category.total / total) * 100;
            percentage = percentage.toFixed(2);
            return {
                ...category,
                percentage
            }
        });

        res.status(200).json({ categoryStats: stats, incomeTotal, expenseTotal });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction category stats retrieval"});
    }
})

// Get all years of transactions for a user
router.get('/api/transactions/years', clerkAuth, async (req, res) => {
    try {
        const years = await database.transaction.getYears(req.auth.userId);
        res.status(200).json(years);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction years retrieval"});
    }
});


module.exports = router;