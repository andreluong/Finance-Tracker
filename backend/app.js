const express = require("express");
const app = express();
const cors = require("cors");
const { initializeRedisClient } = require("./database/redis");
require("dotenv").config({ path: [".env.local", ".env", ".env.test"] });

const corsOptions = cors({
    origin: [process.env.CLIENT_URL, "https://keen-hawk-89.clerk.accounts.dev"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-HTTP-Method-Override",
        "Accept",
    ],
});

app.use(corsOptions);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initializeRedisClient();

const transactions = require("./routes/transactions.js");
app.use(transactions);

const categories = require("./routes/categories.js");
app.use(categories);

const overview = require("./routes/overview.js");
app.use(overview);

const statistics = require("./routes/statistics.js");
app.use(statistics);

module.exports = app;