const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');
const datastore = ds.datastore;

router.use(bodyParser.json());

const ORGANIZATIONS = "ORGANIZATIONS";
const REQUIREMENTS = "REQUIREMENTS";

/* ------------- Begin Model Functions ------------- */

async function get_requirements(req, id) {
    const key = datastore.key([REQUIREMENTS, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity === undefined || entity[0] === null) {
        return entity;
    } else {
        return entity.map(ds.fromDatastore);
    }
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */



/* ------------- End Controller Functions ------------- */

module.exports = router;