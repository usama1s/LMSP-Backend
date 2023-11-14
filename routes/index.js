const express = require('express');
const authRoute = require('./auth.routes');
const adminRoute = require('./admin.routes');
const generalRoute = require('./general.routes');
const instructorRoute = require('./instructor.routes');



const router = express.Router();

router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/instructor', instructorRoute);
router.use('/general', generalRoute);



module.exports = router;
