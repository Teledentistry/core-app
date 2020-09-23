const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Article = require('../models/Article');
const User = require('../models/User');

exports.getArticles = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.createArticle = asyncHandler(async(req, res, next) => {
    if(req.user.id !== req.body.doctor) {
        return next(new ErrorResponse(`your id ${req.user.id} does not match with the logged in user`, 404));
    }
    const article = await Article.create(req.body);
    res.status(200).json({
        success: true,
        data: article
    });
});
