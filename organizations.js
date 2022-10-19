const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');
const datastore = ds.datastore;

router.use(bodyParser.json());

/* ------------- Begin Model Functions ------------- */

async function get_organization(req, id) {
    const key = datastore.key([ORGANIZATIONS, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity === undefined || entity[0] === null) {
        return entity;
    } else {
        return entity.map(ds.fromDatastore);
    }
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

// GET organizations/:id
router.get('/:id', function (req, res) {
    if(req.get('Accept') !== 'application/json'){
        return res.status(406).json({'Error': 'Accepts type is Not Acceptable. Must be application/json.'});
    }
    get_organization(req, req.params.id)
        .then(organization => {
            if (organization[0] === undefined || organization[0] === null) {
                return res.status(404).json({ 'Error': 'No issue with this issue_id exists' });
            } else {
                return res.status(200).json(organization[0]);
            }
        });
});

/* ------------- End Controller Functions ------------- */

module.exports = router;