const { Pool } = require('pg')
const utils = require('./utils.js');
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

    getAllDynamically: async function(user_id, type, category, period) {
        let q = `
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
        `;
        let params = [user_id];

        if (type && type !== 'all') {
            console.log("added type " + type)
            q += ` AND transaction.type = $${params.length + 1}`
            params.push(type);
        }

        if (category && category !== 'all') {
            console.log("added category " + category)
            q += ` AND category.value = $${params.length + 1}`
            params.push(category);
        }

        let { yearQuery, yearPeriod } = utils.getDateForQuery(period);
        q += yearQuery;
        if (yearPeriod) {
            params.push(periodResult.yearPeriod);
        }

        q += ` ORDER BY date DESC;`

        const res = await pool.query(q, params);
        return res.rows;
    },

    getSumOfAmountsDynamically: async function(user_id, type, period) {
        let q = `
            SELECT SUM(amount)
            FROM transaction
            WHERE user_id = $1
        `
        let params = [user_id];

        if (type && type !== 'all') {
            q += ` AND type = $${params.length + 1}`
            params.push(type);
        }

        let { yearQuery, yearPeriod } = utils.getDateForQuery(period);
        q += yearQuery;
        if (yearPeriod) {
            params.push(periodResult.yearPeriod);
        }

        const res = await pool.query(q, params);
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

    getYears: async function(user_id) {
        const q = `
            SELECT date_trunc('year', date) AS year
            FROM transaction
            WHERE user_id = $1
            GROUP BY year
            ORDER BY year DESC
        `
        const res = await pool.query(q, [user_id]);
        return res.rows.map(row => row.year.toISOString().split('-')[0]);
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
    getAllDynamically: async function(type) {
        let q = `
            SELECT *
            FROM category
        `;
        let params = [];

        if (type && type !== 'all') {
            q += ` WHERE type = $1`
            params.push(type);
        }

        const res = await pool.query(q, params);
        return res.rows;
    },

    getAllUniqueDynamically: async function(type) {
        let q = `
            SELECT
                DISTINCT ON (value) 
                id, 
                name, 
                value, 
                icon, 
                colour, 
                type
            FROM
                category
        `;
        let params = [];

        if (type && type !== 'all') {
            q += ` WHERE type = $1`
            params.push(type);
        }

        q += `
            ORDER BY 
                value,
                id;
        `;

        const res = await pool.query(q, params);
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

    getTotalAmountPerCategoryDynamically: async function(user_id, type, period) {
        let q = `
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
                t.user_id = $1
        `
        let params = [user_id];

        if (type && type !== 'all') {
            q += ` AND t.type = $${params.length + 1}`
            params.push(type);
        }

        let { yearQuery, yearPeriod } = utils.getDateForQuery(period);
        q += yearQuery;
        if (yearPeriod) {
            params.push(periodResult.yearPeriod);
        }

        q += ` GROUP BY 
                c.name,
                c.colour
            ORDER BY 
                total DESC;
        `

        const res = await pool.query(q, params);
        return res.rows;
    }
}


module.exports = { transaction, category };