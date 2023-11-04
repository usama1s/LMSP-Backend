const express = require('express');
const authRoute = require('./auth.routes');

const router = express.Router();

router.use('/auth', authRoute);

module.exports = router;
