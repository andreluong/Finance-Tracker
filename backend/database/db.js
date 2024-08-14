const { Pool } = require("pg");
const utils = require("./utils.js");
require("dotenv").config({ path: [".env.local", ".env"] });

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

// Queries

const transaction = {
    create: async function (transaction) {
        const { name, amount, description, type, category, date, user_id } =
            transaction;
        const q = `
            INSERT INTO transaction (amount, name, description, type, category_id, date, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(q, [
            amount,
            name,
            description,
            type,
            category,
            new Date(date),
            user_id,
        ]);
    },

    getById: async function (id, user_id) {
        const q = `SELECT * FROM transaction WHERE id = $1 AND user_id = $2`;
        const res = await pool.query(q, [id, user_id]);
        return res.rows[0];
    },

    getAll: async function (user_id) {
        const q = `
            SELECT 
                t.id,
                created_at,
                amount,
                t.name,
                c.name AS category,
                c.value AS category_value,
                description,
                t.type,
                date,
                user_id
            FROM 
                transaction t, category c
            WHERE
                t.category_id = c.id
                AND user_id = $1
        `;
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getAllDynamically: async function (
        user_id,
        period
    ) {
        let q = `
            SELECT 
                t.id,
                created_at,
                amount,
                t.name,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'value', c.value,
                    'icon', c.icon,
                    'colour', c.colour,
                    'type', c.type
                ) AS category,
                description,
                t.type,
                date,
                user_id
            FROM 
                transaction t, category c
            WHERE
                t.category_id = c.id
                AND user_id = $1
        `;
        let params = [user_id];

        let { yearQuery, yearPeriod } = utils.getDateForQuery(period, params);
        q += yearQuery;
        if (yearPeriod) {
            params.push(yearPeriod);
        }

        q += ` ORDER BY date DESC;`;

        const res = await pool.query(q, params);
        return res.rows;
    },

    getSumOfAmountsDynamically: async function (user_id, type, period) {
        let q = `
            SELECT SUM(amount)
            FROM transaction
            WHERE user_id = $1
        `;
        let params = [user_id];

        if (type && type !== "all") {
            q += ` AND type = $${params.length + 1}`;
            params.push(type);
        }

        let { yearQuery, yearPeriod } = utils.getDateForQuery(period, params);
        q += yearQuery;
        if (yearPeriod) {
            params.push(yearPeriod);
        }

        const res = await pool.query(q, params);
        return res.rows[0].sum;
    },

    getRecent: async function (user_id) {
        const q = `
            SELECT 
                t.id,
                created_at,
                amount,
                t.name,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'value', c.value,
                    'icon', c.icon,
                    'colour', c.colour,
                    'type', c.type
                ) AS category,
                description,
                t.type,
                date,
                user_id
            FROM 
                transaction t, category c
            WHERE 
                t.category_id = c.id
                AND user_id = $1 
            ORDER BY 
                created_at desc
            LIMIT 
                20;
        `;
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getYears: async function (user_id) {
        const q = `
            SELECT date_part('year', date) AS year
            FROM transaction
            WHERE user_id = $1
            GROUP BY year
            ORDER BY year DESC;
        `;
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    update: async function (id, transaction) {
        const { name, amount, description, type, category, date, user_id } = transaction;
        const q = `
            UPDATE transaction
            SET name = $1, amount = $2, description = $3, type = $4, category_id = $5, date = $6
            WHERE id = $7 AND user_id = $8;
        `;
        await pool.query(q, [
            name,
            amount,
            description,
            type,
            category,
            new Date(date),
            id,
            user_id,
        ]);
    },

    deleteById: async function (id, user_id) {
        const q = `DELETE FROM transaction WHERE id = $1 AND user_id = $2;`;
        await pool.query(q, [id, user_id]);
    },
};

const category = {
    getAllDynamically: async function (type) {
        let q = `
            SELECT *
            FROM category
        `;
        let params = [];

        if (type && type !== "all") {
            q += ` WHERE type = $1`;
            params.push(type);
        }

        q += ` ORDER BY id;`;

        const res = await pool.query(q, params);
        return res.rows;
    },

    getAllUniqueDynamically: async function (type) {
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

        if (type && type !== "all") {
            q += ` WHERE type = $1`;
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

    getIdByNameOrValue: async function (value) {
        const q = `SELECT id FROM category WHERE name = $1 OR value = $1;`;
        const res = await pool.query(q, [value]);
        return res.rows[0].id;
    },

    getNameById: async function (id) {
        const q = `SELECT name FROM category WHERE id = $1;`;
        const res = await pool.query(q, [id]);
        return res.rows[0].name;
    },

    getTotalAmountPerCategoryDynamically: async function (
        user_id,
        type,
        period
    ) {
        let q = `
            SELECT 
                c.name AS name,
                c.colour AS colour,
                c.icon AS icon,
                COUNT(t.id) AS count,
                SUM(t.amount) AS total,
                c.type AS type
            FROM 
                transaction t
            JOIN 
                category c ON t.category_id = c.id
            WHERE
                t.user_id = $1
        `;
        let params = [user_id];

        if (type && type !== "all") {
            q += ` AND t.type = $${params.length + 1}`;
            params.push(type);
        }

        let { yearQuery, yearPeriod } = utils.getDateForQuery(period, params);
        q += yearQuery;
        if (yearPeriod) {
            params.push(yearPeriod);
        }

        q += ` 
            GROUP BY 
                c.name,
                c.colour,
                c.icon,
                c.type
            ORDER BY 
                total DESC;
        `;

        const res = await pool.query(q, params);
        return res.rows;
    },
};

// Overview statistics for user
const overview = {
    getMonthlyTransactionData: async function (user_id, year) {
        const q = `
            SELECT
                DATE_PART('month', date) AS month,
                SUM(amount) AS total_amount,
                type
            FROM
                transaction
            WHERE
                DATE_PART('year', date) = $2
                AND user_id = $1
            GROUP BY
                DATE_PART('month', date),
                type;
        `;
        const res = await pool.query(q, [user_id, year]);
        return res.rows;
    },

    getIncomeAndExpenseTotals: async function (user_id, month, year) {
        let q = `
            SELECT
                SUM(amount) AS total,
                type
            FROM
                transaction
            WHERE
                user_id = $1
                AND DATE_PART('year', date) = $2
        `;
        let params = [user_id, year];

        if (month !== "0") {
            q += ` AND DATE_PART('month', date) = $${params.length + 1}`;
            params.push(month);
        }

        q += ` GROUP BY type;`;

        const res = await pool.query(q, params);
        return res.rows;
    },

    getTopSpendingCategories: async function (user_id, month, year) {
        let q = `
            SELECT
                c.name,
                c.icon,
                c.colour,
                SUM(amount) AS total_spent
            FROM
                transaction t, category c
            WHERE
                t.category_id = c.id
                AND t.type = 'expense'
                AND user_id = $1
                AND DATE_PART('year', date) = $2
        `;
        let params = [user_id, year];

        if (month !== "0") {
            q += ` AND DATE_PART('month', date) = $${params.length + 1}`;
            params.push(month);
        }

        q += ` 
            GROUP BY
                c.name,
                c.icon,
                c.colour
            ORDER BY
                total_spent DESC
            LIMIT 4;
        `;

        const res = await pool.query(q, params);
        return res.rows;
    },

    getFrequentSpendingCategories: async function (user_id, month, year) {
        let q = `
            SELECT
                c.name,
                c.icon,
                c.colour,
                COUNT(t.id) AS count
            FROM
                transaction t, category c
            WHERE
                t.category_id = c.id
                AND t.type = 'expense'
                AND user_id = $1
                AND DATE_PART('year', date) = $2
        `;
        let params = [user_id, year];

        if (month !== "0") {
            q += ` AND DATE_PART('month', date) = $${params.length + 1}`;
            params.push(month);
        }

        q += ` 
            GROUP BY
                c.name,
                c.icon,
                c.colour
            ORDER BY
                count DESC
            LIMIT 3;
        `;

        const res = await pool.query(q, params);
        return res.rows;
    },
};

const statistics = {
    getCountAndSumOfAmounts: async function (user_id, type) {
        const q = `
            SELECT
                COUNT(id) AS count,
                SUM(amount) AS total
            FROM
                transaction
            WHERE
                user_id = $1
                AND type = $2;    
        `;
        const res = await pool.query(q, [user_id, type]);
        return res.rows[0];
    },

    getMonthlyTransactions: async function (user_id) {
        const q = `
            SELECT
                DATE_PART('month', date) AS month,
                DATE_PART('year', date) AS year,
                SUM(amount) AS total_amount,
                type
            FROM
                transaction
            WHERE
                user_id = $1
            GROUP BY
                DATE_PART('month', date),
                DATE_PART('year', date),
                type
            ORDER BY
                year,
                month;
        `;
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getTotalIncomeAndExpenses: async function (user_id) {
        const q = `
            SELECT
                SUM(amount) AS total,
                type
            FROM
                transaction
            WHERE
                user_id = $1
            GROUP BY
                type;
        `;
        const res = await pool.query(q, [user_id]);
        return res.rows;
    },

    getNumberOfTransactions: async function (user_id) {
        const q = `
            SELECT
                COUNT(id) AS count
            FROM
                transaction
            WHERE
                user_id = $1;
        `;
        const res = await pool.query(q, [user_id]);
        return res.rows[0].count;
    }
};

module.exports = { transaction, category, overview, statistics };
