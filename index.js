const router = module.exports = require('express').Router();

const ORGANIZATIONS = "ORGANIZATIONS";
const REQUIREMENTS = "REQUIREMENTS";
router.use('/organizations', require('./organizations'));
