const router = module.exports = require('express').Router();

router.use('/organizations', require('./organizations'));
router.use('/requirements', require ('./requirements'));
