const express = require('express');
const router = express.Router();
const database = require('../database/db');

// Get all categories
router.get('/api/categories', async (req, res) => {
    try {
        const type = req.query.type;
        const categories = await database.category.getAllDynamically(type);
        res.status(200).json(categories);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with category retrieval"});
    }
});

// Get all unique categories
router.get('/api/categories/unique', async (req, res) => {
    try {
        const type = req.query.type;
        const categories = await database.category.getAllUniqueDynamically(type);
        res.status(200).json(categories);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Something went wrong with unique category retrieval"});
    }
});

module.exports = router;