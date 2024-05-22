const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const corsOptions = cors({
    origin: ['*', 'http://localhost:3000']
})

app.use(corsOptions);
app.use(express.urlencoded({extended: true}))
app.use(express.json());

const sql = require('./db.js');

// app.post("/api/transactions/create", async (req, res) => {
//     try {
//         const {amount, name, description, type, date, user_id} = req.body;

//         console.log(req.body)

//         const transaction = await sql`
//             INSERT INTO transaction (created_at, amount, name, description, type, category_id, date, user_id)
//             VALUES (default, ${amount}, ${name}, ${description}, ${type}, NULL, ${new Date(date)}, ${user_id})
//         `

//         console.log(transaction);
//         res.status(201).json({message: "Transaction created"});
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({error: "Something went wrong with transaction creation"});
//     }
// })



app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
