const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: ['.env.local', '.env'] })

const corsOptions = cors({
    origin: ['http://localhost:3000']
})

app.use(corsOptions);
app.use(express.urlencoded({extended: true}))
app.use(express.json());



const database = require('./database/db.js');

app.get('/api/users', async (req, res) => {
    try {
        res.status(200).json(database.getAllUsers(req, res));
    } catch (err) {
        console.error(err.message);
    }
});


const transactions = require('./transactions/transactions.js');
app.use(transactions);



app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
