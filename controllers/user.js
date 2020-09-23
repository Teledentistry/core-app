const asyncHandler = require('../middleware/async');
const User = require('../models/User');

exports.getAllPatients = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
