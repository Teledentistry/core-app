const express = require("express");
const {getArticles, createArticle} = require("../controllers/article");
const { authorize, protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Article = require("../models/Article");

const router = express.Router();

router.route('/')
    .get(advancedResults(Article), getArticles)
    .post(protect, authorize("doctor", "admin"), createArticle)

module.exports = router;
