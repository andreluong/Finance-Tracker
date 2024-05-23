const express = require('express');
const router = express.Router();
const database = require('../database/db');

// Create a transaction for a user
router.post('/api/transactions/create', async (req, res) => {
    try {
        const {name, amount, description, type, date, user_id} = req.body;
        await database.transaction.create({
            name,
            amount,
            description,
            type,
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
        console.log("Transactions retrieved")
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with transaction retrieval"});
    }
});

// Get all transactions for a user
router.get('/api/transactions', async (req, res) => {
    try {
        const user_id = req.query.user_id; // TODO:
        const transactions = await database.transaction.getAll(user_id);
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
        const transactions = await database.income.getAll(user_id);
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
        const transactions = await database.expenses.getAll(user_id);
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



module.exports = router;