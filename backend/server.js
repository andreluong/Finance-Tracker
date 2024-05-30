const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: ['.env.local', '.env'] })

const corsOptions = cors({
    origin: process.env.CLIENT_URL,
    credentials: true
})

app.use(corsOptions);
app.use(express.urlencoded({extended: true}))
app.use(express.json());

const transactions = require('./transactions/transactions.js');
app.use(transactions);

const categories = require('./categories/categories.js');
app.use(categories);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
