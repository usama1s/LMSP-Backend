const express = require('express');
const authRoute = require('./auth.routes');
const adminRoute = require('./admin.routes');


const router = express.Router();

router.use('/auth', authRoute);
router.use('/admin', adminRoute);


module.exports = router;
