const express = require('express');
const {getAllPatients} = require('../controllers/user');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');
const {protect} = require('../middleware/auth');

const router = express.Router({mergeParams: true});

router.route('/')
    .get(protect, advancedResults(User), getAllPatients);

module.exports = router;
