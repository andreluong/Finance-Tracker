const express = require('express');
const router = express.Router();
const database = require('../database/db');

// Create a transaction for a user
router.post('/api/transactions/create', async (req, res) => {
    try {
        const {name, amount, description, type, category, date, user_id} = req.body;

        const categoryId = await database.category.getIdByValue(category);

        console.log("Creating transaction", categoryId)

        await database.transaction.create({
            name,
            amount,
            description,
            type,
            category: categoryId,
            date,
            user_id
        });
        console.log("Transaction created")
        res.status(201).json({message: "Transaction created"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction creation"});
    }
});

// Get a transaction by id for a user
router.get('/api/transactions/:id', async (req, res) => {
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
router.get('/api/transactions/recent/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const transactions = await database.transaction.getRecent(user_id);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction retrieval"});
    }
});

// Get all transactions for a user
router.get('/api/transactions/all/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id; // TODO:
        const type = req.query.type;
        const category = req.query.category;
        const period = req.query.period;

        const transactions = await database.transaction.getAllDynamically(user_id, type, category, period);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction retrieval"});
    }
});

// Get all income transactions for a user
router.get('/api/transactions/income/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id; // TODO:
        const transactions = await database.transaction.getAllByType('income', user_id);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with income transaction retrieval"});
    }
});

// Get all expense transactions for a user
router.get('/api/transactions/expenses/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id; // TODO:
        const transactions = await database.transaction.getAllByType('expense', user_id);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with expenses transaction retrieval"});
    }
});

// Update a transaction by id for a user
router.put('/api/transactions/:id', async (req, res) => {
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
router.get('/api/transactions/category/stats/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const type = req.query.type;
        const period = req.query.period;

        console.log("Getting category stats for all transactions");

        const sumTotal = await database.transaction.getSumOfAmountsDynamically(user_id, type, period);
        const categoryStats = await database.category.getTotalAmountPerCategoryDynamically(user_id, type, period);

        // Calculate percentage of transaction amounts for each category
        const stats = categoryStats.map(category => {
            let percentage = (category.total / sumTotal) * 100;
            percentage = percentage.toFixed(2);
            return {
                ...category,
                percentage
            }
        });

        console.log("Category stats retrieved for all transactions");
        res.status(200).json({categoryStats: stats, total: sumTotal});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction category stats retrieval"});
    }
})

// Get all years of transactions for a user
router.get('/api/transactions/years/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const years = await database.transaction.getYears(user_id);
        res.status(200).json(years);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction years retrieval"});
    }
});


module.exports = router;