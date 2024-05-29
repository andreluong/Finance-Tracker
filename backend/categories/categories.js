const express = require('express');
const router = express.Router();
const database = require('../database/db');

// Get all categories
router.get('/api/categories', async (req, res) => {
    try {
        const type = req.query.type;
        let categories = [];

        if (type === 'all' || type === undefined) {
            categories = await database.category.getAll();
        } else if (type === 'income' || type === 'expense') {
            categories = await database.category.getByType(type);
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with category retrieval"});
    }
});

module.exports = router;