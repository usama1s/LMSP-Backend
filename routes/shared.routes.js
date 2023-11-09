const express = require('express');
const router = express.Router();
const sharedController = require('../controllers/shared.controller');



router.get('/uploads/:filename', sharedController.serveFile);

module.exports = router;
