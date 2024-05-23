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
        const q = `SELECT * FROM transaction WHERE user_id = $1`
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getRecent: async function(user_id) {
        const q = `SELECT * FROM transaction WHERE user_id = $1 ORDER BY date LIMIT 10`
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

const income = {
    getAll: async function(user_id) {
        const q = `SELECT * FROM transaction WHERE user_id = $1 AND type = 'income'`
        const res = await pool.query(q, [user_id]);
        return res.rows;
    }
}

const expenses = {
    getAll: async function(user_id) {
        const q = `SELECT * FROM transaction WHERE user_id = $1 AND type = 'expense'`
        const res = await pool.query(q, [user_id]);
        return res.rows;
    }
}

const category = {
    getAll: async function() {
        const res = await pool.query('SELECT * FROM category');
        return res.rows;
    },
    
    getIdByValue: async function(value) {
        const q = `SELECT id FROM public.category WHERE value = $1`
        const res = await pool.query(q, [value]);
        return res.rows[0].id;
    },

    getCountPerCategory: async function(user_id) {
        const q = `
            SELECT 
                c.name AS name,
                COUNT(t.id) AS count,
                SUM(t.amount) AS total
            FROM 
                transaction t
            JOIN 
                category c ON t.category_id = c.id
            WHERE
                t.user_id = $1
            GROUP BY 
                c.name
            ORDER BY 
                count DESC;
        `
        const res = await pool.query(q, [user_id]);
        return res.rows;
    }
}


module.exports = { transaction, income, expenses, category };