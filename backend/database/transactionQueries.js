const pool = require("./pool");
const utils = require("./utils");

const create = async function (transaction) {
    const { name, amount, description, type, category, date, user_id } = transaction;
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
}

const getById = async function (id, user_id) {
    const q = `SELECT * FROM transaction WHERE id = $1 AND user_id = $2`;
    const res = await pool.query(q, [id, user_id]);
    return res.rows[0];
}

// Returns all transactions based on the period
const getAll = async function (user_id, period) {
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

    // Add period
    let { yearQuery, yearPeriod } = utils.getDateForQuery(period, params);
    q += yearQuery;
    if (yearPeriod) {
        params.push(yearPeriod);
    }

    q += ` ORDER BY date DESC;`;

    const res = await pool.query(q, params);
    return res.rows;
}

// Returns the sum of all transactions based on the type and period
const getSumOfAmounts = async function (user_id, type, period) {
    let q = `
        SELECT SUM(amount)
        FROM transaction
        WHERE user_id = $1
    `;
    let params = [user_id];

    // Add transaction type
    if (type && type !== "all") {
        q += ` AND type = $${params.length + 1}`;
        params.push(type);
    }

    // Add period
    let { yearQuery, yearPeriod } = utils.getDateForQuery(period, params);
    q += yearQuery;
    if (yearPeriod) {
        params.push(yearPeriod);
    }

    const res = await pool.query(q, params);
    return res.rows[0].sum;
}

// Return the 20 most recent transactions
const getRecent = async function (user_id) {
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
}

// Return all years relevant to a user's transactions
const getYears = async function (user_id) {
    const q = `
        SELECT date_part('year', date) AS year
        FROM transaction
        WHERE user_id = $1
        GROUP BY year
        ORDER BY year DESC;
    `;
    const res = await pool.query(q, [user_id]);
    return res.rows;
}

const update = async function (id, transaction) {
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
}

const deleteById = async function (id, user_id) {
    const q = `DELETE FROM transaction WHERE id = $1 AND user_id = $2;`;
    await pool.query(q, [id, user_id]);
}

module.exports = {
    create,
    getById,
    getAll,
    getSumOfAmounts,
    getRecent,
    getYears,
    update,
    deleteById
};