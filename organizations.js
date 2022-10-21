const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');
const datastore = ds.datastore;

router.use(bodyParser.json());

const ORGANIZATIONS = "ORGANIZATIONS";
const REQUIREMENTS = "REQUIREMENTS";

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

// GET organizations/:id
router.get('/:id', function (req, res) {
    get_organization(req, req.params.id)
        .then(organization => {
            if (organization[0] === undefined || organization[0] === null) {
                return res.status(404).json({ 'Error': 'No organization with this organization ID exists' });
            } else {
                get_requirements(req, req.params.id)
                    .then (requirements => {
                        if (requirements[0] === undefined || requirements[0] === null) {
                            array.forEach(element => {
                                organization[0].requirements.push(element)
                            });
                        }
                    })
                return res.status(200).json(organization[0]);
            }
        });
});

/* ------------- End Controller Functions ------------- */

module.exports = router;