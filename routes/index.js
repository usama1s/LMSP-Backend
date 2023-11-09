const express = require('express');
const authRoute = require('./auth.routes');
const adminRoute = require('./admin.routes');
const sharedRoute = require('./shared.routes');


const router = express.Router();

router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/shared', sharedRoute);



module.exports = router;
