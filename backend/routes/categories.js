require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

router.get("/api/categories/all", categoriesController.getAllCategories);

router.get("/api/categories/unique", categoriesController.getAllUniqueCategories);

module.exports = router;
