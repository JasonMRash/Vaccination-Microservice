const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');
const datastore = ds.datastore;

router.use(bodyParser.json());

const ORGANIZATION = "Organization";
const REQUIREMENT = "Requirement";

/* ------------- Begin Model Functions ------------- */


async function get_requirement(req, id) {
    const key = datastore.key([REQUIREMENT, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity[0] === undefined || entity[0] === null) {
        return entity;
    } else {
        results = entity.map(ds.fromDatastore);
        var self_url = '/requirements/' + results[0].id;
        results[0].self = self_url;
        return results;
    }
}

async function get_requirements(req) {
    var results = {};
    const q = datastore.createQuery(REQUIREMENT);
    return datastore.runQuery(q).then((entities) => {
        results = entities[0].map(ds.fromDatastore);
        for (var i = 0; i < results.length; i++) {
            var self_url = '/requirements/' + results[i].id;
            results[i].self = self_url;
        }
        return {"requirements": results};
    });
}

async function get_organization(req, id) {
    const key = datastore.key([ORGANIZATION, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity[0] === undefined || entity[0] === null) {
        return entity;
    } else {
        results = entity.map(ds.fromDatastore);
        var self_url = '/organizations/' + results[0].id;
        results[0].self = self_url;
        return results;
    }
}

async function get_organizations(req) {
    var results = {};
    const q = datastore.createQuery(ORGANIZATION);
    return datastore.runQuery(q).then((entities) => {
        results = entities[0].map(ds.fromDatastore);
        for (var i = 0; i < results.length; i++) {
            var self_url = '/organization/' + results[i].id;
            results[i].self = self_url;
        }
        return {"organizations": results};
    });
}

async function post_requirement(req, category, days_max, days_min, quantity, type) {
    var key = datastore.key(REQUIREMENT);
    var organization_id = null;
    const new_requirement = {"category": category, "days_max": days_max, "days_min": days_min, "quantity": quantity, "type": type, "organization_id": organization_id};
    await datastore.save({"key": key, "data": new_requirement });
    var self_url = "/requirements/" + key.id;
    return {"id": key.id, "category": category, "days_max": days_max, "days_min": days_min, "quantity": quantity, "type": type, "organization_id": organization_id, "self": self_url};
}

async function remove_requirement_from_organization(organization_id, requirement_id) {
    const key = datastore.key([ORGANIZATION, parseInt(organization_id, 10)]);
    return datastore.get(key).then(async organization => {
        if (organization[0] === undefined || organization[0] === null) {
            return organization;
        }
        else {
            for (var i = 0; i < organization[0].requirements.length; i++) {
                if (organization[0].requirements[i].id == requirement_id) {
                    organization[0].requirements.splice(i, 1);
                    const update_organization = {"name": organization[0].name, "initial_required": organization[0].initial_required, 
                        "num_boosters": organization[0].num_boosters, "requirements": organization[0].requirements, "self": organization[0].self};
                    await datastore.save({"key": key, "data": update_organization});
                }
            }
        }
    });
}

async function remove_owner_from_requirement(requirement_id) {
    const key = datastore.key([REQUIREMENT, parseInt(requirement_id, 10)]);
    return datastore.get(key).then(async requirement => {
        if (requirement[0] === undefined || requirement[0] === null) {
            return requirement;
        }
        else {
            var owner = null;
            const remove_owner = {"category": requirement[0].category, "days_max": requirement[0].days_max,
                "days_min": requirement[0].days_min, "quantity": requirement[0].quantity, "type": requirement[0].type, 
                "organization_id": owner};
            return await datastore.save({"key": key, "data": remove_owner});
        }
    });
}

async function delete_requirement(req, id) {
    const key = datastore.key([REQUIREMENT, parseInt(id, 10)]);
    return datastore.delete(key);
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

router.get('/', function (req, res) {
    get_requirements(req)
    .then(requirement => {
        res.status(200).json(requirement);
    });
});

router.post('/', function (req, res) {
    if (req.body.category === undefined || req.body.category === null ||
    req.body.days_max === undefined || req.body.days_max === null ||
    req.body.days_min === undefined || req.body.days_min === null ||
    req.body.quantity === undefined || req.body.quantity === null ||
    req.body.type === undefined || req.body.type === null) {
        res.status(400).json({'Error': 'The request object is missing at least one of the required attributes'});
    }
    else {
        post_requirement(req, req.body.category, req.body.days_max, req.body.days_min, req.body.quantity, req.body.type)
        .then(requirement => {
            res.status(201).json(requirement);
        })
    }
});

router.delete('/:id', function (req, res) {
    get_requirement(req, req.params.id)
    .then(async requirement => {
        if (requirement[0] === undefined || requirement[0] === null) {
            res.status(404).json({'Error': 'No requirement with this requirement ID exists'});
        } else {
            get_organizations(req).then (async organizations => {
                for (var i = 0; i < organizations.organizations.length; i++) {
                    for (var j = 0; j < organizations.organizations[i].requirements.length; j++) {
                        if (organizations.organizations[i].requirements[j] === undefined || organizations.organizations[i].requirements[j] === null) {

                        }
                        else {
                            if (organizations.organizations[i].requirements[j].id == req.params.id) {
                                await remove_requirement_from_organization(organizations.organizations[i].id, req.params.id);
                            }
                        }
                    }
                }
            })
            await delete_requirement(req, req.params.id).then(res.status(204).end());
        }
    })
})

router.delete('/:requirement_id/organizations/:organization_id', function (req, res) {
    get_organization(req, req.params.organization_id)
    .then(async organization => {
        if (organization[0] === undefined || organization[0] === null) {
            res.status(404).json({'Error': 'No organization with this organization ID exists'});
        } else {
            get_requirement(req, req.params.requirement_id)
            .then(async requirement => {
                if (requirement[0] === undefined || requirement[0] === null) {
                    res.status(404).json({'Error': 'No requirement with this requirement ID exists'});
                } else {
                    for (var i = 0; i < organization[0].requirements.length; i++)
                    {
                        if (organization[0].requirements[i] === undefined || organization[0].requirements[i] === null) {

                        }
                        else {
                            if (organization[0].requirements[i].id == req.params.requirement_id) {
                                await remove_requirement_from_organization(req.params.organization_id, req.params.requirement_id);
                                await remove_owner_from_requirement(req.params.requirement_id);
                                res.status(204).end();
                            }
                        }
                    }
                    res.status(404).json({'Error': 'Requirement is not associated with this organization'});
                }
            });
        }
    });
})

/* ------------- End Controller Functions ------------- */

module.exports = router;