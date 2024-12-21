const pool = require("./pool");
const utils = require("./utils");

// Return all categories based on type
const getAll = async function (type) {
    let q = `
        SELECT *
        FROM category
    `;
    let params = [];

    // Add type
    if (type && type !== "all") {
        q += ` WHERE type = $1`;
        params.push(type);
    }

    q += ` ORDER BY id;`;

    const res = await pool.query(q, params);
    return res.rows;
}

// Return all unique categories based on type
// Separates miscellaneous
const getAllUnique = async function (type) {
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

    // Add type
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
}

// Returns a category id based on name or value
// Example: Name = "Food & Drink", Value = "foodAndDrink"
const getIdByNameOrValue = async function (value) {
    const q = `SELECT id FROM category WHERE name = $1 OR value = $1;`;
    const res = await pool.query(q, [value]);
    return res.rows[0].id;
}

const getNameById = async function (id) {
    const q = `SELECT name FROM category WHERE id = $1;`;
    const res = await pool.query(q, [id]);
    return res.rows[0].name;
}

// Get total amount and info for each category based on type and period
// Returns all categories, even if they have no transactions
const getTotalAmountForAllCategories = async function (user_id, type, month, year) {
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
}

// Get total amount and info for each category based on type and period
// Returns only categories with transactions
const getTotalAmountPerCategory = async function (
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
}

module.exports = {
    getAll,
    getAllUnique,
    getIdByNameOrValue,
    getNameById,
    getTotalAmountForAllCategories,
    getTotalAmountPerCategory,
};