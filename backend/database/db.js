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

    // Get total amount and info for each category based on type and period
    // Returns all categories, even if they have no transactions
    getTotalAmountForAllCategories: async function (user_id, type, month, year) {
        const q = `
            SELECT
                c.id,
                c.name,
                c.type,
                COALESCE(SUM(t.amount), 0) AS total
            FROM
                category c
                LEFT join transaction t ON c.id = t.category_id
                    AND t.user_id = $1
                    AND DATE_PART('month', t.date) = $3
                    AND DATE_PART('year', t.date) = $4
            WHERE
                c.type = $2
            GROUP BY
                c.id,
                c.name,
                c.type;
        `;
        const res = await pool.query(q, [user_id, type, month, year]);
        return res.rows;
    },

    // Get total amount and info for each category based on type and period
    // Returns only categories with transactions
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
    // Get monthly transaction data for user based on year and type
    // If no transaction data is found, returns 0 and a null type
    getMonthlyTransactionData: async function (user_id, year, type) {
        const q = `
            WITH months AS (
                SELECT generate_series(1, 12) AS month
            )
            SELECT
                months.month,
                COALESCE(SUM(amount), 0) AS amount,
                type
            FROM
                months
            LEFT JOIN transaction ON months.month = DATE_PART('month', date)
                AND user_id = $1
                AND DATE_PART('year', date) = $2
                AND type = $3
            GROUP BY
                months.month,
                type
            ORDER BY
                months.month ASC;
        `;
        const res = await pool.query(q, [user_id, year, type]);
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
                SUM(amount) AS total,
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
                total DESC
            LIMIT 3;
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
                SUM(amount) AS total,
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
                count DESC,
                total DESC
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

const budget = {
    // Create budget table for month and year
    createBudgetTable: async function (user_id, month, year) {
        const q = `
            INSERT INTO budget (year, month, user_id)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const res = await pool.query(q, [year, month, user_id]);
        return res.rows[0].id;
    },

    // Get id of budget table for month and year
    getBudgetTable: async function (user_id, month, year) {
        const q = `
            SELECT
                id
            FROM
                budget
            WHERE
                user_id = $1
                AND month = $2
                AND year = $3;
        `;
        const res = await pool.query(q, [user_id, month, year]);
        return res.rows[0]?.id || null;
    },

    // Get budget targets for each category based on month and year
    getBudgetTargets: async function (user_id, month, year) {
        const q = `
            SELECT
                c.name as category_name,
                c.id as category_id,
                c.type as category_type,
                bi.target as target
            FROM
                category c
                INNER JOIN budget b ON b.user_id = $1
                    AND b.month = $2
                    AND b.year = $3
                INNER JOIN budget_item bi ON bi.budget_id = b.id
                    AND bi.category_id = c.id;
        `;
        const res = await pool.query(q, [user_id, month, year]);
        return res.rows;
    },

    // Get total amount of budget target for each type based on month and year
    getBudgetTargetsTotalAmount: async function (user_id, month, year) {
        const q = `
            SELECT
                c.type,
                COALESCE(SUM(bi.target), 0) as total_target
            FROM
                category c
                INNER JOIN budget b ON b.user_id = $1
                    AND b.month = $2
                    AND b.year = $3
                INNER JOIN budget_item bi ON bi.budget_id = b.id
                    AND bi.category_id = c.id
            GROUP by
                c.type;
        `;
        const res = await pool.query(q, [user_id, month, year]);
        return res.rows;
    },

    // Return all categories with optional amount and budget-targets based on month and year
    getBudgetData: async function (user_id, month, year) {
        const q = `
            SELECT
                $3 AS year,
                $2 AS month,
                c.name,
                c.id,
                COALESCE(SUM(t.amount), 0) AS total,
                COALESCE(bi.target, 0) AS target,
                c.type
            FROM
                category c
                LEFT JOIN transaction t ON c.id = t.category_id
                    AND t.user_id = $1
                    AND DATE_PART('month', t.date) = $2
                    AND DATE_PART('year', t.date) = $3
                LEFT JOIN budget b ON b.user_id = $1
                    AND b.month = $2
                    AND b.year = $3
                LEFT JOIN budget_item bi ON bi.budget_id = b.id
                    AND bi.category_id = c.id
            GROUP BY
                c.name,
                c.id,
                bi.target,
                c.type;
        `;
        const res = await pool.query(q, [user_id, month, year]);
        return res.rows;
    },

    // Update budget items data
    updateBudgetItems: async function (user_id, budget_id, data) {
        const q = `
            INSERT INTO budget_item (budget_id, category_id, target, user_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (budget_id, category_id, user_id)
            DO UPDATE SET target = EXCLUDED.target;
        `;
        for (const key in data) {
            if (data[key] === 0) continue;
            await pool.query(q, [budget_id, key, data[key], user_id]);
        }
    }
}

module.exports = { transaction, category, overview, statistics, budget };
