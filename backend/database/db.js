const { Pool } = require('pg')
require('dotenv').config({ path: ['.env.local', '.env'] })

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

// Queries

const transaction = {
    create: async function(transaction) {
        const {name, amount, description, type, category, date, user_id} = transaction;
        const q = `
            INSERT INTO transaction (amount, name, description, type, category_id, date, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `
        await pool.query(q, [amount, name, description, type, category, new Date(date), user_id]);
    },
    
    getById: async function(id, user_id) {
        const q = `SELECT * FROM transaction WHERE id = $1 AND user_id = $2`
        const res = await pool.query(q, [id, user_id]);
        return res.rows[0];
    },

    getAll: async function(user_id) {
        const q = `
            SELECT 
                transaction.id,
                created_at,
                amount,
                transaction.name,
                category.name AS category,
                category.value AS category_value,
                description,
                transaction.type,
                date,
                user_id
            FROM 
                transaction, category
            WHERE
                category_id = category.id
                AND user_id = $1
        `
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getAllByType: async function(type, user_id) {
        const q = `
            SELECT 
                transaction.id,
                created_at,
                amount,
                transaction.name,
                category.name AS category,
                category.value AS category_value,
                description,
                transaction.type,
                date,
                user_id
            FROM 
                transaction, category
            WHERE
                category_id = category.id
                AND transaction.type = $1
                AND user_id = $2
        `
        const res = await pool.query(q, [type, user_id]);
        return res.rows;
    },

    getAllByCategory: async function(category, user_id) {
        const q = `
            SELECT 
                transaction.id,
                created_at,
                amount,
                transaction.name,
                category.name AS category,
                category.value AS category_value,
                description,
                transaction.type,
                date,
                user_id
            FROM 
                transaction, category
            WHERE
                category_id = category.id
                AND category.value = $1
                AND user_id = $2
        `
        const res = await pool.query(q, [category, user_id]);
        return res.rows;
    },

    getAllByTypeAndCategory: async function(type, category, user_id) {
        const q = `
            SELECT 
                transaction.id,
                created_at,
                amount,
                transaction.name,
                category.name AS category,
                category.value AS category_value,
                description,
                transaction.type,
                date,
                user_id
            FROM 
                transaction, category
            WHERE
                category_id = category.id
                AND transaction.type = $1
                AND category.value = $2
                AND user_id = $3
        `
        const res = await pool.query(q, [type, category, user_id]);
        return res.rows;
    },

    getSumOfAmounts: async function(user_id) {
        const q = `SELECT SUM(amount) FROM transaction WHERE user_id = $1`
        const res = await pool.query(q, [user_id]);
        return res.rows[0].sum;
    },

    getSumOfAmountsOfType: async function(type, user_id) {
        const q = `SELECT SUM(amount) FROM transaction WHERE type = $1 AND user_id = $2`
        const res = await pool.query(q, [type, user_id]);
        return res.rows[0].sum;
    },

    getRecent: async function(user_id) {
        const q = `
            SELECT 
                transaction.id,
                created_at,
                amount,
                transaction.name,
                category.name AS category,
                category.value AS category_value,
                description,
                transaction.type,
                date,
                user_id
            FROM 
                transaction, category
            WHERE 
                category_id = category.id
                AND user_id = $1 
            ORDER BY 
                created_at desc
            LIMIT 
                10
        `
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    updateById: async function(id, transaction) {
        const {name, amount, description, type, date, user_id} = transaction;
        const q = `
            UPDATE transaction
            SET name = $1, amount = $2, description = $3, type = $4, date = $5
            WHERE id = $6 AND user_id = $7
        `
        await pool.query(q, [name, amount, description, type, new Date(date), id, user_id]);
    },

    deleteById: async function(id, user_id) {
        const q = `DELETE FROM transaction WHERE id = $1 AND user_id = $2`
        await pool.query(q, [id, user_id]);
    }
}

const category = {
    getAll: async function() {
        const q = `SELECT * FROM category`;
        const res = await pool.query(q);
        return res.rows;
    },

    getByType: async function(type) {
        const q = `SELECT * FROM category WHERE type = $1`
        const res = await pool.query(q, [type]);
        return res.rows;
    },

    getIdByValue: async function(value) {
        const q = `SELECT id FROM category WHERE value = $1`
        const res = await pool.query(q, [value]);
        return res.rows[0].id;
    },

    getNameById: async function(id) {
        const q = `SELECT name FROM category WHERE id = $1`
        const res = await pool.query(q, [id]);
        return res.rows[0].name;
    },

    getTotalAmountPerCategory: async function(user_id) {
        const q = `
            SELECT 
                c.name AS name,
                c.colour AS colour,
                c.type AS type,
                COUNT(t.id) AS count,
                SUM(t.amount) AS total
            FROM 
                transaction t
            JOIN 
                category c ON t.category_id = c.id
            WHERE
                t.user_id = $1
            GROUP BY 
                c.name,
                c.colour,
                c.type
            ORDER BY 
                total DESC;
        `
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getTotalAmountPerCategoryOfType: async function(type, user_id) {
        const q = `
            SELECT 
                c.name AS name,
                c.colour AS colour,
                COUNT(t.id) AS count,
                SUM(t.amount) AS total
            FROM 
                transaction t
            JOIN 
                category c ON t.category_id = c.id
            WHERE
                t.type = $1
                AND t.user_id = $2
            GROUP BY 
                c.name,
                c.colour
            ORDER BY 
                total DESC;
        `
        const res = await pool.query(q, [type, user_id]);
        return res.rows;
    }
}


module.exports = { transaction, category };