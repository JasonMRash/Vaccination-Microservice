const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');
const datastore = ds.datastore;

router.use(bodyParser.json());

const ORGANIZATIONS = "ORGANIZATIONS";
const REQUIREMENTS = "REQUIREMENTS";

/* ------------- Begin Model Functions ------------- */

async function get_requirement(req, id) {
    const key = datastore.key([REQUIREMENTS, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity === undefined || entity[0] === null) {
        return entity;
    } else {
        return entity.map(ds.fromDatastore);
    }
}

async function get_requirements(req) {
    var results = {};
    const q = datastore.createQuery(REQUIREMENTS);
    return datastore.runQuery(q).then((entities) => {
        results = entities[0].map(ds.fromDatastore);
        for (var i = 0; i < results.length; i++) {
            var self_url = '/requirements/' + results[i].id;
            results[i].self = self_url;
        }
        return {"requirements": results};
    });
}

function post_requirement(req, days_max, days_min, quantity, type) {
    var key = datastore.key(REQUIREMENTS);
    var organization_id = null;
    const new_requirement = {"days_max": days_max, "days_min": days_min, "quantity": quantity, "type": type, "organization_id": organization_id};
    return datastore.save({"key":key, "data":new_requirement}.then(() => {
        var self_url = "/requirements/" + key.id;
        return {"id": key.id, "max_days": max_days, "min_days": min_days, "quantity": quantity, "type": type, "organization_id": organization_id, "self": self_url};
    }));
}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

router.get('/:id', function (req, res) {
    get_requirement(req, req.params.id)
    .then(requirement => {
        if (requirement[0] === undefined || requirement[0] === null) {
            res.status(404).json({'Error': 'No requirement with this requirement ID exists'});
        } else {
            res.status(200).json(requirement[0]);
        }
    });
});

router.post('/:id', function (req, res) {
    if (req.body.days_max === undefined || req.body.days_max === null ||
        req.body.days_min === undefined || req.body.days_min === null ||
        req.body.quantity === undefined || req.body.quantity === null ||
        req.body.type === undefined || req.body.type === null) {
            res.status(400).json({'Error': 'The request object is missing at least one of the required attributes'});
    }
    else {
        post_requirement(req, req.body.days_max, req.body.days_min, req.body.quantity, req.body.type)
        .then(requirement => {
            res.status(201).send(requirement);
        });
    }
});

/* ------------- End Controller Functions ------------- */

module.exports = router;