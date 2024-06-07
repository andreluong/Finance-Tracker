const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: ['.env.local', '.env'] })

const PORT = process.env.SERVER_PORT || 8080;

const corsOptions = cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
})

app.use(corsOptions);
app.use(express.urlencoded({extended: true}))
app.use(express.json());

const transactions = require('./routes/transactions.js');
app.use(transactions);

const categories = require('./routes/categories.js');
app.use(categories);

const overview = require('./routes/overview.js');
app.use(overview);

const statistics = require('./routes/statistics.js');
app.use(statistics);

app.listen(PORT, () => {
    console.log('Server is running successfully on port ' + PORT);
});
